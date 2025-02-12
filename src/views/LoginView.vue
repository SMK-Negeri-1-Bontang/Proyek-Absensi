<script setup>
import { ref, reactive } from 'vue';

const form = reactive({
    nama: '',
    password: ''
})

const login = () => {
    console.log(form.nama + form.password)
};
</script>

<template>
    <div class="flex items-center justify-center h-screen bg-[image:url('/src/components/images/kde_mountain.png')] bg-cover">
        <div class="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
            <img src="/src/components/images/Logo.png" alt="logo" class="h-16 mx-auto"> <!-- mx-auto mungkin merusakkan sesuatu-->
            <h1 class="text-2xl font-bold text-center mb-6 text-white">Login</h1>



            <form @submit.prevent="login">
                <div class="mb-4">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="nama">Nama</label>
                    <input class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100" type="text" placeholder="Masukkan nama" id="nama" name="nama" v-model="form.nama" required>
                </div>
                <div class="mb-6">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="password">Kata Sandi</label>
                    <input  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100" type="password" id="password" name="password" placeholder="Masukkan kata sandi" v-model="form.password" required>
                </div>
                <button class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" type="submit">Masuk</button>
            </form>



        </div>
    </div>
</template>
