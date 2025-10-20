<template>
  <q-page>
    <q-tab-panel name="orders">
      <q-page
        v-if="!showMap"
        class="flex flex-start q-pa-md"
        style="background-color: #f2f2f2"
      >
        <div class="full-width">
          <!-- skeleton -->

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
            <div class="q-gutter-md">
              <div v-for="pacote in ListPackage" :key="pacote.id">
                <q-card
                  class="bg-white q-card rounded"
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
                  <div class="q-ml-md text-subtitle">
                    Criado a: {{ formatDate(pacote.created_at) }}
                  </div>
                  <div class="q-ml-md text-subtitle">
                    Ultima atualizacao: {{ formatDate(pacote.updated_at) }}
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
        </div>
      </q-page>
    </q-tab-panel>

    <!-- Modal para Editar Perfil -->
    <q-dialog full-width maximized v-model="showEditProfileModal" persistent>
      <q-card class="flex flex-center q-pa-xl" >
        <q-header class="q-mb-md text-start bg-white text-black">
          <q-toolbar>
            <q-btn
              flat
              round
              dense
              @click="showEditProfileModal = false"
              size="md"
              icon="arrow_back"
            ></q-btn>
            <q-toolbar-title>
              <q-card-section style="padding-bottom: 0px; padding-top: 0px">
                <h2 class="text-h6">Detalhes do Pedido</h2>

              </q-card-section>
            </q-toolbar-title>

            <q-btn
              rounded
              dense
              label="Guardar"
              class="bg-green-2 glowing-shadow-add"
              type="submit"
            ></q-btn>


          </q-toolbar>
        </q-header>
        <div v-if="!carregando && form.id" class="full-width">
          <q-item>
            <q-item-section side>
              <q-avatar icon="card_giftcard" rounded size="80px"></q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>Hoje</q-item-label>
              <q-item-label caption>agora</q-item-label>
            </q-item-section>
            <q-item-section side>{{ form.valor }} MT</q-item-section>
          </q-item>

          <q-timeline color="secondary">
            <q-timeline-entry
              title="Origem"
              :subtitle="form.origem"
              icon="my_location"
            >
              <div class="text-subtitle text-bold">
                {{ form.sender.nome }}
              </div>
              <div>Hora De Levantamento: {{ form.horaDeLevantamento }}</div>
            </q-timeline-entry>

            <q-timeline-entry
              title="Destino"
              :subtitle="form.destino"
              icon="place"
            >
              <div class="text-subtitle text-bold">
                {{ form.receiver.name }}
              </div>
              <div>Hora de entrega: {{ form.horaDeEntrega }}</div>
            </q-timeline-entry>
          </q-timeline>

          <q-card-section>
            <div class="text-h6 text-bold">Detalhes do Pacote</div>
            <div class="text-h61 text-bold">Items</div>
          </q-card-section>

          <div v-for="(item, index) in form.items" :key="index" class="q-mb-md">
            <q-item
              clickable
              v-ripple
              class="rounded-borders"
              :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-grey-2'"
            >
              <q-item-section avatar>
                <q-avatar rounded>
                  <div v-if="item.images.length > 0">
                    <img
                      :src="item.images[0].preview"
                      alt="Pré-visualização da imagem"
                      style="max-width: 100px; max-height: 100px"
                    />
                  </div>
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ item.descricao }}</q-item-label>
              </q-item-section>

              <q-item-section side class="row">
                <span>Qtd: {{ item.quantidade }}</span>
              </q-item-section>
              <q-btn style="color: #f27c38; right: -25px" flat icon="close" />
            </q-item>
          </div>
          <div
            v-if="form.items && form.items.length == 0"
            class="text-subtitle"
          >
            Sem items
          </div>

          <q-card-section>
            <q-form>
              <q-input
                filled
                v-model="form.nota"
                label="Nota"
                disable
                type="textarea"
                prepend-icon="edit"
                class="q-mt-md"
              />

              <q-input
                filled
                v-model="form.valor"
                label="Valor"
                disable
                prepend-icon="edit"
                class="q-mt-md"
              />
            </q-form>
          </q-card-section>

          <q-btn
            v-if="form.status != 'CANCELADO_C'"
            :disable="registering"
            style="background-color: #f27c38; color: white"
            label="Cancelar"
            @click="cancelPackage"
          >
            <q-spinner-hourglass v-if="registering" color="white" size="24px" />
          </q-btn>

          <q-badge
            v-if="form.status == 'CANCELADO_C'"
            class="text-bold"
            style="height: 40px"
            transparent
            align="middle"
            color="red"
          >
            Você Cancelou
          </q-badge>

          <q-badge
            v-if="form.status == 'CANCELADO_E'"
            class="text-bold"
            style="height: 40px"
            transparent
            align="middle"
            color="red"
          >
            O Entregador Cancelou
          </q-badge>
        </div>

        <div v-if="carregando" class="full-width">
          <q-item v-ripple>
            <q-item-section side>
              <q-skeleton type="circle" />
            </q-item-section>
            <q-item-section>
              <q-skeleton type="text" width="40%" />
              <q-skeleton type="text" width="60%" />
            </q-item-section>
            <q-skeleton type="text" width="20%" />
          </q-item>

          <q-timeline color="secondary">
            <q-timeline-entry
              title="Origem"
              :subtitle="form.origem"
              icon="my_location"
            >
              <div class="text-subtitle text-bold">
                <q-skeleton type="text" width="60%" />
              </div>
              <div>
                Hora De Levantamento: <q-skeleton type="text" width="20%" />
              </div>
            </q-timeline-entry>

            <q-timeline-entry
              title="Destino"
              :subtitle="form.destino"
              icon="place"
            >
              <div class="text-subtitle text-bold">
                <q-skeleton type="text" width="60%" />
              </div>
              <div>Hora de entrega: <q-skeleton type="text" width="20%" /></div>
            </q-timeline-entry>
          </q-timeline>

          <q-card-section>
            <div class="text-h6 text-bold">Detalhes do Pacote</div>
            <div class="text-h61 text-bold">Items</div>
          </q-card-section>

          <div v-for="i in 3" :key="i" class="q-mb-md">
            <q-skeleton type="QChip" width="100%" height="60px" />
          </div>

          <q-card-section>
            <q-form>
              Nota
              <q-skeleton
                type="QChip"
                width="100%"
                height="200px"
                class="q-mb-md"
              />
              Valor
              <q-skeleton type="QChip" width="100%" height="40px" />
            </q-form>
          </q-card-section>

          <div class="row justify-between">
            <q-skeleton type="QChip" width="40%" height="60px" />
            <q-skeleton type="QChip" width="40%" height="60px" />
          </div>
        </div>

        <div v-if="!carregando && !form.id" class="text-h6 text-bold">
          Pacote nao encontrado!
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { format } from "date-fns";
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
      showEditProfileModal: false,
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
        const response = await apiMethods.getHistoricoAD();
        this.ListPackage = response.data;
        this.carregando = false;
        console.log(response.data);
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
      this.showEditProfileModal=true;
      this. fetchPackage(id)
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
    async fetchPackage(id) {
      this.showEditProfileModal=true;
      try {
        this.id = id;
        const response = await apiMethods.verPedido(id);
        console.log(response.data);

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

<style>
.q-btn[disabled] {
  opacity: 0.5;
}
</style>

<style>
#ods {
}
</style>
