<template>
  <Navbar />
  <div v-if="isCheck" class="container-fulid">
    <div class="container">
      <router-view />
    </div>
  </div>
  <!-- Alert提示 -->
  <div class="d-flex justify-content-center w-100">
    <Alert v-if="!isCheck" :customClass="alertClass" :content="alertMsg" />
  </div>
</template>

<script>
// 導入Navbar
import Navbar from '@/components/Navbar.vue';

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      isCheck: false,
      alertClass: 'alert-danger',
      alertMsg: '驗證中，請稍後...',
    };
  },
  inject: ['emitter', '$httpMessageState'],
  methods: {
    checkLogin() {
      const api = `${process.env.VUE_APP_API}/api/user/check`;
      this.$http
        .post(api)
        .then((res) => {
          if (res.data.success) {
            this.isCheck = true;
            this.$router.push('/backend/products');
          } else {
            this.isCheck = false;
            this.alertMsg = '授權無效，請先登入!';
            this.$httpMessageState(res, '授權');
            setTimeout(() => {
              this.$router.push('/');
            }, 1000);
          }
        })
        .catch((err) => {
          const errMsg = err.response.data.message;
          console.log(errMsg);
        });
    },
  },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    this.$http.defaults.headers.common.Authorization = token;
    this.checkLogin();
  },
};
</script>
