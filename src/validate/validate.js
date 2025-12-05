const phone_regex = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const password_regex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

const validateEmail = async (email) => {
  if (!email) return "Email không được bỏ trống";

  if (!email_regex.test(email)) return "Email không hợp lệ";

  try {
    const res = await fetch("http://localhost:3000/api/existEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ EMAIL: email }),
    });

    const result = await res.json();

    if (result.result_find === "Email đã tồn tạiEmail đã tồn tại")
      return "Email đã tồn tại";

    return "";
  } catch (error) {
    return "Lỗi server. Không thể kiểm tra email";
  }
};

const validatePassword = (password) => {
  if (!password) return "Không được bỏ trống mật khẩu";

  if (!password_regex.test(password))
    return "Password phải có kí tự hoa, phải có kí tự thường và có kí tự đặt biệt";

  return "";
};

const validateConfirmPassword = (confirm_password, password) => {
  if (!confirm_password && password) return "Vui lòng xác nhận mật khẩu";

  if (confirm_password !== password) return "Mật khẩu xác nhận không khớp";

  return "";
};

const validateNameUser = (name) => {
  if (!name) return "Không được bỏ trống user name";

  return "";
};

const validateDateOfBirth = (birth) => {
  if (!birth) return "không được bỏ trống";

  if (
    (Date.now() - new Date(birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000) <
    18
  )
    return "Bạn chưa đủ 18 tuổi";

  return "";
};

const validateSex = (sex) => {
  if (!sex) return "Không được bỏ trống";

  return "";
};

const validateAddress = (address) => {
  if (!address) return "Không được bỏ trống";

  return "";
};

const validatePhone = async (phone) => {
  let accessToken = sessionStorage.getItem("accessToken");
  if (!phone) return "Không được bỏ trống";

  if (!phone_regex.test(phone)) return "Số điện thoại không đúng định dạng";

  try {
    let res = await fetch("http://localhost:3000/api/existPhone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ DIENTHOAI: phone }),
    });

    let result = await res.json();
    if (result.message == "Lỗi truyền dữ liệu") return "Lỗi truyền dữ liêu";

    if (result.message == "Số điện thoại đã tồn tại")
      return "Số điện thoại đã tồn tại";

    if (result.message == "Token hết hạn hoặc không hợp lệ") {
      const refreshRes = await fetch("http://localhost:3000/api/refresh", {
        method: "GET",
        credentials: "include",
      });

      const refreshData = await refreshRes.json();

      if (refreshData.message === "oke") {
        accessToken = refreshData.accessToken;
        sessionStorage.setItem("accessToken", accessToken);
        return await validatePhone();
      }
    }

    return "";
  } catch (error) {
    console.log(error);
  }
};

export default {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateNameUser,
  validateDateOfBirth,
  validateSex,
  validateAddress,
  validatePhone,
};
