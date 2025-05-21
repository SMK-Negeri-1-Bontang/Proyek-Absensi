<script setup>
import DashboardBg from "@/components/DashboardBg.vue";
import DashboardFooter from "@/components/DashboardFooter.vue";
import DashboardName from "@/components/DashboardName.vue";
import DashboardNavBar from "@/components/DashboardNavBar.vue";
import DeleteModal from "@/components/DeleteModal.vue";
import axios from "axios";
import { onMounted, reactive, watch } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

axios.defaults.withCredentials = true;

const data = reactive({
  jurusan: [],
});
const form = reactive({
  isEditing: false,
  nama: "",
});
const filter = reactive({
  search: { content: "", focus: false },
});
const confirmDelete = reactive({
  confirming: false,
  id: "",
});

onMounted(async () => {
  try {
    const response = await axios.get("/api/jurusan");
    data.jurusan = response.data.map((a) => ({
      ...a,
      isEditing: false,
      editedKeterangan: String(a.nama),
      isLoading: false,
    }));
  } catch (error) {
    console.error(error);
  }
});

function toggleForm() {
  form.isEditing = true;
}
function cancelForm() {
  form.isEditing = false;
  form.nama = "";
}
function toggleDeleteModal(id) {
  confirmDelete.confirming = true;
  confirmDelete.id = id;
}
function cancelDelete() {
  confirmDelete.confirming = false;
  confirmDelete.id = "";
}
function editKeterangan(id) {
  const jurusan = data.jurusan.find((a) => String(a.id) === String(id));
  jurusan.editedKeterangan = jurusan.nama;
  jurusan.isEditing = true;
}
function cancelEdit(id) {
  const jurusan = data.jurusan.find((a) => String(a.id) === String(id));
  jurusan.isEditing = false;
}
function showLoading(id, seconds = 0.5) {
  return new Promise((resolve) => {
    const jurusan = data.jurusan.find((a) => String(a.id) === String(id));
    if (!jurusan) return resolve(); // Prevent errors if absensi is undefined

    jurusan.isLoading = true;
    setTimeout(() => {
      jurusan.isLoading = false;
      resolve(); // Only resolve after timeout finishes
    }, seconds * 1000);
  });
}
async function createJurusan() {
  try {
    const response = await axios.post("/api/jurusan", form);
    cancelForm();
    refreshJurusan();
  } catch (error) {
    console.error(error);
  }
}
async function searchFilter(socket) {
  if (filter.search.content.trim()) {
    const filteredJurusan = socket.filter((jurusan) =>
      jurusan.nama
        .toLowerCase()
        .includes(filter.search.content.trim().toLowerCase())
    );

    return filteredJurusan;
  } else {
    return socket;
  }
}
async function fetchJurusan(condition = "") {
  try {
    const response = await axios.get(`/api/jurusan${condition}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
async function deleteJurusan(id) {
  try {
    await axios.delete("/api/jurusan", { data: { id } });
    cancelDelete();
    refreshJurusan();
  } catch (error) {
    console.error(error);
  }
}
async function refreshJurusan() {
  const jurusan = await fetchJurusan();
  data.jurusan = jurusan;
}
async function saveEdit(id) {
  const jurusan = data.jurusan.find((a) => String(a.id) === String(id));
  if (!jurusan) return;

  jurusan.isEditing = false;

  // If no change was made, skip the request
  if (jurusan.nama === jurusan.editedKeterangan) {
    return;
  }

  const updatedJurusan = {
    id: jurusan.id,
    nama: jurusan.editedKeterangan,
  };

  try {
    await showLoading(jurusan.id); // Optional: run this before or after request
    await axios.put("/api/jurusan", updatedJurusan);
    refreshJurusan();
  } catch (error) {
    console.error("Failed to update jurusan:", error);
  }
}

watch(filter, async (newVal) => {
  let socket = await fetchJurusan();

  socket = await searchFilter(socket);

  data.jurusan = socket;
});
</script>

<template>
  <DashboardBg>
    <DashboardName
      class="grid grid-cols-5 gap-6 mt-2 mb-2 px-[50px] pt-[20px] pb-[24px]"
    >
      <div class="col-span-4">
        <label for="search" class="block mb-2 font-medium text-xl"
          >Search:</label
        >
        <input
          type="text"
          id="search"
          placeholder="Type here"
          name="search"
          v-model="filter.search.content"
          @focus="filter.search.focus = true"
          @blur="filter.search.focus = false"
          class="input input-bordered input-primary w-full border-4 bg-gray-800"
        />
      </div>
      <button class="btn btn-primary self-end lexend" @click="toggleForm">
        Buat jurusan
      </button>
    </DashboardName>

    <DashboardNavBar currentWindow="jurusan" />

    <div
      v-if="data.jurusan.length"
      class="space-y-6"
      v-for="jurusan in data.jurusan"
      :key="data.jurusan.id"
    >
      <div
        v-if="data && data.jurusan && jurusan && !jurusan.isLoading"
        class="bg-gray-800 p-6 rounded-lg flex justify-between items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700 h-[188px]"
      >
        <div class="w-full">
          <div v-if="jurusan.isEditing" class="flex flex-col gap-4">
            <input
              type="text"
              v-model="jurusan.editedKeterangan"
              class="input input-bordered input-xl input-primary w-full border-4 bg-gray-800 lexend"
              required
            />
            <div class="flex gap-4">
              <button
                @click="toggleDeleteModal(jurusan.id)"
                class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded lexend"
              >
                Delete
              </button>
              <button
                @click="cancelEdit(jurusan.id)"
                class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded lexend"
              >
                Cancel
              </button>
              <button
                @click="saveEdit(jurusan.id)"
                class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded lexend"
              >
                Update
              </button>
            </div>
          </div>

          <div v-else>
            <h1 class="text-4xl font-bold cursor-default">
              {{ jurusan.nama || "Loading..." }}
            </h1>
            <button
              @click="editKeterangan(jurusan.id)"
              class="text-white cursor-pointer"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <div
        v-else
        class="bg-gray-800 p-6 rounded-lg flex justify-center items-center shadow-2xl px-[70px] py-[40px] mb-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:bg-gray-700 min-h-[188px] h-[188px]"
      >
        <PulseLoader color="#570DF8" />
      </div>
    </div>

    <!-- EDIT -->
    <div v-if="form.isEditing">
      <div
        class="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-50"
      ></div>
      <div class="fixed inset-0 flex items-center justify-center z-50">
        <div
          class="bg-gray-800 p-8 rounded-xl shadow-lg w-[450px] border-4 border-indigo-700"
        >
          <h1 class="text-white text-center text-4xl my-5">Buat Jurusan</h1>

          <form
            @submit.prevent="createJurusan"
            class="space-y-4 max-w-lg mx-auto text-white"
          >
            <div>
              <label class="block mb-1 text-white lexend">Nama</label>
              <input
                v-model="form.nama"
                type="text"
                placeholder="Nama"
                class="input input-bordered input-primary w-full border-4 bg-gray-800 lexend"
                required
              />
            </div>

            <div class="flex justify-between mt-6 gap-4">
              <button
                type="submit"
                class="btn btn-primary px-6 py-2 rounded flex-1 lexend"
              >
                Submit
              </button>
              <button
                type="button"
                class="bg-gray-400 hover:bg-gray-500 px-6 py-2 rounded flex-1 lexend"
                @click="cancelForm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <DeleteModal v-if="confirmDelete.confirming">
      Apakah anda ingin menghapus jurusan ini?
      <template #buttons>
        <button
          class="cursor-pointer px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 lexend"
          @click="cancelDelete"
        >
          Cancel
        </button>
        <button
          class="cursor-pointer px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 lexend"
          @click="deleteJurusan(confirmDelete.id)"
        >
          Delete
        </button>
      </template>
    </DeleteModal>
  </DashboardBg>

  <DashboardFooter />
</template>
