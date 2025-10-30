<template>
  <!-- Versão Mobile (mantida igual) -->
  <div v-if="$q.screen.lt.md">
    <!-- header -->
    <div>
      <q-toolbar
        style="
          position: fixed;
          top: 0px;
          width: 100%;
          display: flex;
          justify-content: center;
          z-index: 99;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        "
        class="bg-white q-pt-md q-pb-md"
      >
        <q-btn
          flat
          round
          dense
          size="md"
          icon="arrow_back"
          class="q-mr-sm"
          @click="voltar"
        ></q-btn>
        <div style="flex: 1; text-align: center">
          <q-toolbar-title> Carrinho </q-toolbar-title>
        </div>
        <div style="width: 56px"></div>
        <!-- Placeholder to balance the space -->
      </q-toolbar>
    </div>

    <div class="q-pa-md" style="margin-top: 102px; margin-bottom: 102px">
      <!-- 404 -->
      <div
        v-if="cartItems.length == 0"
        class="text-bold text-subtitle1 text-grey-6"
      >
        Carrinho está vazio, adicione produtos para continuar a compra.
      </div>

      <!-- items -->
      <q-list v-if="cartItems.length > 0" bordered padding class="cart-list">
        <q-item v-for="item in cartItems" :key="item.id" class="q-mb-md">
          <div v-if="item.quantity!=0" class="div">

          </div>
          <q-item-section avatar>
            <q-img
              v-if="item.images.length > 0"
              :src="getImageUrl(item.images[0])"
              class="cart-item-image bg-transparent"
              style="
                object-fit: contain;
                overflow: hidden;
                vertical-align: middle;
                border-radius: 22px;
                border: 1px solid black;
                flex: 1 1 0%;
                padding: 8px;
              "
            ></q-img>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
            <q-item-label caption
              >{{ item.price * item.quantity }} MZN</q-item-label
            >
          </q-item-section>
          <q-item-section side>
            <q-btn
              dense
              flat
              @click="removeItem(item.id)"
              icon="close"
              class="text-red"
            ></q-btn>
            <div class="quantity-controls">
              <q-btn
                dense
                flat
                @click="decreaseQuantity(item.id)"
                icon="remove"
                class="text-primary"
              ></q-btn>
              <span>{{ item.quantity }}</span>
              <q-btn
                dense
                flat
                @click="increaseQuantity(item.id)"
                icon="add"
                class="text-primary"
              ></q-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- footer -->
      <div
        style="
          position: fixed;
          bottom: 0px;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          z-index: 99;
        "
      >
        <q-toolbar
          class="row justify-between q-pa-md bg-white"
          style="width: 100%; border-top: 1px solid rgba(0, 0, 0, 0.1)"
        >
          <div class="summary-item row" style="margin-bottom: 0">
            <div class="col-12">Total:</div>
            <div class="total-price col-12">{{ totalPrice }} MZN</div>
          </div>

          <q-btn
            :disable="cartItems.length == 0"
            style="
              height: 70px;
              padding: 9px;
              border-radius: 1rem;
              text-transform: none;
            "
            @click="InitiateCheckout"
            dense
            class="bg-green-6 text-white glowing-shadow-cancel"
            label="Finalizar compra"
          />
        </q-toolbar>
      </div>
    </div>
  </div>

  <!-- Versão Desktop (CORRIGIDA - sem QLayout) -->
  <div v-else class="desktop-cart-page">
    <!-- Header Desktop Simples (sem QHeader) -->
    <div class="desktop-header bg-white text-dark">
      <q-toolbar class="q-px-xl">
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          class="q-mr-md"
          @click="voltar"
        />
        <q-toolbar-title class="text-h5 text-weight-bold">
          Meu Carrinho
        </q-toolbar-title>
        <div class="cart-stats">
          <q-badge color="orange" rounded class="q-px-sm q-py-xs">
            {{ totalItemsInCart }} items
          </q-badge>
        </div>
      </q-toolbar>
    </div>

    <!-- Conteúdo Principal (sem QPage) -->
    <div class="desktop-cart-content bg-grey-1">
      <div class="row justify-center q-px-xl q-pt-xl">
        <!-- Coluna dos Produtos -->
        <div class="col-8 q-pr-lg">
          <!-- Header da Lista -->
          <div class="cart-section-header q-mb-md">
            <div class="text-h6 text-weight-bold">Produtos no Carrinho</div>
            <div class="text-caption text-grey-6">
              {{ cartItems.length }} produto(s) selecionado(s)
            </div>
          </div>

          <!-- Carrinho Vazio -->
          <div
            v-if="cartItems.length == 0"
            class="empty-cart-desktop text-center q-pa-xl"
          >
            <q-icon name="shopping_cart" size="120px" color="grey-4" />
            <div class="text-h6 text-grey-6 q-mt-md">
              Seu carrinho está vazio
            </div>
            <div class="text-subtitle1 text-grey-5 q-mb-lg">
              Adicione produtos para continuar com sua compra
            </div>
            <q-btn
              color="orange"
              label="Continuar Comprando"
              @click="$router.push('/')"
              unelevated
              class="q-px-xl"
            />
          </div>

          <!-- Lista de Produtos -->
          <div v-else class="cart-items-desktop">
            <q-card
              v-for="item in cartItems"
              :key="item.id"
              class="cart-item-card q-mb-md"
              flat
              bordered
            >
              <div class="row items-center q-pa-md">
                <!-- Imagem do Produto -->
                <div class="col-auto">
                  <q-img
                    v-if="item.images.length > 0"
                    :src="getImageUrl(item.images[0])"
                    class="product-image-desktop"
                    ratio="1"
                    width="100px"
                  />
                  <q-img
                    v-else
                    src="~assets/default-product.png"
                    class="product-image-desktop"
                    ratio="1"
                    width="100px"
                  />
                </div>

                <!-- Informações do Produto -->
                <div class="col q-px-md">
                  <div class="text-h6 text-weight-medium product-name">
                    {{ item.name }}
                  </div>
                  <div class="text-subtitle1 text-orange text-weight-bold">
                    {{ (item.price * item.quantity).toFixed(2) }} MZN
                  </div>
                  <div class="text-caption text-grey-6">
                    {{ item.price }} MZN por unidade
                  </div>
                </div>

                <!-- Controles de Quantidade -->
                <div class="col-auto">
                  <div class="quantity-controls-desktop">
                    <q-btn
                      round
                      dense
                      flat
                      icon="remove"
                      :disable="item.quantity <= 1"
                      @click="decreaseQuantity(item.id)"
                      class="control-btn"
                    />
                    <div class="quantity-display">
                      <span class="text-h6">{{ item.quantity }}</span>
                    </div>
                    <q-btn
                      round
                      dense
                      flat
                      icon="add"
                      @click="increaseQuantity(item.id)"
                      class="control-btn"
                    />
                  </div>
                </div>

                <!-- Ações -->
                <div class="col-auto q-pl-lg">
                  <q-btn
                    round
                    flat
                    icon="delete"
                    color="red"
                    @click="removeItem(item.id)"
                    class="delete-btn"
                  >
                    <q-tooltip>Remover item</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card>
          </div>
        </div>

        <!-- Coluna do Resumo -->
        <div class="col-4">
          <q-card class="summary-card sticky-summary" flat bordered>
            <q-card-section class="bg-grey-2">
              <div class="text-h6 text-weight-bold">Resumo do Pedido</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <!-- Debug Info -->
              <div v-if="debugMode" class="debug-info q-pa-sm bg-yellow-1 rounded-borders q-mb-md">
                <div class="text-caption text-weight-bold">Debug Info:</div>
                <div class="text-caption">Cart Total: {{ storeCartTotal }}</div>
                <div class="text-caption">Calculated Subtotal: {{ calculatedSubtotal }}</div>
                <div class="text-caption">Items: {{ cartItems.length }}</div>
              </div>

              <!-- Itens -->
              <div class="row justify-between items-center q-py-sm">
                <div class="text-body1">Subtotal</div>
                <div class="text-body1 text-weight-medium">
                  {{ calculatedSubtotal.toFixed(2) }} MZN
                </div>
              </div>

              <!-- Taxa de Entrega -->
              <div class="row justify-between items-center q-py-sm">
                <div>
                  <div class="text-body1">Taxa de Entrega</div>
                  <div class="text-caption text-grey-6">
                    {{ form.deliveryOption === 'delivery' ? 'Entrega em domicílio' : 'Recolha no local' }}
                  </div>
                </div>
                <div class="text-body1 text-weight-medium">
                  {{ form.deliveryOption === 'delivery' ? deliveryFee + ' MZN' : 'Grátis' }}
                </div>
              </div>

              <!-- Divisor -->
              <q-separator class="q-my-md" />

              <!-- Total -->
              <div class="row justify-between items-center q-py-sm">
                <div class="text-h6 text-weight-bold">Total</div>
                <div class="text-h5 text-orange text-weight-bold">
                  {{ calculatedTotalPrice.toFixed(2) }} MZN
                </div>
              </div>

              <!-- Botão Finalizar -->
              <q-btn
                :disable="cartItems.length == 0"
                @click="InitiateCheckout"
                color="orange"
                size="lg"
                class="full-width q-mt-lg checkout-btn"
                unelevated
                label="Finalizar Compra"
              />

              
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Checkout (mantido igual para ambas as versões) -->
  <q-dialog
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    v-model="showProductModal"
  >
    <q-card class="full-width">
      <q-toolbar
        style="
          position: fixed;
          top: 0px;
          left: 0px;
          width: 100%;
          display: flex;
          justify-content: center;
          z-index: 9;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        "
        class="bg-white"
      >
        <q-btn
          flat
          round
          dense
          @click="showProductModal = false"
          size="md"
          icon="arrow_back"
        ></q-btn>
        <q-toolbar-title>
          <q-card-section style="padding-bottom: 0px; padding-top: 0px">
            <h2 class="text-h6">Finalizar Compra</h2>
          </q-card-section>
        </q-toolbar-title>
      </q-toolbar>

      <q-banner
        v-if="false"
        class="custom-banner"
        rounded
        dense
        style="margin-top: 102px; margin-bottom: 102px"
      >
        <div
          class="q-ml-md flex flex-column items-center justify-center q-pa-md"
        >
          <q-icon name="star" size="xs" class="banner-icon" />
          <div class="banner-text text-h6 text-center">
            <strong
              >🚀 Para continuar, entre com seus dados ou crie uma
              conta!</strong
            >
          </div>
          <q-img
            src="~assets/Login-bro.png"
            style="
              object-fit: contain;
              overflow: hidden;
              border-radius: 22px;
              padding: 8px;
              max-width: 100%;
              margin: 16px 0;
            "
            :style="
              $q.screen.lt.md
                ? {
                    objectFit: 'contain',
                    overflow: 'hidden',
                    borderRadius: '22px',
                    padding: '8px',
                    maxWidth: '100%',
                    margin: '16px 0',
                  }
                : {
                    objectFit: 'contain',
                    overflow: 'hidden',
                    borderRadius: '22px',
                    padding: '8px',
                    maxWidth: '25%',
                    margin: '16px 0',
                  }
            "
          />
          <div class="text-center banner-buttons q-mt-sm full-width">
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

      <q-stepper
        v-if="true"
        style="margin-top: 102px; margin-bottom: 102px"
        v-model="step"
        vertical
        color="primary"
        animated
      >
        <q-step
          :name="1"
          title="Informações de contacto"
          icon="settings"
          :done="step > 1"
        >
          <q-card-section>
            <q-form>
              <q-input
                filled
                v-model="form.nome"
                label="Nome"
                required
                prepend-icon="person"
                class="q-mt-md"
              />
              <q-input
                filled
                v-model="form.apelido"
                label="Apelido"
                required
                prepend-icon="person_pin"
                class="q-mt-md"
              />
              <q-input
                filled
                v-model="form.telefone"
                label="Telefone"
                required
                prepend-icon="phone"
                class="q-mt-md"
              />
              <q-input
                filled
                v-model="form.nota"
                label="Nota"
                type="textarea"
                prepend-icon="edit"
                class="q-mt-md"
              />
            </q-form>
          </q-card-section>

          <q-stepper-navigation>
            <q-btn
              @click="step = 2"
              style="background-color: #f27c38; color: white"
              label="Continuar"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          title="Informações de localização"
          icon="create_new_folder"
          :done="step > 2"
        >
          <q-card-section>
            <q-form>
              <div class="row justify-between">
                <q-input
                  filled
                  v-model="form.destino"
                  label="Local de entrega..."
                  required
                  prepend-icon="place"
                  class="q-mt-md col-10"
                  :disable="form.deliveryOption === 'pickup'"
                />
                <q-btn
                  square
                  style="background-color: #f27c38; color: white"
                  icon="place"
                  class="q-mt-md col-2"
                  :disable="form.deliveryOption === 'pickup'"
                />
              </div>

              <!-- Delivery Option Toggle -->
              <div class="q-mt-md delivery-option">
                <q-radio
                  v-model="form.deliveryOption"
                  val="delivery"
                  :label="`Entrega (Adiciona ${deliveryFee} MZN)`"
                />
                <q-radio
                  v-model="form.deliveryOption"
                  val="pickup"
                  label="Recolha no local"
                />
              </div>

              <q-input
                filled
                v-model="form.horaDeEntrega"
                label="Hora de Entrega"
                type="time"
                prepend-icon="schedule"
                class="q-mt-md"
              />
            </q-form>
          </q-card-section>

          <q-stepper-navigation>
            <q-btn
              style="background-color: #f27c38; color: white"
              type="submit"
              label="Continuar"
              @click="step = 3"
            />
            <q-btn
              flat
              @click="step = 1"
              style="color: #f27c38"
              label="Voltar"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="3"
          title="Resumo"
          caption="Confirme se está tudo em conformidade."
          icon="create_new_folder"
          :done="step > 3"
        >
          <q-item v-ripple>
            <q-item-section side>
              <q-avatar icon="local_mall" rounded size="80px"></q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>Hoje</q-item-label>
              <q-item-label caption>agora</q-item-label>
            </q-item-section>
            <q-item-section side>{{ calculatedTotalPrice }} MZN</q-item-section>
          </q-item>

          <q-timeline color="secondary">
            <q-timeline-entry
              title="Destino"
              :subtitle="
                form.deliveryOption === 'delivery'
                  ? form.destino
                  : 'Recolha no local'
              "
              icon="place"
            >
              <div class="text-subtitle text-bold">
                {{ form.nome }}
              </div>
              <div>Hora de entrega: {{ form.horaDeEntrega }}</div>
              <div v-if="form.deliveryOption === 'delivery'">
                Taxa de entrega: {{ deliveryFee }} MZN
              </div>
            </q-timeline-entry>
          </q-timeline>

          <!-- Package Details -->
          <q-card-section>
            <q-card-section>
              <div class="text-h6 text-bold">Items</div>
            </q-card-section>

            <div
              v-for="(item, index) in cartItems"
              :key="index"
              class="q-mb-md"
            >
              <q-item
                clickable
                v-ripple
                class="rounded-borders"
                :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-grey-2'"
              >
                <q-item-section avatar>
                  <q-avatar rounded>
                    <div v-if="item.images.length > 0">
                      <img
                        :src="getImageUrl(item.images[0])"
                        alt="imagem"
                        style="
                          object-fit: contain;
                          overflow: hidden;
                          vertical-align: middle;
                          border-radius: 22px;
                          border: 1px solid black;
                          flex: 1 1 0%;
                          padding: 8px;
                          max-width: 100px;
                          max-height: 100px;
                        "
                      />
                    </div>
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ item.descricao }}</q-item-label>
                </q-item-section>

                <q-item-section side class="row">
                  <span>Qtd: {{ item.quantity }}</span>
                </q-item-section>
                <q-btn style="color: #f27c38; right: -25px" flat icon="close" />
              </q-item>
            </div>
            <div v-if="cartItems.length == 0" class="text-subtitle">
              Sem items
            </div>

            <q-card-section>
              <q-form>
                <q-input
                  filled
                  v-model="form.nota"
                  label="Nota"
                  disable
                  type="textarea"
                  prepend-icon="edit"
                  class="q-mt-md"
                />
                <q-input
                  filled
                  v-model="calculatedTotalPrice"
                  label="Valor Total"
                  disable
                  prepend-icon="money"
                  class="q-mt-md"
                />
              </q-form>
            </q-card-section>
          </q-card-section>

          <q-stepper-navigation>
            <q-btn
              class="bg-green-2 glowing-shadow-add"
              type="submit"
              rounded
              dense
              label="Efectuar pagamento"
              @click="submitForm"
            />
            <q-btn
              flat
              @click="step = 2"
              style="color: #f27c38"
              label="Voltar"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </q-card>
  </q-dialog>
