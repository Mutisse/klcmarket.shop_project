<template>
  <div class="q-pa-md q-mb-lg full-width">
    <div class="text-h5 text-bold">Produtos em destaques</div>
    <div
      class="q-pt-lg q-pb-lg"
      style="
        display: grid;
        grid-auto-flow: column;
        gap: 16px;
        overflow-x: auto;
        padding: 0 16px;
        scrollbar-width: none; /* Firefox */
        justify-content: left;
        scrollbar-width: thin; /* Firefox */
        scroll-behavior: smooth;
        justify-content: start;
        -webkit-overflow-scrolling: touch; /* Mobile Safari */
        cursor: pointer;
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
        v-for="product in highlightedProducts"
        :key="product.id"
        @click="$router.push('product/' + product.id+'/' + product.name)"
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
          style="
            object-fit: contain;
            padding: 8px;
            max-height: 200px;
            max-height: 200px;
          "
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

    <!-- outros -->
    <div v-if="false" class="q-pt-xl q-ml-md 1">
      <div class="q-mb-md row justify-around bg-white">
        <q-item>
          <q-item-section avatar>
            <q-icon name="verified_user" />
          </q-item-section>
          <q-item-section>
            <div class="text-h6">Garantia e Segurança</div>
            <div>Problemas? Seu dinheiro de volta!</div>
          </q-item-section>
        </q-item>

        <q-separator :vertical="!$q.screen.lt.md" inset />

        <q-item>
          <q-item-section avatar>
            <q-icon name="payment" />
          </q-item-section>
          <q-item-section>
            <div class="text-h6">Pagamento no site</div>
            <div>Conheça as formas de pagamento</div>
          </q-item-section>
        </q-item>

        <q-separator :vertical="!$q.screen.lt.md" inset />

        <q-item @click="contactSupport">
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section>
            <div class="text-h6">Atendimento pelo WhatsApp</div>
            <div>Quando sua compra chegar</div>
          </q-item-section>
        </q-item>
      </div>
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
        <div class="text-h6 col-6 text-wrap">
          🎁✨Rosas murcham, chocolates derretem… Mas um bom presente fica na
          memória!
        </div>

        <!-- Conteúdo condicional com base no tamanho da tela -->
        <div v-if="!$q.screen.lt.md" class="text-subtitle col-6 text-wrap">
          Mostre seu amor com algo que dure além do momento. Encontre o presente
          perfeito para tornar este São Valentim inesquecível! 💝✨
        </div>

        <div v-else class="text-subtitle col-6 text-wrap">
          Mostre seu amor com algo que dure além do momento. Encontre o presente
          perfeito para tornar este São Valentim inesquecível! 💝✨
        </div>
      </div>
    </div>

    <div class="q-pa-md s full-width">
      <div class="text-h5 text-bold">Explorar</div>
      <div class="q-pt-lg q-mb-xl q-gutter-md">
        <!-- skeleton -->
        <div
          v-if="products.length === 0"
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
                <q-item-label caption><q-skeleton type="text" /></q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
        </div>

        <!-- product -->
        <div
          v-else
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
            @click="$router.push(`/product/${product.id}/${product.name}`)"
            :style="{
              'box-shadow': 'none',
              'grid-row-end':
                product.images && product.images[0]?.height
                  ? `span ${Math.ceil(product.images[0].height / 200)}`
                  : 'span 1',
            }"
          >
            <q-img
              v-if="product.images.length > 0"
              :src="getImageUrl(product.images[0])"
              :alt="product.name"
              spinner-color="white"
              style="
                object-fit: contain;
                overflow: hidden;
                vertical-align: middle;
                border-radius: 22px;
                border: 1px solid black;
                padding: 8px;
                width: 100%;
                max-height: 200px;
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
      <div v-if="page <= totalPages" class="q-ma-md text-center">
        <q-btn
          @click="fetchProducts"
          :loading="loading"
          style="font-weight: bold; font-size: 17px; color: chocolate"
          unelevated
        >
          Ver Mais...
        </q-btn>
      </div>
      <AuthBanner />
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
        <q-tab name="sales" style="color: white" icon="home" />
        <q-tab
          v-if="isAuthenticated"
          name="orders"
          icon="receipt"
          style="color: white"
          @click="goToOrders"
        />
        <q-tab
          v-if="!isAuthenticated"
          name="orders"
          icon="receipt"
          style="color: white"
          @click="goToLogin"
        />
        <q-tab
          name="products"
          style="color: white"
          icon="shopping_cart"
          @click="goToCart"
        >
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
          style="color: white"
          @click="goToProfile"
        />
        <q-tab
          v-if="!isAuthenticated"
          name="reviews"
          style="color: white"
          icon="person"
          @click="goToLogin"
        />
      </q-tabs>
    </div>
  </div>

  <!-- Modelo de receita/ subscricao -->
  <div class="scroll-container-subscription" v-if="false">
    <q-card class="my-card" flat bordered>
      <q-card-section>
        <div class="card-header row">
          <q-icon name="attach_money" class="text-green" size="2em" />
          <div class="text-subtitle1">Começe a vender Gratuitamente</div>
        </div>

        <div class="card-content">
          <p>
            <strong>Conte com os melhores benefícios no KLC Market</strong>
          </p>

          <div class="row">
            <q-icon name="attach_money" class="text-green col-2" size="2em" />
            <div class="text-h6 text-primary col-10">Assinatura Grátis</div>
          </div>

          <div class="row">
            <q-icon name="attach_money" class="text-green col-2" size="2em" />
            <p class="q-mt-sm col-10">
              Publique até 10 produtos <strong>Gratuitamente</strong>, taxa de
              5% por venda
            </p>
          </div>
          <q-btn
            label="Comece Agora"
            to="modelo-basico"
            class="q-mr-sm text-bold q-px-lg q-py-sm full-width"
            style="
              background: linear-gradient(45deg, #ff6f00, #ff9100);
              border-radius: 30px;
              box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
              transition: transform 0.3s ease;
              color: white;
            "
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card class="my-card" v-if="false" flat bordered>
      <q-card-section>
        <div class="card-header row">
          <q-icon name="attach_money" class="text-green" size="2em" />
          <div class="text-subtitle1">Começe a vender Gratuitamente</div>
        </div>

        <div class="card-content">
          <p>
            <strong>Conte com os melhores benefícios no KLC Market</strong>
          </p>

          <div class="row">
            <q-icon name="attach_money" class="text-green col-2" size="2em" />
            <div class="text-h6 text-primary col-10">Assinatura Grátis</div>
          </div>

          <div class="row">
            <q-icon name="attach_money" class="text-green col-2" size="2em" />
            <p class="q-mt-sm col-10">
              Publique até 10 produtos <strong>Gratuitamente</strong>, taxa de
              5% por venda
            </p>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="my-card" v-if="false" flat bordered>
      <q-card-section>
        <div class="card-header row">
          <q-icon name="attach_money" class="text-green" size="2em" />
          <div class="text-subtitle1">Começe a vender Gratuitamente</div>
        </div>

        <div class="card-content">
          <p>
            <strong>Conte com os melhores benefícios no KLC Market</strong>
          </p>

          <div class="row">
            <q-icon name="attach_money" class="text-green col-2" size="2em" />
            <div class="text-h6 text-primary col-10">Assinatura Grátis</div>
          </div>

          <div class="row">
            <q-icon name="attach_money" class="text-green col-2" size="2em" />
            <p class="q-mt-sm col-10">
              Publique até 10 produtos <strong>Gratuitamente</strong>, taxa de
              5% por venda
            </p>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import store from "src/store/index.js";
import apiMethods from "src/router/api.js";
import AuthBanner from "src/components/banners/AuthBanner1.vue";

export default {
  name: "ProductsPage",
  data() {
    return {
      totalPages:null,
      products: [],
      highlightedProducts: [],

      visibleProducts: [],
      cardMinWidth1: "200px",
      page: 1, // Página atual
      loading: false, // Evita chamadas duplicadas
      lastPage: null, // Última página disponível
    };
  },
  components: {
    AuthBanner,
  },
  created() {
    this.fetchProducts();
  },
  mounted() {
    // this.initIntersectionObserver();
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
    contactSupport() {
      // Adicione a lógica para redirecionar ao WhatsApp
      window.open("https://wa.me/258873703909", "_blank");
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
      if (this.loading || (this.lastPage && this.page > this.lastPage)) {
        return;
      }

      try {
        this.loading = true;
        const response = await apiMethods.getPublicProducts({
          page: this.page,
        });
        console.log(response);

        // Adiciona apenas produtos que ainda não estão na lista
        this.products = [
          ...this.products,
          ...response.data.data.filter(
            (newProduct) =>
              !this.products.some((product) => product.id === newProduct.id)
          ),
        ];

        this.totalPages = response.data.last_page; // Número total de páginas


        this.highlightedProducts = [...this.products].sort(
          () => Math.random() - 0.5
        );

        // Adicionar os produtos novos sem apagar os antigos
        this.lastPage = response.data.last_page; // Atualiza a última página disponível
        this.page++; // Próxima página
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        this.loading = false;
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
