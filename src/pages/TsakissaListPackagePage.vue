<template>
  <q-card class="row justify-around full-width">
    <div class="text-subtitle2 text-weight-bold">Encomendas</div>
  </q-card>

  <div v-if="!showMap" class="flex flex-start q-pa-md">
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
        <div class="q-pa-md">
          <q-list padding bordered class="rounded-borders">
            <q-expansion-item
              v-for="pacote in ListPackage"
              :key="pacote.id"
              dense
              dense-toggle
              expand-separator
              icon="drafts"
              :label="pacote.destino"
              :caption="pacote.nome_receiver"
              header-class="text-purple"
            >
              <q-card>
                <q-card-section>
                  <div
                    v-if="!carregando && pacote.id"
                    class="full-width lex flex-star1 q-pl-xl q-pr-xl q-pb-xl"
                  >
                    <q-item>
                      <q-item-section side>
                        <q-avatar
                          icon="card_giftcard"
                          rounded
                          size="80px"
                        ></q-avatar>
                      </q-item-section>
                      <q-item-section> </q-item-section>
                      <q-item-section side v-if="pacote.valor > 0"
                        >{{ pacote.valor }} MT</q-item-section
                      >
                      <q-item-section
                        class="text-black"
                        side
                        v-if="pacote.valor <= 0"
                        >Solicita Cotacao</q-item-section
                      >
                    </q-item>

                    <q-timeline color="secondary">
                      <q-timeline-entry
                        subtitle="Destino"
                        :title="pacote.destino"
                        icon="place"
                      >
                        <div
                          v-if="pacote.tipo == 'PACOTE'"
                          class="text-subtitle text-bold"
                        >
                          <q-icon name="person" size="20px" />
                          {{
                            pacote.nome_receiver + " " + pacote.apelido_receiver
                          }}
                        </div>
                        <div
                          v-if="pacote.tipo == 'PEDIDO'"
                          class="text-subtitle text-bold"
                        >
                          <q-icon name="person" size="20px" />
                          {{ pacote.nome + " " + pacote.apelido }}
                        </div>
                        <!-- Botões para Chamada e SMS -->
                        <div class="button-group q-mt-md">
                          <q-btn
                            @click="
                              makeCall(
                                pacote.telefone_receiver
                                  ? pacote.telefone_receiver
                                  : pacote.telefone
                              )
                            "
                            icon="phone"
                            color="positive"
                          />
                          <q-btn
                            @click="
                              sendSMS(
                                pacote.telefone_receiver
                                  ? pacote.telefone_receiver
                                  : pacote.telefone
                              )
                            "
                            icon="message"
                            color="secondary"
                            class="q-ml-md"
                          />
                        </div>
                      </q-timeline-entry>
                    </q-timeline>

                    <q-card-section>
                      <div class="text-h6 text-bold">Detalhes do Pacote</div>
                      <div class="text-h61 text-bold">Items</div>
                    </q-card-section>

                    <div
                      v-for="(item, index) in pacote.itens_pacote"
                      :key="index"
                      class="q-mb-md"
                    >
                      <q-item
                        clickable
                        v-ripple
                        class="rounded-borders"
                        :class="
                          $q.dark.isActive
                            ? 'bg-grey-9 text-white'
                            : 'bg-grey-2'
                        "
                      >
                        <q-item-section avatar>
                          <q-avatar rounded>
                            <div v-if="item.image">
                              <img
                                :src="getImageUrl(item.image)"
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
                        <q-btn
                          style="color: #f27c38; right: -25px"
                          flat
                          icon="close"
                        />
                      </q-item>
                    </div>
                    <div
                      v-if="pacote.items && pacote.items.length == 0"
                      class="text-subtitle"
                    >
                      Sem items
                    </div>

                    <div
                      v-for="(item, index) in pacote.itens_pedido"
                      :key="index"
                      class="q-mb-md"
                    >
                      <q-item
                        clickable
                        v-ripple
                        class="rounded-borders"
                        :class="
                          $q.dark.isActive
                            ? 'bg-grey-9 text-white'
                            : 'bg-grey-2'
                        "
                      ><img v-if="item.produto.images && item.produto.images.length > 0"
             :src="getImageUrlP(item.produto.images[0].name)"
             alt="Imagem do Produto"
             style="max-width: 100px; max-height: 100px;"/>
                        <q-item-section avatar>
                          <q-avatar rounded>
                            <div
                             v-if="item.produto.images && item.produto.images.length > 0"
                            >
                              <img
                                 :src="getImageUrlP(item.produto.images[0].name)"
                                alt="Pré-visualização da imagem"
                                style="
                                  max-width: 100px;
                                  max-height: 100px;
                                  object-fit: cover;
                                "
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
                        <q-btn
                          style="color: #f27c38; right: -25px"
                          flat
                          icon="close"
                        />
                      </q-item>
                    </div>
                    <div
                      v-if="pacote.items && pacote.items.length == 0"
                      class="text-subtitle"
                    >
                      Sem items
                    </div>

                    <q-card-section>
                      <q-form>
                        <q-input
                          filled
                          v-model="pacote.nota"
                          label="Nota"
                          disable
                          type="textarea"
                          prepend-icon="edit"
                          class="q-mt-md"
                        />

                        <q-input
                          v-if="pacote.valor > 0"
                          filled
                          v-model="pacote.valor"
                          label="Valor"
                          disable
                          prepend-icon="edit"
                          class="q-mt-md"
                        />

                        <q-input
                          v-if="pacote.valor <= 0"
                          filled
                          v-model="pacote.valor2"
                          label="Digite aqui a cotacao"
                          prepend-icon="edit"
                          class="q-mt-md"
                        />
                      </q-form>
                    </q-card-section>
                    <div v-if="getUserComputed.scope == 'empresa'" class="">
                      <q-btn
                        v-if="pacote.valor <= 0"
                        :disable="registering"
                        color="amber"
                        class="text-black"
                        glossy
                        label="Submeter Cotacao"
                        @click="atualizarCotacao(pacote.id, pacote.valor2)"
                      >
                        <q-spinner-hourglass
                          v-if="registering"
                          color="white"
                          size="24px"
                        />
                      </q-btn>

                      <q-btn
                        v-if="pacote.status == 'PUBLICO' && pacote.valor > 0"
                        :disable="registering"
                        color="amber"
                        class="text-black"
                        glossy
                        label="Começar a entregar!"
                        @click="handleClick"
                      >
                        <q-spinner-hourglass
                          v-if="registering"
                          color="white"
                          size="24px"
                        />
                      </q-btn>

                      <q-btn
                        v-if="
                          pacote.status == 'ENTREGANDO' &&
                          pacote.status == 'ENTREGANDO'
                        "
                        :disable="registering"
                        style="
                          background-color: hsl(203, 75%, 54%);
                          color: white;
                          position: fixed;
                          bottom: 13px;
                          left: 50%;
                          transform: translateX(-50%);
                          z-index: 9999; /* Garantir que esteja acima de outros elementos */
                        "
                        label="Terminar entrega"
                        @click="handleClick2"
                      >
                        <q-spinner-hourglass
                          v-if="registering"
                          color="white"
                          size="24px"
                        />
                      </q-btn>

                      <q-badge
                        v-if="pacote.status == 'CANCELADO_C'"
                        class="text-bold"
                        style="height: 40px"
                        transparent
                        align="middle"
                        color="red"
                      >
                        Você Cancelou
                      </q-badge>

                      <q-badge
                        v-if="pacote.status == 'CANCELADO_E'"
                        class="text-bold"
                        style="height: 40px"
                        transparent
                        align="middle"
                        color="red"
                      >
                        O Entregador Cancelou
                      </q-badge>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { format } from "date-fns";
