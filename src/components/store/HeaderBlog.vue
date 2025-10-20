<template>
  <header class="klc-header">
    <div class="logo">
      <div class="hero-section bg-gradient q-pa-lg text-white rounded-borders">
        <h5 style="">  <span
            style="
              font-family: 'Roboto', sans-serif;
              font-weight: bold;
              font-size: 1.5rem;
              background: linear-gradient(135deg, #4a90e2, #50e3c2);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              text-align: center;
              text-transform: uppercase;
              letter-spacing: 1px;
              text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
              margin-left: 5px;
            "
            >Blog</span
          >
          KLC Market

        </h5>
        <!-- resto do conteúdo -->
      </div>
    </div>

    <nav class="klc-nav">
      <ul class="nav-links">
        <li><a href="#">Início</a></li>
        <!-- <li><a href="#">Ofertas</a></li> -->
        <li><a @click="$router.push('/support')">Contato</a></li>
        <li><a @click="$router.push('/como-vender')">Vender</a></li>
        <li><a @click="$router.push('/tutorials')">Tutoriais </a></li>
      </ul>
    </nav>

    <div class="nav-icons">
      <q-item-section
        v-if="!showSearch && !searchQuery"
        class="text-grey"
        avatar
        style="min-width: 0"
        @click="toggleSearch"
      >
        <q-icon name="search" />
      </q-item-section>

      <!-- Campo de busca visível apenas quando `showSearch` for true -->
      <div v-if="showSearch || searchQuery">
        <q-form class="search-container">
          <input
            v-model="searchQuery"
            class="search-input"
            placeholder="Procurar por produto"
            @keyup.enter="performSearch"
          />
          <q-item-section class="search-icon" @click="performSearch">
            <q-icon name="search" />
          </q-item-section>
        </q-form>
        
      </div>

      <q-item-section @click="$router.push('/cart')" class="text-grey">
        <q-btn flat color="grey" icon="shopping_cart">
          <q-badge
            v-if="totalItemsInCart > 0"
            floating
            color="red"
            rounded
            :label="totalItemsInCart"
          />
        </q-btn>
      </q-item-section>

      <q-item-section
        @click="$router.push('/login')"
        v-if="!isAuthenticated"
        class="text-grey"
        avatar
        style="min-width: 0; padding: 0px"
      >
        <q-icon name="login" />
      </q-item-section>

      <q-item-section
        v-if="isAuthenticated"
        @click="$router.push('/messages')"
        class="text-grey"
      >
        <q-btn flat color="grey" icon="email">
          <q-badge color="red" v-if="unread_count > 0" floating>{{
            unread_count
          }}</q-badge>
        </q-btn>
      </q-item-section>

      <q-item-section
        @click="toggleLeftDrawer()"
        class="text-grey"
        avatar
        style="min-width: 0; padding: 0px"
      >
        <q-icon name="menu" />
      </q-item-section>
    </div>
  </header>

  <q-drawer v-model="leftDrawerOpen1">
    <div class="text-h5 text-center">
      <img
        src="~assets/logo-klc-market1.png"
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
</template>

<script>
import store from "src/store/index.js";
import apiMethods from "src/router/api.js";

export default {
  name: "ProductsPage",
  data() {
    return {
      unread_count: 0,
      leftDrawerOpen1: false,
      showSearch: false, // Controla a exibição do campo de busca
      searchQuery: this.$route.params.token || "", // Corrigido para evitar undefined
    };
  },

  computed: {
    isAuthenticated() {
      return store.state.user ? true : false;
    },
    leftDrawerOpen() {
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
  methods: {
    toggleSearch() {
      // Alterna a visibilidade do campo de busca
      this.showSearch = !this.showSearch;
      // Se estiver fechando e há texto, limpa a busca
      if (!this.showSearch && this.searchQuery) {
        this.searchQuery = "";
      }
    },

    async performSearch() {
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        try {
          this.$q.loading.show({
            message: "Buscando produtos..."
          });

          // Chama a API para buscar produtos
          let response = await apiMethods.searchProducts({
            query: this.searchQuery.trim(),
            include_promotions: true // INCLUIR PRODUTOS EM PROMOÇÃO
          });

          // Se a busca for bem sucedida, navega para a página de resultados
          if (response.data && response.data.products) {
            this.$router.push({
              path: `/find/${this.searchQuery.trim()}`,
              query: {
                search: this.searchQuery.trim(),
                results: JSON.stringify(response.data.products)
              }
            });
          } else {
            // Se não encontrar resultados, ainda navega para a página de busca
            this.$router.push(`/find/${this.searchQuery.trim()}`);
          }

        } catch (error) {
          console.error("Erro ao buscar produtos:", error);
          
          // Mesmo com erro, navega para a página de busca
          this.$router.push(`/find/${this.searchQuery.trim()}`);
          
          this.$q.notify({
            color: "negative",
            textColor: "white",
            icon: "warning",
            message: "Erro ao buscar produtos. Tente novamente."
          });
        } finally {
          this.$q.loading.hide();
        }
      } else {
        this.$q.notify({
          color: "warning",
          textColor: "white",
          icon: "info",
          message: "Digite algo para pesquisar"
        });
      }
    },

    // Método alternativo se a API não estiver funcionando
    performSearchFallback() {
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        // Navega diretamente para a página de busca
        this.$router.push(`/find/${this.searchQuery.trim()}`);
      } else {
        this.$q.notify({
          color: "warning",
          textColor: "white",
          icon: "info",
          message: "Digite algo para pesquisar"
        });
      }
    },

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

    notify() {
      const notification = new Notification("Breaking:", {
        body: `Celebrity Caught in Fresh Scandal`,
        icon: "https://unsplash.it/400/400",
        vibration: [300, 200, 300],
      });

      notification.addEventListener("click", function () {
        window.open("https://www.openjavascript.info");
      });

      setTimeout(() => notification.close(), 5 * 1000);
    },

    async fetchCountUnread() {
      // console.log(store.state.user)
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          this.notify();
        } else {
          Notification.requestPermission().then((res) => {
            if (res === "granted") {
              this.notify();
            } else {
              console.error("Did not receive permission for notifications");
            }
          });
        }
      } else {
        console.error("Browser does not support notifications");
      }
      if (!store.state.user) {
        return;
      }

      try {
        // Chama a API para fazer login
        let response = await apiMethods.fetchCountUnread();
        this.unread_count = response.data.unread_count || 0;
        // console.log(response);
      } catch (error) {
        console.error("Erro ao carregar menssagens:", error);
      } finally {
      }
    },
  },
  mounted() {
    // this.fetchCountUnread();
  },
  watch: {
    '$route.params.token': {
      handler(newToken) {
        if (newToken) {
          this.searchQuery = newToken;
        }
      },
      immediate: true
    }
  }
};
</script>
<style>
/* Estilo futurista do Header */
.klc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f5f5 !important; /* Cor principal */
  padding: 0px 50px;
  border-bottom: 3px solid #bd6513;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.klc-header::before {
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

