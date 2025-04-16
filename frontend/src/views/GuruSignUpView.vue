<script setup>
import { reactive, ref, onMounted } from 'vue'
import router from '@/router'
import axios from 'axios'

axios.defaults.withCredentials = true
const isSmallScreen = ref(false)

onMounted(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)')
    isSmallScreen.value = mediaQuery.matches

    mediaQuery.addEventListener('change', (e) => {
        isSmallScreen.value = e.matches
    })
})

const form = reactive({
          nama: { content: '', error: false },
          nip: { content: '', error: false },
          password: { content: '', error: false },
          confirmPassword: { content: '', error: false },
})

const signup = async () => {
          function resetErrorMessage(fields) {
                    fields.forEach(field => {
                              form[field].error = false
                    })
          }
          const formData = form;
          resetErrorMessage(['nama', 'nip', 'password', 'confirmPassword']);

          try {
                    await axios.post('/api/guru', formData)
                    router.push(`/`)
          } catch (error) {
                    console.log(error);

                    // form = error.response.data.form;
                    Object.assign(form, error.response.data.form);

                    console.error('Error signing up', error);
          }
}

</script>

<template>
          <div :class="['flex items-center justify-center sm:py-[150px] min-h-screen', isSmallScreen ? 'bg-gray-800' : bg-[url('@/components/images/kde_mountain.png')] bg-cover]">
                    <div class="w-full max-w-md bg-gray-800 p-8 pt-16 rounded-lg shadow-lg">
                              <h1 class="text-2xl font-bold text-center mb-6 text-white">
                                        Sign up Guru
                              </h1>

                              <form @submit.prevent="signup">
                                        <div class="mb-4">
                                                  <label class="block text-gray-400 text-sm font-bold mb-2"
                                                            for="nama">Nama</label>
                                                  <input class="w-full px-4 py-2 border rounded-lg" type="text"
                                                            id="nama" v-model="form.nama
                                                                      .content
                                                                      " />
                                                  <p v-if="
                                                            form.nama
                                                                      .error
                                                  " class="text-red-500 text-sm mt-2">
                                                            {{ form.nama.error }}
                                                  </p>
                                        </div>

                                        <div class="mb-4">
                                                  <label class="block text-gray-400 text-sm font-bold mb-2"
                                                            for="nip">NIP</label>
                                                  <input class="w-full px-4 py-2 border rounded-lg" type="text" id="nip"
                                                            v-model="form.nip
                                                                      .content
                                                                      " />
                                                  <p v-if="
                                                            form.nip
                                                                      .error
                                                  " class="text-red-500 text-sm mt-2">
                                                            {{ form.nip.error }}
                                                  </p>
                                        </div>

                                        <div class="mb-4">
                                                  <label class="block text-gray-400 text-sm font-bold mb-2"
                                                            for="password">Kata Sandi</label>
                                                  <input class="w-full px-4 py-2 border rounded-lg" type="password"
                                                            id="password" v-model="form
                                                                      .password
                                                                      .content
                                                                      " />
                                                  <p v-if="
                                                            form
                                                                      .password
                                                                      .error
                                                  " class="text-red-500 text-sm mt-2">
                                                            {{ form.password.error }}
                                                  </p>
                                        </div>

                                        <div class="mb-6">
                                                  <label class="block text-gray-400 text-sm font-bold mb-2"
                                                            for="confirmPassword">Konfirmasi Kata
                                                            Sandi</label>
                                                  <input class="w-full px-4 py-2 border rounded-lg" type="password"
                                                            id="confirmPassword" v-model="form
                                                                      .confirmPassword
                                                                      .content
                                                                      " />
                                                  <p v-if="
                                                            form
                                                                      .confirmPassword
                                                                      .error
                                                  " class="text-red-500 text-sm mt-2">
                                                            {{ form.confirmPassword.error }}
                                                  </p>
                                        </div>

                                        <button class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
                                                  type="submit">
                                                  Daftar
                                        </button>
                              </form>
                    </div>
          </div>
</template>
