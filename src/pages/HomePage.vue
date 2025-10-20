<template>
  <q-layout>
    <div class="bg-grey-2">
      <HeaderC />
      <!-- Promo -->
      <!-- {{ loading1 }} -->
      <div
        v-if="$q.screen.gt.xs"
        class="row justify-center items-center full-width text-white q-pa-md"
        style="border-radius: 2rem; position: relative; display: flex"
      >
        <div class="col-41 text-center">
          <q-skeleton v-if="loading1" type="rect" class="banner-skeleton" />
          <img
            v-show="!loading1"
            src="~assets/banner 1 desktop.png"
            class="banner-image"
            @load="loading1 = false"
          />
          <button
            @click="$router.push('/como-vender')"
            class="overlay-button-desktop"
          >
            Criar Agora
          </button>
        </div>
      </div>

      <div
        v-if="false"
        style="
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          position: relative;
        "
      >
        <div class="scroll-container1">
          <div class="scroll-content1">
            <img src="~assets/Banner 2.webp" class="scroll-image" />
            <img src="~assets/Banner 3.webp" class="scroll-image" />
            <img src="~assets/Banner 4.webp" class="scroll-image" />
            <img src="~assets/Banner 2.webp" class="scroll-image" />
            <img src="~assets/Banner 3.webp" class="scroll-image" />
            <img src="~assets/Banner 4.webp" class="scroll-image" />
          </div>
          <div class="scroll-content1">
            <img src="~assets/Banner 2.webp" class="scroll-image" />
            <img src="~assets/Banner 3.webp" class="scroll-image" />
            <img src="~assets/Banner 4.webp" class="scroll-image" />
            <img src="~assets/Banner 2.webp" class="scroll-image" />
            <img src="~assets/Banner 3.webp" class="scroll-image" />
            <img src="~assets/Banner 4.webp" class="scroll-image" />
          </div>
        </div>
      </div>

      <div
        v-if="!$q.screen.gt.xs && true"
        class="row items-center full-width text-white q-pa-md"
        style="
        display: grid;
        grid-auto-flow: column;
        gap: 16px;
        overflow-x: auto;
        padding: 16px 16px;
        scrollbar-width: none; /* Firefox */
        justify-content: left;
        scrollbar-width: thin; /* Firefox */
        scroll-behavior: smooth;
        justify-content: start;
        -webkit-overflow-scrolling: touch; /* Mobile Safari */
        cursor: pointer;
        border-radius: 2rem; position: relative;"
      >
        <div class="col-1211" style="
          box-shadow: none;
          height: auto;
         width:90vw;
          border-radius: 1rem;
        ">
          <img
            v-show="!loading1"
            src="~assets/Banner 2.webp"
            class="banner-image"
            @load="loading1 = false"
          />
          <button @click="$router.push('/como-vender')" class="overlay-button">
            Criar Agora
          </button>
        </div>

        <div class="col-1211" style="
          box-shadow: none;
          height: auto;
          width:90vw;
          border-radius: 1rem;
        ">
          <img
            v-show="!loading1"
            src="~assets/Banner 4.webp"
            class="banner-image"
            @load="loading1 = false"
          />
          <button @click="$router.push('/como-vender')" class="overlay-button">
            Criar Agora
          </button>
        </div>

        <div class="col-1211" style="
          box-shadow: none;
          height: auto;
          width:90vw;
          border-radius: 1rem;
        ">
          <img
            v-show="!loading1"
            src="~assets/Banner 3.webp"
            class="banner-image"
            @load="loading1 = false"
          />
          <button @click="$router.push('/como-vender')" class="overlay-button">
            Criar Agora
          </button>
        </div>
      </div>

      <Banner v-if="false" />
      <FeaturedProducts />
      <FooterC v-if="true" />
    </div>
  </q-layout>
</template>

<script>
// import HeaderCComponents from "components/store/HeaderCComponents.vue";
import Banner from "components/store/BannerC.vue";
import FeaturedProducts from "components/store/FeaturedProducts.vue";
import TestimonialsC from "components/store/TestimonialsC.vue";
import FooterC from "components/store/FooterC.vue";
import HeaderC from "components/store/HeaderC.vue";
import store from "src/store/index.js";
import apiMethods from "src/router/api.js";

