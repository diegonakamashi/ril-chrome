function TabFunction(){}

TabFunction.init = function(){
  chrome.tabs.onSelectionChanged.addListener(TabFunction.manageSelectedTab);
  chrome.tabs.onUpdated.addListener(TabFunction.manageSelectedTab);
  chrome.extension.onRequest.addListener(TabFunction.keyboardShortcutManager);
}

TabFunction.manageSelectedTab = function(tabid, obj){
  chrome.contextMenus.removeAll();
  chrome.tabs.get(tabid, function (tab){
    var list = RilList.getItemsArray(); 

    for(var i = 0; i < list.length; i++){
      var obj = list[i];
      if(tab.url == obj.resolved_url)        
      {
        chrome.contextMenus.create({"title": "Mark as Read ", "onclick": TabFunction.markAsRead,"contexts":["page"]});      
        return;
      }
    } 

    chrome.contextMenus.create({"title": "I'll Read it Later ", "onclick": TabFunction.iWillRil,"contexts":["page", "link"]});
  });
}

TabFunction.markAsRead = function(info, tab){
  chrome.tabs.getSelected(null, function(tab) {
    var url = tab.url;
    var title = tab.title;
    Request.send(iwillril_callback, [url]);
  });
}

TabFunction.iWillRil = function(info, tab){     
  if(info && info.linkUrl && info.linkUrl.length > 0)
    Request.add(iwillril_callback, info.linkUrl,info.linkUrl);
}

TabFunction.onExtensionRequest = function(request, sender, sendResponse){
 switch(request.name){
    case 'keyShortCut':
      TabFunction.keyboardShortcutManager(request.keyCode);
  }
}

TabFunction.keyboardShortcutManager = function(keyCode){
  if(!localStorage['rilBtnShortCut'])
    return;

  var shortCut = localStorage['rilBtnShortCut'];
  var charKey = String.fromCharCode(keyCode);

  if(shortCut.toLowerCase() == charKey.toLowerCase()){
    chrome.tabs.getSelected(null, function(tab) {
      Request.add(updatePage, tab.url, tab.title);        
    });
  }
}