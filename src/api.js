import { UnauthorizedError } from './errors';
const Api = {}
const CONSUMER_KEY = "11758-a73b85ac41814ed5b483f3a3";

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

Api.getList = function () {
  var url = "https://getpocket.com/v3/get";
  var params = {
    "consumer_key": CONSUMER_KEY,
    "access_token": localStorage['access_token'],
    "sort": "newest"
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

Api.delete = function (callback, item_id) {
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

  Api._post(url, params, callback);
}

export default Api
