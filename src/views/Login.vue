<template>
  <div class="card shadow-lg card-signin">
    <div class="card-body">
      <div class="row justify-content-center">
        <h1 class="h3 mb-3 font-weight-normal text-white">
          後台登入
          <i class="bi bi-person-circle text-dark"></i>
        </h1>
        <div class="col-12 text-start">
          <Form id="form" v-slot="{ errors }" class="form-signin" @submit="onLogin">
            <div class="form-floating mb-3">
              <Field
                id="username"
                name="username"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors['username'] }"
                placeholder="請輸入帳號"
                rules="email|required"
                v-model="user.username"
              >
              </Field>
              <label for="username" class="form-label">使用者帳號</label>
              <ErrorMessage name="username" class="invalid-feedback"></ErrorMessage>
            </div>
            <div class="form-floating mb-3">
              <Field
                id="password"
                name="password"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': errors['password'] }"
                placeholder="請輸入密碼"
                rules="required"
                v-model="user.password"
              >
              </Field>
              <label for="password" class="form-label">使用者密碼</label>
              <ErrorMessage name="password" class="invalid-feedback"></ErrorMessage>
            </div>
            <button id="btn-login" class="btn btn-lg btn-dark w-100 mt-3" type="submit">
              登入
            </button>
          </Form>
        </div>
      </div>
      <p class="mt-5 mb-3 text-white">
        &copy; 2021~∞ - 六角學院
      </p>
    </div>
  </div>
  <div class="d-flex justify-content-center w-100">
    <Alert v-if="isShowAlert" :customClass="alertClass" :content="alertMsg" />
  </div>
</template>

<style>
.form-signin {
  height: auto;
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.card-signin {
  opacity: 0.9;
  background-color: #6d8c6f;
}
</style>

<script>
const body = document.querySelector('body');
const html = document.querySelector('html');

export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      alertClass: 'alert-success',
      alertMsg: 'HiHi',
      isShowAlert: false,
    };
  },
  inject: ['emitter', '$httpMessageState'],
  methods: {
    onLogin() {
      this.$http
        .post(`${process.env.VUE_APP_API}/admin/signin`, this.user)
        .then((res) => {
          // console.log(res);
          if (res.data.success) {
            this.isShowAlert = true;
            this.alertClass = 'alert-success';
            this.alertMsg = res.data.message;
            this.$httpMessageState(res, '登入');
            // 延遲1.5秒後轉頁面
            setTimeout(() => {
              // 解構出 token 與 expired
              const { token, expired } = res.data;
              // token存入Cookie
              this.accessCookie(token, expired);
              // 轉址到後台頁面
              this.$router.push('/backend');
            }, 1500);
          } else {
            // window.alert(res.data.message);
            this.isShowAlert = true;
            this.alertClass = 'alert-danger';
            this.alertMsg = res.data.message;
          }
        })
        .catch((err) => {
          const errMsg = err.response.data.message;
          console.log(errMsg);
        });
    },
    checkLogin() {
      const api = `${process.env.VUE_APP_API}/api/user/check`;
      this.$http
        .post(api)
        .then((res) => {
          if (res.data.success) {
            this.isShowAlert = true;
            this.alertClass = 'alert-warning';
            this.alertMsg = '你已登入! 即將轉頁至後台';
            setTimeout(() => {
              this.$router.push('/backend');
            }, 1500);
          } else {
            // ...
          }
        })
        .catch((err) => {
          const errMsg = err.response.data.message;
          console.log(errMsg);
        });
    },
    /** 存取Cookie */
    accessCookie(token, expired) {
      document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
    },
  },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    this.$http.defaults.headers.common.Authorization = token;
    this.checkLogin();
  },
  mounted() {
    // 進入登入頁設定樣式
    body.className = 'Login-body-style Login-body-center';
    html.className = 'Login-body-center';
  },
  unmounted() {
    // 離開時，移除樣式
    body.className = '';
    html.className = '';
  },
};
</script>
