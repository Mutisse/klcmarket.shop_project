<template>
  <q-layout>
    <HeaderC />

    <div class="message-list-page">
      <!-- Título da Página -->
      <div class="page-header">
        <q-toolbar class="bg-white">
          <q-btn flat round icon="arrow_back" @click="goBack" class="back-btn" />

          <div class="q-ml-md">
            <div class="text-h6">Suas Conversas</div>
          </div>
        </q-toolbar>
      </div>

      <!-- Container Principal -->
      <div class="main-container">
        <!-- Lista de Conversas -->
        <div class="conversations-sidebar">
          <div class="conversations-list">
            <div
              v-for="conversation in conversations"
              :key="conversation.id"
              class="conversation-item"
              :class="{ active: isActiveConversation(conversation) }"
              @click="selectConversation(conversation)"
            >
              <q-avatar size="40px" class="conversation-avatar">
                <q-icon name="person" color="white" />
              </q-avatar>

              <div class="conversation-info">
                <div class="conversation-name">{{ getUserName(conversation) }}</div>
                <div class="last-message">
                  {{ getLastMessagePreview(conversation) }}
                </div>
              </div>

              <div class="conversation-meta">
                <div class="conversation-time">{{ formatDate(conversation.created_at) }}</div>
                <q-badge 
                  v-if="conversation.sent_messages_count > 0"
                  rounded 
                  color="#bd6513" 
                  class="message-badge"
                  :label="conversation.sent_messages_count"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Área de Chat (Desktop) -->
        <div v-if="!isMobile && selectedConversation" class="chat-main-area">
          <!-- Header do Chat -->
          <div class="chat-header">
            <div class="chat-partner-info">
              <q-avatar size="40px" class="partner-avatar">
                <q-icon name="person" color="white" />
              </q-avatar>
              <div class="partner-details">
                <div class="partner-name">{{ getUserName(selectedConversation) }}</div>
                <div class="partner-status">
                  <q-badge color="green" rounded class="status-badge">
                    Online
                  </q-badge>
                </div>
              </div>
            </div>

            <div class="header-actions">
              <q-btn flat round icon="call" class="action-btn">
                <q-tooltip>Chamada de voz</q-tooltip>
              </q-btn>
              <q-btn flat round icon="info" class="action-btn">
                <q-tooltip>Informações</q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- Área de Mensagens -->
          <div class="messages-area">
            <div class="messages-container" ref="messagesContainer">
              <!-- Indicador de mensagens anteriores -->
              <div v-if="hasOlderMessages" class="messages-info">
                <q-btn 
                  flat 
                  dense 
                  color="primary" 
                  icon="expand_less" 
                  @click="loadOlderMessages"
                  class="load-older-btn"
                  :loading="loadingOlderMessages"
                >
                  Ver {{ allMessages.length - chatMessages.length }} mensagens anteriores
                </q-btn>
              </div>

              <!-- Indicador de carregamento -->
              <div v-if="loadingOlderMessages" class="loading-indicator">
                <q-spinner size="20px" color="#bd6513" />
                <div>Carregando mensagens...</div>
              </div>

              <div
                v-for="message in chatMessages"
                :key="message.id"
                :class="['message-wrapper', messageClass(message)]"
              >
                <div class="message-content">
                  <!-- Avatar para mensagens recebidas -->
                  <q-avatar 
                    v-if="messageClass(message) === 'incoming'"
                    size="32px" 
                    class="message-avatar"
                  >
                    <q-icon name="person" color="white" />
                  </q-avatar>

                  <div class="message-bubble-container">
                    <!-- Produto em destaque -->
                    <div v-if="message.product" class="product-preview">
                      <q-img
                        v-if="message.product.images?.length > 0"
                        :src="getImageUrl(message.product.images[0])"
                        class="product-image"
                      />
                      <div class="product-details">
                        <div class="product-name">{{ message.product.name }}</div>
                        <div class="product-price">{{ formatPrice(message.product.price) }}</div>
                      </div>
                    </div>

                    <div :class="['message-bubble', messageClass(message)]">
                      <div class="message-text">{{ message.message }}</div>
                      <div class="message-time">
                        {{ formatTime(message.created_at) }}
                        <span v-if="messageClass(message) === 'outgoing'" class="message-status">
                          <q-icon name="done_all" size="14px" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Avatar para mensagens enviadas -->
                  <q-avatar 
                    v-if="messageClass(message) === 'outgoing'"
                    size="32px" 
                    class="message-avatar"
                  >
                    <q-icon name="person" color="white" />
                  </q-avatar>
                </div>
              </div>
            </div>
          </div>

          <!-- Input de Mensagem -->
          <div class="message-input-area">
            <div class="input-container">
              <div class="input-actions">
                <q-btn flat round icon="attach_file" class="input-action-btn">
                  <q-tooltip>Anexar arquivo</q-tooltip>
                </q-btn>
                <q-btn flat round icon="image" class="input-action-btn">
                  <q-tooltip>Enviar imagem</q-tooltip>
                </q-btn>
              </div>

              <q-input
                v-model="newMessageText"
                placeholder="Digite sua mensagem..."
                borderless
                class="message-input-field"
                @keyup.enter="sendMessage"
                :disable="registering"
                autogrow
              />

              <q-btn
                round
                icon="send"
                class="send-button"
                :loading="registering"
                @click="sendMessage"
                :disable="!newMessageText?.trim()"
              >
                <q-spinner-hourglass v-if="registering" size="18px" />
                <q-tooltip>Enviar mensagem</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>

        <!-- Estado Vazio para Desktop -->
        <div v-else-if="!isMobile && !selectedConversation" class="empty-chat">
          <div class="empty-content">
            <q-icon name="forum" size="64px" color="#e5e5e5" />
            <div class="empty-title">Nenhuma conversa selecionada</div>
            <div class="empty-subtitle">
              Selecione uma conversa da lista para ver as mensagens
            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterC />
  </q-layout>
