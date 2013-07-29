window.addEventListener("load", init);

function save_options(){
    var button_shortcut = document.getElementById('ril_btn_shortcut').value;
    localStorage['rilBtnShortCut'] = button_shortcut;
    localStorage["mark_auto_iwillril"] = document.getElementById("mark_as_read_check").checked ? "true" : "false";
    localStorage["remove_context_menu_iwillril"] = document.getElementById("remove_context_menu_check").checked ? "true" : "false";
    localStorage['rilUpdateInterval'] = document.getElementById('ril_slc_updateinterval').value;  
    localStorage['removeUncountLabel'] = document.getElementById('remove_uncount_label_check').checked ? "true" : "false";  

    if(localStorage['ril_updateloopfunc']){
      clearInterval(localStorage['ril_updateloopfunc']);
      localStorage['ril_updateloopfunc'] = '';
      // chrome.extension.getBackgroundPage().update_loop();
    }

    chrome.extension.getBackgroundPage().Background.updateUncountLabel();
  }

  function init(){
    $("#ril_btn_shortcut").keyup(save_options);
    $("input").change(save_options);
    $("select").change(save_options);
    
    if(localStorage['rilBtnShortCut'])
      $('#ril_btn_shortcut').val(localStorage['rilBtnShortCut']);

    if(localStorage['rilUpdateInterval'])
      $('#ril_slc_updateinterval').val(localStorage['rilUpdateInterval']);
    else
      $('#ril_slc_updateinterval').val(2);

    if(localStorage["mark_auto_iwillril"])
      document.getElementById("mark_as_read_check").checked = localStorage["mark_auto_iwillril"] == "true" ? true : false;

    if(localStorage["remove_context_menu_iwillril"])
      document.getElementById("remove_context_menu_check").checked = localStorage["remove_context_menu_iwillril"] == "true" ? true : false;    
    
    if(localStorage['removeUncountLabel'])
      document.getElementById('remove_uncount_label_check').checked = localStorage["removeUncountLabel"] == "true" ? true : false;
  }
