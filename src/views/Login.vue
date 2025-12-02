<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Dữ liệu login thường
const data_login = ref({
  EMAIL: "",
  PASSWORD: "",
});

const error = ref({
  EMAIL: "",
  PASSWORD: "",
});

// Đăng nhập truyền thống
const submitLogin = async () => {
  error.value.EMAIL = !data_login.value.EMAIL
    ? "Không được bỏ trống email"
    : "";
  error.value.PASSWORD = !data_login.value.PASSWORD
    ? "Vui lòng nhập mật khẩu"
    : "";

  if (!error.value.EMAIL && !error.value.PASSWORD) {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data_login.value),
    });

    const result = await res.json();
    console.log(result);

    if (result.message_account === "Đăng nhập thành công") {
      sessionStorage.setItem("accessToken", result.accessToken);
      router.push("/informationUser");
    }
  }
};

// Hàm callback Google trả về
window.handleCredentialResponse = async function (response) {
  // Gửi lên backend Node.js để verify
  const res = await fetch("http://localhost:3000/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ tokenId: response.credential }),
  });

  const data = await res.json();
  console.log("Token backend trả về:", data.accessToken);

  if (data.accessToken) {
    sessionStorage.setItem("accessToken", data.accessToken);
    router.push("/informationUser");
  }
};

onMounted(() => {
  google.accounts.id.initialize({
    client_id:
      "534323952022-ebh5copfdfivgbjgvea68r3aqogclrtg.apps.googleusercontent.com",
    callback: handleCredentialResponse,
  });

  google.accounts.id.renderButton(
    document.querySelector(".google-default-btn"),
    {
      theme: "outline",
      size: "large",
      type: "standard",
      width: "200%",
    }
  );
});
</script>

<template>
  <div
    class="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light bg-gradient"
  >
    <div
      class="row col-lg-4 col-sm-10 col-md-8 bg-secondary bg-gradient border border-1 border-dark rounded-3 p-4"
    >
      <div class="col-lg-9 mx-auto">
        <h2 class="text-center text-white mb-4">Login</h2>

        <!-- Email -->
        <div class="mb-3">
          <label for="staticEmail" class="form-label text-white">Email:</label>
          <input
            v-model="data_login.EMAIL"
            type="text"
            class="form-control"
            id="staticEmail"
            placeholder="Enter your email"
          />
          <div v-if="error.EMAIL" class="text-danger mt-1">
            {{ error.EMAIL }}
          </div>
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label for="inputPassword" class="form-label text-white"
            >Password:</label
          >
          <input
            v-model="data_login.PASSWORD"
            type="password"
            class="form-control"
            id="inputPassword"
            placeholder="Enter your password"
          />
          <div v-if="error.PASSWORD" class="text-danger mt-1">
            {{ error.PASSWORD }}
          </div>
        </div>

        <!-- Submit -->
        <button @click="submitLogin" class="btn btn-primary w-100 mb-3 mt-2">
          Submit
        </button>

        <!-- Google button -->
        <div
          class="google-default-btn mb-4 d-flex justify-content-center"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-fluid {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.err {
  color: red;
}
</style>
