<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { refreshToken } from "@/api/Token";
const isShowProfile = ref(false);
const router = useRouter();
const accessToken = sessionStorage.getItem("accessToken");

const showProfile = computed(() =>
  isShowProfile.value ? "show_profile" : "hide_profile"
);

function toggleProfile() {
  isShowProfile.value = !isShowProfile.value;
}

function blurProfile() {
  if (isShowProfile.value) {
    isShowProfile.value = false;
  }
}

function redirect() {
  router.push("/borrowHistory");
}

async function logOut() {
  try {
    const res = await fetch("http://localhost:3000/api/logout", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    const result = await res.json();
    if (result.message === "Token hết hạn hoặc không hợp lệ") {
      await refreshToken();
      return logOut();
    }

    sessionStorage.removeItem("accessToken");
    router.push("/login");
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <div class="profile ms-3 me-5" tabindex="0" @blur="blurProfile">
    <div
      @click="toggleProfile"
      class="wrap_img_profile border border-2 border-light rounded-circle"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/219/219970.png"
        alt="avatar"
      />
      <i class="fa-solid fa-caret-down dropdown_profile"></i>
    </div>

    <div
      class="drop_down_profile shadow-lg rounded-4 border border-1 border-light"
      :class="showProfile"
    >
      <div class="profile-header d-flex align-items-center px-3 pt-3 pb-2">
        <img
          src="https://cdn-icons-png.flaticon.com/512/219/219970.png"
          alt="avatar"
          class="profile-avatar"
        />
        <div class="ms-3">
          <p class="profile-name mb-0 fw-semibold">Tên đăng nhập</p>
        </div>
      </div>
      <hr class="my-2" />

      <div class="profile-menu">
        <p v-on:click="redirect()">
          <i class="fa-solid fa-book me-2"></i>Lịch sử mượn sách
        </p>
        <p v-on:click="logOut()" class="logout">
          <i class="fa-solid fa-right-from-bracket me-2"></i>Đăng xuất
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile {
  position: relative;
}

.wrap_img_profile {
  width: 45px;
  height: 45px;
  background-color: #1976d2;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap_img_profile img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.dropdown_profile {
  position: absolute;
  bottom: -1px;
  right: -4px;
  color: #fff;
  background-color: #42a5f5;
  border-radius: 50%;
  padding: 2px 4px;
  font-size: 12px;
}

/* Dropdown box */
.drop_down_profile {
  width: 260px;
  position: absolute;
  right: 0;
  top: 55px;
  background-color: #fff;
  transition: all 0.2s ease-in-out;
  z-index: 100;
}

/* Header info */
.profile-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e3f2fd;
}

/* Menu items */
.profile-menu p {
  margin: 0;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  color: #333;
  font-size: 15px;
}

.profile-menu p:hover {
  background-color: #e3f2fd;
}

.logout {
  color: #e53935;
  font-weight: 500;
}

.logout:hover {
  background-color: #ffebee;
}

/* Visibility toggle */
.show_profile {
  display: block;
  opacity: 1;
  transform: translateY(0);
}

.hide_profile {
  display: none;
  opacity: 0;
}
</style>
