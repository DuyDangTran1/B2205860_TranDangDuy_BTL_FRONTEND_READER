<script setup></script>

<template>
  <footer class="container-fluid text-white mt-5 py-5 mx-0">
    <div class="row">
      <div class="offset-lg-1 col-lg-4 mb-4 mb-lg-0">
        <p class="fs-4"><strong>Giới thiệu ngắn</strong></p>
        <ul class="list-unstyled">
          <li class="pt-2">
            Thư viện Sách Trực Tuyến là nơi chia sẻ nguồn tài liệu học tập đa
            lĩnh vực – từ Công nghệ thông tin, Kinh tế - Xã hội đến Giáo dục và
            Tâm lý học.
          </li>
          <li class="pt-2">
            Giúp bạn đọc mở rộng tri thức và khám phá thế giới qua từng trang
            sách.
          </li>
        </ul>
      </div>

      <div class="col-lg-3 mb-4 mb-lg-0 ps-4">
        <p class="fs-4"><strong>Thông tin liên hệ</strong></p>
        <ul class="list-unstyled">
          <li class="pt-2">
            <i class="fa-solid fa-envelope me-2"></i>Email:
            <a href="mailto:contact@thuviensa.vn" class="text-white"
              >contact@thuviensa.vn</a
            >
          </li>
          <li class="pt-2">
            <i class="fa-solid fa-phone me-2"></i>SĐT: 0123 456 789
          </li>
          <li class="pt-2">
            <i class="fa-solid fa-location-dot me-2"></i>Địa chỉ: ĐH Cần Thơ,
            Việt Nam
          </li>
        </ul>

        <div class="mt-3">
          <a href="#" class="text-white me-3 social-icon"
            ><i class="fa-brands fa-facebook fa-lg"></i
          ></a>
          <a href="#" class="text-white me-3 social-icon"
            ><i class="fa-brands fa-github fa-lg"></i
          ></a>
          <a href="#" class="text-white social-icon"
            ><i class="fa-brands fa-instagram fa-lg"></i
          ></a>
        </div>
      </div>

      <div class="col-lg-4">
        <p class="fs-4"><strong>Góc cảm hứng đọc sách</strong></p>
        <p class="fst-italic pt-2">"Đọc hôm nay – Dẫn lối tương lai."</p>
        <p class="fst-italic">
          "Mỗi quyển sách là một hành trình khám phá bản thân."
        </p>
      </div>
    </div>

    <div class="text-center mt-4 border-top pt-3">
      <p class="mb-0">
        &copy; 2025 Thư viện Sách Trực Tuyến | Thiết kế & phát triển bởi
        <strong>Duy</strong>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.container-fluid {
  background-color: #76b3c6;
}

li {
  text-align: justify;
}

a:hover {
  color: #240df0;
  text-decoration: underline;
  transition: 0.3s;
}

.social-icon:hover {
  color: #0dcaf0;
  transform: scale(1.1);
  transition: 0.3s;
}

@media (max-width: 768px) {
  .fs-4 {
    font-size: 1.2rem;
  }
}
</style>
