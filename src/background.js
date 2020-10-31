import ExtensionIcon from './extensionIcon'
import {
  getSettings,
  fetchItemsFromCache,
  addItem,
  archiveItem,
  fetchItems,
  findItemByUrl
} from './app/repo'
import events from './events'

const I_WILL_RIL_ALARM = 'iwillril_alarm'

function Background() { }

Background.init = function () {
  Background.updateAlarmTime();

  chrome.alarms.onAlarm.addListener(async function(alarm) {
    if(alarm.name == I_WILL_RIL_ALARM) {
      await refreshItems()
    }
  })

  if (!chrome.tabs.onSelectionChanged.hasListeners()) {
    chrome.tabs.onSelectionChanged.addListener(Background.manageSelectedTab);
  }

  if (!chrome.tabs.onUpdated.hasListeners()) {
    chrome.tabs.onUpdated.addListener(Background.manageSelectedTab);
  }

  if (!chrome.extension.onRequest.hasListeners()) {
    chrome.extension.onRequest.addListener(Background.onExtensionRequest);
  }

  chrome.runtime.connect();

  getItemsFromCache();
  Background._startListeners();
}

Background._startListeners = function () {
  chrome.runtime.onMessage.addListener(
    function (request, _, sendResponse) {
      if (request.msg === events.ADD) {
        const payload = request.payload
        addItemInPocket({}, { url: payload.url, title: payload.title })
          .then((items) => {
            sendResponse({
              success: true,
              payload: items
            })
          })
          .catch(() => {
            sendResponse({ success: false })
          })
        return true
      }
      if (request.msg == events.FETCH_ITEMS_FROM_CACHE) {
        getItemsFromCache(request.payload)
          .then((items) => {
            sendResponse({
              success: true,
              payload: items
            })
          })
        return true;
      }
      if (request.msg === events.REFRESH_ITEMS) {
        refreshItems()
          .then((items) => {
            sendResponse({
              success: true,
              payload: items
            })
          })
          .catch((e) => {
            sendResponse({
              success: false, error: e.message
            })
          })
        return true
      }
      if (request.msg === events.ARCHIVE) {
        const payload = request.payload
        markAsRead(payload.itemId)
          .then((items) => {
            sendResponse({
              success: true,
              payload: items
            })
          })
          .catch(() => {
            sendResponse({ success: false })
          })
        return true
      }
      if (request.msg === events.UPDATE_UNCOUNT_LABEL) {
        updateUncountLabel();
        return true;
      }
      if (request.msg === events.UPDATE_ALARM_TIME) {
        Background.updateAlarmTime();
        return true;
      }
    }
  );
}

Background.updateAlarmTime = async function () {
  const settings = await getSettings();
  console.log('UPDATE ALARM TIMRE', settings.updateIntervalInMinutes)
  chrome.alarms.clear(I_WILL_RIL_ALARM, function() {
    chrome.alarms.create(I_WILL_RIL_ALARM, {
      periodInMinutes: settings.updateIntervalInMinutes
    })
  })
}

Background.manageSelectedTab = async function (tabid, obj) {
  chrome.contextMenus.removeAll();
  const settings = await getSettings();
  if (settings.removeContextMenu) {
    return;
  }

  chrome.tabs.get(tabid, async function (tab) {
    const list = await fetchItemsFromCache() || [];

    for (var i = 0; i < list.length; i++) {
      var obj = list[i];
      if (tab.url == obj.resolved_url || tab.url == obj.given_url) {
        chrome.contextMenus.create({
          title: "Mark as Read",
          onclick: async (info, tab) => {
            markAsRead(obj.item_id);
          },
          contexts: ["page"]
        });
        return;
      }
    }
    chrome.contextMenus.create({
      title: "I'll Read it Later",
      onclick: async (info, tab) => {
        addItemInPocket(info, tab)
      },
      contexts: ["page", "link"]
    });
  });
}


Background.onExtensionRequest = function (request, sender, sendResponse) {
  switch (request.name) {
    case 'keyShortCut': {
      Background.keyboardShortcutManager(request);
    }
  }
}

Background.keyboardShortcutManager = function (request) {
  if (!localStorage['rilBtnShortCut'])
    return;

  var shortCut = localStorage['rilBtnShortCut'];
  var charKey = String.fromCharCode(request.keyCode);

  if (shortCut.toLowerCase() == charKey.toLowerCase())
    chrome.tabs.getSelected(null, async function (tab) {
      const item = await findItemByUrl(tab.url)
      if (item) {
        markAsRead(item.item_id);
      }
      else {
        addItemInPocket({}, tab);
      }
    })
}

async function markAsRead(itemId) {
  ExtensionIcon.loading();
  await archiveItem(itemId);
  const items = await refreshItems();
  return items;
}


async function addItemInPocket(info, tab) {
  ExtensionIcon.loading();
  var title, url;
  if (info.linkUrl) {
    url = info.linkUrl;
    title = info.linkUrl;
  } else {
    url = info.pageUrl || tab.url;
    title = tab.title || info.pageUrl;
  }

  await addItem(url, title);
  const items = await refreshItems();
  return items;
}

async function getItemsFromCache(params) {
  const items = await fetchItemsFromCache(params)
  await updateUncountLabel();
  return items
}

async function refreshItems() {
  ExtensionIcon.loading();
  const items = await fetchItems();
  await updateUncountLabel();
  ExtensionIcon.loaded();
  return items;
}

async function updateUncountLabel() {
  const settings = await getSettings();
  if (!settings.removeUncountLabel) {
    const totalItems = await fetchItemsFromCache() || [];
    ExtensionIcon.setUncountLabel(totalItems.length)
  } else {
    ExtensionIcon.removeUncountLabel()
  }
  return Promise.resolve();
}

Background.init();

export default Background
