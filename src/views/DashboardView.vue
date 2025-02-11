<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

onMounted(async () => {
          try {
                    const response = await axios.get("/api/siswa");
                    siswa.value = response.data;

          } catch (error) {
                    console.error(error);
          }
});

const siswa = ref([]);
</script>

<template>
          <div class="bg-gray-900 text-white min-h-screen">
                    <div class="container mx-auto py-[150px]">
                              <div class="flex justify-between items-center mb-6">
                                        <div class="flex items-center">
                                                  <i class="fas fa-user-circle text-3xl mr-2"></i>
                                                  <span class="text-lg font-medium text-3xl">Juno Iceclub</span>
                                        </div>
                                        <div>
                                                  <i class="fas fa-sign-out-alt text-3xl"></i>
                                        </div>
                              </div>
                              <div class="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg">
                                        <div class="grid grid-cols-4 gap-6 mt-2 px-[50px] pt-[20px] pb-[24px]">
                                                  <div>
                                                            <label for="nis"
                                                                      class="block mb-2 font-medium text-xl">NIS:</label>
                                                            <input type="text" id="nis" placeholder="Type NIS"
                                                                      class="input input-bordered input-primary w-full max-w-xs bg-gray-800" />
                                                  </div>
                                                  <div>
                                                            <label for="class"
                                                                      class="block mb-2 font-medium text-xl">Class:</label>
                                                            <div class="flex items-center space-x-4">
                                                                      <input type="radio" name="class" id="class-x"
                                                                                class="radio radio-primary" checked />
                                                                      <label for="class-x">X</label>

                                                                      <input type="radio" name="class" id="class-xi"
                                                                                class="radio radio-primary" />
                                                                      <label for="class-xi">XI</label>

                                                                      <input type="radio" name="class" id="class-xii"
                                                                                class="radio radio-primary" />
                                                                      <label for="class-xii">XII</label>

                                                                      <input type="radio" name="class" id="class-xiii"
                                                                                class="radio radio-primary" />
                                                                      <label for="class-xiii">XIII</label>
                                                            </div>
                                                  </div>

                                                  <div>
                                                            <label for="jurusan"
                                                                      class="block mb-2 font-medium text-xl">Jurusan:</label>
                                                            <select id="jurusan"
                                                                      class="select select-primary w-full max-w-xs bg-gray-800 mb-2">
                                                                      <option disabled selected>What is the best TV
                                                                                show?</option>
                                                                      <option>Game of Thrones</option>
                                                                      <option>Lost</option>
                                                                      <option>Breaking Bad</option>
                                                                      <option>Walking Dead</option>
                                                            </select>
                                                            <div class="flex items-center space-x-2 mt-2">
                                                                      <input type="radio" id="jurusan-a" name="jurusan"
                                                                                class="radio radio-primary" />
                                                                      <label for="jurusan-a">A</label>

                                                                      <input type="radio" id="jurusan-b" name="jurusan"
                                                                                class="radio radio-primary" />
                                                                      <label for="jurusan-b">B</label>
                                                            </div>

                                                  </div>
                                                  <div>
                                                            <label for="tanggal"
                                                                      class="block mb-2 font-medium text-xl">Tanggal:</label>
                                                            <input type="date" id="tanggal"
                                                                      class="input input-bordered w-full max-w-xs bg-gray-800 border-2 border-primary focus:ring focus:ring-primary focus:border-primary" />

                                                  </div>
                                        </div>
                              </div>
                              <div class="space-y-4">
                                        <div
                                                  class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-lg px-[70px] py-[40px]">
                                                  <div>
                                                            <h1 class="text-4xl font-bold">Delphi Zoe</h1>
                                                            <p class="text-gray-400">Computer Science</p>
                                                            <p class="text-gray-500">12492372957295</p>
                                                  </div>
                                                  <div class="text-right">
                                                            <p class="text-green-400 text-6xl font-bold">PRESENT</p>
                                                            <p class="text-gray-400">06:14:53 | Wednesday, 15 January
                                                                      2077</p>
                                                  </div>
                                        </div>
                                        <div
                                                  class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-lg px-[70px] py-[40px]">
                                                  <div>
                                                            <h1 class="text-4xl font-bold">Ryan Tamara</h1>
                                                            <p class="text-gray-400">Industry Automation</p>
                                                            <p class="text-gray-500">12492372957295</p>
                                                  </div>
                                                  <div class="text-right">
                                                            <p class="text-red-500 text-6xl font-bold">LATE</p>
                                                            <p class="text-gray-400">06:14:53 | Wednesday, 15 January
                                                                      2077</p>
                                                  </div>
                                        </div>
                                        <div
                                                  class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-lg px-[70px] py-[40px]">
                                                  <div>
                                                            <h1 class="text-4xl font-bold">Dorime Ameno</h1>
                                                            <p class="text-gray-400">Industrial Chemistry</p>
                                                            <p class="text-gray-500">12492372957295</p>
                                                  </div>
                                                  <div class="text-right">
                                                            <p class="text-white text-6xl font-bold">AWAITING</p>
                                                            <p class="text-gray-400">06:14:53 | Wednesday, 15 January
                                                                      2077</p>
                                                  </div>
                                        </div>
                                        <div
                                                  class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-lg px-[70px] py-[40px]">
                                                  <div>
                                                            <h1 class="text-4xl font-bold">Jennifer D. Vulkan</h1>
                                                            <p class="text-gray-400">Chemistry Analyst</p>
                                                            <p class="text-gray-500">12492372957295</p>
                                                  </div>
                                                  <div class="text-right">
                                                            <p class="text-yellow-500 text-6xl font-bold">PERMISSION</p>
                                                            <p class="text-gray-400">06:14:53 | Wednesday, 15 January
                                                                      2077</p>
                                                  </div>
                                        </div>
                                        <div
                                                  class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-lg px-[70px] py-[40px]">
                                                  <div>
                                                            <h1 class="text-4xl font-bold">Ran Dee</h1>
                                                            <p class="text-gray-400">Vehicle Engineering</p>
                                                            <p class="text-gray-500">12492372957295</p>
                                                  </div>
                                                  <div class="text-right">
                                                            <p class="text-green-500 text-6xl font-bold">ALFA</p>
                                                            <p class="text-gray-400">06:14:53 | Wednesday, 15 January
                                                                      2077</p>
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