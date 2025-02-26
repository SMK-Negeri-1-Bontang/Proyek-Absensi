<script setup>
import { reactive, ref, onMounted } from 'vue';
import router from '@/router';
import axios from 'axios';

axios.defaults.withCredentials = true;

onMounted(async () => {
    try {
        const response = await axios.get("/api/siswa");
        users.siswa = response.data;
    } catch (error) {
        console.error(error);
    }

    try {
        const response = await axios.get("/api/guru");
        users.guru = response.data;
    } catch (error) {
        console.error(error);
    }

    try {
        const response = await axios.get("/api/logout");
    } catch (error) {
        console.error(error);
    }
});

const users = reactive({
    siswa: [],
    guru: []
});

function extractValues(array, key) {
    let result = []; // Create an empty array to store values

    for (let i = 0; i < array.length; i++) { // Loop through each object in the array
        let item = array[i]; // Get the current object

        if (item[key] !== undefined) { // Check if the object has the given key
            result.push(item[key]); // Add the value to the result array
        }
    }

    return result; // Return the array with extracted values
}

function containsValue(array, searchString) {
    for (let i = 0; i < array.length; i++) { // Loop through each item in the array
        if (array[i] === searchString) { // Check if the item matches the string
            return true; // If found, return true
        }
    }
    return false; // If no match is found, return false
}

const form = reactive({
    nama: { content: '', error: false },
    nis: { content: '', error: false },
    password: { content: '', error: false },
    confirmPassword: { content: '', error: false },
    kelas: { content: 0, error: false },
    subdivisi: { content: 'tidak ada', error: false },
    jurusan: { content: 0, error: false }
});

function validate() {
    let notValid = 0;

    const namaUsers = extractValues(users.siswa, "nama").concat(extractValues(users.guru, "nama"));
    if (containsValue(namaUsers, form.nama.content) || form.nama.content.length > 100) {
        form.nama.error = true;
        notValid++;
    } else {
        form.nama.error = false;
    }

    const nisUsers = extractValues(users.siswa, "nis");
    const nisNumber = Number(form.nis.content);

    if (!form.nis.content.trim() || isNaN(nisNumber) || form.nis.content.length > 100 || containsValue(nisUsers, form.nis.content)) {
        form.nis.error = true;
        notValid++;
    } else {
        form.nis.error = false;
    }

    if (form.password.content.length < 8) {
        form.password.error = true;
        notValid++;
    } else {
        form.password.error = false;
    }

    if (form.confirmPassword.content !== form.password.content) {
        form.confirmPassword.error = true;
        notValid++;
    } else {
        form.confirmPassword.error = false;
    }

    if (!form.kelas.content) {
        form.kelas.error = true;
        notValid++;
    } else {
        form.kelas.error = false;
    }

    if (!form.jurusan.content) {
        form.jurusan.error = true;
        notValid++;
    } else {
        form.jurusan.error = false;
    }

    if ((form.jurusan.content === 1 || form.jurusan.content === 2) && !form.subdivisi.content.trim()) {
        form.subdivisi.error = true;
        notValid++;
    } else {
        form.subdivisi.error = false;
    }

    return notValid === 0;
}

const signup = async () => {
    if (validate()) {
        const formData = {
            nama: form.nama.content,
            nis: form.nis.content,
            kelas: form.kelas.content,
            absen: 0,
            subdivisi: form.subdivisi.content,
            id_jurusan: form.jurusan.content,
            password: form.password.content
        };

        try {
            const response = await axios.post('/api/siswa', formData);
            router.push(`/`);
        } catch (error) {
            console.error('Error signing up', error);
        }
    }
};

</script>

