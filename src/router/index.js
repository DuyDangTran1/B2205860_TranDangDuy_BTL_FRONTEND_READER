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
  let accessToken = sessionStorage.getItem("accessToken");
  const arr_form = ["/login", "/register"];

  try {
    // Nếu chưa có accessToken, thử refresh
    if (!accessToken) {
      try {
        if (arr_form.includes(to.path)) {
          return next();
        }
        const refreshRes = await fetch("http://localhost:3000/api/refresh", {
          method: "GET",
          credentials: "include",
        });
        const refreshData = await refreshRes.json();

        if (refreshData.message === "oke") {
          accessToken = refreshData.accessToken;
          sessionStorage.setItem("accessToken", accessToken);
        } else {
          if (!arr_form.includes(to.path)) return next("/login");
        }
      } catch (error) {
        return next("/login");
      }
    }

    // Check isInfor
    const infoRes = await fetch("http://localhost:3000/api/isInformation", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      credentials: "include",
    });
    const infoData = await infoRes.json();
    const isInfor = infoData.isInfor === true;
    // console.log(isInfor);

    // Nếu đang ở login/register mà đã login + có thông tin, quay về Home
    if (accessToken && arr_form.includes(to.path)) {
      if (isInfor) return next("/");
      else return next("/informationUser");
    }

    // Nếu chưa có thông tin, redirect /informationUser
    if (!isInfor && accessToken && to.path !== "/informationUser") {
      return next("/informationUser");
    }

    if (isInfor && accessToken && to.path == "/informationUser")
      return next("/");

    // bình thường
    next();
  } catch (err) {
    return next("/login");
  }
});

export default router;
