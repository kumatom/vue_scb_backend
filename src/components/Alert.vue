<template>
  <div class="alert mt-4" :class="alertClass" role="alert">
    {{ content }}
  </div>
</template>

<script>
export default {
  props: ['content', 'customClass'],
  data() {
    return {
      alertClass: 'alert-danger',
    };
  },
  created() {
    this.alertClass = this.customClass;
  },
};
</script>
