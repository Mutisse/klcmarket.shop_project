<!-- src/components/Header.vue -->

<template>
  <q-layout>
    <q-page-container>
      <q-toolbar
        style="
          position: fixed;
          top: 0px;
          /* width: 70%; */
          /* left: 40; */
          display: flex;
          justify-content: space-between;
          z-index: 99;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        "
        class="bg-white q-pt-md q-pb-md"
      >
        <div class="text-h6 text-black">
          <q-btn
            style="border-radius: 1rem"
            class="col-2 bg-black text-grey"
            @click="toggleLeftDrawer"
            icon="menu"
          />
          <q-icon :name="currentTabIcon" size="xs" class="q-mr-sm" />
          {{ currentTabTitle }}
        </div>
        <!-- <div style="flex: 1; text-align: center">
            <q-toolbar-title>  </q-toolbar-title>
          </div> -->
      </q-toolbar>

      <q-separator
        style="left: 0"
        class="absolute full-width"
        color="gray"
        inset
      />

      <q-tab-panels v-model="activeTab" animated swipeable class="q-pt-md">
        <SalesTabPanel name="sales" />
        <ProductsTabPanel name="products" />
        <ListPackagePanel name="orders" />
        <!-- <q-tab-panel name="reviews">...</q-tab-panel> -->
        <!-- <q-tab-panel name="users">...</q-tab-panel> -->
        <ProfileStoreTabPanel name="info" />
        <!-- <q-tab-panel name="settings">...</q-tab-panel> -->
      </q-tab-panels>

      <!-- Menu Lateral para Desktop -->
      <q-drawer
        show-if-above
        v-model="leftDrawerOpen1"
        class="klc-header-2"
        side="left"
      >
        <q-list>
          <div class="logo">
            <h5>KLC Market</h5>
          </div>
          <q-item
            clickable
            v-for="tab in tabs"
            :key="tab.name"
            @click="activeTab = tab.name"
          >
            <q-item-section avatar>
              <q-icon :name="tab.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ tab.title }} </q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable @click="dialog = true" v-ripple>
            <q-item-section avatar>
              <q-btn flat icon="email" style="padding-left: 0px">
                <q-badge color="red" v-if="unread_count > 0" floating>{{
                  unread_count
                }}</q-badge>
              </q-btn>
            </q-item-section>
            <q-item-section
              v-if="isAuthenticated"
              @click="$router.push('/messages')"
            >
              <q-item-label>Menssagens</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable   @click="activeTab ='orders'" v-ripple>
            <q-item-section avatar>
              <q-btn flat icon="receipt" style="padding-left: 0px">
                <q-badge color="red" v-if="pendentOrders > 0" floating>{{
                  pendentOrders
                }}</q-badge>
              </q-btn>
            </q-item-section>
            <q-item-section

            >
              <q-item-label>Pedidos</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable to="support" v-ripple>
            <q-item-section avatar>
              <q-icon name="help" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Suporte</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-if="user && !isOnlyAdmin"
            clickable
            @click="logout"
            v-ripple
          >
            <q-item-section avatar>
              <q-icon name="exit_to_app" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Sair</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if="user && isOnlyAdmin" clickableclickable to="/" v-ripple>
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

      <q-dialog
        v-model="dialog"
        persistent
        :maximized="maximizedToggle"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card class="bg-white">
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
    </q-page-container>
  </q-layout>
</template>

<script>
import store from "src/store/index.js";
import apiMethods from "src/router/api.js";
import SupportPage from "pages/SupportPage.vue";
import ProductsTabPanel from "components/AdminStore/ProductsTabPanel.vue";
import ProfileStoreTabPanel from "components/AdminStore/ProfileStoreTabPanel.vue";
import ListPackagePanel from "components/AdminStore/ListPackagePanel.vue";
import SalesTabPanel from "components/AdminStore/SalesTabPanel.vue";

