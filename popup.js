var bgPage = chrome.extension.getBackgroundPage();

function init(){
	bgPage.update_loop();    
    setTimeout("build_page()", 1);
}

function build_page(){

	if(!localStorage["ril_mylist_array"]){
        if((localStorage["rilName"]  && localStorage["rilPassword"])){
	        bgPage.is_authenticate(callback_empty_list_check);
        }else{	
	        document.getElementById("table_list").innerHTML = "<tr class='list_msg' style=\"text-align:center; height: 200px\"><td class='no_border' style=\"font-size:20px; font-family: Didact Gothic;\">Please Configure the Login in the <label class='real_link' onclick='open_options();'>Option page</label></td></tr>";
        }
	}	
	else{
	    update_page();
	}		
}

function open_options(){
    var optionsUrl = chrome.extension.getURL('options.html');
    chrome.tabs.create({url: optionsUrl});
}

function callback_empty_list_check(resp){
	var list = "";
	if(resp == "200 OK"){
        show_load_screen();
        list = "<tr id=\"auth_failed\" class='list_msg' style=\"text-align:center; height: 200px\" ><td class='no_border' style=\"font-size:20px;\"><img src='build_list_loader.gif'></gif></td></tr>";

        if(document.getElementById('table_list'))
            document.getElementById('table_list').innerHTML = list;
        build_list();
	}
	else{
        list = "<tr id=\"auth_failed\" class='list_msg' style=\"text-align:center; height: 200px\" ><td class='no_border' style=\"font-size:20px;  font-family: Didact Gothic;\">Authentication Failed!! Resp Code" + resp +"</td></tr>";
        document.getElementById('table_list').innerHTML = list;
	}	
}

function build_favicons(){
    if(localStorage["favicons"]){
        var favicons = localStorage["favicons"].split("||||");	  
        for(var i = 0; i < favicons.length; i++){
            change_img("favicon_index_"+i, favicons[i]);
        }
	}  
}

function add(){
	show_load_icon();
	chrome.tabs.getSelected(null, function(tab) {
	    	var url = tab.url;
	    	var title = tab.title;
	    	_add(url,title);        
			});
}

function set_icon(icon){
	var object = new Object();
	object.path = icon;
	chrome.browserAction.setIcon(object);
}

function _add(url, title){
	bgPage.add(callback_add, url, title);	
}

function callback_add(resp){
    build_list();
}

function mark_as_read_auto(url){
    if(localStorage["mark_auto_iwillril"] && localStorage["mark_auto_iwillril"] == 'true')
        mark_as_read(url, 'auto');
}

function mark_as_read(url, id){
	change_list_elem_style(id);
	var array = new Array();
	array[0] = url;
	bgPage.send(callback_mark_as_read, array);
}

function callback_mark_as_read(resp){	
    if(resp == "200 OK")
		build_list();
}

function show_load_screen(){
    if(document.getElementById("list_div"))
    	document.getElementById("list_div").style.opacity = 0.4;
}

function hide_load_screen(){
    if(document.getElementById("list_div"))
	    document.getElementById("list_div").style.opacity = 1;
}

function change_list_elem_style(id){	
    if(document.getElementById("list_img_index_"+id))
    {
        document.getElementById("list_img_index_"+id).style.backgroundImage="url('uncheck.png')";
        var elem = document.getElementById("line_index_"+id);
	    elem.style.opacity = 0.3;
	    elem.style.textDecoration = "line-through";
	}
}

function load_mylist(){
	show_load_screen();
	build_list();
}

function build_list(){	
	bgPage.get(callback_get, get_last_get_time());
}


function parse_list(list_s){	
	var list_obj = JSON.parse(list_s);	
	return list_obj;
}

function callback_get(resp){
    if(resp == "403 Forbidden" || resp == "401 Unauthorized"){
        if(document.getElementById("table_list"))
            document.getElementById("table_list").innerHTML = "<tr class='list_msg' style=\"text-align:center; height: 200px\"><td class='no_border' style=\"font-size:20px;\">Wrong username/password</td></tr>";
        hide_load_screen();
    }
    else{    
        bgPage.update_content(resp);    
	    update_page();
	}
}

function update_page(){
    build_content();

    if(document.getElementById("order_select"))
    {
        if(localStorage['iwillril_order_by'] == "new")
            document.getElementById("order_select").selectedIndex = 1;
        else    
            document.getElementById("order_select").selectedIndex = 0;
    }    
	build_footer();
	build_favicons();
	set_uncount_label();
	refresh_screen();    
}

function refresh_screen(){	
	hide_load_screen();
	hide_load_icon();
	load_quicksearch();	
}

function load_quicksearch(){	
	$('input#iwillril_search').quicksearch('table#iwillril_table tbody tr');
}

//TODO -> melhorar a lógica de itens_per page
function build_content(){
    var list_content = "";
    if(localStorage["ril_mylist_array"]){    
        var list_array = localStorage["ril_mylist_array"].split("||||");        

        localStorage["uncount_number"] = list_array.length;

        for(var index = 0; index < list_array.length; index++){
	        list_content += list_array[index];
	   	}

        localStorage["ril_mylist"] = list_content;

    }else{
        localStorage["uncount_number"] = 0;
	    localStorage["ril_mylist"]  = "";
	    list_content = "<tr id=\"all_msg_read\" class='list_msg' style=\"text-align:center; height: 200px\"><td class='no_border' style=\"font-size:20px;  font-family: Didact Gothic;\">Congratulations!! You already read all yours items</td></tr>";
	}
	if(document.getElementById("table_list"))
	    	document.getElementById("table_list").innerHTML = list_content;

	load_quicksearch();	
}

function build_footer(){
	set_footer_msg();
}

function set_footer_msg(){
	var uncount = localStorage["uncount_number"];
	var footer_msg = "I have nothing to read!!!";
	if(uncount && uncount > 0)
        footer_msg = "I will read "+uncount+" items Later!!!"
    		if(document.getElementById("footer_msg"))    
    			document.getElementById("footer_msg").innerHTML = footer_msg;	
}

function get_uncount_number(){
	if(localStorage["uncount_number"]){
        return localStorage["uncount_number"];
	}
	return 0;
}

function get_last_get_time(){
    return 0;

	if(localStorage["last_get_time_iwillril"]){
        var time =	localStorage["last_get_time_iwillril"];
        localStorage["last_get_time_iwillril"] = get_unix_time();                
        return time;
	}

	localStorage["last_get_time_iwillril"] = get_unix_time();
	return 0;
}

function change_img(id, img){
	if(document.getElementById(id))
        document.getElementById(id).src = img;
}

function show_load_icon(){
    if(document.getElementById("status_img"))
        document.getElementById("status_img").style.visibility = 'visible';
}

function hide_load_icon(){
    if(document.getElementById("status_img"))
        document.getElementById("status_img").style.visibility = 'hidden';
}

function get_unix_time(){
	var foo = new Date();
	var unixtime_ms = foo.getTime();
	var unixtime = parseInt(unixtime_ms / 1000);
	return unixtime;
}

function order_by(){
    if(!localStorage["json_list_iwillril"])
        return;

    var order = document.getElementById("order_select").value;
    localStorage['iwillril_order_by'] = order;
    bgPage.update_content(localStorage["json_list_iwillril"]);
    update_page();
}


function set_uncount_label(){
    var uncount = localStorage["uncount_number"];
    if(isNaN(uncount) || uncount <= 0)
      	uncount = "";

    var txt = new Object();
    txt.text=uncount;
    chrome.browserAction.setBadgeText(txt);
}

