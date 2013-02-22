Request = {}

Request._post = function(url, params, callback){
  var xhr = new XMLHttpRequest();
  xhr.open("post", url, true);   
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4)
      callback(xhr);     
  }
  xhr.send(JSON.stringify(params)); 
}

Request.add = function(callback, addurl, title){
  var url = "https://getpocket.com/v3/add";

  var params = {
    "url": addurl,
    "title": title,
    "consumer_key": CONSUMER_KEY,
    "access_token": localStorage['access_token']
  }

  Request._post(url, params, callback);		
}

Request.get = function(callback, time){
  var url = "https://getpocket.com/v3/get";
  var params = {
    "sort": "oldest",
    "consumer_key": CONSUMER_KEY,
    "access_token": localStorage['access_token']
  }

  Request._post(url, params, callback);		
}

Request.archieve = function(callback, item_id){
  var url = "https://getpocket.com/v3/send";
  var actions = [
      {
        "action": "archive",
        "item_id": item_id
      }
    ];

  var params = {
    "consumer_key": CONSUMER_KEY,
    "access_token": localStorage['access_token'],
    "actions": actions
  }

  Request._post(url, params, callback); 
}

