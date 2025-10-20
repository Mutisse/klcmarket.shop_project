<template>
  <div padding  style="background-color: #f2f2f5; margin-top: 70px;   min-height:100vh">
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
        <q-toolbar-title> Perfil </q-toolbar-title>
      </div>
      <div style="width: 56px"></div>
    </q-toolbar>
  </div >
    <q-card class="q-ma-md" >
      <q-card-section>
        <!-- <div class="text-h5">Perfil</div> -->
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section>
              <q-avatar icon="person" size="100px"> </q-avatar>
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
  </div>
</template>

<script>
import apiMethods from "src/router/api.js";
import store from "src/store/index.js";

export default {
  data() {
    return {
      user: {
        id: null,
        name: "",
        email: "",
        created_at: "",
        updated_at: "2024-07-17T05:53:12.000000Z",
        empresas: [],
        entregadores: [],
      },
      showEditProfileModal: false,
      showChangePasswordModal: false,
      form: {
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
  },
  mounted() {
    this.getUser();
  },
  methods: {
    cancelarEvent() {
      // Restore original form values
      this.form = { ...this.originalForm };
      this.showEditProfileModal = false;
    }, voltar() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
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
    },formatErrors(errors) {
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
console.log(this.passwordForm)
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
          if (error.response.data.errors.password.includes("The password field confirmation does not match.")) {
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
  },
};
</script>

<style>
#ods {
}
</style>
