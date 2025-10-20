<template>
  <!-- Modo Mobile (tela cheia) -->
  <div v-if="isMobile" class="chat-page bg-grey-2">
    <!-- Header do Mobile -->
    <div class="chat-header bg-white q-pa-sm">
      <div class="row items-center no-wrap">
        <q-btn
          flat
          round
          icon="arrow_back"
          @click="goBack"
          class="q-mr-sm"
          style="color: #f27c38"
        />

        <q-avatar
          size="38px"
          class="q-mr-md"
          style="background-color: #f27c38"
          text-color="white"
        >
          <q-img v-if="receiverAvatar" :src="receiverAvatar" />
          <q-icon v-else name="person" />
        </q-avatar>

        <div class="col">
          <div class="text-weight-medium">
            {{ receiverName }}
          </div>
          <div class="text-caption text-grey-6">
            {{ receiverUsername }}
          </div>
        </div>

        <!-- Botão para minimizar (apenas no desktop) -->
        <q-btn
          v-if="!isMobile"
          flat
          round
          icon="minimize"
          @click="minimizeChat"
          class="q-mr-xs"
        />
        <q-btn v-if="!isMobile" flat round icon="close" @click="closeChat" />
      </div>
    </div>

    <!-- Conteúdo do Chat (igual para ambos) -->
    <div class="chat-content">
      <!-- Área de Mensagens -->
      <div class="messages-container q-px-md q-pt-md">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message-bubble', messageClass(message)]"
        >
          <!-- Produto em destaque -->
          <div v-if="message.product" class="product-card q-mb-sm">
            <div class="row items-center no-wrap">
              <q-img
                v-if="message.product.images?.length > 0"
                :src="getImageUrl(message.product.images[0])"
                class="product-image"
              />
              <div class="col q-ml-sm">
                <div class="text-caption text-weight-medium">
                  {{ truncatedProductName(message.product.name) }}
                </div>
                <div class="text-caption text-orange">
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
      </div>

      <!-- Produto Atual -->
      <div v-if="product" class="current-product bg-grey-3 q-pa-sm">
        <div class="row items-center justify-between">
          <div class="row items-center no-wrap">
            <q-img
              v-if="product.images?.length > 0"
              :src="getImageUrl(product.images[0])"
              class="product-thumbnail q-mr-sm"
            />
            <div>
              <div class="text-caption text-weight-medium">
                {{ product.name }}
              </div>
              <div class="text-caption text-orange">
                {{ formatPrice(product.price) }}
              </div>
            </div>
          </div>
          <q-btn
            flat
            round
            icon="close"
            size="sm"
            @click="removeProduct"
            style="color: #f27c38"
          />
        </div>
      </div>

      <!-- Input de Mensagem -->
      <div class="message-input bg-white q-pa-md">
        <div class="row items-center no-wrap q-gutter-sm">
          <q-btn
            flat
            round
            icon="attach_file"
            size="sm"
            style="color: #f27c38"
          />

          <q-input
            v-model="newMessage.message"
            placeholder="Digite sua mensagem..."
            borderless
            class="col"
            dense
            @keyup.enter="sendMessage"
            :disable="registering"
          />

          <q-btn
            round
            icon="send"
            style="background-color: #f27c38; color: white"
            :loading="registering"
            @click="sendMessage"
            :disable="!newMessage.message?.trim()"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Modo Desktop (Janela Flutuante) -->
  <div v-else>
    <!-- Bolha Minimizada -->
    <div v-if="isMinimized" class="chat-bubble" @click="openChat">
      <q-avatar
        size="50px"
        style="background-color: #f27c38"
        text-color="white"
      >
        <q-img v-if="receiverAvatar" :src="receiverAvatar" />
        <q-icon v-else name="person" />
      </q-avatar>
      <div class="notification-dot" v-if="hasNewMessages"></div>
    </div>

    <!-- Janela do Chat -->
    <div v-else class="chat-window">
      <!-- Header da Janela -->
      <div class="chat-window-header bg-white q-pa-sm">
        <div class="row items-center no-wrap">
          <q-avatar
            size="32px"
            class="q-mr-sm"
            style="background-color: #f27c38"
            text-color="white"
          >
            <q-img v-if="receiverAvatar" :src="receiverAvatar" />
            <q-icon v-else name="person" />
          </q-avatar>

          <div class="col">
            <div class="text-weight-medium text-caption">
              {{ receiverName }}
            </div>
            <div class="text-caption text-grey-6" style="font-size: 10px">
              {{ receiverUsername }}
            </div>
          </div>

          <div class="row items-center">
            <q-btn
              flat
              round
              dense
              icon="minimize"
              size="sm"
              @click="minimizeChat"
            />
            <q-btn flat round dense icon="close" size="sm" @click="closeChat" />
          </div>
        </div>
      </div>

      <!-- Conteúdo do Chat (reutilizado) -->
      <div class="chat-content">
        <!-- Mesmo conteúdo das mensagens, produto e input -->
        <div class="messages-container q-px-md q-pt-md">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="['message-bubble', messageClass(message)]"
          >
            <!-- Produto em destaque -->
            <div v-if="message.product" class="product-card q-mb-sm">
              <div class="row items-center no-wrap">
                <q-img
                  v-if="message.product.images?.length > 0"
                  :src="getImageUrl(message.product.images[0])"
                  class="product-image"
                />
                <div class="col q-ml-sm">
                  <div class="text-caption text-weight-medium">
                    {{ truncatedProductName(message.product.name) }}
                  </div>
                  <div class="text-caption text-orange">
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
        </div>

        <!-- Produto Atual -->
        <div v-if="product" class="current-product bg-grey-3 q-pa-sm">
          <div class="row items-center justify-between">
            <div class="row items-center no-wrap">
              <q-img
                v-if="product.images?.length > 0"
                :src="getImageUrl(product.images[0])"
                class="product-thumbnail q-mr-sm"
              />
              <div>
                <div class="text-caption text-weight-medium">
                  {{ product.name }}
                </div>
                <div class="text-caption text-orange">
                  {{ formatPrice(product.price) }}
                </div>
              </div>
            </div>
            <q-btn
              flat
              round
              icon="close"
              size="sm"
              @click="removeProduct"
              style="color: #f27c38"
            />
          </div>
        </div>

        <!-- Input de Mensagem -->
        <div class="message-input bg-white q-pa-md">
          <div class="row items-center no-wrap q-gutter-sm">
            <q-btn
              flat
              round
              icon="attach_file"
              size="sm"
              style="color: #f27c38"
            />

            <q-input
              v-model="newMessage.message"
              placeholder="Digite sua mensagem..."
              borderless
              class="col"
              dense
              @keyup.enter="sendMessage"
              :disable="registering"
            />

            <q-btn
              round
              icon="send"
              style="background-color: #f27c38; color: white"
              :loading="registering"
              @click="sendMessage"
              :disable="!newMessage.message?.trim()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
