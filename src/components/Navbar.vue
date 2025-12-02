<script setup>
import Profile from "./Profile.vue";
import { ref, onMounted, watch } from "vue";
import { refreshToken } from "@/api/Token";
import { useRouter } from "vue-router";

const categories = ref([]);
const books = ref([]);
const accessToken = sessionStorage.getItem("accessToken");

const searchQuery = ref("");
const searchResults = ref([]);
const router = useRouter();

async function getAllBook() {
  try {
    const res = await fetch(`http://localhost:3000/api/getAllBook`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    });
    const data = await res.json();
    if (data.message === "Token hết hạn hoặc không hợp lệ") {
      const refresh = await refreshToken();
      if (refresh == "oke") return await getAllBook();
    }
    books.value = data.books || [];
  } catch (error) {}
}

async function getAllCategories() {
  try {
    const res = await fetch(`http://localhost:3000/api/getallcategories`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    });
    const data = await res.json();
    if (data.message === "Token hết hạn hoặc không hợp lệ") {
      const refresh = await refreshToken();
      if (refresh == "oke") return await getAllCategories();
    }
    categories.value = data.categories || [];
  } catch (error) {}
}

onMounted(async () => {
  await getAllCategories();
  await getAllBook();
});

// watch input để lọc sách
watch(searchQuery, (val) => {
  if (!val) return (searchResults.value = []);
  const q = val.toLowerCase();
  searchResults.value = books.value.filter((b) =>
    b.TENSACH.toLowerCase().includes(q)
  );
});

function goToBookDetail(id) {
  searchQuery.value = "";
  searchResults.value = [];
  router.push(`/detail/${id}`);
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light fixed-top">
    <div class="container-fluid">
      <a class="navbar-brand text-white ms-5 fw-bold text-white fs-3" href=""
        >TT</a
      >
      <div class="d-flex me-5 pe-5">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <span class="ms-5 ps-5"></span>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              class="nav-link active text-white ms-5 px-3"
              :to="{ name: 'Home' }"
              >Trang chủ</router-link
            >
          </li>

          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle text-white ms-5 px-3"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Thể loại
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li v-for="category in categories" :key="category._id">
                <router-link
                  class="dropdown-item"
                  :to="`/category/${category.TENTHELOAI.split(' ').join('-')}`"
                >
                  {{ category.TENTHELOAI }}
                </router-link>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <router-link
              class="nav-link active text-white ms-5 px-3"
              :to="{ name: 'About' }"
              >Giới thiệu</router-link
            >
          </li>
        </ul>

        <!-- giữ nguyên form hiện tại, thêm dropdown bên dưới -->
        <form class="d-flex position-relative">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            v-model="searchQuery"
          />
          <button
            class="btn btn-outline-success btn_search me-lg-5"
            type="button"
          >
            Tìm kiếm
          </button>

          <!-- dropdown hiện danh sách sách tìm thấy -->
          <div
            v-if="searchResults.length"
            class="position-absolute bg-white shadow rounded w-100 mt-1"
            style="
              top: 100%;
              left: 0;
              z-index: 9999;
              max-height: 300px;
              overflow-y: auto;
            "
          >
            <div
              v-for="book in searchResults"
              :key="book._id"
              class="d-flex align-items-center px-3 py-2 search-item"
              @click="goToBookDetail(book._id)"
            >
              <img
                :src="book.URL"
                alt="cover"
                class="me-2"
                style="width: 40px; height: 50px; object-fit: cover"
              />
              <span>{{ book.TENSACH }}</span>
            </div>
          </div>
        </form>
      </div>

      <Profile class="profile"></Profile>
    </div>
  </nav>
</template>

<style scoped>
form.d-flex {
  position: relative;
  padding-right: 5%;
}

.btn_search {
  width: 150px;
  z-index: 1;
}

.navbar {
  position: relative;
  background-color: #76b3c6;
}

.profile {
  position: absolute;
  top: 8px;
  right: 0.1%;
}

.search-item {
  cursor: pointer;
}
.search-item:hover {
  background-color: #f0f0f0;
}

@media only screen and (max-width: 992px) {
  form.d-flex {
    padding-right: 0;
  }
}
</style>
