<template>
  <q-layout>
    <div class="bg-grey-2">
      <HeaderC />

      <!-- Filtros Dinâmicos -->
      <q-card class="q-mb-lg">
        <q-card-section>
          <div class="row items-center q-col-gutter-md">
            <div class="col-12 col-sm-3">
              <q-select
                v-model="filters.period"
                :options="periodOptions"
                label="Período"
                outlined
                dense
                @update:model-value="fetchData"
              />
            </div>
            <div class="col-12 col-sm-3">
              <q-select
                v-model="filters.source"
                :options="sourceOptions"
                label="Fonte de Tráfego"
                outlined
                dense
                @update:model-value="fetchData"
              />
            </div>
            <div class="col-12 col-sm-3">
              <q-select
                v-model="filters.seller"
                :options="sellerOptions"
                label="Seller"
                outlined
                dense
                @update:model-value="fetchData"
              />
            </div>
            <div class="col-12 col-sm-3">
              <q-select
                v-model="filters.category"
                :options="categoryOptions"
                label="Categoria"
                outlined
                dense
                @update:model-value="fetchData"
              />
            </div>
            <div class="col-12 col-sm-3">
              <q-btn
                color="primary"
                icon="fas fa-download"
                label="EXPORTAR RELATÓRIO"
                class="full-width"
                @click="exportReport"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Loading State -->
      <div v-if="loading" class="text-center q-pa-lg">
        <q-spinner-gears size="50px" color="primary" />
        <div class="q-mt-md">Carregando dados...</div>
      </div>

      <!-- Conteúdo Principal -->
      <div v-else>
        <!-- KPIs Principais -->
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-sm-2">
            <q-card class="metric-card">
              <q-card-section class="text-center">
                <div class="text-h4 text-weight-bold text-primary">
                  {{ dashboardData.acquisition.total_visits || 0 }}
                </div>
                <div class="text-caption text-grey-7">Total de Sessões</div>
                <q-badge color="primary" class="q-mt-sm">
                  <q-icon name="fas fa-arrow-up" />
                  {{ dashboardData.acquisition.visits_growth || 0 }}%
                </q-badge>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-2">
            <q-card class="metric-card">
              <q-card-section class="text-center">
                <div class="text-h4 text-weight-bold text-primary">
                  {{ dashboardData.acquisition.new_visitors || 0 }}
                </div>
                <div class="text-caption text-grey-7">Novos Visitantes</div>
                <q-badge color="primary" class="q-mt-sm">
                  <q-icon name="fas fa-arrow-up" />
                  {{ dashboardData.acquisition.new_visitors_growth || 0 }}%
                </q-badge>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-2">
            <q-card class="metric-card">
              <q-card-section class="text-center">
                <div class="text-h4 text-weight-bold text-primary">
                  {{ dashboardData.acquisition.new_users || 0 }}
                </div>
                <div class="text-caption text-grey-7">Novos Cadastros</div>
                <q-badge color="primary" class="q-mt-sm">
                  <q-icon name="fas fa-arrow-up" />
                  {{ dashboardData.acquisition.new_users_growth || 0 }}%
                </q-badge>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-2">
            <q-card class="metric-card">
              <q-card-section class="text-center">
                <div class="text-h4 text-weight-bold text-primary">
                  {{ dashboardData.acquisition.returning_visitors || 0 }}
                </div>
                <div class="text-caption text-grey-7">
                  Visitantes Recorrentes
                </div>
                <q-badge color="primary" class="q-mt-sm">
                  <q-icon name="fas fa-arrow-up" />
                  {{
                    dashboardData.acquisition.returning_visitors_growth || 0
                  }}%
                </q-badge>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-2">
            <q-card class="metric-card">
              <q-card-section class="text-center">
                <div class="text-h4 text-weight-bold text-primary">
                  {{ formatCurrency(dashboardData.revenue.total_revenue || 0) }}
                </div>
                <div class="text-caption text-grey-7">Receita Total</div>
                <q-badge color="primary" class="q-mt-sm">
                  <q-icon name="fas fa-arrow-up" />
                  {{ dashboardData.revenue.revenue_growth || 0 }}%
                </q-badge>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-2">
            <q-card class="metric-card">
              <q-card-section class="text-center">
                <div class="text-h4 text-weight-bold text-primary">
                  {{ dashboardData.acquisition.conversion_rate || 0 }}%
                </div>
                <div class="text-caption text-grey-7">Taxa de Conversão</div>
                <q-badge color="primary" class="q-mt-sm">
                  <q-icon name="fas fa-arrow-up" />
                  {{ dashboardData.acquisition.conversion_growth || 0 }}%
                </q-badge>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Abas de Análise -->
        <div class="row q-mb-lg">
          <div class="col-12">
            <q-card>
              <q-tabs
                v-model="activeTab"
                dense
                class="text-grey-7"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
              >
                <q-tab name="acquisition" label="Aquisição & Engajamento" />
                <q-tab name="sales" label="Vendas & Receita" />
                <q-tab name="marketing" label="Marketing & Performance" />
                <q-tab name="sellers" label="Seller Performance" />
                <q-tab name="satisfaction" label="Satisfação & Reputação" />
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="activeTab" animated>
                <!-- Aquisição & Engajamento -->
                <q-tab-panel name="acquisition">
                  <div class="row q-col-gutter-md">
                    <!-- Fontes de Tráfego -->
                    <div class="col-12 col-lg-6">
                      <q-card>
                        <q-card-section>
                          <div class="text-h6 text-primary">
                            Fontes de Tráfego
                          </div>
                          <div class="row q-mt-md">
                            <!-- Gráfico de Rosca para Fontes -->
                            <div class="col-12 col-md-5">
                              <div class="chart-container">
                                <canvas ref="sourcesChart"></canvas>
                              </div>
                            </div>
                            <!-- Lista de Fontes -->
                            <div class="col-12 col-md-7">
                              <div class="q-gutter-y-sm">
                                <div
                                  v-for="source in dashboardData.acquisition
                                    .sources"
                                  :key="source.utm_source"
                                  class="row items-center q-pa-xs"
                                >
                                  <q-icon
                                    :name="getSourceIcon(source.utm_source)"
                                    size="16px"
                                    class="q-mr-sm"
                                    :color="getSourceColor(source.utm_source)"
                                  />
                                  <div class="col">
                                    <div class="text-weight-medium">
                                      {{ source.utm_source || "Direto" }}
                                    </div>
                                    <div class="text-caption text-grey-7">
                                      {{ source.total }} visitas •
                                      {{ source.conversion_rate || 0 }}%
                                      conversão
                                    </div>
                                  </div>
                                  <div class="text-primary text-weight-bold">
                                    {{
                                      Math.round(
                                        (source.total /
                                          dashboardData.acquisition
                                            .total_visits) *
                                          100
                                      )
                                    }}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>

                    <!-- Acesso por Dispositivo - Layout Compacto com Altura Fixa -->
                    <!-- Acesso por Dispositivo - Layout Compacto com Altura Fixa -->
                    <div class="col-12 col-lg-6">
                      <q-card class="fixed-height-card">
                        <q-card-section>
                          <div class="text-h6 text-primary">
                            Acesso por Dispositivo
                          </div>

                          <!-- Gráfico de Barras Vertical para Dispositivos -->
                          <div class="chart-container-vertical">
                            <canvas ref="devicesBarChart"></canvas>
                          </div>

                          <!-- Lista Compacta de Dispositivos com Scroll -->
                          <div class="devices-list-container">
                            <div
                              v-for="device in dashboardData.devices.devices"
                              :key="device.device"
                              class="row items-center q-pa-xs device-item"
                            >
                              <q-icon
                                :name="getDeviceIcon(device.device)"
                                size="16px"
                                class="q-mr-sm"
                                color="primary"
                              />
                              <div class="col">
                                <div class="text-weight-medium">
                                  {{ device.total }} visitas
                                </div>
                                <div class="text-caption text-grey-7">
                                  {{ device.device || "Desconhecido" }}
                                </div>
                              </div>
                              <div class="text-caption text-grey-7">
                                {{
                                  Math.round(
                                    (device.total /
                                      dashboardData.acquisition.total_visits) *
                                      100
                                  )
                                }}%
                              </div>
                            </div>
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>

                    <!-- Visitas ao Longo do Tempo -->
                    <div class="col-12">
                      <q-card>
                        <q-card-section>
                          <div class="text-h6 text-primary">
                            Visitas ao Longo do Tempo
                          </div>
                          <div class="chart-container-large">
                            <canvas ref="visitsChart"></canvas>
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>
                </q-tab-panel>

                <!-- Vendas & Receita -->
                <q-tab-panel name="sales">
                  <div class="row q-col-gutter-md">
                    <!-- Métricas de Vendas -->
                    <div class="col-12 col-sm-4">
                      <q-card>
                        <q-card-section class="text-center">
                          <div class="text-h5 text-weight-bold text-primary">
                            {{
                              formatCurrency(
                                dashboardData.revenue.ticket_medium || 0
                              )
                            }}
                          </div>
                          <div class="text-caption">Ticket Médio</div>
                        </q-card-section>
                      </q-card>
                    </div>
                    <div class="col-12 col-sm-4">
                      <q-card>
                        <q-card-section class="text-center">
                          <div class="text-h5 text-weight-bold text-primary">
                            {{
                              dashboardData.revenue.gmv
                                ? formatCurrency(dashboardData.revenue.gmv)
                                : "N/A"
                            }}
                          </div>
                          <div class="text-caption">GMV</div>
                        </q-card-section>
                      </q-card>
                    </div>
                    <div class="col-12 col-sm-4">
                      <q-card>
                        <q-card-section class="text-center">
                          <div class="text-h5 text-weight-bold text-primary">
                            {{
                              dashboardData.revenue.repeat_purchase_rate || 0
                            }}%
                          </div>
                          <div class="text-caption">Taxa de Recompra</div>
                        </q-card-section>
                      </q-card>
                    </div>

                    <!-- Receita ao Longo do Tempo - Gráfico de Linha Profissional -->
                    <div class="col-12">
                      <q-card>
                        <q-card-section>
                          <div class="text-h6 text-primary">
                            Receita ao Longo do Tempo
                          </div>
                          <div class="chart-container-large">
                            <canvas ref="revenueLineChart"></canvas>
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>

                    <!-- Produtos Mais Vendidos -->
                    <div
                      class="col-12"
                      v-if="
                        dashboardData.engagement.most_visited_products?.length
                      "
                    >
                      <q-card>
                        <q-card-section>
                          <div class="text-h6 text-primary">
                            Produtos Mais Vendidos
                          </div>
                          <q-table
                            :rows="
                              dashboardData.engagement.most_visited_products
                            "
                            :columns="productColumns"
                            row-key="produto_id"
                            flat
                            bordered
                            @row-click="onProductRowClick"
                          />
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>
                </q-tab-panel>

                <!-- Marketing & Performance -->
                <q-tab-panel name="marketing">
                  <div class="row q-col-gutter-md">
                    <!-- Performance de Campanhas com Barras de Progresso -->
                    <div class="col-12">
                      <q-card>
                        <q-card-section>
                          <div class="text-h6 text-primary">
                            Performance de Campanhas
                          </div>
                          <div class="q-mt-md">
                            <div
                              v-for="campaign in dashboardData.marketing
                                .campaigns"
                              :key="campaign.utm_campaign"
                              class="q-mb-md"
                            >
                              <div class="row items-center q-mb-xs">
                                <div class="col">
                                  <div class="text-weight-medium">
                                    {{
                                      campaign.utm_campaign || "Sem Campanha"
                                    }}
                                  </div>
                                  <div class="text-caption text-grey-7">
                                    {{ campaign.visits }} visitas •
                                    {{ campaign.conversions }} conversões
                                  </div>
                                </div>
                                <div class="text-primary text-weight-bold">
                                  {{ campaign.conversion_rate || 0 }}%
                                </div>
                              </div>
                              <q-linear-progress
                                :value="(campaign.conversion_rate || 0) / 100"
                                :color="
                                  getProgressColor(
                                    campaign.conversion_rate || 0
                                  )
                                "
                                size="20px"
                              >
                                <div class="absolute-full flex flex-center">
                                  <span class="text-white text-caption"
                                    >{{ campaign.conversion_rate || 0 }}%</span
                                  >
                                </div>
                              </q-linear-progress>
                            </div>
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>

                    <!-- Gráfico de Rosca para Marketing -->
                    <!-- Fontes de Tráfego -->
                    <div class="col-12 col-lg-6">
                      <q-card>
                        <q-card-section>
                          <div class="text-h6 text-primary">
                            Fontes de Tráfego
                          </div>
                          <div class="row q-mt-md">
                            <!-- Gráfico de Rosca para Fontes -->
                            <div class="col-12 col-md-5">
                              <div class="chart-container-doughnut">
                                <!-- Usando o novo container -->
                                <canvas ref="sourcesChart"></canvas>
                              </div>
                            </div>
                            <!-- ... resto do código -->
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>

                    <!-- Gráfico de Rosca para Marketing -->
                    <div class="col-12 col-lg-6">
                      <q-card>
                        <q-card-section>
                          <div class="text-h6 text-primary">
                            Distribuição por Canal
                          </div>
                          <div class="chart-container-doughnut">
                            <!-- Usando o novo container -->
                            <canvas ref="marketingDoughnutChart"></canvas>
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>

                    <!-- Métricas de ROI -->
                    <div class="col-12 col-lg-6">
                      <q-card>
                        <q-card-section>
                          <div class="text-h6 text-primary">
                            Métricas de Marketing
                          </div>
                          <div class="q-gutter-y-md">
                            <div class="row items-center">
                              <div class="col">
                                <div class="text-weight-medium">ROAS</div>
                                <div class="text-caption text-grey-7">
                                  Retorno sobre investimento
                                </div>
                              </div>
                              <div class="text-primary text-weight-bold">
                                {{ dashboardData.marketing.roas || "N/A" }}
                              </div>
                            </div>
                            <div class="row items-center">
                              <div class="col">
                                <div class="text-weight-medium">CTR</div>
                                <div class="text-caption text-grey-7">
                                  Taxa de cliques
                                </div>
                              </div>
                              <div class="text-primary text-weight-bold">
                                {{ dashboardData.marketing.ctr || 0 }}%
                              </div>
                            </div>
                            <div class="row items-center">
                              <div class="col">
                                <div class="text-weight-medium">CPC</div>
                                <div class="text-caption text-grey-7">
                                  Custo por clique
                                </div>
                              </div>
                              <div class="text-primary text-weight-bold">
                                {{
                                  dashboardData.marketing.cpc
                                    ? formatCurrency(
                                        dashboardData.marketing.cpc
                                      )
                                    : "N/A"
                                }}
                              </div>
                            </div>
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>
                </q-tab-panel>

                <!-- Outras abas permanecem iguais -->
              </q-tab-panels>
            </q-card>
          </div>
        </div>

        <!-- Tabela Detalhada de Performance -->
        <div class="row">
          <div class="col-12">
            <q-card>
              <q-card-section>
                <div class="text-h6 text-primary">
                  Relatório Detalhado de Performance
                </div>
                <q-table
                  :rows="performanceDetails"
                  :columns="performanceColumns"
                  row-key="id"
                  flat
                  bordered
                  :pagination="pagination"
                >
                  <template v-slot:body-cell-conversion="props">
                    <q-td :props="props">
                      <q-linear-progress
                        :value="props.row.conversion / 100"
                        :color="getConversionColor(props.row.conversion)"
                        class="q-mt-xs"
                      />
                      <div class="text-caption text-center">
                        {{ props.row.conversion }}%
                      </div>
                    </q-td>
                  </template>

                  <template v-slot:body-cell-trend="props">
                    <q-td :props="props">
                      <q-badge
                        :color="props.row.trend > 0 ? 'positive' : 'negative'"
                      >
                        <q-icon
                          :name="
                            props.row.trend > 0
                              ? 'fas fa-arrow-up'
                              : 'fas fa-arrow-down'
                          "
                        />
                        {{ Math.abs(props.row.trend) }}%
                      </q-badge>
                    </q-td>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <FooterC />
    </div>
  </q-layout>
