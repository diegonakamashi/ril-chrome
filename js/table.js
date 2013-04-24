function Table(){}

Table.render = function(list){
  var list_content = "";
  for(var i = 0; i < list.length; i++)
  {
    var item = list[i];
    item.index = i;
    var html = Table.getItemHtml(item);
    list_content += html;
  }

  $("#table_list").html(list_content);
  $(".table_img_mark_as_read").click(Table.markAsRead);
  $(".item_link_td").click(Table.tryToMarkAsRead);
}

Table.markAsRead = function(){
  var item_id = $(this).attr('item_id');
  var id = $(this).attr('index');
  Table.changeElemStyle(id);
  Request.archieve(refreshList, parseInt(item_id));
}

Table.tryToMarkAsRead = function(){
  if(localStorage["mark_auto_iwillril"] == "true"){
    var bg = chrome.extension.getBackgroundPage();
    var item_id = $(this).attr('item_id');
    Request.archieve(bg.Background.updateContent, parseInt(item_id));
  }
}

Table.getItemHtml = function(item){
  var title = Table.getItemTitle(item);
  var item =  "<tr class=\"table_row\" id=\"line_index_"+item.index+"\" >"+
    "<td class=\"no_border favicon\">"+
    "<span><img src=\""+Table.getFaviconUrl(item)+"\" id=\"favicon_index_"+item.index+"\" class=\"favicon_img\"></img></span>"+
    "</td>"+
    "<td nowrap='nowrap' class=\"item_link_td\" item_id=\""+item.item_id+"\">"+
    "<span id=\"title_span_index_"+item.index+"\">"+
    "<a href=\""+Table.getItemUrl(item)+"\" target=\"_blank\" title=\""+title+"\">"+title+"</a>"+
    "</span>"+
    "</td>"+
    "<td class=\"no_border table_img_mark_as_read icon-ok\" id=\"list_img_index_"+item.index+"\" item_id=\""+item.item_id+"\" index=\""+item.index+"\" title=\"Mark as Read\">"
    "</td>" +
    "</tr>";
    return item;
}

Table.getFaviconUrl = function(item){
  var url = Table.getItemUrl(item);
  return "http://g.etfv.co/"+ encodeURIComponent(url);
  // return Table.getDomain(url)+"/favicon.ico";
  // return "http://www.google.com/s2/favicons?domain_url="+ encodeURIComponent(url);
}

Table.getItemTitle = function(item){
  if(item.resolved_title)
    return item.resolved_title;
  else if(item.given_title)
    return item.given_title;
  else
    return getItemUrl(item);
}

Table.getItemUrl = function(item){
  if(item.resolved_url)
    return item.resolved_url;
  return item.given_url;
}

Table.getDomain = function(url){
  if(!url)
    return "";
  url = url.replace(/https?/,"");
  url = url.replace("://", "");
  var index = url.indexOf("/");
  url = "http://" + url.substr(0, index);
  if(url.length > 30)
    url = url.substr(0, 30) + "...";
  return url;
}

Table.changeElemStyle = function(id){  
  if(document.getElementById("list_img_index_"+id))
  {
    document.getElementById("list_img_index_"+id).style.backgroundImage="url('images/uncheck.png')";
    var elem = document.getElementById("line_index_"+id);
    elem.style.opacity = 0.3;
    elem.style.textDecoration = "line-through";
  }
}