import store from "src/store/index.js";
import apiMethods from "src/router/api.js";

export default {
  data() {
    return {
      newMessage: {
        receiver_id: null,
        message: null,
        product_id: null,
      },
      product: null,
      messages: [],
      registering: false,
      isMinimized: false,
      hasNewMessages: false,
      windowPosition: {
        x: window.innerWidth - 350,
        y: window.innerHeight - 500,
      },
    };
  },
  computed: {
    isAuthenticated() {
      return !!store.state.user;
    },
    isMobile() {
      return window.innerWidth < 768;
    },
    receiverName() {
      if (!this.messages.length) return "Carregando...";
      const receiver = this.messages[0].receiver;
      if (receiver.empresas.length > 0) return receiver.empresas[0].nome;
      if (receiver.entregadores.length > 0) return receiver.name;
      return receiver.name;
    },
    receiverUsername() {
      if (!this.messages.length) return "";
      const receiver = this.messages[0].receiver;
      if (receiver.empresas.length > 0)
        return `@${receiver.empresas[0].username}`;
      return "Online";
    },
    receiverAvatar() {
      if (!this.messages.length) return null;
      const receiver = this.messages[0].receiver;
      return receiver.empresas[0]?.perfil_foto || null;
    },
  },
  mounted() {
    const savedMessage = localStorage.getItem("newMessage");
    if (savedMessage) {
      this.newMessage = JSON.parse(savedMessage);
      this.fetchProductById(this.newMessage.product_id);
    } else {
      this.fetchProductById();
    }

    // No desktop, começa minimizado
    if (!this.isMobile) {
      this.isMinimized = true;
    }
  },
  methods: {
    // Métodos existentes (formatPrice, formatTime, etc.) permanecem iguais
    formatPrice(price) {
      return `${price} MZN`;
    },
    formatTime(date) {
      return format(new Date(date), "HH:mm");
    },
    truncatedProductName(name) {
      return name.length > 30 ? name.substring(0, 30) + "..." : name;
    },
    removeProduct() {
      this.product = null;
    },
    messageClass(message) {
      return message.sender_id === this.$store.state.user.id
        ? "outgoing"
        : "incoming";
    },

    // Novos métodos para controle da janela
    minimizeChat() {
      this.isMinimized = true;
    },

    openChat() {
      this.isMinimized = false;
      this.hasNewMessages = false;
    },

    closeChat() {
      if (this.isMobile) {
        this.goBack();
      } else {
        this.isMinimized = true;
        // Ou fechar completamente, dependendo do seu fluxo
        // this.$emit('close-chat');
      }
    },

    async sendMessage() {
      if (!this.isAuthenticated) {
        localStorage.setItem("newMessage", JSON.stringify(this.newMessage));
        this.$router.push("/login");
        return;
      }

      if (!this.newMessage.message?.trim()) return;

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
      } catch (error) {
        localStorage.setItem("newMessage", JSON.stringify(this.newMessage));
        console.error("Erro ao enviar mensagem:", error);
      } finally {
        this.registering = false;
      }
    },

    goBack() {
      this.$router.go(-1);
    },

    async fetchProductById(productId) {
      try {
        const id = productId || this.$route.params.product_id;

        if (id) {
          const response = await apiMethods.getPublicProductById(id);
          this.product = response.data.product;
          if (this.product.description) {
            this.product.description = this.product.description
              .replace(/(\{.*\})/, "")
              .trim();
          }
        }

        const receiverId =
          this.product?.empresa?.user_id || this.$route.params.seller_id;
        if (receiverId) {
          const response = await apiMethods.getMessages(receiverId);
          this.messages = response.data;
        }
      } catch (error) {
        console.error("Erro ao carregar chat:", error);
      }
    },

    getImageUrl(imageName) {
      return apiMethods.baseURL() + `/storage/product_images/${imageName.name}`;
    },
  },
};
</script>

