<script setup>
import axios from 'axios';
import { onMounted, reactive, watch, ref } from 'vue';
import router from '@/router';

axios.defaults.withCredentials = true;

const sessionData = ref([]);
const userData = ref([]);
const statusColors = reactive({
  hadir: "text-[#00FF7F]",
  terlambat: "text-[#FF1A1A]",
  menunggu: "text-white",
  izin: "text-[#FFD700]",
  alpha: "text-[#FF1A1A]"
});
const filter = reactive({
  search: '',
  kelas: [1, 2, 3, 4],
  jurusan: 0,
  subdivisi: '',
  keterangan: '',
  tanggal: new Date().toISOString().split("T")[0]
});
const data = reactive({
  siswa: [],
  absensi: [],
  jurusan: []
});

onMounted(async () => {
  const today = new Date().toISOString().split("T")[0];

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
    data.absensi = response.data.map(absensi => ({ ...absensi, editing: false }));
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

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

async function fetchAbsensi(condition) {
  try {
    const response = await axios.get(`/api/absensi${condition}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function logout() {
  try {
    const response = await axios.post("/api/logout");
    router.push('/');
  } catch (error) {
    console.error(error);
  }
}

function enableEdit(absensi) {
  absensi.editing = true;
}

function cancelEdit(absensi) {
  absensi.editing = false;
}

async function saveEdit(absensi) {
  try {
    const response = await axios.put(`/api/absensi/${absensi.id}`, { keterangan: absensi.keterangan });
    absensi.editing = false;
  } catch (error) {
    console.error(error);
  }
}

watch(
  () => filter.jurusan,
  (newVal) => {
    if ((newVal !== 1 || newVal !== 2) && filter.subdivisi !== '') {
      filter.subdivisi = '';
    }
  }
);

watch(
  filter,
  async (newVal) => {
    if (filter.tanggal !== '') {
      data.absensi = await fetchAbsensi(`?tanggal=${filter.tanggal}`);
    }

    if (filter.keterangan) {
      data.absensi = data.absensi.filter(absensi => absensi.keterangan.toLowerCase() == filter.keterangan.toLowerCase());
    }

    if (filter.jurusan) {
      const filteredSiswa = data.siswa.filter(siswa => siswa.id_jurusan == filter.jurusan);
      const idSiswa = filteredSiswa.map(siswa => Number(siswa.id));
      data.absensi = data.absensi.filter(absensi => idSiswa.includes(absensi.id_siswa));
    }

    if (filter.subdivisi && [1, 2].includes(filter.jurusan)) {
      const filteredSiswa = data.siswa.filter(siswa => siswa.subdivisi_jurusan === filter.subdivisi);
      const idSiswa = filteredSiswa.map(siswa => Number(siswa.id));
      data.absensi = data.absensi.filter(absensi => idSiswa.includes(absensi.id_siswa));
    }

    if (filter.kelas) {
      const filteredSiswa = data.siswa.filter(siswa => filter.kelas.includes(siswa.kelas));
      const idSiswa = filteredSiswa.map(siswa => Number(siswa.id));
      data.absensi = data.absensi.filter(absensi => idSiswa.includes(absensi.id_siswa));
    }

    if (filter.search.trim()) {
      const filteredSiswa = data.siswa.filter(siswa =>
        siswa.nama.toLowerCase().includes(filter.search.toLowerCase()) ||
        siswa.nis.includes(filter.search) ||
        data.jurusan.find(jurusan => Number(jurusan.id) === Number(siswa.id_jurusan)).nama.toLowerCase().includes(filter.search.toLowerCase())
      );

      const idSiswa = filteredSiswa.map(siswa => Number(siswa.id));
      data.absensi = data.absensi.filter(absensi => idSiswa.includes(absensi.id_siswa));
    }
  }
);
</script>

<template>
  <div class="text-white min-h-screen bg-[linear-gradient(to_top_left,#734190,#734190,#4a77e0,#4a77e0,#7c95ff,#7c95ff)]">
    <div class="container mx-auto py-[150px]">
      <!-- Bagian filter dan lainnya tetap sama -->

      <div class="space-y-6" v-for="absensi in data.absensi" :key="absensi.id">
        <div v-if="data && data.siswa && data.jurusan && absensi"
             class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700">
          <div>
            <h1 class="text-4xl font-bold cursor-default">
              {{ data.siswa.find(s => s.id == absensi.id_siswa).nama || "Loading..." }}
            </h1>
            <p class="text-gray-400 cursor-default">
              {{ data.jurusan.find(j => j.id == data.siswa.find(s => s.id == absensi.id_siswa)?.id_jurusan)?.nama || "Loading..." }}
            </p>
            <p class="text-gray-500 cursor-default">
              {{ data.siswa.find(s => s.id == absensi.id_siswa)?.nis || "Loading..." }}
            </p>
          </div>

          <div class="text-right">
            <div v-if="!absensi.editing">
              <h1 :class="`${statusColors[absensi.keterangan] || 'text-gray-500'} text-6xl font-bold cursor-default`">
                {{ absensi.keterangan?.toUpperCase() || "Loading..." }}
              </h1>
              <p class="text-gray-400 cursor-default">
                {{ absensi.waktu || "Loading..." }} | {{ formatDate(absensi.tanggal) || "Loading..." }}
              </p>
              <button @click="enableEdit(absensi)" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
                Edit
              </button>
            </div>
            <div v-else>
              <select v-model="absensi.keterangan" class="select select-primary bg-gray-800 mb-2 border-4">
                <option value="hadir">Hadir</option>
                <option value="terlambat">Terlambat</option>
                <option value="izin">Izin</option>
                <option value="alpha">Alpha</option>
                <option value="menunggu">Menunggu</option>
              </select>
              <button @click="saveEdit(absensi)" class="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg">
                Save
              </button>
              <button @click="cancelEdit(absensi)" class="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg ml-2">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <p v-else class="text-gray-400 text-center">Loading data...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: 'Roboto', sans-serif;
}

.card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
</style>