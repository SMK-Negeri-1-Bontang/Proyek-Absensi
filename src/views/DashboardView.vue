<script setup>
import axios from 'axios';
import { onMounted, ref, reactive, watch } from 'vue';

onMounted(async () => {
          try {
                    const response = await axios.get("/api/siswa");
                    siswa.value = response.data;

          } catch (error) {
                    console.error(error);
          }
});

const statusColors = reactive({
          hadir: "text-[#00FF7F]",
          terlambat: "text-[#FF1A1A]",
          menunggu: "text-gray-400",
          izin: "text-[#FFD700]",
          alpha: "text-gray-500"
});

const filter = reactive({
          nis: '',
          kelas: '',
          jurusan: '',
          subdivisi: '',
          tanggal: ''
});

watch(
          () => filter.jurusan,
          (newVal) => {
                    if ((newVal !== "KI" || newVal !== "KA") && filter.subdivisi !== '') {
                              filter.subdivisi = '';
                    }
          }
);


const testing = () => {
          console.log(filter);
}

const siswa = ref([]);
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
                                                                      Juno Iceclub</h1>
                                                  </div>
                                                  <div>
                                                            <i class="fas fa-sign-out-alt text-3xl cursor-pointer"></i>
                                                  </div>
                                        </div>
                                        <div class="grid grid-cols-4 gap-6 mt-2 px-[50px] pt-[20px] pb-[24px]">
                                                  <div>
                                                            <label for="nis"
                                                                      class="block mb-2 font-medium text-xl">NIS:</label>
                                                            <input type="text" id="nis" placeholder="Type NIS"
                                                                      name="nis" v-model="filter.nis"
                                                                      class="input input-bordered input-primary w-full max-w-xs border-4 bg-gray-800" />
                                                  </div>
                                                  <div>
                                                            <label for="class"
                                                                      class="block mb-2 font-medium text-xl">Kelas:</label>
                                                            <div class="flex items-center space-x-4">
                                                                      <input type="radio" v-model="filter.kelas"
                                                                                :value="1" id="class-x"
                                                                                class="radio radio-primary border-4" />
                                                                      <label for="class-x">X</label>

                                                                      <input type="radio" v-model="filter.kelas"
                                                                                :value="2" id="class-xi"
                                                                                class="radio radio-primary border-4" />
                                                                      <label for="class-xi">XI</label>

                                                                      <input type="radio" v-model="filter.kelas"
                                                                                :value="3" id="class-xii"
                                                                                class="radio radio-primary border-4" />
                                                                      <label for="class-xii">XII</label>

                                                                      <input type="radio" v-model="filter.kelas"
                                                                                :value="4" id="class-xiii"
                                                                                class="radio radio-primary border-4" />
                                                                      <label for="class-xiii">XIII</label>
                                                            </div>
                                                  </div>

                                                  <div>
                                                            <label for="jurusan"
                                                                      class="block mb-2 font-medium text-xl">Jurusan:</label>
                                                            <select id="jurusan" v-model="filter.jurusan"
                                                                      class="select select-primary w-full max-w-xs bg-gray-800 mb-2 border-4">
                                                                      <option value="KA">Kimia Analis</option>
                                                                      <option value="KI">Kimia Industri</option>
                                                                      <option value="OI">Otomasi Industri</option>
                                                                      <option value="PPLG">Pembangkitan Perangkat Lunak
                                                                                & Game</option>
                                                                      <option value="TPTU">Tata Pendinginan Udara
                                                                      </option>
                                                                      <option value="TL">Listrik</option>
                                                                      <option value="TKR">Kendaraan Ringan</option>
                                                                      <option value="LAS">Pengelasan</option>
                                                                      <option value="FAR">Farmasi</option>
                                                                      <option value="MES">Mesin</option>
                                                            </select>
                                                            <div v-if="filter.jurusan === 'KA' || filter.jurusan === 'KI'"
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
                                                            <label for="tanggal"
                                                                      class="block mb-2 font-medium text-xl">Tanggal:</label>
                                                            <input type="date" id="tanggal" v-model="filter.tanggal"
                                                                      class="input input-bordered w-full max-w-xs bg-gray-800 border-2 border-primary focus:ring focus:ring-primary focus:border-primary border-4" />
                                                  </div>
                                        </div>

                                        <button @click="testing">click me to view filters</button>
                              </div>
                              <div class="space-y-6">
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