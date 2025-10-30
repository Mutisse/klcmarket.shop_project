<template>
  <q-layout view="hHh Lpr lFf">
    <!-- Header Customizado -->
    <HeaderC />
    
    <!-- Botão Voltar FIXO no topo -->
    <div class="back-button-fixed">
      <q-btn
        flat
        round
        dense
        size="md"
        icon="arrow_back"
        class="back-btn"
        @click="voltar"
      />
    </div>

    <q-page-container>
      <q-page class="ver-page">
        <!-- Loading -->
        <div v-if="carregando" class="skeleton-container q-pa-md">
          <q-card class="skeleton-card q-mb-md">
            <q-card-section>
              <q-skeleton type="text" width="60%" />
              <q-skeleton type="text" width="40%" class="q-mt-sm" />
            </q-card-section>
          </q-card>
          
          <q-card class="skeleton-card q-mb-md">
            <q-card-section>
              <div class="row">
                <div v-for="i in 4" :key="i" class="col-3">
                  <q-skeleton type="circle" size="40px" class="q-mx-auto" />
                  <q-skeleton type="text" width="80%" class="q-mt-sm q-mx-auto" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Conteúdo Principal -->
        <div v-else>
          <!-- Status do Pedido -->
          <div class="order-status-section q-pa-md">
            <q-badge 
              :color="getStatusColor(form.status)" 
              class="status-badge q-px-md q-py-xs"
              rounded
            >
              {{ getStatusText(form.status) }}
            </q-badge>
          </div>

          <!-- Status Tracker -->
          <div class="status-container q-pa-md">
            <div class="status-header q-mb-lg">
              <div class="text-h6 text-weight-bold text-center">Acompanhe sua Entrega</div>
              <div class="text-caption text-grey-7 text-center">
                {{ getStatusDescription() }}
              </div>
            </div>

            <div class="status-tracker">
              <div 
                v-for="(fase, index) in statusFases" 
                :key="fase.id"
                class="status-step"
                :class="{
                  'completed': fase.completed,
                  'current': isCurrentStep(fase, index),
                  'future': !fase.completed && !isCurrentStep(fase, index)
                }"
              >
                <div class="step-indicator">
                  <div class="step-circle" :class="fase.color">
                    <q-icon 
                      v-if="fase.completed" 
                      name="check" 
                      size="14px" 
                      color="white" 
                      class="completed-icon"
                    />
                    <q-icon 
                      v-else
                      :name="fase.icon" 
                      size="16px" 
                      :class="getIconColor(fase, index)"
                      class="step-icon"
                    />
                  </div>
                  
                  <div 
                    v-if="index < statusFases.length - 1"
                    class="step-connector"
                    :class="{
                      'completed': statusFases[index + 1]?.completed,
                      'future': !statusFases[index + 1]?.completed
                    }"
                  ></div>
                </div>

                <div class="step-label">
                  <div class="text-caption text-weight-medium">{{ fase.nome }}</div>
                  <div v-if="isCurrentStep(fase, index)" class="current-indicator">
                    <div class="pulse-dot" :class="fase.color"></div>
                    <span class="text-caption" :class="`text-${fase.color}`">Atual</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Informações Adicionais -->
            <div class="delivery-info q-mt-xl">
              <q-card 
                v-if="form.status === 'ENTREGANDO'" 
                class="info-card bg-purple text-white"
              >
                <div class="row items-center q-pa-md">
                  <q-icon name="directions_bike" size="28px" class="q-mr-md" />
                  <div>
                    <div class="text-weight-bold">Em rota de entrega</div>
                    <div class="text-caption">Seu pedido está a caminho do destino</div>
                  </div>
                </div>
              </q-card>

              <q-card 
                v-else-if="form.status === 'RECEBIDO' || form.status === 'PUBLICO'" 
                class="info-card bg-orange text-white"
              >
                <div class="row items-center q-pa-md">
                  <q-icon name="inventory_2" size="28px" class="q-mr-md" />
                  <div>
                    <div class="text-weight-bold">Preparando seu pedido</div>
                    <div class="text-caption">Estamos organizando todos os itens</div>
                  </div>
                </div>
              </q-card>

              <q-card 
                v-else-if="form.status === 'DESPACHADO'" 
                class="info-card bg-blue text-white"
              >
                <div class="row items-center q-pa-md">
                  <q-icon name="local_shipping" size="28px" class="q-mr-md" />
                  <div>
                    <div class="text-weight-bold">Pedido despachado</div>
                    <div class="text-caption">Seu pedido saiu para entrega</div>
                  </div>
                </div>
              </q-card>

              <q-card 
                v-else-if="form.status === 'ENTREGUE'" 
                class="info-card bg-green text-white"
              >
                <div class="row items-center q-pa-md">
                  <q-icon name="check_circle" size="28px" class="q-mr-md" />
                  <div>
                    <div class="text-weight-bold">Pedido entregue!</div>
                    <div class="text-caption">Obrigado por escolher nossos serviços</div>
                  </div>
                </div>
              </q-card>
            </div>
          </div>

          <!-- Informações do Pedido -->
          <div class="order-info-section q-pa-md">
            <q-card class="info-card">
              <q-card-section>
                <div class="row items-center q-mb-md">
                  <q-avatar icon="receipt" color="primary" text-color="white" />
                  <div class="q-ml-md">
                    <div class="text-h6 text-weight-bold">{{ formatarDataHora(form.created_at) }}</div>
                    <div class="text-caption text-grey-7">{{ formatarData(form.created_at) }}</div>
                  </div>
                  <q-space />
                  <div class="text-h6 text-weight-bold text-primary">
                    {{ form.tipo == 'PACOTE' ? form.valor : form.total }} MT
                  </div>
                </div>

                <!-- Timeline de Localização -->
                <div class="location-timeline q-mt-lg">
                  <div class="location-item">
                    <div class="location-icon bg-primary text-white">
                      <q-icon name="my_location" size="16px" />
                    </div>
                    <div class="location-content">
                      <div class="text-weight-bold">Origem</div>
                      <div class="text-body1">{{ form.empresa?.nome }}</div>
                      <div v-if="form.hora_de_levantamento" class="text-caption text-grey-7">
                        Levantamento: {{ formatarDataHora(form.horaDeLevantamento) }}
                      </div>
                      
                      <!-- Contato do Remetente -->
                      <div v-if="isDelivering(form.status)" class="contact-section q-mt-sm">
                        <div class="row items-center">
                          <q-icon name="person" size="16px" class="q-mr-xs text-grey-7" />
                          <div class="text-caption text-weight-medium">
                            {{ form.sender.name + " " + form.sender.apelido }}
                          </div>
                        </div>
                        <div class="contact-buttons q-mt-xs">
                          <q-btn 
                            round 
                            dense 
                            icon="phone" 
                            color="green" 
                            size="sm"
                            @click="makeCall(form.sender.telefone)"
                          />
                          <q-btn 
                            round 
                            dense 
                            icon="message" 
                            color="blue" 
                            size="sm"
                            class="q-ml-xs"
                            @click="sendSMS(form.sender.telefone)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="location-connector"></div>

                  <div class="location-item">
                    <div class="location-icon bg-secondary text-white">
                      <q-icon name="place" size="16px" />
                    </div>
                    <div class="location-content">
                      <div class="text-weight-bold">Destino</div>
                      <div class="text-body1">{{ form.destino }}</div>
                      <div v-if="form.hora_de_entrega" class="text-caption text-grey-7">
                        Entrega: {{ formatarDataHora(form.horaDeEntrega) }}
                      </div>
                      
                      <!-- Contato do Destinatário -->
                      <div v-if="isDelivering(form.status)" class="contact-section q-mt-sm">
                        <div class="row items-center">
                          <q-icon name="person" size="16px" class="q-mr-xs text-grey-7" />
                          <div class="text-caption text-weight-medium">
                            {{ form.receiver.name + " " + form.receiver.apelido }}
                          </div>
                        </div>
                        <div class="contact-buttons q-mt-xs">
                          <q-btn 
                            round 
                            dense 
                            icon="phone" 
                            color="green" 
                            size="sm"
                            @click="makeCall(form.receiver.telefone)"
                          />
                          <q-btn 
                            round 
                            dense 
                            icon="message" 
                            color="blue" 
                            size="sm"
                            class="q-ml-xs"
                            @click="sendSMS(form.receiver.telefone)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Itens do Pedido -->
          <div class="items-section q-pa-md">
            <q-card class="info-card">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-md">Itens do Pedido</div>
                
                <!-- Itens do Pacote -->
                <div v-for="(item, index) in form.items" :key="'pkg-' + index" class="item-card q-mb-md">
                  <div class="row items-center">
                    <q-avatar rounded size="60px" class="q-mr-md">
                      <img 
                        v-if="item.images.length > 0"
                        :src="item.images[0].preview"
                        alt="Item image"
                        class="item-image"
                      />
                      <q-icon v-else name="inventory_2" color="grey-5" />
                    </q-avatar>
                    
                    <div class="col-grow">
                      <div class="text-weight-medium">{{ item.descricao }}</div>
                      <div class="row items-center q-mt-xs">
                        <div class="text-caption text-grey-7">Qtd: {{ item.quantidade }}</div>
                        <q-space />
                        <div class="text-h6 text-primary">{{ item.preco }} MZ</div>
                      </div>
                    </div>
                  </div>
                  
                  <q-btn
                    label="Falar com Vendedor"
                    icon="chat"
                    color="accent"
                    class="full-width q-mt-md"
                    rounded
                    @click="openChat"
                  />
                </div>

                <!-- Itens do Pedido Normal -->
                <div v-for="(item, index) in form.itens_pedido" :key="'ped-' + index" class="item-card q-mb-md">
                  <div class="row items-center">
                    <q-avatar rounded size="60px" class="q-mr-md">
                      <img 
                        v-if="item.produto.images.length > 0"
                        :src="getImageUrl(item.produto.images[0])"
                        alt="Product image"
                        class="item-image"
                      />
                      <q-icon v-else name="shopping_bag" color="grey-5" />
                    </q-avatar>
                    
                    <div class="col-grow">
                      <div class="text-weight-medium">{{ item.produto.nome }}</div>
                      <div class="row items-center q-mt-xs">
                        <div class="text-caption text-grey-7">Qtd: {{ item.quantidade }}</div>
                        <q-space />
                        <div class="text-h6 text-primary">{{ item.preco }} MZ</div>
                      </div>
                      
                      <!-- Status de Aprovação -->
                      <div class="approval-status q-mt-sm">
                        <q-chip
                          v-if="user.scope === 'cliente'"
                          :color="item.aprovado_vendedor ? 'green' : 'grey-5'"
                          text-color="white"
                          size="sm"
                          icon="store"
                          :label="item.aprovado_vendedor ? 'Vendedor ✔️' : 'Vendedor ⏳'"
                        />
                        <q-chip
                          v-if="user.scope === 'empresa'"
                          :color="item.aprovado_cliente ? 'green' : 'grey-5'"
                          text-color="white"
                          size="sm"
                          icon="person"
                          :label="item.aprovado_cliente ? 'Cliente ✔️' : 'Cliente ⏳'"
                        />
                      </div>
                      
                      <!-- Ações -->
                      <div class="item-actions q-mt-sm">
                        <q-btn
                          icon="chat"
                          color="blue"
                          size="sm"
                          round
                          @click="openChat(item.produto_id)"
                        />
                        <q-btn
                          v-if="user.scope === 'cliente' && !item.aprovado_cliente"
                          icon="check"
                          color="green"
                          size="sm"
                          round
                          class="q-ml-xs"
                          @click="aprovarCliente(item)"
                        />
                        <q-btn
                          v-if="user.scope === 'cliente' && !item.aprovado_cliente"
                          icon="close"
                          color="red"
                          size="sm"
                          round
                          class="q-ml-xs"
                          @click="RemoverCliente(item)"
                        />
                        <q-btn
                          v-if="user.scope === 'empresa' && !item.aprovado_vendedor"
                          icon="check"
                          color="green"
                          size="sm"
                          round
                          class="q-ml-xs"
                          @click="aprovarVendedor(item)"
                        />
                        <q-btn
                          v-if="user.scope === 'empresa' && !item.aprovado_vendedor"
                          icon="close"
                          color="red"
                          size="sm"
                          round
                          class="q-ml-xs"
                          @click="RemoverVendedor(item)"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="!form.items?.length && !form.itens_pedido?.length" class="text-center q-py-lg">
                  <q-icon name="inventory_2" size="48px" color="grey-4" />
                  <div class="text-h6 text-grey-6 q-mt-md">Nenhum item encontrado</div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Detalhes Adicionais -->
          <div class="details-section q-pa-md">
            <q-card class="info-card">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-md">Detalhes Adicionais</div>
                
                <q-input
                  filled
                  v-model="form.nota"
                  label="Nota"
                  disable
                  type="textarea"
                  class="q-mb-md"
                />

                <div class="row">
                  <q-input
                    v-if="form.tipo == 'PACOTE'"
                    filled
                    v-model="form.valor"
                    label="Valor Total"
                    disable
                    class="col-12"
                  />
                  <q-input
                    v-if="form.tipo == 'PEDIDO'"
                    filled
                    v-model="form.total"
                    label="Total do Pedido"
                    disable
                    class="col-12"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Botões de Ação -->
          <div class="action-buttons q-pa-md">
            <q-btn
              v-if="form.status == 'PUBLICO' && user.scope == 'entregador'"
              :disable="registering"
              icon="local_shipping"
              label="Começar a Entregar"
              color="primary"
              class="full-width action-btn"
              size="lg"
              rounded
              @click="handleClick"
            >
              <q-spinner-hourglass v-if="registering" color="white" size="24px" />
            </q-btn>

            <q-btn
              v-if="form.status == 'ENTREGANDO' && user.scope == 'entregador'"
              :disable="registering"
              icon="check_circle"
              label="Finalizar Entrega"
              color="green"
              class="full-width action-btn"
              size="lg"
              rounded
              @click="handleClick2"
            >
              <q-spinner-hourglass v-if="registering" color="white" size="24px" />
            </q-btn>

            <q-btn
              v-if="form.status == 'RECEBIDO' && !form.aprovado && user.scope === 'cliente'"
              :disable="registering"
              icon="cancel"
              label="Cancelar Pedido"
              color="red"
              class="full-width action-btn"
              size="lg"
              rounded
              @click="confirmAction('CANCELADO_C')"
            >
              <q-spinner-hourglass v-if="registering" color="white" size="24px" />
            </q-btn>
          </div>

          <!-- Modal de Confirmação -->
          <q-dialog v-model="showConfirm" persistent>
            <q-card class="dialog-card">
              <q-card-section class="row items-center">
                <q-avatar icon="warning" color="warning" text-color="white" />
                <span class="q-ml-sm">Tem certeza que deseja cancelar este pedido?</span>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Voltar" color="grey" v-close-popup />
                <q-btn flat label="Confirmar" color="red" @click="confirmClick" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>

        
      </q-page>
    </q-page-container>
    <!-- Footer Customizado -->
        <FooterC />
  </q-layout>
