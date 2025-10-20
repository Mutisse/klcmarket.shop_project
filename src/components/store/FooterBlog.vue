<template>
  <footer class="klc-footer">
    <div class="footer-top">
      <div class="logo-col">
        <h4>KLC Market</h4>
        <p>Conectando o futuro do comércio digital.</p>
      </div>

      <div class="links-col">
        <h4>Explorar</h4>
        <ul>
          <li><a @click="$router.push('/sobre')">Sobre Nós</a></li>
          <li>
            <a @click="$router.push('/privacy-policy')"
              >Política de Privacidade</a
            >
          </li>
          <li>
            <a @click="$router.push('/termos-de-servico')">Termos de Serviço</a>
          </li>
          <li><a @click="$router.push('/support')">Ajuda</a></li>
        </ul>
      </div>

      <div class="contact-col q-mr-lg q-ml-lg">
        <h4>Contato</h4>
        <ul>
          <li v-if="false">Email: suporte@klcmarket.com</li>
          <li>Telefone: +258 87 370 3909</li>
          <li>
            Endereço: Av. Julius Nyerere, Campus Universitário Principal da UEM,
            Incubadora de Negócios da UEM, 3453, Maputo – Moçambique
          </li>
        </ul>
      </div>

      <div class="social-col" v-if="false">
        <h4>Siga-nos</h4>
        <div class="social-icons">
          <a href="#"
            ><img src="~assets/social/icons8-facebook-50.png" alt="Facebook"
          /></a>
          <a href="#"
            ><img src="~assets/social/icons8-insta-50.png" alt="Instagram"
          /></a>
          <a href="#" @click="contactSupport"
            ><img src="~assets/social/icons8-whatsapp-48.png" alt="Whatsapp"
          /></a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2024 KLC Market. Todos os direitos reservados.</p>
    </div>
    <div class="botao-lateral">
      <div @click="contactSupport">
        <img
          src="~assets/whatsapp-icon-green.png"
          alt="Whatsapp"
          calss="q-pl-md"
          style="width: 20px; margin-bottom: 3px"
        />
        <span>Fale conosco </span>
      </div>
    </div>

    <!-- Banner inicial -->
<div
  v-if="showBanner"
  class="notificacao-banner"
  @click="requestNotificationPermission"
>
  <q-icon name="notifications" size="20px" class="q-mr-sm" />
  <span>Ative as notificações para receber novidades!</span>
</div>

<!-- Botão lateral fixo depois -->
<div
  v-else
  class="botao-lateral-notificacao"
  @click="requestNotificationPermission"
>
  <q-icon name="notifications" size="28px" />
</div>
  </footer>
</template>

<script>
export default {
  name: "FAQPage",
   data() {
    return {
      showBanner: true,
      notificationsEnabled: false,
    };
  },
  mounted() {
    // Depois de 2 segundos, esconde o banner e mostra só o ícone
    setTimeout(() => {
      this.showBanner = false;
    }, 5000);
  },
  methods: {
    contactSupport() {
      fbq('trackCustom', 'ContatoViaWhatsApp');
      // Adicione a lógica para redirecionar ao WhatsApp
      window.open("https://wa.me/258873703909", "_blank");
    },
    voltar() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },
    async requestNotificationPermission() {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          this.notificationsEnabled = true;
          this.$q.notify({
            type: "positive",
            message: "Notificações ativadas com sucesso!",
          });
        } else {
          this.$q.notify({
            type: "warning",
            message:
              "Você bloqueou as notificações. Ative manualmente nas configurações do navegador.",
          });
        }
      } catch (err) {
        console.error("Erro ao ativar notificações:", err);
        this.$q.notify({
          type: "negative",
          message: "Erro ao ativar notificações.",
        });
      }
    },
  },
};
</script>
<style>
.notificacao-banner {
  position: fixed;
  top: 10px;
  right: 10px;
  background: #185f1c;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  z-index: 9999;
  animation: slideIn 0.5s ease;
}

.botao-lateral-notificacao {
  position: fixed;
  top: 40%;
  right: 0;
  background-color: #185f1c;
  color: white;
  padding: 12px;
  border-radius: 8px 0 0 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 9999;
  animation: pulsar 2s infinite ease-in-out;
}

/* Animações */
@keyframes slideIn {
  from {
    transform: translateX(150%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes pulsar {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulsar {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.botao-lateral {
  position: fixed;
  top: 40%;
  right: 0;
  background-color: #185f1c;
  color: white;
  padding: 10px 5px;
  border-radius: 8px 0 0 8px;
  writing-mode: vertical-rl; /* texto vertical de cima para baixo */
  text-orientation: mixed;
  font-family: Arial, sans-serif;
  font-size: 14px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

/* Estilo futurista avançado para o KLC Market com fundo claro */
.klc-footer {
  background: #f5f5f5 !important; /* Cor principal clara */
  color: #000; /* Texto em preto */
  padding: 50px 0;
  font-family: "Roboto", sans-serif;
  text-align: center;
  border-top: 3px solid #bd6513;
  position: relative;
  overflow: hidden;
}

/* Animação de luzes de fundo */
.klc-footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 100%;
  background: radial-gradient(circle, transparent, #bd651320, transparent);
  animation: pulse 6s infinite ease-in-out;
  z-index: 0;
}

/* Animação de pulsar nas luzes de fundo */
@keyframes pulse {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(25%);
  }
  100% {
    transform: translateX(0);
  }
}
h4 {
  font-size: 20px;
}
.footer-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  z-index: 1;
  position: relative;
}

.footer-top .logo-col h4 {
  font-size: 30px;
  color: #bd6513; /* Cor futurista */
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
}

.footer-top p {
  color: #333;
  margin: 10px 0;
}

.footer-top ul {
  list-style: none;
  padding: 0;
}

.footer-top ul li a {
  text-decoration: none;
  color: #333;
  margin: 10px 0;
  display: block;
  transition: all 0.3s ease;
  position: relative;
}

.footer-top ul li a::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  background-color: #bd6513;
  bottom: -3px;
  left: 0;
  transition: width 0.3s ease;
}

.footer-top ul li a:hover::after {
  width: 100%;
}

.footer-top ul li a:hover {
  color: #bd6513; /* Efeito hover futurista */
}

.footer-top .social-icons {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.footer-top .social-icons a img {
  width: 35px;
  height: 35px;
  filter: invert(100%);
  transition: transform 0.3s ease, filter 0.3s ease;
}

.footer-top .social-icons a:hover img {
  filter: invert(50%) sepia(100%) hue-rotate(120deg) saturate(500%);
  transform: scale(1.2); /* Escalonamento futurista no hover */
}

.footer-bottom {
  background: #ddd; /* Fundo mais claro */
  padding: 20px 0;
  margin-top: 30px;
  border-top: 1px solid #bbb;
}

.footer-bottom p {
  color: #555;
  margin: 0;
  font-size: 14px;
}

@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
    text-align: center;
  }

  .footer-top .logo-col,
  .footer-top .links-col,
  .footer-top .contact-col,
  .footer-top .social-col {
    margin-bottom: 0px;
  }
}
</style>
