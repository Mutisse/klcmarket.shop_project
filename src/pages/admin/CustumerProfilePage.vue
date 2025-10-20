<template>
  <q-page v-if="user">
    <!-- Menu de Historico e Recentes -->
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

    <!-- Perfill -->
    <q-expansion-item
      v-model="expanded"
      icon="perm_identity"
      label="Perfil"
      :caption="user.name"
    >
      <q-card>
        <q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label class="text-h6">Nome</q-item-label>
                <q-item-label>{{ user.name }}</q-item-label>
                <q-separator spaced />
                <q-item-label class="text-h6">Email</q-item-label>
                <q-item-label>{{ user.email }}</q-item-label>
                <q-separator spaced />
                <q-item-label class="text-h6" v-if="entregador"
                  >Telefone</q-item-label
                >
                <q-item-label v-if="entregador">{{
                  entregador.telefone
                }}</q-item-label>
                <q-separator spaced v-if="entregador" />
                <q-item-label class="text-h6" v-if="entregador"
                  >Status</q-item-label
                >
                <q-item-label v-if="entregador">{{
                  entregador.status
                }}</q-item-label>
                <q-separator spaced v-if="entregador" />
                <q-item-label class="text-h6" v-if="entregador"
                  >Morada</q-item-label
                >
                <q-item-label v-if="entregador">{{
                  entregador.morrada
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator />
          <div class="row q-gutter-md q-mt-md">
            <q-btn
              label="Editar Perfil"
              color="primary"
              @click="openModal"
              icon="edit"
            />
            <q-btn
              label="Trocar Senha"
              color="secondary"
              @click="showChangePasswordModal = true"
              icon="lock"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!-- Historico e Recentes -->
    <div v-if="!showMap" class="full-width q-pa-md">
      <!-- Skeleton -->
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

      <!-- Recentes -->
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
            Sem peditos ativos desponives.
          </div>
        </div>
      </transition>

      <!-- Historico  -->
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
            v-if="ListHistoryPackage.length == 0 && !carregando"
            class="text-subtitle2 text-center"
          >
            Historico vazio.
          </div>
        </div>
      </transition>
    </div>

    <!-- Modal para Editar Perfil -->
    <q-dialog v-model="showEditProfileModal" persistent full-width>
      <q-card>
        <q-card-section>
          <div class="text-h6">Editar Perfil</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit="updateProfile" class="q-gutter-md">
            <q-input filled v-model="form.name" label="Nome" />
            <q-input filled v-model="form.email" label="Email" />
            <q-input
              filled
              v-model="form.telefone"
              label="Telefone"
              v-if="entregador"
            />
            <q-input
              filled
              v-model="form.morrada"
              label="Morada"
              v-if="entregador"
            />
            <div class="q-mt-md">
              <q-btn type="submit" label="Salvar" color="primary" />
              <q-btn
                flat
                label="Cancelar"
                color="primary"
                @click="cancelarEvent"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal para Trocar Senha -->
    <q-dialog v-model="showChangePasswordModal" persistent full-width>
      <q-card>
        <q-card-section>
          <div class="text-h6">Trocar Senha</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit="changePassword" class="q-gutter-md">
            <q-input
              filled
              v-model="passwordForm.password"
              type="password"
              label="Senha Antiga"
              :error="!!errors.password"
              :error-message="errors.password"
            />
            <q-input
              filled
              v-model="passwordForm.newPassword"
              type="password"
              label="Nova Senha"
              :error="!!errors.newPassword"
              :error-message="errors.newPassword"
            />
            <q-input
              filled
              v-model="passwordForm.confirmPassword"
              type="password"
              label="Confirmar Nova Senha"
              :error="!!errors.confirmPassword"
              :error-message="errors.confirmPassword"
            />
            <div class="q-mt-md">
              <q-btn type="submit" label="Trocar Senha" color="primary" />
              <q-btn
                flat
                label="Cancelar"
                color="primary"
                @click="showChangePasswordModal = false"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>

  <!--  Mapa -->
  <!-- <q-page
    class="flex flex-start"
    style="background-color: #e25555"
  >
    <LMap
      class="full-width"
      ref="mapPage"
      :markers="markers"
      :mapHeight="'100vh'"
    />
  </q-page> -->

  <q-page
    v-if="!user"
    class="flex flex-center text-subtitle text-bold"
  >
    Usuario nao encontrado!
  </q-page>
</template>
<script>
import apiMethods from "src/router/api.js";
import store from "src/store/index.js";
import { format } from "date-fns";
import LMap from "../../components/LMap.vue";
import { useRoute } from "vue-router";

export default {
  components: {
    // LMap,
  },
  data() {
    return {
      expanded: false,
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

      user: {
        id: null,
        name: "",
        email: "",
        created_at: "",
        updated_at: "2024-07-17T05:53:12.000000Z",
        empresas: [],
        entregadores: [],
        telefone: "",
        morrada: "",
      },
      showEditProfileModal: false,
      showChangePasswordModal: false,
      formp: {
        name: "",
        email: "",
        telefone: "",
        morrada: "",
      },
      originalForm: {
        name: "",
        email: "",
        telefone: "",
        morrada: "",
      },
      passwordForm: {
        password: "",
        newPassword: "",
        confirmPassword: "",
      },
      errors: {},
    };
  },
  computed: {
    entregador() {
      return this.user.entregadores.length ? this.user.entregadores[0] : null;
    },
    showMap() {
      return false;
    },
  },
  mounted() {
    // this.getUser();
    this.ListPackages();
  },
  methods: {
    toggleMap() {
      store.mutations.toggleMap;
    },
    async ListPackages() {
      try {
        this.registering = true;
        const response = await apiMethods.getAtiveOrdersByCustumer();
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

    async fetcUser(id) {
      this.id = id;
      try {
        this.registering = true;
        const response = await apiMethods.getUserById(id);
        this.user = response.data;
        this.carregando = false;
      } catch (error) {
        this.user =null;
        this.registering = false;
        console.error("Erro ao cancelar pacote:", error);
        // this.$q.notify({
        //   color: "red",
        //   textColor: "white",
        //   icon: "report_problem",
        //   message: "Erro ao cancelar pacote. Por favor, tente novamente.",
        // });
      }
    },
    async ListHistoryPackages(id) {
      try {
        this.registering = true;
        const response = await apiMethods.getHistoryOrdersByCustumer(id);
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
      this.$router.push({ path: `/admin/custumers/order/${id}` });
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
    cancelarEvent() {
      // Restore original form values
      this.form = { ...this.originalForm };
      this.showEditProfileModal = false;
    },
    openModal() {
      // Store original form values before opening the modal
      this.originalForm = { ...this.form };
      this.showEditProfileModal = true;
    },
    getUser() {
      this.form = { ...store.getters.user };
      this.user = { ...store.getters.user };
      return store.getters.user;
    },
    setUser(value) {
      store.commit("setUser", value);
    },
    validateForm() {
      return this.form.email && this.form.name;
    },
    async updateProfile() {
      if (this.validateForm()) {
        try {
          this.registering = true; // Define registering como true durante o login

          const userData = {
            user_email: this.form.email,
            user_name: this.form.name,
          };

          // Chama a API para atualizar o perfil
          let response = await apiMethods.updateCliente(this.user.id, userData);
          console.log(response.data);

          this.setUser(response.data.cliente);
          this.showEditProfileModal = false;
          this.getUser();
          // Exemplo de notificação de sucesso
          this.$q.notify({
            color: "green",
            textColor: "white",
            icon: "cloud_done",
            message: "Dados editados com sucesso!",
          });
        } catch (error) {
          // Exemplo de tratamento de erro
          console.error("Erro ao editar dados:", error);
          this.getUser();
          this.$q.notify({
            color: "red",
            textColor: "white",
            icon: "report_problem",
            message: "Erro ao editar dados. Por favor, tente novamente.",
          });
        }
      }
    },
    formatErrors(errors) {
      let formattedErrors = {};
      for (const [key, value] of Object.entries(errors)) {
        formattedErrors[key] = Array.isArray(value) ? value[0] : value;
      }
      return formattedErrors;
    },
    async changePassword() {
      this.errors = {};
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.errors.newPassword = "As senhas não coincidem";
        return;
      }
      if (this.passwordForm.newPassword.length < 8) {
        this.errors.newPassword =
          "A nova senha deve ter pelo menos 8 caracteres";
        return;
      }

      try {
        let response = await apiMethods.resetPassword(
          this.user.id,
          this.passwordForm
        );
        this.$q.notify({
          type: "positive",
          message: "Senha trocada com sucesso",
        });
        this.showChangePasswordModal = false;
      } catch (error) {
        console.error("Erro ao editar dados:", error);
        // Handle validation errors returned by the API
        if (error.response && error.response.data.errors) {
          if (
            error.response.data.errors.password.includes(
              "The password field confirmation does not match."
            )
          ) {
            this.errors.password = "A confirmação da senha não corresponde.";
          }
        } else {
          // Handle other errors
          this.$q.notify({
            color: "red",
            textColor: "white",
            icon: "report_problem",
            message: "Erro ao trocar senha. Por favor, tente novamente.",
          });
        }
      }
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    },
  },

  beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      const { id } = to.params;
      // this.id=id;

      await vm.fetcUser(id);
      await vm.ListHistoryPackages(id);

    });
  },
};
</script>

<style>
#ods {
}
</style>
