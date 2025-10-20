<template>
  <!-- skeleton -->
  <div v-if="carregando" class="dashboard q-pt-lg">
    <!-- Visão Geral -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <!-- <div class="text-h6">Resumo das Entregas</div> -->
        <div class="row">
          <q-card class="col-4 q-pa-md">
            <q-card-section>
              <div class="text-subtitle1">Entregas Hoje</div>
              <div class="text-h5"><q-skeleton type="text" width="40%" /></div>
            </q-card-section>
          </q-card>
          <q-card class="col-4 q-pa-md">
            <q-card-section>
              <div class="text-subtitle1">Entregas Semanais</div>
              <div class="text-h5"><q-skeleton type="text" width="40%" /></div>
            </q-card-section>
          </q-card>
          <q-card class="col-4 q-pa-md">
            <q-card-section>
              <div class="text-subtitle1">Entregas Mensais</div>
              <div class="text-h5"><q-skeleton type="text" width="40%" /></div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>

    <div class="full-width">
      <q-card flat bordered class="q-mb-md row text-start full-width q-pa-md">
        <div class="balance col-12 q-pa-md">
          <div class="text-subtitle">Balanco total</div>
          <div class="text-h5 text-bold">
            <q-skeleton type="text" width="60%" height="60px" />
          </div>
        </div>

        <div class="row justify-around col-12 q-mb-md">
          <div class="q-card col-5 q-pa-xs bg-blue-2">
            <div class="text-subtitle">Saldo</div>
            <div class="text-h5 text-bold col-5">
              <q-skeleton type="text" width="60%" />
            </div>
          </div>
          <div class="q-card col-5 q-pa-xs bg-red-2">
            <div class="text-subtitle">Despesa</div>
            <div class="text-h5 text-bold col-5">
              <q-skeleton type="text" width="60%" />
            </div>
          </div>
        </div>

        <div class="row justify-around col-12">
          <div class="q-card col-5 q-pa-xs bg-blue-2">
            <div class="text-subtitle">Pedidos entregues</div>
            <div class="text-h5 text-bold col-5">
              <q-skeleton type="text" width="60%" />
            </div>
          </div>
          <div class="q-card col-5 q-pa-xs bg-red-2">
            <div class="text-subtitle">Pendentes</div>
            <div class="text-h5 text-bold col-5">
              <q-skeleton type="text" width="60%" />
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <!-- Histórico de Entregas -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Histórico de Entregas</div>
        <q-skeleton type="text" width="100%" height="400px" />
      </q-card-section>
    </q-card>

    <!-- Mensagens e Notificações -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Mensagens e Notificações</div>
        <q-list bordered>
          <q-item v-for="mensagem in mensagens" :key="mensagem.id">
            <q-item-section>
              <q-item-label
                ><q-skeleton type="text" width="100%" height="50px"
              /></q-item-label>
              <q-item-label caption
                ><q-skeleton type="text" width="60%"
              /></q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Suporte e Ajuda -->
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Suporte e Ajuda</div>
        <q-btn label="FAQ" icon="help" @click="abrirFAQ" />
        <q-btn
          label="Contato de Suporte"
          icon="support_agent"
          @click="abrirSuporte"
        />
      </q-card-section>
    </q-card>
  </div>

  <div style="margin-top: 50px" v-if="!carregando" class="dashboard">
    <!-- Visão Geral -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row">
          <q-card class="col-4 q-pa-md">
            <q-card-section>
              <div class="text-subtitle1">Entregas Hoje</div>
              <div class="text-h5">{{ entregasHoje }}</div>
            </q-card-section>
          </q-card>
          <q-card class="col-4 q-pa-md">
            <q-card-section>
              <div class="text-subtitle1">Entregas Semanais</div>
              <div class="text-h5">{{ entregasSemanais }}</div>
            </q-card-section>
          </q-card>
          <q-card class="col-4 q-pa-md">
            <q-card-section>
              <div class="text-subtitle1">Entregas Mensais</div>
              <div class="text-h5">{{ entregasMensais }}</div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>

    <div class="full-width">
      <q-card flat bordered class="q-mb-md row text-start full-width q-pa-md">
        <div class="row justify-between col-12 q-mb-md">
          <div class="balance col-6 q-pa-md">
            <div class="text-subtitle text-left">Balanço total</div>
            <div class="text-h5 text-bold text-left">
              {{ valorTotalVendido }} MT
            </div>
            <div class="text-subtitle text-green text-left">
              Valor Líquido:
              {{ valorTotalVendido - valorTotalVendido * 0.05 }} MT
            </div>
          </div>
          <div class="balance col-6 q-pa-md">
            <div class="text-subtitle text-right">Taxas Acumuladas:</div>
            <div class="text-h5 text-bold text-right">
              {{ (valorTotalVendido * 0.05).toFixed(2)  }} MT
            </div>
            <div
              @click="$router.push('/s/invoice')"
              v-if="valorTotalVendido > 0"
              class="text-subtitle text-green text-right"
            >
              Pagar
            </div>
          </div>
        </div>

        <div class="row justify-around col-12 q-mb-md">
          <div class="q-card col-5 q-pa-xs bg-blue-2">
            <div class="text-subtitle">Produtos Vendidos</div>
            <div class="text-h5 text-bold col-5">{{ numTotalProdutos }}</div>
          </div>
          <div class="q-card col-5 q-pa-xs bg-red-2">
            <div class="text-subtitle">Valor vendido</div>
            <div class="text-h5 text-bold col-5">
              {{ valorTotalVendido }} MT
            </div>
          </div>
        </div>

        <div class="row justify-around col-12">
          <div class="q-card col-5 q-pa-xs bg-blue-2">
            <div class="text-subtitle">Pedidos entregues</div>
            <div class="text-h5 text-bold col-5">
              {{ total_pedidos_entregues }}
            </div>
          </div>
          <div class="q-card col-5 q-pa-xs bg-red-2">
            <div class="text-subtitle">Pedidos pendentes</div>
            <div class="text-h5 text-bold col-5">
              {{ total_pedidos_pendentes }}
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <q-select
      v-model="period"
      :options="periodOptions"
      label="Período"
      v-if="false"
    />

    <!-- Histórico de Entregas -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Histórico de Entregas</div>
        <apexchart
          type="line"
          height="350"
          :options="historicoOptions"
          :series="historicoSeries"
        />
      </q-card-section>
    </q-card>

    <!-- Mensagens e Notificações -->
    <q-card flat bordered class="q-mb-md" v-show="false">
      <q-card-section>
        <div class="text-h6">Mensagens e Notificações</div>
        <q-list bordered>
          <q-item v-for="mensagem in mensagens" :key="mensagem.id">
            <q-item-section>
              <q-item-label>{{ mensagem.titulo }}</q-item-label>
              <q-item-label caption>{{ mensagem.corpo }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Suporte e Ajuda -->
    <q-card flat bordered v-if="false">
      <q-card-section>
        <div class="text-h6">Suporte e Ajuda</div>
        <q-btn label="FAQ" icon="help" @click="abrirFAQ" />
        <q-btn
          label="Contato de Suporte"
          icon="support_agent"
          @click="abrirSuporte"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import { format } from "date-fns";
import apiMethods from "src/router/api.js";
import { useRoute } from "vue-router";
import store from "src/store/index.js";
import { ref, computed } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    name: {
      type: String,
      required: false, // Optional if it's not always required
    },
  },
  data() {
    return {
      carregando: true,
      entregasHoje: 0,
      entregasSemanais: 0,
      entregasMensais: 0,
      pedidosAtuais: [],
      historicoSeries: [],
      total_pedidos_entregues: 0,
      total_pedidos_pendentes: 0,
      valorTotalVendido: 0,
      numTotalProdutos: 0,
      // pedidosAtuais: [
      //   { id: 1, clienteNome: 'João Silva', endereco: 'Rua A, 123', horario: '10:00' },
      //   { id: 2, clienteNome: 'Maria Souza', endereco: 'Rua B, 456', horario: '11:00' },
      // ],
      // historicoSeries: [{
      //   name: 'Entregas',
      //   data: [10, 20, 30, 40, 50, 60, 70]
      // }],
      historicoOptions: {
        chart: {
          id: "historico-chart",
        },
        xaxis: {
          categories: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        },
      },
      mensagens: [
        {
          id: 1,
          titulo: "Nova Entrega",
          corpo: "Você tem uma nova entrega para realizar.",
        },
        {
          id: 2,
          titulo: "Feedback do Cliente",
          corpo: "Você recebeu uma nova avaliação.",
        },
      ],
    };
  },
  mounted() {
    this.fetchEstatisticas();
    this.ListHistoryPackages();
    // this.fetchMensagens();
  },
  methods: {
    navegarPara(endereco) {
      // Implementar navegação para o endereço
      console.log(`Navegando para ${endereco}`);
    },
    abrirFAQ() {
      // Implementar abertura da FAQ
      console.log("Abrindo FAQ");
    },
    abrirSuporte() {
      // Implementar abertura do suporte
      console.log("Abrindo Suporte");
    },
    async fetchEstatisticas() {
      const isOnlyAdmin = this.$route.meta.requiredScopes.includes("admin");

      // console.log(this.$route.params.id);
      try {
        const response = isOnlyAdmin
          ? await apiMethods.fetchStoreById(this.$route.params.id)
          : await apiMethods.empresaVendas();
        const stats = response.data;
        // console.log(stats);
        this.entregasHoje = stats.entregasHoje || 0;
        this.entregasSemanais = stats.entregasSemanais || 0;
        this.entregasMensais = stats.entregasMensaisa || 0;
        this.historicoSeries = [
          { name: "Entregas", data: stats.historicoEntregas },
        ];
        this.total_pedidos_entregues = stats.total_pedidos_entregues || 0;
        this.total_pedidos_pendentes = stats.total_pedidos_pendentes || 0;
        this.valorTotalVendido = stats.valorTotalVendido || 0;
        this.numTotalProdutos = stats.numTotalProdutos || 0;

        this.carregando = false;
      } catch (error) {
        this.carregando = false;

        console.error("Erro ao buscar estatísticas:", error);
      }
    },
    async ListHistoryPackages() {
      try {
        this.registering = true; //pacote vs pedido
        const response = await apiMethods.getPedidosPorEmpresa();
        this.ListHistoryPackage = response.data;
        // console.log(response.data);
        this.carregando = false;
      } catch (error) {
        this.registering = false;
        console.error(
          "Erro ao listar pacotes. Por favor, tente novamente.",
          error
        );
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message: "Erro ao listar pacotes. Por favor, tente novamente.",
        });
      }
    },

  },
  setup() {
    const store = useStore();
    const period = ref("Mensal");
    const sales = ref([]);
    const totalSales = computed(() =>
      sales.value.reduce((sum, sale) => sum + sale.value, 0)
    );
    const totalFees = computed(() => totalSales.value * 0.05);
    const paymentStatus = ref("Pendente"); // Atualizar conforme necessário

    const periodOptions = [
      { label: "Mensal", value: "Mensal" },
      { label: "Semanal", value: "Semanal" },
    ];

    const columns = [
      { name: "date", label: "Data da Venda", align: "left", field: "date" },
      { name: "product", label: "Produto", align: "left", field: "product" },
      {
        name: "value",
        label: "Valor da Venda",
        align: "right",
        field: "value",
      },
      { name: "fee", label: "Taxa (5%)", align: "right", field: "fee" },
      { name: "net", label: "Valor Líquido", align: "right", field: "net" },
    ];

    const fetchData = () => {
      // Simular a recuperação de dados de vendas
      sales.value = [
        {
          date: "2024-10-01",
          product: "Produto A",
          value: 100,
          fee: 5,
          net: 95,
        },
        {
          date: "2024-10-02",
          product: "Produto B",
          value: 200,
          fee: 10,
          net: 190,
        },
        // Adicione mais dados conforme necessário
      ];
    };

    // Fetch initial data
    fetchData();

    return { period, sales, columns, periodOptions };
  },
};
</script>

<style scoped>
.dashboard {
  max-width: 900px;
  margin: auto;
}
</style>
