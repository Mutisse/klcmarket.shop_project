<template>
  <q-tab-panel name="products" style="background-color: #f2f2f5">
    <div v-if="show404" class="row align-center q-pt-lg">
      Recurso nao encontrado
    </div>

    <div v-if="!show404">
      <div
        v-if="products && products.length == 0"
        class="text-h6 text-subtitle q-pt-lg"
      >
        Ainda sem Produtos cadastrados
      </div>

      <div
        class="q-pt-lg q-pa-md flex flex-wrap q-gutter-md"
        style="width: 100%"
      >
        <q-card
          class="col-4 col-sm-4 col-md-4 col-lg-2 q-pa-none q-shadow-none"
          v-for="product in products"
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

      <!-- Modal para visualizar e editar produto -->
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
                class="bg-green-2 glowing-shadow-update q-mr-md"
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
          </q-header>

          <div>
            <q-form
              class="row q-pt-lg"
              lazy-validation
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
                        <label
                          for="upload-images"
                          class="upload-label text-center"
                        >
                          <q-icon name="add_photo_alternate" size="48px" />
                          <span>Adicionar Foto</span>
                        </label>

                        <!-- Exibe as imagens de form.images -->
                        <div
                          v-for="(image, index) in form.images"
                          :key="'form-' + index"
                          class="image-container"
                        >
                          <img
                            :src="getImageUrl(image)"
                            class="preview-image"
                          />
                          <button
                            class="remove-btn"
                            @click="removeImage(index, 'form')"
                          >
                            ✖
                          </button>
                        </div>

                        <!-- Exibe as imagens de imagePreview -->
                        <div
                          v-for="(image, index) in imagePreview"
                          :key="'preview-' + index"
                          class="image-container"
                        >
                          <img :src="image" class="preview-image" />
                          <button
                            class="remove-btn"
                            @click="removeImage(index, 'preview')"
                          >
                            ✖
                          </button>
                        </div>
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
                    <!-- Campo para o nome do produto -->
                    <q-input
                      v-model="form.name"
                      label="Nome do Produto"
                      outlined
                      required
                      class="q-mb-md"
                    />

                    <!-- Campo para a descrição do produto -->
                    <q-input
                      v-model="form.description"
                      label="Descrição"
                      outlined
                      required
                      type="textarea"
                      rows="5"
                      counter
                      maxlength="900"
                    />
                  </q-card-section>

                  <!-- Seletor de categorias -->
                  <q-card-section>
                    <q-select
                      v-model="form.category"
                      :options="categories"
                      label="Selecione a Categoria"
                      outlined
                      required
                      class="q-mb-md"
                    />
                  </q-card-section>

                  <!-- Vestuário -->
                  <q-card-section v-if="form.category === 'Vestuário & Moda'">
                    <q-select
                      v-model="form.subcategory"
                      :options="subcategories"
                      label="Selecione a Sub Categoria"
                      outlined
                      required
                      class="q-mb-md"
                    />

                    <q-select
                      v-model="form.occasion"
                      :options="occasions"
                      label="Selecione a Ocasião"
                      outlined
                      required
                      map-options
                      multiple
                      class="q-mb-md"
                    />

                    <!-- Campo Tamanho Dinâmico -->
                    <q-select
                      v-if="form.subcategory === 'Roupas'"
                      v-model="form.size"
                      :options="sizes"
                      label="Tamanho"
                      outlined
                      required
                      class="q-mb-md"
                      emit-value
                      map-options
                      multiple
                    />

                    <q-select
                      v-if="form.subcategory === 'Calçados'"
                      v-model="form.size"
                      :options="sizesShoes"
                      label="Tamanho"
                      outlined
                      required
                      class="q-mb-md"
                      emit-value
                      map-options
                      multiple
                    />

                    <q-input
                      v-if="
                        form.subcategory !== 'Calçados' &&
                        form.subcategory !== 'Roupas'
                      "
                      v-model="form.size"
                      label="Tamanho"
                      outlined
                      required
                      type="textarea"
                      rows="3"
                      counter
                      maxlength="200"
                    />

                    <!-- Campo Tags com múltiplas opções -->
                    <!-- <q-select
                      v-model="form.tags"
                      :options="tags"
                      label="Tags"
                      outlined
                      emit-value
                      required
                      map-options
                      multiple
                      class="q-mb-md"
                    /> -->

                    <!-- Campo Cores com múltiplas opções -->
                    <q-select
                      v-model="form.colors"
                      :options="colors"
                      label="Cores"
                      outlined
                      required
                      class="q-mb-md"
                      emit-value
                      map-options
                      multiple
                    />

                    <q-select
                      v-model="form.material"
                      :options="materials"
                      label="Material"
                      outlined
                      required
                      use-input
                      new-value-mode="add"
                      class="q-mb-md"
                    />
                  </q-card-section>

                  <!-- Casa & Decoração -->
                  <q-card-section v-if="form.category === 'Casa & Decoração'">
                    <q-select
                      v-model="form.subcategoryCasaDecor"
                      :options="subcategoryCasaDecors"
                      label="Selecione a Sub Categoria"
                      outlined
                      required
                      class="q-mb-md"
                    />

                    <q-select
                      v-model="form.occasion"
                      :options="occasions"
                      label="Selecione a Ocasião"
                      outlined
                      required
                      map-options
                      multiple
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="form.material"
                      label="Material"
                      outlined
                      required
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="form.dimensions"
                      label="Tamanhos"
                      outlined
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="form.color"
                      label="Cor"
                      outlined
                      class="q-mb-md"
                      placeholder="Ex: Branco, Preto, Azul, Vermelho, Verde"
                    />
                  </q-card-section>

                  <!-- Saúde & Beleza -->
                  <q-card-section v-if="form.category === 'Saúde & Beleza'">
                    <q-select
                      outlined
                      v-model="form.subcategoriesSaudeBeleza"
                      :options="subcategoriesSaudeBelezas"
                      label="Selecione uma categoria"
                      option-label="label"
                      option-value="value"
                      emit-value
                      map-options
                      class="q-mb-md"
                    />

                    <q-select
                      v-if="form.subcategoriesSaudeBeleza === 'Saúde'"
                      outlined
                      v-model="form.subcategoriesSaude"
                      :options="subcategoriesSaudes"
                      label="Selecione uma subcategoria"
                      option-label="label"
                      option-value="value"
                      emit-value
                      class="q-mb-md"
                      map-options
                    />
                    <q-select
                      v-if="form.category === 'Beleza'"
                      outlined
                      v-model="form.subcategoriesSaudeBeleza"
                      :options="subcategoriesSaudeBelezas"
                      label="Selecione uma subcategoria"
                      option-label="label"
                      option-value="value"
                      emit-value
                      class="q-mb-md"
                      map-options
                    />

                    <q-input
                      v-model="form.shelfLife"
                      label="Prazo de Validade"
                      outlined
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="form.ingredients"
                      label="Ingredientes"
                      outlined
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="form.volume"
                      label="Volume"
                      outlined
                      class="q-mb-md"
                    />
                  </q-card-section>

                  <q-card-section>
                    <q-select
                      v-model="form.public"
                      :options="publicOptions"
                      label="Público"
                      outlined
                      emit-value
                      required
                      map-options
                      multiple
                      class="q-mb-md"
                    />

                    <q-input
                      v-if="false"
                      v-model="form.dimensions"
                      label="Dimensões"
                      outlined
                      class="q-mb-md"
                    />
                    <q-input
                      v-if="false"
                      v-model="form.weight"
                      label="Peso"
                      outlined
                      type="number"
                      class="q-mb-md"
                    />
                    <q-input
                      v-if="false"
                      v-model="form.attributes"
                      label="Atributos"
                      outlined
                      class="q-mb-md"
                    />
                  </q-card-section>
                </q-card>
              </q-card-section>

              <q-card-section class="col-md-12 col-12">
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

  <!-- Alternar para Ativar o Desconto -->
  <q-toggle
    v-model="hasDiscount"
    label="Aplicar Desconto?"
    color="primary"
    class="q-mb-md text-black"
  />

  <!-- Campo de Preço com Desconto (só preenche se houver desconto) -->
  <q-input
    v-model="form.price_discount"
    label="Preço com Desconto"
    outlined
    type="number"
    class="q-mb-md "
    v-if="hasDiscount"
    :rules="[val => !hasDiscount || (val < form.price && val > 0) || 'O desconto deve ser menor que o preço original.']"
  />

  <q-input
    v-model="form.stock"
    label="Estoque"
    outlined
    type="number"
    required
    class="q-mb-md "
  />
