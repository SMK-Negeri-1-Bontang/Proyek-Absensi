<script setup>
import { reactive, ref, onMounted } from 'vue';
import router from '@/router';
import axios from 'axios';

axios.defaults.withCredentials = true;

const form = reactive({
    nama: { content: '', error: false },
    nip: { content: '', error: false },
    password: { content: '', error: false },
    confirmPassword: { content: '', error: false },
    mataPelajaran: { content: '', error: false }
});
const users = ref([]);

onMounted(async () => {
    try {
        const response = await axios.get("/api/guru");
        users.value = response.data;
    } catch (error) {
        console.error(error);
    }
});

const signup = async () => {
    const formData = {
        nama: form.nama.content,
        nip: form.nip.content,
        mataPelajaran: form.mataPelajaran.content,
        password: form.password.content,
        confirmPassword: form.confirmPassword.content,
        role: 'guru'
    };

    form.nama.error = false;
    form.nip.error = false;
    form.mataPelajaran.error = false;
    form.password.error = false;
    form.confirmPassword.error = false;

    try {
        await axios.post('/api/guru', formData);
        router.push(`/`);
    } catch (error) {
        console.log(error)

        const errors = error.response?.data?.errors || {};

        form.nama.error = errors.nama || false;
        form.nip.error = errors.nip || false;
        form.mataPelajaran.error = errors.mataPelajaran || false;
        form.password.error = errors.password || false;
        form.confirmPassword.error = errors.confirmPassword || false;

        console.error('Error signing up', error);
    }
};
</script>

<template>
    <div class="flex items-center justify-center py-[150px] min-h-screen bg-cover">
        <div class="w-full max-w-md bg-gray-800 p-8 pt-16 rounded-lg shadow-lg">
            <h1 class="text-2xl font-bold text-center mb-6 text-white">Sign up Guru</h1>

            <form @submit.prevent="signup">
                <div class="mb-4">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="nama">Nama</label>
                    <input class="w-full px-4 py-2 border rounded-lg" type="text" id="nama" v-model="form.nama.content">
                    <p v-if="form.nama.error" class="text-red-500 text-sm mt-2">Nama tidak valid</p>
                </div>

                <div class="mb-4">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="nip">NIP</label>
                    <input class="w-full px-4 py-2 border rounded-lg" type="text" id="nip" v-model="form.nip.content">
                    <p v-if="form.nip.error" class="text-red-500 text-sm mt-2">NIP tidak valid</p>
                </div>

                <div class="mb-4">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="password">Kata Sandi</label>
                    <input class="w-full px-4 py-2 border rounded-lg" type="password" id="password"
                        v-model="form.password.content">
                    <p v-if="form.password.error" class="text-red-500 text-sm mt-2">Password minimal 8 karakter.</p>
                </div>

                <div class="mb-6">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="confirmPassword">Konfirmasi Kata
                        Sandi</label>
                    <input class="w-full px-4 py-2 border rounded-lg" type="password" id="confirmPassword"
                        v-model="form.confirmPassword.content">
                    <p v-if="form.confirmPassword.error" class="text-red-500 text-sm mt-2">Kata sandi tidak cocok</p>
                </div>

                <button class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
                    type="submit">
                    Daftar
                </button>
            </form>
        </div>
    </div>
</template>