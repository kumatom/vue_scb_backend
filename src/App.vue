<template>
  <ToastMessages />
  <router-view />
</template>

<style lang="scss">
@import './assets/all';
// bootstrap icon
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.0/font/bootstrap-icons.css');
</style>

<script>
import ToastMessages from '@/components/ToastMessages.vue';
import emitter from '@/methods/eventBus';
import $httpMessageState from '@/methods/pushMessageState';

export default {
  provide() {
    return {
      emitter,
      $httpMessageState,
    };
  },
  components: {
    ToastMessages,
  },
};
</script>
