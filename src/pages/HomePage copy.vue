<template>
  <q-layout>
    <!-- <q-page class="q-pa-md"> -->

    <div class="bg-grey-2">
      <HeaderC   v-if="$q.screen.lt.md"/>

      <div   v-if="!$q.screen.lt.md"
        :class="$q.screen.lt.md ? 'q-pt-xl q-ml-md ' : 'q-pt-md q-ml-md '"
        class="row justify-around full-width"
      >
        <input
          :class="$q.screen.lt.md ? 'col-8 ' : 'col-8  bg-white '"
          style="border-radius: 1rem"
          placeholder="Procurar..."
          v-model="search"
        />
        <q-btn
          style="border-radius: 1rem"
          class="col-2 bg-black text-grey"
          @click="toggleLeftDrawer"
          icon="widgets"
        />
      </div>

      <Banner v-if="false" />
      <FeaturedProducts />
      <FooterC v-if="true" />
      <!-- HTML: Footer para Marketplace KLC -->

      <!-- </q-page> -->

      <q-drawer v-model="leftDrawerOpen">
        <div class="text-h5 text-center">
          <img
            src="~1.png"
            alt="Logo"
            class="q-mb-md"
            style="width: 200px"
          />
        </div>
        <q-list>
          <q-item
            v-if="user && user.scope != 'cliente'"
            :to="dashboard"
            clickable
            v-ripple
          >
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
          </q-item>

          <!-- <q-item to="/current-orders" clickable v-ripple> -->
          <q-item v-if="user" to="/c/show-packs" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Pedidos Atuais</q-item-label>
            </q-item-section>
          </q-item>

          <!-- <q-item to="/delivery-history" clickable v-ripple> -->
          <q-item
            v-if="user && user.scope != 'cliente'"
            to="/c/show-packs"
            clickable
            v-ripple
          >
            <q-item-section avatar>
              <q-icon name="history" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Histórico de Entregas</q-item-label>
            </q-item-section>
          </q-item>

          <q-item to="gd" clickable v-ripple>
            <q-item-section avatar>
              <img
                src="~assets/glen_delivery_logo_red_sem_fundo.png"
                alt="Logo"
                style="width: 30px; height: 30px"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>Glen Delivery</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if="user" to="/c/profile" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Perfil</q-item-label>
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

          <q-item v-if="user" clickable @click="logout" v-ripple>
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

          <q-item v-if="!user" clickable to="/register" v-ripple>
            <q-item-section avatar>
              <q-icon name="edit_note" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Criar Conta</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>
    </div>
  </q-layout>
</template>

<script>
// import HeaderCComponents from "components/store/HeaderCComponents.vue";
import Banner from "components/store/BannerC.vue";
import FeaturedProducts from "components/store/FeaturedProducts.vue";
import TestimonialsC from "components/store/TestimonialsC.vue";
import FooterC from "components/store/FooterC.vue";
import HeaderC from "components/store/HeaderC.vue";
import store from "src/store/index.js";
import apiMethods from "src/router/api.js";

export default {
  name: "HomePage",
  components: {
    Banner,
    FeaturedProducts,
    FooterC,
    HeaderC,
  },
  data() {
    return {
      leftDrawerOpen: false,
      search: "",
      loading: true,
    };
  },
  computed: {
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
  methods: {
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
  },
  async mounted() {
    try {
      // this.$q.loading.show({
      //     message: "Terminando sua sessao",
      //   });
      // // Simula um delay para o carregamento inicial
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // if (this.user && this.user.scope === "empresa") {
      //   this.$router.push("/s");
      // }
      // this.$q.loading.hide();
    } catch (error) {
      console.error("Erro ao inicializar:", error);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.bg-white {
  background-color: white;
}
.glowing-shadow-add {
  box-shadow: 0 0 10px rgba(237, 249, 237, 0.6),
    /* Brilho verde */ 0 0 20px rgba(163, 163, 163, 0.4),
    0 0 30px rgba(39, 39, 39, 0);
  transition: box-shadow 0.3s ease-in-out;
}

.glowing-shadow-update {
  box-shadow: 0 0 10px rgba(0, 0, 255, 0.6),
    /* Brilho azul */ 0 0 20px rgba(0, 0, 255, 0.4),
    0 0 30px rgba(0, 0, 255, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}

.glowing-shadow-cancel {
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.6),
    /* Brilho vermelho */ 0 0 20px rgba(255, 0, 0, 0.4),
    0 0 30px rgba(255, 0, 0, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}
</style>
