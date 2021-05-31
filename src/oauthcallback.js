window.addEventListener("load", endAuthentication);
const CONSUMER_KEY="11758-a73b85ac41814ed5b483f3a3";

function endAuthentication(){
  getConsumerKey();
}

function getConsumerKey(){
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
    console.log(xhr)
    if(xhr.readyState == 4 && xhr.status == 200){
      var resp = JSON.parse(xhr.response);
      localStorage['access_token'] = resp.access_token;
      localStorage['username'] = resp.username;
    }
  }
  xhr.send(JSON.stringify(params));
}
