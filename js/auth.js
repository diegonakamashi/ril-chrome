function Auth(){}
CONSUMER_KEY="";
Auth.isAuthenticate = function()
{
  return localStorage['access_token'] && localStorage['access_token'] != "null";
}

Auth.authenticate = function(){
  localStorage['access_token'] = null;
  var url = "https://getpocket.com/v3/oauth/request"
  var params = {
    consumer_key: CONSUMER_KEY,
    redirect_uri: window.location.href
  }

  var xhr = new XMLHttpRequest();
  xhr.open("post", url, true);   
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  xhr.setRequestHeader("X-Accept", "application/json");
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      var resp = JSON.parse(xhr.response);
      var code = resp.code;
      localStorage['request_code'] = code;
      Auth.redirectToPocket(code);
    }
  }
  xhr.send(JSON.stringify(params)); 
}

Auth.redirectToPocket = function(code){
  var redirectUri = chrome.extension.getURL('html/auth.html');
  chrome.tabs.create({'url': 'https://getpocket.com/auth/authorize?request_token='+code+'&redirect_uri='+redirectUri}, function(tab) {

  });   
}

Auth.getConsumerKey = function(){
  var url = "https://getpocket.com/v3/oauth/authorize"
  var params = {
    consumer_key: CONSUMER_KEY,
    code: localStorage['request_code']
  }

  var xhr = new XMLHttpRequest();
  xhr.open("post", url, true);   
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  xhr.setRequestHeader("X-Accept", "application/json");
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      var resp = JSON.parse(xhr.response);
      localStorage['access_token'] = resp.access_token;
      localStorage['username'] = resp.username;
    }
  }
  xhr.send(JSON.stringify(params)); 
}

