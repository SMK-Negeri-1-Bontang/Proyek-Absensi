<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import router from '@/router'
import axios from 'axios'

axios.defaults.withCredentials = true
const isSmallScreen = ref(false)

const form = reactive({
    nama: { content: '', error: false },
    nis: { content: '', error: false },
    password: { content: '', error: false },
    confirmPassword: { content: '', error: false },
    kelas: { content: 1, error: false },
    subdivisi: { content: 'tidak ada', error: false },
    jurusan: { content: 0, error: false },
})
const users = ref([])

onMounted(async () => {
    try {
        const response = await axios.get('/api/users')
        users.value = response.data
    } catch (error) {
        console.error(error)
    }
})

const signup = async () => {
    const formData = {
        nama: form.nama.content.trim(),
        nis: form.nis.content.trim(),
        kelas: form.kelas.content,
        absen: 0,
        subdivisi: form.subdivisi.content,
        id_jurusan: form.jurusan.content,
        password: form.password.content.trim(),
        confirmPassword: form.confirmPassword.content.trim(),
        role: 'siswa',
    }

    form.nama.error = false
    form.nis.error = false
    form.kelas.error = false
    form.subdivisi.error = false
    form.jurusan.error = false
    form.password.error = false
    form.confirmPassword.error = false

    try {
        const response = await axios.post('/api/siswa', formData)
        router.push(`/`)
    } catch (error) {
        console.log(error)

        const errors = error.response?.data?.errors || {}

        form.nama.error = errors.nama || false
        form.nis.error = errors.nis || false
        form.kelas.error = errors.kelas || false
        form.subdivisi.error = errors.subdivisi || false
        form.jurusan.error = errors.jurusan || false
        form.password.error = errors.password || false
        form.confirmPassword.error = errors.confirmPassword || false

        console.error('Error signing up', error)
    }
}

watch(
    () => form.jurusan.content,
    (newVal) => {
        if ((newVal !== 1 || newVal !== 2) && form.subdivisi.content !== 'tidak ada') {
            form.subdivisi.content = 'tidak ada';
        } else if (newVal === 1 || newVal === 2) {
            form.subdivisi.content = 'A';
        }
    }
);
</script>

