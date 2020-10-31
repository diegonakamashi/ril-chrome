function ExtensionIcon(){}

ExtensionIcon.set = function(icon){
  var object = new Object();
  object.path = chrome.extension.getURL(icon);
  chrome.browserAction.setIcon(object);
}

ExtensionIcon.setUncountLabel = function(size){
  var txt = new Object();
  txt.text=size.toString();
  chrome.browserAction.setBadgeText(txt);
}

ExtensionIcon.removeUncountLabel = function(){
  var txt = new Object();
  txt.text = '';
  chrome.browserAction.setBadgeText(txt);
}
ExtensionIcon.loaded = function(){
    ExtensionIcon.set('images/bookmark.png');
}

ExtensionIcon.loading = function(){
  ExtensionIcon.set('images/loader_table.gif');
}

export default ExtensionIcon
