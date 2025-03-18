<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useMotion } from '@vueuse/motion';
import axios from 'axios';
import router from '@/router';

axios.defaults.withCredentials = true;

const showSplash = ref(true);
const showText = ref(false);
const sessionData = ref([]);
const userData = ref([]);
const absenData = ref([]);
const statusColors = reactive({
  hadir: "text-[#00FF7F]",
  terlambat: "text-[#FF1A1A]",
  menunggu: "text-white",
  izin: "text-[#FFD700]",
  alpha: "text-[#570DF8]"
});

onMounted(async () => {
  setTimeout(() => {
    showSplash.value = false;
    showText.value = true;
  }, 2000); // Durasi splash screen 2 detik

  try {
    const response = await axios.get("/api/session");
    sessionData.value = response.data;
    userData.value = sessionData.value.user;
  } catch (error) {
    console.error(error);
  }

  getAbsenData();
});

function getCurrentDate() {
    const formattedDate =  new Date().toLocaleDateString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).split("/").reverse().join("-");

    return formattedDate;
}

async function logout() {
  try {
    await axios.post("/api/logout");
    router.push('/');
  } catch (error) {
    console.error(error);
  }
}

async function getAbsenData() {
  try {
    const response = await axios.get(`api/absensi?tanggal=${getCurrentDate()}&id_siswa=${userData.value.id}`);
    absenData.value = response.data[0];
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="bg-gray-900 flex items-center justify-center min-h-screen">
    <!-- Splash Screen -->
    <div v-if="showSplash" class="fixed inset-0 flex items-center justify-center bg-gray-900">
      <h1 class="text-white text-4xl font-bold animate-pulse">Loading...</h1>
    </div>
    
    <!-- Main Content -->
    <div v-if="showText" v-motion :initial="{ scale: 0, opacity: 0, rotate: -10 }"
      :enter="{ scale: 1, opacity: 1, rotate: 0, transition: { duration: 0.8, ease: 'easeOut', bounce: 0.5 } }"
      class="text-center">
      <p class="text-white text-2xl" v-motion :initial="{ opacity: 0, y: -50, scale: 0.5 }"
        :enter="{ opacity: 1, y: 0, scale: 1, transition: { delay: 300, duration: 0.8, ease: 'easeOut', bounce: 0.5 } }">
        Anda...
      </p>
      <h1 v-motion="absenData.keterangan === 'hadir' ? { initial: { scale: 0.5 }, enter: { scale: 1.5, transition: { duration: 0.8, ease: 'easeOut' } } } : {}"
        :class="`${statusColors[absenData.keterangan]} text-6xl font-bold`">
        {{ absenData.keterangan.toUpperCase() }}
      </h1>
      <button class="text-white cursor-pointer" @click="logout">Log out</button> <!--  PLACEHOLDER FOR TESTING ( ERASE ) -->
    </div>
  </div>
</template>