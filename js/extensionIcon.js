function ExtensionIcon(){}

ExtensionIcon.set = function(icon){
  var object = new Object();
  object.path = icon;
  chrome.browserAction.setIcon(object);
}

ExtensionIcon.setUncountLabel = function(size){
  var txt = new Object();
  txt.text=size.toString();
  chrome.browserAction.setBadgeText(txt);
}

