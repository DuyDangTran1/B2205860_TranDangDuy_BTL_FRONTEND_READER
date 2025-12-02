<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import { refreshToken } from "@/api/Token";

const router = useRouter();
const borrowHistory = ref([]);
const isLoading = ref(true);
const accessToken = sessionStorage.getItem("accessToken");

// Format ngày tháng
function formatDate(date) {
  if (!date) return "Chưa xác định";
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN") + " " + d.toLocaleTimeString("vi-VN");
}

// Load danh sách mượn
const loadBorrowHistory = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/reader/borrowHistory", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
    const data = await res.json();

    if (data.message === "Token hết hạn hoặc không hợp lệ") {
      const refresh = await refreshToken();
      if (refresh === "oke") return await loadBorrowHistory();
    }

    borrowHistory.value = data.borrow_requests || [];
    isLoading.value = false;
    return;
  } catch (err) {
    console.error("Lỗi khi tải dữ liệu:", err);
    isLoading.value = false;
    return;
  }
};

// Hủy yêu cầu
const cancelRequest = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/cancel/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    const data = await res.json();

    if (data.message === "Token hết hạn hoặc không hợp lệ") {
      const refresh = await refreshToken();
      if (refresh === "oke") return await cancelRequest(id);
    }

    alert(data.message);
    await loadBorrowHistory();
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  await loadBorrowHistory();
});
</script>

<template>
  <!-- Layout full chiều cao, footer luôn dưới -->
  <div class="d-flex flex-column min-vh-100">
    <Navbar />

    <!-- Nội dung chính chiếm phần còn lại -->
    <main class="flex-grow-1">
      <div class="container-fluid px-0">
        <div class="col-12 px-0 wrap mx-auto">
          <div class="col-11 favorite mt-3 pb-4">
            <h2 class="pt-5 title">Lịch sử mượn sách</h2>

            <div class="table-responsive mt-4">
              <table class="table table-hover align-middle text-center">
                <thead class="table-dark">
                  <tr>
                    <th>STT</th>
                    <th>Tên sách</th>
                    <th>Ngày tạo</th>
                    <th>Ngày mượn</th>
                    <th>Ngày trả</th>
                    <th>Nhân viên duyệt</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="isLoading">
                    <td colspan="8" class="text-center">Đang tải dữ liệu...</td>
                  </tr>
                  <tr
                    v-else
                    v-for="(item, index) in borrowHistory"
                    :key="item._id"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.TENSACH || "Chưa có" }}</td>
                    <td>{{ formatDate(item.CREATED) }}</td>
                    <td>{{ formatDate(item.NGAYMUON) }}</td>
                    <td>{{ formatDate(item.NGAYTRA) }}</td>
                    <td>{{ item.HOTENNV || "Chưa duyệt" }}</td>
                    <td>
                      <span
                        :class="{
                          'badge bg-warning':
                            item.TRANGTHAI === 'Đang chờ duyệt',
                          'badge bg-primary': item.TRANGTHAI === 'Đã duyệt',
                          'badge bg-info': item.TRANGTHAI === 'Đã mượn',
                          'badge bg-success': item.TRANGTHAI === 'Đã trả',
                          'badge bg-danger': item.TRANGTHAI === 'Đã bị hủy',
                        }"
                      >
                        {{ item.TRANGTHAI }}
                      </span>
                    </td>
                    <td>
                      <button
                        :disabled="item.TRANGTHAI !== 'Đang chờ duyệt'"
                        class="btn btn-sm btn-danger"
                        @click="cancelRequest(item._id)"
                      >
                        Hủy
                      </button>
                    </td>
                  </tr>
                  <tr v-if="!isLoading && borrowHistory.length === 0">
                    <td colspan="8" class="text-center">
                      Chưa có lịch sử mượn
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.wrap {
  background-color: #0000000d;
}

.favorite {
  margin: 0 auto;
}

.title {
  padding-left: 6.3%;
}

.table {
  background-color: #fff;
}

.table td,
.table th {
  vertical-align: middle;
}

.badge {
  font-size: 0.9rem;
  padding: 0.5em 0.7em;
}
</style>
