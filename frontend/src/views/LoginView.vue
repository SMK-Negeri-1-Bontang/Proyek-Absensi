<script setup>
import { ref, reactive, onMounted } from 'vue'
import router from '@/router'
import bcrypt from 'bcryptjs'
import axios from 'axios'
import { RouterLink } from 'vue-router'

axios.defaults.withCredentials = true
const isSmallScreen = ref(false)

const geolocationError = ref('')
const users = ref([])
const sessionData = ref([])
const userData = ref([])
const form = reactive({
          nama: { content: '', error: false },
          password: { content: '', error: false },
          ontime: false,
          hari: false,
})
const userPosition = reactive({
          latitude: 0.0,
          longitude: 0.0,
          error: '',
})

onMounted(async () => {
          try {
                    const response = await axios.get('/api/users')
                    users.value = response.data
          } catch (error) {
                    console.error(error)
          }

          navigator.geolocation.getCurrentPosition(
                    (position) => {
                              userPosition.latitude = position.coords.latitude
                              userPosition.longitude = position.coords.longitude
                              geolocationError.value = ''
                    },
                    (error) => {
                              console.error(
                                        'Error getting location:',
                                        error.message
                              )
                              geolocationError.value =
                                        'Error getting location: ' +
                                        error.message
                    }
                    
          )
          const mediaQuery = window.matchMedia('(max-width: 639px)')
    isSmallScreen.value = mediaQuery.matches

    mediaQuery.addEventListener('change', (e) => {
        isSmallScreen.value = e.matches
    })
})

function getCurrentDate() {
          const formattedDate = new Date()
                    .toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                    })
                    .split('/')
                    .reverse()
                    .join('-')

          return formattedDate
}
async function getSessionData() {
          try {
                    const response = await axios.get('/api/session')
                    sessionData.value = response.data
                    userData.value = sessionData.value.user
          } catch (error) {
                    console.error(error)
          }
}
async function absen() {
          const now = new Date()
          const waktu = new Date(
                              `1970-01-01 ${new Date().toLocaleTimeString().replace(/ (AM|PM)$/, '')}`
                    )
                              .toTimeString()
                              .split(' ')[0]
          const absenData = {
                    keterangan: '',
                    tanggal: getCurrentDate(),
                    waktu: waktu,
                    id_siswa: userData.value.id,
                    hari: now.getDay(),
          }

          if (waktu >= '06:00:00' && waktu <= '07:05:00') {
                    absenData.keterangan = 'hadir'
          } else if (waktu > '07:05:00' && waktu < '08:00:00') {
                    absenData.keterangan = 'terlambat'
          }

          try {
                    const response = await axios.post('/api/absensi', absenData)
                    console.log('Response:', response.data)
          } catch (error) {
                    console.error(
                              'Error:',
                              error.response
                                        ? error.response.data
                                        : error.message
                    )
          }
}
async function login() {
          form.nama.error = false
          form.password.error = false

          const waktu = new Date(
                              `1970-01-01 ${new Date().toLocaleTimeString().replace(/ (AM|PM)$/, '')}`
                    )
                              .toTimeString()
                              .split(' ')[0]
          const formData = {
                    nama: form.nama.content,
                    password: form.password.content,
                    userPosition: {
                              latitude: userPosition.latitude,
                              longitude: userPosition.longitude,
                    },
          }

          try {
                    const user = users.value.find(
                              (u) =>
                                        u.nama === formData.nama &&
                                        bcrypt.compare(
                                                  formData.password,
                                                  u.password
                                        )
                    )
                    const response = await axios.post('/api/login', formData)

                    if (user.role === 'siswa') {
                              await getSessionData()
                              if (waktu >= '06:00:00' && waktu <= '08:00:00') absen()
                              router.push(`/splash`)
                    } else if (user.role === 'guru') {
                              router.push(`/dashboard`)
                    }
          } catch (error) {
                    const errors = error.response.data.error

                    if (errors.ontime) {
                              form.ontime = true
                    }

                    if (errors.hari) {
                              form.hari = true
                    }

                    if (errors.position) {
                              userPosition.error = errors.position
                    }

                    if (errors.nama) {
                              form.nama.error = true
                    } else if (errors.password) {
                              form.password.error = true
                    }

                    console.error('Error signing up', error)
          }
}
</script>

<template>
          <!--<pre>{{ JSON.stringify(users, null, 2) }}</pre>-->

          <div
          :class="['flex items-center justify-center sm:py-[150px] min-h-screen', isSmallScreen ? 'bg-gray-800' : `bg-[url('@/components/images/kde_mountain.jpg')] bg-cover `]">
                    <div class="w-full max-w-full bg-gray-800 p-8 pt-16 rounded-lg sm:shadow-lg  sm:max-w-md">
                              <img src="/src/components/images/Logo.png" alt="logo" class="h-16 mx-auto mb-2" />
                              <!-- mx-auto mungkin merusakkan sesuatu-->
                              <h1 class="text-2xl font-bold text-center mb-6 text-white">
                                        Log in
                              </h1>

                              <form @submit.prevent="login">
                                        <div class="mb-4">
                                                  <label class="block text-gray-400 text-sm font-bold mb-2"
                                                            for="nama">Nama</label>
                                                  <input class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                                                            type="text" placeholder="Masukkan nama" id="nama"
                                                            name="nama" v-model="form.nama
                                                                      .content
                                                                      " required />
                                                  <p v-if="
                                                            form.nama
                                                                      .error
                                                  " class="text-red-500 text-sm mt-2">
                                                            Nama tidak valid.
                                                  </p>
                                        </div>
                                        <div class="mb-2">
                                                  <label class="block text-gray-400 text-sm font-bold mb-2"
                                                            for="password">Kata Sandi</label>
                                                  <input class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                                                            type="password" id="password" name="password"
                                                            placeholder="Masukkan kata sandi" v-model="form
                                                                      .password
                                                                      .content
                                                                      " required />
                                                  <p v-if="
                                                            form
                                                                      .password
                                                                      .error
                                                  " class="text-red-500 text-sm mt-2">
                                                            Password tidak
                                                            valid.
                                                  </p>
                                                  <p v-if="form.ontime" class="text-red-500 text-sm mt-2">
                                                            Anda hanya bisa
                                                            absen pada jam 6-8
                                                            pagi.
                                                  </p>
                                                  <p v-if="form.hari" class="text-red-500 text-sm mt-2">
                                                            Anda hanya bisa
                                                            absen pada hari
                                                            Senin-Jum'at.
                                                  </p>
                                                  <p v-if="
                                                            userPosition.error
                                                  " class="text-red-500 text-sm mt-2">
                                                            {{
                                                                      userPosition.error
                                                            }}
                                                  </p>
                                                  <p v-if="
                                                            geolocationError
                                                  " class="text-red-500 text-sm mt-2">
                                                            {{
                                                                      geolocationError
                                                            }}
                                                  </p>
                                        </div>

                                        <p class="mb-6 text-sm">
                                                  <RouterLink to="/register" class="text-white">Sign up
                                                            <font-awesome-icon :icon="[
                                                                      'fas',
                                                                      'arrow-right',
                                                            ]" class="text-white" />
                                                  </RouterLink>
                                        </p>

                                        <button class="w-full bg-[linear-gradient(to_right,#734190,#734190,#4a77e0,#4a77e0,#7c95ff,#7c95ff)] hover:bg-[linear-gradient(to_right,#9161b0,#5f8af0,#9db3ff)] text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
                                                  type="submit">
                                                  Masuk
                                        </button>
                              </form>
                    </div>
          </div>
</template>
