<template>
  <q-layout>
    <HeaderC />

    <div class="q-pa-md q-mb-lg full-width">
      <div class="q-pa-md s full-width">
        <div v-if="loading" class="text-h5 text-bold">
          Pesquisando por: "{{ token }}"
        </div>

        <div v-if="products.length == 0 && !loading" class="text-h5 text-bold">
          "{{ products.length }}" resuldados para: "{{ token }}""
        </div>

        <div class="q-pt-lg q-mb-xl q-gutter-md">
          <!-- skeleton -->
          <div
            v-if="loading"
            style="
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
              gap: 16px;
            "
          >
            <q-card
              v-for="p in 6"
              :key="p"
              style="box-shadow: none; min-width: 150px"
            >
              <q-skeleton height="200px" square />
              <q-item>
                <q-item-section>
                  <q-item-label><q-skeleton type="text" /></q-item-label>
                  <q-item-label caption
                    ><q-skeleton type="text"
                  /></q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
          </div>

          <!-- product -->
          <div
            v-if="products.length > 0 && !loading"
            :style="
              $q.screen.lt.md
                ? {
                    'grid-template-columns':
                      'repeat(auto-fill, minmax(100px, 1fr))',
                  }
                : {
                    'grid-template-columns':
                      'repeat(auto-fill, minmax(150px, 1fr))',
                  }
            "
            style="display: grid; grid-auto-flow: dense; gap: 16px"
          >
            <q-card
              v-for="product in products"
              :key="product.id"
              @click="$router.push('/product/' + product.id)"
              :style="{
                'box-shadow': 'none',
                'grid-row-end': `span ${Math.ceil(
                  product.images[0].height / 200
                )}`,
              }"
            >
              <q-img
                v-if="product.images.length > 0"
                :src="getImageUrl(product.images[0])"
                spinner-color="white"
                style="
                  object-fit: contain;
                  overflow: hidden;
                  vertical-align: middle;
                  border-radius: 22px;
                  border: 1px solid black;
                  padding: 8px;
                  width: 100%;
                  height: auto;
                "
              />
              <q-img
                v-else
                src="https://via.placeholder.com/300x300"
                spinner-color="white"
                style="
                  object-fit: contain;
                  overflow: hidden;
                  vertical-align: middle;
                  border-radius: 22px;
                  border: 1px solid black;
                  padding: 8px;
                  width: 100%;
                  height: auto;
                "
              />
              <q-card-section style="text-align: center">
                <q-item-label>{{ product.name }}</q-item-label>
                <q-item-label
            v-if="product.price_discount != 0"
            style="font-size: 20px; color: black"
          >
            <span
              style="
                text-decoration: line-through;
                color: #b5475f;
                font-size: 14px;
              "
            >
              {{ product.price }} MT
            </span>
            <span style="color: chocolate; font-weight: bold"
              >{{ product.price_discount }} MT</span
            >
          </q-item-label>
          <q-item-label
            v-else
            style="font-weight: bold; font-size: 20px; color: chocolate"
          >
            {{ product.price }} MT
          </q-item-label>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <q-banner
          v-if="!isAuthenticated"
          class="custom-banner"
          rounded
          dense
          style="background-image: linear-gradient(to right, #f79824, #fddf63)"
        >
          <q-icon name="star" size="lg" class="banner-icon" />
          <div class="q-ml-md flex flex-column">
            <div class="banner-text">
              <strong
                >🚀 Entre ou crie uma conta para aproveitar o melhor!</strong
              >
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
      </div>

      <!-- Categorias -->
      <div class="q-pa-md q-mb-lg full-width">
        <div class="text-h5 text-bold" style="color: #333">Categorias</div>
        <div class="scroll-container">
          <div
            class="scroll-content q-mb-lg q-pt-md q-pb-md"
            style="
              display: grid;
              grid-auto-flow: column;
              gap: 16px;
              overflow-x: auto;
              scroll-behavior: smooth;
              scrollbar-width: none;
            "
            id="scrollable-div"
          >
            <!-- Card Categoria -->
            <div
              @click="$router.push('/find/Casual')"
              class="category-card"
              style="background: linear-gradient(145deg, #1e3c72, #2a5298)"
            >
              <q-icon name="weekend" class="category-icon" />
              <div class="category-label">Roupas Casuais</div>
            </div>

            <div
              @click="$router.push('/find/Trabalho')"
              class="category-card"
              style="background: linear-gradient(145deg, #16a085, #1abc9c)"
            >
              <q-icon name="work_outline" class="category-icon" />
              <div class="category-label">Roupas de Trabalho</div>
            </div>

            <div
              @click="$router.push('/find/Esporte')"
              class="category-card"
              style="background: linear-gradient(145deg, #e74c3c, #c0392b)"
            >
              <q-icon name="fitness_center" class="category-icon" />
              <div class="category-label">Roupas Esportivas</div>
            </div>

            <div
              @click="$router.push('/find/intimas')"
              class="category-card"
              style="background: linear-gradient(145deg, #8e44ad, #9b59b6)"
            >
              <q-icon name="local_mall" class="category-icon" />
              <div class="category-label">Roupas Íntimas</div>
            </div>

            <div
              @click="$router.push('/find/Festa')"
              class="category-card"
              style="background: linear-gradient(145deg, #f39c12, #e67e22)"
            >
              <q-icon name="celebration" class="category-icon" />
              <div class="category-label">Roupas de Festa</div>
            </div>

            <div
              @click="$router.push('/find/Inverno')"
              class="category-card"
              style="background: linear-gradient(145deg, #3498db, #2980b9)"
            >
              <q-icon name="ac_unit" class="category-icon" />
              <div class="category-label">Roupas de Inverno</div>
            </div>

            <div
              @click="$router.push('/find/Verão')"
              class="category-card"
              style="background: linear-gradient(145deg, #f1c40f, #f39c12)"
            >
              <q-icon name="wb_sunny" class="category-icon" />
              <div class="category-label">Roupas de Verão</div>
            </div>

            <div
              @click="$router.push('/find/Infantis')"
              class="category-card"
              style="background: linear-gradient(145deg, #2ecc71, #27ae60)"
            >
              <q-icon name="child_friendly" class="category-icon" />
              <div class="category-label">Roupas Infantis</div>
            </div>

            <div
              class="category-card"
              style="background: linear-gradient(145deg, #e74c3c, #c0392b)"
            >
              <q-icon name="accessibility" class="category-icon" />
              <div class="category-label">Plus Size</div>
            </div>

            <div
              class="category-card"
              style="background: linear-gradient(145deg, #1abc9c, #16a085)"
            >
              <q-icon name="pool" class="category-icon" />
              <div class="category-label">Roupas de Banho</div>
            </div>
          </div>
        </div>
      </div>
      <!-- Promo -->
      <div
        rounded
        style="border-radius: 2rem"
        class="row items-center full-width bg-red-3 text-white q-mt-md"
      >
        <div class="col-41">
          <img
            src="~assets/Remove-bg.ai_1721846998542.png"
            style="
              object-fit: contain;
              overflow: hidden;
              border-radius: 22px;
              padding: 8px;
              max-width: 150px;
            "
          />
        </div>

        <div class="col-6 text-wrap">
          <div class="text-h6 col-6 text-wrap">Promoção de Black Friday</div>

          <!-- Conteúdo condicional com base no tamanho da tela -->
          <div v-if="!$q.screen.lt.md" class="text-subtitle col-6 text-wrap">
            Aproveite a Oferta Explosiva com descontos incríveis de até 70% em
            produtos selecionados. Não perca a chance de renovar seu estoque,
            garantir presentes ou adquirir aquele item dos sonhos por um preço
            que você nunca viu!
          </div>

          <div v-else class="text-subtitle col-6 text-wrap">
            Aproveite a Oferta Explosiva com descontos incríveis de até 70% em
            produtos selecionados.
          </div>
        </div>
      </div>

      <div v-if="false" class="text-h5 text-bold">
        Tambem pode lhe interressar
      </div>
      <div
        v-if="false"
        class="q-pt-lg q-pb-lg"
        style="
          display: grid;
          grid-auto-flow: column;
          gap: 16px;
          overflow-x: auto;
          padding: 0 16px;
          scrollbar-width: none; /* Firefox */
        "
      >
        <!-- skeleton -->
        <q-card
          v-for="p in 6"
          :key="p"
          v-show="products.length == 0"
          style="box-shadow: none; min-width: 150px; max-width: 200px"
        >
          <q-skeleton height="200px" square />
          <q-item>
            <q-item-section>
              <q-item-label>
                <q-skeleton type="text" />
              </q-item-label>
              <q-item-label caption>
                <q-skeleton type="text" />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card>

        <!-- Products -->
        <q-card
          v-for="product in products1"
          :key="product.id"
          @click="$router.push('/product/' + product.id)"
          style="
            box-shadow: none;
            height: auto;
            min-width: 150px;
            max-width: 200px;
            border-radius: 1rem;
          "
        >
          <q-img
            v-if="product.images.length > 0"
            :src="getImageUrl(product.images[0])"
            spinner-color="white"
            style="object-fit: contain; padding: 8px"
          />
          <q-img
            v-else
            src="https://via.placeholder.com/300x300"
            spinner-color="white"
            style="
              object-fit: contain;
              border-radius: 22px;
              border: 1px solid black;
              padding: 8px;
            "
          />
          <q-card-section style="text-align: center">
            <q-item-label>{{ product.name }}</q-item-label>
            <q-item-label
              style="
                font-weight: bold;
                color: #bd6513; /* Dourado */
                font-size: 22px;
                -webkit-text-stroke: 0.1px white; /* Borda preta no texto */
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* Leve sombra para mais destaque */
              "
            >
              {{ product.price }} MT
            </q-item-label>
          </q-card-section>
        </q-card>
      </div>

      <!-- Mostrar tabs se o usuário estiver autenticado -->
      <div
        style="
          position: fixed;
          bottom: 20px;
          width: 90%;
          display: flex;
          justify-content: center;
          z-index: 99;
        "
        v-if="$q.screen.lt.md"
      >
        <q-tabs
          align="justify"
          class="q-pa-sm"
          active-color="primary"
          indicator-color="primary"
          style="background-color: #bd6513; border-radius: 3rem"
        >
          <q-tab name="sales" icon="home" />
          <q-tab
            v-if="isAuthenticated"
            name="orders"
            icon="receipt"
            @click="goToOrders"
          />
          <q-tab
            v-if="!isAuthenticated"
            name="orders"
            icon="receipt"
            @click="goToLogin"
          />
          <q-tab name="products" icon="shopping_cart" @click="goToCart">
            <q-badge
              v-if="totalItemsInCart > 0"
              floating
              color="red"
              rounded
              :label="totalItemsInCart"
          /></q-tab>
          <q-tab
            v-if="isAuthenticated"
            name="reviews"
            icon="person"
            @click="goToProfile"
          />
          <q-tab
            v-if="!isAuthenticated"
            name="reviews"
            icon="person"
            @click="goToLogin"
          />
        </q-tabs>
      </div>
    </div>
  </q-layout>
