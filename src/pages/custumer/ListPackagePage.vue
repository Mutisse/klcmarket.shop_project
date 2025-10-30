<template>
  <!-- Header para Mobile (mantido original) -->
  <div class="mobile-header">
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
        <q-toolbar-title> Pedidos </q-toolbar-title>
      </div>
      <div style="width: 56px"></div>
    </q-toolbar>
  </div>

  <!-- Conteúdo Mobile (mantido original) -->
  <div class="mobile-content">
    <div
      v-if="!showMap"
      class="flex1 flex-start1 q-pa-md full-height"
      style="background-color: #f2f2f5; margin-top: 60px; min-height: 100vh"
    >
      <div class="full-width">
        <!-- skeleton -->
        <q-card style="border-radius: 2rem" v-if="carregando">
          <q-item>
            <q-item-section avatar>
              <q-skeleton type="QAvatar" />
            </q-item-section>

            <q-item-section>
              <q-item-label>
                <q-skeleton type="text" />
              </q-item-label>
              <q-item-label caption>
                <q-skeleton type="text" />
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-skeleton height="40px" square />

          <q-card-actions align="right" class="q-gutter-md">
            <q-skeleton type="QBtn" />
            <q-skeleton type="QBtn" />
          </q-card-actions>
        </q-card>

        <transition
          appear
          enter-active-class="animated fadeIn slower delay-1s "
          leave-active-class="animated fadeOut"
        >
          <div>
            <div v-for="pacote in ListHistoryPackage" :key="pacote.id">
              <q-card
                class="bg-white q-card rounded q-mb-md"
                style="border-radius: 2rem"
                @click="verDetalhes(pacote.id, pacote.tipo)"
              >
                <div
                  class="row q-pt-xs text-center justify-between"
                  style="font-size: 9px"
                >
                  <div>
                    <div class="row text-center">
                      <q-btn
                        flat
                        color="orange"
                        class="q-mb-xs1 col-2"
                        icon="my_location"
                        size="8px"
                        @click="$router.push('/c/pack/' + pacote.id)"
                      />
                      <div class="text-overline12">
                        {{ pacote.origem }} -
                        <span
                          style="font-size: 9px"
                          class="text-overline text-weight-bold"
                        >
                          Recolha
                        </span>
                      </div>
                    </div>

                    <div class="row text-center">
                      <q-btn
                        flat
                        color="orange"
                        class="q-mb-xs1 col-2"
                        icon="place"
                        size="8px"
                        @click="$router.push('/c/pack/' + pacote.id)"
                      />
                      <div class="text-overline12">
                        {{ pacote.destino }} -
                        <span
                          style="font-size: 9px"
                          class="text-overline text-weight-bold"
                        >
                          Entrega
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="row q-my-auto text-center q-mr-md text-bold">
                    <span
                      v-if="pacote.status == 'PUBLICO'"
                      class="text-primary"
                      label=""
                      >Publico
                    </span>
                    <span
                      v-if="pacote.status == 'CANCELADO_C'"
                      class="text-orange"
                      >Voce Cancelou
                    </span>
                    <span v-if="pacote.status == 'FALHA'" class="text-red">
                      O vendedor cancelou
                    </span>
                    <span
                      v-if="pacote.status == 'CANCELADO_A'"
                      class="text-orange"
                      >Cancelado
                    </span>
                    <span
                      v-if="pacote.status == 'RECEBIDO'"
                      class="text-primary"
                      >Pendente
                    </span>
                    <span v-if="pacote.status == 'ENTREGUE'" class="text-green"
                      >Entregue
                    </span>
                  </div>
                </div>
              </q-card>
            </div>
            <div
              v-if="ListHistoryPackage.length == 0 && !carregando"
              class="text-subtitle2 text-center"
            >
              Ainda sem pedidos, sera notificado assim que pedidos esttiverem
              desponives.
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>

  <!-- Conteúdo Desktop (nova versão com paginação) -->
  <div class="desktop-container">
    <HeaderC />

    <div class="desktop-header">
      <div class="header-content">
        <div class="header-title">
          <q-btn
            flat
            round
            dense
            size="md"
            icon="arrow_back"
            @click="voltar"
            class="back-btn"
          />
          <h1>Meus Pedidos</h1>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ getTotalPedidos() }}</div>
            <div class="stat-label">Total de Pedidos</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ getPedidosEntregues() }}</div>
            <div class="stat-label">Entregues</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ getPedidosPendentes() }}</div>
            <div class="stat-label">Pendentes</div>
          </div>
        </div>
      </div>
    </div>

    <div class="desktop-content">
      <!-- Filtros -->
      <div class="filters-section">
        <div class="filter-group">
          <q-btn
            flat
            :color="filterStatus === 'all' ? 'primary' : 'grey-6'"
            label="Todos"
            @click="setFilterStatus('all')"
            class="filter-btn"
          />
          <q-btn
            flat
            :color="filterStatus === 'ENTREGUE' ? 'primary' : 'grey-6'"
            label="Entregues"
            @click="setFilterStatus('ENTREGUE')"
            class="filter-btn"
          />
          <q-btn
            flat
            :color="filterStatus === 'RECEBIDO' ? 'primary' : 'grey-6'"
            label="Pendentes"
            @click="setFilterStatus('RECEBIDO')"
            class="filter-btn"
          />
          <q-btn
            flat
            :color="filterStatus === 'canceled' ? 'primary' : 'grey-6'"
            label="Cancelados"
            @click="setFilterStatus('canceled')"
            class="filter-btn"
          />
        </div>

        <div class="search-group">
          <q-input
            v-model="searchQuery"
            placeholder="Buscar pedidos..."
            dense
            outlined
            class="search-input"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="carregando" class="loading-state">
        <div class="skeleton-grid">
          <q-card v-for="n in 6" :key="n" class="skeleton-card">
            <q-item>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" />
              </q-item-section>
              <q-item-section>
                <q-skeleton type="text" width="60%" />
                <q-skeleton type="text" width="40%" />
              </q-item-section>
            </q-item>
            <q-skeleton height="80px" square />
            <q-card-actions>
              <q-skeleton type="QBtn" />
              <q-skeleton type="QBtn" />
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <!-- Grid de Pedidos com Paginação -->
      <div v-else class="orders-container">
        <!-- Controles de Paginação - Topo -->
        <div class="pagination-controls top-controls">
          <div class="pagination-info">
            Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ totalFilteredOrders }} pedidos
          </div>
          <div class="pagination-buttons">
            <q-btn
              flat
              round
              dense
              icon="chevron_left"
              :disabled="currentPage === 0"
              @click="previousPage"
              class="pagination-btn"
              title="Página anterior"
            />
            <div class="page-indicator">
              Página {{ currentPage + 1 }} de {{ totalPages }}
            </div>
            <q-btn
              flat
              round
              dense
              icon="chevron_right"
              :disabled="currentPage >= totalPages - 1"
              @click="nextPage"
              class="pagination-btn"
              title="Próxima página"
            />
          </div>
        </div>

        <!-- Grid de Pedidos -->
        <transition-group name="list-fade" tag="div" class="orders-grid">
          <q-card
            v-for="pacote in paginatedOrders"
            :key="pacote.id"
            class="order-card"
            @click="verDetalhes(pacote.id, pacote.tipo)"
          >
            <div class="card-header">
              <div class="order-info">
                <div class="order-id">Pedido #{{ formatOrderId(pacote.id) }}</div>
                <div class="order-date">{{ formatDate(pacote.created_at) }}</div>
              </div>
              <div class="status-badge" :class="getStatusClass(pacote.status)">
                {{ getStatusText(pacote.status) }}
              </div>
            </div>

            <div class="route-section">
              <div class="route-point">
                <div class="point-icon start">
                  <q-icon name="play_arrow" />
                </div>
                <div class="point-details">
                  <div class="point-label">Ponto de Recolha</div>
                  <div class="point-address">{{ pacote.origem }}</div>
                </div>
              </div>

              <div class="route-line"></div>

              <div class="route-point">
                <div class="point-icon end">
                  <q-icon name="place" />
                </div>
                <div class="point-details">
                  <div class="point-label">Ponto de Entrega</div>
                  <div class="point-address">{{ pacote.destino }}</div>
                </div>
              </div>
            </div>

            <q-separator class="card-separator" />

            <div class="card-footer">
              <div class="order-meta">
                <div class="meta-item" v-if="pacote.valor">
                  <q-icon name="payments" size="16px" />
                  <span>{{ formatCurrency(pacote.valor) }}</span>
                </div>
                <div class="meta-item">
                  <q-icon name="schedule" size="16px" />
                  <span>{{ formatTime(pacote.created_at) }}</span>
                </div>
              </div>

              <div class="card-actions">
                <q-btn
                  flat
                  color="primary"
                  icon="visibility"
                  label="Ver Detalhes"
                  @click.stop="verDetalhes(pacote.id, pacote.tipo)"
                  class="action-btn"
                />
                <q-btn
                  v-if="canCancel(pacote.status)"
                  flat
                  color="red"
                  icon="cancel"
                  label="Cancelar"
                  @click.stop="cancelPackage(pacote.id)"
                  class="action-btn"
                />
              </div>
            </div>
          </q-card>
        </transition-group>

        <!-- Controles de Paginação - Rodapé -->
        <div class="pagination-controls bottom-controls">
          <div class="pagination-buttons">
            <q-btn
              flat
              round
              dense
              icon="first_page"
              :disabled="currentPage === 0"
              @click="goToPage(0)"
              class="pagination-btn"
              title="Primeira página"
            />
            <q-btn
              flat
              round
              dense
              icon="chevron_left"
              :disabled="currentPage === 0"
              @click="previousPage"
              class="pagination-btn"
              title="Página anterior"
            />
            
            <!-- Indicadores de página -->
            <div class="page-indicators">
              <q-btn
                v-for="page in visiblePages"
                :key="page"
                flat
                dense
                :color="currentPage === page - 1 ? 'primary' : 'grey-6'"
                @click="goToPage(page - 1)"
                class="page-indicator-btn"
                :class="{ active: currentPage === page - 1 }"
              >
                {{ page }}
              </q-btn>
            </div>

            <q-btn
              flat
              round
              dense
              icon="chevron_right"
              :disabled="currentPage >= totalPages - 1"
              @click="nextPage"
              class="pagination-btn"
              title="Próxima página"
            />
            <q-btn
              flat
              round
              dense
              icon="last_page"
              :disabled="currentPage >= totalPages - 1"
              @click="goToPage(totalPages - 1)"
              class="pagination-btn"
              title="Última página"
            />
          </div>

          <!-- Seletor de itens por página -->
          <div class="items-per-page">
            <span>Mostrar:</span>
            <q-select
              v-model="itemsPerPage"
              :options="itemsPerPageOptions"
              dense
              outlined
              class="items-per-page-select"
              @update:model-value="resetToFirstPage"
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!carregando && filteredOrders.length === 0"
        class="empty-state"
      >
        <div class="empty-icon">
          <q-icon name="inbox" size="80px" color="grey-4" />
        </div>
        <div class="empty-title">Nenhum pedido encontrado</div>
        <div class="empty-subtitle">
          {{ getEmptyStateMessage() }}
        </div>
        <q-btn
          color="primary"
          label="Explorar Marketplace"
          @click="$router.push('/')"
          class="empty-action-btn"
        />
      </div>
    </div>

    <FooterC />
  </div>
