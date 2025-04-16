<script setup>
import { reactive, ref, onMounted } from 'vue'
import router from '@/router'
import { RouterLink } from 'vue-router'
import axios from 'axios'

axios.defaults.withCredentials = true

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
    function trimFields(obj, fields) {
        fields.forEach(field => {
            obj[field].content.trim();
        })
    }
    const formData = form;
    trimFields(formData, ['nama', 'nip', 'password', 'comfirmPassword']);
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
    <div
        class="flex items-center justify-center py-[150px] min-h-screen bg-[image:url('@/components/images/kde_mountain.png')] bg-cover">

        <div class="w-full max-w-md bg-gray-800 p-8 pt-16 rounded-lg shadow-lg">
            <img src="@/components/images/Logo.png" alt="logo" class="h-16 mx-auto" />
            <h1 class="text-2xl font-bold text-center mb-6 text-white">
                Sign up Guru
            </h1>

            <form @submit.prevent="signup">
                <div class="mb-4">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="nama">Nama</label>
                    <input
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        type="text" id="nama" placeholder="Masukkan nama" v-model="form.nama
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
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="nip">NIP</label>
                    <input
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        id="nip" placeholder="Masukkan NIP" v-model="form.nip
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
                        {{ form.password.error }}
                    </p>
                </div>

                <div class="mb-2">
                    <label class="block text-gray-400 text-sm font-bold mb-2" for="confirmPassword">Konfirmasi Kata
                        Sandi</label>
                    <input
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                        type="password" id="confirmPassword" placeholder="Konfirmasi kata sandi" v-model="form
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