</template>

<script>
import { ref } from "vue";
import apiMethods from "src/router/api.js";
import store from "src/store/index.js";
import HeaderC from "components/store/HeaderC.vue";
import FooterC from "components/store/FooterC.vue";

export default {
  name: "PackageFormPage",
  components: {
    HeaderC,
    FooterC
  },
  data() {
    return {
      clickCount: 0,
      showConfirm: false,
      nextStatus: null,
      markers: [],
      mapHeight: "200px",
      statusFases: [
        { 
          id: 1, 
          nome: 'Preparando', 
          key: 'PREPARING', 
          completed: false,
          icon: 'inventory_2',
          color: 'orange'
        },
        { 
          id: 2, 
          nome: 'Despachado', 
          key: 'SHIPPED', 
          completed: false,
          icon: 'local_shipping',
          color: 'blue'
        },
        { 
          id: 3, 
          nome: 'Em Entrega', 
          key: 'DELIVERING', 
          completed: false,
          icon: 'directions_bike',
          color: 'purple'
        },
        { 
          id: 4, 
          nome: 'Entregue', 
          key: 'DELIVERED', 
          completed: false,
          icon: 'check_circle',
          color: 'green'
        }
      ],
      form: {
        sender: {
          name: "",
          apelido: "",
          telefone: "",
        },
        receiver: {
          name: "",
          apelido: "",
          telefone: "",
        },
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
        items: [],
      },
      item: {
        descricao: "",
        dimensoes: "",
        quantidade: "",
        images: [],
      },
      serviceOptions: ["DELIVER_MAN", "TRACK"],
      showItemsSection: false,
      carregando: true,
      registering: false,
      id: "",
      user: null,
    };
  },
  computed: {
    getUserComputed() {
      return store.state.user;
    },
  },
  watch: {
    'form.status': {
      handler(newStatus) {
        this.$nextTick(() => {
          this.atualizarStatusFases();
        });
      },
      immediate: true
    }
  },
  methods: {
    atualizarStatusFases() {
      const statusMap = {
        'RECEBIDO': 'PREPARING',
        'PUBLICO': 'PREPARING',
        'DESPACHADO': 'SHIPPED',
        'ENTREGANDO': 'DELIVERING',
        'ENTREGUE': 'DELIVERED'
      };

      const currentStatusKey = statusMap[this.form.status] || 'PREPARING';
      
      this.statusFases.forEach(fase => {
        fase.completed = false;
      });

      switch (currentStatusKey) {
        case 'DELIVERED':
          this.statusFases[3].completed = true;
        case 'DELIVERING':
          this.statusFases[2].completed = true;
        case 'SHIPPED':
          this.statusFases[1].completed = true;
        case 'PREPARING':
          this.statusFases[0].completed = true;
          break;
      }
    },

    isCurrentStep(fase, index) {
      const currentIndex = this.statusFases.findIndex(f => f.completed === false);
      return currentIndex === index;
    },

    getIconColor(fase, index) {
      if (fase.completed) {
        return 'text-white';
      }
      if (this.isCurrentStep(fase, index)) {
        return `text-${fase.color}`;
      }
      return 'text-grey-5';
    },

    getStatusDescription() {
      const statusTexts = {
        'RECEBIDO': 'Seu pedido está sendo preparado com cuidado',
        'PUBLICO': 'Aguardando entregador aceitar a entrega',
        'DESPACHADO': 'Pedido despachado e a caminho do centro de distribuição',
        'ENTREGANDO': 'Seu pedido está em rota de entrega!',
        'ENTREGUE': 'Pedido entregue com sucesso! Obrigado pela preferência'
      };
      return statusTexts[this.form.status] || 'Acompanhe o status do seu pedido';
    },

    getStatusColor(status) {
      const colors = {
        'RECEBIDO': 'blue',
        'PUBLICO': 'orange',
        'DESPACHADO': 'purple',
        'ENTREGANDO': 'primary',
        'ENTREGUE': 'green',
        'CANCELADO_C': 'red',
        'CANCELADO_A': 'red',
        'FALHA': 'red'
      };
      return colors[status] || 'grey';
    },

    getStatusText(status) {
      const texts = {
        'RECEBIDO': 'Pendente',
        'PUBLICO': 'Público',
        'DESPACHADO': 'Despachado',
        'ENTREGANDO': 'Em Entrega',
        'ENTREGUE': 'Entregue',
        'CANCELADO_C': 'Você Cancelou',
        'CANCELADO_A': 'Cancelado',
        'FALHA': 'O vendedor cancelou'
      };
      return texts[status] || status;
    },

    async aprovarCliente(item) {
      try {
        const response = await apiMethods.aprovarItemCliente(item.id, true);
        item.aprovado_cliente = true;
        this.$q.notify({ 
          type: "positive", 
          message: "Item aprovado com sucesso!",
          position: "top"
        });
      } catch (error) {
        this.$q.notify({ 
          type: "negative", 
          message: "Erro ao aprovar item",
          position: "top"
        });
      }
    },

    async RemoverCliente(item) {
      try {
        const response = await apiMethods.aprovarItemCliente(item.id, false);
        item.aprovado_cliente = false;
        this.$q.notify({ 
          type: "warning", 
          message: "Item removido",
          position: "top"
        });
      } catch (error) {
        this.$q.notify({ 
          type: "negative", 
          message: "Erro ao remover item",
          position: "top"
        });
      }
    },

    async aprovarVendedor(item) {
      try {
        const response = await apiMethods.aprovarItemVendedor(item.id, true);
        item.aprovado_vendedor = true;
        this.$q.notify({
          type: "positive",
          message: "Item aprovado com sucesso!",
          position: "top"
        });
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message: "Erro ao aprovar item",
          position: "top"
        });
      }
    },

    async RemoverVendedor(item) {
      try {
        const response = await apiMethods.aprovarItemVendedor(item.id, false);
        item.aprovado_vendedor = false;
        this.$q.notify({
          type: "warning",
          message: "Item removido",
          position: "top"
        });
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message: "Erro ao remover item",
          position: "top"
        });
      }
    },

    handleClick() {
      this.clickCount += 1;
      if (this.clickCount === 3) {
        this.entregarPackage();
        this.clickCount = 0;
      }
    },

    openChat(produto_id) {
      const id = this.$route.params.id;
      this.$router.push("/chat/" + this.form.empresa.user_id + "/" + produto_id);
    },

    voltar() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },

    handleClick2() {
      this.clickCount += 1;
      if (this.clickCount === 3) {
        this.atualizarStatusPedidoPersonalizado();
        this.clickCount = 0;
      }
    },

    getImageUrl(imageName) {
      return apiMethods.baseURL() + `/storage/product_images/${imageName.name}`;
    },

    getUser() {
      this.user = store.getters.user;
      return store.getters.user;
    },

    setUser(value) {
      store.commit("setUser", value);
    },

    formatarDataHora(data) {
      if (!data) return "";
      const date = new Date(data);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    },

    confirmAction(status) {
      this.nextStatus = status;
      this.showConfirm = true;
    },

    confirmClick() {
      this.showConfirm = false;
      this.cancelarPackage();
    },

    formatarData(data) {
      const dataObj = new Date(data);
      return dataObj.toLocaleDateString('pt-BR');
    },

    async fetchPackage(id) {
      this.getUser();

      try {
        const tipo = this.$route.params.tipo;
        if (!tipo) {
          return;
        }
        this.id = id;
        let response;
        if (tipo == "PEDIDO") {
          response = await apiMethods.getPedidoById(id);
        }
        if (tipo == "PACOTE") {
          response = await apiMethods.getPedidoPersonalizadoById(id);
        }

        this.form = response.data;

        this.form.horaDeLevantamento = new Date(this.form.hora_de_levantamento);
        this.form.horaDeEntrega = new Date(this.form.hora_de_entrega);

        this.$nextTick(() => {
          this.atualizarStatusFases();
        });

        this.carregando = false;
      } catch (error) {
        this.carregando = false;
        console.error("Erro ao buscar pacote:", error);
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message: "Erro ao buscar pacote. Por favor, tente novamente.",
          position: "top"
        });
      }
    },

    async atualizarStatusPedidoPersonalizado() {
      try {
        this.registering = true;
        const response = await apiMethods.atualizarStatusPedidoPersonalizado(
          this.id,
          { status: "ENTREGUE" }
        );
        this.form = response.data;

        this.form.horaDeLevantamento = new Date(this.form.hora_de_entrega);
        this.form.horaDeEntrega = new Date(this.form.hora_de_entrega);
        
        this.registering = false;
        this.$q.notify({
          type: "positive",
          message: "Entrega finalizada com sucesso!",
          position: "top"
        });
      } catch (error) {
        this.registering = false;
        console.error("Erro ao finalizar entrega:", error);
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message: "Erro ao finalizar entrega. Por favor, tente novamente.",
          position: "top"
        });
      }
    },

    async cancelarPackage() {
      try {
        this.registering = true;
        const response = await apiMethods.cancelarPedido(this.id);
        this.form = response.data;

        this.form.horaDeLevantamento = new Date(this.form.hora_de_entrega);
        this.form.horaDeEntrega = new Date(this.form.hora_de_entrega);
        
        this.registering = false;
        this.$q.notify({
          type: "positive",
          message: "Pedido cancelado com sucesso!",
          position: "top"
        });
      } catch (error) {
        this.registering = false;
        console.error("Erro ao cancelar pacote:", error);
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message: "Erro ao cancelar pedido. Por favor, tente novamente.",
          position: "top"
        });
      }
    },

    makeCall(telefone) {
      if (telefone) {
        window.location.href = `tel:${telefone}`;
      } else {
        this.$q.notify({
          message: "Número de telefone não disponível",
          type: "negative",
          position: "top"
        });
      }
    },

    sendSMS(telefone) {
      if (telefone) {
        window.location.href = `sms:${telefone}`;
      } else {
        this.$q.notify({
          message: "Número de telefone não disponível",
          type: "negative",
          position: "top"
        });
      }
    },

    isDelivering(status) {
      if (!this.user || !this.user.entregadores) return false;
      
      return (
        status != "CANCELADO_C" &&
        status != "CANCELADO_A" &&
        status != "PUBLICO" &&
        this.user.entregadores.length > 0 &&
        this.user.entregadores[0].id == this.form.entregador_id
      );
    },
  },
  beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      const { id } = to.params;
      await vm.fetchPackage(id);
    });
  },
};
</script>

