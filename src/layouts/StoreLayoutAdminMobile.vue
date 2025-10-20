<!-- src/components/Header.vue -->
<template>
  <div class="container">
    <q-header class="q-mb-md q-pa-md text-start bg-white">
      <q-toolbar
        style="
          position: fixed;
          top: 0px;
          width: 100%;
          left: 0;
          display: flex;
          justify-content: center;
          z-index: 99999;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        "
        class="bg-white q-pt-md q-pb-md"
      >
        <div class="text-h6 text-black">
          <q-icon :name="icon" size="xs" class="q-mr-sm" />
          {{ title }}
        </div>
        <div style="flex: 1; text-align: center">
          <q-toolbar-title> Carrinho </q-toolbar-title>
        </div>
        <q-btn
          style="border-radius: 1rem; position: relative"
          class="col-2 bg-black text-grey"
          @click="toggleLeftDrawer"
          icon="widgets"
        >
          <q-badge
            v-if="unread_count > 0"
            color="red"
            class="q-badge--top-right"
            style="
              position: absolute;
              top: 4px;
              right: 6px;
              transform: translate(50%, -50%);
            "
          >
            {{ unread_count }}
          </q-badge>
        </q-btn>
      </q-toolbar>

      <q-separator
        style="left: 0"
        class="absolute full-width"
        color="gray"
        inset
      />
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above>
      <q-list>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-btn flat icon="email" style="padding-left: 0px">
              <q-badge color="red" v-if="unread_count > 0" floating>{{
                unread_count
              }}</q-badge>
            </q-btn>
          </q-item-section>
          <q-item-section v-if="user" @click="$router.push('/messages')">
            <q-item-label>Menssagens</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable  to="support"  v-ripple>
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Suporte</q-item-label>
          </q-item-section>
        </q-item>


        <q-item v-if="user &&!isOnlyAdmin" clickable @click="logout" v-ripple>
            <q-item-section avatar>
              <q-icon name="exit_to_app" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Sair</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if="user && isOnlyAdmin" clickable to="/" v-ripple>
            <q-item-section avatar>
              <q-icon name="exit_to_app" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Sair</q-item-label>
            </q-item-section>
          </q-item>

        <q-item v-if="!user" clickable to="/login" v-ripple>
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Entrar</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Suporte -->
    <div class="q-pa-md q-gutter-sm">
      <q-dialog
        v-model="dialog"
        persistent
        :maximized="maximizedToggle"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card class="bg-white">
          <q-header class="q-mb-md text-start bg-white text-black">
            <q-toolbar>
              <q-btn
                flat
                round
                dense
                @click="dialog = false"
                size="md"
                icon="arrow_back"
              ></q-btn>
              <q-toolbar-title>
                <q-card-section style="padding-bottom: 0px; padding-top: 0px">
                  <h2 class="text-h6">Perguntas e Respostas</h2>
                </q-card-section>
              </q-toolbar-title>
            </q-toolbar>
          </q-header>
          <SupportPage />

          <q-page-sticky
            @click="contactSupport"
            position="bottom-right"
            :offset="[18, 18]"
          >
            <q-avatar class="bg-green glowing-shadow-add" rounded size="48px">
              <img src="~assets/whatsapp-icon-white.png" />
            </q-avatar>
          </q-page-sticky>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import store from "src/store/index.js";
import apiMethods from "src/router/api.js";
import SupportPage from "pages/SupportPage.vue";

export default {
  components: {
    SupportPage,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      leftDrawerOpen: false,
      dialog: false,
      maximizedToggle: true,
      unread_count: 0,
    };
  },
  computed: {
    user() {
      return store.state.user;
    },
    isOnlyAdmin() {
      return this.$route.meta.requiredScopes.includes("admin");
    },
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    contactSupport() {
      // Adicione a lógica para redirecionar ao WhatsApp
      window.open("https://wa.me/877140136", "_blank");
    },
    async logout() {
      try {
        this.$q.loading.show({
          message: "Terminando sua sessao",
        });
        // Chama a API para fazer login
        let response = await apiMethods.logout();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.$q.loading.hide();
        store.commit("clearUser");
        //  console.log(response.data.user)
        this.$router.push("/");
        store.commit("clearUser");
        this.$q.notify({
          color: "green",
          textColor: "white",
          icon: "cloud_done",
          message: "Volte sempre, obrigado.",
        });
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.$router.push("/login");
        store.commit("clearUser");
      } finally {
        this.$q.loading.hide();
      }
    },
    async fetchCountUnread() {
      if (!store.state.user) {
        return;
      }
      try {
        // Chama a API para fazer login
        let response = await apiMethods.fetchCountUnread();
        this.unread_count = response.data.unread_count || 0;
        // console.log(response);
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
      } finally {
      }
    },
  },
  mounted() {
    this.fetchCountUnread();
  },
};
</script>

<style scoped>
/* Estilos personalizados para o cabeçalho */
</style>