<template>

    <!--<pre>{{ JSON.stringify(users.siswa, null, 2) }}</pre>-->

    <div
        class="flex items-center justify-center py-[150px] min-h-screen bg-[image:url('@/components/images/kde_mountain.png')] bg-cover">
        <div class="w-full max-w-md bg-gray-800 p-8 pt-16 rounded-lg shadow-lg">
            <img src="@/components/images/Logo.png" alt="logo" class="h-16 mx-auto">
            <h1 class="text-2xl font-bold text-center mb-6 text-white">Sign-up</h1>

            <form @submit.prevent="signup">
                <div class="mb-4">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="nama">Nama</label>
                    <input
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        type="text" placeholder="Masukkan nama" id="nama" v-model="form.nama.content">
                    <p v-if="form.nama.error" class="text-red-500 text-sm mt-2">Nama tidak valid</p>
                </div>

                <div class="mb-4">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="nis">NIS</label>
                    <input
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        type="text" placeholder="Masukkan NIS" id="nis" v-model="form.nis.content">
                    <p v-if="form.nis.error" class="text-red-500 text-sm mt-2">NIS tidak valid</p>
                </div>

                <div class="mb-4">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="password">Kata Sandi</label>
                    <input
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        type="password" placeholder="Masukkan kata sandi" id="password" v-model="form.password.content">
                    <p v-if="form.password.error" class="text-red-500 text-sm mt-2">Password tidak valid</p>
                </div>

                <div class="mb-6">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="confirmPassword">Konfirmasi Kata
                        Sandi</label>
                    <input
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        type="password" placeholder="Konfirmasi kata sandi" id="confirmPassword"
                        v-model="form.confirmPassword.content">
                    <p v-if="form.confirmPassword.error" class="text-red-500 text-sm mt-2">Kata sandi tidak
                        cocok</p>
                </div>

                <div class="flex flex-row gap-2">




                    <div class="mb-2">
                        <label class="block text-gray-400 text-sm font-bold mb-2" for="jurusan">Jurusan</label>
                        <select
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-800"
                            id="jurusan" v-model="form.jurusan.content">
                            <option :value="1">Kimia Analis</option>
                            <option :value="2">Kimia Industri</option>
                            <option :value="3">Otomasi Industri</option>
                            <option :value="4">Pengembangan Perangkat Lunak & Game</option>
                            <option :value="5">Tata Pendinginan Udara</option>
                            <option :value="6">Teknik Listrik</option>
                            <option :value="7">Teknik Kendaraan Ringan</option>
                            <option :value="8">Teknik Pengelasan</option>
                            <option :value="9">Farmasi</option>
                            <option :value="10">Teknik Mesin</option>
                        </select>
                        <p v-if="form.jurusan.error" class="text-red-500 text-sm mt-2">Jurusan tidak valid</p>
                    </div>

                    <div class="mb-2" v-if="form.jurusan.content === 1 || form.jurusan.content === 2">
                        <label class="block text-gray-400 text-sm font-bold mb-2" for="subdivisi">A/B</label>
                        <select
                            class="w-22 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-800"
                            id="subdivisi" v-model="form.subdivisi.content">
                            <option value="tidak ada"></option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                        </select>
                        <p v-if="form.subdivisi.error" class="text-red-500 text-sm mt-2">Subdivisi tidak valid</p>
                    </div>

                    <div class="mb-2">
                        <label class="block text-gray-400 text-sm font-bold mb-2" for="kelas">Kelas</label>
                        <select
                            class="w-22 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-800"
                            id="kelas" v-model="form.kelas.content">
                            <option :value="1">X</option>
                            <option :value="2">XI</option>
                            <option :value="3">XII</option>
                            <option :value="4">XIII</option>
                        </select>
                        <p v-if="form.kelas.error" class="text-red-500 text-sm mt-2">Kelas tidak valid</p>
                    </div>

                </div>

                <p class="mb-6 text-sm"><RouterLink to="/" class="text-white">Log in ></RouterLink></p>

                <button
                    class="w-full bg-[linear-gradient(to_right,#734190,#734190,#4a77e0,#4a77e0,#7c95ff,#7c95ff)] hover:bg-[linear-gradient(to_right,#9161b0,#5f8af0,#9db3ff)] text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
                    type="submit">
                    Masuk
                </button>
            </form>


        </div>
    </div>
</template>
