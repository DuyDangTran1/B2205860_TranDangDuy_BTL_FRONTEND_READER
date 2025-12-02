<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { refreshToken } from "@/api/Token";

const route = useRoute();
const router = useRouter();

const categoryname = ref(route.params.name);
const books = ref([]);
const CategoryName = ref("");

const page = ref(parseInt(route.query.page) || 1);
const limit = 10;
const count_page = ref(0);

const loadCategoryBooks = async () => {
  try {
    const accessToken = sessionStorage.getItem("accessToken");
    const name = encodeURIComponent(categoryname.value);
    const res = await fetch(
      `http://localhost:3000/api/category/${name}?page=${page.value}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();

    if (data.message === "Token hết hạn hoặc không hợp lệ") {
      const refresh = await refreshToken();
      if (refresh === "oke") return await loadCategoryBooks();
    }

    CategoryName.value = data.CategoryName || "Danh mục";
    books.value = data.CategoryBook || [];
    count_page.value = data.countPage || 0;
    console.log(count_page.value);
  } catch (err) {
    console.error("Lỗi load category:", err);
  }
};

const nextPage = () => {
  if (page.value < count_page.value) page.value++;
  router.push({
    path: `/category/${categoryname.value}`,
    query: { page: page.value, limit },
  });
};

const previousPage = () => {
  if (page.value > 1) page.value--;
  router.push({
    path: `/category/${categoryname.value}`,
    query: { page: page.value, limit },
  });
};

onMounted(loadCategoryBooks);

watch(
  () => [route.params.name, route.query.page],
  async () => {
    categoryname.value = route.params.name;
    page.value = parseInt(route.query.page) || 1;
    await loadCategoryBooks();
  }
);
</script>

<template>
  <Navbar />

  <div class="container-fluid mt-5 pt-3">
    <h2 class="text-center my-4">{{ CategoryName }}</h2>

    <div
      class="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 gx-3 gy-4"
    >
      <div class="col mb-4" v-for="book in books" :key="book._id">
        <router-link :to="`/detail/${book._id}`" class="router-link">
          <div class="card book">
            <img class="card-img-top" :src="book.URL" :alt="book.TENSACH" />
            <div class="card-body text-center">
              <h6 class="card-title wrap-title">{{ book.TENSACH }}</h6>
            </div>
          </div>
        </router-link>
      </div>
      <template v-if="books.length === 0">
        <div class="col-12 text-center py-5">
          <h4>Không có sản phẩm nào trong danh mục này</h4>
        </div>
      </template>
    </div>

    <!-- Pagination -->
    <ul class="pagination justify-content-center">
      <!-- Previous -->
      <li
        class="page-item pagination_btn"
        :class="{ disabled: page.value <= 1 }"
      >
        <a class="page-link" @click.prevent="previousPage">&laquo;</a>
      </li>

      <!-- Page numbers -->
      <li
        class="page-item"
        v-for="p in count_page"
        :key="p"
        :class="{ active: page.value === p }"
      >
        <router-link
          class="page-link"
          :to="{
            path: `/category/${CategoryName.split(' ').join('-')}`,
            query: { page: p, limit },
          }"
        >
          {{ p }}
        </router-link>
      </li>

      <!-- Next -->
      <li
        class="page-item pagination_btn"
        :class="{ disabled: page.value >= count_page.value }"
      >
        <a class="page-link" @click.prevent="nextPage">&raquo;</a>
      </li>
    </ul>
  </div>

  <Footer></Footer>
</template>

<style scoped>
.book {
  height: 450px;
}

.router-link {
  text-decoration: none !important;
  color: #000;
}

.card-img-top {
  height: 300px;
  object-fit: cover;
}

.book:hover {
  transform: scale(1.02);
}

.wrap-title {
  height: 50px;
}

.pagination_btn {
  cursor: pointer;
}
</style>
