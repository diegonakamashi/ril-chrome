function Auth() { }
const CONSUMER_KEY = process.env.CONSUMER_KEY;
Auth.isAuthenticate = function () {
  return new Promise((resolve, reject) => {
    const isAuth = localStorage['access_token'] && localStorage['access_token'] != "null";
    resolve(isAuth)
  })
}

Auth.authenticate = function () {
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
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var resp = JSON.parse(xhr.response);
      var code = resp.code;
      localStorage['request_code'] = code;
      Auth.redirectToPocket(code);
    }
  }
  xhr.send(JSON.stringify(params));
}

Auth.redirectToPocket = function (code) {
  var redirectUri = chrome.extension.getURL('html/auth.html');
  chrome.tabs.create({ 'url': 'https://getpocket.com/auth/authorize?request_token=' + code + '&redirect_uri=' + redirectUri }, function (tab) {

  });
}



export default Auth
