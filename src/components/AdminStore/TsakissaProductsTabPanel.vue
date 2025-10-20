<template>
  <div name="products">
    <div v-if="show404" class="row align-center">Recurso nao encontrado</div>
    <div v-if="!show404">
      <div v-if="products.length == 0" class="text-h6 text-subtitle">
        Ainda sem Produtos cadastrados
      </div>

      <div
        class="q-pt-lg q-gutter-md"
        :style="{
          width: '100%',
          display: 'flex',
          'flex-wrap': 'wrap',
          'margin-top': '2px',
          'margin-bottom': '2px',
          'justify-content': 'center',
        }"
      >
        <q-card
          class="col-4 col-sm-4 col-md-4 col-lg-2"
          v-for="product in products"
          :key="product.id"
          @click="viewProduct(product)"
          :style="{
            'box-shadow': 'none',
            'max-width': cardMinWidth,
            'min-width': cardMinWidth,
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
              flex: 1 1 0%;
              padding: 8px;
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
              flex: 1 1 0%;
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

      <!-- Modal para visualizar e editar produto -->
      <q-dialog
        persistent
        maximized
        full-width
        transition-show="slide-up"
        transition-hide="slide-down"
        v-model="showProductModal"
      >
        <q-card class="q-pa-md col-12">
          <div
            style="
              position: fixed;
              top: 0;
              right: 0;
              left: 0;
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0 20px;
              z-index: 99;
              border-bottom: 1px solid rgba(0, 0, 0, 0.1);
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            "
            class="q-mb-md text-start bg-white text-black"
          >
            <q-toolbar>
              <q-btn
                flat
                round
                dense
                @click="cancelar"
                size="md"
                icon="arrow_back"
              ></q-btn>
              <q-toolbar-title>
                <q-card-section style="padding-bottom: 0px; padding-top: 0px">
                  <h2 v-show="selectedProduct" class="text-h6">
                    Editar Produto
                  </h2>
                  <h2 v-show="selectedProduct == null" class="text-h6">
                    Adicionar Produto
                  </h2>
                </q-card-section>
              </q-toolbar-title>

              <q-btn
                v-show="selectedProduct == null"
                rounded
                dense
                label="Guardar"
                class="bg-green-2 glowing-shadow-add"
                type="submit"
                @click="createProduct"
              ></q-btn>

              <q-btn
                v-show="selectedProduct"
                rounded
                dense
                label="Atualizar"
                class="bg-green-2 glowing-shadow-update"
                @click="createProduct"
              ></q-btn>

              <q-btn
                v-show="selectedProduct"
                rounded
                dense
                class="bg-red-2 glowing-shadow-cancel"
                @click="deleteProduct"
                label="Apagar"
              />
            </q-toolbar>
          </div>

          <div>
            <q-form
              class="row"
              @submit="createProduct"
              lazy-validation
              :style="{
                display: 'flex',
                'flex-wrap': 'wrap',
              }"
              style="margin-top: 60px"
            >
              <q-card-section
                style="padding-bottom: 0px; padding-top: 0px"
                class="col-md-6 col-12 q-mb-xl"
              >
                <q-card
                  dark
                  class="bg-white q-mb-md"
                  style="
                    margin-top: 60px;
                    border: 1px solid rgba(0, 0, 0, 0.12);
                  "
                >
                  <q-card-section>
                    <div class="text-h6 text-black">Imagens</div>
                  </q-card-section>

                  <q-separator dark inset />

                  <q-card-section>
                    <div class="q-mb-md">
                      <div class="image-preview">
                        <img
                          v-for="image in form.images"
                          :key="image"
                          :src="getImageUrl(image)"
                          class="preview-image"
                        />
                        <img
                          v-for="image in imagePreview"
                          :key="image"
                          :src="image"
                          class="preview-image"
                        />
                        <label
                          for="upload-images"
                          class="upload-label text-center"
                        >
                          <q-icon name="add_photo_alternate" size="48px" />
                          <span>Adicionar Foto</span>
                        </label>
                      </div>

                      <input
                        type="file"
                        id="upload-images"
                        accept="image/*"
                        multiple
                        @change="previewImage"
                        class="upload-input"
                      />
                    </div>
                  </q-card-section>
                </q-card>

                <q-card
                  dark
                  elevated
                  class="bg-white q-mb-md"
                  style="border: 1px solid rgba(0, 0, 0, 0.12)"
                >
                  <q-card-section>
                    <div class="text-h6 text-black">Descrição</div>
                  </q-card-section>

                  <q-separator dark inset />

                  <q-card-section>
                    <q-input
                      v-model="form.name"
                      label="Nome do Produto"
                      outlined
                      required
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="form.description"
                      label="Descrição"
                      outlined
                      required
                      type="textarea"
                      rows="5"
                      counter
                      maxlength="500"
                    />
                  </q-card-section>
                </q-card>

                <q-card
                  dark
                  elevated
                  class="bg-white q-mb-md"
                  style="border: 1px solid rgba(0, 0, 0, 0.12)"
                >
                  <q-card-section>
                    <div class="text-h6 text-black">Detalhes</div>
                  </q-card-section>

                  <q-separator dark inset />

                  <q-card-section>
                    <q-input
                      v-model="form.dimensions"
                      label="Dimensões"
                      outlined
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="form.weight"
                      label="Peso"
                      outlined
                      type="number"
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="form.attributes"
                      label="Atributos"
                      outlined
                      class="q-mb-md"
                    />
                  </q-card-section>
                </q-card>

                <q-card
                  dark
                  elevated
                  class="bg-white q-mb-md"
                  style="border: 1px solid rgba(0, 0, 0, 0.12)"
                >
                  <q-card-section>
                    <div class="text-h6 text-black">Categorias e Tags</div>
                    <!-- <div class="text-subtitle2 text-black">by John Doe</div> -->
                  </q-card-section>

                  <q-separator dark inset />

                  <q-card-section>
                    <q-select
                      v-model="form.categories"
                      :options="categories"
                      label="Categorias"
                      outlined
                      required
                      emit-value
                      map-options
                      class="q-mb-md"
                    />
                    <q-select
                      v-model="form.tags"
                      :options="tags"
                      label="Tags"
                      outlined
                      emit-value
                      required
                      map-options
                      multiple
                      class="q-mb-md"
                    />
                  </q-card-section>
                </q-card>
              </q-card-section>

              <q-card-section class="col-md-6 col-12">
                <q-card
                  dark
                  elevated
                  class="bg-white q-mb-md"
                  style="border: 1px solid rgba(0, 0, 0, 0.12)"
                >
                  <q-card-section>
                    <div class="text-h6 text-black">Iventario</div>
                  </q-card-section>

                  <q-separator dark inset />

                  <q-card-section>
                    <q-input
                      v-model="form.price"
                      label="Preço"
                      outlined
                      type="number"
                      required
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="form.price_discount"
                      label="Preço com Desconto"
                      outlined
                      type="number"
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="form.stock"
                      label="Estoque"
                      outlined
                      type="number"
                      required
                      class="q-mb-md"
                    />
                  </q-card-section>
                </q-card>
              </q-card-section>
            </q-form>
          </div>
        </q-card>
      </q-dialog>
    </div>
    <div
      style="
        position: fixed;
        bottom: 12px;
        right: 12px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        z-index: 99;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      "
    >
      <q-btn
        label1="Adicionar Produto"
        @click="openProductForm"
        fab
        icon="add"
        color="accent"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
