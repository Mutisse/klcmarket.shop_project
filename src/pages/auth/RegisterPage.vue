```vue
<template>
  <div
    class="fullscreen bg-gradient column items-center justify-center q-pa-sm q-pa-md-md"
  >
    <q-card
      flat
      bordered
      class="q-pa-sm q-pa-md-md"
      style="max-width: 500px; width: 100%"
    >
      <!-- Logo -->
      <q-card-section class="text-center">
        <img
          src="~assets/logo-klc-market1.png"
          alt="Logo KLC Market"
          class="q-mb-md logo"
        />
        <div class="text-h5 text-bold text-blue-12">Criar Conta</div>
      </q-card-section>

      <!-- Textos contextuais por etapa -->
      <q-card-section v-if="step === 1" class="text-center text-grey-8">
        Insira seu número de WhatsApp ou e-mail para receber o código de
        verificação.
      </q-card-section>
      <q-card-section v-if="step === 2" class="text-center text-grey-8">
        Digite o código de verificação enviado para
        {{
          form.verificationMethod === "whatsapp"
            ? "seu WhatsApp"
            : "seu e-mail"
        }}.
      </q-card-section>
      <q-card-section v-if="step === 3" class="text-center text-grey-8">
        Preencha seus dados para finalizar o cadastro.
      </q-card-section>

      <q-card-section>
        <!-- Etapa 1: Escolha de método e entrada -->
        <div v-if="step === 1" class="fade-in">
          <q-form @submit.prevent="sendOtp">
            <q-radio
              v-model="form.verificationMethod"
              val="whatsapp"
              label="Verificar via WhatsApp"
              color="blue-12"
              class="q-mb-sm"
            />
            <q-radio
              v-model="form.verificationMethod"
              val="email"
              label="Verificar via E-mail"
              color="blue-12"
              class="q-mb-md"
            />

            <q-input
              filled
              v-model="form.input"
              :label="
                form.verificationMethod === 'whatsapp'
                  ? 'Número do WhatsApp'
                  : 'E-mail'
              "
              :type="form.verificationMethod === 'whatsapp' ? 'tel' : 'email'"
              :prepend-icon="
                form.verificationMethod === 'whatsapp' ? 'phone' : 'email'
              "
              required
              :rules="
                form.verificationMethod === 'whatsapp'
                  ? [(val) => /^\d{9}$/.test(val) || 'Número inválido']
                  : [(val) => /.+@.+\..+/.test(val) || 'E-mail inválido']
              "
              @input="validateInput"
              class="q-mb-md"
            >
              <template
                v-slot:prepend
                v-if="form.verificationMethod === 'whatsapp'"
              >
                +258
              </template>
            </q-input>

            <q-btn
              type="submit"
              label="Enviar OTP"
              color="blue-12"
              :disable="processing"
              class="full-width q-mt-sm q-btn-lg"
              unelevated
              rounded
            >
              <q-spinner v-if="processing" color="white" size="24px" />
            </q-btn>
          </q-form>
        </div>

        <!-- Etapa 2: Verificação de OTP -->
        <div v-if="step === 2" class="fade-in">
          <q-form @submit.prevent="verifyOtp">
            <q-input
              filled
              v-model="form.otp"
              label="Seu código de verificação"
              type="tel"
              required
              prepend-icon="lock_open"
              :rules="[
                (val) => val.length === 6 || 'Código deve ter 6 dígitos',
              ]"
              class="q-mb-md"
            />
            <div class="row justify-between q-mt-md button-container">
              <q-card-section v-if="step === 2" class="text-center text-grey-8">
                Número ou e-mail incorreto? Volte para atualizar após verificar
                o código. </q-card-section
              ><q-btn
                flat
                label="Voltar"
                color="blue-5"
                :disable="!step1Completed || processing"
                @click="goBack"
                class="q-btn-lg"
              />
              <q-btn
                type="submit"
                label="Verificar código"
                color="blue-12"
                :disable="processing"
                class="q-btn-lg"
                unelevated
                rounded
              >
                <q-spinner v-if="processing" color="white" size="24px" />
              </q-btn>
            </div>
            <q-btn
              flat
              label="Alterar método"
              color="blue-5"
              @click="resetToStep1"
              class="full-width q-mt-sm q-btn-lg"
            />
          </q-form>
        </div>

        <!-- Etapa 3: Preenchimento de dados -->
        <div v-else-if="step === 3" class="fade-in">
          <q-form @submit.prevent="register">
            <q-input
              filled
              v-model="form.name"
              label="Nome"
              required
              prepend-icon="person"
              :rules="[
                (val) => val.length > 2 || 'Nome deve ter mais de 2 caracteres',
              ]"
              class="q-mb-md"
            />
            <q-input
              filled
              v-model="form.email"
              label="E-mail ou Numero"
              type="email"
              required
              prepend-icon="email"
              class="q-mb-md"
              :rules="[(val) => /.+@.+\..+/.test(val) || 'E-mail inválido']"
            />
            <q-input
              filled
              v-model="form.password"
              label="Senha"
              type="password"
              required
              prepend-icon="lock"
              class="q-mb-md"
              :rules="[
                (val) =>
                  /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,}$/.test(val) ||
                  'Mínimo 8 caracteres, 1 maiúscula, 1 número',
              ]"
            >
              <q-tooltip>
                Mínimo 8 caracteres, 1 maiúscula, 1 número
              </q-tooltip>
            </q-input>
            <q-input
              filled
              v-model="form.password_confirmation"
              label="Confirme a senha"
              type="password"
              required
              prepend-icon="lock"
              class="q-mb-md"
              :rules="[
                (val) => val === form.password || 'Senhas não coincidem',
              ]"
            />
            <div class="row items-center q-mb-md">
              <q-checkbox
                v-model="form.terms"
                label="Li e concordo com os "
                required
                class="text-blue-5"
              />
              <span class="text-blue-5">
                <a href="/termos-de-servico" target="_blank"
                  >Termos & Condições</a
                >
              </span>
            </div>

            <div class="row justify-between q-mt-md button-container">
              <q-btn
                flat
                label="Voltar"
                color="blue-5"
                :disable="!step2Completed || registering"
                @click="goBack"
                class="q-btn-lg"
              />
              <q-btn
                type="submit"
                label="Criar conta"
                color="blue-12"
                :disable="registering"
                class="q-btn-lg"
                unelevated
                rounded
              >
                <q-spinner v-if="registering" color="white" size="24px" />
              </q-btn>
            </div>
          </q-form>
        </div>
      </q-card-section>

      <!-- Link para login -->
      <q-card-section class="text-center text-blue-5">
        <div>
          Já tem uma conta?
          <q-btn
            flat
            label="Login"
            color="blue-12"
            @click="goToLogin"
            class="q-btn-lg"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import apiMethods from "src/router/api.js";

export default {
  name: "RegisterPage",
  data() {
    return {
      step: 1,
      processing: false,
      registering: false,
      step1Completed: false,
      step2Completed: false,
      form: {
        verificationMethod: "whatsapp", // whatsapp ou email
        input: "", // telefone ou email
        otp: "",
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        terms: false,
      },
    };
  },
  methods: {
    async sendOtp() {
      if (!this.form.input) {
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "warning",
          message: `Por favor, insira um ${
            this.form.verificationMethod === "whatsapp"
              ? "número válido"
              : "e-mail válido"
          }!`,
        });
        return;
      }

      try {
        this.processing = true;
        let payload = {};

        if (this.form.verificationMethod === "email") {
          payload = {
            destination: this.form.input,
            channel: "email",
          };
        } else if (this.form.verificationMethod === "whatsapp") {
          payload = {
            destination: `258${this.form.input}`,
            channel: "whatsapp",
          };
        } else if (this.form.verificationMethod === "sms") {
          payload = {
            destination: `258${this.form.input}`,
            channel: "sms",
          };
        }

        const response = await apiMethods.sendOtp(payload);
        this.$q.notify({
          color: "green",
          textColor: "white",
          icon: "check",
          message: `OTP enviado com sucesso para ${
            this.form.verificationMethod === "whatsapp" ? "WhatsApp" : "e-mail"
          }!`,
        });
        this.step1Completed = true;
        this.step = 2;
      } catch (error) {
console.log(error)
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "error",
          message: "Erro ao enviar OTP. Tente novamente!",
        });
      } finally {
        this.processing = false;
      }
    },
  async verifyOtp() {
  if (!this.form.otp || this.form.otp.length !== 6) {
    this.$q.notify({
      color: "red",
      textColor: "white",
      icon: "warning",
      message: "Por favor, insira um código de 6 dígitos!",
    });
    return;
  }

  try {
    this.processing = true;
    const payload = {
      destination:
        this.form.verificationMethod === "email"
          ? this.form.input
          : `+258${this.form.input}`,
      otp: this.form.otp,
    };

    const response = await apiMethods.verifyOtp(payload);

    this.$q.notify({
      color: "green",
      textColor: "white",
      icon: "check",
      message: "Código verificado com sucesso!",
    });
    this.step2Completed = true;
    this.step = 3;
  } catch (error) {
    console.log(error);
    this.$q.notify({
      color: "red",
      textColor: "white",
      icon: "error",
      message: "Código inválido. Tente novamente!",
    });
  } finally {
    this.processing = false;
  }
}
,
    async register() {
      if (this.validateForm()) {
        try {
          this.registering = true;
          const userData = {
            number:
              this.form.verificationMethod === "whatsapp"
                ? `+258${this.form.input}`
                : null,
            email:
              this.form.verificationMethod === "email"
                ? this.form.input
                : this.form.email,
            name: this.form.name,
            password: this.form.password,
            password_confirmation: this.form.password_confirmation,
          };

          const response = await apiMethods.register(userData);
          this.$q.notify({
            color: "green",
            textColor: "white",
            icon: "cloud_done",
            message: "Registro realizado com sucesso!",
          });
           fbq("track", "Purchase", {
          content_ids: contentIds,
          content_type: "product",
          num_items: totalItems,
          value: totalValue,
          currency: "MZN",
        });
          this.$router.push("/login");
          this.clearForm();
        } catch (error) {
          this.$q.notify({
            color: "red",
            textColor: "white",
            icon: "error",
            message:
              error.response?.data?.message ||
              "Erro ao registrar. Tente novamente!",
          });
        } finally {
          this.registering = false;
        }
      }
    },
    validateInput() {
      if (
        this.form.verificationMethod === "whatsapp" &&
        !/^\d{9}$/.test(this.form.input)
      ) {
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "warning",
          message: "Número deve ter 9 dígitos!",
        });
      } else if (
        this.form.verificationMethod === "email" &&
        !/.+@.+\..+/.test(this.form.input)
      ) {
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "warning",
          message: "E-mail inválido!",
        });
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
      const passwordComplexity = /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,}$/;
      if (!passwordComplexity.test(this.form.password)) {
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "warning",
          message:
            "A senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um número!",
        });
        return false;
      }
      return true;
    },
    goBack() {
      if (this.step === 2 && this.step1Completed) {
        this.step = 1;
      } else if (this.step === 3 && this.step2Completed) {
        this.step = 2;
      } else {
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "warning",
          message: "Conclua a etapa atual antes de voltar!",
        });
      }
    },
    resetToStep1() {
      this.step = 1;
      this.step1Completed = false;
      this.step2Completed = false;
      this.form.otp = "";
    },
    clearForm() {
      this.form.input = "";
      this.form.otp = "";
      this.form.name = "";
      this.form.email = "";
      this.form.password = "";
      this.form.password_confirmation = "";
      this.form.terms = false;
      this.form.verificationMethod = "whatsapp";
      this.step1Completed = false;
      this.step2Completed = false;
      this.step = 1;
    },
    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%);
}
.q-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.q-btn {
  transition: all 0.3s ease;
  min-height: 48px; /* Acessibilidade para toque */
}
.q-btn-lg {
  font-size: 16px;
  padding: 12px 24px;
}
.logo {
  max-width: 120px;
  width: 100%;
}
.fade-in {
  animation: fadeIn 0.3s ease-in;
}
.button-container {
  flex-direction: row;
  gap: 8px;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsividade */
@media (max-width: 600px) {
  .q-card {
    padding: 12px;
    margin: 8px;
  }
  .logo {
    max-width: 80px; /* Logo menor em celulares */
  }
  .q-btn-lg {
    font-size: 14px;
    padding: 10px 16px;
  }
  .button-container {
    flex-direction: column; /* Botões empilhados em telas pequenas */
  }
  .button-container .q-btn {
    width: 100%;
  }
  .text-h5 {
    font-size: 1.2rem; /* Título menor */
  }
  .text-grey-8 {
    font-size: 0.9rem; /* Texto contextual menor */
  }
}

@media (min-width: 601px) and (max-width: 1024px) {
  .q-card {
    padding: 16px;
    margin: 16px;
  }
  .logo {
    max-width: 100px;
  }
  .q-btn-lg {
    font-size: 15px;
  }
  .button-container {
    flex-direction: row; /* Botões lado a lado em tablets */
  }
  .text-grey-8 {
    font-size: 1rem;
  }
}
</style>
```