</template>

<script>
import store from "src/store/index.js";
import apiMethods from "src/router/api.js";
import HeaderC from "components/store/HeaderC.vue";
export default {
  name: "ProductsPage",
  components: {
    HeaderC,
  },
  data() {
    return {
      products: [],
      products1: [],
      visibleProducts: [],
      cardMinWidth1: "200px",
      token: this.$route.params.token,
    };
  },

  created() {
    // this.fetchProducts();
    this.fetchProductById();
  },
  watch: {
    "$route.params.token": function (newToken) {
      this.token = newToken; // Atualiza o valor do token
      this.fetchProductById(); // Função para buscar produtos com o novo token
    },
  },
  computed: {
    isAuthenticated() {
      return store.state.user ? true : false;
    },
    leftDrawerOpen() {
      return store.state.leftDrawerOpen;
    },

    cardMinWidth() {
      if (window.innerWidth > 450) {
        return "150px";
      } else if (window.innerWidth > 300) {
        return "120px";
      } else if (window.innerWidth > 200) {
        return "180px";
      } else {
        return "100px";
      }
    },
    innerWidth() {
      if (window.innerWidth > 2000) {
        return "62px";
      } else if (window.innerWidth > 700) {
        return "19px";
      } else {
        return "6";
      }
    },
    totalItemsInCart() {
      return store.getters.totalItemsInCart;
    },
  },
  methods: {
    toggleLeftDrawer() {
      store.commit("toggleLeftDrawer");
    },
    async fetchProductById() {
      try {
        this.token = this.$route.params.token;
        this.loading = true;
        this.error = null;
        const response = await apiMethods.searchProducts(this.token);
        this.products = response.data;
        // console.log("Response from API:", response.data); // Deb

        fbq("track", "Search", {
          search_string: this.token,
          // content_category: "Calçados",
        });

        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.error = "Error fetching item details";
        console.error("Erro ao buscar produtos:", error);
      }
    },
    getImageUrl(imageName) {
      // console.log(apiMethods.baseURL()+`/storage/product_images/${imageName.name}`)
      return apiMethods.baseURL() + `/storage/product_images/${imageName.name}`;
    },
    goToCart() {
      this.$router.push("/cart");
    },
    goToRegister() {
      this.$router.push("/register");
    },
    goToOrders() {
      this.$router.push("/c/show-packs");
    },
    goToLogin() {
      this.$router.push("/login");
    },
    goToProfile() {
      this.$router.push("/c/profile");
    },
    async fetchProducts() {
      try {
        const response = await apiMethods.getPublicProducts();
        this.products1 = response.data;
        // console.log(this.products)
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    },
    initIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.6,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.visibleProducts.push(entry.target.id);
          } else {
            const index = this.visibleProducts.indexOf(entry.target.id);
            if (index > -1) {
              this.visibleProducts.splice(index, 1);
            }
          }
        });
      }, options);

      this.$refs.productCards.forEach((card) => {
        observer.observe(card);
      });
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