/* Navegação */
.klc-nav .nav-links {
  list-style: none;
  display: flex;
  gap: 30px;
  padding: 0;
  margin: 0;
}

.klc-nav .nav-links li a {
  color: #333;
  font-size: 12px;
  text-transform: uppercase;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
  cursor: pointer;
}

.klc-nav .nav-links li a::after {
  content: "";
  position: absolute;
  width: 0;
  height: 1px;
  background-color: #bd6513;
  bottom: -5px;
  left: 0;
  transition: width 0.3s ease;
}

.klc-nav .nav-links li a:hover::after {
  width: 100%;
}

.klc-nav .nav-links li a:hover {
  color: #bd6513;
}

/* Ícones (login, carrinho, buscar) */
.nav-icons {
  display: flex;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.nav-icons q-icon {
  color: #333;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.nav-icons q-icon:hover {
  color: #bd6513;
  transform: scale(1.2);
}

/* Container de busca */
.search-container {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 1rem;
  padding: 0px 15px;
  max-width: 500px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid #e0e0e0;
  transition: border-color 0.3s ease;
}

.search-container:focus-within {
  border-color: #bd6513;
}

/* Estilo do input */
.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px;
  border-radius: 1rem;
  outline: none;
  font-size: 15px;
  color: #333;
  width: 250px;
}

.search-input::placeholder {
  color: #888;
}

/* Ícone de busca */
.search-icon {
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.search-icon:hover {
  background-color: #e0e0e0;
}

.search-icon q-icon {
  font-size: 20px;
  color: #555;
}

.search-icon:hover q-icon {
  color: #bd6513;
}

@media (max-width: 768px) {
  .klc-header {
    flex-direction: column;
    text-align: center;
    padding-bottom: 8px;
  }

  .klc-nav .nav-links {
    flex-direction: row;
    gap: 15px;
  }
  .nav-icons {
    display: flex;
    gap: 0px;
    position: relative;
    z-index: 1;
  }

  /* Navegação */
  .klc-nav .nav-links {
    list-style: none;
    display: flex; /* Define layout flexível para itens em linha */
    gap: 30px; /* Adiciona espaçamento entre os itens */
    padding-bottom: 8px;
    margin: 0;
  }

  .search-input {
    width: 180px;
  }
}

@media (max-width: 480px) {
  .search-input {
    width: 150px;
  }
  
  .klc-nav .nav-links {
    gap: 15px;
  }
  
  .nav-icons {
    gap: 15px;
  }
}
</style>