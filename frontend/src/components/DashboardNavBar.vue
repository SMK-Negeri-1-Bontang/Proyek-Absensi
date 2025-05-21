<script setup>
import { RouterLink } from 'vue-router'
const props = defineProps({
          currentWindow: String,
})
const buttons = [
          { name: 'absensi' },
          { name: 'siswa' },
          { name: 'guru' },
          { name: 'jurusan' },
]

function getButtonClass(name) {
          if (name === props.currentWindow) {
                    return 'btn-primary hover:bg-indigo-500 hover:border-indigo-500'
          } else {
                    return 'bg-gray-800 border-gray-800 text-white hover:bg-gray-700 hover:border-gray-700'
          }
}
</script>

<template>
          <div class="flex gap-4 mb-6">
                    <RouterLink
                              v-for="button in buttons"
                              :key="button.name"
                              :to="`/dashboard/${button.name}`"
                              class="flex-1 flex"
                    >
                              <button
                                        :class="getButtonClass(button.name)"
                                        class="btn btn-xl flex-1 h-24 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1"
                              >
                                        <h1>{{ button.name }}</h1>
                              </button>
                    </RouterLink>
          </div>
</template>
