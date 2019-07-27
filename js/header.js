function Header(){}

Header._searchTimeout = null

Header.initFunctions = function(){
  document.querySelector("#add_button").addEventListener('click', Header.add);
  document.querySelector("#option_footer").addEventListener('click', Header.openOptions);
  document.querySelector("#sync_button").addEventListener('click', Header.refreshList);
  document.querySelector("#order_select").addEventListener('click', Header.orderBy);
  document.querySelector("#iwillril_search").addEventListener('keyup', function(ev) {
    clearTimeout(Header._searchTimeout)
    Header._searchTimeout = setTimeout(() => {
      updatePage(ev.target.value)
    }, 200)
  });
}

Header.openOptions = function(){
  var optionsUrl = chrome.extension.getURL('html/options.html');
  chrome.tabs.create({url: optionsUrl});
}

Header.refreshList = function(){
  showLoadScreen();
  refreshList();
}

Header.add = function(){
  ExtensionIcon.set('../images/loader_table.gif');
  chrome.tabs.getSelected(null, function(tab) {
    var url = tab.url;
    var title = tab.title;
    Request.add(refreshList, url, title);
  });
}

Header.updateOrderBy = function(){
  document.querySelector('#order_select').value = localStorage['iwillril_order_by']
}

Header.orderBy = function(){
  var order = document.getElementById("order_select").value;
  localStorage['iwillril_order_by'] = order;
  buildPage();
}

Header.refresh = function(){
  Header.updateOrderBy();
}
