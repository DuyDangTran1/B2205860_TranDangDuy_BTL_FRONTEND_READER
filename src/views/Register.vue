<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';
import validate from '../validate/validate.js';

const router = useRouter();
const { validateEmail, validatePassword, validateConfirmPassword } = validate;

const isPasswordHidden_password = ref(true);
const isPasswordHidden_confirm = ref(true);
const showMessage = ref(false)

//Xử lý xem và ẩn mật khẩu
const icon_class_password = computed(() => (isPasswordHidden_password.value ? 'fa-eye-slash' : 'fa-eye'));
const type_input_password = computed(() => (isPasswordHidden_password.value ? 'password' : 'text'));

const icon_class_confirm = computed(() => (isPasswordHidden_confirm.value ? 'fa-eye-slash' : 'fa-eye'));
const type_input_confirm = computed(() => (isPasswordHidden_confirm.value ? 'password' : 'text'));


const showPassword = () => (isPasswordHidden_password.value = !isPasswordHidden_password.value);
const showConfirmPassword = () => (isPasswordHidden_confirm.value = !isPasswordHidden_confirm.value);

//Kiểm tra xử lý dữ liệu đăng kí
const data_register = ref({
  EMAIL: "",
  PASSWORD: "",
  CONFIRM_PASSWORD: "",
});

const errol = ref({
  EMAIL: "", 
  PASSWORD: "",
  CONFIRM_PASSWORD: ""
});

const submitData = async () => {
  // Kiểm tra dữ liệu vào
  errol.value.EMAIL = await validateEmail(data_register.value.EMAIL);
  errol.value.PASSWORD = validatePassword(data_register.value.PASSWORD);
  errol.value.CONFIRM_PASSWORD = validateConfirmPassword(data_register.value.CONFIRM_PASSWORD, data_register.value.PASSWORD);

  if(!errol.value.EMAIL 
     && !errol.value.PASSWORD
     && !errol.value.CONFIRM_PASSWORD){
      const res = await fetch('http://localhost:3000/api/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          EMAIL: data_register.value.EMAIL,
          PASSWORD: data_register.value.PASSWORD
         }),
      });
      const result = await res.json();
      console.log(result);
      if(result.message == "Đăng kí thành công"){
        router.push('/login');

        // showMessage.value = true
        // setTimeout(() => {
        //   showMessage.value = false
        // }, 3000)
      }
    }
}


</script>

<template>
  <!-- <span v-if="data_register.EMAIL">{{ data_register.EMAIL || data_register.PASSWORD || data_register.CONFIRM_PASSWORD }} </span> -->
  <div class="container-fluid row m-0 bg-light bg-gradient mt-5">
    <div class="col-lg-3 col-sm-10 col-md-8 m-auto wrap-register border border-1 border-warning rounded-3">
      <h2 class="text-center mt-4 mb-5 pt-1 text-white">Sign Up</h2>

      <div class="mb-2 row col-lg-10 mx-auto">
        <label for="staticEmail" class="col-lg-12 mx-auto col-form-label text-white">Địa chỉ email: </label>
        <div class="col-lg-12 mx-auto">
          <input v-model="data_register.EMAIL" type="email" class="form-control py-3" id="staticEmail" placeholder="Nhập email" />
        </div>
      </div>

      <div v-if="errol.EMAIL" class="mb-2 row col-lg-10 mx-auto error">
        <p class="col-lg-10 mx-auto my-0">{{ errol.EMAIL }}</p>
      </div>

      <div class="mb-2 row col-lg-10 mx-auto">
        <div class="col-lg-12 mx-auto">
          <label for="inputPassword" class="col-form-label text-white">Password: </label>
          <div class="wrap_password">
            <input :type="type_input_password" v-model="data_register.PASSWORD" class="form-control py-3" id="inputPassword" placeholder="Nhập mật khẩu" />
            <i class="fa-solid icon_pass" :class="icon_class_password" @click="showPassword"></i>
          </div>
        </div>
      </div>

      <div v-if="errol.PASSWORD" class="mb-2 row col-lg-10 mx-auto error">
        <p class="col-lg-10 mx-auto my-0">{{ errol.PASSWORD }}</p>
      </div>

      <div class="mb-2 row col-lg-10 mx-auto">
        <div class="col-lg-12 mx-auto">
          <label for="confirmPassword" class="col-form-label text-white">Confirm Password: </label>
          <div class="wrap_password">
            <input :type="type_input_confirm" v-model="data_register.CONFIRM_PASSWORD" class="form-control py-3" id="confirmPassword" placeholder="Xác nhận lại mật khẩu" />
            <i class="fa-solid icon_pass" :class="icon_class_confirm" @click="showConfirmPassword"></i>
          </div>
        </div>
      </div>

      <div v-if="errol.CONFIRM_PASSWORD" class="mb-2 row col-lg-10 mx-auto error">
        <p class="col-lg-10 mx-auto my-0">{{ errol.CONFIRM_PASSWORD }}</p>
      </div>

      <div class="row col-lg-12 mx-auto mb-5 pb-1">
        <div class="col-lg-10 mx-auto">
          <button type="button" class="btn btn-primary col-12 d-block mt-4 py-3 mb-3" @click="submitData()">Sign up</button>
        </div>
      </div>
    </div>

  <!--Toast -->
    <div
      v-if="showMessage"
      class="alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3 shadow"
      style="min-width: 250px; z-index:1055;"
    >
    Đăng kí tài khoản thành công!
    </div>
  </div>
</template>

<style lang="css" scoped>
.container-fluid {
  position: absolute;
  top:46%;
  transform: translateY(-50%);
}

.wrap-register {
  background-color: #6c757d;
}

.wrap_password {
  position: relative;
}

.icon_pass {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
}

.btn:hover {
  border-radius: 30px;
}

.error{
    color: red;
}
</style>
