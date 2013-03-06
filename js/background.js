
function Background(){}


Background.manageSelectedTab = function(tabid, obj){
  chrome.contextMenus.removeAll();
  chrome.tabs.get(tabid, function (tab){
    var list = RilList.getItemsArray(); 

    for(var i = 0; i < list.length; i++){
      var obj = list[i];
      if(tab.url == obj.resolved_url || tab.url == obj.given_url){
        chrome.contextMenus.create({"title": "Mark as Read ", "onclick": Background.markAsRead,"contexts":["page"]});      
        return;
      }
    } 
    chrome.contextMenus.create({"title": "I'll Read it Later ", "onclick": Background.iWillRil,"contexts":["page", "link"]});
  });
}

Background.markAsRead = function(info, tab){
  chrome.tabs.getSelected(null, function(tab) {
    var url = tab.url;
    var itemId = RilList.getItemId(url);
    Request.archieve(refreshList, itemId);
  });
}

Background.iWillRil = function(info, tab){
  var title, url;

  if(info.linkUrl){
    url = info.linkUrl;
    title = info.linkUrl;
  }else{
    url = info.pageUrl;
    title = tab.title || info.pageUrl;
  }

  if(url)
    Request.add(refreshList, url, title);
}

Background._updateContent = function(){
  Request.get(function(resp){
    if(resp.status == 403 || resp.status == 401)
      localStorage['lastResponse'] = '';
    else
      localStorage['lastResponse'] = resp.response;
  }, 0);
}

Background.onExtensionRequest = function(request, sender, sendResponse){
 switch(request.name){
    case 'keyShortCut':
      Background.keyboardShortcutManager(request);
  }
}

Background.keyboardShortcutManager = function(request){
  if(!localStorage['rilBtnShortCut'])
    return;

  var shortCut = localStorage['rilBtnShortCut'];
  var charKey = String.fromCharCode(request.keyCode);

  if(shortCut.toLowerCase() == charKey.toLowerCase())
    Background.iWillRil();
}
Background.init();
