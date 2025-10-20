// router/routes.js

import authGuard from "./authGuard";
import store from "src/store/index.js";

const redirectIfEmpresa = (to, from, next) => {
  if (store.state.user && store.state.user.scope === "empresa") {
    next("/s");
    next();
  } else if (store.state.user && store.state.user.scope === "entregador") {
    next("/show-packs");
  } else if (store.state.user && store.state.user.scope === "admin") {
    next("/admin");
  } else {
    next();
  }
};

const routes = [
  // Rota de empresas lojas
  {
    path: "/s",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/admin/StoreProfilePage.vue"),
        meta: {
          requiredScopes: ["empresa"],
          title: "Painel da Loja",
        },
      },

      {
        path: "invoice",
        component: () => import("pages/admin/InvoicePages.vue"),
        meta: {
          requiredScopes: ["empresa"],
          title: "Faturas",
        },
      },

      {
        path: "dashboard",
        component: () => import("pages/admin/DashboardPage.vue"),
        meta: {
          requiredScopes: ["empresa"],
          title: "Painel da Loja",
        },
      },
      {
        path: "custumers",
        component: () => import("pages/admin/ManageCustomersPage.vue"),
        meta: { requiredScopes: ["admin"] },
      },

      {
        path: "custumers/:id",
        component: () => import("pages/admin/CustumerProfilePage.vue"),
        meta: { requiredScopes: ["admin"] },
      },
      {
        path: "custumers/order/:id",
        component: () => import("pages/admin/ShowPackagePage.vue"),
        meta: { requiredScopes: ["admin"] },
      },
      {
        path: "store",
        component: () => import("pages/admin/ManageStore.vue"),
        meta: { requiredScopes: ["admin"] },
      },
      {
        path: "store/:id",
        component: () => import("pages/admin/StoreProfilePage.vue"),
        meta: { requiredScopes: ["admin"] },
      },
    ],
    beforeEnter: authGuard,
  },

  // Rota admin
  {
    path: "/admin",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/admin/DashboardPage.vue"),
        meta: {
          requiredScopes: ["admin"],
          title: "Painel do Admin",
          // layout: "admin",
          analyticsEvent: "view_admin_dashboard",
        },
      },

      {
        path: "product-approval",
        component: () => import("pages/admin/ProductApproval.vue"),
        meta: {
          requiredScopes: ["admin"],
          title: "Aprovação de Produtos",
          analyticsEvent: "view_product_approval",
        },
      },
      {
        path: "dashboard",
        component: () => import("pages/admin/DashboardPage.vue"),
        meta: {
          requiredScopes: ["admin"],
          title: "Painel do Admin",
          // layout: "admin",
          analyticsEvent: "view_admin_dashboard",
        },
      },
      {
        path: "custumers",
        component: () => import("pages/admin/ManageCustomersPage.vue"),
        meta: { requiredScopes: ["admin"] },
      },
      {
        path: "custumers/:id",
        component: () => import("pages/admin/CustumerProfilePage.vue"),
        meta: { requiredScopes: ["admin"] },
      },
      {
        path: "deliver-mans/:id",
        component: () => import("pages/admin/DeliverManProfilePage.vue"),
        meta: { requiredScopes: ["admin"] },
      },
      {
        path: "deliver-mans",
        component: () => import("pages/admin/ManageDeliverManPage.vue"),
        meta: { requiredScopes: ["admin"] },
      },
      {
        path: "custumers/order/:id",
        component: () => import("pages/admin/ShowPackagePage.vue"),
        meta: { requiredScopes: ["admin"] },
      },
      {
        path: "store",
        component: () => import("pages/admin/ManageStore.vue"),
        meta: { requiredScopes: ["admin"] },
      },
      {
        path: "store/:id",
        component: () => import("pages/admin/StoreProfilePage.vue"),
        meta: { requiredScopes: ["admin"] },
      },
    ],
    beforeEnter: authGuard,
  },

  // Rotas privadas
  {
    path: "/",
    // component: () => import("layouts/SotoreLayout.vue"),
    children: [
      // rotas do Cliente
      {
        path: "pack/:id",
        props: true,
        name: "PackagePage2",
        component: () => import("pages/package/PackagePage.vue"),
        meta: { requiredScopes: ["cliente"] },
      },
      {
        path: "packs",
        props: true,
        name: "ListPackagePage",
        component: () => import("pages/package/ListPackagePage.vue"),
        meta: { requiredScopes: ["cliente"] },
      },
    ],
    beforeEnter: authGuard, // Aplica o guarda de autenticação para rotas privadas
  },

  // Rotas publicas
  {
    path: "/",
    // component: () => import("layouts/SotoreLayout.vue"),
    children: [
      // rotas do Cliente
      {
        path: "",
        props: true,
        name: "PackagePage1",
        component: () => import("pages/HomePage.vue"),
        // component: () => import("pages/TsakissaPage.vue"),
        // component: () => import("pages/IndexPage.vue"),
        beforeEnter: redirectIfEmpresa,
        meta: {
          title: "Marketplace - Compre e Venda",
          description: "Descubra produtos incríveis no nosso marketplace.",
          layout: "default",
          analyticsEvent: "view_homepage",
        },
      },
      {
        path: "mk",
        component: () => import("pages/admin/AnalyticsDashboard.vue"),
        meta: {
          title: "KPI`s e Desenpenho",
        },
      },
      {
        path: "/rv",
        props: true,
        name: "ExperimentarRoupa",
        component: () => import("pages/ExperimentarRoupa.vue"),
        // component: () => import("pages/TsakissaPage.vue"),
        // component: () => import("pages/IndexPage.vue"),
        beforeEnter: redirectIfEmpresa,
      },
      {
        path: "find/:token",
        props: true,
        name: "PesquisaPage",
        component: () => import("pages/store/PesquisaPage.vue"),
        beforeEnter: redirectIfEmpresa,
      },
      {
        path: "gd",
        props: true,
        name: "ewf",
        // component: () => import("pages/HomePage.vue"),
        // component: () => import("pages/TsakissaPage.vue"),
        component: () => import("pages/IndexPage.vue"),
        beforeEnter: redirectIfEmpresa,
      },
      {
        path: "set-package",
        props: true,
        name: "DeliveryPage",
        component: () => import("pages/DeliveryPage.vue"),
        beforeEnter: redirectIfEmpresa,
      },
      {
        path: "product/:id",
        props: true,
        name: "ProductDetail_1",
        component: () => import("pages/store/ProductDetail.vue"),
        meta: {
          analyticsEvent: "view_product",
        },
      },
      {
        path: "product/:id/:slug",
        props: true,
        name: "ProductDetail_2",
        component: () => import("pages/store/ProductDetail.vue"),
        meta: {
          analyticsEvent: "view_product",
        },
      },
      {
        path: "/:id",
        props: true,
        name: "ProfileSeller",
        component: () => import("pages/store/ProfileSeller.vue"),
      },
      {
        path: "cart",
        props: true,
        name: "CartPage",
        component: () => import("pages/store/CartPage.vue"),
        meta: {
          title: "Carrinho de Compras",
          description: "Revise seus produtos e finalize a compra.",
          layout: "default",
          analyticsEvent: "view_cart",
        },
      },
      {
        path: "chat",
        props: true,
        name: "ChatPage",
        component: () => import("pages/store/ChatPage.vue"),
        meta: {
          title: "Chat com Vendedor",
          requiresAuth: true,
          layout: "default",
          analyticsEvent: "view_chat",
        },
      },
      {
        path: "chat/:seller_id/:product_id",
        props: true,
        name: "ChatPage1345678",
        component: () => import("pages/store/ChatPage.vue"),
        meta: {
          title: "Chat com Vendedor",
          requiresAuth: true,
          layout: "default",
          analyticsEvent: "view_chat",
        },
      },
      {
        path: "chat/:seller_id",
        props: true,
        name: "ChatPage1765",
        component: () => import("pages/store/ChatGeralPage.vue"),
        meta: {
          title: "Chat com Vendedor",
          requiresAuth: true,
          layout: "default",
          analyticsEvent: "view_chat",
        },
      },
      {
        path: "messages",
        props: true,
        name: "MessagesPage",
        component: () => import("pages/store/MessagesPage.vue"),
        meta: {
          title: "Chat com Vendedor",
          requiresAuth: true,
          layout: "default",
          analyticsEvent: "view_messages",
        },
      },
      {
        path: "support",
        component: () => import("pages/SupportPage.vue"),
        meta: { requiredScopes: ["cliente"] },
      },
      {
        path: "formulario",
        component: () => import("pages/modelos/VendedorLead.vue"),
        meta: { requiredScopes: ["cliente"] },
      },
      {
        path: "welcome",
        component: () => import("pages/modelos/WelcomeVendedor.vue"),
        meta: { requiredScopes: ["cliente"] },
      },
      {
        path: "como-vender",
        component: () => import("pages/modelos/ModeloBasico.vue"),
        meta: { requiredScopes: ["cliente"] },
      },

      {
        path: "politica-de-devolucao",
        component: () => import("pages/politicas/PolicyReturn.vue"),
      },

      // {
      //   path: "",
      //   component: () => import("pages/my-blog/BlogSpost.vue"),
      // },

      // politicas
      {
        path: "termos-de-servico",
        name: "TermosDeServcvicod",
        component: () => import("pages/politicas/TermosDeServico1.vue"),
        // component: () => import("pages/politicas/TermosDeServico1.vue"),
      },
      {
        path: "termos-do-vendedor",
        name: "TermosDeServicod",
        component: () => import("pages/politicas/TermosDeServicoVendedor.vue"),
        // component: () => import("pages/politicas/TermosDeServico1.vue"),
      },
      {
        path: "pusher",
        name: "pusher",
        component: () => import("pages/PusherTest.vue"),
      },

      {
        path: "/web-push",
        name: "TermosDeServicdsdod",
        component: () => import("pages/WebPush.vue"),
      },

      {
        path: "privacy-policy",
        component: () => import("pages/politicas/PrivacyPolicy.vue"),
      },
      {
        path: "sobre",
        component: () => import("pages/politicas/AboutUs.vue"),
      },
      {
        path: "promocoes",
        name: "PromotionsPage",
        component: () => import("pages/Promotions.vue"),
      },
    ],
    // beforeEnter: authGuard,
  },

  // rotas do entregador
  {
    path: "/",
    component: () => import("layouts/DeliverServiceLayout.vue"),
    children: [
      {
        path: "show-packs",
        props: true,
        name: "deliverServiceListPackagePag1e",
        component: () => import("pages/deliverService/ListPackagePage.vue"),
        meta: { requiredScopes: ["entregador"] },
      },
      {
        path: "show-packs/:id",
        props: true,
        name: "ShowPackagePage",
        component: () => import("pages/deliverService/ShowPackagePage.vue"),
        meta: { requiredScopes: ["entregador"] },
      },
      {
        path: "dashboard",
        props: true,
        name: "DashboardPag12",
        component: () => import("pages/deliverService/DashboardPage.vue"),
        meta: { requiredScopes: ["entregador"] },
      },
      {
        path: "profiled",
        component: () => import("pages/deliverService/ProfilePage.vue"),
        meta: { requiredScopes: ["entregador"] },
      },
    ],
    beforeEnter: authGuard, // Aplica o guarda de autenticação para rotas privadas
  },

  // rotas do cliente
  {
    path: "/c",
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        meta: { requiredScopes: ["cliente"] },
      },
      {
        path: "show-packs",
        props: true,
        name: "deliverServiceListPackagePage",
        component: () => import("pages/custumer/ListPackagePage.vue"),
        meta: { requiredScopes: ["cliente"] },
      },
      {
        path: "show-packs/:id//:tipo",
        props: true,
        name: "ShowPackagePage",
        component: () => import("pages/custumer/ShowPackagePage.vue"),
        meta: { requiredScopes: ["cliente"] },
      },

      {
        path: "profile",
        component: () => import("pages/custumer/ProfilePage.vue"),
        meta: { requiredScopes: ["cliente"] },
      },
    ],
    beforeEnter: authGuard, // Aplica o guarda de autenticação para rotas privadas
  },

  {
    path: "/login",
    component: () => import("pages/auth/LoginPage.vue"),
    meta: {
      title: "Entrar no Marketplace",
      requiresAuth: false,
      analyticsEvent: "view_login_page",
    },
    beforeEnter: authGuard, // Aplica o guarda de autenticação para a página de login
  },
  {
    path: "/register",
    component: () => import("pages/auth/RegisterPage.vue"),
    meta: {
      title: "Criar Conta",
      requiresAuth: false,
      analyticsEvent: "view_register_page",
    },
    beforeEnter: authGuard, // Aplica o guarda de autenticação para a página de registro
  },

  // Rota para página não encontrada
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
    meta: { title: "Página não encontrada" },
  },
];

export default routes;
