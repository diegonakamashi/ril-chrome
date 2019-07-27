function RilList(){

}

RilList._sortOld = function(a, b){
  if(a.time_updated > b.time_updated)
    return 1;
  else if (a.time_updated < b.time_updated)
    return -1;
  return 0;
}

RilList._sortNew = function(a, b){
  if(a.time_updated > b.time_updated)
    return -1;
  else if (a.time_updated < b.time_updated)
    return 1;
  return 0;
}

RilList.getItemsArray = function(term = null){
  var lastResponse = localStorage['lastResponse'];
  if(!lastResponse)
    return [];

  var obj = JSON.parse(lastResponse);
  var items = [];
  for(var key in obj.list){
    const item = obj.list[key];
    if (!term){
      items.push(item);
      continue
    }
    let itemTitle = item.resolved_title;
    itemTitle = itemTitle || item.given_title;

    if(itemTitle.toLowerCase().includes(term.toLowerCase())){
      items.push(item)
    }
  }

  var order = localStorage['iwillril_order_by']

  if(order == "new")
    return items.sort(RilList._sortNew);
  else
    return items.sort(RilList._sortOld);
}

RilList.getItemId = function(url){
  var list = RilList.getItemsArray();
  for(var i = 0; i < list.length; i++){
    var obj = list[i];
    if(obj.resolved_url == url || obj.given_url == url)
      return parseInt(obj.item_id);
  }
  return null;
}

