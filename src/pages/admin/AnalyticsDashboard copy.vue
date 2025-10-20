```vue
<!-- src/views/Dashboard.vue -->
<template>
  <q-page class="q-pa-md">
    <!-- Filtros -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row q-gutter-md">
          <q-select
            v-model="filters.period"
            :options="periodOptions"
            label="Período"
            style="width: 200px"
            @update:model-value="fetchData"
          />
          <q-select
            v-model="filters.source"
            :options="sourceOptions"
            label="Fonte"
            style="width: 200px"
            @update:model-value="fetchData"
          />
          <q-select
            v-model="filters.seller"
            :options="sellerOptions"
            label="Seller"
            style="width: 200px"
            @update:model-value="fetchData"
          />
          <q-select
            v-model="filters.category"
            :options="categoryOptions"
            label="Categoria"
            style="width: 200px"
            @update:model-value="fetchData"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- KPIs -->
    <div class="row q-gutter-md q-mb-md">
      <q-card class="col">
        <q-card-section>
          <div class="text-h6">Total de Visitas</div>
          <div class="text-subtitle1">{{ dashboardData?.acquisition.total_visits }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col">
        <q-card-section>
          <div class="text-h6">Usuários Únicos</div>
          <div class="text-subtitle1">{{ dashboardData?.acquisition.unique_users }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col">
        <q-card-section>
          <div class="text-h6">Novos Usuários</div>
          <div class="text-subtitle1">{{ dashboardData?.acquisition.new_users }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col">
        <q-card-section>
          <div class="text-h6">Receita Total</div>
          <div class="text-subtitle1">{{ formatCurrency( dashboardData?.revenue.total_revenue) }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col">
        <q-card-section>
          <div class="text-h6">Taxa de Conversão</div>
          <div class="text-subtitle1">{{ dashboardData?.acquisition.conversion_rate }}%</div>
        </q-card-section>
      </q-card>
      <q-card class="col">
        <q-card-section>
          <div class="text-h6">NPS</div>
          <div class="text-subtitle1">{{ dashboardData?.satisfaction?.nps  }}</div>
        </q-card-section>
      </q-card>
      <q-card class="col">
        <q-card-section>
          <div class="text-h6">Bounce Rate</div>
          <div class="text-subtitle1">{{ dashboardData?.acquisition.bounce_rate }}%</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Abas para Dashboards -->
    <q-tabs v-model="activeTab" class="q-mb-md">
      <q-tab name="acquisition" label="Aquisição & Engajamento" />
      <q-tab name="sales" label="Vendas & Receita" />
      <q-tab name="marketing" label="Marketing & Performance" />
      <q-tab name="sellers" label="Seller Performance" />
      <q-tab name="reputation" label="Satisfação & Reputação" />
    </q-tabs>

    <!-- Conteúdo das Abas -->
    <q-tab-panels v-model="activeTab" animated>
      <!-- Aquisição & Engajamento -->
      <q-tab-panel name="acquisition">
        <div class="row q-gutter-md">
          <!-- Gráfico de Visitas por Dia -->
          <q-card class="col">
            <q-card-section>
              <div class="text-h6">Visitas por Dia</div>
              <Chart type="bar" :data="visitsChartData" />
            </q-card-section>
          </q-card>
          <!-- Gráfico de Fontes -->
          <q-card class="col">
            <q-card-section>
              <div class="text-h6">Fontes de Tráfego</div>
              <Chart type="pie" :data="sourcesChartData" />
            </q-card-section>
          </q-card>
          <!-- Gráfico de Dispositivos -->
          <q-card class="col">
            <q-card-section>
              <div class="text-h6">Dispositivos</div>
              <Chart type="pie" :data="devicesChartData" />
            </q-card-section>
          </q-card>
          <!-- Gráfico de Navegadores -->
          <q-card class="col">
            <q-card-section>
              <div class="text-h6">Navegadores</div>
              <Chart type="pie" :data="browsersChartData" />
            </q-card-section>
          </q-card>
        </div>
        <!-- Tabelas -->
        <div class="row q-gutter-md q-mt-md">
          <q-card class="col">
            <q-card-section>
              <div class="text-h6">Páginas Mais Visitadas</div>
              <q-table
                :rows=" dashboardData?.engagement.top_pages"
                :columns="pageColumns"
                row-key="path"
              />
            </q-card-section>
          </q-card>
          <q-card class="col">
            <q-card-section>
              <div class="text-h6">Produtos Mais Visitados</div>
              <q-table
                :rows=" dashboardData?.engagement.most_visited_products"
                :columns="productColumns"
                row-key="produto_id"
                @row-click="onProductRowClick"
              />
            </q-card-section>
          </q-card>
          <q-card class="col">
            <q-card-section>
              <div class="text-h6">Tempo Médio por Página</div>
              <q-table
                :rows=" dashboardData?.engagement.avg_time_on_page"
                :columns="timeOnPageColumns"
                row-key="path"
              />
            </q-card-section>
          </q-card>
        </div>
      </q-tab-panel>

      <!-- Vendas & Receita -->
      <q-tab-panel name="sales">
        <div class="row q-gutter-md">
          <!-- Gráfico de Receita -->
          <q-card class="col">
            <q-card-section>
              <div class="text-h6">Receita ao Longo do Tempo</div>
              <Chart type="line" :data="revenueChartData" />
            </q-card-section>
          </q-card>
          <!-- Gráfico de Ticket Médio -->
          <q-card class="col">
            <q-card-section>
              <div class="text-h6">Ticket Médio por Dia</div>
              <Chart type="line" :data="ticketMediumChartData" />
            </q-card-section>
          </q-card>
        </div>
        <!-- Tabela de Vendas -->
        <q-card class="q-mt-md">
          <q-card-section>
            <div class="text-h6">Vendas por Seller</div>
            <q-table
              :rows=" dashboardData?.seller_performance.seller_sales"
              :columns="sellerColumns"
              row-key="empresa_id"
              @row-click="onSellerRowClick"
            />
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Marketing & Performance -->
      <q-tab-panel name="marketing">
        <div class="row q-gutter-md">
          <!-- Gráfico de Campanhas -->
          <q-card class="col">
            <q-card-section>
              <div class="text-h6">Visitas por Campanha</div>
              <Chart type="bar" :data="campaignsChartData" />
            </q-card-section>
          </q-card>
          <!-- Gráfico de ROAS -->
          <q-card class="col">
            <q-card-section>
              <div class="text-h6">ROAS por Campanha</div>
              <Chart type="bar" :data="roasChartData" />
            </q-card-section>
          </q-card>
          <!-- Gráfico de CTR -->
          <q-card class="col">
            <q-card-section>
              <div class="text-h6">CTR por Campanha</div>
              <Chart type="bar" :data="ctrChartData" />
            </q-card-section>
          </q-card>
        </div>
        <!-- Tabela de Performance de Campanhas -->
        <q-card class="q-mt-md">
          <q-card-section>
            <div class="text-h6">Performance de Campanhas</div>
            <q-table
              :rows=" dashboardData?.marketing.campaigns"
              :columns="campaignColumns"
              row-key="utm_campaign"
            />
          </q-card-section>
        </q-card>
        <!-- Tabela de Investimento em Mídia -->
        <q-card class="q-mt-md">
          <q-card-section>
            <div class="text-h6">Investimento em Mídia por Canal</div>
            <q-table
              :rows=" dashboardData?.marketing.media_investment"
              :columns="mediaInvestmentColumns"
              row-key="utm_source"
            />
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Seller Performance -->
      <q-tab-panel name="sellers">
        <div class="row q-gutter-md">
          <q-card class="col">
            <q-card-section>
              <div class="text-h6">Desempenho dos Sellers</div>
              <q-table
                :rows=" dashboardData?.seller_performance.seller_sales"
                :columns="sellerColumns"
                row-key="empresa_id"
                @row-click="onSellerRowClick"
              />
            </q-card-section>
          </q-card>
          <q-card class="col">
            <q-card-section>
              <div class="text-h6">Produtos Mais Vendidos por Seller</div>
              <q-table
                :rows=" dashboardData?.seller_performance.top_products_by_seller"
                :columns="sellerProductColumns"
                row-key="produto_id"
              />
            </q-card-section>
          </q-card>
        </div>
        <!-- KPIs de Seller -->
        <div class="row q-gutter-md q-mt-md">
          <q-card class="col">
            <q-card-section>
              <div class="text-h6">Vendedores Ativos</div>
              <div class="text-subtitle1">{{ dashboardData?.seller_performance.active_sellers }}</div>
            </q-card-section>
          </q-card>
          <q-card class="col">
            <q-card-section>
              <div class="text-h6">Taxa de Cancelamento</div>
              <div class="text-subtitle1">{{ dashboardData?.seller_performance.cancellation_rate }}%</div>
            </q-card-section>
          </q-card>
          <q-card class="col">
            <q-card-section>
              <div class="text-h6">SLA de Entrega</div>
              <div class="text-subtitle1">{{ dashboardData?.seller_performance.avg_delivery_time  }} horas</div>
            </q-card-section>
          </q-card>
        </div>
      </q-tab-panel>

      <!-- Satisfação & Reputação -->
      <q-tab-panel name="reputation">
        <q-card>
          <q-card-section>
            <div class="text-h6">Satisfação & Reputação</div>
            <div class="text-subtitle1">NPS: {{ dashboardData?.satisfaction?.nps  }}</div>
            <div class="text-subtitle1">Avaliação Média: {{ dashboardData?.satisfaction.avg_product_rating  }}</div>
            <div class="text-subtitle1">Reclamações: {{ dashboardData?.satisfaction.complaints || 0 }}</div>
            <div class="text-subtitle1">Tempo Médio de Resolução: {{ dashboardData?.satisfaction.avg_resolution_time  }} horas</div>
            <div class="text-subtitle1">Taxa de Recompra após Reclamação: {{ dashboardData?.satisfaction.repeat_purchase_after_complaint_rate ||'0' }}%</div>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Mapa de Localização -->
    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6">Localização dos Usuários</div>
        <!-- <LMap :locations="locationsData" /> -->
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import apiMethods from 'src/router/api.js';
import { Chart } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, LineController, PointElement, LineElement } from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, LineController, PointElement, LineElement);

export default {
  name: 'DashboardPage',
  components: {
    Chart,
    // LMap: () => import('../../components/LMap.vue'),
  },
  data() {
    return {
      activeTab: 'acquisition',
      dashboardData: {
        acquisition: {
          total_visits: 0,
          unique_visits: 0,
          unique_users: 0,
          new_visitors: 0,
          returning_visitors: 0,
          sessions_by_period: { day: [], week: [], month: [] },
          bounce_rate: 0,
          new_users: 0,
          sources: [],
          utm_mediums: [],
          referers: [],
          cac: 0,
          conversion_rate: 0,
        },
        engagement: {
          most_visited_products: [],
          top_pages: [],
          avg_time_on_page: [],
          navigation_flow: [],
          avg_session_time: 0,
          cart_abandonment_rate: 0,
        },
        revenue: {
          total_revenue: 0,
          gmv: 0,
          ticket_medium: 0,
          ltv: 0,
          orders_per_buyer: 0,
          repeat_purchase_rate: 0,
        },
        seller_performance: {
          seller_sales: [],
          active_sellers: 0,
          top_products_by_seller: [],
          cancellation_rate: 0,
          avg_delivery_time: 0,
        },
        marketing: {
          campaigns: [],
          revenue_by_campaign: [],
          marketing_metrics: [],
          media_investment: [],
        },
        locations: [],
        satisfaction: {
          nps: null,
          avg_product_rating: null,
          complaints: 0,
          avg_resolution_time: null,
          repeat_purchase_after_complaint_rate: 0,
        },
        devices: {
          devices: [],
          browsers: [],
          os: [],
        },
        conversions: {
          total_conversions: 0,
          form_completions: 0,
          conversion_rate_by_utm: [],
        },
      },
      filters: {
        period: 30,
        source: null,
        seller: null,
        category: null,
      },
      periodOptions: [
        { label: 'Últimos 7 dias', value: 7 },
        { label: 'Últimos 30 dias', value: 30 },
        { label: 'Últimos 90 dias', value: 90 },
      ],
      sourceOptions: [],
      sellerOptions: [],
      categoryOptions: [],
      locationsData: [],
      productColumns: [
        { name: 'produto_id', label: 'ID', field: 'produto_id', sortable: true },
        { name: 'nome', label: 'Produto', field: row => row.produto?.nome, sortable: true },
        { name: 'total', label: 'Total Vendido', field: 'total', sortable: true },
      ],
      sellerColumns: [
        { name: 'empresa_id', label: 'ID', field: 'empresa_id', sortable: true },
        { name: 'nome', label: 'Seller', field: row => row.empresa?.nome, sortable: true },
        { name: 'total_orders', label: 'Pedidos', field: 'total_orders', sortable: true },
        { name: 'total_revenue', label: 'Receita', field: 'total_revenue', sortable: true, format: val => this.formatCurrency(val) },
      ],
      pageColumns: [
        { name: 'path', label: 'Página', field: 'path', sortable: true },
        { name: 'visits', label: 'Visitas', field: 'visits', sortable: true },
      ],
      timeOnPageColumns: [
        { name: 'path', label: 'Página', field: 'path', sortable: true },
        { name: 'avg_duration', label: 'Tempo Médio (segundos)', field: 'avg_duration', sortable: true, format: val => val },
      ],
      campaignColumns: [
        { name: 'utm_campaign', label: 'Campanha', field: 'utm_campaign', sortable: true },
        { name: 'visits', label: 'Visitas', field: 'visits', sortable: true },
        { name: 'conversions', label: 'Conversões', field: 'conversions', sortable: true },
        { name: 'conversion_rate', label: 'Taxa de Conversão (%)', field: 'conversion_rate', sortable: true, format: val => val },
      ],
      sellerProductColumns: [
        { name: 'empresa_id', label: 'Seller ID', field: row => row.pedido?.empresa_id, sortable: true },
        { name: 'seller', label: 'Seller', field: row => row.pedido?.empresa?.nome, sortable: true },
        { name: 'produto_id', label: 'Produto ID', field: 'produto_id', sortable: true },
        { name: 'produto', label: 'Produto', field: row => row.produto?.nome, sortable: true },
        { name: 'total', label: 'Total Vendido', field: 'total', sortable: true },
      ],
      mediaInvestmentColumns: [
        { name: 'utm_source', label: 'Canal', field: 'utm_source', sortable: true },
        { name: 'total_cost', label: 'Investimento', field: 'total_cost', sortable: true, format: val => this.formatCurrency(val) },
      ],
    };
  },
  computed: {
    visitsChartData() {
      return {
        labels: this. dashboardData?.acquisition.sessions_by_period?.day?.map(d => d.date),
        datasets: [{
          label: 'Visitas por Dia',
          data: this. dashboardData?.acquisition.sessions_by_period?.day?.map(d => d.sessions),
          backgroundColor: '#42A5F5',
        }],
      };
    },
    sourcesChartData() {
      return {
        labels: this. dashboardData?.acquisition?.sources?.map(s => s.utm_source || 'Desconhecido'),
        datasets: [{
          data: this. dashboardData?.acquisition?.sources?.map(s => s.total),
          backgroundColor: ['#42A5F5', '#66BB6A', '#EF5350', '#AB47BC', '#FFCA28'],
        }],
      };
    },
    devicesChartData() {
      return {
        labels: this. dashboardData?.devices.devices.map(d => d.device || 'Desconhecido'),
        datasets: [{
          data: this. dashboardData?.devices.devices.map(d => d.total),
          backgroundColor: ['#42A5F5', '#66BB6A', '#EF5350'],
        }],
      };
    },
    browsersChartData() {
      return {
        labels: this. dashboardData?.devices.browsers.map(b => b.browser || 'Desconhecido'),
        datasets: [{
          data: this. dashboardData?.devices.browsers.map(b => b.total),
          backgroundColor: ['#42A5F5', '#66BB6A', '#EF5350', '#AB47BC'],
        }],
      };
    },
    revenueChartData() {
      return {
        labels: this. dashboardData?.acquisition.sessions_by_period.day.map(d => d.date),
        datasets: [{
          label: 'Receita',
          data: this. dashboardData?.acquisition.sessions_by_period.day.map(() => Math.random() * 10000), // Substituir por dados reais
          borderColor: '#42A5F5',
          fill: false,
        }],
      };
    },
    ticketMediumChartData() {
      return {
        labels: this. dashboardData?.acquisition.sessions_by_period.day.map(d => d.date),
        datasets: [{
          label: 'Ticket Médio',
          data: this. dashboardData?.acquisition.sessions_by_period.day.map(() => Math.random() * 1000), // Substituir por dados reais
          borderColor: '#66BB6A',
          fill: false,
        }],
      };
    },
    campaignsChartData() {
      return {
        labels: this. dashboardData?.marketing.campaigns.map(c => c.utm_campaign || 'Sem Campanha'),
        datasets: [{
          label: 'Visitas por Campanha',
          data: this. dashboardData?.marketing.campaigns.map(c => c.visits),
          backgroundColor: '#66BB6A',
        }],
      };
    },
    roasChartData() {
      return {
        labels: this. dashboardData?.marketing.marketing_metrics.map(m => m.utm_campaign || 'Sem Campanha'),
        datasets: [{
          label: 'ROAS',
          data: this. dashboardData?.marketing.marketing_metrics.map(m => m.roas),
          backgroundColor: '#EF5350',
        }],
      };
    },
    ctrChartData() {
      return {
        labels: this. dashboardData?.marketing.marketing_metrics.map(m => m.utm_campaign || 'Sem Campanha'),
        datasets: [{
          label: 'CTR (%)',
          data: this. dashboardData?.marketing.marketing_metrics.map(m => m.ctr),
          backgroundColor: '#AB47BC',
        }],
      };
    },
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    },
    async fetchData() {
      try {
        const response = await apiMethods.getDashboard(this.filters);
        this.dashboardData = response.data;

        // Atualizar opções de filtros dinamicamente
        this.sourceOptions = this. dashboardData?.acquisition?.sources?.map(s => ({
          label: s.utm_source || 'Desconhecido',
          value: s.utm_source,
        }));
        this.sellerOptions = this. dashboardData?.seller_performance?.seller_sales?.map(s => ({
          label: s.empresa?.nome || 'Desconhecido',
          value: s.empresa_id,
        }));
        this.categoryOptions = []; // Implementar conforme necessário

        // Dados de localização para o mapa
        this.locationsData = this.dashboardData?.locations?.map(l => ({
          lat: l.lat,
          lng: l.lng,
          count: l.visits,
        }));
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      }
    },
    onProductRowClick(evt, row) {
      console.log('Produto clicado:', row);
    },
    onSellerRowClick(evt, row) {
      console.log('Seller clicado:', row);
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.q-card {
  min-height: 150px;
}
</style>
```
