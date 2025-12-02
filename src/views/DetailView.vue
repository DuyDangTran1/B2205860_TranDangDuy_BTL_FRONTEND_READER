<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Footer from "@/components/Footer.vue";
import { refreshToken } from "@/api/Token";
import Navbar from "@/components/Navbar.vue";
const route = useRoute();
const detailBook = ref({});
const id = route.params.id;
const isLoading = ref(true);

async function confirmBorrow() {
  try {
    isLoading.value = true;
    const accessToken = sessionStorage.getItem("accessToken");
    const res = await fetch(`http://localhost:3000/api/borrow/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await res.json();

    if (result.message === "Token hết hạn hoặc không hợp lệ") {
      const refresh = await refreshToken();
      if (refresh == "oke") return await loadBook();
    }

    isLoading.value = false;

    if (res.status === 200) {
      const toastEl = document.getElementById("successToast");
      const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
      toast.show();
    }
  } catch (error) {
    console.error(error);
  }
}

onMounted(async function loadBook() {
  try {
    const accessToken = sessionStorage.getItem("accessToken");
    const res = await fetch(`http://localhost:3000/api/getBookId/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await res.json();

    if (result.message === "Token hết hạn hoặc không hợp lệ") {
      const refresh = await refreshToken();
      if (refresh == "oke") return await loadBook();
    }

    detailBook.value =
      {
        ...result.book,
        TENTHELOAI: result.TENTHELOAI,
        TENNHAXB: result.TENNHAXB,
      } || {};

    console.log(detailBook.value);
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <div v-if="isLoading" class="mt-5 ms-5 ps-5">...Loading</div>

  <Navbar v-if="!isLoading"></Navbar>
  <div v-if="!isLoading" class="container row mx-auto pt-3 pb-3">
    <div class="col-12 mt-5 pt-5 pb-5 row wrap-detail">
      <img
        class="col-lg-4 col-md-7 col-sm-6"
        :src="detailBook.URL"
        :alt="detailBook.TENSACH"
      />
      <div
        class="col-lg-8 col-md-5 col-sm-6 detail_product ps-sm-5 pt-4 pt-sm-0"
      >
        <h2 class="pb-1">{{ detailBook.TENSACH }}</h2>
        <p>
          <i class="fa-solid fa-user"></i>
          <span> Tác giả: {{ detailBook.TACGIA }}</span>
        </p>
        <p>
          <i class="fa-solid fa-list-ol"></i>
          <span> Số lượng sách: {{ detailBook.SOQUYEN }}</span>
        </p>

        <p>
          <i class="fa-solid fa-pen"></i>
          <span> Thể loại: {{ detailBook.TENTHELOAI }}</span>
        </p>

        <p>
          <i class="fa-solid fa-building"></i>
          <span> Nhà sản xuất: {{ detailBook.TENNHAXB }}</span>
        </p>

        <p>
          <i class="fa-solid fa-clock"></i>
          <span>{{
            detailBook.CREATED.split("T")[0].split("-").reverse().join("-")
          }}</span>
        </p>

        <button
          class="btn btn-primary mt-3 btn-borrow"
          data-bs-toggle="modal"
          data-bs-target="#borrowModal"
          :disabled="detailBook.SOQUYEN < 1"
        >
          Mượn Sách
        </button>

        <p class="noti mt-1" v-if="detailBook.SOQUYEN < 1">
          (Hiện tại thì sách này đã hết vui lòng quay lại sau)
        </p>
      </div>

      <div class="description col-lg-8 mt-4">
        <h4>Giới Thiệu:</h4>
        <p>{{ detailBook.MOTA.GIOITHIEU }}</p>
        <p>{{ detailBook.MOTA.NOIDUNG }}</p>
        <p>{{ detailBook.MOTA.THONGDIEP }}</p>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="borrowModal"
    tabindex="-1"
    aria-labelledby="borrowModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="borrowModalLabel">Xác nhận mượn sách</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          Bạn có chắc chắn muốn mượn <b>{{ detailBook.TENSACH }}</b> không?
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Hủy
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="confirmBorrow"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  </div>

  <!--Toast-->
  <div
    class="toast-container position-fixed bottom-0 end-0 p-3"
    style="z-index: 9999"
  >
    <div
      id="successToast"
      class="toast align-items-center text-bg-success border-0"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex bg-primary">
        <div class="toast-body">Mượn sách thành công!</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>

  <Footer v-if="!isLoading"></Footer>
</template>

<style lang="css" scoped>
.container {
  margin-top: 60px;
  background-color: #c9d7e3;
  border-radius: 20px;
}

img {
  height: 400px;
}

.noti {
  color: red;
}

.description {
  padding-bottom: 20px;
  margin-bottom: 10px;
}

.description p {
  text-align: justify;
  line-height: 1.6;
  margin-bottom: 10px;
}

.btn-borrow {
  background-color: #6aa0f1;
  color: #fff;
}

.btn-borrow:hover {
  border-radius: 20px;
  background-color: #065ee3;
}

@media only screen and (576px <= width < 768px) {
  img {
    height: 280px;
  }
}
</style>
