<template>
  <q-layout>
    <HeaderC />

    <div class="message-list-page">
      <!-- Título da Página -->
      <div class="q-pb-md">
        <q-toolbar class="bg-white">
          <q-btn flat round icon="arrow_back" @click="goBack" />

          <div class="q-ml-md">
            <div class="text-h6">Suas Conversas</div>
          </div>
        </q-toolbar>
      </div>

      <!-- Container Principal Responsivo -->
      <div class="main-container">
        <!-- Lista de Conversas -->
        <div class="conversations-list-container">
          <div class="conversations-list">
            <div
              v-for="conversation in conversations"
              :key="conversation.id"
              class="conversation-item"
              :class="{ active: isActiveConversation(conversation) }"
              clickable
              @click="selectConversation(conversation)"
            >
              <!-- Seção do ícone e informações do usuário -->
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="person" color="green" />
                </q-avatar>
              </q-item-section>

              <!-- Seção com as mensagens e status -->
              <q-item-section>
                <q-item-label class="conversation-name">{{
                  getUserName(conversation)
                }}</q-item-label>
                <q-item-label caption class="last-message-preview">{{
                  conversation.message?.length > 40
                    ? conversation.message.substring(0, 40) + "..."
                    : conversation.message
                }}</q-item-label>
                <q-item-label
                  v-if="conversation.sent_messages_count > 0"
                  caption
                  class="text-grey-8"
                >
                  <q-badge
                    rounded
                    color="green"
                    :label="conversation.sent_messages_count"
                  />
                </q-item-label>
              </q-item-section>

              <!-- Seção com data -->
              <q-item-section side>
                <q-item-label caption class="conversation-time">{{
                  formatDate(conversation.created_at)
                }}</q-item-label>
              </q-item-section>
            </div>
          </div>
        </div>

        <!-- Área de Chat Real (visível apenas em desktop) -->
        <div v-if="!isMobile && selectedConversation" class="chat-area">
          <!-- Header do Chat -->
          <div class="chat-header bg-white q-px-md q-py-sm">
            <div class="row items-center no-wrap">
              <q-avatar
                size="36px"
                class="q-mr-md"
                color="grey-5"
                text-color="white"
              >
                <q-icon name="person" size="18px" />
              </q-avatar>

              <div class="col">
                <div class="text-weight-medium text-body2">
                  <template v-if="selectedReceiver">
                    <span v-if="selectedReceiver.empresas.length > 0">
                      {{ selectedReceiver.empresas[0].nome }}
                    </span>
                    <span v-else-if="selectedReceiver.entregadores.length > 0">
                      {{ selectedReceiver.name }}
                    </span>
                    <span v-else>
                      {{ selectedReceiver.name }}
                    </span>
                  </template>
                </div>

                <div class="text-caption text-grey-6">
                  <template
                    v-if="
                      selectedReceiver && selectedReceiver.empresas.length > 0
                    "
                  >
                    @{{ selectedReceiver.empresas[0].username }}
                  </template>
                  <template v-else-if="selectedReceiver"> Online </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Área de Mensagens -->
          <div class="messages-area">
            <div class="messages-container">
              <div
                v-for="message in chatMessages"
                :key="message.id"
                class="message-wrapper"
                :class="messageClass(message)"
              >
                <!-- Mensagem com Produto -->
                <div class="message-bubble" v-if="message.product">
                  <div class="product-card bg-grey-2 rounded-borders q-mb-sm">
                    <div class="row items-center no-wrap q-pa-sm">
                      <q-img
                        v-if="
                          message.product.images &&
                          message.product.images.length > 0
                        "
                        :src="getImageUrl(message.product.images[0])"
                        class="product-image rounded-borders"
                        style="height: 45px; width: 45px"
                      />
                      <div class="col q-ml-md">
                        <div
                          class="text-caption text-weight-medium text-grey-9"
                        >
                          {{ truncatedProductName(message.product.name) }}
                        </div>
                        <div
                          class="text-caption text-grey-6 q-mt-xs"
                          style="font-size: 10px"
                        >
                          {{
                            truncatedProductDescription(
                              message.product.description
                            )
                          }}
                        </div>
                        <div
                          class="text-caption text-weight-bold q-mt-xs text-orange"
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
            class="current-product bg-grey-3 q-px-md q-py-sm"
            v-if="currentProduct"
          >
            <div class="row items-center no-wrap">
              <q-img
                v-if="currentProduct.images && currentProduct.images.length > 0"
                :src="getImageUrl(currentProduct.images[0])"
                class="rounded-borders q-mr-md"
                style="height: 35px; width: 35px"
              />
              <div class="col">
                <div class="text-caption text-weight-medium text-grey-9">
                  {{ currentProduct.name }}
                </div>
                <div class="text-caption text-orange">
                  {{ formatPrice(currentProduct.price) }}
                </div>
              </div>
              <q-btn flat round icon="close" size="sm" @click="removeProduct" />
            </div>
          </div>

          <!-- Input de Mensagem -->
          <div class="message-input bg-white q-px-md q-py-md">
            <div class="row items-center no-wrap q-gutter-x-sm">
              <q-btn
                flat
                round
                icon="attach_file"
                size="sm"
                class="text-grey-6"
              />

              <q-input
                v-model="newMessageText"
                placeholder="Digite sua mensagem..."
                borderless
                class="col-grow"
                dense
                bg-color="grey-2"
                rounded
                @keyup.enter="sendMessage"
                :disable="registering"
              />

              <q-btn
                round
                :icon="!registering ? 'send' : ''"
                class="send-btn"
                size="sm"
                @click="sendMessage"
                :disable="registering || !newMessageText?.trim()"
              >
                <q-spinner-hourglass
                  v-if="registering"
                  color="white"
                  size="14px"
                />
              </q-btn>
            </div>
          </div>
        </div>

        <!-- Estado Vazio para Desktop -->
        <div v-else-if="!isMobile && !selectedConversation" class="empty-state">
          <div class="empty-content">
            <q-icon name="forum" size="80px" color="grey-4" />
            <div class="empty-title">Nenhuma conversa selecionada</div>
            <div class="empty-subtitle">
              Selecione uma conversa da lista para ver as mensagens
            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterC v-if="true" />
  </q-layout>
