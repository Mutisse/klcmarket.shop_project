<template>
  <q-page class="flex flex-start q-pa-md" style="background-color: #f2f2f2">
    <div class="full-width">
      <q-card style="border-radius: 2rem" v-if="ListPackage.length == 0">
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

        <q-skeleton height="200px" square />

        <q-card-actions align="right" class="q-gutter-md">
          <q-skeleton type="QBtn" />
          <q-skeleton type="QBtn" />
        </q-card-actions>
      </q-card>
      <div v-for="pacote in ListPackage" :key="pacote.id">
        <q-card class="bg-white q-card rounded" style="border-radius: 2rem">
          <q-timeline color="secondary">
            <q-timeline-entry
              :title="`${pacote.origem} - Recolha`"
              :subtitle="formatDate(pacote.hora_de_levantamento)"
              icon="my_location"
            >
            </q-timeline-entry>

            <q-timeline-entry
              :title="`${pacote.destino} - Entrega`"
              :subtitle="formatDate(pacote.hora_de_entrega)"
              icon="place"
            >
            </q-timeline-entry>
          </q-timeline>
          <div class="row justify-between q-mb-xl q-ml-xl q-mr-xl">
            <q-btn
              label="Ver"
              color="orange"
              class="q-mb-md col-5"
              @click="$router.push('/pack/' + pacote.id)"
            >
            </q-btn>
            <q-btn
              v-if="!isCanceled(pacote.status)"
              color="red"
              label="Cancelar"
              style="color: white"
              :disable="registering"
              class="q-mb-md col-5"
              @click="cancelPackage(pacote.id)"
            >
              <q-spinner-hourglass
                v-if="registering"
                color="white"
                size="24px"
              />
            </q-btn>

            <div
              v-if="isCanceled(pacote.status)"
              class="text-h6 text-bold text-red col-5"
            >
              Cancelado
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { format } from "date-fns"; // Importe a função format do date-fns
import apiMethods from "src/router/api.js";
import { useRoute } from "vue-router";

export default {
  name: "ListPackageFormPage",
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
    };
  },
  methods: {
    async ListPackages() {
      try {
        this.registering = true;
        const response = await apiMethods.getHistoricoPedidosPersonalizados();
        this.ListPackage = response.data;
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
  },
  mounted() {
    this.ListPackages();
  },
  setup() {
    const route = useRoute();

    return {
      route,
    };
  },
};
</script>

<style></style>
