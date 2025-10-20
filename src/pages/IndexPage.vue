<template>
  <div class="chat-page bg-grey-1">
    <!-- Header Fixo -->
    <div class="chat-header bg-white q-px-md q-py-sm shadow-1">
      <div class="row items-center no-wrap">
        <q-btn
          flat
          round
          icon="arrow_back"
          @click="goBack"
          class="q-mr-md back-btn"
          size="12px"
        />

        <q-avatar
          size="42px"
          class="q-mr-md user-avatar"
          :color="messages && messages.length > 0 ? 'primary' : 'grey-5'"
          text-color="white"
        >
          <q-icon
            name="person"
            size="20px"
            v-if="!(messages && messages.length > 0)"
          />
          <q-img
            v-else-if="
              messages[0].receiver.empresas.length > 0 &&
              messages[0].receiver.empresas[0].perfil_foto
            "
            :src="messages[0].receiver.empresas[0].perfil_foto"
          />
          <span v-else-if="messages && messages.length > 0">
            {{ getInitials() }}
          </span>
        </q-avatar>

        <div class="col">
          <div class="text-weight-medium text-body1 user-name">
            <template v-if="messages && messages.length > 0">
              <span v-if="messages[0].receiver.empresas.length > 0">
                {{ messages[0].receiver.empresas[0].nome }}
              </span>
              <span v-else-if="messages[0].receiver.entregadores.length > 0">
                {{ messages[0].receiver.name }}
              </span>
              <span v-else>
                {{ messages[0].receiver.name }}
              </span>
            </template>
            <q-skeleton v-else type="text" width="120px" />
          </div>

          <div class="text-caption user-status">
            <template v-if="messages && messages.length > 0">
              <span v-if="messages[0].receiver.empresas.length > 0">
                @{{ messages[0].receiver.empresas[0].username }}
              </span>
              <span v-else>
                {{ getStatusText() }}
              </span>
            </template>
            <q-skeleton v-else type="text" width="80px" />
          </div>
        </div>
      </div>
    </div>

    <!-- Área de Mensagens -->
    <div class="messages-area q-px-md q-pt-lg">
      <div class="messages-container">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message-wrapper"
          :class="messageClass(message)"
        >
          <!-- Mensagem com Produto -->
          <div class="message-bubble" v-if="message.product">
            <div class="product-card bg-white rounded-borders shadow-1 q-mb-sm">
              <div class="row items-center no-wrap q-pa-sm">
                <q-img
                  v-if="
                    message.product.images && message.product.images.length > 0
                  "
                  :src="getImageUrl(message.product.images[0])"
                  class="product-image rounded-borders"
                  style="height: 50px; width: 50px"
                />
                <div class="col q-ml-md">
                  <div
                    class="text-subtitle2 text-weight-medium text-grey-9 product-name"
                  >
                    {{ truncatedProductName(message.product.name) }}
                  </div>
                  <div
                    class="text-caption text-grey-6 q-mt-xs product-description"
                  >
                    {{
                      truncatedProductDescription(message.product.description)
                    }}
                  </div>
                  <div
                    class="text-caption text-weight-bold q-mt-xs product-price"
                  >
                    {{ formatPrice(message.product.price) }}
                  </div>
                </div>
              </div>
            </div>

            <div class="message-content">
              <div class="message-text">
                {{ message.message }}
              </div>
              <div class="message-time">
                {{ formatTime(message.created_at) }}
              </div>
            </div>
          </div>

          <!-- Mensagem Normal -->
          <div class="message-bubble" v-else>
            <div class="message-content">
              <div class="message-text">
                {{ message.message }}
              </div>
              <div class="message-time">
                {{ formatTime(message.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Produto em Destaque -->
    <div
      class="current-product bg-white q-px-md q-pt-sm shadow-2"
      v-if="product"
    >
      <div class="current-product-indicator"></div>
      <div class="row items-center no-wrap">
        <q-img
          v-if="product.images && product.images.length > 0"
          :src="getImageUrl(product.images[0])"
          class="product-thumbnail rounded-borders q-mr-md"
          style="height: 40px; width: 40px"
        />
        <div class="col">
          <div
            class="text-caption text-weight-medium text-grey-9 current-product-name"
          >
            {{ product.name }}
          </div>
          <div class="text-caption current-product-price">
            {{ formatPrice(product.price) }}
          </div>
        </div>
        <q-btn
          flat
          round
          icon="close"
          size="sm"
          class="close-product-btn"
          @click="removeProduct"
        />
      </div>
    </div>

    <!-- Input de Mensagem -->
    <div class="message-input bg-white q-px-md q-py-sm shadow-3">
      <div class="input-decoration"></div>
      <div class="row items-center no-wrap q-gutter-x-sm">
        <q-input
          v-model="newMessage.message"
          placeholder="Digite sua mensagem..."
          borderless
          class="col-grow message-input-field"
          dense
          @keyup.enter="sendMessage"
          :disable="registering"
        >
          <template v-slot:before>
            <q-btn flat round icon="attach_file" size="sm" class="attach-btn" />
          </template>
        </q-input>

        <q-btn
          round
          :icon="!registering ? 'send' : ''"
          class="send-btn"
          size="md"
          @click="sendMessage"
          :disable="registering || !newMessage.message?.trim()"
        >
          <q-spinner-hourglass v-if="registering" color="white" size="16px" />
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
import store from "src/store/index.js";
import apiMethods from "src/router/api.js";
import Pusher from "pusher-js";

export default {
  data() {
    return {
      newMessage: {
        receiver_id: null,
        message: null,
        product_id: null,
      },
      product: {
        empresa: {
          perfil_foto: null,
          nome: null,
        },
      },
      messages: [],
      registering: false,
    };
  },
  computed: {
    isAuthenticated() {
      return store.state.user ? true : false;
    },
  },
  created() {
    // this.fetchProductById();
  },
  mounted() {
    const newMessage = localStorage.getItem("newMessage");
    if (newMessage) {
      this.newMessage = JSON.parse(newMessage);
      this.fetchProductById(this.newMessage.product_id);
      return;
    }

    fbq("track", "Contact", {
      chat_type: "Abertura da pagina de chat",
      logged_in: this.isAuthenticated,
    });

    this.fetchProductById();
  },
  methods: {
    getInitials() {
      if (this.messages && this.messages.length > 0) {
        const name =
          this.messages[0].receiver.empresas.length > 0
            ? this.messages[0].receiver.empresas[0].nome
            : this.messages[0].receiver.name;
        return name ? name.charAt(0).toUpperCase() : "U";
      }
      return "U";
    },

    getStatusText() {
      return "Online";
    },

    formatPrice(price) {
      return `${price} MZN`;
    },

    formatTime(date) {
      return format(new Date(date), "HH:mm");
    },

    truncatedProductName(message) {
      const maxLength = 30;
      return message.length > maxLength
        ? message.substring(0, maxLength) + "..."
        : message;
    },

    truncatedProductDescription(message) {
      const maxLength = 50;
      return message.length > maxLength
        ? message.substring(0, maxLength) + "..."
        : message;
    },

    removeProduct() {
      this.product = null;
    },

    messageClass(message) {
      return message.sender_id === this.$store.state.user.id
        ? "message-out"
        : "message-in";
    },

    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy HH:mm:ss");
    },

    async sendMessage() {
      if (!this.isAuthenticated) {
        localStorage.setItem("newMessage", JSON.stringify(this.newMessage));
        this.$router.push("/login");
        return;
      }

      if (this.newMessage.message?.trim()) {
        try {
          this.registering = true;
          this.newMessage.url =
            apiMethods.frontURL() + `/chat/${store.state.user.id}`;
          this.newMessage.product_id = this.product?.id;
          this.newMessage.receiver_id = this.product?.empresa?.user_id;

          const response = await apiMethods.sendMessage(this.newMessage);
          localStorage.removeItem("newMessage");
          this.newMessage.message = "";
          this.product = null;

          this.messages = response.data.messages;
          this.registering = false;
          this.$router.push("/chat/" + this.newMessage.receiver_id);

          fbq("track", "Contact", {
            chat_type: "Messagem enviada",
            logged_in: this.isAuthenticated,
          });
        } catch (error) {
          this.registering = false;
          localStorage.setItem("newMessage", JSON.stringify(this.newMessage));
          this.error = "Error fetching item details";
        }
      }
    },

    goToProductPage() {
      this.$router.push({
        name: "productDetails",
        params: { id: this.product.id },
      });
    },

    buyNow() {
      alert("Processando compra para o produto: " + this.product.name);
    },

    goBack() {
      this.$router.go(-1);
    },

    async fetchProductById(id1) {
      try {
        const id = this.$route.params.product_id;
        if (!id && !id1) {
          let receiver_id = this.product
            ? this.product.empresa.user_id
            : this.$route.params.seller_id;

          if (this.product) {
            receiver_id = this.product.empresa.user_id;
          } else {
            receiver_id = this.$route.params.seller_id;
            const response1 = await apiMethods.getUserById(receiver_id);
          }

          const response1 = await apiMethods.getMessages(receiver_id);
          this.messages = response1.data;
        } else {
          const response = await apiMethods.getPublicProductById(id ? id : id1);
          this.product = response.data.product;
          this.product.description = this.product.description
            .replace(/(\{.*\})/, "")
            .trim();
          const receiver_id = this.product.empresa.user_id;
          const response1 = await apiMethods.getMessages(receiver_id);
          this.messages = response1.data;
        }
      } catch (error) {
        this.error = "Error fetching item details";
        console.error("Erro ao buscar produtos:", error);
      }
    },

    getImageUrl(imageName) {
      return apiMethods.baseURL() + `/storage/product_images/${imageName.name}`;
    },
  },
};
</script>

<style scoped>
/* Variáveis de cores */
:root {
  --primary-color: #f27c38;
  --primary-hover: #e06b2a;
  --primary-light: rgba(242, 124, 56, 0.1);
  --primary-border: rgba(242, 124, 56, 0.3);
}

.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chat-header {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 2px solid var(--primary-color);
  background: linear-gradient(135deg, #ffffff 0%, #fef8f5 100%);
}

.back-btn {
  color: var(--primary-color) !important;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background-color: var(--primary-light) !important;
  transform: scale(1.1);
}

.user-avatar {
  border: 2px solid var(--primary-color);
  background: linear-gradient(135deg, var(--primary-color), #f2a038) !important;
}

.user-name {
  color: #2c3e50;
  position: relative;
}

.user-name::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--primary-color);
  border-radius: 2px;
}

.user-status {
  color: var(--primary-color) !important;
  font-weight: 500;
}

.messages-area {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.message-wrapper {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.message-wrapper.message-in {
  align-items: flex-start;
}

.message-wrapper.message-out {
  align-items: flex-end;
}

.message-bubble {
  max-width: 85%;
  animation: messageAppear 0.3s ease-out;
  position: relative;
}

@keyframes messageAppear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-in .message-bubble {
  background: #ffffff;
  border: 1px solid var(--primary-border);
  border-radius: 18px 18px 18px 4px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(242, 124, 56, 0.1);
}

.message-out .message-bubble {
  background: linear-gradient(135deg, var(--primary-color), #f2a038);
  color: white;
  border-radius: 18px 18px 4px 18px;
  padding: 12px 16px;
  box-shadow: 0 2px 12px rgba(242, 124, 56, 0.3);
  position: relative;
}

.message-out .message-bubble::before {
  content: "";
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: var(--primary-color);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.product-card {
  border: 1px solid var(--primary-border);
  border-radius: 12px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
}

.product-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--primary-color);
}

.product-image {
  object-fit: cover;
  border: 1px solid var(--primary-border) !important;
}

.product-name {
  color: #2c3e50;
}

.product-price {
  color: var(--primary-color) !important;
}

.message-content {
  position: relative;
}

.message-text {
  line-height: 1.4;
  word-wrap: break-word;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.8;
  margin-top: 4px;
  text-align: right;
}

.message-in .message-time {
  color: #666;
}

.message-out .message-time {
  color: rgba(255, 255, 255, 0.9);
}

.current-product {
  border-top: 2px solid var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  background: linear-gradient(135deg, #fff9f5, #fff5f0);
  position: relative;
}

.current-product-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--primary-color),
    #f2a038,
    var(--primary-color)
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.product-thumbnail {
  object-fit: cover;
  border: 2px solid var(--primary-color) !important;
}

.current-product-name {
  color: #2c3e50;
}

.current-product-price {
  color: var(--primary-color) !important;
  font-weight: 600;
}

.close-product-btn {
  color: var(--primary-color) !important;
  transition: all 0.3s ease;
}

.close-product-btn:hover {
  background-color: var(--primary-light) !important;
  transform: scale(1.1);
}

.message-input {
  border-top: 2px solid var(--primary-color);
  background: linear-gradient(135deg, #ffffff 0%, #fef8f5 100%);
  position: relative;
}

.input-decoration {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: var(--primary-color);
  border-radius: 0 0 3px 3px;
}

.message-input-field {
  background: var(--primary-light);
  border-radius: 25px;
  padding: 4px 16px;
  margin: 0 8px;
  border: 1px solid var(--primary-border);
  transition: all 0.3s ease;
}

.message-input-field:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(242, 124, 56, 0.2);
}

.attach-btn {
  color: var(--primary-color) !important;
  transition: all 0.3s ease;
}

.attach-btn:hover {
  background-color: var(--primary-light) !important;
  transform: scale(1.1);
}

.send-btn {
  background: linear-gradient(135deg, var(--primary-color), #f2a038) !important;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(242, 124, 56, 0.3);
}

.send-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-hover), #e09930) !important;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(242, 124, 56, 0.4);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Scrollbar personalizada com a cor primária */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: var(--primary-hover);
}

/* Animações */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.message-bubble {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.message-bubble:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(242, 124, 56, 0.2);
}

/* Efeitos de loading com a cor primária */
.q-skeleton {
  background: rgba(242, 124, 56, 0.2) !important;
}

.q-skeleton:after {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(242, 124, 56, 0.4),
    transparent
  ) !important;
}

/* Responsividade */
@media (max-width: 600px) {
  .chat-header {
    padding: 8px 12px;
  }

  .messages-area {
    padding-left: 12px;
    padding-right: 12px;
  }

  .message-input {
    padding-left: 12px;
    padding-right: 12px;
  }

  .message-bubble {
    max-width: 90%;
  }

  .input-decoration {
    width: 40px;
  }
}

/* Estados de foco e hover consistentes */
.q-btn:focus {
  outline: 2px solid rgba(242, 124, 56, 0.3);
}

/* Melhorias de acessibilidade */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