<style scoped>
.ver-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

/* Botão Voltar FIXO */
.back-button-fixed {
  position: fixed;
  top: 70px;
  left: 16px;
  z-index: 1000;
}

.back-btn {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  color: #333;
}

.status-container {
  background: white;
  border-radius: 20px;
  margin: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.status-header {
  text-align: center;
}

.order-status-section {
  text-align: center;
}

.status-badge {
  font-size: 14px;
  font-weight: 600;
}

.status-tracker {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0 12px;
}

.status-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  z-index: 2;
}

.step-indicator {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

.step-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3px solid #e0e0e0;
  background: white;
  z-index: 2;
  position: relative;
}

.step-icon {
  transition: all 0.3s ease;
}

.completed-icon {
  animation: bounceIn 0.6s ease;
}

.step-connector {
  flex: 1;
  height: 4px;
  background: #e0e0e0;
  margin: 0 8px;
  border-radius: 2px;
  transition: all 0.4s ease;
}

.step-circle.orange {
  border-color: #ff9800;
}

.step-circle.blue {
  border-color: #2196f3;
}

.step-circle.purple {
  border-color: #9c27b0;
}

.step-circle.green {
  border-color: #4caf50;
}

.status-step.completed .step-circle {
  background: #bd6513;
  border-color: #bd6513;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(189, 101, 19, 0.3);
}

