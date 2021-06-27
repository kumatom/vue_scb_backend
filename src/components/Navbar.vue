<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <span class="navbar-brand">
        <img src="https://i.imgur.com/kUYxttR.png" alt="" width="45" class="me-3">
        <span>Sugar Cafe Bar 後台管理</span>
      </span>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/backend/products">產品</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/backend/orders">訂單</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/backend/coupons">優惠券</router-link>
          </li>
        </ul>
        <span class="navbar-text">
          <button class="btn btn-secondary" @click.prevent="signOut">
            登出
            <i class="bi bi-box-arrow-in-right"></i>
          </button>
        </span>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      currentPage: '',
    };
  },
  inject: ['emitter', '$httpMessageState'],
  methods: {
    signOut() {
      const api = `${process.env.VUE_APP_API}/logout`;
      this.$http
        .post(api)
        .then((res) => {
          if (res.data.success) {
            // 清空cookie => Token
            this.$httpMessageState(res, '登出');
            document.cookie = `hexToken='';expires=${new Date(-1)}; path=/`;
            this.$router.push('/');
          } else {
            this.$httpMessageState(res, '登出');
          }
        })
        .catch((err) => {
          const errMsg = err.response.data.message;
          console.log(errMsg);
        });
    },
  },
};
</script>
