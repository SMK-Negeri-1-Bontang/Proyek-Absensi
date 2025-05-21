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
  guru: [],
});
const form = reactive({
  isEditing: false,
  id: "",
  nama: "",
  nip: "",
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
    const response = await axios.get("/api/guru");
    data.guru = response.data;
  } catch (error) {
    console.error(error);
  }
});

function toggleEditModal(guru) {
  form.isEditing = true;
  form.id = guru.id;
  form.nama = guru.nama;
  form.nip = guru.nip;
}
function cancelEditModal() {
  form.isEditing = false;
  form.id = "";
  form.nama = "";
  form.nip = "";
}
function toggleDeleteModal(id) {
  confirmDelete.confirming = true;
  confirmDelete.id = id;
}
function cancelDelete() {
  confirmDelete.confirming = false;
  confirmDelete.id = "";
}
async function updateGuru() {
  try {
    const response = await axios.put("/api/guru", form);
    cancelEditModal();
    refreshGuru();
  } catch (error) {
    console.error(error);
  }
}
async function searchFilter(socket) {
  if (filter.search.content.trim()) {
    const filteredGuru = socket.filter(
      (guru) =>
        guru.nama
          .toLowerCase()
          .includes(filter.search.content.trim().toLowerCase()) ||
        guru.nip.includes(filter.search.content.trim())
    );

    return filteredGuru;
  } else {
    return socket;
  }
}
async function fetchGuru(condition = "") {
  try {
    const response = await axios.get(`/api/guru${condition}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
async function deleteGuru(id) {
  try {
    await axios.delete("/api/guru", { data: { id } });
    cancelEditModal();
    cancelDelete();
    refreshGuru();
  } catch (error) {
    console.error(error);
  }
}
async function refreshGuru() {
  const guru = await fetchGuru();
  data.guru = guru;
}

watch(filter, async (newVal) => {
  let socket = await fetchGuru();

  socket = await searchFilter(socket);

  data.guru = socket;
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
    <DashboardName class="mt-2 mb-2 px-[50px] pt-[20px] pb-[24px]">
      <div class="w-full">
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
    </DashboardName>

    <DashboardNavBar currentWindow="guru" />

    <div v-if="data && data.guru.length" class="grid grid-cols-2 gap-6">
      <div v-for="guru in data.guru" :key="guru.id">
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
                {{ guru.nama }}
              </h1>
              <p class="cursor-default text-gray-300 text-[16px]">
                {{ guru.nip }}
              </p>

              <p class="cursor-pointer w-[30px]" @click="toggleEditModal(guru)">
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
          <h1 class="text-white text-center text-4xl my-5">Edit guru</h1>

          <form
            @submit.prevent="updateGuru"
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
              <label class="block mb-1 text-white lexend">NIP</label>
              <input
                v-model="form.nip"
                type="text"
                placeholder="NIP"
                class="input input-bordered input-primary w-full border-4 bg-gray-800 lexend"
                required
              />
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
          @click="deleteGuru(confirmDelete.id)"
        >
          Delete
        </button>
      </template>
    </DeleteModal>
  </DashboardBg>

  <DashboardFooter />
</template>
