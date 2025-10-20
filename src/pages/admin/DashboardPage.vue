<template>
  <div class="container">
    <q-header class="q-mb-md q-pa-md text-start bg-white">
      <q-toolbar
        style="
          /* position: fixed; */
          top: 0px;
          width: 100%;
          left: 0;
          display: flex;
          justify-content: center;
          z-index: 99999;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        "
        class="bg-white q-pt-md q-pb-md"
      >

        <div style="flex: 1; text-align: center">
          <q-toolbar-title> Carrinho </q-toolbar-title>
        </div>
        <q-btn
          style="border-radius: 1rem; position: relative"
          class="col-2 bg-black text-grey"
          @click="toggleLeftDrawer"
          icon="widgets"
        >
          <q-badge
            v-if="unread_count > 0"
            color="red"
            class="q-badge--top-right"
            style="
              position: absolute;
              top: 4px;
              right: 6px;
              transform: translate(50%, -50%);
            "
          >
            {{ unread_count }}
          </q-badge>
        </q-btn>
      </q-toolbar>

      <q-separator
        style="left: 0"
        class="absolute full-width"
        color="gray"
        inset
      />
    </q-header>

    <q-drawer
      style="
        border-right-width: 1px;
        border-right-color: rgba(0, 0, 0, 0.1);
        border-right-style: inset;
      "
      v-model="leftDrawerOpen"
      show-if-above
    >
      <q-list>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-btn flat icon="email" style="padding-left: 0px">
              <q-badge color="red" v-if="unread_count > 0" floating>{{
                unread_count
              }}</q-badge>
            </q-btn>
          </q-item-section>
          <q-item-section v-if="user" @click="$router.push('/messages')">
            <q-item-label>Menssagens</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-btn flat icon="email" style="padding-left: 0px">
              <q-badge color="red" v-if="unread_count > 0" floating>{{
                unread_count
              }}</q-badge>
            </q-btn>
          </q-item-section>
          <q-item-section v-if="user" @click="$router.push('admin/product-approval')">
            <q-item-label>Aprovar Produtos</q-item-label>
          </q-item-section>
        </q-item>

