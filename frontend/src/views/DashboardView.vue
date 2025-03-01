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
          "siswa": [],
          "absensi": [],
          "jurusan": []
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
                    data.absensi = response.data;
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
          <div
                    class="text-white min-h-screen bg-[linear-gradient(to_top_left,#734190,#734190,#4a77e0,#4a77e0,#7c95ff,#7c95ff)]">
                    <div class="container mx-auto py-[150px]">

                              <div class="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg">
                                        <div class="flex justify-between items-center m-6">
                                                  <div class="flex items-center">
                                                            <img class="h-16 mr-8"
                                                                      src="@/components/images/Logo.png"></img>
                                                            <h1
                                                                      class="text-[45px] font-bold cursor-default paytone-one-regular">
                                                                      {{ userData.nama || '' }}</h1>
                                                  </div>
                                                  <div>
                                                            <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="text-4xl cursor-pointer" @click="logout" />
                                                  </div>
                                        </div>
                                        <div class="grid grid-cols-5 gap-6 mt-2 px-[50px] pt-[20px] pb-[24px]">

                                                  <div>
                                                            <label for="search"
                                                                      class="block mb-2 font-medium text-xl">Search:</label>
                                                            <input type="text" id="search" placeholder="Type here"
                                                                      name="search" v-model="filter.search"
                                                                      class="input input-bordered input-primary w-full max-w-xs border-4 bg-gray-800" />
                                                  </div>

                                                  <div>
                                                            <label class="block mb-2 font-medium text-xl">Kelas:</label>
                                                            <div class="flex flex-wrap gap-4">
                                                                      <div class="form-control"
                                                                                v-for="n in [1, 2, 3, 4]" :key="n">
                                                                                <label class="label cursor-pointer">
                                                                                          <span class="label-text">{{
                                                                                                    ['X', 'XI', 'XII',
                                                                                                              'XIII'][n - 1]
                                                                                          }}</span>
                                                                                          <input type="checkbox"
                                                                                                    v-model="filter.kelas"
                                                                                                    :value="n"
                                                                                                    class="checkbox checkbox-primary" />
                                                                                </label>
                                                                      </div>
                                                            </div>
                                                  </div>


                                                  <div>
                                                            <label for="jurusan"
                                                                      class="block mb-2 font-medium text-xl">Jurusan:</label>
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
                                                            <div v-if="filter.jurusan === 1 || filter.jurusan === 2"
                                                                      class="flex items-center space-x-2 mt-2">
                                                                      <input type="radio" id="jurusan-a" name="jurusan"
                                                                                class="radio radio-primary border-4"
                                                                                value="A" v-model="filter.subdivisi" />
                                                                      <label for="jurusan-a">A</label>

                                                                      <input type="radio" id="jurusan-b" name="jurusan"
                                                                                class="radio radio-primary border-4"
                                                                                value="B" v-model="filter.subdivisi" />
                                                                      <label for="jurusan-b">B</label>
                                                            </div>

                                                  </div>

                                                  <div>
                                                            <label for="keterangan"
                                                                      class="block mb-2 font-medium text-xl">Keterangan:</label>
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
                                                            <label for="tanggal"
                                                                      class="block mb-2 font-medium text-xl">Tanggal:</label>
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
                                                            <h1
                                                                      :class="`${statusColors['hadir']} text-6xl font-bold cursor-default`">
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
                                                            <h1
                                                                      :class="`${statusColors['terlambat']} text-6xl font-bold cursor-default`">
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
                                                            <h1
                                                                      :class="`${statusColors['menunggu']} text-6xl font-bold cursor-default`">
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
                                                            <h1
                                                                      :class="`${statusColors['izin']} text-6xl font-bold cursor-default`">
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
                                                            <h1
                                                                      :class="`${statusColors['alpha']} text-6xl font-bold cursor-default`">
                                                                      ALPHA</h1>
                                                            <p class="text-gray-400 cursor-default">06:14:53 |
                                                                      Wednesday, 15 January 2077</p>
                                                  </div>
                                        </div>


                              </div>

                              <div class="space-y-6" v-for="absensi in data.absensi" :key="data.absensi.id">

                                        <div v-if="data && data.siswa && data.jurusan && absensi"
                                                  class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700">
                                                  <div>
                                                            <h1 class="text-4xl font-bold cursor-default">
                                                                      {{data.siswa.find(s => s.id ==
                                                                                absensi.id_siswa).nama || "Loading..."}}
                                                            </h1>
                                                            <p class="text-gray-400 cursor-default">
                                                                      {{data.jurusan.find(j => j.id ==
                                                                                data.siswa.find(s => s.id ==
                                                                                          absensi.id_siswa)?.id_jurusan)?.nama ||
                                                                                "Loading..."}}
                                                            </p>
                                                            <p class="text-gray-500 cursor-default">
                                                                      {{data.siswa.find(s => s.id ==
                                                                                absensi.id_siswa)?.nis || "Loading..."}}
                                                            </p>
                                                  </div>

                                                  <div class="text-right">
                                                            <h1
                                                                      :class="`${statusColors[absensi.keterangan] || 'text-gray-500'} text-6xl font-bold cursor-default`">
                                                                      {{ absensi.keterangan?.toUpperCase() ||
                                                                                "Loading..." }}
                                                            </h1>
                                                            <p class="text-gray-400 cursor-default">
                                                                      {{ absensi.waktu || "Loading..." }} | {{
                                                                                formatDate(absensi.tanggal) || "Loading..." }}
                                                            </p>
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