export default {
  components: {
    SupportPage,
    ProductsTabPanel,
    ProfileStoreTabPanel,
    ListPackagePanel,
    SalesTabPanel,
  },
  computed: {
    ShowPackageModal() {
      return store.state.ShowPackageModal;
    },
    isOnlyAdmin() {
      return this.$route.meta.requiredScopes.includes("admin");
    },
    isDesktop() {
      // Detecta se o usuário está usando um desktop ou um dispositivo móvel
      return this.$q.screen.gt.sm;
    },

    isAuthenticated() {
      return store.state.user ? true : false;
    },
    leftDrawerOpen() {
      // return true;
      return store.state.leftDrawerOpen;
    },
    totalItemsInCart() {
      return store.getters.totalItemsInCart;
    },
    user() {
      return store.state.user;
    },
    dashboard() {
      let user = this.user;
      if (user && user.scope) {
        console.log(user.scope);
        if (user.scope == "admin") {
          return "admin";
        }
        if (user.scope == "entregador") {
          return "/c/dashboard";
        }

        if (user.scope == "cliente") {
          return "/c/dashboard";
        }
      }
      return "/";
    },
  },

  props: {
    // title: {
    //   type: String,
    //   required: true,
    // },
    // icon: {
    //   type: String,
    //   required: true,
    // },
  },
  data() {
    return {
      leftDrawerOpen1: false,
      unread_count: 0,
      pendentOrders:0,
      title: "",
      icon: "",
      dialog: false,
      maximizedToggle: true,
      activeTab: "sales", // Aba ativa inicial
      currentTabTitle: "Estatísticas de Vendas", // Título da aba atual
      currentTabIcon: "bar_chart", // Ícone da aba atual
      tabs: [
        { name: "sales", icon: "bar_chart", title: "Vendas" },
        { name: "products", icon: "inventory", title: "Produtos" },
        // { name: "orders", icon: "receipt", title: "Pedidos" },
        // { name: "reviews", icon: "rate_review", title: "Avaliações" },
        // { name: "users", icon: "group", title: "Usuários" },
        { name: "info", icon: "store", title: "Informações" },
        // { name: "settings", icon: "settings", title: "Configurações" },
      ],
      // leftDrawerOpen: true, // Controla a abertura do drawer lateral
    };
  },

  watch: {
    activeTab(newVal) {
      this.updateTabTitle();
    },
  },
  methods: {
    toggleLeftDrawer() {
      store.commit("toggleLeftDrawer");
      this.leftDrawerOpen1 = this.leftDrawerOpen;
    },

    goToCart() {
      this.$router.push("/cart");
    },

    goToLogin() {
      this.$router.push("/login");
    },
    goToProfile() {
      this.$router.push("/c/profile");
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

    updateTabTitle() {
      const tabTitles = {
        info: "Informações da Loja",
        sales: "Estatísticas de Vendas",
        products: "Gestão de Produtos",
        orders: "Pedidos",
        reviews: "Avaliações e Feedback",
        users: "Gerenciamento de Usuários",
        settings: "Configurações da Loja",
      };
      const tabIcons = {
        info: "store",
        sales: "bar_chart",
        products: "inventory",
        orders: "receipt",
        reviews: "rate_review",
        users: "group",
        settings: "settings",
      };
      this.currentTabTitle = tabTitles[this.activeTab] || "Informações da Loja";
      this.currentTabIcon = tabIcons[this.activeTab] || "store";
    },

    contactSupport() {
      // Adicione a lógica para redirecionar ao WhatsApp
      window.open("https://wa.me/877140136", "_blank");
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
    async fetchPendentOrders() {
      if (!store.state.user) {
        return;
      }
      try {
        // Chama a API para fazer login
        let response = await apiMethods.fetchPendentOrders();
        this.pendentOrders = response.data.unread_count || 0;
        console.log(response);
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
      } finally {
      }
    },
  },
  mounted() {
    this.fetchCountUnread();
    this.fetchPendentOrders()
  },
};
</script>

<style>
/* Estilo futurista do Header */
.klc-header-2 {
  display: block;
  justify-content: space-between;
  align-items: center;
  background: #f5f5f5 !important; /* Cor principal */
  padding: 0px 20px;
  border-bottom: 3px solid #bd6513;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  /* z-index: 1000; Adicionando z-index alto para o header */
}

.klc-header-2::before {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, transparent, #bd651320, transparent);
  animation: pulse-header 6s infinite ease-in-out;
  z-index: 0;
}

@keyframes pulse-header {
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

/* Logo estilo futurista */
.logo h5 {
  font-size: 16px;
  color: #bd6513;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: bold;
  position: relative;
  z-index: 1;
}
</style>
