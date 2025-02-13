<script setup>
import { reactive, ref } from 'vue';

const form = reactive({
    nama: '',
    nis: '',
    password: '',
    confirmPassword: '',
    kelas: 0,
    subdivisi: '',
    jurusan: ''
});

const errorMessage = ref('');

const signup = () => {
    if (form.password !== form.confirmPassword) {
        errorMessage.value = 'Kata sandi tidak cocok!';
        return;
    }
    errorMessage.value = ''; // Reset pesan error jika tidak ada kesalahan
    console.log(form);
};
</script>

<template>
    <div
        class="flex items-center justify-center min-h-screen bg-[image:url('/src/components/images/kde_mountain.png')] bg-cover">
        <div class="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
            <img src="/src/components/images/Logo.png" alt="logo" class="h-16 mx-auto">
            <h1 class="text-2xl font-bold text-center mb-6 text-white">Sign-up</h1>

            <form @submit.prevent="signup">
                <div class="mb-4">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="nama">Nama</label>
                    <input
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        type="text" placeholder="Masukkan nama" id="nama" required v-model="form.nama">
                </div>

                <div class="mb-4">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="nis">NIS</label>
                    <input
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        type="text" placeholder="Masukkan NIS" id="nis" required v-model="form.nis">
                </div>

                <div class="mb-4">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="password">Kata Sandi</label>
                    <input
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        type="password" placeholder="Masukkan kata sandi" id="password" required v-model="form.password">
                </div>

                <div class="mb-6">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="confirmPassword">Konfirmasi Kata Sandi</label>
                    <input
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        type="password" placeholder="Konfirmasi kata sandi" id="confirmPassword" required v-model="form.confirmPassword">
                    <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
                </div>

                <div class="flex flex-row gap-2">
                    <div class="mb-6">
                        <label class="block text-gray-400 text-sm font-bold mb-2" for="kelas">Kelas</label>
                        <select class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-800" id="kelas"
                            required v-model="form.kelas">
                            <option :value="1">X</option>
                            <option :value="2">XI</option>
                            <option :value="3">XII</option>
                            <option :value="4">XIII</option>
                        </select>
                    </div>

                    <div class="mb-6">
                        <label class="block text-gray-400 text-sm font-bold mb-2" for="subdivisi">Subdivisi</label>
                        <select class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-800" id="subdivisi"
                            required v-model="form.subdivisi">
                            <option value="none"></option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                        </select>
                    </div>

                    <div class="mb-6">
                        <label class="block text-gray-400 text-sm font-bold mb-2" for="jurusan">Jurusan</label>
                        <select class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-800" id="jurusan"
                            required v-model="form.jurusan">
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

                <button class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    type="submit">Masuk</button>
            </form>
        </div>
    </div>
</template>
