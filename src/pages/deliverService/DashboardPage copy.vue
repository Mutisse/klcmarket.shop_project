<template>
  <q-card class="row justify-around text-center full-width">
    <q-badge
      :color="activeTab === 'semana' ? 'grey' : 'transparent'"
      label="Essa semana"
      class="q-mb-xs q-mt-xs col-3 text-center text-subtitle2"
      style="height: 25px; color: black"
      @click="setActiveTab('semana')"
    />

    <q-badge
      :color="activeTab === 'mes' ? 'grey' : 'transparent'"
      label="Esse mes"
      class="q-mb-xs q-mt-xs col-4 text-center text-subtitle2"
      style="height: 25px; color: black"
      @click="setActiveTab('mes')"
    />

    <q-badge
      :color="activeTab === 'ano' ? 'grey' : 'transparent'"
      label="Esse ano"
      class="q-mb-xs q-mt-xs col-3 text-center text-subtitle2"
      style="height: 25px; color: black"
      @click="setActiveTab('ano')"
    />
  </q-card>

  <q-page
    v-if="!showMap"
    class="flex flex-start q-pa-md"
    style="background-color: #f2f2f2"
  >
    <div class="full-width">
      <q-card
        style="border-radius: 2rem"
        class="row text-start full-width q-pa-md"
      >
        <div class="balance col-12 q-pa-md">
          <div class="text-subtitle">Balanco total</div>
          <div class="text-h5 text-bold">600.000 MT</div>
        </div>

        <div class="row justify-around col-12">
          <div class="q-card col-5 q-pa-xs bg-blue-2">
            <div class="text-subtitle">Saldo</div>
            <div class="text-h5 text-bold col-5">20.000 MT</div>
          </div>
          <div class="q-card col-5 q-pa-xs bg-red-2">
            <div class="text-subtitle">Despesa</div>
            <div class="text-h5 text-bold col-5">6.000 MT</div>
          </div>
        </div>
      </q-card>

      <transition
        appear
        enter-active-class="animated fadeIn slower delay-1s repeat-2"
        leave-active-class="animated fadeOut"
      >
        <div v-if="activeTab === 'recentes'">
          <div v-for="pacote in ListPackage" :key="pacote.id">
            <q-card class="bg-white q-card rounded" style="border-radius: 2rem">
              <div class="row q-pt-md text-center justify-between">
                <div>
                  <div class="row text-center">
                    <q-btn
                      flat
                      color="orange"
                      class="q-mb-xs col-2"
                      icon="my_location"
                      @click="$router.push('/pack/' + pacote.id)"
                    />
                    <div class="text-subtitle2 text-weight-bold">
                      {{ pacote.origem }} - Recolha
                    </div>
                  </div>

                  <div class="row text-center">
                    <q-btn
                      flat
                      color="orange"
                      class="q-mb-xs col-2"
                      icon="place"
                      @click="$router.push('/pack/' + pacote.id)"
                    />
                    <div class="text-subtitle2 text-weight-bold">
                      {{ pacote.destino }} - Entrega
                    </div>
                  </div>
                </div>
                <div class="q-my-auto text-center">
                  <q-btn
                    rounded
                    flat
                    label="ver"
                    style="height: 15px; line-height: 15px"
                    icon="visibility"
                    @click="verDetalhes(pacote.id)"
                  />
                </div>
              </div>
            </q-card>
          </div>
          <div
            v-if="ListPackage.length == 0 && !carregando"
            class="text-subtitle2 text-center"
          >
            Ainda sem pedidos, sera notificado assim que pedidos esttiverem
            desponives.
          </div>
        </div>
      </transition>
      <transition
        appear
        enter-active-class="animated fadeIn slower delay-1s repeat-2"
        leave-active-class="animated fadeOut"
      >
        <div v-if="activeTab === 'historico'">
          <div v-for="pacote in ListHistoryPackage" :key="pacote.id">
            <q-card class="bg-white q-card rounded" style="border-radius: 2rem">
              <div class="row q-pt-md text-center justify-between">
                <div>
                  <div class="row text-center">
                    <q-btn
                      flat
                      color="orange"
                      class="q-mb-xs col-2"
                      icon="my_location"
                      @click="$router.push('/pack/' + pacote.id)"
                    />
                    <div class="text-subtitle2 text-weight-bold">
                      {{ pacote.origem }} - Recolha
                    </div>
                  </div>

                  <div class="row text-center">
                    <q-btn
                      flat
                      color="orange"
                      class="q-mb-xs col-2"
                      icon="place"
                      @click="$router.push('/pack/' + pacote.id)"
                    />
                    <div class="text-subtitle2 text-weight-bold">
                      {{ pacote.destino }} - Entrega
                    </div>
                  </div>
                </div>
                <div class="q-my-auto text-center">
                  <q-btn
                    rounded
                    flat
                    label="ver"
                    style="height: 15px; line-height: 15px"
                    icon="visibility"
                    @click="verDetalhes(pacote.id)"
                  />
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </transition>
    </div>
  </q-page>

  <q-page
    v-if="showMap"
    class="flex flex-start"
    style="background-color: #e25555"
  >
    <LMap
      class="full-width"
      ref="mapPage"
      :markers="markers"
      :mapHeight="'100vh'"
    />
  </q-page>

  <div id="chart">
</div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { format } from "date-fns";
import LMap from "../../components/LMap.vue";
import apiMethods from "src/router/api.js";
import { useRoute } from "vue-router";
import store from "src/store/index.js";



export default {
  name: "ListPackageFormPage",
  components: {
    LMap,
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
      activeTab: "semana",

    };
  },
  computed: {
    showMap() {
      return store.state.showMap;
    },
  },
  methods: {
    toggleMap() {
      store.mutations.toggleMap;
    },
    async ListPackages() {
      try {
        this.registering = true;
        const response = await apiMethods.getEstatisticasEntregador();
        this.ListPackage = response.data;
        console.log(response.data);
        this.carregando = false;
      } catch (error) {
        this.registering = false;
        console.error("Erro ao cancelar pacote:", error);
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message: "Erro ao cancelar pacote. Por favor, tente novamente.",
        });
      }
    },
    async ListHistoryPackages() {
      try {
        this.registering = true;
        const response = await apiMethods.getHistoricoPedidosPersonalizados();
        this.ListHistoryPackage = response.data;
        this.carregando = false;
      } catch (error) {
        this.registering = false;
        console.error("Erro ao cancelar pacote:", error);
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message: "Erro ao cancelar pacote. Por favor, tente novamente.",
        });
      }
    },
    verDetalhes(id) {
      this.$router.push({ path: `/show-packs/${id}` });
    },
    async cancelPackage(id) {
      try {
        this.registering = true;
        const response = await apiMethods.atualizarStatusPedidoPersonalizado(
          id,
          { status: "CANCELADO_C" }
        );
        this.ListPackages();
        this.form = response.data;
        this.registering = false;
      } catch (error) {
        this.registering = false;
        console.error("Erro ao cancelar pacote:", error);
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message: "Erro ao cancelar pacote. Por favor, tente novamente.",
        });
      }
    },

    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy HH:mm:ss"); // Formato para dd/MM/yyyy HH:mm:ss
    },
    isCanceled(status) {
      return status === "CANCELADO_C" || status === "CANCELADO_A";
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    },
  },
  mounted() {
    this.ListPackages();
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

<style>
.q-btn[disabled] {
  opacity: 0.5;
}

#chart {
  max-width: 650px;
  margin: 35px auto;
}

</style>
