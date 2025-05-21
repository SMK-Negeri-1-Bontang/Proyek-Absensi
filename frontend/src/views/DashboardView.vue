<script setup>
import axios from "axios";
import { onMounted, reactive, watch, ref } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import router from "@/router";
import { RouterLink } from "vue-router";
import DashboardNavBar from "@/components/DashboardNavBar.vue";
import DashboardFooter from "@/components/DashboardFooter.vue";
import DashboardBg from "@/components/DashboardBg.vue";
import DashboardName from "@/components/DashboardName.vue";
import DeleteModal from "@/components/DeleteModal.vue";

axios.defaults.withCredentials = true;

const sessionData = ref([]);
const userData = ref([]);
const statusColors = reactive({
  hadir: "text-[#00FF7F]",
  terlambat: "text-[#FF1A1A]",
  menunggu: "text-white",
  izin: "text-[#FFD700]",
  alpha: "text-[#570DF8]",
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
  tanggal: getCurrentDate(),
});
const data = reactive({
  siswa: [],
  absensi: [],
  jurusan: [],
});
const confirmDelete = reactive({
  confirming: false,
  id: "",
});

// Mengambil data siswa, jurusan, absen hari ini dan session
onMounted(async () => {
  const today = getCurrentDate();

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

  try {
    const response = await axios.get(`/api/absensi?tanggal=${today}`);
    data.absensi = response.data.map((a) => ({
      ...a,
      isEditing: false,
      editedKeterangan: String(a.keterangan),
      isLoading: false,
    }));
  } catch (error) {
    console.error(error);
  }

  try {
    const response = await axios.get(`/api/session`);
    sessionData.value = response.data;
    userData.value = sessionData.value.user;
  } catch (error) {
    console.error(error);
  }
});