.status-step.completed .step-circle.orange {
  background: #ff9800;
  border-color: #ff9800;
}

.status-step.completed .step-circle.blue {
  background: #2196f3;
  border-color: #2196f3;
}

.status-step.completed .step-circle.purple {
  background: #9c27b0;
  border-color: #9c27b0;
}

.status-step.completed .step-circle.green {
  background: #4caf50;
  border-color: #4caf50;
}

.status-step.current .step-circle {
  background: white;
  transform: scale(1.15);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.status-step.current .step-circle .step-icon {
  animation: pulse-icon 2s infinite;
}

.status-step.future .step-circle {
  background: white;
  border-color: #e0e0e0;
}

.status-step.completed .step-connector {
  background: #bd6513;
}

.step-label {
  margin-top: 12px;
  text-align: center;
  min-height: 48px;
  width: 100%;
}

.current-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 6px;
  animation: fadeIn 0.5s ease;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  animation: pulse 1.5s infinite;
}

.pulse-dot.orange {
  background: #ff9800;
}

.pulse-dot.blue {
  background: #2196f3;
}

.pulse-dot.purple {
  background: #9c27b0;
}

.pulse-dot.green {
  background: #4caf50;
}

.info-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
  border: none;
}

.location-timeline {
  position: relative;
  padding: 20px 0;
}