</template>

<script>
import store from "src/store/index.js";
import apiMethods from "src/router/api.js";
import { useQuasar, Notify } from "quasar";

export default {
  data() {
    return {
      step: 1,
      form: {
        nome: "",
        apelido: "",
        telefone: "",
        origem: "",
        origemLat: 0,
        origemLong: 0,
        destino: "",
        destinoLat: 0,
        destinoLong: 0,
        service: "DELIVER_MAN",
        nota: "",
        horaDeLevantamento: "",
        horaDeEntrega: "",
        valor: 0,
        produtos: [],
        taxaDeEntrega: 0,
        deliveryOption: "pickup", // Default to pickup
      },
      isProcessing: false,
      showProductModal: false,
      deliveryFee: 100, // Delivery fee in MZN
      debugMode: true, // Set to false in production
    };
  },
  computed: {
    // Debug info
    storeCartTotal() {
      return store.getters.cartTotal;
    },
    
    // Cálculo manual do subtotal para garantir que está correto
    calculatedSubtotal() {
      if (!this.cartItems || this.cartItems.length === 0) return 0;
      
      const subtotal = this.cartItems.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + (price * quantity);
      }, 0);
      
      console.log('Calculated Subtotal:', subtotal, 'Items:', this.cartItems);
      return subtotal;
    },
    
    // Total calculado manualmente
    calculatedTotalPrice() {
      let basePrice = this.calculatedSubtotal;
      // Só adiciona a taxa de entrega se for delivery
      if (this.form.deliveryOption === "delivery") {
        basePrice += this.deliveryFee;
      }
      console.log('Calculated Total:', basePrice, 'Delivery Option:', this.form.deliveryOption);
      return basePrice;
    },
    
    // Mantendo compatibilidade com versão mobile
    totalPrice() {
      return this.calculatedTotalPrice;
    },
    
    totalItemsInCart() {
      return store.getters.totalItemsInCart;
    },
    
    cartItems() {
      return store.getters.cart;
    },
    
    user() {
      return store.state.user;
    },
  },
  created() {
    this.form.nome = this.user ? this.user.name : "";
    console.log('Cart Items on created:', this.cartItems);
    console.log('Store Cart Total:', this.storeCartTotal);
  },
  methods: {
    InitiateCheckout() {
      this.showProductModal = true;
      const contentIds = this.cartItems.map((item) => item.id);
      const totalValue = this.calculatedSubtotal;
      const totalItems = this.cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      fbq("track", "InitiateCheckout", {
        content_ids: contentIds,
        content_type: "product",
        num_items: totalItems,
        value: totalValue,
        currency: "MZN",
      });
    },
    voltar() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },
    goBack() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },
    getImageUrl(imageName) {
      return apiMethods.baseURL() + `/storage/product_images/${imageName.name}`;
    },
    goToRegister() {
      this.$router.push("/register");
    },
    goToLogin() {
      this.$router.push("/login");
    },
    getProductCartById(id) {
      let product = store.getters.getProductCartById(id);
      if (product) {
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
    removeProductInCart(id) {
      store.getters.removeProductInCart(id);
    },
    removeItem(id) {
      this.removeProductInCart(id);
    },
    increaseQuantity(id) {
      this.incrementProductQuantity(id);
    },
    decreaseQuantity(id) {
      this.decrementProductQuantity(id);
    },
    async submitForm() {
      this.form.valor = this.calculatedTotalPrice;
      this.form.produtos = this.cartItems;
      this.form.taxaDeEntrega = this.form.deliveryOption === "delivery" ? this.deliveryFee : 0;
      this.form.origem = "#"; // Represents the seller's location
      if (this.form.deliveryOption === "pickup") {
        this.form.destino = "Recolha no local";
        this.form.destinoLat = 0;
        this.form.destinoLong = 0;
      }
      console.log('Form data:', this.form);
      this.$q.loading.show({
        delay: 400, // ms
      });
      try {
        const response = await apiMethods.processarPedidos(this.form);
        this.products = response.data;

        const contentIds = this.cartItems.map((item) => item.id);
        const totalValue = this.calculatedSubtotal;
        const totalItems = this.cartItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        );

        fbq("track", "Purchase", {
          content_ids: contentIds,
          content_type: "product",
          num_items: totalItems,
          value: totalValue,
          currency: "MZN",
        });

        store.commit("clearCart");
        this.$router.push("/c/show-packs");
      } catch (error) {
        console.error("Erro ao processar pedido:", error.response?.data || error);
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message:
            "Ocorreu um erro. Verifique se preencheu todos os campos e tente novamente.",
        });
      } finally {
        this.$q.loading.hide();
      }
    },
  },
  setup() {
    const $q = useQuasar();
  },
};
</script>

