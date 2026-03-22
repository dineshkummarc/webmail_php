function replaceStorageDataKey(oldKey, newKey) {
  const data = localStorage.getItem(oldKey)
  if (data) {
    localStorage.removeItem(oldKey)
    if (newKey) {
      localStorage.setItem(newKey, data)
    }
  }
};

export function convertLocalstorageData() {
  const convertMap = [
    { old: 'groups-list-splitter-width', new: 'aurora_admin_groups_splitter-width' },
    { old: 'system-splitter-width', new: 'aurora_admin_system_splitter-width' },
    { old: 'tenants-list-splitter-width', new: 'aurora_admin_tenants_splitter-width' },
    { old: 'tenants-tabs-splitter-width', new: 'aurora_admin_tenants_tabs_splitter-width' },
    { old: 'users-list-splitter-width', new: 'aurora_admin_users_splitter-width' },
    { old: 'users-tabs-splitter-width', new: 'aurora_admin_users_tabs_splitter-width' },
    { old: 'domains-list-splitter-width', new: 'aurora_admin_domains_splitter-width' },
    { old: 'domains-tabs-splitter-width', new: 'aurora_admin_domains_tabs_splitter-width' },
    { old: 'mailing-lists-list-splitter-width', new: 'aurora_admin_mailing_lists_splitter-width' },
    { old: 'adminpanelResizerWidth', new: '' },
  ]

  convertMap.forEach(dataKeys => {
    replaceStorageDataKey(dataKeys.old, dataKeys.new)
  })
}