import { useQuasar, Notify } from "quasar";
import { useRoute } from "vue-router";
import apiMethods from "src/router/api.js";
export default {
  data() {
    return {
      form: {
        name: "",
        description: "",
        price: 0,
        price_discount: 0,
        stock: 0,
        dimensions: "",
        weight: 0,
        attributes: "",
        images: [],
        status: "ATIVO",
        categories: [],
        tags: [],
      },
      categories: ["Decorações", "Cartões", "Brindes", "adesivos"],
      tags: ["Promoção", "Novidade", "Mais Vendidos", "Exclusivo"],
      imagePreview: [],
      todos: [],
      products: [],
      selectedProduct: null,
      showProductModal: false,
    };
  },
  mounted() {
    this.getProductById();
  },
  computed: {
    cardMinWidth() {
      if (window.innerWidth > 550) {
        return "200px";
      } else if (window.innerWidth > 400) {
        return "130px";
      } else if (window.innerWidth > 300) {
        return "220px";
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
  },

  methods: {
    openProductForm() {
      this.selectedProduct = null;
      this.resetForm();
      this.showProductModal = true;
    },
    async viewProduct(product) {
      this.selectedProduct = product;
      this.fillForm(product);
      this.showProductModal = true;
    },
    async editProduct(product) {
      this.selectedProduct = product;
      this.fillForm(product);
      this.showProductModal = true;
    },

    resetForm() {
      (this.form = {
        name: "",
        description: "",
        price: 0,
        price_discount: 0,
        stock: 0,
        dimensions: "",
        weight: 0,
        attributes: "",
        images: [],
        status: "ATIVO",
        category: null,
        tags: [],
      }),
        (this.imagePreview = []);
    },
    fillForm(product) {
      this.form = {
        ...product,
        // images: [], // Handle images separately
        categories: product.categories.map((cat) => cat.id),
        tags: product.tags.map((tag) => tag.id),
      };
    },
    submitForm() {
      // Simula o envio dos dados
      setTimeout(() => {
        alert("Produto cadastrado com sucesso!");
        this.clearForm();
      }, 1000);
    },

    async fetchProducts() {
      try {
        const response = await apiMethods.getProducts();
        this.products = response.data;
        // console.log(this.products);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    },

    clearForm() {
      (this.form = {
        name: "",
        description: "",
        price: 0,
        price_discount: 0,
        stock: 0,
        dimensions: "",
        weight: 0,
        attributes: "",
        images: [],
        status: "ATIVO",
        category: null,
        tags: [],
      }),
        (this.imagePreview = []);
    },

    getImageUrl(imageName) {
      return apiMethods.baseURL() + `/storage/product_images/${imageName.name}`;
    },

    previewImage(event) {
      this.imagePreview = [];
      this.form.images = []; // Limpa as prévias de imagem anteriores
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          continue; // Ignora arquivos que não são imagens
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview.push(e.target.result);
          this.form.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },

    async createProduct() {
      console.log(this.selectedProduct);
      this.$q.loading.show({
        delay: 400, // ms
      });
      try {
        if (this.selectedProduct) {
          this.form.price_discount = this.form.price_discount || 0;
          const response = await apiMethods.updateProduct(
            this.selectedProduct.id,
            this.form
          );
          // console.log(response);
        } else {
          const response = await apiMethods.createProduct(this.form);
          // console.log(response);
        }
        this.fetchProducts();
        this.showProductModal = false;
      } catch (error) {
        console.error("Erro ao salvar produto:", error.response.data);
      }
      this.$q.loading.hide();
    },
    cancelar() {
      this.showProductModal = false;
      this.resetForm();
    },

    async deleteProduct() {
      if (this.selectedProduct) {
        this.$q.loading.show({
          delay: 400, // ms
        });

        try {
          const response = await apiMethods.deleteProduct(
            this.selectedProduct.id
          );
          // console.log(response);
          this.fetchProducts();
          this.$q.loading.hide();
          this.showProductModal = false;
          this.resetForm();
        } catch (error) {
          console.error("Erro ao salvar produto:", error.response.data);
          this.$q.loading.hide();
        }
      }
    },

    getProductById() {
      // console.log(this.$route.params.id);
      const id = this.$route.params.id;
      if (!id) {
        return;
      }
      // console.log(id);
      this.$q.loading.show({
        delay: 400, // ms
      });

      $api
        .getProductById(id)
        .then((response) => {
          // console.log(response.data);
          this.form = response.data.product;
          this.product = response.data;
          this.isshow404();
          // console.log(this.form);
          this.$q.loading.hide();
        })
        .catch((error) => {
          console.error("Erro ao cadastrar:", error);
          this.$q.loading.hide();
          if (error.response.status == 404) {
            // this.isshow404();
          }
          this.$q.notify({
            type: "negative",
            message: "Erro ao carregar produto.",
          });
        });
    },
  },
  mounted() {
    this.fetchProducts();
    // this.fetchCategoriesAndTags();
  },
  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const id = ref(route.params.id);
    const product = ref(null);
    const show404 = ref(false);

    const isshow404 = () => {
      show404.value = !show404.value;
    };

    onMounted(() => {});

    return {
      id,
      product,
      show404,
      isshow404,
    };
  },
};
</script>
<style scoped>
.image-preview {
  display: flex;
  overflow-x: auto; /* Habilita a rolagem horizontal */
  white-space: nowrap; /* Impede quebra de linha */
  gap: 10px; /* Espaçamento entre os itens */
}

.preview-image {
  flex: 0 0 90%; /* Evita redimensionamento automático */
  max-height: 250px; /* Altura máxima das imagens */
  object-fit: cover;
}

.upload-label {
  flex: 0 0 90%; /* Faz a label ocupar 90% da largura da tela */
  display: flex; /* Usar Flexbox */
  flex-direction: column; /* Colocar ícone e texto em coluna */
  padding: 6px 12px;
  cursor: pointer;
  background-color: #97928e;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  height: 200px;
  align-items: center; /* Centralizar itens horizontalmente */
  text-align: center;
  justify-content: center; /* Centralizar itens verticalmente */
}

.upload-input {
  display: none;
}

.glowing-shadow-add {
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.6),
    /* Brilho verde */ 0 0 20px rgba(0, 255, 0, 0.4),
    0 0 30px rgba(0, 255, 0, 0.2);
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
</style>
