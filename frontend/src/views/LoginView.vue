<script setup>
import { ref, reactive, onMounted } from 'vue';
import VueCookies from 'vue-cookies';
import router from '@/router';
import axios from 'axios';

const form = reactive({
    nama: '',
    password: ''
})

const login = async () => {
    console.log("clicked");

    const formData = {
        nama: form.nama,
        password: form.password
    };

    console.log(formData);

    try {
        const user = users.value.find(u => u.nama === formData.nama && u.password === formData.password);
        const response = await axios.post('/api/login', formData);

        if (user.role === "siswa") {
            router.push(`/splash`);
        } else if (user.role === "guru") {
            router.push(`/dashboard`);
        }
    } catch (error) {
        console.error('Error signing up', error);
    }
};

const users = ref([])

onMounted(async () => {
    try {
        const response = await axios.get("/api/users");
        users.value = response.data;

        console.log(response.data)

    } catch (error) {
        console.error(error);
    }
});

</script>

<template>

    <pre>{{ JSON.stringify(users, null, 2) }}</pre>

    <div
        class="flex items-center justify-center h-screen bg-[image:url('/src/components/images/kde_mountain.png')] bg-cover">
        <div class="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
            <img src="/src/components/images/Logo.png" alt="logo" class="h-16 mx-auto">
            <!-- mx-auto mungkin merusakkan sesuatu-->
            <h1 class="text-2xl font-bold text-center mb-6 text-white">Login</h1>

            <form @submit.prevent="login">
                <div class="mb-4">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="nama">Nama</label>
                    <input
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        type="text" placeholder="Masukkan nama" id="nama" name="nama" v-model="form.nama" required>
                </div>
                <div class="mb-6">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="password">Kata Sandi</label>
                    <input
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        type="password" id="password" name="password" placeholder="Masukkan kata sandi"
                        v-model="form.password" required>
                </div>
                <button class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    type="submit">Masuk</button>
            </form>

        </div>
    </div>
</template>
