import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import apiMethods from "src/router/api.js";
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  // Rastrear cada navegação no frontend
  Router.afterEach((to) => {
    document.title = to.meta.title || "Marketplace - Compre e Venda";

    // SEO: meta description
    if (to.meta.description) {
      let desc = document.querySelector('meta[name="description"]');
      if (!desc) {
        desc = document.createElement('meta');
        desc.name = 'description';
        document.head.appendChild(desc);
      }
      desc.content = to.meta.description;
    }

    // Analytics: salvar visitas
    const params = new URLSearchParams(window.location.search);
    apiMethods.trackVisit({
      path_visited: to.fullPath,
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
    }).catch((error) => {
      console.warn("Falha ao registrar visita", error);
    });
  });
  // Guarda global para alterar o título da página
  Router.beforeEach((to, from, next) => {
    const defaultTitle = "KLC Market"

    if (to.meta.title) {
      document.title = `${to.meta.title} | ${defaultTitle}`
    } else {
      document.title = defaultTitle
    }

    next()
  })

  return Router
})
