<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar style="background-color: gainsboro; color: #000;">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Glen Delivery</q-toolbar-title>

        <q-btn flat dense round icon="map" @click="toggleMap" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above>
      <q-list>
        <q-item to="/dashboard" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>

        <!-- <q-item to="/current-orders" clickable v-ripple> -->
        <q-item to="/show-packs" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="list" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Entregas</q-item-label>
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
import { ref } from "vue";
import apiMethods from "src/router/api.js";
import store from "src/store/index.js";
import { useQuasar } from 'quasar';

export default {
  name: "DeliverServiceLayout",
  setup() {
    const $q = useQuasar(); // Use Quasar in the setup() context

    const leftDrawerOpen = ref(false);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const logout = async () => {
      try {
        $q.loading.show({ message: 'Terminando sua sessao' });

        let response = await apiMethods.logout();
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        store.commit("clearUser");
        $q.loading.hide();

        $q.notify({
          color: "green",
          textColor: "white",
          icon: "cloud_done",
          message: "Volte sempre, obrigado.",
        });

        this.$router.push("/login");
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.$router.push("/login");
        store.commit("clearUser");
      } finally {
        $q.loading.hide();
      }
    };

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      logout,
    };
  }
};
</script>


<style></style>
