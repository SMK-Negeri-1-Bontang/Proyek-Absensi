<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useMotion } from '@vueuse/motion';
import axios from 'axios';
import router from '@/router';

axios.defaults.withCredentials = true;

const showText = ref(false);
const sessionData = ref([]);
const userData = ref([]);
const absenData = ref([]);
const statusColors = reactive({
  hadir: "text-[#00FF7F]",
  terlambat: "text-[#FF1A1A]",
  menunggu: "text-white",
  izin: "text-[#FFD700]",
  alpha: "text-[#FF1A1A]"
});

onMounted(async () => {
  setTimeout(() => {
    showText.value = true;
  }, 500);

  try {
    const response = await axios.get("/api/session");
    sessionData.value = response.data;
    userData.value = sessionData.value.user;
  } catch (error) {
    console.error(error);
  }

  getAbsenData();
});

async function logout() {
  try {
    const response = await axios.post("/api/logout");
    router.push('/');
  } catch (error) {
    console.error(error);
  }
}
async function getAbsenData() {
  try {
    const response = await axios.get(`api/absensi?tanggal=${new Date().toISOString().split("T")[0]}&id_siswa=${userData.value.id}`);
    absenData.value = response.data[0];
    console.log(absenData.value);
  } catch (error) {
    console.error(error);
  }
}

console.log(new Date(`1970-01-01 ${new Date().toLocaleTimeString().replace(/ (AM|PM)$/, "")}`).toTimeString().split(" ")[0]);
</script>

<template>
  <div class="bg-gray-900 flex items-center justify-center min-h-screen">
    <div v-if="showText" v-motion :initial="{ scale: 0, opacity: 0, rotate: -10 }"
      :enter="{ scale: 1, opacity: 1, rotate: 0, transition: { duration: 0.8, ease: 'easeOut', bounce: 0.5 } }"
      class="text-center">
      <p class="text-white text-2xl" v-motion :initial="{ opacity: 0, y: -50, scale: 0.5 }"
        :enter="{ opacity: 1, y: 0, scale: 1, transition: { delay: 300, duration: 0.8, ease: 'easeOut', bounce: 0.5 } }">
        Anda...
      </p>
      <h1 :class="`${statusColors[absenData.keterangan]} text-6xl font-bold`" v-motion :initial="{ opacity: 0, y: 50, scale: 0.5 }"
        :enter="{ opacity: 1, y: 0, scale: 1.2, transition: { delay: 600, duration: 0.8, ease: 'easeOut', bounce: 0.5 } }">
        {{ absenData.keterangan.toUpperCase() }}
    </h1>
      <button class="text-white cursor-pointer" @click="logout">Log out</button>
    </div>

  </div>
</template>