<q-item clickable v-ripple>
<q-item-section avatar>
            <q-icon name="campaign" />
          </q-item-section>
          <q-item-section v-if="user" @click="$router.push('admin/mk')">
            <q-item-label>Marketing</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="user" clickable @click="logout" v-ripple>
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sair</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="!user" clickable to="/login" v-ripple>
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Entrar</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>


  </div>

  <q-page v-if="carregando" class="dashboard">
    <!-- Visão Geral -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Resumo das Entregas</div>
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
            <div class="text-subtitle">Total de pedidos entregues</div>
            <div class="text-h5 text-bold col-5">
              <q-skeleton type="text" width="60%" />
            </div>
          </div>
          <div class="q-card col-5 q-pa-xs bg-red-2">
            <div class="text-subtitle">total_pedidos_pendentes</div>
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
  </q-page>

  <q-page v-if="!carregando" class="dashboard">
    <!-- Visão Geral -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Resumo das Entregas</div>
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
        <div class="balance col-12 q-pa-md">
          <div class="text-subtitle">Visão Geral</div>
          <div class="text-h5 text-bold">Visão Geral</div>
        </div>

        <div class="row justify-around col-12 q-mb-md q-gutter-md">
          <div
            @click="$router.push('/admin/custumers')"
            class="q-card col-5 q-pa-xs bg-blue-2"
          >
            <div class="text-subtitle">Clientes</div>
            <div class="text-h5 text-bold col-5">{{ total_users }}</div>
            <div class="q-card col-5 q-pa-xs">
              <div class="text-subtitle text-blue">
                Últimos 7 dias:
                <span class="text-h6 text-bold col-5">{{
                  new_users_last_7_days
                }}</span>
              </div>
            </div>
          </div>
          <div
            @click="$router.push('/admin/deliver-mans')"
            class="q-card col-5 q-pa-xs bg-red-2"
          >
            <div class="text-subtitle">Entregadores</div>
            <div class="text-h5 text-bold col-5">{{ total_entregadores }}</div>
          </div>
          <div
            @click="$router.push('/admin/store')"
            class="q-card col-5 q-pa-xs bg-yellow-2"
          >
            <div class="text-subtitle">Empresas</div>
            <div class="text-h5 text-bold col-5">
              {{ total_empresas }}
            </div>
          </div>
          <div
            @click="$router.push('/admin/orders')"
            class="q-card col-5 q-pa-xs bg-blue-2"
          >
            <div class="text-subtitle">Entregas Concluídas</div>
            <div class="text-h5 text-bold col-5">
              {{ total_pedidos_entregues }}
            </div>
            <div class="q-card col-5 q-pa-xs">
              <div class="text-subtitle text-blue">
                Pendentes
                <span class="text-h6 text-bold col-5">{{
                  total_pedidos_pendentes
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <!-- Histórico de Entregas 1 -->
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

    <!-- Histórico de Entregas 2 -->
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

    <q-page>
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

      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Distribuição de Pacotes</div>
          <apexchart
            type="pie"
            height="350"
            :options="distribuicaoOptions"
            :series="distribuicaoSeries"
          />
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Crescimento de Usuários</div>
          <apexchart
            type="bar"
            height="350"
            :options="crescimentoOptions"
            :series="crescimentoSeries"
          />
        </q-card-section>
      </q-card>
    </q-page>

    <!-- Mensagens e Notificações -->
    <q-card flat bordered class="q-mb-md">
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
  </q-page>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import { format } from "date-fns";
import apiMethods from "src/router/api.js";
import { useRoute } from "vue-router";
import store from "src/store/index.js";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  computed: {
    user() {
      return store.state.user;
    },
  },
  data() {
    return {
      unread_count:0,
      leftDrawerOpen: false,
      total_users: 0,
      total_entregadores: 0,
      total_empresas: 0,
      new_users_last_7_days: 0,
      pacotesEntregues: 12000,
      pacotesPendentes: 300,
      novosUsuarios: 50,
      entregasConcluidas: 800,
      // historicoOptions: {
      //   chart: { type: 'line' },
      //   xaxis: { categories: ['01/07', '02/07', '03/07', '04/07', '05/07', '06/07', '07/07'] },
      //   title: { text: 'Histórico de Entregas Diárias' },
      // },
      historicoSeries: [
        {
          name: "Entregas",
          data: [20, 25, 30, 28, 35, 40, 50],
        },
      ],
      distribuicaoOptions: {
        chart: { type: "pie" },
        labels: ["Entregue", "Pendente", "Em Trânsito"],
        title: { text: "Distribuição de Pacotes" },
      },
      distribuicaoSeries: [60, 30, 10],
      crescimentoOptions: {
        chart: { type: "bar" },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        },
        title: { text: "Crescimento de Usuários" },
      },
      crescimentoSeries: [
        {
          name: "Usuários",
          data: [1000, 1100, 1200, 1300, 1400, 1500, 1600],
        },
      ],

      carregando: true,
      entregasHoje: 0,
      entregasSemanais: 0,
      entregasMensais: 0,
      pedidosAtuais: [],
      // historicoSeries: [],
      total_pedidos_entregues: 0,
      total_pedidos_pendentes: 0,
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
  },
  methods: {
    async logout() {
      try {
        this.$q.loading.show({
          message: "Terminando sua sessao",
        });
        // Chama a API para fazer login
        let response = await apiMethods.logout();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.$q.loading.hide();
        store.commit("clearUser");
        //  console.log(response.data.user)
        this.$router.push("/");

        this.$q.notify({
          color: "green",
          textColor: "white",
          icon: "cloud_done",
          message: "Volte sempre, obrigado.",
        });
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.$router.push("/login");
        store.commit("clearUser");
      } finally {
        this.$q.loading.hide();
      }
    },
    navegarPara(endereco) {
      // Implementar navegação para o endereço
      console.log(`Navegando para ${endereco}`);
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
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
      try {
        const response = await apiMethods.getDashboardMetrics();
        const stats = response.data;
        // console.log(stats);
        this.entregasHoje = stats.entregasHoje || 0;
        this.entregasSemanais = stats.entregasSemanais || 0;
        this.entregasMensais = stats.entregasMensais || 0;
        this.total_users = stats.total_users || 0;
        this.total_entregadores = stats.total_entregadores || 0;
        this.total_empresas = stats.total_empresas || 0;
        this.new_users_last_7_days = stats.new_users_last_7_days || 0;

        this.historicoSeries = [
          { name: "Entregas", data: stats.historicoEntregas },
        ];
        this.total_pedidos_entregues = stats.total_pedidos_entregues || 0;
        this.total_pedidos_pendentes = stats.total_pedidos_pendentes || 0;
        this.carregando = false;
      } catch (error) {
        this.carregando = false;

        console.error("Erro ao buscar estatísticas:", error);
      }
    },

  },
};
</script>

<style scoped>
.dashboard {
  max-width: 900px;
  margin: auto;
}
</style>
