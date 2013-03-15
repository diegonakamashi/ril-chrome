window.addEventListener("load", init);

function save_options(){
    var button_shortcut = document.getElementById('ril_btn_shortcut').value;
    localStorage['rilBtnShortCut'] = button_shortcut;
    localStorage["mark_auto_iwillril"] = document.getElementById("mark_as_read_check").checked ? "true" : "false";
    localStorage["remove_context_menu_iwillril"] = document.getElementById("remove_context_menu_check").checked ? "true" : "false";
    localStorage['rilUpdateInterval'] = document.getElementById('ril_slc_updateinterval').value;  

    if(localStorage['ril_updateloopfunc']){
      clearInterval(localStorage['ril_updateloopfunc']);
      localStorage['ril_updateloopfunc'] = '';
      // chrome.extension.getBackgroundPage().update_loop();
    }
    
    alert("Saved!!!!");
  }   

  function init(){
    $("#opt_save_btn").click(save_options);
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
  }