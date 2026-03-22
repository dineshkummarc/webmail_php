import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

import core from 'src/core'
import modulesManager from 'src/modules-manager'
import store from 'src/store'
import settings from 'src/settings'

// Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  // const Router = new VueRouter({
  //   scrollBehavior: () => ({ x: 0, y: 0 }),
  //   routes,

  //   // Leave these as they are and change in quasar.conf.js instead!
  //   // quasar.conf.js -> build -> vueRouterMode
  //   // quasar.conf.js -> build -> publicPath
  //   mode: process.env.VUE_ROUTER_MODE,
  //   base: process.env.VUE_ROUTER_BASE
  // })

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    // history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE),
    history: createHistory(process.env.MODE === 'ssr' ? undefined : process.env.VUE_ROUTER_BASE),
  })

  let routesAdded = false
  let isAppLoadError = false
  let isFirstLogin = true

  Router.beforeEach(async (to, from, next) => {
    if (isAppLoadError && to.path === '/app-not-loaded') {
      next()
      return
    }
    try {
      await core.init()
      if (!routesAdded) {
        modulesManager.getRoutes().forEach((route) => {
          const { name, path, component, children } = route
          const routeData = { name, path, component }
          if (children) {
            routeData.children = children
          }
          Router.addRoute(name, routeData)
        })
        routesAdded = true
        next(to.path)
        return
      }
      // upon first login when we are logged in
      if (isFirstLogin && store.getters['user/isUserSuperAdminOrTenantAdmin']) {
        const { name, path, component, children } = modulesManager.getUserRoutes()
        const routeData = { name, path, component }
        if (children) {
          routeData.children = children
        }
        // add user routes
        Router.addRoute(name, routeData)
        if (settings.getEnableMultiTenant()) {
          const { name, path, component, children } = modulesManager.getTenantRoutes()
          const routeData = { name, path, component }
          if (children) {
            routeData.children = children
          }
          // add tenant routes
          Router.addRoute(name, routeData)
        }
        isFirstLogin = false
        next(to.path)
        return
      }
      const correctedPath = modulesManager.checkRouteExistsAndAllowed(to.matched, to.path)
      if (to.path !== correctedPath) {
        next(correctedPath)
        return
      }
      next()
    } catch (error) {
      console.log('core.init reject', error)
      isAppLoadError = true
      next('/app-not-loaded')
    }
  })

  return Router
})
