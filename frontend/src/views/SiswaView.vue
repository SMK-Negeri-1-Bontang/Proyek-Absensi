<script setup>
import DashboardBg from "@/components/DashboardBg.vue";
import DashboardFooter from "@/components/DashboardFooter.vue";
import DashboardName from "@/components/DashboardName.vue";
import DashboardNavBar from "@/components/DashboardNavBar.vue";
import DeleteModal from "@/components/DeleteModal.vue";
import axios from "axios";
import { onMounted, reactive, watch } from "vue";

axios.defaults.withCredentials = true;

const data = reactive({
  siswa: [],
  jurusan: [],
});
const form = reactive({
  isEditing: false,
  id: "",
  nama: "",
  nis: "",
  kelas: 0,
  absen: 0,
  subdivisi_jurusan: "tidak ada",
  id_jurusan: 0,
});
const filter = reactive({
  search: { content: "", focus: false },
  kelas: [1, 2, 3, 4],
  hari: {
    content: [1, 2, 3, 4, 5],
    active: false,
  },
  jurusan: 0,
  subdivisi: "",
  keterangan: "",
});
const confirmDelete = reactive({
  confirming: false,
  id: "",
});

onMounted(async () => {
  try {
    const response = await axios.get("/api/siswa");
    data.siswa = response.data;
  } catch (error) {
    console.error(error);
  }

  try {
    const response = await axios.get("/api/jurusan");
    data.jurusan = response.data;
  } catch (error) {
    console.error(error);
  }
});