</template>

<script>
import { format } from "date-fns";
import store from "src/store/index.js";
import apiMethods from "src/router/api.js";
import FooterC from "components/store/FooterC.vue";
import HeaderC from "components/store/HeaderC.vue";

export default {
  data() {
    return {
      conversations: [],
      selectedConversation: null,
      selectedReceiver: null,
      chatMessages: [],
      currentProduct: null,
      newMessageText: "",
      newMessage: {
        receiver_id: null,
        message: null,
        product_id: null,
      },
      registering: false,
      isMobile: window.innerWidth < 768,
    };
  },
  components: {
    FooterC,
    HeaderC,
  },
  mounted() {
    this.fetchConversations();
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.isMobile = window.innerWidth < 768;
    },
    async fetchConversations() {
      try {
        const response = await apiMethods.fetchConversations();
        this.conversations = response.data;
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    },
    async selectConversation(conversation) {
      if (this.isMobile) {
        // No mobile, vai para a página de chat
        this.goToMessages(conversation);
      } else {
        // No desktop, seleciona a conversa e carrega as mensagens
        this.selectedConversation = conversation;
        this.selectedReceiver =
          conversation.sender_id === store.state.user.id
            ? conversation.receiver
            : conversation.sender;
        await this.loadChatMessages();
      }
    },
    async loadChatMessages() {
      try {
        const receiverId = this.selectedReceiver.id;
        const response = await apiMethods.getMessages(receiverId);
        this.chatMessages = response.data;
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      }
    },
    isActiveConversation(conversation) {
      if (!this.selectedConversation) return false;
      return this.selectedConversation.id === conversation.id;
    },
    goToMessages(conversation) {
      const id =
        conversation.sender_id === store.state.user.id
          ? conversation.receiver.id
          : conversation.sender.id;
      this.$router.push("/chat/" + id);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    },
    getUserName(conversation) {
      if (conversation.sender_id === store.state.user.id) {
        if (conversation.receiver.empresas.length > 0) {
          return conversation.receiver.empresas[0].nome;
        }
        return conversation.receiver.name;
      } else {
        return conversation.sender.name;
      }
    },
    goBack() {
      this.$router.push("/");
    },

    // Métodos do Chat
    formatPrice(price) {
      return `${price} MZN`;
    },

    formatTime(date) {
      return format(new Date(date), "HH:mm");
    },

    truncatedProductName(name) {
      const maxLength = 25;
      return name.length > maxLength
        ? name.substring(0, maxLength) + "..."
        : name;
    },

    truncatedProductDescription(description) {
      const maxLength = 40;
      return description && description.length > maxLength
        ? description.substring(0, maxLength) + "..."
        : description;
    },

    removeProduct() {
      this.currentProduct = null;
    },

    messageClass(message) {
      return message.sender_id === this.$store.state.user.id
        ? "message-out"
        : "message-in";
    },

    async sendMessage() {
      if (!this.isAuthenticated) {
        localStorage.setItem("newMessage", JSON.stringify(this.newMessage));
        this.$router.push("/login");
        return;
      }

      if (this.newMessageText.trim()) {
        try {
          this.registering = true;
          this.newMessage.receiver_id = this.selectedReceiver.id;
          this.newMessage.message = this.newMessageText;
          this.newMessage.url =
            apiMethods.frontURL() + `/chat/${store.state.user.id}`;

          const response = await apiMethods.sendMessage(this.newMessage);
          localStorage.removeItem("newMessage");
          this.newMessage.message = "";
          this.newMessageText = "";

          this.chatMessages = response.data.messages;
          this.registering = false;

          // Atualiza a lista de conversas
          await this.fetchConversations();
        } catch (error) {
          this.registering = false;
          localStorage.setItem("newMessage", JSON.stringify(this.newMessage));
          console.error("Erro ao enviar mensagem:", error);
        }
      }
    },

    getImageUrl(imageName) {
      return apiMethods.baseURL() + `/storage/product_images/${imageName.name}`;
    },
  },
  computed: {
    isAuthenticated() {
      return store.state.user ? true : false;
    },
  },
};
</script>

