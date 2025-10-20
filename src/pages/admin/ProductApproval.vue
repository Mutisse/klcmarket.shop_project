<template>
  <div name="product-approval" style="background-color: #f2f2f5">
    <div v-if="show404" class="row align-center q-pt-lg">
      Nenhum produto pendente encontrado
    </div>

    <div v-if="!show404">
      <div
        v-if="pendingProducts && pendingProducts.length === 0"
        class="text-h6 text-subtitle q-pt-lg"
      >
        Nenhum produto pendente de aprovação
      </div>

      <div
        class="q-pt-lg q-pa-md flex flex-wrap q-gutter-md"
        style="width: 100%"
      >
        <q-card
          class="col-4 col-sm-4 col-md-4 col-lg-2 q-pa-none q-shadow-none"
          v-for="product in pendingProducts"
          :key="product.id"
          @click="viewProduct(product)"
          style="max-width: 45%; width: 200px"
        >
          <!-- Imagem do Produto -->
          <q-img
            :src="
              product.images.length > 0
                ? getImageUrl(product.images[0])
                : 'https://via.placeholder.com/300x300'
            "
            spinner-color="white"
            class="product-img"
          />

          <!-- Detalhes do Produto -->
          <q-card-section class="text-center">
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
              <span style="color: chocolate; font-weight: bold">
                {{ product.price_discount }} MT
              </span>
            </q-item-label>
            <q-item-label
              v-else
              style="font-weight: bold; font-size: 20px; color: chocolate"
            >
              {{ product.price }} MT
            </q-item-label>
            <q-item-label>
              Status: {{ product.status === 'PENDENTE' ? 'Pendente' : product.status }}
            </q-item-label>
          </q-card-section>
        </q-card>
      </div>

      <!-- Modal para visualizar e aprovar/rejeitar produto -->
      <q-dialog
        persistent
        maximized
        transition-show="slide-up"
        transition-hide="slide-down"
        v-model="showProductModal"
      >
        <q-card class="q-pa-md">
          <q-header class="q-mb-md text-start bg-white text-black">
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
                  <h2 class="text-h6">Revisar Produto</h2>
                </q-card-section>
              </q-toolbar-title>

              <q-btn
                rounded
                dense
                label="Aprovar"
                class="bg-green-2 glowing-shadow-approve q-mr-md"
                @click="approveProduct"
              ></q-btn>
              <q-btn
                rounded
                dense
                label="Rejeitar"
                class="bg-red-2 glowing-shadow-reject"
                @click="rejectProduct"
              ></q-btn>
            </q-toolbar>
          </q-header>

          <div>
            <q-form
              class="row q-pt-lg"
              :style="{
                display: 'flex',
                'flex-wrap': 'wrap',
              }"
            >
              <q-card-section
                style="padding-bottom: 0px; padding-top: 0px"
                class="col-md-12 col-12 q-mb-xl"
              >
                <q-card
                  dark
                  class="bg-white q-mb-md"
                  style="border: 1px solid rgba(0, 0, 0, 0.12)"
                >
                  <q-card-section>
                    <div class="text-h6 text-black">Imagens</div>
                  </q-card-section>
                  <q-separator dark inset />
                  <q-card-section>
                    <div class="image-preview">
                      <div
                        v-for="(image, index) in form.images"
                        :key="'form-' + index"
                        class="image-container"
                      >
                        <img :src="getImageUrl(image)" class="preview-image" />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

                <q-card
                  dark
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
                      readonly
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="form.description"
                      label="Descrição"
                      outlined
                      readonly
                      type="textarea"
                      rows="5"
                      class="q-mb-md"
                    />
                    <q-select
                      v-model="form.category"
                      :options="categories"
                      label="Categoria"
                      outlined
                      readonly
                      class="q-mb-md"
                    />
                    <q-select
                      v-if="form.category === 'Vestuário & Moda'"
                      v-model="form.subcategory"
                      :options="subcategories"
                      label="Subcategoria"
                      outlined
                      readonly
                      class="q-mb-md"
                    />
                    <q-select
                      v-if="form.category === 'Casa & Decoração'"
                      v-model="form.subcategoryCasaDecor"
                      :options="subcategoryCasaDecors"
                      label="Subcategoria"
                      outlined
                      readonly
                      class="q-mb-md"
                    />
                    <q-select
                      v-if="form.category === 'Saúde & Beleza'"
                      v-model="form.subcategoriesSaudeBeleza"
                      :options="subcategoriesSaudeBelezas"
                      label="Subcategoria"
                      outlined
                      readonly
                      class="q-mb-md"
                    />
                    <q-select
                      v-model="form.public"
                      :options="publicOptions"
                      label="Público"
                      outlined
                      readonly
                      multiple
                      class="q-mb-md"
                    />
                  </q-card-section>
                </q-card>

                <q-card
                  dark
                  class="bg-white q-mb-md"
                  style="border: 1px solid rgba(0, 0, 0, 0.12)"
                >
                  <q-card-section>
                    <div class="text-h6 text-black">Inventário</div>
                  </q-card-section>
                  <q-separator dark inset />
                  <q-card-section>
                    <q-input
                      v-model="form.price"
                      label="Preço"
                      outlined
                      type="number"
                      readonly
                      class="q-mb-md"
                    />
                    <q-input
                      v-if="hasDiscount"
                      v-model="form.price_discount"
                      label="Preço com Desconto"
                      outlined
                      type="number"
                      readonly
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="form.stock"
                      label="Estoque"
                      outlined
                      type="number"
                      readonly
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
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
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
        images: [],
        status: "PENDENTE",
        category: null,
        subcategory: null,
        subcategoryCasaDecor: null,
        subcategoriesSaudeBeleza: null,
        public: [],
      },
      hasDiscount: false,
      categories: [
        "Vestuário & Moda",
        "Casa & Decoração",
        "Saúde & Beleza",
        "Pet Shop",
      ],
      subcategories: [
        "Roupas",
        "Calçados",
        "Acessórios",
        "Joias e Bijuterias",
        "Moda Íntima e Praia",
      ],
      subcategoryCasaDecors: [
        "Móveis",
        "Iluminação",
        "Tecidos para Casa",
        "Decoração",
        "Organização",
        "Utensílios Domésticos",
        "Jardim e Exterior",
        "Banheiro",
        "Cozinha",
        "Quarto",
        "Sala de Estar",
        "Home Office",
        "Produtos Sustentáveis",
      ],
      subcategoriesSaudeBelezas: ["Saúde", "Beleza"],
      publicOptions: [
        { label: "Masculino", value: "masculino" },
        { label: "Feminino", value: "feminino" },
        { label: "Infantil", value: "infantil" },
        { label: "Plus Size", value: "plus_size" },
      ],
      pendingProducts: [],
      selectedProduct: null,
      showProductModal: false,
      show404: false,
    };
  },
  methods: {
    async fetchPendingProducts() {
      try {
        const response = await apiMethods.getPendingProducts();
        this.pendingProducts = response.data.data;
        console.log(response.data)
        this.show404 = this.pendingProducts.length === 0;
      } catch (error) {
        console.error("Erro ao buscar produtos pendentes:", error);
        this.show404 = true;
      }
    },
    async viewProduct(product) {
      this.resetForm();
      this.selectedProduct = product;
      this.fillForm(product);
      this.hasDiscount = product.price_discount > 0;
      this.showProductModal = true;
    },
    fillForm(product) {
      this.form = {
        ...product,
        public: Array.isArray(product.public) ? product.public : [],
      };
    },
    resetForm() {
      this.form = {
        name: "",
        description: "",
        price: 0,
        price_discount: 0,
        stock: 0,
        images: [],
        status: "PENDENTE",
        category: null,
        subcategory: null,
        subcategoryCasaDecor: null,
        subcategoriesSaudeBeleza: null,
        public: [],
      };
      this.hasDiscount = false;
      this.selectedProduct = null;
    },
    getImageUrl(imageName) {
      return apiMethods.baseURL() + `/storage/product_images/${imageName.name}`;
    },
    async approveProduct() {
      if (this.selectedProduct) {
        this.$q.loading.show({ delay: 400 });
        try {
          await apiMethods.updateProduct(this.selectedProduct.id, {
            ...this.form,
            status: "ATIVO",
          });
          this.fetchPendingProducts();
          this.showProductModal = false;
          this.resetForm();
          this.$q.notify({
            type: "positive",
            message: "Produto aprovado com sucesso!",
          });
        } catch (error) {
          console.error("Erro ao aprovar produto:", error);
          this.$q.notify({
            type: "negative",
            message: "Erro ao aprovar produto.",
          });
        }
        this.$q.loading.hide();
      }
    },
    async rejectProduct() {
      if (this.selectedProduct) {
        this.$q.loading.show({ delay: 400 });
        try {
          await apiMethods.updateProduct(this.selectedProduct.id, {
            ...this.form,
            status: "REJEITADO",
          });
          this.fetchPendingProducts();
          this.showProductModal = false;
          this.resetForm();
          this.$q.notify({
            type: "positive",
            message: "Produto rejeitado com sucesso!",
          });
        } catch (error) {
          console.error("Erro ao rejeitar produto:", error);
          this.$q.notify({
            type: "negative",
            message: "Erro ao rejeitar produto.",
          });
        }
        this.$q.loading.hide();
      }
    },
    cancelar() {
      this.showProductModal = false;
      this.resetForm();
    },
  },
  mounted() {
    this.fetchPendingProducts();
  },
  setup() {
    const $q = useQuasar();
    return { $q };
  },
};
</script>

<style scoped>
.image-preview {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  gap: 10px;
}
.product-img {
  object-fit: contain;
  overflow: hidden;
  vertical-align: middle;
  border-radius: 22px;
  border: 1px solid black;
  flex: 1 1 0%;
  padding: 8px;
}
.image-container {
  position: relative;
  display: inline-block;
  margin: 10px;
}
.preview-image {
  flex: 0 0 90%;
  height: 200px;
  max-height: 200px;
  max-width: 200px;
  object-fit: cover;
}
.glowing-shadow-approve {
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.6),
    0 0 20px rgba(0, 255, 0, 0.4),
    0 0 30px rgba(0, 255, 0, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}
.glowing-shadow-reject {
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.6),
    0 0 20px rgba(255, 0, 0, 0.4),
    0 0 30px rgba(255, 0, 0, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}
</style>
