<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import Banner from "@/components/Banner.vue";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import { refreshToken } from "@/api/Token";
const route = useRoute();
const router = useRouter();
const isPreviousBtn = ref(false);

const nextShow = computed(() =>
  !isPreviousBtn.value ? "show_btn" : "hidden_btn"
);

const previousShow = computed(() =>
  isPreviousBtn.value ? "show_btn" : "hidden_btn"
);

const book_screen = ref([]);
const newBook = ref([]);
const favoritebook = ref([]);
const show_favoritebook = ref([]);
const page = ref(
  parseInt(route.query.page) >= 1 ? parseInt(route.query.page) : 1
);
const count_page = ref(0);
const limit = 8;

function changePreviousStatus() {
  isPreviousBtn.value = !isPreviousBtn.value;
}

const loadData = async () => {
  try {
    const accessToken = sessionStorage.getItem("accessToken");
    const res = await fetch(
      `http://localhost:3000/?page=${page.value}&limit=${limit}`,
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
      if (refresh == "oke") return await loadData();
    }

    return data || {};
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
    return {};
  }
};

const nextPage = () => {
  page.value = page.value < count_page.value ? ++page.value : page.value;
  router.push({
    path: "/",
    query: {
      page: page.value,
      limit: limit,
    },
  });
};

const previousPage = () => {
  page.value = page.value > 1 ? --page.value : page.value;
  router.push({
    path: "/",
    query: {
      page: page.value,
      limit: limit,
    },
  });
};

onMounted(async () => {
  const result = await loadData();
  book_screen.value = result.bookPage || [];
  count_page.value = result.countPage || 0;
  favoritebook.value = result.favoriteBook || [];
  newBook.value = result.newBook || [];
  console.log(favoritebook.value);
});

watch(
  () => route.query.page,
  async (newPage) => {
    page.value = parseInt(newPage) || 1;
    const result = await loadData();
    book_screen.value = result.bookPage || [];
    count_page.value = result.countPage || 0;
    newBook.value = result.newBook;
  }
);

watch(
  [favoritebook, isPreviousBtn],
  () => {
    if (!isPreviousBtn.value) {
      show_favoritebook.value = favoritebook.value.slice(0, 5);
    } else {
      show_favoritebook.value = favoritebook.value.slice(5, 10);
    }
    console.log(show_favoritebook.value);
  },
  { immediate: true }
);
</script>

<template>
  <Navbar></Navbar>
  <div class="container-fluid row mx-0 mt-5 pt-3 px-0">
    <div class="col-12 mt-4 px-0 wrap mx-auto">
      <div class="col-11 favorite mt-3 pb-4">
        <h2 class="pt-5 title">Danh sách sách yêu thích</h2>
        <div class="wrap_favorite_book">
          <div
            v-for="favorite in show_favoritebook"
            :key="favorite._id"
            class="card mt-4 mb-5 card-favorite"
          >
            <router-link :to="`/detail/${favorite._id}`" class="router-link">
              <img
                class="card-img-top"
                :src="favorite.URL"
                alt="Card image cap"
              />
              <div class="card-body">
                <h5 class="card-title pb-3 pt-2 text-center">
                  {{ favorite.TENSACH }}
                </h5>
              </div>
            </router-link>
          </div>

          <!-- previous button-->
          <div
            class="previous_btn"
            :class="previousShow"
            v-on:click="changePreviousStatus()"
          >
            <i class="fa-solid fa-angle-left"></i>
          </div>

          <!-- next button-->
          <div
            class="next_btn"
            :class="nextShow"
            v-on:click="changePreviousStatus()"
          >
            <i class="fa-solid fa-angle-right"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12">
      <Banner></Banner>
    </div>

    <!-- Danh mục -->
    <div class="col-lg-9 col-md-8 mt-4 px-0 wrap-categories row mx-0">
      <h2 class="mt-3 text-center">Danh mục sách</h2>
      <div class="categories row mx-0 text-center px-3 justify-content-center">
        <div
          v-for="book in book_screen"
          class="card col-xs-12 col-sm-6 col-md-4 col-lg-3 px-0 my-4 mx-2 book"
          style="width: 18rem"
        >
          <router-link :to="`/detail/${book._id}`" class="router-link">
            <img class="card-img-top" :src="book.URL" :alt="book.TENSACH" />
            <div class="card-body">
              <div class="wrap-title mt-2 mb-3">
                <h6 class="card-title">{{ book.TENSACH }}</h6>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <div class="pagination col-12 justify-content-center my-3">
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item">
              <div
                class="page-link"
                v-on:click="previousPage"
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </div>
            </li>
            <router-link
              v-for="p in count_page"
              :key="p"
              :to="{ path: '/', query: { page: p, limit: limit } }"
            >
              <li class="page-item page-link">
                {{ p }}
              </li>
            </router-link>
            <li class="page-item">
              <div
                class="page-link"
                v-on:click="nextPage()"
                :to="{ path: '/', query: { page: page, limit: limit } }"
                aria-label="Next"
              >
                <span aria-hidden="true">&raquo;</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!--Sách mới -->
    <div class="col-lg-3 col-md-4 col-md-4 mt-4 px-0">
      <h4 class="text-md-center mt-4 mb-3 text-ms-start ps-sm-2 ps-ms-3 ps-1">
        Sách mới cập nhật
      </h4>
      <div
        v-for="new_book in newBook"
        :key="new_book._id"
        class="col-12 row border-top border-bottom mx-0 px-0 py-2 new_book"
      >
        <router-link
          class="router-link col-12 row"
          :to="`/detail/${new_book._id}`"
        >
          <div
            class="col-lg-3 col-md-2 col-sm-3 col-4 img-new px-0 text-center"
          >
            <img :src="new_book.URL" :alt="new_book.TENSACH" />
          </div>

          <div class="col-lg-9 col-md-10 col-sm-9 col-8 ps-md-1 title px-0">
            <p class="fw-bold">{{ new_book.TENSACH }}</p>
            <p>Văn học việt nam</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>

