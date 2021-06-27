<template>
  <div>
    <Loading :active="isLoading" :z-index="1070"></Loading>
    <div class="text-end mt-4">
      <button class="btn btn-primary text-white" type="button" @click="openModal(true)">
        建立新的產品
        <i class="bi bi-plus-circle"></i>
      </button>
    </div>
    <div class="table-responsive">
      <table class="table mt-4">
        <thead>
          <tr>
            <th>編號</th>
            <th width="200">產品圖片</th>
            <th width="120">分類</th>
            <th>產品名稱</th>
            <th width="120">原價</th>
            <th width="120">售價</th>
            <th width="100">是否啟用</th>
            <th width="200">編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in products" :key="item.id">
            <td>{{ key + 1 }}</td>
            <td>
              <img :src="item.imageUrl" alt="" width="200" />
            </td>
            <td>{{ item.category }}</td>
            <td>{{ item.title }}</td>
            <td class="text-right">
              {{ $filters.currency(item.origin_price) }}
            </td>
            <td class="text-right">
              {{ $filters.currency(item.price) }}
            </td>
            <td>
              <span v-if="item.is_enabled" class="text-success">啟用</span>
              <span v-else>未啟用</span>
            </td>
            <td>
              <div class="btn-group align-item-center">
                <button
                  class="btn btn-outline-primary btn-md"
                  type="button"
                  @click="openModal(false, item)"
                >
                  編輯
                </button>
                <button
                  class="btn btn-outline-danger btn-md"
                  type="button"
                  @click="openDelProductModal(item)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination :pages="pagination" @emit-pages="getProducts" />
    <!-- ProductModal -->
    <ProductModal
      @update-product="updateProduct"
      :product="tempProduct"
      :isNew="isNew"
      ref="productModal"
    />
    <!-- DelModal -->
    <DelModal :product="tempProduct" ref="delModal" @del-item="delProduct" />
  </div>
</template>

<script>
import DelModal from '@/components/DelModal.vue';
import Pagination from '@/components/Pagination.vue';
import ProductModal from '@/components/ProductModal.vue';

export default {
  data() {
    return {
      baseAPI: `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}`,
      products: [],
      pagination: {},
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false,
      isLoading: false,
      status: {
        fileUploading: false,
      },
      modal: {
        editModal: '',
        delModal: '',
      },
      currentPage: 1,
    };
  },
  components: {
    ProductModal,
    DelModal,
    Pagination,
  },
  inject: ['emitter', '$httpMessageState'],
  methods: {
    // 更改Loading狀態
    chageLoadingStatus(status) {
      this.isLoading = status;
    },
    // 取得產品列表
    getProducts(page = 1) {
      this.currentPage = page;
      const api = `${this.baseAPI}/admin/products?page=${page}`;
      this.chageLoadingStatus(true);
      this.$http
        .get(api)
        .then((response) => {
          this.chageLoadingStatus(false);
          if (response.data.success) {
            this.products = response.data.products;
            this.pagination = response.data.pagination;
          } else {
            this.$httpMessageState(response, '產品列表');
          }
        })
        .catch((err) => {
          console.dir(err);
        });
    },
    // 開啟產品Modal
    openModal(isNew, item) {
      // isNew => 是否為新增產品
      if (isNew) {
        this.tempProduct = {};
        this.isNew = true;
      } else {
        this.tempProduct = { ...item };
        this.isNew = false;
      }
      const productComponent = this.$refs.productModal;
      productComponent.openModal();
    },
    // 編輯產品 Or 新增產品
    updateProduct(item) {
      this.tempProduct = item;
      let api = `${this.baseAPI}/admin/product`;
      let httpMethod = 'post';
      let status = '新增產品';
      // isNew => 是否為新增產品
      if (!this.isNew) {
        api = `${this.baseAPI}/admin/product/${this.tempProduct.id}`;
        httpMethod = 'put';
        status = '編輯產品';
      }
      this.chageLoadingStatus(true);
      const productComponent = this.$refs.productModal;
      this.$http[httpMethod](api, { data: this.tempProduct })
        .then((response) => {
          this.chageLoadingStatus(false);
          if (response.data.success) {
            this.$httpMessageState(response, status);
            productComponent.hideModal();
            this.getProducts(this.currentPage);
          } else {
            this.$httpMessageState(response, status);
          }
        })
        .catch((err) => {
          console.dir(err);
        });
    },
    openDelProductModal(item) {
      this.tempProduct = { ...item };
      const delComponent = this.$refs.delModal;
      delComponent.openModal();
    },
    delProduct() {
      const url = `${this.baseAPI}/admin/product/${this.tempProduct.id}`;

      this.chageLoadingStatus(true);
      this.$http
        .delete(url)
        .then((response) => {
          this.chageLoadingStatus(false);
          if (response.data.success) {
            this.$httpMessageState(response, '刪除產品');
            const delComponent = this.$refs.delModal;
            delComponent.hideModal();
            this.getProducts(this.currentPage);
          } else {
            this.$httpMessageState(response, '刪除產品');
          }
        })
        .catch((err) => {
          console.dir(err);
        });
    },
  },
  created() {
    this.getProducts();
  },
};
</script>
