<template>
  <div class="ver-page" style="background-color: #f2f2f2; height: 100vh">
    <!-- heider -->
    <q-toolbar
      style="z-index: 99; border-bottom: 1px solid rgba(0, 0, 0, 0.1)"
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
        <q-toolbar-title
          >Detalhes do Pedido: Cod: #{{ form.id }}
        </q-toolbar-title>
      </div>

      <div style="width: 56px"></div>
      <div v-if="form.tipo == 'PEDIDO'" class="pedido">
        <div class="row q-my-auto text-center q-mr-md text-bold">
          <span v-if="form.status == 'PUBLICO'" class="text-primary" label=""
            >Publico
          </span>
          <span v-if="form.status == 'CANCELADO_C'" class="text-orange"
            >Voce Cancelou
          </span>
          <span v-if="form.status == 'FALHA'" class="text-red" color="red">
            O vendedor cancelou
          </span>
          <span v-if="form.status == 'CANCELADO_A'" class="text-orange"
            >Cancelado
          </span>
          <span v-if="form.status == 'RECEBIDO'" class="text-primary"
            >Pendente
          </span>
          <span v-if="form.status == 'ENTREGUE'" class="text-green"
            >Entregue
          </span>
        </div>

        <!-- Cancelar -->
        <q-btn
          v-if="form.status == 'RECEBIDO' && !form.aprovado"
          :disable="registering"
          style="
            background-color: #f25c05;
            color: white;
            position: fixed;
            bottom: 13px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999; /* Garantir que esteja acima de outros elementos */
          "
          label="Cancelar"
          @click="confirmAction('CANCELADO_C')"
        >
          <q-spinner-hourglass v-if="registering" color="white" size="24px" />
        </q-btn>

        <!-- Modal de Confirmação -->
        <q-dialog v-model="showConfirm">
          <q-card>
            <q-card-section class="row items-center">
              <q-icon name="warning" color="warning" size="24px" />
              <span class="q-ml-sm">Tem certeza que deseja continuar?</span>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="red" v-close-popup />
              <q-btn
                flat
                label="Confirmar"
                color="green"
                @click="confirmClick"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!--
          <q-badge
            v-if="form.status == 'CANCELADO'"
            class="text-bold"
            style="height: 40px"
            transparent
            align="middle"
            color="red"
          >
            Você Cancelou
          </q-badge>


  <q-badge
            v-if="form.status == 'ENTREGUE'"
            class="text-bold"
            style="height: 40px"
            transparent
            align="middle"
            color="green"
          >
            Entregue
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
          </q-badge> -->
      </div>
    </q-toolbar>

    <!--
    <LMap
      style="background-color: #f2f2f2; margin-top: 60px"
      v-if="!carregando && form.id && false"
      ref="mapPage"
      :markers="markers"
      :mapHeight="mapHeight"
    /> -->

    <div
      v-if="!carregando && form.id"
      class="full-width lex flex-star1 q-pl-xl q-pr-xl q-pb-xl"
    >
      <q-item>
        <q-item-section side>
          <q-avatar icon="card_giftcard" rounded size="80px"></q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ formatarDataHora(form.created_at) }}</q-item-label>
          <q-item-label caption>{{
            formatarData(form.created_at)
          }}</q-item-label>
        </q-item-section>
        <q-item-section v-if="form.tipo == 'PACOTE'" side
          >{{ form.valor }} MT</q-item-section
        >
        <q-item-section v-if="form.tipo == 'PEDIDO'" side
          >{{ form.total }} MT</q-item-section
        >
      </q-item>

      <q-badge
        v-if="form.status == 'RECEBIDO' "
        outline
        color="primary"
        label="Pendente"
      />

      <q-timeline color="secondary">
        <q-timeline-entry
          :title="form.empresa?.nome"
          subtitle="Origem"
          icon="my_location"
        >
          <div v-if="form.hora_de_levantamento">
            Hora De Levantamento:
            {{ formatarDataHora(form.horaDeLevantamento) }}
          </div>

          <div v-if="isDelivering(form.status)" class="text-subtitle text-bold">
            <q-icon name="person" size="20px" />
            {{ form.sender.name + " " + form.sender.apelido }}
          </div>

          <!-- Botões para Chamada e SMS -->
          <div v-if="isDelivering(form.status)" class="button-group q-mt-md">
            <q-btn
              @click="makeCall(form.sender.telefone)"
              icon="phone"
              color="positive"
            />
            <q-btn
              @click="sendSMS(form.sender.telefone)"
              icon="message"
              color="secondary"
              class="q-ml-md"
            />
          </div>
        </q-timeline-entry>

        <q-timeline-entry :title="form.destino" subtitle="Destino" icon="place">
          <div v-if="form.hora_de_entrega">
            Hora de entrega: {{ formatarDataHora(form.horaDeEntrega) }}
          </div>

          <div v-if="isDelivering(form.status)" class="text-subtitle text-bold">
            <q-icon name="person" size="20px" />
            {{ form.receiver.name + " " + form.receiver.apelido }}
          </div>
          <!-- Botões para Chamada e SMS -->
          <div v-if="isDelivering(form.status)" class="button-group q-mt-md">
            <q-btn
              @click="makeCall(form.receiver.telefone)"
              icon="phone"
              color="positive"
            />
            <q-btn
              @click="sendSMS(form.receiver.telefone)"
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

      <!-- itens do pacote -->
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

          <!-- Botão de Chat -->
          <q-item-section>
            <q-btn
              :label="'enviar menssagem'"
              icon="chat"
              color="accent"
              @click="openChat"
              class="full-width q-shadow-2"
              style="border-radius: 20px; height: 50px"
            />
          </q-item-section>
          <!-- <q-btn style="color: #f27c38; right: -25px" flat icon="close" /> -->
        </q-item>
      </div>

      <div v-if="form.items && form.items.length == 0" class="text-subtitle">
        Sem items
      </div>

      <!-- itens do pedido -->
      <div
        v-for="(item, index) in form.itens_pedido"
        :key="index"
        class="q-mb-md"
      >
        <q-item class="rounded-borders">
          <q-item-section avatar>
            <q-avatar rounded>
              <div v-if="item.produto.images.length > 0">
                <img
                  :src="getImageUrl(item.produto.images[0])"
                  alt="Pré-visualização da imagem"
                  style="max-width: 100px; max-height: 100px"
                />
              </div>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <span> {{ item.preco }} MZ</span>
          </q-item-section>

          <q-item-section side class="row">
            <span>Qtd: {{ item.quantidade }}</span>
          </q-item-section>

          <q-item-section>
            <div class="q-mt-sm">
              <!-- Status Vendedor -->
              <q-chip
                v-if="user.scope === 'cliente' && item.aprovado_vendedor"
                color="green"
                text-color="white"
                outline
                label="Vendedor ✔️"
                class="q-mb-xs"
                style="transition: all 0.3s; cursor: default"
              />
              <q-chip
                v-if="user.scope === 'cliente' && !item.aprovado_vendedor"
                color="grey-5"
                text-color="white"
                outline
                label="Vendedor ⏳"
                class="q-mb-xs"
                style="transition: all 0.3s; cursor: default"
              />

              <!-- Status Cliente -->
              <q-chip
                v-if="user.scope === 'empresa' && item.aprovado_cliente"
                color="green"
                text-color="white"
                outline
                label="Cliente ✔️"
                class="q-mb-xs"
                style="transition: all 0.3s; cursor: default"
              />
              <q-chip
                v-if="user.scope === 'empresa' && !item.aprovado_cliente"
                color="grey-5"
                text-color="white"
                outline
                label="Cliente ⏳"
                class="q-mb-xs"
                style="transition: all 0.3s; cursor: default"
              />

              <!-- Chat -->
              <q-badge
                color="blue"
                text-color="white"
                class="q-pa-sm flex items-center cursor-pointer q-mb-xs shadow-hover"
                style="
                  border-radius: 25px;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
                  transition: all 0.3s;
                "
                @mouseover="hover = true"
                @mouseleave="hover = false"
                @click="openChat(item.produto_id)"
              >
                <q-icon name="chat" size="20px" class="q-mr-sm" />
                Falar com Vendedor
              </q-badge>

              <!-- Aprovar / Remover -->
              <div class="q-mt-sm flex flex-wrap">
                <q-badge
                  v-if="user.scope === 'cliente' && !item.aprovado_cliente"
                  color="green"
                  text-color="white"
                  label="Aprovar"
                  class="q-mr-sm q-mb-sm shadow-hover"
                  @click="aprovarCliente(item)"
                  style="transition: all 0.3s; cursor: pointer"
                />
                <q-badge
                  v-if="user.scope === 'cliente' && !item.aprovado_cliente"
                  color="red"
                  text-color="white"
                  label="Remover"
                  class="q-mr-sm q-mb-sm shadow-hover"
                  @click="RemoverCliente(item)"
                  style="transition: all 0.3s; cursor: pointer"
                />

                <q-badge
                  v-if="user.scope === 'empresa' && !item.aprovado_vendedor"
                  color="green"
                  text-color="white"
                  label="Aprovar"
                  class="q-mr-sm q-mb-sm shadow-hover"
                  @click="aprovarVendedor(item)"
                  style="transition: all 0.3s; cursor: pointer"
                />
                <q-badge
                  v-if="user.scope === 'empresa' && !item.aprovado_vendedor"
                  color="red"
                  text-color="white"
                  label="Remover"
                  class="q-mr-sm q-mb-sm shadow-hover"
                  @click="RemoverVendedor(item)"
                  style="transition: all 0.3s; cursor: pointer"
                />
              </div>
            </div>
          </q-item-section>

          <!-- <q-btn style="color: #f27c38; right: -25px" flat icon="close" /> -->
        </q-item>
      </div>

      <div
        v-if="form.itens_pedido && form.itens_pedido.length == 0"
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
            v-if="form.tipo == 'PACOTE'"
            filled
            v-model="form.valor"
            label="Valor"
            disable
            prepend-icon="edit"
            class="q-mt-md"
          />
          <q-input
            v-if="form.tipo == 'PEDIDO'"
            filled
            v-model="form.total"
            label="Total"
            disable
            prepend-icon="edit"
            class="q-mt-md"
          />
        </q-form>
      </q-card-section>

      <q-btn
        v-if="form.status == 'PUBLICO' && user.scope == 'entregador'"
        :disable="registering"
        style="
          background-color: #f25c05;
          color: white;
          position: fixed;
          bottom: 13px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999; /* Garantir que esteja acima de outros elementos */
        "
        label="Começar a entregar!"
        @click="handleClick"
      >
        <q-spinner-hourglass v-if="registering" color="white" size="24px" />
      </q-btn>

      <q-btn
        v-if="form.status == 'ENTREGANDO' && form.status == 'ENTREGANDO'"
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

    <!-- skeleton -->
    <div
      style="background-color: #f2f2f2; margin-top: 60px"
      v-if="carregando"
      class="full-width lex flex-star1 q-pa-xl"
    >
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

        <q-timeline-entry title="Destino" :subtitle="form.destino" icon="place">
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

    <div
      v-if="!carregando && !form.id"
      class="text-h6 text-bold full-width full-heigth text-center q-pa-xl"
    >
      Pacote nao encontrado!
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import LMap from "../../components/LMap.vue";
import apiMethods from "src/router/api.js";
import store from "src/store/index.js";

