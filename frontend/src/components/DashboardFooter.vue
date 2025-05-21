<template>
          <footer class="bg-gray-800 shadow-sm dark:bg-gray-900 flex flex-col">
                    <div class="w-full py-[60px] px-[150px]">
                              <div
                                        class="sm:flex sm:items-center sm:justify-between"
                              >
                                        <div
                                                  class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
                                        >
                                                  <img
                                                            src="@/components/images/Logo.png"
                                                            class="h-8"
                                                            alt="Flowbite Logo"
                                                  />
                                                  <h1
                                                            class="self-center text-3xl font-semibold whitespace-nowrap text-white cursor-default"
                                                  >
                                                            Proyek-Absensi
                                                  </h1>
                                        </div>
                                        <ul
                                                  class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-400 sm:mb-0 dark:text-gray-400 hidden"
                                        >
                                                  <li>
                                                            <RouterLink
                                                                      to="#"
                                                                      class="hover:underline me-4 md:me-6"
                                                                      >About</RouterLink
                                                            >
                                                  </li>
                                                  <li>
                                                            <RouterLink
                                                                      to="#"
                                                                      class="hover:underline me-4 md:me-6"
                                                                      >Privacy
                                                                      Policy</RouterLink
                                                            >
                                                  </li>
                                                  <li>
                                                            <RouterLink
                                                                      to="#"
                                                                      class="hover:underline me-4 md:me-6"
                                                                      >Licensing</RouterLink
                                                            >
                                                  </li>
                                                  <li>
                                                            <RouterLink
                                                                      to="#"
                                                                      class="hover:underline"
                                                                      >Contact</RouterLink
                                                            >
                                                  </li>
                                        </ul>
                              </div>
                              <hr
                                        class="my-6 border-gray-500 sm:mx-auto dark:border-gray-700 lg:my-8"
                              />
                              <span
                                        class="cursor-default block text-sm text-gray-400 sm:text-center dark:text-gray-400"
                                        >© 2025
                                        <RouterLink
                                                  to="#"
                                                  class="hover:underline"
                                                  >Proyek-Absensi</RouterLink
                                        >. Diproduksi dan dikembangkan dengan
                                        dedikasi.</span
                              >
                    </div>
          </footer>
</template>
