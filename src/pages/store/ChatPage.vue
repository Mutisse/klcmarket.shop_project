<template>
  <!-- Layout para Desktop (acima de 1024px) -->
  <div v-if="$q.screen.gt.sm" class="desktop-chat-layout">
    <q-layout view="hHh Lpr lFf">
      <!-- Header Elegante para Desktop -->
      <q-header elevated class="chat-header-desktop">
        <q-toolbar class="q-px-xl q-py-lg">
          <q-btn
            flat
            round
            icon="arrow_back"
            @click="goBack"
            class="q-mr-lg back-btn-desktop"
          />

          <q-avatar size="56px" class="q-mr-lg receiver-avatar-desktop">
            <q-img v-if="receiverAvatar" :src="receiverAvatar" />
            <q-icon v-else name="person" color="white" />
          </q-avatar>

          <div class="col">
            <div class="text-h5 text-weight-bold text-white">
              {{ receiverName }}
            </div>
            <div class="text-subtitle1 text-grey-3">
              {{ receiverUsername }}
              <q-badge v-if="isOnline" color="green" rounded class="q-ml-sm">
                Online
              </q-badge>
            </div>
          </div>

          <q-space />

          <div class="header-actions-desktop">
            <q-btn 
              flat 
              round 
              icon="call" 
              size="lg" 
              class="action-btn-desktop q-mr-md"
            />
            <q-btn 
              flat 
              round 
              icon="videocam" 
              size="lg" 
              class="action-btn-desktop q-mr-md"
            />
            <q-btn 
              flat 
              round 
              icon="more_vert" 
              size="lg" 
              class="action-btn-desktop"
            />
          </div>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page class="chat-page-desktop">
          <!-- Layout de Duas Colunas para Desktop -->
          <div class="desktop-layout">
            <!-- Sidebar de Informações (Desktop) -->
            <div class="chat-sidebar">
              <q-card class="sidebar-card">
                <q-card-section class="product-section">
                  <div class="text-h6 text-weight-bold q-mb-md" style="color: #bd6513">
                    Produto em Discussão
                  </div>
                  
                  <div v-if="product" class="product-detail-card">
                    <q-img
                      v-if="product.images?.length > 0"
                      :src="getImageUrl(product.images[0])"
                      class="product-detail-image"
                    />
                    <div class="product-info q-mt-md">
                      <div class="text-h6 text-weight-medium text-grey-9">
                        {{ product.name }}
                      </div>
                      <div class="text-h5 text-weight-bold q-mt-xs" style="color: #bd6513">
                        {{ formatPrice(product.price) }}
                      </div>
                      <div class="text-caption text-grey-6 q-mt-sm">
                        {{ product.description || 'Sem descrição disponível' }}
                      </div>
                    </div>
                    
                    <q-btn
                      outline
                      label="Remover Produto"
                      style="color: #bd6513; border-color: #bd6513"
                      class="full-width q-mt-md"
                      @click="removeProduct"
                    />
                  </div>
                  
                  <div v-else class="no-product">
                    <q-icon name="inventory_2" size="48px" color="grey-4" />
                    <div class="text-subtitle1 text-grey-6 q-mt-md">
                      Nenhum produto selecionado
                    </div>
                  </div>
                </q-card-section>

                <!-- Informações do Vendedor -->
                <q-card-section class="seller-section">
                  <div class="text-h6 text-weight-bold q-mb-md" style="color: #bd6513">
                    Informações do Vendedor
                  </div>
                  <div class="seller-info">
                    <q-avatar size="60px" class="q-mb-sm seller-avatar">
                      <q-img v-if="receiverAvatar" :src="receiverAvatar" />
                      <q-icon v-else name="store" color="white" />
                    </q-avatar>
                    <div class="text-weight-medium text-grey-9">
                      {{ receiverName }}
                    </div>
                    <div class="text-caption text-grey-6">
                      {{ receiverUsername }}
                    </div>
                    <q-btn
                      outline
                      label="Ver Perfil"
                      style="color: #bd6513; border-color: #bd6513"
                      class="q-mt-md"
                      size="sm"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Área Principal de Mensagens -->
            <div class="chat-main-area">
              <!-- Data Separator -->
              <div v-if="showDateSeparator" class="date-separator-desktop">
                <div class="separator-line"></div>
                <q-badge class="date-badge-desktop">
                  {{ formatDate(new Date()) }}
                </q-badge>
                <div class="separator-line"></div>
              </div>

              <!-- Mensagens -->
              <div class="messages-container-desktop">
                <div
                  v-for="(message, index) in messages"
                  :key="message.id"
                  :class="['message-row-desktop', messageClass(message)]"
                >
                  <div class="message-wrapper-desktop">
                    <!-- Avatar para mensagens recebidas -->
                    <q-avatar 
                      v-if="messageClass(message) === 'incoming' && shouldShowAvatar(message, index)"
                      size="40px" 
                      class="message-avatar-desktop q-mr-md"
                    >
                      <q-img v-if="receiverAvatar" :src="receiverAvatar" />
                      <q-icon v-else name="person" color="white" />
                    </q-avatar>

                    <div class="message-content-desktop">
                      <div :class="['message-bubble-desktop', messageClass(message)]">
                        <!-- Produto em destaque -->
                        <div v-if="message.product" class="product-card-desktop">
                          <div class="row items-center">
                            <q-img
                              v-if="message.product.images?.length > 0"
                              :src="getImageUrl(message.product.images[0])"
                              class="product-image-desktop"
                            />
                            <div class="col q-ml-md">
                              <div class="text-subtitle2 text-weight-medium text-grey-9">
                                {{ message.product.name }}
                              </div>
                              <div class="text-caption" style="color: #bd6513">
                                {{ formatPrice(message.product.price) }}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="message-text-content">
                          <div class="message-text-desktop">
                            {{ message.message }}
                          </div>
                          <div class="message-time-desktop">
                            {{ formatTime(message.created_at) }}
                          </div>
                        </div>
                      </div>
                      
                      <!-- Nome do remetente para mensagens recebidas -->
                      <div 
                        v-if="messageClass(message) === 'incoming' && shouldShowAvatar(message, index)"
                        class="sender-name"
                      >
                        {{ receiverName }}
                      </div>
                    </div>

                    <!-- Avatar para mensagens enviadas -->
                    <q-avatar 
                      v-if="messageClass(message) === 'outgoing' && shouldShowAvatar(message, index)"
                      size="40px" 
                      class="message-avatar-desktop q-ml-md"
                    >
                      <q-icon name="person" color="white" />
                    </q-avatar>
                  </div>
                </div>
              </div>

              <!-- Input de Mensagem Elegante -->
              <div class="message-input-desktop">
                <q-card class="input-card">
                  <q-card-section class="q-pa-lg">
                    <div class="row items-center no-wrap q-gutter-lg">
                      <!-- Ações -->
                      <div class="input-actions-desktop">
                        <q-btn 
                          flat 
                          round 
                          icon="attach_file" 
                          size="lg" 
                          class="action-icon-desktop"
                        />
                        <q-btn 
                          flat 
                          round 
                          icon="image" 
                          size="lg" 
                          class="action-icon-desktop q-ml-sm"
                        />
                        <q-btn 
                          flat 
                          round 
                          icon="mood" 
                          size="lg" 
                          class="action-icon-desktop q-ml-sm"
                        />
                      </div>

                      <!-- Campo de Input -->
                      <q-input
                        v-model="newMessage.message"
                        placeholder="Digite sua mensagem..."
                        borderless
                        class="col message-input-field-desktop"
                        @keyup.enter="sendMessage"
                        :disable="registering"
                        autogrow
                      />

                      <!-- Botão de Enviar -->
                      <q-btn
                        round
                        icon="send"
                        class="send-button-desktop"
                        :loading="registering"
                        @click="sendMessage"
                        :disable="!newMessage.message?.trim()"
                        size="lg"
                      >
                        <q-spinner-hourglass v-if="registering" size="24px" />
                      </q-btn>
                    </div>

                    <!-- Indicador de produto ativo -->
                    <div v-if="product" class="product-indicator q-mt-md">
                      <div class="row items-center justify-between">
                        <div class="row items-center">
                          <q-icon name="inventory_2" size="16px" class="q-mr-xs" style="color: #bd6513" />
                          <div class="text-caption text-grey-7">
                            Respondendo sobre: <strong>{{ product.name }}</strong>
                          </div>
                        </div>
                        <q-btn
                          flat
                          label="Remover"
                          size="sm"
                          @click="removeProduct"
                          style="color: #bd6513"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>

  <!-- Layout Original para Mobile (até 1023px) -->
  <div v-else class="mobile-chat-layout">
    <div class="chat-page bg-grey-2">
      <!-- Header Simples -->
      <div class="chat-header bg-white q-pa-sm">
        <div class="row items-center no-wrap">
          <q-btn
            flat
            round
            icon="arrow_back"
            @click="goBack"
            class="q-mr-sm"
            style="color: #bd6513"
          />

          <q-avatar
            size="38px"
            class="q-mr-md"
            style="background-color: #bd6513"
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
        </div>
      </div>

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
                <div class="text-caption" style="color: #bd6513">
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
              <div class="text-caption" style="color: #bd6513">
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
            style="color: #bd6513"
          />
        </div>
      </div>

      <!-- Input de Mensagem -->
      <div class="message-input bg-white q-pa-md">
        <div class="row items-center no-wrap q-gutter-sm">
          <q-btn flat round icon="attach_file" size="sm" style="color: #bd6513" />

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
            style="background-color: #bd6513; color: white"
            :loading="registering"
            @click="sendMessage"
            :disable="!newMessage.message?.trim()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
      isOnline: true,
      lastMessageTime: null,
    };
  },
  computed: {
    isAuthenticated() {
      return !!store.state.user;
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
    showDateSeparator() {
      return this.messages.length > 0;
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
  },
  methods: {
    formatPrice(price) {
      return `${price} MZN`;
    },
    formatTime(date) {
      return format(new Date(date), "HH:mm");
    },
    formatDate(date) {
      return format(new Date(date), "dd 'de' MMMM", { locale: ptBR });
    },
    truncatedProductName(name) {
      return name.length > 30 ? name.substring(0, 30) + "..." : name;
    },
    removeProduct() {
      this.product = null;
      this.newMessage.product_id = null;
    },
    messageClass(message) {
      return message.sender_id === this.$store.state.user.id
        ? "outgoing"
        : "incoming";
    },
    shouldShowAvatar(message, index) {
      if (index === 0) return true;
      
      const prevMessage = this.messages[index - 1];
      if (!prevMessage) return true;
      
      if (prevMessage.sender_id !== message.sender_id) return true;
      
      const currentTime = new Date(message.created_at);
      const prevTime = new Date(prevMessage.created_at);
      const timeDiff = Math.abs(currentTime - prevTime);
      
      return timeDiff > 2 * 60 * 1000;
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
        
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      } catch (error) {
        localStorage.setItem("newMessage", JSON.stringify(this.newMessage));
        console.error("Erro ao enviar mensagem:", error);
        this.$q.notify({
          type: 'negative',
          message: 'Erro ao enviar mensagem',
          position: 'top'
        });
      } finally {
        this.registering = false;
      }
    },
    scrollToBottom() {
      const container = this.$el.querySelector('.messages-container') || 
                       this.$el.querySelector('.messages-container-desktop');
      if (container) {
        container.scrollTop = container.scrollHeight;
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
          
          this.$nextTick(() => {
            this.scrollToBottom();
          });
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
/* ===== ESTILOS PARA MOBILE (ORIGINAL) ===== */
.mobile-chat-layout .chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.mobile-chat-layout .chat-header {
  border-bottom: 1px solid #e0e0e0;
}

.mobile-chat-layout .messages-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 16px;
}

.mobile-chat-layout .message-bubble {
  max-width: 80%;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 12px;
}

.mobile-chat-layout .message-bubble.incoming {
  background: white;
  border: 1px solid #e0e0e0;
  margin-right: auto;
}

.mobile-chat-layout .message-bubble.outgoing {
  background: #bd6513;
  color: white;
  margin-left: auto;
}

.mobile-chat-layout .product-card {
  padding: 8px;
  background: #f5f5f5;
  border-radius: 8px;
  border-left: 3px solid #e4bf9b;
}

.mobile-chat-layout .product-image {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
}

.mobile-chat-layout .product-thumbnail {
  width: 35px;
  height: 35px;
  border-radius: 6px;
  object-fit: cover;
}

.mobile-chat-layout .message-content {
  margin-top: 8px;
}

.mobile-chat-layout .message-text {
  line-height: 1.4;
  word-break: break-word;
}

.mobile-chat-layout .message-time {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 4px;
  text-align: right;
}

.mobile-chat-layout .current-product {
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.mobile-chat-layout .message-input {
  border-top: 1px solid #e0e0e0;
}

/* Scrollbar Mobile */
.mobile-chat-layout .messages-container::-webkit-scrollbar {
  width: 4px;
}

.mobile-chat-layout .messages-container::-webkit-scrollbar-thumb {
  background: #bd6513;
  border-radius: 2px;
}

/* Responsivo Mobile */
@media (max-width: 600px) {
  .mobile-chat-layout .messages-container {
    padding-left: 12px;
    padding-right: 12px;
  }

  .mobile-chat-layout .message-bubble {
    max-width: 90%;
  }
}

/* ===== ESTILOS PARA DESKTOP (NOVO LAYOUT) ===== */

/* Layout Principal para Desktop */
.desktop-chat-layout .chat-page-desktop {
  background: white;
  min-height: 100vh;
}

.desktop-chat-layout .desktop-layout {
  display: flex;
  height: calc(100vh - 80px);
}

/* Header Elegante */
.desktop-chat-layout .chat-header-desktop {
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid #e0e0e0;
}

.desktop-chat-layout .back-btn-desktop {
  color: #e3ab76 !important;
}

.desktop-chat-layout .receiver-avatar-desktop {
  background: #eaa667e5;
  border: 3px solid #f0f0f0;
}

.desktop-chat-layout .text-h5,
.desktop-chat-layout .text-subtitle1 {
  color: #333333 !important;
}

.desktop-chat-layout .action-btn-desktop {
  color: #bd6513 !important;
  transition: all 0.3s ease;
}

.desktop-chat-layout .action-btn-desktop:hover {
  background: rgba(189, 101, 19, 0.1);
  transform: scale(1.1);
}

/* Sidebar Elegante */
.desktop-chat-layout .chat-sidebar {
  width: 380px;
  background: white;
  border-right: 1px solid #e0e0e0;
  padding: 24px;
  overflow-y: auto;
}

.desktop-chat-layout .sidebar-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.desktop-chat-layout .product-section,
.desktop-chat-layout .seller-section {
  border-bottom: 1px solid #f0f0f0;
}

.desktop-chat-layout .product-section:last-child,
.desktop-chat-layout .seller-section:last-child {
  border-bottom: none;
}

.desktop-chat-layout .product-detail-card {
  text-align: center;
}

.desktop-chat-layout .product-detail-image {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
}

.desktop-chat-layout .product-info {
  text-align: left;
}

.desktop-chat-layout .seller-avatar {
  background: #f0c8a3;
  margin: 0 auto 12px auto;
}

.desktop-chat-layout .seller-info {
  text-align: center;
}

.desktop-chat-layout .no-product {
  text-align: center;
  padding: 40px 20px;
}

/* Área Principal de Mensagens */
.desktop-chat-layout .chat-main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  background: #fafafa;
}

.desktop-chat-layout .date-separator-desktop {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 48px;
  gap: 16px;
}

.desktop-chat-layout .separator-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
}

.desktop-chat-layout .date-badge-desktop {
  background: #bd6513;
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.desktop-chat-layout .messages-container-desktop {
  flex: 1;
  overflow-y: auto;
  padding: 0 48px;
  display: flex;
  flex-direction: column;
  background: white;
}

.desktop-chat-layout .message-row-desktop {
  margin-bottom: 16px;
}

.desktop-chat-layout .message-row-desktop.incoming {
  align-items: flex-start;
}

.desktop-chat-layout .message-row-desktop.outgoing {
  align-items: flex-end;
}

.desktop-chat-layout .message-wrapper-desktop {
  display: flex;
  align-items: flex-start;
  max-width: 70%;
}

.desktop-chat-layout .message-content-desktop {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.desktop-chat-layout .message-bubble-desktop {
  padding: 16px 20px;
  border-radius: 20px;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.desktop-chat-layout .message-bubble-desktop.incoming {
  background: white;
  border: 1px solid #f0f0f0;
  border-top-left-radius: 8px;
}

.desktop-chat-layout .message-bubble-desktop.outgoing {
  background: #bd6513;
  color: white;
  border-top-right-radius: 8px;
}

.desktop-chat-layout .message-bubble-desktop:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.desktop-chat-layout .message-avatar-desktop {
  background: #bd6513;
  flex-shrink: 0;
  margin-top: 4px;
}

.desktop-chat-layout .product-card-desktop {
  padding: 12px;
  background: rgba(189, 101, 19, 0.05);
  border-radius: 12px;
  border-left: 3px solid #bd6513;
  margin-bottom: 12px;
}

.desktop-chat-layout .product-image-desktop {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.desktop-chat-layout .message-text-content {
  position: relative;
}

.desktop-chat-layout .message-text-desktop {
  line-height: 1.6;
  word-break: break-word;
  font-size: 15px;
}

.desktop-chat-layout .message-time-desktop {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 6px;
  text-align: right;
}

.desktop-chat-layout .message-row-desktop.incoming .message-time-desktop {
  text-align: left;
}

.desktop-chat-layout .sender-name {
  font-size: 12px;
  color: #9e9e9e;
  margin-top: 4px;
  margin-left: 8px;
}

/* Input Elegante */
.desktop-chat-layout .message-input-desktop {
  padding: 24px 48px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.desktop-chat-layout .input-card {
  border-radius: 20px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
}

.desktop-chat-layout .input-actions-desktop {
  display: flex;
  gap: 4px;
}

.desktop-chat-layout .action-icon-desktop {
  color: #bd6513 !important;
  transition: all 0.3s ease;
}

.desktop-chat-layout .action-icon-desktop:hover {
  background: rgba(189, 101, 19, 0.1);
  transform: scale(1.1);
}

.desktop-chat-layout .message-input-field-desktop {
  background: #f8f9fa;
  border-radius: 25px;
  padding: 12px 20px;
  min-height: 56px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.desktop-chat-layout .message-input-field-desktop:focus-within {
  background: white;
  box-shadow: 0 0 0 2px rgba(189, 101, 19, 0.2);
}

.desktop-chat-layout .send-button-desktop {
  background: #bd6513;
  color: white;
  width: 56px;
  height: 56px;
  transition: all 0.3s ease;
}

.desktop-chat-layout .send-button-desktop:hover:not(:disabled) {
  background: #a85510;
  transform: scale(1.05);
}

.desktop-chat-layout .send-button-desktop:disabled {
  background: #e0e0e0;
  color: #9e9e9e;
}

.desktop-chat-layout .product-indicator {
  padding: 12px 16px;
  background: rgba(189, 101, 19, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(189, 101, 19, 0.2);
}

/* Scrollbar Elegante */
.desktop-chat-layout .messages-container-desktop::-webkit-scrollbar {
  width: 8px;
}

.desktop-chat-layout .messages-container-desktop::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.desktop-chat-layout .messages-container-desktop::-webkit-scrollbar-thumb {
  background: #bd6513;
  border-radius: 4px;
}

.desktop-chat-layout .messages-container-desktop::-webkit-scrollbar-thumb:hover {
  background: #a85510;
}

/* Animações */
@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.desktop-chat-layout .message-bubble-desktop {
  animation: messageSlideIn 0.4s ease;
}

/* Ajustes para telas muito grandes */
@media (min-width: 1920px) {
  .desktop-chat-layout .chat-sidebar {
    width: 420px;
  }
  
  .desktop-chat-layout .messages-container-desktop {
    padding: 0 25%;
  }
  
  .desktop-chat-layout .message-input-desktop {
    padding: 24px 25%;
  }
}
</style>