<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar >
        <q-btn flat round dense icon="menu" @click="toggleLeftDrawer"></q-btn>

        <q-toolbar-title>
          <q-btn flat @click="goHome" class="text-h5">Marketplace</q-btn>
        </q-toolbar-title>
        <q-input dense placeholder="Search..." v-model="search"  />
        <q-btn flat round dense icon="shopping_cart" @click="goToCart"></q-btn>
      <q-btn flat round dense icon="person" @click="goToLogin"></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above>
      <q-list>
        <q-item to="/c/dashboard" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>

        <!-- <q-item to="/current-orders" clickable v-ripple> -->
        <q-item to="/c/show-packs" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="list" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Pedidos Atuais</q-item-label>
          </q-item-section>
        </q-item>

        <!-- <q-item to="/delivery-history" clickable v-ripple> -->
        <q-item to="/c/show-packs" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="history" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Histórico de Entregas</q-item-label>
          </q-item-section>
        </q-item>

        <!-- <q-item to="/delivery-map"  @click="toggleMap" clickable v-ripple> -->
        <q-item to="/c/show-packs" @click="toggleMap" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="map" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Mapa de Entregas</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/c/profile" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Perfil</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/c/settings" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Configurações</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/support" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Suporte</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="logout" v-ripple>
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sair</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, defineAsyncComponent } from "vue";
import apiMethods from "src/router/api.js";
import { useRoute } from "vue-router";
import store from "src/store/index.js";
import { useQuasar } from "quasar";

export default {
  name: "DeliverServiceLayout",
  components: {
    // EssentialLink,
  },
  data() {
    return {
      search: '',
      leftDrawerOpen: false,
    };
  },
  computed: {
    showMap() {
      return store.state.showMap;
    },
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    doSearch() {
      console.log('Searching for:', this.search)
    },
    goToCart() {
      this.$router.push('/cart')
    },
    goToLogin() {
      this.$router.push('/login')
    },
    toggleMap() {
      store.commit("toggleMap");
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
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
        //  console.log(response.data.user)
        this.$router.push("/login");
        store.commit("clearUser");
        this.$q.notify({
          color: "green",
          textColor: "white",
          icon: "cloud_done",
          message: "Volte sempre, obrigado.",
        });
      } catch (error) {
        console.error("Erro ao fazer logout:", error);localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.$router.push("/login");
          store.commit("clearUser");
      } finally {
        this.$q.loading.hide();
      }
    },
  },
  mounted() {},
  setup() {
    const route = useRoute();
    const $q = useQuasar();

    return {
      route,
      $q,
    };
  },
};
</script>

<style></style>
