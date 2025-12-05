import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/HomeView.vue"),
  },

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
    name: "information",
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
    name: "notfound",
    component: () => import("../views/Error404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const noAuth = ["/login", "/register"];
  let accessToken = sessionStorage.getItem("accessToken");

  try {
    // 1) Chưa có accessToken thử refresh
    if (!accessToken) {
      if (noAuth.includes(to.path)) return next();

      const refreshRes = await fetch("http://localhost:3000/api/refresh", {
        method: "GET",
        credentials: "include",
      });

      const data = await refreshRes.json();
      if (data.message === "oke") {
        accessToken = data.accessToken;
        sessionStorage.setItem("accessToken", accessToken);
      } else {
        return next("/login");
      }
    }

    //Nếu bị block thì về login
    const blockRes = await fetch("http://localhost:3000/api/isblock", {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken },
      credentials: "include",
    });
    const blockData = await blockRes.json();

    if (blockData.block === true) {
      sessionStorage.removeItem("accessToken");
      return next("/login");
    }

    // 2) Lấy thông tin người dùng
    const infoRes = await fetch("http://localhost:3000/api/isInformation", {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken },
      credentials: "include",
    });

    const infoData = await infoRes.json();
    const isInfor = infoData.isInfor === true;

    // 3) Nếu vào login/register mà đã login
    if (noAuth.includes(to.path) && accessToken) {
      return next(isInfor ? "/" : "/informationUser");
    }

    // 4) Chưa có thông tin ép vào /informationUser
    if (!isInfor && to.path !== "/informationUser") {
      return next("/informationUser");
    }

    if (isInfor && to.path === "/informationUser") {
      return next("/");
    }

    // OK
    return next();
  } catch (error) {
    return next("/login");
  }
});

export default router;
