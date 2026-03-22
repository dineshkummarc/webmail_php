import _ from 'lodash'

import modulesManager from 'src/modules-manager'

import EditUser from 'src/components/EditUser'
import Empty from 'src/components/Empty'

export default {
  getAllUserRoutes() {
    let userRoutes = this.getUserRoutes()
    const userTabsRouteChildren = this.getRouteChildren('User')
    const userFiltersRoutes = this.getUserFiltersRoutes(userTabsRouteChildren)
    userFiltersRoutes.forEach((filterRoute) => {
      const routes = this.getUserRoutes(`${filterRoute.path}/`)
      userRoutes = userRoutes.concat(routes)
      userTabsRouteChildren.forEach((tabRoute) => {
        userRoutes.push({ path: `${filterRoute.path}/${tabRoute.path}`, component: tabRoute.component })
      })
    })
    userRoutes = userRoutes.concat(userTabsRouteChildren, userFiltersRoutes)
    return userRoutes
  },

  getRouteChildren(entity) {
    const tabs = modulesManager.getAdminEntityTabs(`getAdmin${entity}Tabs`)
    let children = []
    tabs.forEach((tab) => {
      if (_.isArray(tab.tabRouteChildren)) {
        children = children.concat(tab.tabRouteChildren)
      }
    })
    return children
  },

  getUserRoutes(filterRoutePart = '') {
    const routes = [
      { path: filterRoutePart + 'create', component: EditUser },
      { path: filterRoutePart + 'id/:id', component: EditUser },
      { path: filterRoutePart + 'search/:search', component: Empty },
      { path: filterRoutePart + 'search/:search/id/:id', component: EditUser },
      { path: filterRoutePart + 'page/:page', component: Empty },
      { path: filterRoutePart + 'page/:page/id/:id', component: EditUser },
      { path: filterRoutePart + 'search/:search/page/:page', component: Empty },
      { path: filterRoutePart + 'search/:search/page/:page/id/:id', component: EditUser },
    ]
    if (filterRoutePart === '') {
      routes.push({ path: 'create', component: EditUser })
    }
    return routes
  },

  getUserFiltersRoutes() {
    const filters = modulesManager.getFiltersForUsers()
    const filtersRoutes = []
    filters.forEach((filterComponent) => {
      filtersRoutes.push({ path: filterComponent.filterRoute, component: Empty })
    })
    if (filters.length > 1) {
      filters.forEach((filterComponent1) => {
        filters.forEach((filterComponent2) => {
          if (filterComponent1.filterRoute !== filterComponent2.filterRoute) {
            const path = `${filterComponent1.filterRoute}/${filterComponent2.filterRoute}`
            filtersRoutes.push({ path: path, component: Empty })
          }
        })
      })
    }
    // TODO: if there are more than 2 filters
    return filtersRoutes
  },
}