<style scoped>
/* ===== ESTILOS PARA DESKTOP ===== */

.desktop-cart-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.desktop-header {
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.desktop-cart-content {
  min-height: calc(100vh - 64px);
  padding-top: 0;
}

.cart-section-header {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
}

.empty-cart-desktop {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-top: 40px;
}

.cart-item-card {
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e0e0e0;
}

.cart-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  border-color: #ff9800;
}

.product-image-desktop {
  border-radius: 8px;
  object-fit: cover;
}

.product-name {
  color: #2c3e50;
  line-height: 1.4;
}

.quantity-controls-desktop {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 25px;
  padding: 4px;
  border: 1px solid #e0e0e0;
}

.control-btn {
  width: 36px;
  height: 36px;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: #ff9800;
  color: white;
}

.quantity-display {
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  color: #2c3e50;
}

.delete-btn {
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background: #ffebee;
  transform: scale(1.1);
}

.summary-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.sticky-summary {
  position: sticky;
  top: 100px;
}

.checkout-btn {
  height: 56px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1em;
  text-transform: none;
  transition: all 0.3s ease;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
}

.checkout-btn:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
}

/* Debug info styles */
.debug-info {
  border: 1px solid #ffd54f;
}

/* Animações */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cart-item-card {
  animation: fadeIn 0.5s ease-out;
}

/* Responsividade adicional para desktop */
@media (min-width: 1440px) {
  .desktop-cart-content .row.justify-center {
    max-width: 1400px;
    margin: 0 auto;
  }
}

/* Efeitos de foco e interação */
.control-btn:focus,
.delete-btn:focus {
  outline: 2px solid #ff9800;
  outline-offset: 2px;
}

/* ===== ESTILOS EXISTENTES (MOBILE) ===== */
.cart-page {
  background-color: #f9f9f9;
}

.cart-list {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
}

.summary {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  margin-bottom: 16px;
}

.total-price {
  font-weight: bold;
}

.full-width {
  width: 100%;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.delivery-option .q-radio {
  margin-right: 16px;
}
</style>