<style lang="css" scoped>
.router-link {
  text-decoration: none !important;
  color: #000;
}

.favorite,
.wrap-categories {
  position: relative;
  z-index: 1;
}

.wrap {
  background-color: #0000000d;
}

.favorite {
  margin: 0 auto;
}

.title {
  padding-left: 6.3%;
}

.wrap_favorite_book {
  display: flex;
  margin: 0 5.9%;
  gap: 0.3rem;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  overflow-x: auto;
}

.card-favorite {
  flex: 0 0 0;
  flex-basis: 15rem !important;
  height: 400px;
}

.previous_btn,
.next_btn {
  width: 46px;
  height: 46px;
  position: absolute;
  font-size: 36px;
  font-weight: bold;
  color: #000;
  top: 50%;
  z-index: 10;
  border: 1px #000 solid;
  border-radius: 999px;
  background-color: #fff;
  opacity: 80%;
}

.previous_btn {
  left: 4.6%;
}

.next_btn {
  right: 5.2%;
}

i {
  transform: translate(-3%, -14%);
}

.show_btn {
  display: block;
}

.hidden_btn {
  display: none;
}

.wrap-categories {
  background-color: #fff;
}

.row {
  align-items: flex-start !important;
}

.book:hover,
.new_book:hover {
  transform: scale(1.02);
}

.page-link {
  cursor: pointer;
}

.wrap-title {
  height: 50px;
}

.card-img-top {
  height: 270px;
}

.img-new {
  overflow: hidden;
}

.img-new img {
  height: 70px;
  object-fit: cover;
}

@media only screen and (max-width: 575px) {
  .book {
    width: 18rem !important;
  }
}

@media only screen and (576px <= width < 768px) {
  .book {
    width: 15rem !important;
  }
}

@media only screen and (768px <= width < 769px) {
  .book {
    width: 13rem !important;
  }
}

@media only screen and (769px<= width < 776px) {
  .book {
    width: 14rem !important;
  }
}

@media only screen and (776px <= width < 840px) {
  .book {
    width: 9rem !important;
  }
}

@media only screen and (840px <= width < 912px) {
  .book {
    width: 10rem !important;
  }
}

@media only screen and (912px <= width < 984px) {
  .book {
    width: 11rem !important;
  }
}

@media only screen and (984px <= width < 992px) {
  .book {
    width: 12rem !important;
  }
}

@media only screen and (992px <= width < 1001px) {
  .book {
    width: 9.6rem !important;
  }
}

@media only screen and (1001px <= width < 1067px) {
  .book {
    width: 10rem !important;
  }
}

@media only screen and (1067px <= width < 1152px) {
  .book {
    width: 11rem !important;
  }
}

@media only screen and (1152px <= width <= 1260px) {
  .book {
    width: 12rem !important;
  }
}

@media only screen and (1260px <= width < 1323px) {
  .book {
    width: 13rem !important;
  }
}

@media only screen and (1323px <= width < 1408px) {
  .book {
    width: 14rem !important;
  }
}

@media only screen and (1408px <= width <= 1664px) {
  .book {
    width: 15rem !important;
  }
}

/* @media only screen and (min-width: 1339px) {
    .card-img-top{
        height: 320px;
    }

} */

@media only screen and (max-width: 1500px) {
  .previous_btn {
    left: 5%;
  }
}

@media only screen and (min-width: 1645px) {
  .wrap_favorite_book {
    justify-content: center;
  }
}
</style>