</template>

<script>
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
      allMessages: [], // Todas as mensagens carregadas
      newMessageText: "",
      newMessage: {
        receiver_id: null,
        message: null,
        product_id: null,
      },
      registering: false,
      isMobile: window.innerWidth < 768,
      maxDisplayedMessages: 5, // Número máximo de mensagens a mostrar
      hasOlderMessages: false,
      loadingOlderMessages: false,
      currentOffset: 0
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
        this.goToMessages(conversation);
      } else {
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
        
        // Salvar todas as mensagens
        this.allMessages = response.data;
        
        // Aplicar limite de mensagens exibidas
        this.applyMessageLimit();
        
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      }
    },

    applyMessageLimit() {
      if (this.allMessages.length > this.maxDisplayedMessages) {
        // Mostrar apenas as últimas mensagens
        this.chatMessages = this.allMessages.slice(-this.maxDisplayedMessages);
        this.hasOlderMessages = true;
      } else {
        this.chatMessages = this.allMessages;
        this.hasOlderMessages = false;
      }
    },

    async loadOlderMessages() {
      if (this.loadingOlderMessages) return;
      
      this.loadingOlderMessages = true;
      
      try {
        // Simular um delay de carregamento
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Aumentar o limite de mensagens exibidas
        this.maxDisplayedMessages += 30;
        this.applyMessageLimit();
        
        // Rolar um pouco para cima para mostrar as novas mensagens carregadas
        this.$nextTick(() => {
          const container = this.$refs.messagesContainer;
          if (container) {
            // Manter a posição relativa após carregar mais mensagens
            setTimeout(() => {
              container.scrollTop = 100; // Pequeno ajuste para mostrar as novas mensagens
            }, 100);
          }
        });
        
      } catch (error) {
        console.error("Erro ao carregar mensagens anteriores:", error);
      } finally {
        this.loadingOlderMessages = false;
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
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
      return format(new Date(date), "dd/MM/yy");
    },
    getUserName(conversation) {
      if (conversation.sender_id === store.state.user.id) {
        if (conversation.receiver.empresas.length > 0) {
          return conversation.receiver.empresas[0].nome;
        }
        return conversation.receiver.name;
      } else {
        if (conversation.sender.empresas.length > 0) {
          return conversation.sender.empresas[0].nome;
        }
        return conversation.sender.name;
      }
    },
    getLastMessagePreview(conversation) {
      if (!conversation.message) return "Nenhuma mensagem";
      return conversation.message.length > 35 
        ? conversation.message.substring(0, 35) + "..." 
        : conversation.message;
    },
    goBack() {
      this.$router.push("/");
    },
    formatPrice(price) {
      return `${price} MZN`;
    },
    formatTime(date) {
      return format(new Date(date), "HH:mm");
    },
    messageClass(message) {
      return message.sender_id === this.$store.state.user.id
        ? "outgoing"
        : "incoming";
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
          this.newMessageText = "";

          // Atualizar todas as mensagens
          this.allMessages = response.data.messages;
          this.applyMessageLimit();
          
          this.$nextTick(() => {
            this.scrollToBottom();
          });

          await this.fetchConversations();
        } catch (error) {
          localStorage.setItem("newMessage", JSON.stringify(this.newMessage));
          console.error("Erro ao enviar mensagem:", error);
        } finally {
          this.registering = false;
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
/* Estilos Gerais */
.message-list-page {
  min-height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
}

.page-header {
  border-bottom: 1px solid #e5e5e5;
  flex-shrink: 0;
}

.back-btn {
  color: #bd6513;
}

/* Container Principal - CORREÇÃO AQUI */
.main-container {
  display: flex;
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  min-height: 0; /* Importante para flexbox */
  overflow: hidden; /* Previne vazamento */
}

/* Sidebar de Conversas */
.conversations-sidebar {
  width: 350px;
  background: white;
  border-right: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Importante para flexbox */
}

.conversations-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  min-height: 0; /* Importante para flexbox */
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 12px;
  flex-shrink: 0; /* Impede que os itens encolham */
}

.conversation-item:hover {
  background: #fafafa;
}

.conversation-item.active {
  background: #fdf6f0;
  border-right: 3px solid #bd6513;
}

.conversation-avatar {
  background: #bd6513;
  flex-shrink: 0;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-name {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.last-message {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.conversation-time {
  font-size: 11px;
  color: #999;
  white-space: nowrap;
}

.message-badge {
  font-size: 10px;
  min-width: 18px;
  min-height: 18px;
}

/* Área Principal do Chat */
.chat-main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  min-height: 0; /* Importante para flexbox */
}

.chat-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  flex-shrink: 0; /* Impede que o header encolha */
}

.chat-partner-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.partner-avatar {
  background: #bd6513;
}

.partner-details {
  display: flex;
  flex-direction: column;
}

.partner-name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.partner-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-badge {
  font-size: 11px;
  padding: 2px 8px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  color: #666;
  transition: all 0.3s ease;
}

.action-btn:hover {
  color: #bd6513;
  background: rgba(189, 101, 19, 0.1);
}

/* Área de Mensagens */
.messages-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fafafa;
  min-height: 0; /* Importante para flexbox */
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0; /* Importante para flexbox */
}

/* Indicador de mensagens anteriores */
.messages-info {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.load-older-btn {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 13px;
  color: #bd6513;
  transition: all 0.3s ease;
}

.load-older-btn:hover {
  background: #fdf6f0;
  border-color: #bd6513;
}

.loading-indicator {
  text-align: center;
  padding: 16px 0;
  color: #666;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  flex-shrink: 0; /* Impede que as mensagens encolham */
}

.message-wrapper.incoming {
  align-items: flex-start;
}

.message-wrapper.outgoing {
  align-items: flex-end;
}

.message-content {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 70%;
}

.message-avatar {
  background: #bd6513;
  flex-shrink: 0;
}

.message-bubble-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.product-preview {
  background: white;
  border-radius: 8px;
  padding: 10px;
  border: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 280px;
}

.product-image {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
}

.product-details {
  flex: 1;
}

.product-name {
  font-weight: 600;
  font-size: 13px;
  color: #333;
  margin-bottom: 2px;
}

.product-price {
  font-size: 12px;
  color: #bd6513;
  font-weight: 600;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 16px;
  transition: all 0.3s ease;
  max-width: 400px;
  word-wrap: break-word;
}

.message-bubble.incoming {
  background: white;
  border: 1px solid #e5e5e5;
  color: #333;
}

.message-bubble.outgoing {
  background: #bd6513;
  color: white;
}

.message-text {
  line-height: 1.4;
  font-size: 14px;
  margin-bottom: 2px;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 4px;
}

.message-status {
  display: inline-flex;
  margin-left: 4px;
}

/* Input de Mensagem */
.message-input-area {
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #e5e5e5;
  flex-shrink: 0; /* Impede que o input encolha */
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  background: #f5f5f5;
  border-radius: 20px;
  padding: 6px 6px 6px 16px;
}

.input-actions {
  display: flex;
  gap: 4px;
}

.input-action-btn {
  color: #666;
  transition: all 0.3s ease;
}

.input-action-btn:hover {
  color: #bd6513;
}

.message-input-field {
  flex: 1;
  background: transparent;
  font-size: 14px;
}

.message-input-field :deep(.q-field__control) {
  min-height: 36px;
}

.send-button {
  background: #bd6513;
  color: white;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  background: #a85510;
}

.send-button:disabled {
  background: #e5e5e5;
  color: #999;
}

/* Estado Vazio */
.empty-chat {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  min-height: 0; /* Importante para flexbox */
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

/* Scrollbars */
.conversations-sidebar::-webkit-scrollbar,
.messages-container::-webkit-scrollbar {
  width: 4px;
}

.conversations-sidebar::-webkit-scrollbar-track,
.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.conversations-sidebar::-webkit-scrollbar-thumb,
.messages-container::-webkit-scrollbar-thumb {
  background: #bd6513;
  border-radius: 2px;
}

.conversations-sidebar::-webkit-scrollbar-thumb:hover,
.messages-container::-webkit-scrollbar-thumb:hover {
  background: #a85510;
}

/* Responsividade Mobile */
@media (max-width: 767px) {
  .main-container {
    flex-direction: column;
    min-height: auto;
  }

  .conversations-sidebar {
    width: 100%;
    border-right: none;
    flex: none;
    max-height: calc(100vh - 200px); /* Altura ajustada para mobile */
  }

  .chat-main-area,
  .empty-chat {
    display: none;
  }

  .conversation-item {
    padding: 12px 16px;
  }

  .conversation-item.active {
    border-right: none;
    background: #fdf6f0;
  }
}

/* Desktop com altura segura */
@media (min-width: 768px) {
  .main-container {
    height: calc(100vh - 140px); /* Altura segura considerando header e footer */
  }
}

/* Animações */
@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-bubble {
  animation: messageSlideIn 0.3s ease;
}
</style>