</template>

<script>
import { format } from "date-fns";
import apiMethods from "src/router/api.js";
import { useRoute } from "vue-router";
import store from "src/store/index.js";
import FooterC from "components/store/FooterC.vue";
import HeaderC from "components/store/HeaderC.vue";

export default {
  name: "ListPackageFormPage",
  components: {
    FooterC,
    HeaderC,
  },
  data() {
    return {
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
      ListPackage: [],
      ListHistoryPackage: [],
      markers: [],
      activeTab: "recentes",
      filterStatus: "all",
      searchQuery: "",
      
      // Novas variáveis para paginação
      currentPage: 0,
      itemsPerPage: 6,
      itemsPerPageOptions: [3, 6, 9, 12, 15],
    };
  },
  computed: {
    showMap() {
      return store.state.showMap;
    },
    filteredOrders() {
      let filtered = this.ListHistoryPackage;

      // Filtro por status
      if (this.filterStatus !== "all") {
        if (this.filterStatus === "canceled") {
          filtered = filtered.filter(
            (p) =>
              p.status === "CANCELADO_C" ||
              p.status === "CANCELADO_A" ||
              p.status === "FALHA"
          );
        } else {
          filtered = filtered.filter((p) => p.status === this.filterStatus);
        }
      }

      // Filtro por busca
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter((p) => {
          const origem = p.origem?.toLowerCase() || "";
          const destino = p.destino?.toLowerCase() || "";
          const id = this.formatOrderId(p.id).toLowerCase();

          return (
            origem.includes(query) ||
            destino.includes(query) ||
            id.includes(query)
          );
        });
      }

      return filtered;
    },
    
    // Novas computed properties para paginação
    totalFilteredOrders() {
      return this.filteredOrders.length;
    },
    
    totalPages() {
      return Math.ceil(this.totalFilteredOrders / this.itemsPerPage);
    },
    
    startIndex() {
      return this.currentPage * this.itemsPerPage;
    },
    
    endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.totalFilteredOrders);
    },
    
    paginatedOrders() {
      return this.filteredOrders.slice(this.startIndex, this.endIndex);
    },
    
    visiblePages() {
      const pages = [];
      const total = this.totalPages;
      const current = this.currentPage + 1;
      
      // Mostrar até 5 páginas
      let start = Math.max(1, current - 2);
      let end = Math.min(total, start + 4);
      
      // Ajustar se estiver perto do final
      if (end - start < 4) {
        start = Math.max(1, end - 4);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    }
  },
  watch: {
    filterStatus() {
      this.resetToFirstPage();
    },
    searchQuery() {
      this.resetToFirstPage();
    }
  },
  methods: {
    toggleMap() {
      store.mutations.toggleMap;
    },
    voltar() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },
    async ListHistoryPackages() {
      try {
        this.registering = true;
        const response = await apiMethods.getHistoricoPedidosPersonalizados();
        this.ListHistoryPackage = response.data;
        console.log("Pedidos carregados:", this.ListHistoryPackage);
        this.carregando = false;
      } catch (error) {
        this.registering = false;
        console.error("Erro ao carregar pedidos:", error);
      }
    },
    verDetalhes(id, tipo) {
      this.$router.push({ path: `/c/show-packs/${id}/${tipo}` });
    },
    async cancelPackage(id) {
      try {
        this.registering = true;
        await apiMethods.atualizarStatusPedidoPersonalizado(id, {
          status: "CANCELADO_C",
        });
        this.ListHistoryPackages();
        this.$q.notify({
          color: "green",
          textColor: "white",
          icon: "check_circle",
          message: "Pedido cancelado com sucesso.",
        });
      } catch (error) {
        this.registering = false;
        console.error("Erro ao cancelar pacote:", error);
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message: "Erro ao cancelar pedido. Por favor, tente novamente.",
        });
      }
    },
    formatDate(date) {
      if (!date) return "Data não disponível";
      try {
        return format(new Date(date), "dd/MM/yyyy");
      } catch {
        return "Data inválida";
      }
    },
    formatTime(date) {
      if (!date) return "Hora não disponível";
      try {
        return format(new Date(date), "HH:mm");
      } catch {
        return "Hora inválida";
      }
    },
    formatCurrency(value) {
      if (!value) return "N/A";
      try {
        return new Intl.NumberFormat("pt-MZ", {
          style: "currency",
          currency: "MZN",
        }).format(value);
      } catch {
        return "Valor inválido";
      }
    },
    formatOrderId(id) {
      if (!id) return "N/A";

      // Se for string, tenta pegar os últimos 6 caracteres
      if (typeof id === "string") {
        return id.slice(-6);
      }

      // Se for número, converte para string
      if (typeof id === "number") {
        return id.toString().slice(-6);
      }

      // Se for objeto, tenta stringify ou usa um valor padrão
      try {
        return JSON.stringify(id).slice(-6);
      } catch {
        return "ID-" + Math.random().toString(36).substr(2, 6);
      }
    },
    isCanceled(status) {
      return status === "CANCELADO_C" || status === "CANCELADO_A";
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    setFilterStatus(status) {
      this.filterStatus = status;
    },
    getStatusClass(status) {
      const statusMap = {
        PUBLICO: "public",
        RECEBIDO: "pending",
        ENTREGUE: "delivered",
        CANCELADO_C: "cancelled",
        CANCELADO_A: "cancelled",
        FALHA: "failed",
      };
      return statusMap[status] || "pending";
    },
    getStatusText(status) {
      const statusTextMap = {
        PUBLICO: "Público",
        RECEBIDO: "Pendente",
        ENTREGUE: "Entregue",
        CANCELADO_C: "Cancelado",
        CANCELADO_A: "Cancelado",
        FALHA: "Falhou",
      };
      return statusTextMap[status] || status;
    },
    canCancel(status) {
      return status === "PUBLICO" || status === "RECEBIDO";
    },
    getTotalPedidos() {
      return this.ListHistoryPackage?.length || 0;
    },
    getPedidosEntregues() {
      return (
        this.ListHistoryPackage?.filter((p) => p.status === "ENTREGUE")
          .length || 0
      );
    },
    getPedidosPendentes() {
      return (
        this.ListHistoryPackage?.filter(
          (p) => p.status === "RECEBIDO" || p.status === "PUBLICO"
        ).length || 0
      );
    },
    getEmptyStateMessage() {
      if (this.filterStatus !== "all" || this.searchQuery) {
        return "Nenhum pedido corresponde aos filtros aplicados.";
      }
      return "Ainda não possui pedidos. Será notificado quando novos pedidos estiverem disponíveis.";
    },
    
    // Novos métodos para paginação
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
      }
    },
    
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    },
    
    goToPage(page) {
      if (page >= 0 && page < this.totalPages) {
        this.currentPage = page;
      }
    },
    
    resetToFirstPage() {
      this.currentPage = 0;
    }
  },
  mounted() {
    this.ListHistoryPackages();
  },
  setup() {
    const route = useRoute();
    return {
      route,
    };
  },
};
</script>