<style scoped>
/* Estilos para Mobile (existentes) */
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chat-header {
  border-bottom: 1px solid #e0e0e0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 16px;
}

.message-bubble {
  max-width: 80%;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 12px;
}

.message-bubble.incoming {
  background: white;
  border: 1px solid #e0e0e0;
  margin-right: auto;
}

.message-bubble.outgoing {
  background: #f27c38;
  color: white;
  margin-left: auto;
}

.product-card {
  padding: 8px;
  background: #f5f5f5;
  border-radius: 8px;
  border-left: 3px solid #f27c38;
}

.product-image {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
}

.product-thumbnail {
  width: 35px;
  height: 35px;
  border-radius: 6px;
  object-fit: cover;
}

.message-content {
  margin-top: 8px;
}

.message-text {
  line-height: 1.4;
  word-break: break-word;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 4px;
  text-align: right;
}

.current-product {
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.message-input {
  border-top: 1px solid #e0e0e0;
}

.text-orange {
  color: #f27c38;
}

/* Estilos para Desktop (Janela Flutuante) */
.chat-window {
  position: fixed;
  width: 350px;
  height: 500px;
  right: 20px;
  bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  background: white;
  display: flex;
  flex-direction: column;
  z-index: 9999;
}

.chat-window-header {
  border-bottom: 1px solid #e0e0e0;
  border-radius: 12px 12px 0 0;
  cursor: move;
}

.chat-bubble {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 60px;
  height: 60px;
  cursor: pointer;
  z-index: 9999;
}

.notification-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #ff4444;
  border-radius: 50%;
  border: 2px solid white;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Ajustes para a janela flutuante */
.chat-window .messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.chat-window .message-bubble {
  max-width: 85%;
  padding: 8px 12px;
  margin-bottom: 8px;
}

.chat-window .product-image {
  width: 35px;
  height: 35px;
}

.chat-window .message-input {
  padding: 12px;
}

/* Scrollbar */
.messages-container::-webkit-scrollbar {
  width: 4px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #f27c38;
  border-radius: 2px;
}

/* Responsivo */
@media (max-width: 600px) {
  .messages-container {
    padding-left: 12px;
    padding-right: 12px;
  }

  .message-bubble {
    max-width: 90%;
  }
}

@media (min-width: 768px) {
  .chat-page {
    max-width: 400px;
    margin: 0 auto;
    height: 80vh;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    margin-top: 10vh;
  }
}
</style>
