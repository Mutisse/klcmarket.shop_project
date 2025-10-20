<template>
  <q-page class="flex flex-center q-pa-xl" style="background-color: #f2f2f2">
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

        <q-timeline-entry title="Destino" :subtitle="form.destino" icon="place">
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
      <div v-if="form.items && form.items.length == 0" class="text-subtitle">
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

    <div v-if="!carregando && !form.id" class="text-h6 text-bold">
      Pacote nao encontrado!
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import apiMethods from "src/router/api.js"; // Verifique o alias utilizado, pode ser @ ou outro configurado no seu projeto Quasar

export default {
  name: "PackageFormPage",
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
      serviceOptions: ["DELIVER_MAN", "TRACK"], // Example: service options
      showItemsSection: false, // Example: flag to show/hide item section based on logic
      carregando: true,
      registering: false,
      id: "",
    };
  },
  methods: {
    async fetchPackage(id) {
      try {
        this.id = id;
        const response = await apiMethods.getPedidoPersonalizadoById(id);
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
    async cancelPackage() {
      try {
        this.registering = true;
        console.log(this.id);
        const response = await apiMethods.atualizarStatusPedidoPersonalizado(
          this.id,
          { status: "CANCELADO_C" }
        );
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
</style>
