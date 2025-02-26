<script setup>
import { ref, onMounted } from 'vue';
import { useMotion } from '@vueuse/motion';
import axios from 'axios';
import router from '@/router';

axios.defaults.withCredentials = true;

const showText = ref(false);
const sessionData = ref([]);
const userData = ref([]);

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

});

async function logout() {
  try {
    const response = await axios.post("/api/logout");
    router.push('/');
  } catch (error) {
    console.error(error);
  }
}

</script>

<template>
  <div class="bg-gray-900 flex items-center justify-center min-h-screen">
    <div v-if="showText" v-motion :initial="{ scale: 0, opacity: 0, rotate: -10 }"
      :enter="{ scale: 1, opacity: 1, rotate: 0, transition: { duration: 0.8, ease: 'easeOut', bounce: 0.5 } }"
      class="text-center">
      <p class="text-white text-2xl mb-4" v-motion :initial="{ opacity: 0, y: -50, scale: 0.5 }"
        :enter="{ opacity: 1, y: 0, scale: 1, transition: { delay: 300, duration: 0.8, ease: 'easeOut', bounce: 0.5 } }">
        You are...
      </p>
      <p class="text-green-500 text-6xl font-bold" v-motion :initial="{ opacity: 0, y: 50, scale: 0.5 }"
        :enter="{ opacity: 1, y: 0, scale: 1.2, transition: { delay: 600, duration: 0.8, ease: 'easeOut', bounce: 0.5 } }">
        PRESENT
      </p>
      <button class="text-white cursor-pointer" @click="logout">Log out</button>
    </div>

  </div>
</template>
