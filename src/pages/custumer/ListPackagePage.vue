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
                  <span
                    v-if="pacote.status == 'FALHA'"
                    class="text-red"
                  >
                    O vendedor cancelou
                  </span>
                  <span
                    v-if="pacote.status == 'CANCELADO_A'"
                    class="text-orange"
                    >Cancelado
                  </span>
                  <span v-if="pacote.status == 'RECEBIDO'" class="text-primary"
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
        console.log(this.ListHistoryPackage);

        this.carregando = false;
      } catch (error) {
        this.registering = false;
        // console.error("Erro ao cancelar pacote:", error);
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
