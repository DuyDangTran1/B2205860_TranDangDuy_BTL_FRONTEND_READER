<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import validate from "@/validate/validate";
import { refreshToken } from "@/api/Token";

const router = useRouter();

const form = ref({
  HOLOT: "",
  TEN: "",
  NGAYSINH: "",
  PHAI: "",
  DIACHI: "",
  DIENTHOAI: "",
  DIEUKHOAN: false, // checkbox điều khoản
});

const error = ref({
  TEN: "",
  NGAYSINH: "",
  PHAI: "",
  DIACHI: "",
  DIENTHOAI: "",
  DIEUKHOAN: "",
});

let accessToken = sessionStorage.getItem("accessToken");

const validateData = async () => {
  error.value.TEN = validate.validateNameUser(form.value.TEN);
  error.value.NGAYSINH = validate.validateDateOfBirth(form.value.NGAYSINH);
  error.value.PHAI = validate.validateSex(form.value.PHAI);
  error.value.DIACHI = validate.validateAddress(form.value.DIACHI);
  error.value.DIENTHOAI = await validate.validatePhone(form.value.DIENTHOAI);

  // Kiểm tra điều khoản
  error.value.DIEUKHOAN = form.value.DIEUKHOAN
    ? ""
    : "Bạn phải chấp nhận điều khoản";
};

const updateData = async () => {
  await validateData();

  if (
    !error.value.TEN &&
    !error.value.NGAYSINH &&
    !error.value.PHAI &&
    !error.value.DIACHI &&
    !error.value.DIENTHOAI &&
    !error.value.DIEUKHOAN
  ) {
    let res = await fetch("http://localhost:3000/api/updateInformation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(form.value),
    });

    let result = await res.json();

    if (result.message == "Cập nhật thông tin thành công") {
      router.push("/");
    }

    if (result.message == "Token hết hạn hoặc không hợp lệ") {
      const refreshRes = await fetch("http://localhost:3000/api/refresh", {
        method: "GET",
        credentials: "include",
      });

      const refreshData = await refreshRes.json();

      if (refreshData.message == "oke") {
        accessToken = refreshData.accessToken;
        sessionStorage.setItem("accessToken", accessToken);
        return await updateData();
      }
    }

    console.log(result);
  }
};

async function load_information() {
  const res = await fetch("http://localhost:3000/api/information/reader", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  const result = await res.json();
  if (result == "Token hết hạn hoặc không hợp lệ") {
    await refreshToken();
    return load_information();
  }

  form.value.HOLOT = result.information.HOLOT || " ";
  form.value.TEN = result.information.TEN || " ";
  form.value.DIEUKHOAN = result.information.DIEUKHOAN || false; // load trạng thái nếu đã tick
}

onMounted(load_information);
</script>

<template>
  <div
    class="info-page d-flex align-items-center justify-content-center min-vh-100"
  >
    <div
      class="info-card shadow-lg p-4 p-md-5 rounded-4 bg-white w-100"
      style="max-width: 550px"
    >
      <div class="text-center mb-4">
        <h2 class="fw-bold text-dark">Chào mừng bạn!</h2>
        <p class="text-muted mb-0">
          Hãy hoàn tất thông tin cá nhân để bắt đầu nhé
        </p>
      </div>

      <form @submit.prevent="updateData" novalidate>
        <div class="row mb-3">
          <div class="col-md-6 mb-3 mb-md-0">
            <label class="form-label">Họ lót</label>
            <input
              type="text"
              v-model="form.HOLOT"
              class="form-control rounded-pill px-3 py-2"
              placeholder="Nguyễn Văn"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">
              Tên <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              v-model="form.TEN"
              class="form-control rounded-pill px-3 py-2"
              required
              placeholder="Duy"
            />
            <div v-if="error.TEN" class="invalid-feedback d-block mt-1">
              {{ error.TEN }}
            </div>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">
            Ngày sinh <span class="text-danger">*</span>
          </label>
          <input
            type="date"
            v-model="form.NGAYSINH"
            class="form-control rounded-pill px-3 py-2"
            required
          />
          <div v-if="error.NGAYSINH" class="invalid-feedback d-block mt-1">
            {{ error.NGAYSINH }}
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">
            Giới tính <span class="text-danger">*</span>
          </label>
          <div class="d-flex gap-4 ms-2">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="nam"
                value="Nam"
                v-model="form.PHAI"
                required
              />
              <label class="form-check-label" for="nam">Nam</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="nu"
                value="Nữ"
                v-model="form.PHAI"
              />
              <label class="form-check-label" for="nu">Nữ</label>
            </div>
          </div>
          <div v-if="error.PHAI" class="invalid-feedback d-block mt-1">
            {{ error.PHAI }}
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">
            Địa chỉ <span class="text-danger">*</span>
          </label>
          <input
            type="text"
            v-model="form.DIACHI"
            class="form-control rounded-pill px-3 py-2"
            required
            placeholder="VD: Ninh Kiều, Cần Thơ"
          />
          <div v-if="error.DIACHI" class="invalid-feedback d-block mt-1">
            {{ error.DIACHI }}
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label">
            Số điện thoại <span class="text-danger">*</span>
          </label>
          <input
            type="text"
            v-model="form.DIENTHOAI"
            class="form-control rounded-pill px-3 py-2"
            required
            placeholder="VD: 0901234567"
          />
          <div v-if="error.DIENTHOAI" class="invalid-feedback d-block mt-1">
            {{ error.DIENTHOAI }}
          </div>
        </div>

        <div class="mb-3">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="dieuKhoan"
              v-model="form.DIEUKHOAN"
            />
            <label class="form-check-label" for="dieuKhoan">
              Tôi đồng ý với các điều khoản:
              <ul class="mb-0">
                <li>Mượn sách tối đa 7 ngày</li>
                <li>Trả trễ phạt 100k</li>
                <li>
                  Nếu vi phạm quá nhiều lần trả trễ hoặc không lấy sách sau khi
                  duyệt, tài khoản sẽ bị khóa
                </li>
              </ul>
            </label>
          </div>
          <div v-if="error.DIEUKHOAN" class="invalid-feedback d-block mt-1">
            {{ error.DIEUKHOAN }}
          </div>
        </div>

        <div class="d-grid mt-4">
          <button
            class="btn btn-dark rounded-pill py-2 fw-semibold"
            type="submit"
          >
            Hoàn tất && Tiếp tục
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.info-page {
  background-color: #f9fafb;
}

.info-card {
  animation: fadeIn 0.6s ease;
}

.form-label {
  font-weight: 500;
  color: #333;
}

.form-control {
  border: 1px solid #ddd;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.form-control:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
  border-color: #86b7fe;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  animation: fadeIn 0.3s ease;
}

button {
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1);
}

.info-page {
  background-color: #f9fafb;
}
.info-card {
  animation: fadeIn 0.6s ease;
}
.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
