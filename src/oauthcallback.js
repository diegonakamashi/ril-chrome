window.addEventListener("load", endAuthentication);
const CONSUMER_KEY = process.env.CONSUMER_KEY;

function endAuthentication() {
  getConsumerKey();
}

function getConsumerKey() {
  var url = "https://getpocket.com/v3/oauth/authorize"
  var params = {
    consumer_key: CONSUMER_KEY,
    code: localStorage['request_code']
  }

  var xhr = new XMLHttpRequest();
  xhr.open("post", url, true);
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  xhr.setRequestHeader("X-Accept", "application/json");
  xhr.onreadystatechange = function () {
    console.log(xhr)
    if (xhr.readyState == 4 && xhr.status == 200) {
      var resp = JSON.parse(xhr.response);
      localStorage['access_token'] = resp.access_token;
      localStorage['username'] = resp.username;

      //REFRESH ITEMS
      chrome.runtime.sendMessage({ msg: 'REFRESH_ITEMS' }, function (response) {
        console.log(response)
      });
    }
  }
  xhr.send(JSON.stringify(params));
}
