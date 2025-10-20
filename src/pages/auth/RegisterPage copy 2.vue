<template>
  <div
    style="background-color: #f2f2f2"
    class="fullscreen bg-orange1 text-white column items-center justify-center"
  >
    <q-card-section>
      <div class="text-h5 text-center">
        <img
          src="~assets/logo-klc-market1.png"
          alt="Logo"
          class="q-mb-md"
          style="width: 100px"
        />
      </div>
    </q-card-section>

      <q-card-section>
        <div class="text-h5 text-center text-bold text-blue-12">Criar Conta</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="register">
          <q-input
            filled
            v-model="form.name"
            label="Nome"
            required
            prepend-icon="person"
          />
          <q-input
            filled
            v-model="form.email"
            label="Email"
            type="email"
            required
            prepend-icon="email"
            class="q-mt-md"
          />
          <q-input
            filled
            v-model="form.password"
            label="Senha"
            type="password"
            required
            prepend-icon="lock"
            class="q-mt-md"
          />

          <q-input
            filled
            v-model="form.password_confirmation"
            label="Confirme a senha"
            type="password"
            required
            prepend-icon="lock"
            class="q-mt-md"
          />
          <q-checkbox
            v-model="form.terms"
            label="Li e concordo com os Termos & Condições"
            required
            class="q-mt-md text-blue-5"
          />
          <q-btn
            type="submit"
            label="Criar conta"
            color="blue-12"
            :disable="registering"
            class="full-width q-mt-md"
          >
            <q-spinner-hourglass v-if="registering" color="white" size="24px" />
          </q-btn>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center text-blue-5">
        <div>
          Já tem uma conta?
          <q-btn flat label="Login" color="primary" @click="goToLogin" />
        </div>
      </q-card-section>

  </div>
</template>

<script>
import apiMethods from "src/router/api.js"; // Verifique o alias utilizado, pode ser @ ou outro configurado no seu projeto Quasar

export default {
  name: "RegisterPage",
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        terms: false,
      },
      registering: false, // Variável para controlar o estado de registro
    };
  },
  methods: {
    async register() {
      if (this.validateForm()) {
        try {
          this.registering = true; // Define registering como true durante o registro

          const userData = {
            name: this.form.name,
            email: this.form.email,
            password: this.form.password,
            password_confirmation: this.form.password_confirmation,
          };

          // Chama a API para registrar o usuário
          const response = await apiMethods.register(userData);

          // Exemplo de resposta da API
          // console.log("Resposta da API:", response.data);

          // Exemplo de notificação de sucesso
          this.$q.notify({
            color: "green",
            textColor: "white",
            icon: "cloud_done",
            message: "Registro realizado com sucesso!",
          });
          this.registering = false;
          this.$router.push("/login");
          // Limpa o formulário após o registro
          this.clearForm();
        } catch (error) {
          // Exemplo de tratamento de erro
          console.error("Erro ao registrar usuário:", error);

          if (error.response && error.response.status === 422) {
            this.$q.notify({
              color: "red",
              textColor: "white",
              icon: "report_problem",
              message:
                "Este usuário já existe. Por favor, escolha um email diferente.",
            });
          } else {
            this.$q.notify({
              color: "red",
              textColor: "white",
              icon: "report_problem",
              message: "Erro ao registrar usuário. Por favor, tente novamente.",
            });
          }

          this.registering = false; // Define registering como false após o registro
        }
      }
    },
    validateForm() {
      if (this.form.password !== this.form.password_confirmation) {
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "warning",
          message: "As senhas não coincidem!",
        });
        return false;
      }

      if (!this.validatePassword()) {
        return false;
      }

      return true;
    },
    clearForm() {
      this.form.name = "";
      this.form.email = "";
      this.form.password = "";
      this.form.password_confirmation = "";
    },
    validatePassword() {
      const password = this.form.password;
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /[0-9]/.test(password);
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (
        password.length < minLength
        //|| !hasUpperCase ||
        // !hasLowerCase ||
        // !hasNumbers
        // ||
        // !hasSpecialChars
      ) {
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "warning",
          message:
            "A senha deve ter pelo menos 8 caracteres e incluir letras maiúsculas, minúsculas, números e caracteres especiais.",
        });
        return false;
      }

      return true;
    },
    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.bg-orange {
  background-color: #ff8a00;
}
</style>