export default {
  name: "PackageFormPage",
  components: {
    // LMap,
  },
  data() {
    return {
      clickCount: 0,
      showConfirm: false,
      nextStatus: null,
      markers: [],
      mapHeight: "200px",
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
      serviceOptions: ["DELIVER_MAN", "TRACK"], // Example: service options
      showItemsSection: false, // Example: flag to show/hide item section based on logic
      carregando: true,
      registering: false,
      id: "",
      user: null,
    };
  },
  computed: {
    getUserComputed() {
      return store.state.user;
    },
  },
  methods: {
    async aprovarCliente(item) {
    try {
      const response =   await apiMethods.aprovarItemCliente(item.id, true);
      item.aprovado_cliente = true;
      this.$q.notify({ type: "positive", message: response.data.message });
    } catch (error) {
      this.$q.notify({ type: "negative", message: "Erro ao aprovar item" });
    }
  },

  async reprovarCliente(item) {
    try {
      const response =  await apiMethods.aprovarItemCliente(item.id, false);
      item.aprovado_cliente = false;
      this.$q.notify({ type: "warning", message: response.data.message });
    } catch (error) {
      this.$q.notify({ type: "negative", message: "Erro ao reprovar item" });
    }
  },
  async aprovarVendedor(item) {
    try {
      const response = await apiMethods.aprovarItemVendedor(item.id, true);
      item.aprovado_vendedor = true;
      this.$q.notify({
        type: "positive",
        message: response.data.message,
      });
    } catch (error) {
      this.$q.notify({
        type: "negative",
        message: "Erro ao aprovar item",
      });
    }
  },

  // Vendedor reprova item
  async reprovarVendedor(item) {
    try {
      const response =  await apiMethods.aprovarItemVendedor(item.id, false);
      item.aprovado_vendedor = false;
      this.$q.notify({
        type: "warning",
        message: response.data.message,
      });
    } catch (error) {
      this.$q.notify({
        type: "negative",
        message: "Erro ao reprovar item",
      });
    }
  },
    handleClick() {
      this.clickCount += 1;
      if (this.clickCount === 3) {
        this.entregarPackage();
        this.clickCount = 0; // Reseta o contador após chamar o método
      }
    },
    openChat(produto_id) {
      // Lógica para abrir a janela de chat
      const id = this.$route.params.id;
      // console.log(this.form)
      this.$router.push(
        "/chat/" + this.form.empresa.user_id + "/" + produto_id
      );
    },
    voltar() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },
    handleClick2() {
      this.clickCount += 1;
      if (this.clickCount === 3) {
        this.atualizarStatusPedidoPersonalizado();
        this.clickCount = 0; // Reseta o contador após chamar o método
      }
    },
    getImageUrl(imageName) {
      return apiMethods.baseURL() + `/storage/product_images/${imageName.name}`;
    },
    getUser() {
      this.user = store.getters.user;
      return store.getters.user;
    },
    setUser(value) {
      store.commit("setUser", value);
    },

    formatarDataHora(data) {
      if (!data) return "";
      const date = new Date(data);
      return `${date.getHours()}:${date.getMinutes()}`;
      // return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    },
    confirmAction(status) {
      console.log("confirmAction");
      this.nextStatus = status;
      this.showConfirm = true;
    },
    confirmClick() {
      this.showConfirm = false;
      this.cancelarPackage();
    },

    formatarData(data) {
      const dataObj = new Date(data);
      return dataObj.toLocaleDateString();
    },

    async fetchPackage(id) {
      this.getUser();

      try {
        const tipo = this.$route.params.tipo;
        if (!tipo) {
          return;
        }
        this.id = id;
        let response;
        if (tipo == "PEDIDO") {
          response = await apiMethods.getPedidoById(id);
        }
        if (tipo == "PACOTE") {
          response = await apiMethods.getPedidoPersonalizadoById(id);
        }

        this.form = response.data;

        // Converter strings de data em objetos Date
        this.form.horaDeLevantamento = new Date(this.form.hora_de_levantamento);
        this.form.horaDeEntrega = new Date(this.form.hora_de_entrega);

        console.log(this.form);
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

    async atualizarStatusPedidoPersonalizado() {
      try {
        this.registering = true;
        // console.log(this.id);
        const response = await apiMethods.atualizarStatusPedidoPersonalizado(
          this.id,
          { status: "ENTREGUE" }
        );
        this.form = response.data;

        // Converter strings de data em objetos Date
        this.form.horaDeLevantamento = new Date(this.form.hora_de_entrega);
        this.form.horaDeEntrega = new Date(this.form.hora_de_entrega);
        // console.log(response.data);
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
    async cancelarPackage() {
      try {
        this.registering = true;
        // console.log("YUIOUYTRTYUI");
        // return
        const response = await apiMethods.cancelarPedido(this.id);
        this.form = response.data;

        // Converter strings de data em objetos Date
        this.form.horaDeLevantamento = new Date(this.form.hora_de_entrega);
        this.form.horaDeEntrega = new Date(this.form.hora_de_entrega);
        // console.log(response.data);
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
        status != "PUBLICO" &&
        this.user.entregadores.length > 0 &&
        this.user.entregadores[0].id == this.form.entregador_id
      );
    },
  },
  beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      const { id } = to.params;
      // this.id=id;

      await vm.fetchPackage(id);
    });
  },
};
</script>

<style>
style > .q-timeline__title {
  margin-top: 0;
  margin-bottom: 16px;
}

.ver-page {
  animation: slide-up 0.5s ease-out;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
.shadow-hover:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.35);
}
</style>
