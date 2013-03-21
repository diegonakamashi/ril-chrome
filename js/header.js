function Header(){}

Header.initFunctions = function(){
  $("#add_button").click(Header.add);
  $("#option_footer").click(Header.openOptions);
  $("#sync_button").click(refreshList);
  $("#order_select").change(Header.orderBy);
}

Header.openOptions = function(){
  var optionsUrl = chrome.extension.getURL('html/options.html');
  chrome.tabs.create({url: optionsUrl});
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
  $("#order_select").val(localStorage['iwillril_order_by'])
}

Header.orderBy = function(){
  var order = document.getElementById("order_select").value;
  localStorage['iwillril_order_by'] = order;
  buildPage();
}

Header.refresh = function(){
  Header.updateOrderBy();
  $('input#iwillril_search').quicksearch('table#iwillril_table tbody tr');
}