<template>
    <!--<pre>{{ JSON.stringify(users.siswa, null, 2) }}</pre>-->

    <div
        class="flex items-center justify-center py-[150px] min-h-screen bg-[image:url('@/components/images/kde_mountain.png')] bg-cover">
        <div class="w-full max-w-md bg-gray-800 p-8 pt-16 rounded-lg shadow-lg">
            <img src="@/components/images/Logo.png" alt="logo" class="h-16 mx-auto" />
            <h1 class="text-2xl font-bold text-center mb-6 text-white">
                Sign up
            </h1>

            <form @submit.prevent="signup">
                <div class="mb-4">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="nama">Nama</label>
                    <input
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        type="text" placeholder="Masukkan nama" id="nama" v-model="form.nama
                            .content
                            " />
                    <p v-if="
                        form.nama
                            .error
                    " class="text-red-500 text-sm mt-2">
                        Nama tidak valid
                    </p>
                </div>

                <div class="mb-4">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="nis">NIS</label>
                    <input
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        type="text" placeholder="Masukkan NIS" id="nis" v-model="form.nis
                            .content
                            " />
                    <p v-if="
                        form.nis
                            .error
                    " class="text-red-500 text-sm mt-2">
                        NIS tidak valid
                    </p>
                </div>

                <div class="mb-4">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="password">Kata Sandi</label>
                    <input
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        type="password" placeholder="Masukkan kata sandi" id="password" v-model="form
                            .password
                            .content
                            " />
                    <p v-if="
                        form
                            .password
                            .error
                    " class="text-red-500 text-sm mt-2">
                        Password minimal 8
                        karakter.
                    </p>
                </div>

                <div class="mb-6">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="confirmPassword">Konfirmasi Kata
                        Sandi</label>
                    <input
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        type="password" placeholder="Konfirmasi kata sandi" id="confirmPassword" v-model="form
                            .confirmPassword
                            .content
                            " />
                    <p v-if="
                        form
                            .confirmPassword
                            .error
                    " class="text-red-500 text-sm mt-2">
                        Kata sandi tidak
                        cocok
                    </p>
                </div>

                <div class="flex flex-row gap-2">
                    <div class="mb-2">
                        <label class="block text-gray-400 text-sm font-bold mb-2" for="jurusan">Jurusan</label>
                        <select :class="[
                            'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800',
                            form.jurusan.content == 0 ? 'text-gray-400' : 'text-gray-100', 'border border-white focus:ring-blue-500'
                        ]" id="jurusan" v-model="form
                            .jurusan
                            .content
                            ">
                            <option :value=0 disabled selected hidden>Pilih jurusan anda</option>
                            <option :value="1
                                " class="text-gray-100">
                                Kimia
                                Analis
                            </option>
                            <option :value="2
                                " class="text-gray-100">
                                Kimia
                                Industri
                            </option>
                            <option :value="3
                                " class="text-gray-100">
                                Otomasi
                                Industri
                            </option>
                            <option :value="4
                                " class="text-gray-100">
                                Pengembangan
                                Perangkat
                                Lunak
                                &
                                Gim
                            </option>
                            <option :value="5
                                " class="text-gray-100">
                                Tata
                                Pendinginan
                                Udara
                            </option>
                            <option :value="6
                                " class="text-gray-100">
                                Teknik
                                Listrik
                            </option>
                            <option :value="7
                                " class="text-gray-100">
                                Teknik
                                Kendaraan
                                Ringan
                            </option>
                            <option :value="8
                                " class="text-gray-100">
                                Teknik
                                Pengelasan
                            </option>
                            <option :value="9
                                " class="text-gray-100">
                                Farmasi
                            </option>
                            <option :value="10
                                " class="text-gray-100">
                                Teknik
                                Mesin
                            </option>
                        </select>
                        <p v-if="
                            form
                                .jurusan
                                .error
                        " class="text-red-500 text-sm mt-2">
                            Jurusan
                            tidak
                            valid
                        </p>
                    </div>

                    <div class="mb-2" v-if="
                        form
                            .jurusan
                            .content ===
                        1 ||
                        form
                            .jurusan
                            .content ===
                        2
                    ">
                        <label class="block text-gray-400 text-sm font-bold mb-2" for="subdivisi">A/B</label>
                        <select
                            class="w-22 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-800"
                            id="subdivisi" v-model="form
                                .subdivisi
                                .content
                                ">
                            <option value="tidak ada" hidden disabled selected></option>
                            <option value="A">
                                A
                            </option>
                            <option value="B">
                                B
                            </option>
                        </select>
                        <p v-if="
                            form
                                .subdivisi
                                .error
                        " class="text-red-500 text-sm mt-2">
                            Subdivisi
                            tidak
                            valid
                        </p>
                    </div>

                    <div class="mb-2">
                        <label class="block text-gray-400 text-sm font-bold mb-2" for="kelas">Kelas</label>
                        <select
                            class="w-22 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-800"
                            id="kelas" v-model="form
                                .kelas
                                .content
                                ">
                            <option :value="1
                                ">
                                X
                            </option>
                            <option :value="2
                                ">
                                XI
                            </option>
                            <option :value="3
                                ">
                                XII
                            </option>
                            <option :value="4
                                ">
                                XIII
                            </option>
                        </select>
                        <p v-if="
                            form
                                .kelas
                                .error
                        " class="text-red-500 text-sm mt-2">
                            Kelas
                            tidak
                            valid
                        </p>
                    </div>
                </div>

                <p class="mb-6 text-sm">
                    <RouterLink to="/" class="text-white">Log in
                        <font-awesome-icon :icon="[
                            'fas',
                            'arrow-right',
                        ]" class="text-white" />
                    </RouterLink>
                </p>

                <button
                    class="w-full bg-[linear-gradient(to_right,#734190,#734190,#4a77e0,#4a77e0,#7c95ff,#7c95ff)] hover:bg-[linear-gradient(to_right,#9161b0,#5f8af0,#9db3ff)] text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
                    type="submit">
                    Daftar
                </button>
            </form>
        </div>
    </div>
</template>
