<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-if="false" elevated>
      <q-toolbar style="background-color: #f29b30">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Glen Delivery</q-toolbar-title>

        <q-btn flat dense round icon="map" @click="toggleMap" >
          <q-badge align="top">cli v1.0.0</q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-if="false"  v-model="leftDrawerOpen">
      <q-list>
        <q-item v-if="getUser" :to="getUser.scope=='admin'?'admin':'/dashboard'" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="store" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Inicio</q-item-label>
          </q-item-section>
        </q-item>

          <q-item to="/show-packs" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="list" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Pedidos Atuais</q-item-label>
          </q-item-section>
        </q-item>

        <!-- <q-item to="/delivery-history" clickable v-ripple> -->
        <q-item to="/show-packs" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="history" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Histórico de Entregas</q-item-label>
          </q-item-section>
        </q-item>

        <!-- <q-item to="/delivery-map"  @click="toggleMap" clickable v-ripple> -->
        <q-item to="/show-packs" @click="toggleMap" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="map" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Mapa de Entregas</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/profiled" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Perfil</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/messages" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="message" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Configurações</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/supportd" clickable v-ripple>
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
            <q-item-label>Sair1</q-item-label>
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
import { useQuasar } from 'quasar'

export default {
  name: "DeliverServiceLayout",
  components: {
    // EssentialLink,
  },
  data() {
    return {
      leftDrawerOpen: false,
      unread_count:0
    };
  },
  computed: {
    showMap() {
      return store.state.showMap;
    },
    getUser() {
      return store.state.user;
    },
  },
  methods: {
    toggleMap() {
      store.commit("toggleMap");
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    async logout() {
        try {
          this.$q.loading.show({
          message: 'Terminando sua sessao'
        })
          // Chama a API para fazer login
          let response = await apiMethods.logout();
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          this.$q.loading.hide()
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
          console.error("Erro ao fazer logout:", error);localStorage.removeItem("token");
          localStorage.removeItem("user");
          this.$router.push("/login");
          store.commit("clearUser");
        } finally {
          this.$q.loading.hide()
        }
    },
    async fetchCountUnread() {
      if(!store.state.user){
        return;
      }
        try {

          // Chama a API para fazer login
          let response = await apiMethods.fetchCountUnread();
this.unread_count =response.data.unread_count

        } catch (error) {
          console.error("Erro ao fazer logout:", error);localStorage.removeItem("token");

        } finally {
        }
    },
  },
  mounted() {this.fetchCountUnread()},
  setup() {
    const route = useRoute();
    const $q = useQuasar()

    return {
      route,
      $q
    };
  },
};
</script>

<style></style>
