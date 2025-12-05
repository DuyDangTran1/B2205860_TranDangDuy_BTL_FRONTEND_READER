import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", name: "Home", component: () => import("../views/HomeView.vue") },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: () => import("../views/DetailView.vue"),
  },
  {
    path: "/informationUser",
    name: "Information",
    component: () => import("../views/InformationView.vue"),
  },
  {
    path: "/borrowHistory",
    name: "BorrowHistory",
    component: () => import("../views/BorrowHistoryView.vue"),
  },
  {
    path: "/category/:name",
    name: "Category",
    component: () => import("../views/CategoryView.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/Error404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const noAuthPages = ["/login", "/register"];
  let accessToken = sessionStorage.getItem("accessToken");

  try {
    // 1) Nếu chưa có accessToken, thử refresh
    if (!accessToken) {
      if (noAuthPages.includes(to.path)) return next();

      const refreshRes = await fetch("http://localhost:3000/api/refresh", {
        method: "GET",
        credentials: "include",
      });

      const refreshData = await refreshRes.json();

      if (refreshData.message === "oke") {
        accessToken = refreshData.accessToken;
        sessionStorage.setItem("accessToken", accessToken);
      } else {
        return next("/login");
      }
    }

    // 2) Kiểm tra tài khoản có bị block không
    const blockRes = await fetch("http://localhost:3000/api/isblock", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    });
    const blockData = await blockRes.json();
    if (blockData.block === true) {
      sessionStorage.removeItem("accessToken");
      return next("/login");
    }

    // 3) Lấy thông tin user để check isInfor
    const infoRes = await fetch("http://localhost:3000/api/isInformation", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    });

    const infoData = await infoRes.json();
    const isInfor = infoData.isInfor === true;

    // 4) Nếu đã login và vào login/register thì redirect đúng chỗ
    if (noAuthPages.includes(to.path) && accessToken) {
      return next(isInfor ? "/" : "/informationUser");
    }

    // 5) Nếu chưa hoàn thiện thông tin, ép vào /informationUser
    if (!isInfor && to.path !== "/informationUser") {
      return next("/informationUser");
    }

    // 6) Nếu đã điền xong thông tin mà vô /informationUser thì chuyển về Home
    if (isInfor && to.path === "/informationUser") {
      return next("/");
    }

    // 7) Ok, cho đi tiếp
    next();
  } catch (error) {
    console.error("Router guard error:", error);
    sessionStorage.removeItem("accessToken");
    return next("/login");
  }
});

export default router;