export default {
  name: "HomePage",
  components: {
    Banner,
    FeaturedProducts,
    FooterC,
    HeaderC,
  },
  computed: {
    isAuthenticated() {
      return store.state.user ? true : false;
    },
    leftDrawerOpen() {
      return store.state.leftDrawerOpen;
    },
    totalItemsInCart() {
      return store.getters.totalItemsInCart;
    },
  },
  data() {
    return {
      search: "",
      loading: true,
      loading1: this.vTouchRepeat,
      slide: "1",
      lorem:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.",
    };
  },
  computed: {
    user() {
      return store.state.user;
    },
    dashboard() {
      let user = this.user;
      if (user && user.scope) {
        // console.log(user.scope);
        if (user.scope == "admin") {
          return "admin";
        }
        if (user.scope == "entregador") {
          return "/c/dashboard";
        }

        if (user.scope == "cliente") {
          return "/c/dashboard";
        }
      }
      return "/";
    },
  },
  methods: {
    async logout() {
      try {
        this.$q.loading.show({
          message: "Terminando sua sessao",
        });
        // Chama a API para fazer login
        let response = await apiMethods.logout();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.$q.loading.hide();
        store.commit("clearUser");
        //  console.log(response.data.user)
        this.$router.push("/");

        this.$q.notify({
          color: "green",
          textColor: "white",
          icon: "cloud_done",
          message: "Volte sempre, obrigado.",
        });
      } catch (error) {
        // console.error("Erro ao fazer logout:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.$router.push("/login");
        store.commit("clearUser");
      } finally {
        this.$q.loading.hide();
      }
    },
  },
  async mounted() {
    try {
      // this.$q.loading.show({
      //     message: "Terminando sua sessao",
      //   });
      // // Simula um delay para o carregamento inicial
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // if (this.user && this.user.scope === "empresa") {
      //   this.$router.push("/s");
      // }
      // this.$q.loading.hide();
    } catch (error) {
      console.error("Erro ao inicializar:", error);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.banner-skeleton {
  width: 100%;
  height: 200px; /* Ajuste conforme o tamanho real da imagem */
  border-radius: 2rem;
}
</style>

<style>
.scroll-container1 {
  margin-top: 10px;
  display: flex;
  gap: 1rem;
  width: max-content;
  animation: scroll 65s linear infinite;
}

.scroll-content1 {
  display: flex;
  gap: 1rem;
}

.scroll-image {
  width: 100vw; /* 80% da largura da viewport */
  border-radius: 1rem;
  flex-shrink: 0;
  image-rendering: crisp-edges; /* Melhora a qualidade em alguns navegadores */
  image-rendering: -webkit-optimize-contrast; /* Para WebKit (Chrome/Safari) */
}

@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
</style>

<style scoped>
.banner1 {
  width: 100%;
  position: relative;
  background: url("/src/assets/Banner 2.png") no-repeat center center/cover;
}
.bg-white {
  background-color: white;
}
.glowing-shadow-add {
  box-shadow: 0 0 10px rgba(237, 249, 237, 0.6),
    /* Brilho verde */ 0 0 20px rgba(163, 163, 163, 0.4),
    0 0 30px rgba(39, 39, 39, 0);
  transition: box-shadow 0.3s ease-in-out;
}

.glowing-shadow-update {
  box-shadow: 0 0 10px rgba(0, 0, 255, 0.6),
    /* Brilho azul */ 0 0 20px rgba(0, 0, 255, 0.4),
    0 0 30px rgba(0, 0, 255, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}

.glowing-shadow-cancel {
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.6),
    /* Brilho vermelho */ 0 0 20px rgba(255, 0, 0, 0.4),
    0 0 30px rgba(255, 0, 0, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}

.banner-image {
  object-fit: contain;
  overflow: hidden;
  border-radius: 22px;
  max-width: 100%;
  display: block;
}

.overlay-button {
  position: absolute;
  top: 75%;
  left: 39%;
  transform: translate(-50%, -50%);
  background: #007bff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 2rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.overlay-button-desktop {
  position: absolute;
  top: 50%;
  left: 85%;
  transform: translate(-50%, -50%);
  background: #007bff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 2rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.overlay-button:hover {
  background: #0056b3;
}
</style>
