<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>

          <button class="bg-red-500 p-4 mr-2 text-white"><RouterLink to="/" >Login</RouterLink></button>
          <button class="bg-red-500 p-4 mr-2 text-white"><RouterLink to="/register" >Signup</RouterLink></button>
          <button class="bg-red-500 p-4 mr-2 text-white"><RouterLink to="/dashboard" >Dashboard</RouterLink></button>
          <button class="bg-red-500 p-4 mr-2 text-white"><RouterLink to="/splash" >Splashscreen</RouterLink></button>
          <button class="bg-red-500 p-4 mr-2 text-white"><RouterLink to="/random" >Error 404</RouterLink></button>

</template>