</template>

<script>
import apiMethods from "src/router/api.js";
import FooterC from "components/store/FooterC.vue";
import HeaderC from "components/store/HeaderC.vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "DashboardEcommercePage",
  components: {
    FooterC,
    HeaderC,
  },
  data() {
    return {
      activeTab: "acquisition",
      loading: false,
      charts: {},
      filters: {
        period: 30,
        source: null,
        seller: null,
        category: null,
      },
      periodOptions: [
        { label: "Últimos 7 dias", value: 7 },
        { label: "Últimos 30 dias", value: 30 },
        { label: "Últimos 90 dias", value: 90 },
      ],
      sourceOptions: [],
      sellerOptions: [],
      categoryOptions: [],
      dashboardData: {
        acquisition: {
          total_visits: 0,
          new_visitors: 0,
          new_users: 0,
          returning_visitors: 0,
          conversion_rate: 0,
          visits_growth: 0,
          new_visitors_growth: 0,
          new_users_growth: 0,
          returning_visitors_growth: 0,
          conversion_growth: 0,
          sessions_by_period: { day: [], week: [], month: [] },
          sources: [],
        },
        engagement: {
          most_visited_products: [],
          top_pages: [],
          bounce_rate: 0,
        },
        revenue: {
          total_revenue: 0,
          ticket_medium: 0,
          gmv: 0,
          repeat_purchase_rate: 0,
          revenue_growth: 0,
          revenue_by_period: [],
        },
        seller_performance: {
          active_sellers: 0,
          cancellation_rate: 0,
          seller_sales: [],
          top_products_by_seller: [],
        },
        satisfaction: {
          nps: 0,
          avg_product_rating: 0,
          complaints: 0,
        },
        devices: {
          devices: [],
          browsers: [],
        },
        marketing: {
          campaigns: [],
          roas: 0,
          ctr: 0,
          cpc: 0,
        },
      },
      // ... resto das colunas
    };
  },
  computed: {
    performanceDetails() {
      return (
        this.dashboardData.acquisition.sources?.map((source) => ({
          id: source.utm_source,
          source: source.utm_source || "Direto",
          sessions: source.total,
          conversion: source.conversion_rate || 0,
          revenue: source.revenue || 0,
          orders: source.orders || 0,
          trend: source.growth || 0,
        })) || []
      );
    },
  },
  methods: {
    exportReport() {
      console.log("Exportando relatório...");
      // Implementar lógica de exportação aqui
    },

    getProgressColor(percentage) {
      if (percentage >= 8) return "positive";
      if (percentage >= 4) return "primary";
      if (percentage >= 2) return "warning";
      return "negative";
    },

    getConversionColor(conversion) {
      if (conversion >= 5) return "positive";
      if (conversion >= 2) return "primary";
      if (conversion >= 1) return "warning";
      return "negative";
    },

    getDeviceColor(deviceType) {
      const colors = {
        desktop: "blue",
        mobile: "green",
        tablet: "orange",
        smartphone: "teal",
        pc: "indigo",
      };
      return colors[deviceType?.toLowerCase()] || "grey";
    },

    getSourceColor(source) {
      const colors = {
        google: "red",
        facebook: "blue",
        instagram: "pink",
        twitter: "light-blue",
        linkedin: "indigo",
        email: "orange",
      };
      return colors[source?.toLowerCase()] || "grey";
    },

    getDeviceIcon(device) {
      switch ((device || "").toLowerCase()) {
        case "desktop":
        case "pc":
          return "desktop_windows";
        case "mobile":
        case "smartphone":
          return "smartphone";
        case "tablet":
          return "tablet_android";
        default:
          return "devices";
      }
    },

    getSourceIcon(source) {
      switch ((source || "").toLowerCase()) {
        case "google":
          return "google";
        case "facebook":
        case "fb":
          return "facebook";
        case "instagram":
          return "camera_alt";
        case "twitter":
          return "twitter";
        case "linkedin":
          return "linkedin";
        case "email":
          return "email";
        default:
          return "public";
      }
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "MZN",
      }).format(value);
    },

    onProductRowClick(evt, row) {
      console.log("Produto clicado:", row);
    },

    onSellerRowClick(evt, row) {
      console.log("Seller clicado:", row);
    },

    // Inicializar gráficos
    initCharts() {
      this.initSourcesChart();
      this.initDevicesBarChart();
      this.initVisitsChart();
      this.initRevenueLineChart();
      this.initMarketingDoughnutChart();
    },

    initSourcesChart() {
      const ctx = this.$refs.sourcesChart;
      if (!ctx) return;

      if (this.charts.sources) {
        this.charts.sources.destroy();
      }

      const sources = this.dashboardData.acquisition.sources || [];
      if (sources.length === 0) return;

      this.charts.sources = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: sources.map((s) => s.utm_source || "Direto"),
          datasets: [
            {
              data: sources.map((s) => s.total),
              backgroundColor: [
                "#42A5F5",
                "#66BB6A",
                "#FFA726",
                "#EF5350",
                "#AB47BC",
                "#26A69A",
              ],
              borderWidth: 2,
              borderColor: "#fff",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const total = sources.reduce((sum, s) => sum + s.total, 0);
                  const percentage = ((context.parsed / total) * 100).toFixed(
                    1
                  );
                  return `${context.label}: ${context.parsed} visitas (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    },

    initDevicesBarChart() {
      const ctx = this.$refs.devicesBarChart;
      if (!ctx) return;

      if (this.charts.devicesBar) {
        this.charts.devicesBar.destroy();
      }

      const devices = this.dashboardData.devices.devices || [];
      if (devices.length === 0) return;

      this.charts.devicesBar = new Chart(ctx, {
        type: "bar",
        data: {
          labels: devices.map((d) => d.device || "Desconhecido"),
          datasets: [
            {
              label: "Visitas",
              data: devices.map((d) => d.total),
              backgroundColor: "#42A5F5",
              borderColor: "#1976D2",
              borderWidth: 1,
              borderRadius: 4,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          indexAxis: "x", // Barras verticais (padrão)
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `${context.parsed.y} visitas`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0,0,0,0.1)",
              },
              title: {
                display: true,
                text: "Número de Visitas",
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
      });
    },
    initVisitsChart() {
      const ctx = this.$refs.visitsChart;
      if (!ctx) return;

      if (this.charts.visits) {
        this.charts.visits.destroy();
      }

      const visitsData =
        this.dashboardData.acquisition.sessions_by_period?.day || [];
      if (visitsData.length === 0) return;

      this.charts.visits = new Chart(ctx, {
        type: "line",
        data: {
          labels: visitsData.map((d) => {
            const date = new Date(d.date);
            return date.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            });
          }),
          datasets: [
            {
              label: "Visitas",
              data: visitsData.map((d) => d.sessions),
              borderColor: "#42A5F5",
              backgroundColor: "rgba(66, 165, 245, 0.1)",
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0,0,0,0.1)",
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
      });
    },

    initRevenueLineChart() {
      const ctx = this.$refs.revenueLineChart;
      if (!ctx) return;

      if (this.charts.revenueLine) {
        this.charts.revenueLine.destroy();
      }

      // Usar dados reais da API para receita
      const revenueData = this.dashboardData.revenue.revenue_by_period || [];
      if (revenueData.length === 0) return;

      this.charts.revenueLine = new Chart(ctx, {
        type: "line",
        data: {
          labels: revenueData.map((d) => {
            const date = new Date(d.date);
            return date.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            });
          }),
          datasets: [
            {
              label: "Receita (MZN)",
              data: revenueData.map((d) => d.revenue),
              borderColor: "#FFA726",
              backgroundColor: "rgba(255, 167, 38, 0.1)",
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "#FFA726",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `Receita: ${this.formatCurrency(context.parsed.y)}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0,0,0,0.1)",
              },
              ticks: {
                callback: (value) => {
                  if (value >= 1000) {
                    return "MZN " + (value / 1000).toFixed(0) + "k";
                  }
                  return "MZN " + value;
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
      });
    },

    initMarketingDoughnutChart() {
      const ctx = this.$refs.marketingDoughnutChart;
      if (!ctx) return;

      if (this.charts.marketingDoughnut) {
        this.charts.marketingDoughnut.destroy();
      }

      const campaigns = this.dashboardData.marketing.campaigns || [];
      if (campaigns.length === 0) return;

      this.charts.marketingDoughnut = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: campaigns.map((c) => c.utm_campaign || "Sem Campanha"),
          datasets: [
            {
              data: campaigns.map((c) => c.conversion_rate || 0),
              backgroundColor: [
                "#42A5F5",
                "#66BB6A",
                "#FFA726",
                "#EF5350",
                "#AB47BC",
              ],
              borderWidth: 2,
              borderColor: "#fff",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const campaign = campaigns[context.dataIndex];
                  return `${context.label}: ${
                    campaign.conversion_rate || 0
                  }% (${campaign.conversions || 0} conversões)`;
                },
              },
            },
          },
        },
      });
    },

    async fetchData() {
      try {
        this.loading = true;
        const response = await apiMethods.getDashboard(this.filters);

        // Atualizar os dados com a resposta da API
        Object.assign(this.dashboardData, response.data);

        // Atualizar opções de filtros dinamicamente
        this.sourceOptions =
          this.dashboardData.acquisition.sources?.map((s) => ({
            label: s.utm_source || "Desconhecido",
            value: s.utm_source,
          })) || [];

        this.sellerOptions =
          this.dashboardData.seller_performance.seller_sales?.map((s) => ({
            label: s.empresa?.nome || "Desconhecido",
            value: s.empresa_id,
          })) || [];

        // Inicializar gráficos após os dados carregarem
        this.$nextTick(() => {
          this.initCharts();
        });
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        this.loading = false;
      }
    },
  },

  mounted() {
    this.fetchData();
  },

  beforeUnmount() {
    Object.values(this.charts).forEach((chart) => {
      if (chart) chart.destroy();
    });
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 250px; /* Aumentado de 200px para 250px */
  width: 100%;
}

