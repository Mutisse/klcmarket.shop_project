<template>
  <q-toolbar
    style="
      /* position: fixed; */
      /* top: 15px; */
      width: 100%;
      display: flex;
      justify-content: center;
      z-index: 99999;
    "
  >
    <div
      :class="
        $q.screen.lt.md
          ? 'q-pt-md  justify-between'
          : 'q-pt-md text-center items-center justify-around'
      "
      class="row full-width"
    >
      <img
        src="~assets/logo-klc-market1.png"
        alt="KLC Market"
        style="width: 40px"
      />
      <input
        :class="$q.screen.lt.md ? 'col-8 ' : 'col-4  bg-grey-4 '"
        style="border-radius: 1rem; height: 30px"
        placeholder="Procurar mais produtos"
        v-model="search"
      />
      <div
        :class="
          $q.screen.lt.md
            ? 'q-pt-xl1 q-ml-md1 col-12 '
            : ' col-4 q-pt-md q-ml-md '
        "
        class="row text-start"
      >
        <div class="text-subtitle1 q-mr-md">Java</div>
        <div class="text-subtitle1 q-mr-md">Java</div>
        <div class="text-subtitle1 q-mr-md">Vender</div>
        <div class="text-subtitle1 q-mr-md">Java</div>
      </div>
    </div>
  </q-toolbar>

  <div
    v-if="product"
    class="full-width row justify-center"
    :class="$q.screen.lt.md ? '' : 'q-gutter-lg'"
    style="margin-bottom: 102px"
  >
    <div class="col-11 col-md-3">
      <q-separator class="full-width q-mt-md q-mb-md" color="gray" inset />
      <q-img
        class="col-6 bg-grey-3"
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
          height: auto;
        "
      />
    </div>

    <div class="col-11 col-md-3">
      <q-separator class="full-width q-mt-md" color="gray" inset />

      <q-card-section
        class="row justify-between text-center text-black"
        style="text-align: center"
      >
        <q-item-label style="font-weight: bold; font-size: 20px">
          {{ product.name }}
        </q-item-label>
        <q-item-label
          v-if="product.price_discount != 0"
          style="font-weight: bold; font-size: 20px"
        >
          <span
            style="
              font-weight: bold;
              font-size: 15px;
              text-decoration: line-through;
              color: chocolate;
            "
          >
            {{ product.price_discount }} MT</span
          >
          {{ product.price_discount }} MT
        </q-item-label>
        <q-item-label v-else style="font-weight: bold; font-size: 20px">
          {{ product.price }} MT
        </q-item-label>
      </q-card-section>

      <!-- estado e nr de vendidos -->
      <q-card-section
        class="row justify-between text-center text-black"
        style="text-align: center"
      >
        <q-item-label>
          Novo ||
          <span style="color: green"> 200 Vendidos</span> ||
          <span style="color: grey"> 20 Disponivel</span>
        </q-item-label>
      </q-card-section>

      <!-- descricao -->
      <q-card-section class="row justify-between text-black">
        <div>
          {{ product.description }}
        </div>
      </q-card-section>

      <!-- detalhes -->
      <q-card-section
        class="text-black q-card q-mt-md bg-grey-3 row text-start text-black"
      >
        <q-item-label class="col-6" style="font-size: 15px">
          Tamanho:
        </q-item-label>
        <q-item-label class="col-6" style="font-size: 18px">
          {{ product.dimensions }}
        </q-item-label>
        <q-item-label class="col-6" style="font-size: 15px">
          Atributos:
        </q-item-label>
        <q-item-label class="col-6" style="font-size: 18px">
          {{ product.attributes }}
        </q-item-label>
      </q-card-section>
    </div>

    <div class="col-11 col-md-3">
      <!-- Metodos de Entrega -->
      <q-card-section class="text-black">
        <q-separator
          style="margin-bottom: 8px"
          class="full-width q-mb-md1"
          color="gray"
          inset
        />

        <div style="font-weight: bold; font-size: 15px">
          Levante grátis a partir de uma agência KLC Market
        </div>
        <div style="font-size: 15px">Ver no mapa</div>
      </q-card-section>
      <q-card-section class="text-black">
        <span style="font-weight: bold; font-size: 15px"
          >Devolução grátis.
        </span>
        <span>Você tem 3 dias a partir da data de recebimento.</span>

        <br />

        <span style="font-weight: bold; font-size: 15px"
          >Compra Garantida.
        </span>
        <span
          >Receba o produto que está esperando ou devolvemos o dinheiro.</span
        >
      </q-card-section>

      <!-- Metodos de pagamento -->
      <q-card-section class="text-black">
        <q-separator
          style="margin-bottom: 8px"
          class="full-width q-mb-md1"
          color="gray"
          inset
        />

        <div style="font-weight: bold; font-size: 15px">
          Métodos de pagamento
        </div>
        <div style="font-size: 15px">Pagamento na entrega.</div>
        <div style="font-size: 15px">Pagamento ao receber.</div>
      </q-card-section>

      <!-- botoes de compra e carrinho -->
      <div style="width: 100%; display: flex; justify-content: center">
        <div style="display: flex; justify-content: center">
          <q-btn
            v-if="getProductCartById(product.id) > 0"
            rounded
            dense
            label="Concluir compra"
            color="grey-9"
            @click="goToCart"
          >
          </q-btn
          ><q-btn
            v-if="getProductCartById(product.id) < 1"
            rounded
            dense
            label="Comprar agora"
            color="black"
            @click="goToCart"
          ></q-btn>
          <q-toolbar-title>
            <q-card-section style="padding-bottom: 0px; padding-top: 0px">
            </q-card-section>
          </q-toolbar-title>

          <div class="q-mb-md">
            <q-btn-group
              v-if="getProductCartById(product.id) > 0"
              class="q-mb-md"
              style="box-shadow: none"
            >
              <q-btn
                style="width: 10px; background-color: #b5475f; color: white"
                icon="remove"
                @click="decrementProductQuantity(product.id)"
              />
              <input
                :value="getProductCartById(product.id)"
                style="
                  width: 50px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  text-align: center;
                "
                filled
              />
              <q-btn
                style="width: 10px; background-color: #b5475f; color: white"
                icon="add"
                @click="incrementProductQuantity(product.id)"
              />
            </q-btn-group>
          </div>

          <q-btn
            v-if="getProductCartById(product.id) < 1"
            style="padding: 9px; border-radius: 5rem"
            dense
            class="bg-red-2 glowing-shadow-cancel"
            icon="add_shopping_cart"
            label="Adicionar ao carrinho"
            @click="addProductToCart"
          />
        </div>
      </div>
    </div>

    <div class="col-12">
      <!-- Categorias e tags -->
      <div class="q-pt-md">
        <div class="q-mb-md" v-if="product.categories.length > 0">
          <q-card-section>
            <div class="text-subtitle1">Categorias</div>
            <q-chip
              v-for="category in product.categories"
              :key="category.id"
              color="primary"
              text-color="white"
              icon="category"
              class="q-mr-sm q-mb-sm"
            >
              {{ category.name }}
            </q-chip>
          </q-card-section>
        </div>

        <div v-if="product.tags.length > 0">
          <q-card-section>
            <div class="text-subtitle1">Tags</div>

            <q-chip
              v-for="tag in product.tags"
              :key="tag.id"
              color="secondary"
              text-color="white"
              icon="label"
              class="q-mr-sm q-mb-sm"
            >
              {{ tag.name }}
            </q-chip>
          </q-card-section>
        </div>
      </div>

      <!-- Perfil do vendedor -->
      <ProfileOfDealler />

      <!-- Perguntas Frequentes -->
      <q-card-section>
        <q-item-label style="font-weight: bold; font-size: 18px"
          >Perguntas Frequentes</q-item-label
        >

        <div v-for="faq in filteredFaqs" :key="faq.id" class="q-pa-sm">
          <q-expansion-item
            expand-separator
            :label="faq.question"
            icon="question_answer"
            dense
          >
            <div>{{ faq.answer }}</div>
          </q-expansion-item>
        </div>

        <!-- Campo para Nova Pergunta -->
        <q-input
          v-model="newQuestion"
          placeholder="Digite sua pergunta..."
          dense
          filled
          @input="searchQuestion"
          @keyup.enter="addQuestion"
          class="q-my-md"
        />

        <q-btn
          label="Perguntar"
          class="full-width"
          @click="addQuestion"
          color="primary"
          dense
          :disable="!newQuestion.trim()"
        />
      </q-card-section>

      <!-- Frequentes -->
      <q-card-section>
        <q-item-label style="font-weight: bold; font-size: 18px"
          >Comentários</q-item-label
        >

        <div v-for="comment in comments" :key="comment.id" class="q-mb-md">
          <q-item>
            <q-item-section avatar>
              <q-avatar v-if="comment.photo" size="50px">
                <img :src="comment.photo" alt="User photo" />
              </q-avatar>
              <q-avatar v-else size="50px" color="grey-4">
                <q-icon name="person" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-bold">{{ comment.name }}</q-item-label>
              <q-item-label caption>{{ comment.text }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <!-- Campo para Novo Comentário -->
        <q-input
          v-model="newCommentText"
          placeholder="Escreva seu comentário..."
          filled
          dense
          class="q-mb-md"
          @keyup.enter="addComment"
        />
        <q-btn
          label="Comentar"
          class="full-width"
          color="primary"
          @click="addComment"
          :disable="!newCommentText.trim()"
          dense
        />
      </q-card-section>
    </div>

     <!-- botoes de compra e carrinho -->
     <div
     v-if=" $q.screen.lt.md"
      style="
        position: fixed;
        bottom: 15px;
        width: 100%;
        display: flex;
        justify-content: center;
        z-index: 99999;
      "
    >
      <q-toolbar style="width: 80%; display: flex; justify-content: center">
        <q-btn
          v-if="getProductCartById(product.id) > 0"
          style="height: 70px; padding: 9px"
          rounded
          dense
          label="Concluir compra"
          color="grey-9"
          @click="goToCart"
        >
        </q-btn
        ><q-btn
          v-if="getProductCartById(product.id) < 1"
          style="height: 70px; padding: 9px"
          rounded
          dense
          label="Comprar agora"
          color="black"
          @click="goToCart"
        ></q-btn>
        <q-toolbar-title>
          <q-card-section style="padding-bottom: 0px; padding-top: 0px">
          </q-card-section>
        </q-toolbar-title>

        <div class="q-mb-md">
          <q-btn-group
            v-if="getProductCartById(product.id) > 0"
            class="q-mb-md"
            style="box-shadow: none"
          >
            <q-btn
              style="width: 10px; background-color: #b5475f; color: white"
              icon="remove"
              @click="decrementProductQuantity(product.id)"
            />
            <input
              :value="getProductCartById(product.id)"
              style="
                width: 50px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-align: center;
              "
              filled
            />
            <q-btn
              style="width: 10px; background-color: #b5475f; color: white"
              icon="add"
              @click="incrementProductQuantity(product.id)"
            />
          </q-btn-group>
        </div>

        <q-btn
          v-if="getProductCartById(product.id) < 1"
          style="height: 70px; width: 100px; padding: 9px; border-radius: 5rem"
          dense
          class="bg-red-2 glowing-shadow-cancel"
          icon="add_shopping_cart"
          @click="addProductToCart"
        />
      </q-toolbar>
    </div>
  </div>
  <div v-else>Carregando, aguarde...</div>
</template>

<script>
import store from "src/store/index.js";
import apiMethods from "src/router/api.js";
import ProfileOfDealler from "components/store/ProfileOfDealler.vue";

export default {
  name: "ProductsPage",
  components: {
    ProfileOfDealler,
  },
  data() {
    return {
      product: null,
      selectedProduct: null,
      showProductModal: false,
      loading: false,
      error: null,
      faqs: [
        {
          id: 1,
          question: "Qual é o prazo de entrega?",
          answer: "O prazo de entrega é de 3 a 5 dias úteis.",
        },
        {
          id: 2,
          question: "Posso devolver o produto?",
          answer: "Sim, você tem até 7 dias para devolução.",
        },
        {
          id: 3,
          question: "Como posso pagar?",
          answer: "Aceitamos pagamentos por M-Pesa, MoMo, e cartões.",
        },
      ],
      newQuestion: "",
      filteredFaqs: [],
      comments: [
        {
          id: 1,
          name: "João Silva",
          text: "Ótimo produto, recomendo!",
          photo: "https://via.placeholder.com/50",
        },
        {
          id: 2,
          name: "Maria Oliveira",
          text: "Chegou rápido e é de ótima qualidade.",
        },
        {
          id: 3,
          name: "Carlos Mendes",
          text: "Tive um problema com a entrega, mas foi resolvido rapidamente.",
          photo: "https://via.placeholder.com/50",
        },
      ],
      newCommentText: "",
    };
  },
  created() {
    this.fetchProductById();
  },
  mounted() {
    this.filteredFaqs = this.faqs; // Inicia exibindo todas as perguntas
  },
  computed: {
    totalItemsInCart() {
      return store.getters.totalItemsInCart;
    },
  },
  methods: {
    addComment() {
      if (!this.newCommentText.trim()) return;

      const newComment = {
        id: this.comments.length + 1,
        name: "Usuário Anônimo",
        text: this.newCommentText,
        photo: null,
      };

      this.comments.push(newComment);
      this.newCommentText = "";
    },
    searchQuestion() {
      // Filtra perguntas que contêm partes da nova pergunta digitada
      this.filteredFaqs = this.faqs.filter((faq) =>
        faq.question.toLowerCase().includes(this.newQuestion.toLowerCase())
      );
    },
    addQuestion() {
      if (!this.newQuestion.trim()) return;

      // Verifica se a pergunta já existe
      const existingFaq = this.faqs.find(
        (faq) => faq.question.toLowerCase() === this.newQuestion.toLowerCase()
      );

      if (existingFaq) {
        alert("Esta pergunta já está nas perguntas frequentes!");
        return;
      }

      // Adiciona nova pergunta como uma entrada para revisão futura
      alert(`Pergunta enviada: "${this.newQuestion}"`);
      this.newQuestion = "";
      this.searchQuestion(); // Atualiza a busca
    },
    voltar() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },
    getProductCartById(id) {
      let product = store.getters.getProductCartById(id);
      if (product) {
        // console.log(product);
        return product.quantity;
      }
      return 0;
    },
    increment() {
      store.commit("increment");
    },
    showCart() {
      store.commit("showCart");
    },

    incrementProductQuantity(id) {
      store.getters.incrementProductQuantity(id);
    },
    decrementProductQuantity(id) {
      store.getters.decrementProductQuantity(id, true);
    },

    decrementProductQuantity2(id) {
      store.getters.decrementProductQuantity(id);
    },
    async fetchProductById() {
      try {
        const id = this.$route.params.id;
        this.loading = true;
        this.error = null;
        const response = await apiMethods.getPublicProductById(id);
        this.product = response.data.product;
        console.log("Response from API:", response.data.product); // Deb
      } catch (error) {
        this.error = "Error fetching item details";
        console.error("Erro ao buscar produtos:", error);
      }
    },
    getImageUrl(imageName) {
      return apiMethods.baseURL() + `/storage/product_images/${imageName.name}`;
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

    addProductToCart() {
      if (this.product != null) {
        store.commit("addToCart", this.product);
      }
    },
    goToCart1() {
      this.$router.push("/cart");
    },
    goToCart() {
      if (this.getProductCartById(this.product.id) < 1) {
        store.commit("addToCart", this.product);
      }
      this.$router.push("/cart");
    },
  },
};
</script>

<style scoped>
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
</style>
