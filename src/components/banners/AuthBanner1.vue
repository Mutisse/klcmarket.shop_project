<template>
  <q-banner
  v-if="!isAuthenticated"
    rounded
    dense
    style="background-image: linear-gradient(to right, #f79824, #fddf63)"
  >
    <q-icon name="star" size="lg" class="banner-icon" />
    <div class="q-ml-md flex flex-column">
      <div class="banner-text">
        <strong>🚀 Entre ou crie uma conta para aproveitar o melhor!</strong>
        <br />
        <span>Ganhe acesso a ofertas exclusivas e muito mais.</span>
      </div>
      <div class="banner-buttons q-mt-sm">
        <q-btn
          label="Criar Conta"
          color="white"
          text-color="primary"
          class="q-mr-sm"
          @click="goToRegister"
        />
        <q-btn
          label="Entrar"
          color="secondary"
          text-color="white"
          @click="goToLogin"
        />
      </div>
    </div>
  </q-banner>
</template>

<script>
import store from "src/store/index.js";

export default {
  name: "FAQPage",
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {
    isAuthenticated() {
      return store.state.user ? true : false;
    },
  },
  methods: {
    goToRegister() {
      this.$router.push("/register");
    },

    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 12px;
  min-width: 120px;
  height: 150px;
  color: white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.category-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.category-label {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

.scroll-container-subscription {
  display: flex;
  overflow-x: auto;
  padding: 20px;
  gap: 20px;
  /* background: linear-gradient(135deg, #f3f3f3 0%, #e0e0e0 100%); */
  /* box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1); */
  padding-bottom: 100px;
  position: relative;
  width: 100%;
  left: 0;
  right: 0;
}

.my-card {
  min-width: 320px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.my-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.card-header {
  background: linear-gradient(135deg, #6a086d, #f609ee);
  color: white;
  padding: 10px;
  border-radius: 15px 15px 0 0;
  text-align: start;
}

.card-content {
  padding: 20px;
  overflow: hidden;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.q-footer {
  padding: 1rem;
  position: relative;
  bottom: 0;
  width: 100%;
}

.footer-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.footer-section {
  flex: 1 1 30%;
  margin-right: 1rem;
}

.product-card {
  transition: transform 0.3s, filter 0.3s;
  /* filter: blur(2px); */
}

.product-card.highlighted-product {
  transform: scale(1.1);
  filter: blur(0);
}

.product-card.even-product {
  background-color: #87ceeb; /* Azul céu */
}

.product-card.odd-product {
  background-color: #d3d3d3; /* Cinza claro */
}

.glowing-shadow-add {
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.6),
    /* Brilho vermelho */ 0 0 20px rgba(255, 0, 0, 0.4),
    0 0 30px rgba(255, 0, 0, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}

.custom-banner {
  position: relative;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 16px;
}

.banner-icon {
  /* color: #fff; */
}

.banner-text {
  font-size: 18px;
}

.banner-buttons {
  margin-top: 10px;
}

.banner-buttons .q-btn {
  margin-right: 8px;
}
</style>