// Mengambil tanggal hari ini sebagai string
function getCurrentDate() {
  const formattedDate = new Date()
    .toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/")
    .reverse()
    .join("-");

  return formattedDate;
}
// Menampilkan loading screen
function showLoading(id, seconds = 0.5) {
  return new Promise((resolve) => {
    const absensi = data.absensi.find((a) => String(a.id) === String(id));
    if (!absensi) return resolve(); // Prevent errors if absensi is undefined

    absensi.isLoading = true;
    setTimeout(() => {
      absensi.isLoading = false;
      resolve(); // Only resolve after timeout finishes
    }, seconds * 1000);
  });
}
// Format tanggal
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
// Menampilkan UI edit absen
function editKeterangan(id) {
  const absensi = data.absensi.find((a) => String(a.id) === String(id));
  absensi.isEditing = true;
}
// Menutup UI edit absen
function cancelEdit(id) {
  const absensi = data.absensi.find((a) => String(a.id) === String(id));
  absensi.isEditing = false;
}
// Refresh absen sesuai hari atau filter
function refreshAbsensi() {
  const tanggal = filter.tanggal;
  filter.tanggal = "yyyy-mm-dd";
  filter.tanggal = tanggal;
}
function toggleDeleteModal(id) {
  confirmDelete.confirming = true;
  confirmDelete.id = id
}
function cancelDelete() {
  confirmDelete.confirming = false;
  confirmDelete.id = "";
}
// Kondisional untuk filter searching
async function searchFilter(socket) {
  if (filter.search.content.trim()) {
    const filteredSiswa = data.siswa.filter(
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

    if (filteredSiswa.length === 1) {
      socket = await fetchAbsensi(`?id_siswa=${filteredSiswa[0].id}`);
      filter.hari.active = true;
    } else {
      const idSiswa = filteredSiswa.map((siswa) => siswa.id);
      socket = socket.filter((absensi) => idSiswa.includes(absensi.id_siswa));
    }

    if (filter.hari.active) {
      socket = socket.filter((absensi) =>
        filter.hari.content.includes(absensi.hari)
      );
    }

    return socket;
  } else {
    filter.hari.active = false;
    return socket;
  }
}
// Simpan absen yang diedit ke database
async function saveEdit(id) {
  const absensi = data.absensi.find((a) => String(a.id) === String(id));
  absensi.isEditing = false;

  if (absensi.keterangan === absensi.editedKeterangan) {
    return;
  }

  const updatedAbsensi = {
    id: absensi.id,
    editedKeterangan: absensi.editedKeterangan,
  };

  try {
    const response = await axios.put("/api/absensi", updatedAbsensi);
    await showLoading(absensi.id);
    refreshAbsensi();
  } catch (error) {
    console.error(error);
  }
}
async function deleteAbsensi(id) {
  try {
    await axios.delete("/api/absensi", { data: { id } });
    await showLoading(id);
    cancelDelete();
    refreshAbsensi();
  } catch (error) {
    console.error(error);
  }
}
// Mengambil absensi dari database sesuai kondisional
async function fetchAbsensi(condition) {
  try {
    const response = await axios.get(`/api/absensi${condition}`);
    return response.data.map((a) => ({
      ...a,
      isEditing: false,
      editedKeterangan: String(a.keterangan),
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

// memantau jika jurusan yang diseleksi KI atau KA utk menampilkan filter A/B
watch(
  () => filter.jurusan,
  (newVal) => {
    if ((newVal !== 1 || newVal !== 2) && filter.subdivisi !== "") {
      filter.subdivisi = "";
    }
  }
);
// Memantau jika ada perubahan pada filter tanggal, search, keterangan, jurusan, subdivisi, atau kelas
watch(filter, async (newVal) => {
  let socket = data.absensi;

  if (filter.tanggal !== "") {
    socket = await fetchAbsensi(`?tanggal=${filter.tanggal}`);
  }

  socket = await searchFilter(socket);

  if (filter.keterangan !== "") {
    socket = socket.filter(
      (absensi) =>
        absensi.keterangan.toLowerCase() == filter.keterangan.toLowerCase()
    );
  }

  if (filter.jurusan) {
    const filteredSiswa = data.siswa.filter(
      (siswa) => Number(siswa.id_jurusan) === Number(filter.jurusan)
    );
    const idSiswa = filteredSiswa.map((siswa) => siswa.id);
    socket = socket.filter((absensi) => idSiswa.includes(absensi.id_siswa));
  }

  if (filter.subdivisi && [1, 2].includes(filter.jurusan)) {
    const filteredSiswa = data.siswa.filter(
      (siswa) => siswa.subdivisi_jurusan === filter.subdivisi
    );
    const idSiswa = filteredSiswa.map((siswa) => siswa.id);
    socket = socket.filter((absensi) => idSiswa.includes(absensi.id_siswa));
  }

  if (filter.kelas && socket /*data.absensi*/) {
    const filteredSiswa = data.siswa.filter((siswa) =>
      filter.kelas.includes(siswa.kelas)
    );
    const idSiswa = filteredSiswa.map((siswa) => siswa.id);
    socket = socket.filter((absensi) => idSiswa.includes(absensi.id_siswa));
  }

  data.absensi = socket;
});
</script>

<template>
  <DashboardBg>
    <DashboardName class="grid grid-cols-5 gap-6 mt-2 px-[50px] pt-[20px] pb-[24px]">
      <div>
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
          class="input input-bordered input-primary w-full max-w-xs border-4 bg-gray-800"
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

      <div>
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

      <div>
  <label for="jurusan" class="block mb-2 font-medium text-xl">Jurusan:</label>
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


  <div v-if="filter.jurusan === 1 || filter.jurusan === 2" class="flex items-center space-x-4 mt-2">
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


      <div>
        <label for="keterangan" class="block mb-2 font-medium text-xl"
          >Keterangan:</label
        >
        <select
          id="keterangan"
          v-model="filter.keterangan"
          class="select select-primary w-full max-w-xs bg-gray-800 mb-2 border-4"
        >
          <option value="hadir">Hadir</option>
          <option value="terlambat">Terlambat</option>
          <option value="izin">Izin</option>
          <option value="alpha">Alpha</option>
          <option value="menunggu">Menunggu</option>
          <option value="">All</option>
        </select>
      </div>

      <div>
        <label for="tanggal" class="block mb-2 font-medium text-xl"
          >Tanggal:</label
        >
        <input
          type="date"
          id="tanggal"
          v-model="filter.tanggal"
          class="input input-bordered w-full max-w-xs bg-gray-800 border-primary focus:ring focus:ring-primary focus:border-primary border-4"
        />
      </div>
    </DashboardName>

    <DashboardNavBar currentWindow="absensi" />

    <div class="space-y-6 hidden">
      <div
        class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700"
      >
        <div>
          <h1 class="text-4xl font-bold cursor-default">Delphi Zoe</h1>
          <p class="text-gray-400 cursor-default">Computer Science</p>
          <p class="text-gray-500 cursor-default">12492372957295</p>
        </div>
        <div class="text-right">
          <h1
            :class="`${statusColors['hadir']} text-6xl font-bold cursor-default`"
          >
            HADIR
          </h1>
          <p class="text-gray-400 cursor-default">
            06:14:53 | Wednesday, 15 January 2077
          </p>
        </div>
      </div>

      <div
        class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700"
      >
        <div>
          <h1 class="text-4xl font-bold cursor-default">Ryan Tamara</h1>
          <p class="text-gray-400 cursor-default">Industry Automation</p>
          <p class="text-gray-500 cursor-default">12492372957295</p>
        </div>
        <div class="text-right">
          <h1
            :class="`${statusColors['terlambat']} text-6xl font-bold cursor-default`"
          >
            TERLAMBAT
          </h1>
          <p class="text-gray-400 cursor-default">
            06:14:53 | Wednesday, 15 January 2077
          </p>
        </div>
      </div>

      <div
        class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700"
      >
        <div>
          <h1 class="text-4xl font-bold cursor-default">Dorime Ameno</h1>
          <p class="text-gray-400 cursor-default">Industrial Chemistry</p>
          <p class="text-gray-500 cursor-default">12492372957295</p>
        </div>
        <div class="text-right">
          <h1
            :class="`${statusColors['menunggu']} text-6xl font-bold cursor-default`"
          >
            MENUNGGU
          </h1>
          <p class="text-gray-400 cursor-default">
            06:14:53 | Wednesday, 15 January 2077
          </p>
        </div>
      </div>

      <div
        class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700"
      >
        <div>
          <h1 class="text-4xl font-bold cursor-default">Jennifer D. Vulkan</h1>
          <p class="text-gray-400 cursor-default">Chemistry Analyst</p>
          <p class="text-gray-500 cursor-default">12492372957295</p>
        </div>
        <div class="text-right">
          <h1
            :class="`${statusColors['izin']} text-6xl font-bold cursor-default`"
          >
            IZIN
          </h1>
          <p class="text-gray-400 cursor-default">
            06:14:53 | Wednesday, 15 January 2077
          </p>
        </div>
      </div>

      <div
        class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700"
      >
        <div>
          <h1 class="text-4xl font-bold cursor-default">Ran Dee</h1>
          <p class="text-gray-400 cursor-default">Vehicle Engineering</p>
          <p class="text-gray-500 cursor-default">12492372957295</p>
        </div>
        <div class="text-right">
          <h1
            :class="`${statusColors['alpha']} text-6xl font-bold cursor-default`"
          >
            ALPHA
          </h1>
          <p class="text-gray-400 cursor-default">
            06:14:53 | Wednesday, 15 January 2077
          </p>
        </div>
      </div>
    </div>

    <div v-if="filter.search.focus" class="space-y-6">
      <div
        class="bg-gray-800 p-6 rounded-lg flex justify-center items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700 min-h-[50vh]"
      >
        <!-- 188px -->
        <PulseLoader color="#570DF8" />
      </div>
    </div>

    <div
      v-else-if="!data.absensi.length && !filter.search.content.trim()"
      class="space-y-6"
    >
      <div
        class="bg-gray-800 p-6 rounded-lg flex justify-center items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700 min-h-[50vh]"
      >
        <h1 class="text-6xl font-bold text-white text-center flex flex-col">
          <font-awesome-icon
            :icon="['fas', 'triangle-exclamation']"
            class="text-[100px] mb-10 text-yellow-500"
          />
          <span>TIDAK ADA ABSENSI</span>
        </h1>
      </div>
    </div>

    <div v-else-if="data.absensi.length" class="space-y-6" v-for="absensi in data.absensi" :key="data.absensi.id">
      <div
        v-if="
          data && data.siswa && data.jurusan && absensi && !absensi.isLoading
        "
        class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700 h-[188px]"
      >
        <div>
          <h1 class="text-4xl font-bold cursor-default">
            {{
              data.siswa.find((s) => s.id == absensi.id_siswa)?.nama ||
              "Loading..."
            }}
          </h1>
          <p class="text-gray-400 cursor-default">
            {{
              data.jurusan.find(
                (j) =>
                  j.id ==
                  data.siswa.find((s) => s.id == absensi.id_siswa)?.id_jurusan
              )?.nama || "jurusan dihapus"
            }}
          </p>
          <p class="text-gray-500 cursor-default">
            {{
              data.siswa.find((s) => s.id == absensi.id_siswa)?.nis ||
              "Loading..."
            }}
          </p>
        </div>

        <div class="text-right">
          <div v-if="absensi.isEditing" class="flex items-center gap-2">
            <button
              @click="toggleDeleteModal(absensi.id)"
              class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
            <select
              v-model="absensi.editedKeterangan"
              :class="`bg-gray-800 hover:bg-gray-700 ${statusColors[absensi.editKeterangan]} rounded border-primary border-4 select select-primary`"
            >
              <option value="hadir" :class="`${statusColors['hadir']}`">
                Hadir
              </option>
              <option value="izin" :class="`${statusColors['izin']}`">
                Izin
              </option>
              <option value="terlambat" :class="`${statusColors['terlambat']}`">
                Terlambat
              </option>
              <option value="alpha" :class="`${statusColors['alpha']}`">
                Alpha
              </option>
              <option value="menunggu" :class="`${statusColors['menunggu']}`">
                Menunggu
              </option>
            </select>
            <button
              @click="cancelEdit(absensi.id)"
              class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              @click="saveEdit(absensi.id)"
              class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>

          <div v-else>
            <h1
              :class="`${statusColors[absensi.keterangan] || 'text-gray-500'} text-6xl font-bold cursor-default`"
            >
              {{ absensi.keterangan?.toUpperCase() || "Loading..." }}
            </h1>
            <p class="text-gray-400 cursor-default">
              {{ absensi.waktu || "Loading..." }}
              |
              {{ formatDate(absensi.tanggal) || "Loading..." }}
            </p>
            <button
              @click="editKeterangan(absensi.id)"
              class="text-white cursor-pointer"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <div
        v-else
        class="bg-gray-800 p-6 rounded-lg flex justify-center items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700 min-h-[188px] h-[188px]"
      >
        <PulseLoader color="#570DF8" />
      </div>
    </div>

    <DeleteModal v-if="confirmDelete.confirming"">
      Apakah anda ingin menghapus absen ini?
      <template #buttons>
        <button class="cursor-pointer px-4 py-2 rounded bg-gray-400 hover:bg-gray-500" @click="cancelDelete">
          Cancel
        </button>
        <button class="cursor-pointer px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600" @click="deleteAbsensi(confirmDelete.id)">
          Delete
        </button>
      </template>
    </DeleteModal>
  </DashboardBg>

  <DashboardFooter />
</template>

<style scoped>
body {
  font-family: "Roboto", sans-serif;
}

.card {
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
</style>
