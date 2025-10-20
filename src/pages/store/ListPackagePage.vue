<template>
  <!-- heider -->
  <div>
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

  <div
    v-if="!showMap"
    class="flex1 flex-start1 q-pa-md full-height"
    style="background-color: #f2f2f5; margin-top: 60px; min-height: 100vh"
  >
    <div class="full-width">
      <!-- skleton -->
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
            >
              <div class="row q-pt-md text-center justify-between">
                <div>
                  <div class="row text-center">
                    <q-btn
                      flat
                      color="orange"
                      class="q-mb-xs col-2"
                      icon="my_location"
                      @click="$router.push('/c/pack/' + pacote.id)"
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
                      @click="$router.push('/c/pack/' + pacote.id)"
                    />
                    <div class="text-subtitle2 text-weight-bold">
                      {{ pacote.destino }} - Entrega
                    </div>
                  </div>
                </div>
                <div class="row q-my-auto text-center">
                  <q-badge
                    v-if="pacote.status == 'PUBLICO'"
                    outline
                    color="primary"
                    label="Publico"
                  />
                  <q-badge
                    v-if="pacote.status == 'CANCELADO_C'"
                    outline
                    color="orange"
                    label="Voce Cancelou"
                  />
                  <q-badge
                    v-if="pacote.status == 'CANCELADO_A'"
                    outline
                    color="orange"
                    label="Cancelado"
                  />
                  <q-badge
                    v-if="pacote.status == 'RECEBIDO'"
                    outline
                    color="primary"
                    label="Pendente"
                  />
                  <q-badge
                    v-if="pacote.status == 'ENTREGUE'"
                    outline
                    color="green"
                    label="Entregue"
                  />
                  <q-btn
                    rounded
                    flat
                    label="ver"
                    style="height: 15px; line-height: 15px"
                    icon="visibility"
                    @click="verDetalhes(pacote.id, pacote.tipo)"
                  />
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
import LMap from "../../components/LMap.vue";
import apiMethods from "src/router/api.js";
import { useRoute } from "vue-router";
import store from "src/store/index.js";

export default {
  name: "ListPackageFormPage",
  components: {},
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
    verDetalhes(id, tipo) {
      this.$router.push({ path: `/c/show-packs/${id}/${tipo}` });
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
