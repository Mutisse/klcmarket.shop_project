<template>
  <q-page class="q-pa-md">
    <!-- Exibe o título da aba atualmente selecionada com o ícone correspondente -->
    <StoreLayoutAdmin :title="currentTabTitle" :icon="currentTabIcon" />

    <q-tab-panels v-model="activeTab" animated swipeable>
      <StatisticsOrderTabPanel  name="sales"/>

      <OrdersTabPanel name="orders" />

      <ProfileDeliverManTabPanel name="info" />



    </q-tab-panels>

    <q-footer class="bg-white text-black">
      <q-separator class="full-width" color="gray" inset />

      <q-tabs
        v-model="activeTab"
        align="justify"
        class="q-pa-sm"
        active-color="primary"
        indicator-color="primary"
      >
        <q-tab name="sales" icon="bar_chart" />
        <q-tab name="orders" icon="receipt" />
        <q-tab name="info" icon="person" />
      </q-tabs>
    </q-footer>

  </q-page>
</template>

<script>
import StoreLayoutAdmin from "layouts/StoreLayoutAdmin.vue";
import OrdersTabPanel from "components/AdminDeliver/OrdersTabPanel.vue";
import ProfileDeliverManTabPanel from "components/AdminDeliver/ProfileDeliverManTabPanel.vue";
import StatisticsOrderTabPanel from "components/AdminDeliver/StatisticsOrderTabPanel.vue";

export default {
  components: {
    StoreLayoutAdmin,
    OrdersTabPanel,
    ProfileDeliverManTabPanel,
    StatisticsOrderTabPanel
  },
  data() {
    return {
      activeTab: "sales", // Aba ativa inicial
      currentTabTitle: "Resumo das Entregas", // Título da aba atual
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
      orderStats: {
        pending_orders: 0,
        completed_orders: 0,
      },
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

  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    updateTabTitle() {
      const tabTitles = {
        info: "Info do Entregador",
        sales: "Resumo das Entregas",
        products: "Gestão de Produtos",
        orders: "Pedidos",
        reviews: "Avaliações e Feedback",
        users: "Gerenciamento de Usuários",
        settings: "Config do Entregador",
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
      this.currentTabTitle = tabTitles[this.activeTab] || "Info do Entregador";
      this.currentTabIcon = tabIcons[this.activeTab] || "store";
    },
    saveStore() {
      // Lógica para salvar as informações da Entregador
    },
    openAddProductDialog() {
      // Lógica para abrir o diálogo de adicionar produto
    },
    editProduct(product) {
      // Lógica para editar um produto
    },
    deleteProduct(productId) {
      // Lógica para excluir um produto
    },
    replyReview(review) {
      // Lógica para responder a uma avaliação
    },
    editUser(user) {
      // Lógica para editar um usuário
    },
    deleteUser(userId) {
      // Lógica para excluir um usuário
    },
  },
  watch: {
    activeTab(newVal) {
      this.updateTabTitle();
    },
  },
};
</script>
