<script setup>
import { ref } from 'vue';

const nis = ref('');
const password = ref('');
const login = () => {
    console.log(`Login dengan NIS: ${nis.value}, Password: ${password.value}`);
};
</script>

<template>
    <div class="flex items-center justify-center h-screen bg-gray-900">
        <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h1 class="text-2xl font-bold text-center mb-6">Selamat datang di laman Login</h1>
            <form @submit.prevent="login">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="nis">NIS</label>
                    <input v-model="nis" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder="Masukkan NIS" required>
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
                    <input v-model="password" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" placeholder="Masukkan Password" required>
                </div>
                <button class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" type="submit">Login</button>
            </form>
        </div>
    </div>
</template>
