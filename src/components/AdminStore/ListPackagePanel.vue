<template>
  <q-tab-panel
    style="background-color: #f2f2f5; margin-top: 20px"
    name="orders1"
    v-bind="$attrs"
  >
    <div class="flex1 flex-start bg-transparent full-height q-pt-lg">
      <!-- skleton -->
      <q-card style="margin-top: 21px; border-radius: 2rem" v-if="carregando">
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
          <!-- Pedidos -->
          <div v-for="pacote in ListHistoryPackage" :key="pacote.id">
            <q-card
              class="bg-white q-card q-mb-xs"
              style="border-radius: 0.5rem"
              @click="verDetalhes(pacote.id, pacote.tipo)"
            >
              <div
                class="row text-center justify-between"
                style="font-size: 9px"
              >
                <div class="row text-center">
                  <q-btn
                    flat
                    size="8px"
                    color="orange"
                    class="col-2"
                    icon="my_location"
                  />
                  <!-- @click="$router.push('/c/pack/' + pacote.id)" -->

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
                    size="8px"
                    color="orange"
                    class="col-2"
                    icon="place"
                  />
                   <!-- @click="$router.push('/c/pack/' + pacote.id)" -->
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

                <div class="row col-12 q-ml-md q-ma-xs text-center">
                  <div v-if="pacote.tipo == 'PEDIDO'" class="pedido">
                    <!-- Processar -->
                    <span
                      v-if="pacote.status == 'RECEBIDO'"
                      :disable="registering"
                      class="text-green"
                      >Novo
                    </span>

                    <!-- deixar pronto -->
                    <span
                      v-if="pacote.status == 'PROCESSANDO'"
                      :disable="registering"
                      class="text-green"
                      >Processando
                    </span>

                    <!-- iniciar entrega-->
                    <span
                      v-if="pacote.status == 'PRONTO'"
                      :disable="registering"
                      class="text-green"
                      >Pronto
                    </span>

                    <!-- Concluir entregar -->
                    <span
                      v-if="pacote.status == 'ENVIANDO'"
                      :disable="registering"
                      class="text-green"
                      >A entregar
                    </span>



                    <span
                      outline
                      v-if="pacote.status == 'CANCELADO'"
                      class="text-red text-bold"
                    >
                      Você Cancelou
                    </span>

                    <span
                      outline
                      v-if="pacote.status == 'CANCELADO_C'"
                      class="text-red text-bold"
                    >
                      Cliente Cancelou
                    </span>

                    <div
                      v-if="pacote.status == 'ENTREGUE'"
                      class="text-bold text-green"
                    >
                      Entregue
                    </div>
                    <span
                      outline
                      v-if="pacote.status == 'FALHA'"
                      class="text-red text-bold"
                    >
                      Falhou
                    </span>

                    <span
                      outline
                      v-if="pacote.status == 'CANCELADO_E'"
                      class="text-red text-bold"
                    >
                      O Entregador Cancelou
                    </span>
                  </div>
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
  </q-tab-panel>

  <!-- Modal para Editar Perfil -->
  <q-dialog full-width maximized v-model="ShowPackageModal" persistent>
    <ShowPackagePage :idP="id" :tipo="tipo" />
  </q-dialog>
</template>

<script>
import { format } from "date-fns";
import LMap from "../../components/LMap.vue";
import apiMethods from "src/router/api.js";
import { useRoute } from "vue-router";
import store from "src/store/index.js";
import ShowPackagePage from "components/AdminStore/ShowPackagePage.vue";

export default {
  name: "ListPackageFormPage",
  inheritAttrs: false, // Para não herdar atributos automaticamente
  components: { ShowPackagePage },
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
      orderStats: {
        pending_orders: 0,
        completed_orders: 0,
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
      tipo: "",
      ListPackage: [],
      ListHistoryPackage: [],
      markers: [],
      activeTab: "recentes",
      showEditProfileModal: false,
    };
  },
  computed: {
    ShowPackageModal() {
      return store.state.ShowPackageModal;
    },
    isOnlyAdmin() {
      return this.$route.meta.requiredScopes.includes("admin");
    },
  },
  methods: {

    toggleMap() {
      store.mutations.toggleMap;
    },
    togglePackageModal() {
      store.commit("togglePackageModal");
      // store.mutations.togglePackageModal;
    },
    voltar() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },
    getImageUrl(imageName) {
      return apiMethods.baseURL() + `/storage/product_images/${imageName.name}`;
    },
    formatarDataHora(data) {
      if (!data) return "";
      const date = new Date(data);
      return `${date.getHours()}:${date.getMinutes()}`;
      // return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    },
    formatarData(data) {
      const dataObj = new Date(data);
      return dataObj.toLocaleDateString();
    },
    verDetalhes(id, tipo) {
      this.id = id;
      this.tipo = tipo;
      this.togglePackageModal();
      // this.$router.push({ path: `/s/show-packs/${id}/${tipo}` });
    },
    async ListHistoryPackages() {
      const isOnlyAdmin = this.$route.meta.requiredScopes.includes("admin");

      // console.log(this.$route.params.id);
      try {
        const response = isOnlyAdmin
          ? await apiMethods.fetchOrdersStoreById(this.$route.params.id)
          : await apiMethods.getPedidosPorEmpresa();
        this.registering = true; //pacote vs pedido
        this.ListHistoryPackage = response.data;
        console.log(response.data);
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
    async fetchPackage(id) {
      this.showEditProfileModal = true;
      try {
        this.id = id;
        const response = await apiMethods.getPedidoById(id);
        console.log(response);

        this.form = response.data;
        this.carregando = false;
      } catch (error) {
        this.carregando = false;
        console.error("Erro ao buscar pacote:", error);
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message: "Erro ao buscar pacote. Por favor, tente novamente.",
        });
      }
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
    makeCall(telefone) {
      if (telefone) {
        window.location.href = `tel:${telefone}`;
      } else {
        this.$q.notify({
          message: "Número de telefone não disponível",
          type: "negative",
          position: "top",
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
          position: "top",
        });
      }
    },

    isDelivering(status) {
      return (
        status != "CANCELADO_C" &&
        status != "CANCELADO_A" &&
        status != "PUBLICO"
      );
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
