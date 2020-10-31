import Api from './../api'

export function fetchItemsFromCache(params = {}) {
  const {
    searchWord
  } = params
  if (localStorage['ITEMS']) {
    try {
      const items = JSON.parse(localStorage['ITEMS'])
      if(!searchWord) {
        return Promise.resolve(items)
      }

      const searchedItems = [];
      items.forEach((item) => {
        if(item.resolved_title && item.resolved_title.toLowerCase().includes(searchWord)) {
          searchedItems.push(item);
        } else if (item.given_title && item.given_title.toLowerCase().includes(searchWord)) {
          searchedItems.push(item);
        }
      });
      return Promise.resolve(searchedItems);
    } catch {
      localStorage['ITEMS'] = null
      return Promise.resolve(null)
    }
  }
  return Promise.resolve(null)
}

export function fetchItems() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Api.getList()
      const items = []
      for (var key in response.list) {
        items.push(response.list[key]);
      }
      localStorage['ITEMS'] = JSON.stringify(items);
      resolve(items)
    } catch (e) {
      reject(e)
    }
  })
}

export function archiveItem(itemId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Api.archieve(itemId);
      resolve({})
    } catch {
      reject(null)
    }
  })
}


export function addItem(url, title) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Api.addItem(url, title);
      resolve(response.item)
    } catch {
      reject()
    }
  })
}

export function getSettings() {
  const orderBy = localStorage['iwillril_order_by'] || 'new';
  const removeContextMenu = localStorage['remove_context_menu_iwillril'] && localStorage['remove_context_menu_iwillril'] == 'true';
  const removeUncountLabel = localStorage['removeUncountLabel'] == 'true';
  const autoMarkItemAsRead = localStorage["mark_auto_iwillril"] == "true";

  return Promise.resolve({
    orderBy,
    removeContextMenu,
    removeUncountLabel,
    autoMarkItemAsRead
  })
}

export function updateSettings(key, value) {

  if (key == 'orderBy') {
    localStorage['iwillril_order_by'] = value;
  }

  return Promise.resolve(true)

}

export function findItemByUrl(url) {
  const list = JSON.parse(localStorage['ITEMS']);
  for (var i = 0; i < list.length; i++) {
    var obj = list[i];
    if (obj.resolved_url == url || obj.given_url == url)
      return Promise.resolve(obj);
  }
  return Promise.resolve(null);
}