</q-card-section>

                </q-card>
              </q-card-section>
            </q-form>
          </div>
        </q-card>
      </q-dialog>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        label1="Adicionar Produto"
        @click="openProductForm"
        fab
        icon="add"
        color="accent"
      />
    </q-page-sticky>
  </q-tab-panel>
</template>

<script>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
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
        category: null,
        subcategory: null,
        subcategoryCasaDecor: null,
        subcategoriesSaudeBeleza: null,
        subcategoriesSaude: null,
        subcategoriesBeleza: null,
        tags: [],
        occasion: [],
        public: [],
        colors: [],
        // Atributos específicos por categoria
        brand: "",
        model: "",
        voltage: "",
        color: "",
        size: [],
        material: null,
        weight: "",
        expiryDate: "",
        ingredients: "",
        shelfLife: "",
        volume: "",
        dimensions: "",
        compatibility: "",
        ageRange: "",
        author: "",
        pages: "",
        language: "",
        animalType: "",
      },
      hasDiscount: false,
      sizes: [
        { label: "XS", value: "XS" },
        { label: "S", value: "S" },
        { label: "M", value: "M" },
        { label: "L", value: "L" },
        { label: "XL", value: "XL" },
        { label: "XXL", value: "XXL" },
        { label: "XXXL", value: "XXXL" },
        { label: "PP", value: "PP" },
        { label: "P", value: "P" },
        { label: "M", value: "M" },
        { label: "L", value: "L" },
        { label: "G", value: "G" },
        { label: "GG", value: "GG" },
        { label: "XG", value: "XG" },
      ],
      sizesShoes: [
        { label: "34", value: "34" },
        { label: "35", value: "35" },
        { label: "36", value: "36" },
        { label: "37", value: "37" },
        { label: "38", value: "38" },
        { label: "39", value: "39" },
        { label: "40", value: "40" },
        { label: "41", value: "41" },
        { label: "42", value: "42" },
        { label: "43", value: "43" },
        { label: "44", value: "44" },
        { label: "45", value: "45" },
        { label: "46", value: "46" },
        { label: "47", value: "47" },
      ],
      colors: [
        { label: "Vermelho", value: "red" },
        { label: "Azul", value: "blue" },
        { label: "Verde", value: "green" },
        { label: "Amarelo", value: "yellow" },
        { label: "Preto", value: "black" },
        { label: "Branco", value: "white" },
      ],
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
      occasions: [
        "Casuais",
        "Trabalho",
        "Esportivas",
        "Íntimas",
        "Festa",
        "Inverno",
        "Verão",
        "Banho e Praia",
      ],
      materials: [
        { label: "Algodão", value: "algodao" },
        { label: "Poliéster", value: "poliester" },
        { label: "Couro", value: "couro" },
        { label: "Jeans", value: "jeans" },
      ],
      publicOptions: [
        { label: "Masculino", value: "masculino" },
        { label: "Feminino", value: "feminino" },
        { label: "Infantil", value: "infantil" },
        { label: "Plus Size", value: "plus_size" },
      ],
      subcategoriesSaudeBelezas111: {
        "Saúde e Beleza": {
          Saúde: [
            "Cuidados Pessoais",
            "Saúde e Bem-Estar",
            "Primeiros Socorros e Equipamentos Médicos",
            "Cuidados Orais",
            "Ótica e Saúde Ocular",
          ],
          Beleza: [
            "Cabelos",
            "Cuidados com a Pele",
            "Maquiagem",
            "Unhas e Manicure",
            "Depilação e Remoção de Pelos",
            "Perfumes e Fragrâncias",
            "Acessórios de Beleza",
          ],
        },
        "Cuidados Pessoais": [
          "Sabonetes e Gel de Banho",
          "Desodorantes e Antitranspirantes",
          "Cuidados Íntimos",
          "Lenços Umedecidos",
        ],
        "Saúde e Bem-Estar": [
          "Vitaminas e Suplementos",
          "Produtos Naturais e Fitoterápicos",
          "Chás Medicinais",
          "Saúde Digestiva (probióticos, fibras)",
          "Emagrecedores e Controle de Peso",
          "Saúde Sexual (preservativos, lubrificantes, estimulantes)",
          "Produtos para Sono e Relaxamento",
        ],
        "Primeiros Socorros e Equipamentos Médicos": [
          "Termômetros e Medidores de Pressão",
          "Máscaras, Luvas e Álcool Gel",
          "Curativos e Bandagens",
          "Oxímetros e Inaladores",
          "Cintas e Suportes Ortopédicos",
        ],
        "Cuidados Orais": [
          "Cremes Dentais e Enxaguantes Bucais",
          "Escovas e Fios Dentais",
          "Clareadores Dentários",
        ],
        "Ótica e Saúde Ocular": [
          "Óculos de Grau e Lentes de Contato",
          "Colírios e Soluções Oftálmicas",
        ],
        Cabelos: [
          "Shampoos e Condicionadores",
          "Máscaras e Tratamentos Capilares",
          "Finalizadores (óleos, leave-in, sprays)",
          "Secadores, Chapinhas e Modeladores",
          "Tintas e Colorações",
        ],
        "Cuidados com a Pele": [
          "Hidratantes e Loções",
          "Protetores Solares",
          "Anti-Idade e Clareadores",
          "Sabonetes Faciais e Esfoliantes",
          "Produtos para Acne e Manchas",
        ],
        Maquiagem: [
          "Bases e Corretivos",
          "Sombras e Delineadores",
          "Batons e Brilhos Labiais",
          "Pós Compactos e Blushes",
          "Máscaras para Cílios e Sobrancelhas",
        ],
        "Unhas e Manicure": [
          "Esmaltes e Removedores",
          "Unhas Postiças e Acessórios",
          "Kits de Manicure e Pedicure",
        ],
        "Depilação e Remoção de Pelos": [
          "Ceras e Cremes Depilatórios",
          "Aparelhos de Barbear e Lâminas",
          "Máquinas de Depilação",
        ],
        "Perfumes e Fragrâncias": [
          "Perfumes Importados e Nacionais",
          "Body Splashes e Desodorantes Corporais",
        ],
        "Acessórios de Beleza": [
          "Pentes e Escovas",
          "Espelhos e Esponjas de Maquiagem",
          "Kits de Pincéis",
        ],
      },
      subcategoriesSaudeBelezas: ["Saúde", "Beleza"],
      subcategoriesSaudes: [
        "Cuidados Pessoais",
        "Bem-Estar",
        "Cuidados Orais",
        "Ótica e Saúde Ocular",
      ],
      subcategoriesBelezas: [
        "Cabelos",
        "Cuidados com a Pele",
        "Maquiagem",
        "Unhas e Manicure",
        "Depilação e Remoção de Pelos",
        "Perfumes e Fragrâncias",
        "Acessórios de Beleza",
      ],
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
    img() {
      this.resetForm();
      return this.imagePreview.length == 0;
    },
  },

  methods: {
    openProductForm() {
      this.selectedProduct = null;
      this.imagePreview = null;
      this.resetForm();
      this.showProductModal = true;
    },
    removeImage(index, listType) {
      // Remove a imagem da lista correspondente
      if (listType === "form") {
        this.form.images.splice(index, 1);
      } else if (listType === "preview") {
        this.imagePreview.splice(index, 1);
      }
    },
    async viewProduct(product) {
      this.resetForm();
      this.selectedProduct = product;

      // try {
      // Captura a parte da string antes do JSON e coloca em 'description'
      const descriptionPart = product.description
        .replace(/(\{.*\})/, "")
        .trim();
      // Captura o JSON da string
      const jsonString = product.description.match(/\{.*\}/);
      const jsonData = jsonString ? JSON.parse(jsonString[0]) : {};

      // Atribui os valores a suas respectivas variáveis
      this.selectedProduct.description = descriptionPart; // Texto fora do JSON
      this.selectedProduct.parsedData = jsonData; // O JSON convertido
      Object.assign(this.selectedProduct, jsonData);
      this.selectedProduct.size = jsonData.dimensions;
      this.selectedProduct.material = jsonData.material;

      // } catch (error) {
      //   console.error("Erro ao processar a descrição:", error);
      //   this.selectedProduct.description = ""; // Em caso de erro
      //   this.selectedProduct.parsedData = {}; // Em caso de erro
      // }

      console.log(this.selectedProduct);
      this.fillForm(product);
      this.showProductModal = true;
    },

    async editProduct(product) {
      this.selectedProduct = product;
      this.resetForm();
      this.fillForm(product);
      this.showProductModal = true;
    },

    resetForm() {
      this.imagePreview = [];
      this.form.images = [];
      this.selectedProduct = null;
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
      this.form.images = [];
    },

    fillForm(product) {
      this.form = {
        ...product,
        // images: [], // Handle images separately
        categories: product.categories.map((cat) => cat.id),
        tags: product.tags.map((tag) => tag.id),
      };
    },

    async fetchProducts() {
      const isOnlyAdmin = this.$route.meta.requiredScopes.includes("admin");

      // console.log(this.$route.params.id);
      try {
        const response = isOnlyAdmin
          ? await apiMethods.fetchProductStoreById(this.$route.params.id)
          : await apiMethods.getProducts();
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
      // this.imagePreview = [];
      // this.form.images = [];a
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          continue; // Ignora arquivos que não são imagens
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview.push(e.target.result);
          // this.form.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },

    async createProduct() {
      // console.log(this.selectedProduct);
      // console.log(this.form);
      this.$q.loading.show({
        delay: 400, // ms
      });

      const description = this.form.description; // Exemplo: "Saúde || Cuidados Pessoais || Tag1, Tag2 || Público A, Público B"

      const [
        dimensions,
        category,
        subcategory,
        subcategoryCasaDecor,
        subcategoriesSaudeBeleza,
        subcategoriesSaude,
        subcategoriesBeleza,
        tags,
        occasion,
        publicData,
        colors,
      ] = description.split(" || ");

      // Recriar o JSON estruturado
      const parsedData = {
        dimensions: this.form.size,
        category: this.form.category || null,
        subcategory: this.form.subcategory || null,
        subcategoryCasaDecor: this.form.subcategoryCasaDecor || null,
        subcategoriesSaudeBeleza: this.form.subcategoriesSaudeBeleza || null,
        subcategoriesSaude: this.form.subcategoriesSaude || null,
        subcategoriesBeleza: this.form.subcategoriesBeleza || null,
        material: this.form.material || null,
        tags:
          typeof this.form.tags === "string"
            ? this.form.tags.split(", ")
            : Array.isArray(this.form.tags)
            ? this.form.tags
            : [],
        occasion:
          typeof this.form.occasion === "string"
            ? this.form.occasion.split(", ")
            : Array.isArray(this.form.occasion)
            ? this.form.occasion
            : [],
        public:
          typeof this.form.public === "string"
            ? this.form.public.split(", ")
            : Array.isArray(this.form.public)
            ? this.form.public
            : [],
        colors:
          typeof this.form.colors === "string"
            ? this.form.colors.split(", ")
            : Array.isArray(this.form.colors)
            ? this.form.colors
            : [],
      };

      const parsedDataString = JSON.stringify(parsedData);
      const auxDescription = this.form.description;
      this.form.description =
        (this.form.description || "") + " " + parsedDataString;
      this.form.dimensions = "06/01/2025";
      this.form.attributes = "06/01/2025";

      console.log(this.form);

      try {
        // this.form.dimensions = this.form.size.join(" || ");

        // console.log(this.form);
        // this.form.description=
        // category: null,
        // subcategory: null,
        // subcategoryCasaDecor: null,
        // subcategoriesSaudeBeleza: null,
        // subcategoriesSaude:null,
        // subcategoriesBeleza:null,
        // tags: [],
        // occasion: [],
        // public: [],
        // colors: [],
        // return;
        this.form.images = [...this.form.images, ...this.imagePreview];

        console.log(this.form.images);
        if (this.selectedProduct) {
          this.form.price_discount = this.form.price_discount || 0;
          const response = await apiMethods.updateProduct(
            this.selectedProduct.id,
            this.form
          );
          console.log(response);
        } else {
          const response = await apiMethods.createProduct(this.form);
          console.log(response);
        }
        this.fetchProducts();
        this.showProductModal = false;
      } catch (error) {
        this.form.description = auxDescription;
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
          console.log(response);
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
          //           this.product = JSON.parse( this.product.description);

          // console.log( this.product);
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
  flex: 0 0 90%; /* Evita redimensionamento automático */
  height: 200px;
  max-height: 200px;
  max-width: 200px; /* Altura máxima das imagens */
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
  max-height: 200px;
  max-width: 200px; /* Altura máxima das imagens */
  align-items: center; /* Centralizar itens horizontalmente */
  text-align: center;
  justify-content: center; /* Centralizar itens verticalmente */
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: rgba(255, 0, 0, 1);
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