.chart-container-vertical {
  position: relative;
  height: 200px;
  width: 100%;
  margin-bottom: 16px;
}

.chart-container-large {
  position: relative;
  height: 300px;
  width: 100%;
}

.chart-container-doughnut {
  position: relative;
  height: 380px; /* Novo container específico para gráficos de argola */
  width: 100%;
}

.fixed-height-card {
  height: 500px;
  display: flex;
  flex-direction: column;
}

.devices-list-container {
  flex: 1;
  overflow-y: auto;
  max-height: 200px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 8px;
}

.metric-card {
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.device-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 8px 4px;
}

.device-item:last-child {
  border-bottom: none;
}

.text-primary {
  color: #bd6513 !important;
}

/* Sobrescrevendo as cores do Quasar */
:deep(.q-btn--primary) {
  background-color: #bd6513 !important;
}

:deep(.q-btn--primary:hover) {
  background-color: #a8550e !important;
}

:deep(.text-primary) {
  color: #bd6513 !important;
}

:deep(.q-badge--primary) {
  background-color: #bd6513 !important;
}

:deep(.q-tab--active) {
  color: #bd6513 !important;
}

:deep(.q-tab__indicator) {
  background-color: #bd6513 !important;
}

:deep(.q-linear-progress__model) {
  background-color: #bd6513 !important;
}

/* Scroll personalizado */
.devices-list-container::-webkit-scrollbar {
  width: 6px;
}

.devices-list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.devices-list-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.devices-list-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
