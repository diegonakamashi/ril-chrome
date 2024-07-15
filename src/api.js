import { UnauthorizedError } from './errors';
const Api = {}
const CONSUMER_KEY = process.env.CONSUMER_KEY;

Api._postRequest = async function (url, params) {
  const rawResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'X-Accept': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (rawResponse.ok) {
    const content = await rawResponse.json();
    return content
  } else {
    if (rawResponse.status === 401) {
      throw new UnauthorizedError();
    }
    throw new Error();
  }
}

Api.addItem = function (addurl, title) {
  var url = "https://getpocket.com/v3/add";

  var params = {
    "url": addurl,
    "title": title,
    "consumer_key": CONSUMER_KEY,
    "access_token": localStorage['access_token']
  }

  return Api._postRequest(url, params);
}


Api.getList = function (params) {
  var state = params.state || "unread";
  var count = params.count || 30;
  var offset = params.offset || 0;

  var url = "https://getpocket.com/v3/get";
  var params = {
    "consumer_key": CONSUMER_KEY,
    "access_token": localStorage['access_token'],
    "state": state,
    "sort": "newest",
    "count": count,
    "offset": offset
  }

  return Api._postRequest(url, params);
}

Api.archieve = function (item_id) {
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

  return Api._postRequest(url, params);
}

Api.delete = function (item_id) {
  var url = "https://getpocket.com/v3/send";
  var actions = [
    {
      "action": "delete",
      "item_id": item_id
    }
  ];

  var params = {
    "consumer_key": CONSUMER_KEY,
    "access_token": localStorage['access_token'],
    "actions": actions
  }

  return Api._postRequest(url, params);
}

export default Api
