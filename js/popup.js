window.addEventListener("load", init);

function init(){
  Header.initFunctions();
  if(Auth.isAuthenticate()){
    window.setTimeout(function(){buildPage();}, 1);
  }
  else{
    Auth.authenticate();
  }
}


function buildPage(){
  if(!localStorage["lastResponse"])
    refreshList();
  else
    updatePage();
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

function updatePage(term = null){
  var list = RilList.getItemsArray(term);

  if(document.querySelector("#table_list")){
    hideLoadScreen();
    ExtensionIcon.loaded();
    Table.render(list);
    Header.refresh();
  }
  ExtensionIcon.setUncountLabel(list.length);
}