<style scoped>
/* Estilos gerais da página */
.message-list-page {
  background-color: #f5f5f5;
  padding: 0;
  min-height: 100vh;
}

/* Container Principal Responsivo */
.main-container {
  display: flex;
  height: calc(100vh - 130px);
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Lista de Conversas */
.conversations-list-container {
  flex: 1;
  max-width: 400px;
  border-right: 1px solid #e0e0e0;
  background: white;
  overflow-y: auto;
}

.conversations-list {
  display: flex;
  flex-direction: column;
}

/* Itens individuais de conversa */
.conversation-item {
  background-color: white;
  padding: 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.conversation-item:hover {
  background-color: #f8f9fa;
}

.conversation-item.active {
  background-color: #e3f2fd;
  border-left: 4px solid #1976d2;
}

.conversation-item.active::after {
  content: "";
  position: absolute;
  right: -1px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid white;
}

.conversation-name {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.last-message-preview {
  font-size: 13px;
  color: #666;
  line-height: 1.3;
}

.conversation-time {
  font-size: 11px;
  color: #999;
  white-space: nowrap;
}

/* Área de Chat para Desktop */
.chat-area {
  flex: 2;
  display: flex;
  flex-direction: column;
  background: white;
}

.chat-header {
  border-bottom: 1px solid #e0e0e0;
}

.messages-area {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.message-wrapper {
  margin-bottom: 12px;
  display: flex;
}

.message-wrapper.message-in {
  justify-content: flex-start;
}

.message-wrapper.message-out {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 70%;
}

.message-in .message-bubble {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 10px 14px;
}

.message-out .message-bubble {
  background: #f27c38;
  color: white;
  border-radius: 16px;
  padding: 10px 14px;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.message-text {
  line-height: 1.4;
  word-wrap: break-word;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 4px;
}

.message-in .message-time {
  color: #666;
}

.message-out .message-time {
  color: rgba(255, 255, 255, 0.9);
}

.current-product {
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.send-btn {
  background: #f27c38 !important;
  color: white !important;
}

.send-btn:disabled {
  opacity: 0.6;
}

/* Estado Vazio */
.empty-state {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.empty-content {
  text-align: center;
  color: #999;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 8px;
}

.empty-subtitle {
  font-size: 14px;
  max-width: 300px;
  line-height: 1.4;
}

/* Responsividade */
@media (max-width: 767px) {
  .message-list-page {
    padding: 0;
  }

  .main-container {
    flex-direction: column;
    height: auto;
    border-radius: 0;
    box-shadow: none;
  }

  .conversations-list-container {
    max-width: none;
    border-right: none;
    flex: none;
  }

  .conversation-item {
    padding: 12px 16px;
  }

  .conversation-item.active {
    border-left: none;
    background-color: #e3f2fd;
  }

  .conversation-item.active::after {
    display: none;
  }

  /* Esconder área de chat no mobile */
  .chat-area,
  .empty-state {
    display: none;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .main-container {
    margin: 0 16px;
    height: calc(100vh - 150px);
  }

  .conversations-list-container {
    max-width: 350px;
  }
}

@media (min-width: 1024px) {
  .main-container {
    margin: 20px auto;
    height: calc(100vh - 170px);
  }
}

/* Scrollbar personalizada */
.conversations-list-container::-webkit-scrollbar {
  width: 6px;
}

.conversations-list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.conversations-list-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.conversations-list-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
