<template>
  <!-- Confirmation Modal -->
  <div
    class="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-50"
  ></div>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div
      class="bg-gray-800 p-6 rounded-xl shadow-lg w-96 border-4 border-indigo-700"
    >
      <h2 class="text-xl font-semibold mb-4">Confirm Deletion</h2>
      <p class="mb-6">
        <slot />
      </p>
      <div class="flex justify-end space-x-4">
        <slot name="buttons"></slot>
      </div>
    </div>
  </div>
</template>
