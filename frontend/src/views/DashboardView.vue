<script setup>
import axios from 'axios';
import { onMounted, reactive, watch, ref } from 'vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import router from '@/router';
import { RouterLink } from 'vue-router';

axios.defaults.withCredentials = true;

const sessionData = ref([]);
const userData = ref([]);
const statusColors = reactive({
  hadir: "text-[#00FF7F]",
  terlambat: "text-[#FF1A1A]",
  menunggu: "text-white",
  izin: "text-[#FFD700]",
  alpha: "text-[#570DF8]"
});
const filter = reactive({
  search: { content: '', focus: false },
  kelas: [1, 2, 3, 4],
  hari: {
    content: [1, 2, 3, 4, 5],
    active: false,
  },
  jurusan: 0,
  subdivisi: '',
  keterangan: '',
  tanggal: getCurrentDate()
});
const data = reactive({
  "siswa": [],
  "absensi": [],
  "jurusan": []
});

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
    data.absensi = response.data.map(a => ({ ...a, isEditing: false, editedKeterangan: String(a.keterangan), isLoading: false }));
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

function getCurrentDate() {
  const formattedDate = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).split("/").reverse().join("-");

  return formattedDate;
}
function showLoading(id, seconds = 0.5) {
  return new Promise((resolve) => {
    const absensi = data.absensi.find(a => String(a.id) === String(id));
    if (!absensi) return resolve(); // Prevent errors if absensi is undefined

    absensi.isLoading = true;
    setTimeout(() => {
      absensi.isLoading = false;
      resolve(); // Only resolve after timeout finishes
    }, seconds * 1000);
  });
}
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}
function editKeterangan(id) {
  const absensi = data.absensi.find(a => String(a.id) === String(id))
  absensi.isEditing = true;
}
function cancelEdit(id) {
  const absensi = data.absensi.find(a => String(a.id) === String(id))
  absensi.isEditing = false;
}
function refreshAbsensi() {
  const tanggal = filter.tanggal;
  filter.tanggal = 'yyyy-mm-dd';
  filter.tanggal = tanggal;
}
async function searchFilter(socket) {
  if (filter.search.content.trim()) {
    const filteredSiswa = data.siswa.filter(siswa =>
      siswa.nama.toLowerCase().includes(filter.search.content.trim().toLowerCase()) ||
      siswa.nis.includes(filter.search.content.trim()) ||
      data.jurusan.find(jurusan => Number(jurusan.id) === Number(siswa.id_jurusan)).nama.toLowerCase().includes(filter.search.content.trim().toLowerCase())
    );

    if (filteredSiswa.length === 1) {
      socket = await fetchAbsensi(`?id_siswa=${filteredSiswa[0].id}`);
      filter.hari.active = true;
    } else {
      const idSiswa = filteredSiswa.map(siswa => siswa.id);
      socket = socket.filter(absensi => idSiswa.includes(absensi.id_siswa));
    }

    if (filter.hari.active) {
      socket = socket.filter(absensi => filter.hari.content.includes(absensi.hari));
    }

    return socket;
  } else {
    filter.hari.active = false;
    return socket;
  }
}
async function saveEdit(id) {
  const absensi = data.absensi.find(a => String(a.id) === String(id));
  absensi.isEditing = false;

  if (absensi.keterangan === absensi.editedKeterangan) {
    return;
  }

  const updatedAbsensi = {
    id: absensi.id,
    editedKeterangan: absensi.editedKeterangan
  }

  try {
    const response = await axios.put('/api/absensi', updatedAbsensi);
    await showLoading(absensi.id);
    refreshAbsensi();
  } catch (error) {
    console.error(error);
  }
}
async function fetchAbsensi(condition) {
  try {
    const response = await axios.get(`/api/absensi${condition}`);
    return response.data.map(a => ({ ...a, isEditing: false, editedKeterangan: String(a.keterangan) }));
  } catch (error) {
    console.error(error);
    return [];
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
    let socket = data.absensi;

    if (filter.tanggal !== '') {
      socket = await fetchAbsensi(`?tanggal=${filter.tanggal}`);
    }

    socket = await searchFilter(socket);

    if (filter.keterangan !== '') {
      socket = socket.filter(absensi => absensi.keterangan.toLowerCase() == filter.keterangan.toLowerCase());
    }

    if (filter.jurusan) {
      const filteredSiswa = data.siswa.filter(siswa => Number(siswa.id_jurusan) === Number(filter.jurusan));
      const idSiswa = filteredSiswa.map(siswa => siswa.id);
      socket = socket.filter(absensi => idSiswa.includes(absensi.id_siswa));
    }

    if (filter.subdivisi && [1, 2].includes(filter.jurusan)) {
      const filteredSiswa = data.siswa.filter(siswa => siswa.subdivisi_jurusan === filter.subdivisi);
      const idSiswa = filteredSiswa.map(siswa => siswa.id);
      socket = socket.filter(absensi => idSiswa.includes(absensi.id_siswa));
    }

    if (filter.kelas && socket /*data.absensi*/) {
      const filteredSiswa = data.siswa.filter(siswa => filter.kelas.includes(siswa.kelas));
      const idSiswa = filteredSiswa.map(siswa => siswa.id);
      socket = socket.filter(absensi => idSiswa.includes(absensi.id_siswa));
    }

    data.absensi = socket;
    console.log({
      'data': data.absensi,
      'socket': socket
    });

  }
);
</script>

