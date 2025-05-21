<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'

axios.defaults.withCredentials = true

const router = useRouter()
const sessionData = ref([]);
const userData = ref([]);

defineOptions({ inheritAttrs: false })
onMounted(async () => {
  try {
    const response = await axios.get(`/api/session`);
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
                <div class="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg min-h-[30vh] flex flex-col justify-between">
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

        <div v-bind="$attrs">
                    <slot />
        </div>
      </div>
</template>