function toggleEditModal(siswa) {
  form.isEditing = true;
  form.id = siswa.id;
  form.nama = siswa.nama;
  form.nis = siswa.nis;
  form.kelas = siswa.kelas;
  form.absen = siswa.absen;
  form.subdivisi_jurusan = siswa.subdivisi_jurusan;
  form.id_jurusan = siswa.id_jurusan;

  console.log(form);
}
function cancelEditModal() {
  form.isEditing = false;
  form.id = "";
  form.nama = "";
  form.nis = "";
  form.kelas = 0;
  form.absen = 0;
  form.subdivisi_jurusan = "tidak ada";
  form.id_jurusan = 0;
}
function toggleDeleteModal(id) {
  confirmDelete.confirming = true;
  confirmDelete.id = id;
}
function cancelDelete() {
  confirmDelete.confirming = false;
  confirmDelete.id = "";
}
async function updateSiswa() {
  try {
    const response = await axios.put("/api/siswa", form);
    cancelEditModal();
    refreshSiswa();
  } catch (error) {
    console.error(error);
  }
}
async function searchFilter(socket) {
  if (filter.search.content.trim()) {
    const filteredSiswa = socket.filter(
      (siswa) =>
        siswa.nama
          .toLowerCase()
          .includes(filter.search.content.trim().toLowerCase()) ||
        siswa.nis.includes(filter.search.content.trim()) ||
        data.jurusan
          .find((jurusan) => Number(jurusan.id) === Number(siswa.id_jurusan))
          .nama.toLowerCase()
          .includes(filter.search.content.trim().toLowerCase())
    );

    return filteredSiswa;
  } else {
    return socket;
  }
}
async function fetchSiswa(condition = "") {
  try {
    const response = await axios.get(`/api/siswa${condition}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
async function deleteSiswa(id) {
  try {
    await axios.delete("/api/siswa", { data: { id } });
    cancelDelete();
    refreshSiswa();
  } catch (error) {
    console.error(error);
  }
}
async function refreshSiswa() {
  const siswa = await fetchSiswa();
  data.siswa = siswa;
}

watch(filter, async (newVal) => {
  let socket = await fetchSiswa();

  socket = await searchFilter(socket);

  if (filter.jurusan) {
    const filteredSiswa = socket.filter(
      (siswa) => Number(siswa.id_jurusan) === Number(filter.jurusan)
    );
    socket = filteredSiswa;
  }

  if (filter.subdivisi && [1, 2].includes(filter.jurusan)) {
    const filteredSiswa = socket.filter(
      (siswa) => siswa.subdivisi_jurusan === filter.subdivisi
    );
    socket = filteredSiswa;
  }

  if (filter.kelas && socket /*data.absensi*/) {
    const filteredSiswa = socket.filter((siswa) =>
      filter.kelas.includes(siswa.kelas)
    );
    socket = filteredSiswa;
  }

  console.log(data.siswa);

  data.siswa = socket;
});
watch(
  () => form.id_jurusan,
  (newVal) => {
    if (
      newVal !== 1 &&
      newVal !== 2 &&
      form.subdivisi_jurusan !== "tidak ada"
    ) {
      form.subdivisi_jurusan = "tidak ada";
    } else {
      form.subdivisi_jurusan = "A";
    }
  }
);
</script>

<template>
  <DashboardBg>
    <DashboardName
      class="grid grid-cols-5 gap-6 mt-2 px-[50px] pt-[20px] pb-[24px]"
    >
      <div class="col-span-2">
        <label for="search" class="block mb-2 font-medium text-xl"
          >Search:</label
        >
        <input
          type="text"
          id="search"
          placeholder="Type here"
          name="search"
          v-model="filter.search.content"
          @focus="filter.search.focus = true"
          @blur="filter.search.focus = false"
          class="input input-bordered input-primary w-full border-4 bg-gray-800"
        />

        <div class="flex flex-wrap gap-4 mt-4" v-if="filter.hari.active">
          <div
            class="form-control"
            v-for="(day, index) in [
              {
                label: 'S',
                value: 1,
              },
              {
                label: 'S',
                value: 2,
              },
              {
                label: 'R',
                value: 3,
              },
              {
                label: 'K',
                value: 4,
              },
              {
                label: 'J',
                value: 5,
              },
            ]"
            :key="index"
          >
            <label class="label cursor-pointer">
              <span class="label-text">{{ day.label }}</span>
              <input
                type="checkbox"
                v-model="filter.hari.content"
                :value="day.value"
                class="checkbox checkbox-primary"
              />
            </label>
          </div>
        </div>
      </div>

      <div class="col-span-2">
        <label for="jurusan" class="block mb-2 font-medium text-xl"
          >Jurusan:</label
        >
        <select
          id="jurusan"
          v-model.number="filter.jurusan"
          class="select select-primary w-full bg-gray-800 mb-2 border-4"
        >
          <option
            v-for="jurusan in data.jurusan"
            :key="jurusan.id"
            :value="jurusan.id"
          >
            {{ jurusan.nama }}
          </option>
          <option :value="0">All</option>
        </select>

        <div
          v-if="filter.jurusan === 1 || filter.jurusan === 2"
          class="flex items-center space-x-4 mt-2"
        >
          <label class="text-white lexend flex items-center space-x-1">
            <input
              type="radio"
              id="filter-subdivisi-a"
              value="A"
              v-model="filter.subdivisi"
              class="radio radio-primary border-4"
            />
            <span>A</span>
          </label>

          <label class="text-white lexend flex items-center space-x-1">
            <input
              type="radio"
              id="filter-subdivisi-b"
              value="B"
              v-model="filter.subdivisi"
              class="radio radio-primary border-4"
            />
            <span>B</span>
          </label>
        </div>
      </div>

      <div class="col-span-1">
        <label class="block mb-2 font-medium text-xl">Kelas:</label>
        <div class="flex flex-wrap gap-4">
          <div class="form-control" v-for="n in [1, 2, 3, 4]" :key="n">
            <label class="label cursor-pointer">
              <span class="label-text">{{
                ["X", "XI", "XII", "XIII"][n - 1]
              }}</span>
              <input
                type="checkbox"
                v-model="filter.kelas"
                :value="n"
                class="checkbox checkbox-primary"
              />
            </label>
          </div>
        </div>
      </div>
    </DashboardName>

    <DashboardNavBar currentWindow="siswa" />

    <div v-if="data && data.siswa.length" class="grid grid-cols-2 gap-6">
      <div v-for="siswa in data.siswa" :key="siswa.id">
        <div
          class="card lg:card-side bg-gray-800 shadow-sm h-[300px] transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700"
        >
          <figure class="flex-shrink-0">
            <img
              src="@/components/images/pfp.jpg"
              alt="Album"
              class="h-32 w-32 object-cover"
            />
          </figure>

          <!-- INFO -->
          <div class="">
            <div class="card-body p-6 lg:p-12">
              <h1 class="cursor-default text-3xl text-white">
                {{ siswa.nama }}
              </h1>
              <p class="cursor-default text-gray-200 text-[16px]">
                {{
                  data.jurusan.find(
                    (jurusan) => jurusan.id === siswa.id_jurusan
                  )?.nama || "jurusan dihapus"
                }}
                <span v-if="siswa.subdivisi_jurusan !== 'tidak ada'">
                  {{ siswa.subdivisi_jurusan }}
                </span>
              </p>
              <p class="cursor-default text-gray-300 text-[16px]">
                {{ siswa.nis }}
              </p>
              <p class="cursor-default text-gray-400">
                Kelas: {{ siswa.kelas }}. Absen: {{ siswa.absen }}
              </p>

              <p
                class="cursor-pointer w-[30px]"
                @click="toggleEditModal(siswa)"
              >
                Edit
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT -->
    <div v-if="form.isEditing">
      <div
        class="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-50"
      ></div>
      <div class="fixed inset-0 flex items-center justify-center z-50">
        <div
          class="bg-gray-800 p-8 rounded-xl shadow-lg w-[450px] border-4 border-indigo-700"
        >
          <h1 class="text-white text-center text-4xl my-5">Edit siswa</h1>

          <form
            @submit.prevent="updateSiswa"
            class="space-y-4 max-w-lg mx-auto text-white"
          >
            <div>
              <label class="block mb-1 text-white lexend">Nama</label>
              <input
                v-model="form.nama"
                type="text"
                placeholder="Nama"
                class="input input-bordered input-primary w-full border-4 bg-gray-800 lexend"
                required
              />
            </div>

            <div>
              <label class="block mb-1 text-white lexend">NIS</label>
              <input
                v-model="form.nis"
                type="text"
                placeholder="NIS"
                class="input input-bordered input-primary w-full border-4 bg-gray-800 lexend"
                required
              />
            </div>

            <div>
              <label class="block mb-1 text-white lexend">Kelas</label>
              <select
                v-model.number="form.kelas"
                class="select select-bordered select-primary w-full border-4 bg-gray-800 lexend"
                required
              >
                <option disabled value="">Pilih Kelas</option>
                <option :value="1">1</option>
                <option :value="2">2</option>
                <option :value="3">3</option>
                <option :value="4">4</option>
              </select>
            </div>

            <div>
              <label class="block mb-1 text-white lexend">Absen</label>
              <select
                v-model.number="form.absen"
                class="select select-bordered select-primary w-full border-4 bg-gray-800 lexend"
                required
              >
                <option disabled value="">Pilih Absen</option>
                <option v-for="n in 40" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>

            <div>
              <label for="jurusan" class="block mb-1 text-white lexend"
                >Jurusan</label
              >
              <select
                id="jurusan"
                v-model.number="form.id_jurusan"
                class="select select-bordered select-primary w-full border-4 bg-gray-800 lexend"
                required
              >
                <option disabled value="">Pilih Jurusan</option>
                <option
                  v-for="jurusan in data.jurusan"
                  :key="jurusan.id"
                  :value="jurusan.id"
                >
                  {{ jurusan.nama }}
                </option>
              </select>
            </div>

            <div
              v-if="form.id_jurusan === 1 || form.id_jurusan === 2"
              class="mt-2"
            >
              <label class="block mb-1 text-white lexend"
                >Subdivisi Jurusan</label
              >
              <div class="flex items-center space-x-4">
                <label class="text-white lexend">
                  <input
                    type="radio"
                    value="A"
                    v-model="form.subdivisi_jurusan"
                    class="radio radio-primary border-4 mr-1"
                  />
                  A
                </label>
                <label class="text-white lexend">
                  <input
                    type="radio"
                    value="B"
                    v-model="form.subdivisi_jurusan"
                    class="radio radio-primary border-4 mr-1"
                  />
                  B
                </label>
              </div>
            </div>

            <div class="flex justify-between mt-6 gap-4">
              <button
                type="submit"
                class="bg-blue-500 hover:bg-blue-700 px-6 py-2 rounded flex-1 lexend"
              >
                Update
              </button>
              <button
                type="button"
                class="bg-gray-400 hover:bg-gray-500 px-6 py-2 rounded flex-1 lexend"
                @click="cancelEditModal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="bg-red-500 hover:bg-red-700 px-6 py-2 rounded flex-1 lexend"
                @click="toggleDeleteModal(form.id)"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <DeleteModal v-if="confirmDelete.confirming">
      Apakah anda ingin menghapus data siswa ini?
      <template #buttons>
        <button
          class="cursor-pointer px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 lexend"
          @click="cancelDelete"
        >
          Cancel
        </button>
        <button
          class="cursor-pointer px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 lexend"
          @click="deleteSiswa(confirmDelete.id)"
        >
          Delete
        </button>
      </template>
    </DeleteModal>
  </DashboardBg>

  <DashboardFooter />
</template>
