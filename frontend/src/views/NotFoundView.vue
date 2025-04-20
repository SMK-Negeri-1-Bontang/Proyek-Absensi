<script setup>
import { reactive } from 'vue';
import { RouterLink } from 'vue-router';

const transition = reactive({
          bg: true,
          text: false,
          img: false,
          shake: false
});

function shake(classes) {
          if (transition.shake) {
                    classes.forEach(group => {
                              document.querySelectorAll(`.${group}`).forEach(tag => {
                                        tag.classList.add('shake');
                              });
                    });
          }
}

setTimeout(() => {
          shake(['img', 'txt']);
}, 1000);
</script>

<template>
    <div :class="['flex justify-center items-center min-h-screen text-white', transition.bg ? 'bg-pulse' : '']">
      <div class="text-center">
        <div class="w-40 sm:w-70 h-auto mx-auto mb-[-20px] sm:mb-[-40px] relative">
          <img
            src="@/components/images/Logo.png"
            alt="Logo"
            :class="['img w-40 sm:w-70 h-auto mx-auto absolute', transition.img ? 'img-pulse' : '']"
            style="--first-opacity: 1; --second-opacity: 0"
          />
          <img
            src="@/components/images/inverted_logo.png"
            alt="Logo"
            :class="['img w-40 sm:w-70 h-auto mx-auto', transition.img ? 'img-pulse' : 'invisible']"
            style="--first-opacity: 0; --second-opacity: 1"
          />
        </div>
  
        <p
          :class="[
            'txt text-white text-[90px] sm:text-[170px] font-bold',
            transition.text ? 'txt-pulse' : ''
          ]"
          style="--first-color: white; --second-color: black;"
        >
          404
        </p>
        <p
          :class="[
            'txt text-white text-xl sm:text-4xl mt-[-30px] sm:mt-[-50px] mb-2',
            transition.text ? 'txt-pulse' : ''
          ]"
          style="--first-color: white; --second-color: black;"
        >
          Page Not Found
        </p>
        <RouterLink
          :class="['txt text-sm sm:text-base', transition.text ? 'txt-pulse' : '']"
          to="/"
          style="--first-color: #9ca3af; --second-color: #111827;"
        >
          Kembali ke laman login
          <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </RouterLink>
      </div>
    </div>
  </template>
  

<style scoped>
.bg-pulse {
          animation: bg-pulse 3s infinite ease-in-out;
}

@keyframes bg-pulse {

          0%,
          100% {
                    background-color: #1f2937;
          }

          50% {
                    background-color: #991B1B;
          }
}

.txt-pulse {
          animation: txt-pulse 3s infinite ease-in-out;
}

@keyframes txt-pulse {

          0%,
          100% {
                    color: var(--first-color);
          }

          50% {
                    color: var(--second-color);
          }
}

.img-pulse {
          animation: img-pulse 3s infinite ease-in-out;
}

@keyframes img-pulse {

          0%,
          100% {
                    opacity: var(--first-opacity);
          }

          50% {
                    opacity: var(--second-opacity);
          }
}

@keyframes shake {
          0% {
                    transform: translate(0, 0);
          }

          10% {
                    transform: translate(-6px, -4px);
                    /* Slightly top-left */
          }

          20% {
                    transform: translate(4px, -5px);
                    /* Slightly bottom-right */
          }

          30% {
                    transform: translate(-3px, 7px);
                    /* Slightly top-right */
          }

          40% {
                    transform: translate(6px, 2px);
                    /* Slightly bottom-left */
          }

          50% {
                    transform: translate(-4px, -6px);
                    /* Slightly top-left */
          }

          60% {
                    transform: translate(5px, -4px);
                    /* Slightly bottom-right */
          }

          70% {
                    transform: translate(-7px, 3px);
                    /* Slightly top-right */
          }

          80% {
                    transform: translate(3px, 6px);
                    /* Slightly bottom-left */
          }

          90% {
                    transform: translate(-5px, -5px);
                    /* Slightly top-left */
          }

          100% {
                    transform: translate(4px, 4px);
                    /* Slightly bottom-right */
          }
}

.shake {
          animation: shake 0.5s ease-in-out infinite;
}
</style>