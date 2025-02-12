<script setup>
import { ref } from 'vue';

const nis = ref('');
const password = ref('');
const login = () => {
    console.log(`Login dengan NIS: ${nis.value}, Password: ${password.value}`);
};
</script>

<template>
    <div class="flex items-center justify-center h-screen bg-[image:url('/src/components/images/kde_mountain.png')] bg-cover">
        <div class="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
            <h1 class="text-2xl font-bold text-center mb-6 text-white">Selamat datang di laman Login</h1>
            <form @submit.prevent="login">
                <div class="mb-4">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="nis">NIS</label>
                    <input class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100" type="text" placeholder="Masukkan NIS" required>
                </div>
                <div class="mb-6">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="password">Password</label>
                    <input  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100" type="password" placeholder="Masukkan Password" required>
                </div class="select-none">
                <div class="flex flex-row gap-2">
                    <div class="mb-6 grow">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="class">Class</label>
                        <select name="class" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-800" required>
                            <option value="X">X</option>
                            <option value="XI">XI</option>
                            <option value="XII">XII</option>
                            <option value="XIII">XIII</option>
                        </select>
                    </div>
                    <div class="mb-6 grow">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="subdivisi">Subdivisi</label>
                        <select name="subdivisi" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-800" required>
                            <option value="A">A</option>
                            <option value="B">B</option>
                        </select>
                    </div>
                    <div class="mb-6 grow">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="major">Major</label>
                        <select name="class" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-800" required>
                            <option value="KA">Kimia Analis</option>
                            <option value="KI">Kimia Industri</option>
                            <option value="OI">Otomasi Industri</option>
                            <option value="PPLG">Pembangkitan Perangkat Lunak & Game</option>
                            <option value="TPTU">Tata Pendinginan Udara</option>
                            <option value="TL">Listrik</option>
                            <option value="TKR">Kendaraan Ringan</option>
                            <option value="LAS">Pengelasan</option>
                            <option value="FAR">Farmasi</option>
                            <option value="MES">Mesin</option>
                        </select>
                    </div>
                </div>
                <button class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" type="submit">Login</button>
            </form>
        </div>
    </div>
</template>