.location-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.location-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.location-content {
  flex: 1;
}

.location-connector {
  width: 2px;
  height: 20px;
  background: #e0e0e0;
  margin-left: 15px;
  margin-bottom: 20px;
}

.contact-section {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #bd6513;
}

.contact-buttons {
  display: flex;
  gap: 8px;
}

.item-card {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
}

.item-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.approval-status {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.action-buttons {
  position: sticky;
  bottom: 0;
  background: white;
  padding-top: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  border-top: 1px solid #e0e0e0;
}

.action-btn {
  height: 56px;
  font-weight: 600;
  font-size: 16px;
}

.dialog-card {
  border-radius: 16px;
  max-width: 400px;
  width: 90vw;
}

.skeleton-container {
  padding-top: 60px;
}

.skeleton-card {
  border-radius: 16px;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}

@keyframes pulse-icon {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .back-button-fixed {
    top: 60px;
    left: 12px;
  }
  
  .status-tracker {
    padding: 0 8px;
  }
  
  .step-circle {
    width: 40px;
    height: 40px;
  }
  
  .step-icon {
    size: 14px;
  }
  
  .step-label .text-caption {
    font-size: 11px;
  }
  
  .status-container,
  .order-info-section,
  .items-section,
  .details-section {
    margin: 8px;
  }
}

@media (min-width: 768px) {
  .q-page-container {
    max-width: 768px;
    margin: 0 auto;
  }
  
  .status-container,
  .order-info-section,
  .items-section,
  .details-section {
    margin: 16px auto;
    max-width: 720px;
  }
}

@media (min-width: 1024px) {
  .q-page-container {
    max-width: 900px;
  }
  
  .status-container,
  .order-info-section,
  .items-section,
  .details-section {
    max-width: 850px;
  }
}
</style>