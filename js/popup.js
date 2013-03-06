window.addEventListener("load", init);

//Refactoring
function init(){
  Header.initFunctions();
  if(Auth.isAuthenticate()){
    addListeners();
    window.setTimeout(function(){buildPage();}, 1);
  }
  else{
    Auth.authenticate();
  }
}

function addListeners = function(){
  var bgPage = chrome.extension.getBackgroundPage();
  if(!chrome.tabs.onSelectionChanged.hasListeners())
    chrome.tabs.onSelectionChanged.addListener(bgPage.Background.manageSelectedTab);
  
  if(!chrome.tabs.onUpdated.hasListeners())
    chrome.tabs.onUpdated.addListener(bgPage.Background.manageSelectedTab);

  if(!chrome.extension.onRequest.hasListeners())
    chrome.extension.onRequest.addListener(onRequestListener);
}

function buildPage(){
  if(!localStorage["lastResponse"])
    refreshList();
  else
    updatePage();	
}

function markAsRead(){
  var item_id = $(this).attr('item_id');
  var id = $(this).attr('index');
  Table.changeElemStyle(id);
  Request.archieve(refreshList, parseInt(item_id));
}

function showLoadScreen(){
  if(document.getElementById("list_div"))
    document.getElementById("list_div").style.opacity = 0.4;
}

function hideLoadScreen(){
  if(document.getElementById("list_div"))
    document.getElementById("list_div").style.opacity = 1;
}

function refreshList(){
  showLoadScreen();
  Request.get(getCallback, 0);
}

function getCallback(resp){
  if(resp.status == 403 || resp.status == 401){
      localStorage['lastResponse'] = '';    
      Auth.authenticate();
  }
  else{
    localStorage['lastResponse'] = resp.response;
    updatePage();
  }
}

function updatePage(){
  var list = RilList.getItemsArray(); 
  
  if($("#table_list"))
  {
    hideLoadScreen();
    ExtensionIcon.set('../images/bookmark.png');
    Header.refresh();
    Table.render(list);
  }
  ExtensionIcon.setUncountLabel(list.length);
}