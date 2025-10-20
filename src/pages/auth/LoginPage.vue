<template>
  <div class="login-container">
    <!-- Background moderno -->
    <div class="modern-background">
      <div class="floating-elements">
        <div class="floating-card"></div>
        <div class="floating-bag"></div>
        <div class="floating-tag"></div>
      </div>
    </div>

    <!-- Header profissional -->
    <q-header elevated class="modern-header">
      <q-toolbar class="q-px-xl">
        <q-toolbar-title class="flex items-center">
          <img
            src="~assets/logo-klc-market1.png"
            alt="KLC Market"
            class="header-logo"
            @click="goToHome"
            style="cursor: pointer"
          />
          <span class="logo-text">KLC Market</span>
        </q-toolbar-title>

        <q-btn
          unelevated
          @click="goToStore"
          dense
          size="md"
          icon="store"
          class="store-btn"
          label="Explorar Loja"
        />
      </q-toolbar>
    </q-header>

    <!-- Área principal -->
    <div class="main-content">
      <!-- Welcome Screen -->
      <div
        class="welcome-screen"
        :class="{ 'fade-out': showLoginForm }"
        v-show="!showLoginForm"
      >
        <div class="welcome-content">
          <!-- Logo grande -->
          <div class="welcome-logo" @click="goToHome" style="cursor: pointer">
            <img
              src="~assets/logo-klc-market1.png"
              alt="KLC Market"
              class="main-logo"
            />
          </div>

          <!-- Título principal -->
          <h1 class="welcome-title">
            Bem-vindo ao <span class="brand-highlight">KLC Market</span>
          </h1>

          <!-- Subtítulo -->
          <p class="welcome-subtitle">
            A melhor experiência de compras online. Acesse sua conta e descubra
            ofertas exclusivas.
          </p>

          <!-- Lista de features -->
          <div class="features-list">
            <div class="feature-item">
              <q-icon name="verified" class="feature-icon" />
              <span>Compras 100% seguras</span>
            </div>
            <div class="feature-item">
              <q-icon name="local_shipping" class="feature-icon" />
              <span>Entrega rápida</span>
            </div>
            <div class="feature-item">
              <q-icon name="support_agent" class="feature-icon" />
              <span>Suporte 24/7</span>
            </div>
          </div>

          <!-- Loading indicator com dots animados -->
          <div class="loading-indicator">
            <div class="pulse-dots-container">
              <div class="pulse-dot"></div>
              <div class="pulse-dot"></div>
              <div class="pulse-dot"></div>
            </div>
            <p class="loading-text">Preparando sua experiência...</p>
          </div>
        </div>
      </div>

      <!-- Login Form Screen -->
      <div
        class="login-screen"
        :class="{ 'fade-in': showLoginForm }"
        v-show="showLoginForm"
      >
        <div class="form-wrapper">
          <q-card class="login-form-card">
            <!-- Logo no topo do formulário -->
            <div class="form-logo" @click="goToHome" style="cursor: pointer">
              <img
                src="~assets/logo-klc-market1.png"
                alt="KLC Market"
                class="form-logo-img"
              />
            </div>

            <!-- Conteúdo do formulário -->
            <div class="form-content">
              <!-- Step 1: Login -->
              <div v-if="step === 1" class="form-step">
                <div class="form-header">
                  <p class="form-description">
                    Digite suas credenciais para acessar
                  </p>
                </div>

                <q-form
                  class="auth-form"
                  @submit.prevent="login"
                  ref="loginForm"
                >
                  <div class="input-field">
                    <q-input
                      filled
                      v-model="form.email"
                      label="Email"
                      type="email"
                      required
                      class="modern-input"
                      :rules="emailRules"
                      lazy-rules
                      @blur="validateField('email')"
                    >
                      <template v-slot:prepend>
                        <q-icon name="email" class="input-icon" />
                      </template>
                    </q-input>
                  </div>

                  <div class="input-field">
                    <q-input
                      filled
                      v-model="form.password"
                      label="Senha"
                      type="password"
                      required
                      class="modern-input"
                      :rules="passwordRules"
                      lazy-rules
                      @blur="validateField('password')"
                    >
                      <template v-slot:prepend>
                        <q-icon name="lock" class="input-icon" />
                      </template>
                    </q-input>
                  </div>

                  <div class="form-options">
                    <q-btn
                      flat
                      label="Esqueceu a senha?"
                      color="primary"
                      @click="showResetPass(2)"
                      :disable="registering"
                      class="forgot-link"
                    />
                  </div>

                  <!-- Botão de Login Laranja Sólido -->
                  <q-btn
                    type="submit"
                    label="Acessar Minha Conta"
                    color="primary"
                    :disable="registering || !isFormValid"
                    class="login-btn"
                    size="lg"
                    :class="{ 'btn-disabled': !isFormValid }"
                  >
                    <template v-if="registering">
                      <q-spinner-hourglass size="20px" class="q-mr-sm" />
                      Entrando...
                    </template>
                    <template v-else>
                      <q-icon name="login" class="q-mr-sm" />
                    </template>
                  </q-btn>
                </q-form>

                <div class="form-footer">
                  <p class="footer-text">
                    Novo no KLC Market?
                    <q-btn
                      flat
                      label="Criar conta gratuita"
                      color="primary"
                      @click="goToRegister"
                      class="register-link"
                    />
                  </p>
                </div>
              </div>

              <!-- Step 2: Método recuperação -->
              <div v-if="step === 2" class="form-step">
                <div class="form-header">
                  <h2 class="form-title">Recuperar Senha</h2>
                  <p class="form-description">
                    Escolha como deseja receber o código de verificação
                  </p>
                </div>

                <q-form @submit.prevent="forgotPasswordOtp" ref="recoveryForm">
                  <div class="method-selector">
                    <q-option-group
                      v-model="form.method"
                      :options="[
                        {
                          label: 'WhatsApp',
                          value: 'whatsapp',
                          description: 'Receba via mensagem',
                        },
                        {
                          label: 'Email',
                          value: 'email',
                          description: 'Receba no seu email',
                        },
                      ]"
                      type="radio"
                      class="method-options"
                      color="primary"
                    />
                  </div>

                  <div class="input-field">
                    <q-input
                      v-if="form.method === 'whatsapp'"
                      filled
                      v-model="form.email"
                      label="Número do WhatsApp"
                      type="tel"
                      required
                      class="modern-input"
                      :rules="phoneRules"
                      lazy-rules
                      @blur="validateField('phone')"
                    >
                      <template v-slot:prepend>
                        <div class="country-code">+258</div>
                      </template>
                    </q-input>

                    <q-input
                      v-if="form.method === 'email'"
                      filled
                      v-model="form.email"
                      label="Email"
                      type="email"
                      required
                      class="modern-input"
                      :rules="emailRules"
                      lazy-rules
                      @blur="validateField('email')"
                    >
                      <template v-slot:prepend>
                        <q-icon name="email" class="input-icon" />
                      </template>
                    </q-input>
                  </div>

                  <q-btn
                    type="submit"
                    :label="`Continuar com ${
                      form.method === 'whatsapp' ? 'WhatsApp' : 'Email'
                    }`"
                    color="primary"
                    :disable="processing || !isRecoveryValid"
                    class="submit-btn"
                    size="lg"
                    :class="{ 'btn-disabled': !isRecoveryValid }"
                  >
                    <template v-if="processing">
                      <q-spinner-hourglass size="20px" class="q-mr-sm" />
                      Enviando...
                    </template>
                  </q-btn>
                </q-form>

                <q-btn
                  flat
                  label="Voltar ao login"
                  color="grey-7"
                  class="back-btn"
                  @click="step = 1"
                />
              </div>

              <!-- Step 3: Verificação -->
              <div v-if="step === 3" class="form-step">
                <div class="form-header">
                  <h2 class="form-title">Verificação</h2>
                  <p class="form-description">
                    Digite o código de 6 dígitos enviado para seu
                    {{ form.method === "whatsapp" ? "WhatsApp" : "email" }}
                  </p>
                </div>

                <q-form @submit.prevent="forgotPasswordVerify" ref="otpForm">
                  <div class="input-field">
                    <q-input
                      filled
                      v-model="form.otp"
                      label="Código de verificação"
                      type="number"
                      required
                      class="modern-input otp-input"
                      :rules="otpRules"
                      lazy-rules
                      @blur="validateField('otp')"
                    >
                      <template v-slot:prepend>
                        <q-icon name="vpn_key" class="input-icon" />
                      </template>
                    </q-input>
                  </div>

                  <q-btn
                    type="submit"
                    label="Verificar código"
                    color="primary"
                    :disable="processing || !isOtpValid"
                    class="submit-btn"
                    size="lg"
                    :class="{ 'btn-disabled': !isOtpValid }"
                  >
                    <template v-if="processing">
                      <q-spinner-hourglass size="20px" class="q-mr-sm" />
                      Verificando...
                    </template>
                  </q-btn>
                </q-form>

                <q-btn
                  flat
                  label="Voltar"
                  color="grey-7"
                  class="back-btn"
                  @click="step = 2"
                />
              </div>

              <!-- Step 4: Nova senha -->
              <div v-if="step === 4" class="form-step">
                <div class="form-header">
                  <h2 class="form-title">Nova Senha</h2>
                  <p class="form-description">
                    Crie uma nova senha para sua conta
                  </p>
                </div>

                <q-form
                  @submit.prevent="forgotPasswordReset"
                  ref="passwordForm"
                >
                  <div class="input-field">
                    <q-input
                      filled
                      v-model="form.password"
                      label="Nova senha"
                      type="password"
                      required
                      class="modern-input"
                      :rules="newPasswordRules"
                      lazy-rules
                      @blur="validatePasswordStrength"
                    >
                      <template v-slot:prepend>
                        <q-icon name="lock" class="input-icon" />
                      </template>
                    </q-input>
                  </div>

                  <div class="input-field">
                    <q-input
                      filled
                      v-model="form.newPassword"
                      label="Confirmar nova senha"
                      type="password"
                      required
                      class="modern-input"
                      :rules="confirmPasswordRules"
                      lazy-rules
                      @blur="validateField('confirmPassword')"
                    >
                      <template v-slot:prepend>
                        <q-icon name="lock_reset" class="input-icon" />
                      </template>
                    </q-input>
                  </div>

                  <q-btn
                    type="submit"
                    label="Atualizar senha"
                    color="primary"
                    :disable="processing || !isPasswordResetValid"
                    class="submit-btn"
                    size="lg"
                    :class="{ 'btn-disabled': !isPasswordResetValid }"
                  >
                    <template v-if="processing">
                      <q-spinner-hourglass size="20px" class="q-mr-sm" />
                      Atualizando...
                    </template>
                  </q-btn>
                </q-form>

                <q-btn
                  flat
                  label="Voltar"
                  color="grey-7"
                  class="back-btn"
                  @click="step = 3"
                />
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiMethods from "src/router/api.js";
import store from "src/store/index.js";

export default {
  name: "LoginPage",
  data() {
    return {
      step: 1,
      form: {
        email: "",
        password: "",
        phone: "",
        method: "whatsapp",
        newPassword: "",
        otp: "",
      },
      registering: false,
      processing: false,
      showLoginForm: false,
      welcomeTimer: null,
      // Estados de validação
      emailValid: null,
      passwordValid: null,
      phoneValid: null,
      otpValid: null,
      newPasswordValid: null,
      confirmPasswordValid: null,
    };
  },
  computed: {
    getUserComputed() {
      return store.state.user;
    },
    isFormValid() {
      return this.emailValid === true && this.passwordValid === true;
    },
    isRecoveryValid() {
      if (this.form.method === "whatsapp") {
        return this.phoneValid === true;
      } else {
        return this.emailValid === true;
      }
    },
    isOtpValid() {
      return this.otpValid === true;
    },
    isPasswordResetValid() {
      return (
        this.newPasswordValid === true && this.confirmPasswordValid === true
      );
    },
    // Regras de validação
    emailRules() {
      return [
        (val) => !!val || "Email é obrigatório",
        (val) => /.+@.+\..+/.test(val) || "Email deve ser válido",
      ];
    },
    passwordRules() {
      return [
        (val) => !!val || "Senha é obrigatória",
        (val) => val.length >= 6 || "Senha deve ter pelo menos 6 caracteres",
      ];
    },
    phoneRules() {
      return [
        (val) => !!val || "Número é obrigatório",
        (val) => /^[0-9]{9}$/.test(val) || "Número deve ter 9 dígitos",
      ];
    },
    otpRules() {
      return [
        (val) => !!val || "Código é obrigatório",
        (val) => /^[0-9]{6}$/.test(val) || "Código deve ter 6 dígitos",
      ];
    },
    newPasswordRules() {
      return [
        (val) => !!val || "Nova senha é obrigatória",
        (val) => val.length >= 8 || "Mínimo 8 caracteres",
        (val) => /[A-Z]/.test(val) || "Pelo menos uma letra maiúscula",
        (val) => /[0-9]/.test(val) || "Pelo menos um número",
      ];
    },
    confirmPasswordRules() {
      return [
        (val) => !!val || "Confirme a senha",
        (val) => val === this.form.password || "As senhas não coincidem",
      ];
    },
  },
  mounted() {
    // Configura o timer para transição após 10 segundos
    this.welcomeTimer = setTimeout(() => {
      this.showLoginForm = true;
    }, 4000);
  },
  beforeUnmount() {
    // Limpa o timer se o componente for desmontado
    if (this.welcomeTimer) {
      clearTimeout(this.welcomeTimer);
    }
  },
  methods: {
    goToHome() {
      this.$router.push("/");
    },
    getUser() {
      return store.getters.user;
    },
    voltar() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },
    showResetPass(step) {
      this.step = step;
      this.resetValidationStates();
    },
    setUser(value) {
      store.commit("setUser", value);
    },
    goToLocalStore() {
      window.open("http://localhost:9000/", "_blank");
    },
    validateField(field) {
      switch (field) {
        case "email":
          this.emailValid = /.+@.+\..+/.test(this.form.email);
          break;
        case "password":
          this.passwordValid = this.form.password.length >= 6;
          break;
        case "phone":
          this.phoneValid = /^[0-9]{9}$/.test(this.form.email);
          break;
        case "otp":
          this.otpValid = /^[0-9]{6}$/.test(this.form.otp);
          break;
        case "confirmPassword":
          this.confirmPasswordValid =
            this.form.newPassword === this.form.password;
          break;
      }
    },
    validatePasswordStrength() {
      const password = this.form.password;
      this.newPasswordValid =
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password);
    },
    resetValidationStates() {
      this.emailValid = null;
      this.passwordValid = null;
      this.phoneValid = null;
      this.otpValid = null;
      this.newPasswordValid = null;
      this.confirmPasswordValid = null;
    },
    async login() {
      if (this.isFormValid) {
        try {
          this.registering = true;
          const userData = {
            email: this.form.email,
            password: this.form.password,
          };
          let response = await apiMethods.login(userData);
          localStorage.setItem("token", response.data.token);
          response = await apiMethods.getUser();
          this.setUser(response.data.user);

          if (response.data.user.scope === "entregador") {
            this.$router.push("/show-packs");
            return;
          }
          if (response.data.user.scope === "admin") {
            this.$router.push("/admin");
            return;
          }
          if (response.data.user.scope === "empresa") {
            this.$router.push("/s");
            return;
          }
          if (window.history.length > 1) {
            this.$router.go(-1);
          } else {
            this.$router.push("/");
          }
          localStorage.setItem("cart", JSON.stringify([]));
        } catch (error) {
          console.error("Erro ao fazer login:", error);
          if (error.response && error.response.status === 401) {
            this.$q.notify({
              color: "negative",
              textColor: "white",
              icon: "warning",
              position: "top-right",
              message: "Credenciais inválidas. Verifique seu email e senha.",
            });
          } else {
            this.$q.notify({
              color: "negative",
              textColor: "white",
              icon: "error",
              position: "top-right",
              message: "Erro ao fazer login. Tente novamente.",
            });
          }
        } finally {
          this.registering = false;
        }
      }
    },
    async forgotPasswordOtp() {
      if (this.isRecoveryValid) {
        try {
          this.registering = true;
          const response = await apiMethods.forgotPasswordOtp({
            email: this.form.email,
            method: this.form.method,
          });

          this.$q.notify({
            color: "positive",
            textColor: "white",
            icon: "check_circle",
            position: "top-right",
            message: "Código enviado com sucesso!",
          });

          this.step = 3;
        } catch (error) {
          console.error("Erro ao solicitar recuperação de senha:", error);
          this.$q.notify({
            color: "negative",
            textColor: "white",
            icon: "error",
            position: "top-right",
            message:
              error.response?.data?.message ||
              "Erro ao processar a solicitação. Tente novamente.",
          });
        } finally {
          this.registering = false;
        }
      }
    },
    async forgotPasswordVerify() {
      if (this.isOtpValid) {
        try {
          this.registering = true;
          const response = await apiMethods.forgotPasswordVerify({
            otp: this.form.otp,
            number: this.form.email,
          });

          this.$q.notify({
            color: "positive",
            textColor: "white",
            icon: "check_circle",
            position: "top-right",
            message: "Código válido!",
          });

          this.step = 4;
        } catch (error) {
          console.error("Erro ao solicitar recuperação de senha:", error);
          this.$q.notify({
            color: "negative",
            textColor: "white",
            icon: "error",
            position: "top-right",
            message:
              error.response?.data?.message ||
              "Erro ao processar a solicitação. Tente novamente.",
          });
        } finally {
          this.registering = false;
        }
      }
    },
    async forgotPasswordReset() {
      if (this.isPasswordResetValid) {
        try {
          this.registering = true;
          const response = await apiMethods.forgotPasswordReset({
            number: this.form.email,
            method: this.method,
            password: this.form.password,
            newPassword: this.form.newPassword,
          });

          this.$q.notify({
            color: "positive",
            textColor: "white",
            icon: "check_circle",
            position: "top-right",
            message: "Senha atualizada com sucesso!",
          });

          this.step = 1;
          this.resetValidationStates();
        } catch (error) {
          console.error("Erro ao solicitar recuperação de senha:", error);
          this.$q.notify({
            color: "negative",
            textColor: "white",
            icon: "error",
            position: "top-right",
            message:
              error.response?.data?.message ||
              "Erro ao processar a solicitação. Tente novamente.",
          });
        } finally {
          this.registering = false;
        }
      }
    },
    goToRegister() {
      this.$router.push("/register");
    },
    goToStore() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
/* ESTILOS PARA CENTRALIZAÇÃO PERFEITA */

/* Welcome Screen - Centralização Absoluta */
.welcome-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 20;
}

.welcome-screen.fade-out {
  opacity: 0;
  transform: translateY(-20px);
  pointer-events: none;
}

.welcome-content {
  text-align: center;
  max-width: 600px;
  width: 90%;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.welcome-logo {
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
}

.welcome-logo .main-logo {
  height: 120px;
  width: auto;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  animation: gentleGlow 3s ease-in-out infinite alternate;
  transition: transform 0.3s ease;
}

.welcome-logo .main-logo:hover {
  transform: scale(1.05);
}

.welcome-title {
  font-size: 2.8rem;
  font-weight: 800;
  line-height: 1.1;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
}

.welcome-subtitle {
  font-size: 1.2rem;
  color: #5a6c7d;
  line-height: 1.6;
  margin-bottom: 40px;
  text-align: center;
  width: 100%;
  max-width: 500px;
}

.welcome-content .features-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
  width: 100%;
  align-items: center;
}

.welcome-content .feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
  opacity: 1;
  transform: translateY(0);
  animation: none;
}

.feature-icon {
  color: #e08b1b;
  font-size: 20px;
}

/* Loading indicator com dots animados - ANIMAÇÃO DINÂMICA */
.loading-indicator {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.pulse-dots-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.pulse-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #e08b1b;
  animation: pulseWave 1.5s ease-in-out infinite both;
}

.pulse-dot:nth-child(1) {
  animation-delay: 0s;
}

.pulse-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.pulse-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulseWave {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
    background: #e08b1b;
  }
  25% {
    transform: scale(1.3);
    opacity: 0.8;
    background: #f0a33a;
  }
  50% {
    transform: scale(1);
    opacity: 1;
    background: #e08b1b;
  }
  75% {
    transform: scale(0.7);
    opacity: 0.6;
    background: #c67a15;
  }
}

.loading-text {
  color: #5a6c7d;
  font-size: 1rem;
  margin: 0;
  text-align: center;
  font-weight: 500;
}

/* Login Screen - Centralização Perfeita no Meio */
.login-screen {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
}

.login-screen.fade-in {
  opacity: 1;
  transform: translateY(0);
}

.form-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* Logo no formulário - Centralizada */
.form-logo {
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}

.form-logo-img {
  height: 70px;
  width: auto;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.form-logo-img:hover {
  transform: scale(1.05);
}

.login-form-card {
  width: 100%;
  max-width: 420px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  overflow: hidden;
  padding: 40px 30px;
  margin: auto;
}

/* Botão Explorar Loja no Header */
.store-btn {
  background: linear-gradient(135deg, #e08b1b 0%, #f0a33a 100%) !important;
  color: white !important;
  border: none;
  border-radius: 25px;
  padding: 8px 20px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 15px rgba(224, 139, 27, 0.3);
}

.store-btn:hover {
  background: linear-gradient(135deg, #c67a15 0%, #e08b1b 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(224, 139, 27, 0.4) !important;
}

/* BOTÃO DE LOGIN LARANJA SÓLIDO */
.login-btn {
  width: 100%;
  height: 56px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: none;
  background: #e08b1b !important;
  color: white !important;
  border: none;
  box-shadow: 0 8px 25px rgba(224, 139, 27, 0.4);
  transition: all 0.3s ease;
  margin-top: 10px;
}

.login-btn:hover {
  background: #c67a15 !important;
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(224, 139, 27, 0.5);
}

.login-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(224, 139, 27, 0.4);
}

/* Botões dos outros steps */
.submit-btn {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  text-transform: none;
  background: #e08b1b !important;
  color: white !important;
  border: none;
  box-shadow: 0 8px 25px rgba(224, 139, 27, 0.3);
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #c67a15 !important;
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(224, 139, 27, 0.4);
}

/* Form Content - Centralizado */
.form-content {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-description {
  color: #5a6c7d;
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
  width: 100%;
  max-width: 300px;
  margin-bottom: 10px;
}

.auth-form {
  margin-bottom: 20px;
}

.input-field {
  margin-bottom: 20px;
}

.modern-input :deep(.q-field__control) {
  height: 50px;
  border-radius: 10px;
  background: #f8f9fa;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.modern-input :deep(.q-field__control:before) {
  border: none;
}

.modern-input :deep(.q-field--focused .q-field__control) {
  background: white;
  border-color: #e08b1b;
  box-shadow: 0 4px 15px rgba(224, 139, 27, 0.15);
}

.input-icon {
  color: #e08b1b !important;
}

.country-code {
  color: #5a6c7d;
  font-weight: 600;
  padding: 0 8px;
}

.form-options {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.forgot-link {
  font-weight: 600;
  text-transform: none;
  color: #e08b1b !important;
}

.form-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: center;
}

.footer-text {
  color: #5a6c7d;
  margin: 0;
  font-size: 0.9rem;
  text-align: center;
}

.register-link {
  font-weight: 700;
  text-transform: none;
  margin-left: 4px;
  color: #e08b1b !important;
}

.method-selector {
  margin-bottom: 25px;
}

.method-options :deep(.q-radio) {
  margin-bottom: 12px;
}

.method-options :deep(.q-radio__label) {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.method-options :deep(.q-radio__inner) {
  font-size: 18px;
}

.method-options :deep(.q-radio__inner--truthy) {
  color: #e08b1b !important;
}

.otp-input :deep(input) {
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 6px;
}

.back-btn {
  width: 100%;
  margin-top: 15px;
  text-transform: none;
  font-weight: 600;
}

/* Animações */
@keyframes gentleGlow {
  0% {
    filter: drop-shadow(0 5px 15px rgba(224, 139, 27, 0.2));
  }
  100% {
    filter: drop-shadow(0 8px 25px rgba(224, 139, 27, 0.4));
  }
}

/* RESPONSIVIDADE AVANÇADA */
/* Tablets */
@media (max-width: 1024px) {
  .welcome-title {
    font-size: 2.5rem;
  }

  .welcome-subtitle {
    font-size: 1.1rem;
  }

  .welcome-logo .main-logo {
    height: 100px;
  }

  .login-form-card {
    max-width: 400px;
    padding: 35px 25px;
  }
}

/* Tablets Pequenos e Mobile Grande */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 2.2rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
    margin-bottom: 30px;
  }

  .welcome-logo .main-logo {
    height: 80px;
  }

  .welcome-content .feature-item {
    font-size: 0.9rem;
  }

  .feature-icon {
    font-size: 18px;
  }

  .login-form-card {
    max-width: 350px;
    padding: 30px 20px;
    border-radius: 16px;
  }

  .form-description {
    font-size: 0.9rem;
  }

  .pulse-dot {
    width: 14px;
    height: 14px;
  }
}

/* Mobile Médio */
@media (max-width: 480px) {
  .welcome-title {
    font-size: 1.8rem;
  }

  .welcome-subtitle {
    font-size: 0.9rem;
  }

  .welcome-logo .main-logo {
    height: 70px;
  }

  .welcome-content {
    padding: 20px 15px;
  }

  .welcome-content .features-list {
    gap: 8px;
  }

  .welcome-content .feature-item {
    font-size: 0.85rem;
    gap: 8px;
  }

  .login-form-card {
    max-width: 100%;
    padding: 25px 15px;
    border-radius: 14px;
    margin: 20px;
  }

  .form-logo-img {
    height: 60px;
  }

  .form-description {
    font-size: 0.85rem;
  }

  .modern-input :deep(.q-field__control) {
    height: 48px;
  }

  .login-btn,
  .submit-btn {
    height: 48px;
    font-size: 0.95rem;
  }

  .pulse-dot {
    width: 12px;
    height: 12px;
  }

  .pulse-dots-container {
    gap: 10px;
  }
}

/* Mobile Pequeno */
@media (max-width: 360px) {
  .welcome-title {
    font-size: 1.6rem;
  }

  .welcome-subtitle {
    font-size: 0.85rem;
  }

  .welcome-logo .main-logo {
    height: 60px;
  }

  .login-form-card {
    padding: 20px 12px;
    margin: 15px;
  }

  .store-btn {
    padding: 6px 16px;
    font-size: 0.85rem;
  }

  .pulse-dot {
    width: 10px;
    height: 10px;
  }

  .pulse-dots-container {
    gap: 8px;
  }
}

/* Estilos do background e header */
.modern-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-card,
.floating-bag,
.floating-tag {
  background: linear-gradient(135deg, #e08b1b 0%, #f0a33a 100%);
  opacity: 0.05;
}

.modern-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  z-index: 30;
}

.header-logo {
  height: 35px;
  width: auto;
  margin-right: 12px;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.header-logo:hover {
  transform: scale(1.05);
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #e08b1b 0%, #f0a33a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-highlight {
  background: linear-gradient(135deg, #e08b1b 0%, #f0a33a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Override Quasar colors para laranja */
:deep(.q-btn--primary) {
  background: #e08b1b !important;
}

:deep(.q-btn--primary:hover) {
  background: #c67a15 !important;
}

:deep(.q-radio--checked) {
  color: #e08b1b !important;
}

:deep(.q-field--focused .q-field__control:after) {
  background: #e08b1b !important;
}

:deep(.q-field--focused .q-field__label) {
  color: #e08b1b !important;
}

:deep(.q-radio__inner--truthy) {
  color: #e08b1b !important;
}

:deep(.q-field--success .q-field__control:after) {
  background: #e08b1b !important;
}

.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-disabled:hover {
  transform: none !important;
  box-shadow: 0 8px 25px rgba(224, 139, 27, 0.3) !important;
}
</style>
