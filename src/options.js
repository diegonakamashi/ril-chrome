import events from './events'
window.addEventListener("load", init);

function saveOptions(){
  localStorage['rilBtnShortCut'] = document.getElementById('ril_btn_shortcut').value;
  localStorage["mark_auto_iwillril"] = document.getElementById("mark_as_read_check").checked ? "true" : "false";
  localStorage["remove_context_menu_iwillril"] = document.getElementById("remove_context_menu_check").checked ? "true" : "false";
  localStorage['rilUpdateInterval'] = document.getElementById('ril_slc_updateinterval').value;
  localStorage['removeUncountLabel'] = document.getElementById('remove_uncount_label_check').checked ? "true" : "false";
  localStorage['deleteItensOption'] = document.getElementById('delete_itens_options_check').checked ? "true" : "false";

  chrome.runtime.sendMessage({ msg: events.UPDATE_UNCOUNT_LABEL }, (_) => {});
  chrome.runtime.sendMessage({ msg: events.UPDATE_ALARM_TIME }, (_) => {});
}

function addEventListeners() {
  document.querySelector('#ril_btn_shortcut').addEventListener('keyup', saveOptions)
  document.querySelectorAll('input').forEach(function(elem) {
    elem.addEventListener('change', saveOptions )
  })
  document.querySelectorAll('select').forEach(function(elem) {
    elem.addEventListener('change', saveOptions )
  })
}

function fillFields() {
  if(localStorage['rilBtnShortCut']){
    document.querySelector('#ril_btn_shortcut').value = localStorage['rilBtnShortCut']
  }

  if(localStorage['rilUpdateInterval']){
    document.querySelector('#ril_slc_updateinterval').value = localStorage['rilUpdateInterval']
  } else {
    document.querySelector('#ril_slc_updateinterval').value = 2
  }

  if(localStorage["mark_auto_iwillril"]) {
    document.getElementById("mark_as_read_check").checked = localStorage["mark_auto_iwillril"] == "true" ? true : false;
  }

  if(localStorage["remove_context_menu_iwillril"]) {
    document.getElementById("remove_context_menu_check").checked = localStorage["remove_context_menu_iwillril"] == "true" ? true : false;
  }

  if(localStorage['removeUncountLabel']) {
    document.getElementById('remove_uncount_label_check').checked = localStorage["removeUncountLabel"] == "true" ? true : false;
  }

  if(localStorage['deleteItensOption']) {
    document.getElementById('delete_itens_options_check').checked = localStorage["deleteItensOption"] == "true" ? true : false;
  }

}

function init(){
  addEventListeners();
  fillFields();
}
