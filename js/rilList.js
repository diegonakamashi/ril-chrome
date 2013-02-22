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

RilList.getItemsArray = function(){
  var lastResponse = localStorage['lastResponse'];
  if(!lastResponse)
    return [];
  
  var obj = JSON.parse(lastResponse);
  var items = [];
  for(var key in obj.list){
    items.push(obj.list[key]);
  }

  var order = localStorage['iwillril_order_by']

  if(order == "new")
    return items.sort(RilList._sortNew);
  else
    return items.sort(RilList._sortOld);
}