import apiMethods from "src/router/api.js";
import { useRoute } from "vue-router";
import store from "src/store/index.js";

export default {
  name: "ListPackageFormPage",
  components: {},
  data() {
    return {
      clickCount: 0,
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
      user: null,
    };
  },
  computed: {
    showMap() {
      return store.state.showMap;
    },
    getUserComputed() {
      return store.state.user;
    },
  },
  methods: {
    toggleMap() {
      store.mutations.toggleMap;
    },
    getUser() {
      this.user = store.getters.user;
      return store.getters.user;
    },
    getImageUrl(imageName) {
      return apiMethods.baseURL()+ `/storage/personalize_images/${imageName}`;
    },
    getImageUrlP(imageName) {
      return apiMethods.baseURL()+`/storage/product_images/${imageName.name}`;
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
        status != "PUBLICO" &&
        this.user.entregadores.length > 0 &&
        this.user.entregadores[0].id == this.form.entregador_id
      );
    },
    async ListPackages() {
      this.getUser();
      try {
        const response = await apiMethods.tsakissaHistorico();
        // const response = await apiMethods.getPedidosPersonalizadosPublicos();
        this.ListPackage = response.data;
        console.log(this.ListPackage);
        this.carregando = false;
      } catch (error) {
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
        const response = await apiMethods.getHistoricoPedidosPersonalizados();
        this.ListHistoryPackage = response.data;
        this.carregando = false;
      } catch (error) {
        console.error("Erro ao cancelar pacote:", error);
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message: "Erro ao cancelar pacote. Por favor, tente novamente.",
        });
      }
    },
    async atualizarCotacao(id, cotacao) {
      try {
        this.registering = true;
        const response = await apiMethods.atualizarCotacao(id, {
          cotacao: cotacao,
        });
        this.form = response.data;
        this.ListPackages();
        // Converter strings de data em objetos Date
        this.form.horaDeLevantamento = new Date(this.form.hora_de_entrega);
        this.form.horaDeEntrega = new Date(this.form.hora_de_entrega);
        console.log(response.data);
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
    handleClick(status) {
      this.clickCount += 1;
      if (this.clickCount === 3) {
        this.entregarPackage(status);
        this.clickCount = 0; // Reseta o contador após chamar o método
      }
    },
    handleClick2() {
      this.clickCount += 1;
      if (this.clickCount === 3) {
        this.atualizarStatusPedidoPersonalizado();
        this.clickCount = 0; // Reseta o contador após chamar o método
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