<template>
  <div
    class="text-white min-h-screen bg-[linear-gradient(to_top_left,#734190,#734190,#4a77e0,#4a77e0,#7c95ff,#7c95ff)]">
    <div class="p-[150px] flex flex-col">

      <div class="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg">
        <div class="flex justify-between items-center m-6">
          <div class="flex items-center">
            <img class="h-16 mr-8" src="@/components/images/Logo.png"></img>
            <h1 class="text-[45px] font-bold">
              {{ userData.nama || '' }}</h1>
          </div>
          <div>
            <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="text-4xl cursor-pointer" @click="logout" />
          </div>
        </div>
        <div class="grid grid-cols-5 gap-6 mt-2 px-[50px] pt-[20px] pb-[24px]">

          <div>
            <label for="search" class="block mb-2 font-medium text-xl">Search:</label>
            <input type="text" id="search" placeholder="Type here" name="search" v-model="filter.search.content"
              @focus="filter.search.focus = true" @blur="filter.search.focus = false"
              class="input input-bordered input-primary w-full max-w-xs border-4 bg-gray-800" />


            <div class="flex flex-wrap gap-4 mt-4" v-if="filter.hari.active">
              <div class="form-control" v-for="(day, index) in [
                { label: 'S', value: 1 },
                { label: 'S', value: 2 },
                { label: 'R', value: 3 },
                { label: 'K', value: 4 },
                { label: 'J', value: 5 }
              ]" :key="index">
                <label class="label cursor-pointer">
                  <span class="label-text">{{ day.label }}</span>
                  <input type="checkbox" v-model="filter.hari.content" :value="day.value"
                    class="checkbox checkbox-primary" />
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
                    ['X', 'XI', 'XII',
                      'XIII'][n - 1]
                  }}</span>
                  <input type="checkbox" v-model="filter.kelas" :value="n" class="checkbox checkbox-primary" />
                </label>
              </div>
            </div>
          </div>


          <div>
            <label for="jurusan" class="block mb-2 font-medium text-xl">Jurusan:</label>
            <select id="jurusan" v-model="filter.jurusan"
              class="select select-primary w-full max-w-xs bg-gray-800 mb-2 border-4">
              <option :value="1">Kimia Analis</option>
              <option :value="2">Kimia Industri</option>
              <option :value="3">Otomasi Industri</option>
              <option :value="4">Pengembangan Perangkat Lunak &
                Gim</option>
              <option :value="5">Tata Pendinginan Udara</option>
              <option :value="6">Listrik</option>
              <option :value="7">Kendaraan Ringan</option>
              <option :value="8">Pengelasan</option>
              <option :value="9">Farmasi</option>
              <option :value="10">Mesin</option>
              <option :value="0">All</option>
            </select>
            <div v-if="filter.jurusan === 1 || filter.jurusan === 2" class="flex items-center space-x-2 mt-2">
              <input type="radio" id="jurusan-a" name="jurusan" class="radio radio-primary border-4" value="A"
                v-model="filter.subdivisi" />
              <label for="jurusan-a">A</label>

              <input type="radio" id="jurusan-b" name="jurusan" class="radio radio-primary border-4" value="B"
                v-model="filter.subdivisi" />
              <label for="jurusan-b">B</label>
            </div>

          </div>

          <div>
            <label for="keterangan" class="block mb-2 font-medium text-xl">Keterangan:</label>
            <select id="keterangan" v-model="filter.keterangan"
              class="select select-primary w-full max-w-xs bg-gray-800 mb-2 border-4">
              <option value="hadir">Hadir</option>
              <option value="terlambat">Terlambat</option>
              <option value="izin">Izin</option>
              <option value="alpha">Alpha</option>
              <option value="menunggu">Menunggu</option>
              <option value="">All</option>
            </select>
          </div>

          <div>
            <label for="tanggal" class="block mb-2 font-medium text-xl">Tanggal:</label>
            <input type="date" id="tanggal" v-model="filter.tanggal"
              class="input input-bordered w-full max-w-xs bg-gray-800 border-primary focus:ring focus:ring-primary focus:border-primary border-4" />
          </div>
        </div>

      </div>

      <div class="space-y-6 hidden">
        <div
          class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700">
          <div>
            <h1 class="text-4xl font-bold cursor-default">Delphi Zoe
            </h1>
            <p class="text-gray-400 cursor-default">Computer Science</p>
            <p class="text-gray-500 cursor-default">12492372957295</p>
          </div>
          <div class="text-right">
            <h1 :class="`${statusColors['hadir']} text-6xl font-bold cursor-default`">
              HADIR</h1>
            <p class="text-gray-400 cursor-default">06:14:53 |
              Wednesday, 15 January 2077</p>
          </div>
        </div>

        <div
          class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700">
          <div>
            <h1 class="text-4xl font-bold cursor-default">Ryan Tamara
            </h1>
            <p class="text-gray-400 cursor-default">Industry Automation
            </p>
            <p class="text-gray-500 cursor-default">12492372957295</p>
          </div>
          <div class="text-right">
            <h1 :class="`${statusColors['terlambat']} text-6xl font-bold cursor-default`">
              TERLAMBAT</h1>
            <p class="text-gray-400 cursor-default">06:14:53 |
              Wednesday, 15 January 2077</p>
          </div>
        </div>

        <div
          class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700">
          <div>
            <h1 class="text-4xl font-bold cursor-default">Dorime Ameno
            </h1>
            <p class="text-gray-400 cursor-default">Industrial Chemistry
            </p>
            <p class="text-gray-500 cursor-default">12492372957295</p>
          </div>
          <div class="text-right">
            <h1 :class="`${statusColors['menunggu']} text-6xl font-bold cursor-default`">
              MENUNGGU</h1>
            <p class="text-gray-400 cursor-default">06:14:53 |
              Wednesday, 15 January 2077</p>
          </div>
        </div>

        <div
          class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700">
          <div>
            <h1 class="text-4xl font-bold cursor-default">Jennifer D.
              Vulkan</h1>
            <p class="text-gray-400 cursor-default">Chemistry Analyst
            </p>
            <p class="text-gray-500 cursor-default">12492372957295</p>
          </div>
          <div class="text-right">
            <h1 :class="`${statusColors['izin']} text-6xl font-bold cursor-default`">
              IZIN</h1>
            <p class="text-gray-400 cursor-default">06:14:53 |
              Wednesday, 15 January 2077</p>
          </div>
        </div>

        <div
          class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700">
          <div>
            <h1 class="text-4xl font-bold cursor-default">Ran Dee</h1>
            <p class="text-gray-400 cursor-default">Vehicle Engineering
            </p>
            <p class="text-gray-500 cursor-default">12492372957295</p>
          </div>
          <div class="text-right">
            <h1 :class="`${statusColors['alpha']} text-6xl font-bold cursor-default`">
              ALPHA</h1>
            <p class="text-gray-400 cursor-default">06:14:53 |
              Wednesday, 15 January 2077</p>
          </div>
        </div>


      </div>



      <div v-if="filter.search.focus" class="space-y-6">
        <div
          class="bg-gray-800 p-6 rounded-lg flex justify-center items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700 min-h-[50vh]">
          <!-- 188px -->
          <PulseLoader color="#570DF8" />
        </div>
      </div>

      <div v-else-if="!data.absensi.length && !filter.search.content.trim()" class="space-y-6">
        <div
          class="bg-gray-800 p-6 rounded-lg flex justify-center items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700 min-h-[50vh]">
          <h1 class="text-6xl font-bold text-white text-center flex flex-col">
            <font-awesome-icon :icon="['fas', 'triangle-exclamation']" class="text-[100px] mb-10 text-yellow-500" />
            <span>TIDAK ADA ABSENSI</span>
          </h1>
        </div>
      </div>

      <div v-else-if="data.absensi.length" class="space-y-6" v-for="absensi in data.absensi" :key="data.absensi.id">
        <div v-if="data && data.siswa && data.jurusan && absensi && !absensi.isLoading"
          class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700 h-[188px]">
          <div>
            <h1 class="text-4xl font-bold cursor-default">
              {{data.siswa.find(s => s.id == absensi.id_siswa)?.nama || "Loading..."}}
            </h1>
            <p class="text-gray-400 cursor-default">
              {{data.jurusan.find(j => j.id == data.siswa.find(s => s.id == absensi.id_siswa)?.id_jurusan)?.nama ||
                "Loading..."}}
            </p>
            <p class="text-gray-500 cursor-default">
              {{data.siswa.find(s => s.id == absensi.id_siswa)?.nis || "Loading..."}}
            </p>
          </div>

          <div class="text-right">
            <div v-if="absensi.isEditing" class="flex items-center gap-2">
              <select v-model="absensi.editedKeterangan"
                :class="`bg-gray-800 hover:bg-gray-700 ${statusColors[absensi.editKeterangan]} rounded border-primary border-4 select select-primary`">
                <option value="hadir" :class="`${statusColors['hadir']}`">Hadir</option>
                <option value="izin" :class="`${statusColors['izin']}`">Izin</option>
                <option value="terlambat" :class="`${statusColors['terlambat']}`">Terlambat</option>
                <option value="alpha" :class="`${statusColors['alpha']}`">Alpha</option>
                <option value="menunggu" :class="`${statusColors['menunggu']}`">Menunggu</option>
              </select>
              <button @click="cancelEdit(absensi.id)"
                class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">Cancel</button>
              <button @click="saveEdit(absensi.id)"
                class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">Update</button>
            </div>

            <div v-else>
              <h1 :class="`${statusColors[absensi.keterangan] || 'text-gray-500'} text-6xl font-bold cursor-default`">
                {{ absensi.keterangan?.toUpperCase() || "Loading..." }}
              </h1>
              <p class="text-gray-400 cursor-default">
                {{ absensi.waktu || "Loading..." }} | {{ formatDate(absensi.tanggal) || "Loading..." }}
              </p>
              <button @click="editKeterangan(absensi.id)" class="text-white cursor-pointer">Edit</button>
            </div>
          </div>
        </div>

        <div v-else
          class="bg-gray-800 p-6 rounded-lg flex justify-center items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700 min-h-[188px] h-[188px]">
          <PulseLoader color="#570DF8" />
        </div>
      </div>

    </div>
  </div>




  <footer class="bg-gray-800 shadow-sm dark:bg-gray-900 flex flex-col">
    <div class="w-full py-[60px] px-[150px]">

      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
          <img src="@/components/images/Logo.png" class="h-8" alt="Flowbite Logo" />
          <h1 class="self-center text-3xl font-semibold whitespace-nowrap text-white cursor-default">Proyek-Absensi</h1>
        </div>
        <ul
          class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-400 sm:mb-0 dark:text-gray-400 hidden">
          <li>
            <RouterLink to="#" class="hover:underline me-4 md:me-6">About</RouterLink>
          </li>
          <li>
            <RouterLink to="#" class="hover:underline me-4 md:me-6">Privacy Policy</RouterLink>
          </li>
          <li>
            <RouterLink to="#" class="hover:underline me-4 md:me-6">Licensing</Routerlink>
          </li>
          <li>
            <RouterLink to="#" class="hover:underline">Contact</RouterLink>
          </li>
        </ul>
      </div>
      <hr class="my-6 border-gray-500 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <span class="cursor-default block text-sm text-gray-400 sm:text-center dark:text-gray-400">© 2025 <RouterLink
          to="#" class="hover:underline">Proyek-Absensi</RouterLink>. Diproduksi dan dikembangkan dengan
        dedikasi.</span>


    </div>
  </footer>


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