<style scoped>
/* Esconder conteúdo desktop em mobile */
@media (max-width: 768px) {
  .desktop-container {
    display: none;
  }
  .mobile-content {
    display: block;
  }
}

/* Esconder conteúdo mobile em desktop */
@media (min-width: 769px) {
  .mobile-header,
  .mobile-content {
    display: none;
  }
  .desktop-container {
    display: block;
  }
}

/* Desktop Styles */
.desktop-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.desktop-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 24px 0;
  margin-top: 80px; /* Espaço para o HeaderC fixo */
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-title h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
}

.back-btn {
  color: #bd6513;
}

.header-stats {
  display: flex;
  gap: 32px;
  color: #bd6513;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #bd6513;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #718096;
}

.desktop-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.filter-group {
  display: flex;
  gap: 8px;
}

.filter-btn {
  border-radius: 20px;
  font-weight: 500;
}

.filter-btn.q-btn--flat:not(.q-btn--round) {
  color: #718096;
}

.filter-btn.q-btn--flat:not(.q-btn--round).text-primary {
  color: #bd6513;
  background: rgba(189, 101, 19, 0.1);
}

.search-group {
  width: 300px;
}

.search-input {
  border-radius: 20px;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.order-card {
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  cursor: pointer;
  background: white;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-color: #bd6513;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.order-info {
  flex: 1;
}

.order-id {
  font-size: 16px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 4px;
}

.order-date {
  font-size: 14px;
  color: #718096;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.public {
  background: rgba(189, 101, 19, 0.1);
  color: #bd6513;
}

.status-badge.pending {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.status-badge.delivered {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.status-badge.cancelled {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.status-badge.failed {
  background: rgba(253, 126, 20, 0.1);
  color: #fd7e14;
}

.route-section {
  position: relative;
  margin: 20px 0;
}

.route-point {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.point-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
}

.point-icon.start {
  background: #bd6513;
  color: white;
}

.point-icon.end {
  background: #d97c1a;
  color: white;
}

.point-details {
  flex: 1;
}

.point-label {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 4px;
}

.point-address {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  line-height: 1.4;
}

.route-line {
  position: absolute;
  left: 16px;
  top: 32px;
  bottom: 32px;
  width: 2px;
  background: linear-gradient(to bottom, #bd6513, #d97c1a);
  z-index: 1;
}

.card-separator {
  margin: 20px -24px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.order-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #718096;
}

.meta-item:first-child {
  color: #28a745;
  font-weight: 600;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  border-radius: 8px;
  font-weight: 500;
}

.action-btn.text-primary {
  color: #bd6513;
}

/* Loading State */
.loading-state {
  padding: 40px 0;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 24px;
}

.skeleton-card {
  border-radius: 16px;
  padding: 24px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.empty-icon {
  margin-bottom: 24px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
}

.empty-subtitle {
  font-size: 16px;
  color: #718096;
  margin-bottom: 24px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
}

.empty-action-btn {
  border-radius: 20px;
  padding: 8px 24px;
  background: #bd6513;
  color: white;
}

.empty-action-btn:hover {
  background: #a3560f;
}

/* Novos estilos para paginação */
.orders-container {
  margin-bottom: 32px;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.pagination-controls.top-controls {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom: 1px solid #e9ecef;
}

.pagination-controls.bottom-controls {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: 1px solid #e9ecef;
  margin-top: 24px;
}

.pagination-info {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
}

.pagination-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  color: #bd6513;
  transition: all 0.3s ease;
}

.pagination-btn:disabled {
  color: #cbd5e0;
  cursor: not-allowed;
}

.pagination-btn:hover:not(:disabled) {
  background: rgba(189, 101, 19, 0.1);
  transform: scale(1.1);
}

.page-indicator {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
  margin: 0 12px;
}

.page-indicators {
  display: flex;
  gap: 4px;
  margin: 0 12px;
}

.page-indicator-btn {
  min-width: 36px;
  height: 36px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.page-indicator-btn.active {
  background: #bd6513;
  color: white;
}

.page-indicator-btn:hover:not(.active) {
  background: rgba(189, 101, 19, 0.1);
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #718096;
}

.items-per-page-select {
  width: 80px;
}

.items-per-page-select :deep(.q-field__control) {
  border-radius: 8px;
  height: 32px;
  min-height: 32px;
}

/* Ajustes responsivos */
@media (max-width: 768px) {
  .pagination-controls {
    flex-direction: column;
    gap: 16px;
  }
  
  .page-indicators {
    margin: 0 8px;
  }
  
  .page-indicator-btn {
    min-width: 32px;
    height: 32px;
    font-size: 12px;
  }
}

/* Ajuste no grid para melhor responsividade */
.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  min-height: 400px;
}

@media (max-width: 1200px) {
  .orders-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}

@media (max-width: 768px) {
  .orders-grid {
    grid-template-columns: 1fr;
  }
}

/* Ajustes para cores primárias */
:deep(.text-primary) {
  color: #bd6513 !important;
}

:deep(.q-btn--flat.text-primary) {
  color: #bd6513 !important;
}

:deep(.q-btn--standard.q-btn--text-primary) {
  color: #bd6513 !important;
}

/* Animations */
.list-fade-enter-active,
.list-fade-leave-active {
  transition: all 0.5s ease;
}

.list-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

<style>
.q-btn[disabled] {
  opacity: 0.5;
}

/* Aplicar cor primária global */
.text-primary {
  color: #bd6513 !important;
}

.q-btn--standard.text-primary,
.q-btn--flat.text-primary {
  color: #bd6513 !important;
}
</style>