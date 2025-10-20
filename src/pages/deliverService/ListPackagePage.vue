<template>
  <q-card class="row justify-around full-width">
    <q-btn
      :color="activeTab === 'recentes' ? 'grey-8' : 'grey'"
      label="Recentes"
      class="q-mb-xs q-mt-xs col-5"
      icon="update"
      @click="setActiveTab('recentes')"
    />
    <q-btn
      :color="activeTab === 'historico' ? 'grey-8' : 'grey'"
      label="Histórico"
      class="q-mb-xs q-mt-xs col-5"
      icon="history "
      @click="setActiveTab('historico')"
    />
  </q-card>

  <q-page
    v-if="!showMap"
    class="flex flex-start q-pa-md"
    style="background-color: #f2f2f2"
  >
    <div class="full-width">
      
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
      activeTab: "recentes",
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
        const response = await apiMethods.getPedidosPersonalizadosPublicos();
        this.ListPackage = response.data;
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
</style>
