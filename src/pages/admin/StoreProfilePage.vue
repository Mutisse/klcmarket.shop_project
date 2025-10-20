<template>
  <q-page class="q-pt-md" style="background-color: #f2f2f5; min-height: 100vh">
    <!-- Exibe o título da aba atualmente selecionada com o ícone correspondente -->
    <StoreLayoutAdminMobile
      v-if="!isDesktop"
      :title="currentTabTitle"
      :icon="currentTabIcon"
    />
    <StoreLayoutAdminDesktop
      v-if="isDesktop"
      :title="currentTabTitle"
      :icon="currentTabIcon"
    />

    <q-tab-panels v-if="!isDesktop" v-model="activeTab" animated swipeable>
      <SalesTabPanel name="sales" />

      <!--  ProductsTabPanel -->
      <ProductsTabPanel name="products" />

      <!-- ListPackagePanel -->
      <ListPackagePanel name="orders" />

      <q-tab-panel name="reviews">
        <!-- Avaliações e Feedback -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6">Avaliações e Feedback</div>
          </q-card-section>
          <q-card-section>
            <q-table
              :rows="reviews"
              :columns="reviewColumns"
              row-key="id"
              selection="single"
              v-model:selected="selectedReview"
            >
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    size="sm"
                    color="primary"
                    @click="replyReview(props.row)"
                    >Responder</q-btn
                  >
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="users">
        <!-- Gerenciamento de Usuários -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6">Gerenciamento de Usuários</div>
          </q-card-section>
          <q-card-section>
            <q-table
              :rows="users"
              :columns="userColumns"
              row-key="id"
              selection="single"
              v-model:selected="selectedUser"
            >
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn size="sm" color="primary" @click="editUser(props.row)"
                    >Editar</q-btn
                  >
                  <q-btn
                    size="sm"
                    color="negative"
                    @click="deleteUser(props.row.id)"
                    >Excluir</q-btn
                  >
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <ProfileStoreTabPanel name="info" />

      <q-tab-panel name="settings">
        <!-- Configurações da Loja -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6">Configurações da Loja</div>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="store.payment_methods"
              label="Métodos de Pagamento"
            />
            <q-input
              v-model="store.return_policy"
              label="Políticas de Devolução"
              type="textarea"
            />
            <q-input
              v-model="store.delivery_settings"
              label="Configurações de Entrega"
              type="textarea"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Salvar" color="primary" @click="saveStore" />
          </q-card-actions>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <q-footer class="bg-white text-black">
      <q-separator class="full-width" color="gray" inset />

      <q-tabs
        v-if="!isDesktop"
        v-model="activeTab"
        align="justify"
        class="q-pa-sm"
        active-color="primary"
        indicator-color="primary"
      >
        <q-tab name="sales" icon="bar_chart" />
        <q-tab name="products" icon="inventory" />
        <q-tab name="orders" icon="receipt" />
        <q-tab v-if="false" name="reviews" icon="rate_review" />
        <q-tab v-if="false" name="users" icon="group" />
        <q-tab name="info" icon="store" />
        <q-tab v-if="false" name="settings" icon="settings" />
      </q-tabs>
    </q-footer>
  </q-page>
</template>

<script>
import StoreLayoutAdminMobile from "layouts/StoreLayoutAdminMobile.vue";
import StoreLayoutAdminDesktop from "layouts/StoreLayoutAdminDesktop.vue";
import ProductsTabPanel from "components/AdminStore/ProductsTabPanel.vue";
import ProfileStoreTabPanel from "components/AdminStore/ProfileStoreTabPanel.vue";
import ListPackagePanel from "components/AdminStore/ListPackagePanel.vue";
import SalesTabPanel from "components/AdminStore/SalesTabPanel.vue";

export default {
  components: {
    ProductsTabPanel,
    StoreLayoutAdminMobile,
    StoreLayoutAdminDesktop,
    ProfileStoreTabPanel,
    ListPackagePanel,
    SalesTabPanel,
  },
  data() {
    return {
      activeTab: "sales", // Aba ativa inicial
      currentTabTitle: "Estatísticas de Vendas", // Título da aba atual
      currentTabIcon: "bar_chart", // Ícone da aba atual
      store: {
        name: "",
        category: "",
        opening_hours: "",
        location: "",
        contact_number: "",
        description: "",
        profile_photo: "",
        cover_photo: "",
      },
      salesStats: {
        total_sales: 0,
        monthly_revenue: 0,
      },
      products: [],
      productColumns: [
        { name: "name", label: "Nome", align: "left", field: "name" },
        { name: "price", label: "Preço", align: "right", field: "price" },
        { name: "actions", label: "Ações", align: "center" },
      ],
      selectedProduct: null,

      reviews: [],
      reviewColumns: [
        { name: "user", label: "Usuário", align: "left", field: "user" },
        { name: "rating", label: "Avaliação", align: "right", field: "rating" },
        { name: "actions", label: "Ações", align: "center" },
      ],
      selectedReview: null,
      users: [],
      userColumns: [
        { name: "name", label: "Nome", align: "left", field: "name" },
        { name: "email", label: "E-mail", align: "left", field: "email" },
        { name: "actions", label: "Ações", align: "center" },
      ],
      selectedUser: null,
    };
  },
  props: {
    name: {
      type: String,
      required: false // Optional if it's not always required
    }
  },
  computed: {
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
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
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

  },
  watch: {
    activeTab(newVal) {
      this.updateTabTitle();
    },
  },
};
</script>
