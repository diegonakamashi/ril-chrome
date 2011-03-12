var bgPage = chrome.extension.getBackgroundPage();
	
function init(){
    setTimeout("build_page()", 1);
}
	  
function build_page(){
	var html_content = get_page_content();
	
	document.getElementById("table_list").innerHTML = html_content;	
	
	var items = get_items_per_page();
	
	if(items > 5){
        document.getElementById("list_div").style.overflow = "auto";
	}	
    build_favicons();
	build_footer();
}

function get_page_content(){
	var list = localStorage["ril_mylist"] ? localStorage["ril_mylist"] : "";
	
	if(list == ""){
        if((localStorage["rilName"]  && localStorage["rilPassword"])){
	        bgPage.is_authenticate(callback_empty_list_check);
        }else{	
	        list = "<tr class='list_msg' style=\"text-align:center; height: 200px\"><td class='no_border' style=\"font-size:20px;\">Please Configure The IWillRil in the Option page</td></tr>";
        }
	}	
	
  	var content = 	list;
	return content;
}


function callback_empty_list_check(resp){
	var list = "";
	if(resp == "200 OK"){
        show_load_screen();
        list = "<tr id=\"auth_failed\" class='list_msg' style=\"text-align:center; height: 200px\" ><td class='no_border' style=\"font-size:20px;\"><img src='build_list_loader.gif'></gif></td></tr>";
        document.getElementById('table_list').innerHTML = list;
        build_list();
	}
	else{
        list = "<tr id=\"auth_failed\" class='list_msg' style=\"text-align:center; height: 200px\" ><td class='no_border' style=\"font-size:20px;\">Authentication Failed!! Resp Code" + resp +"</td></tr>";
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
	if(get_items_per_page() > get_uncount_number()){
	    if(document.getElementById("all_msg_read"))
	        document.getElementById("table_list").innerHTML = "";

        document.getElementById("table_list").innerHTML += "<tr  id='load_td' ><td class=\"no_border\"><br></td><td><label id='loading'>Loading</label><img src='loader_table.gif'></img></td><td class=\"no_border\"></td></tr>" 
        document.getElementById("load_td").opacity = 0.4;
	}
  	document.getElementById("add_img").src = "bookmark_press.png";
	chrome.tabs.getSelected(null, function(tab) {
	    var url = tab.url;
	    var title = tab.title;
	    _add(url,title);        
	});
}

function _add(url, title){
	bgPage.add(callback_add, url, title);	
}

function callback_add(resp){
    build_list();
}

function get_actual_page(){
	if(document.getElementById('page_slc') && !isNaN(document.getElementById('page_slc').value))
        return document.getElementById('page_slc').value;
	return 1;	
}
	
function change_page(page){
    document.getElementById('page_slc').value = page;
}
	
function mark_as_read(url, id){
	change_list_elem_style(id);
	var array = new Array();
	array[0] = url;
	bgPage.send(callback_mark_as_read, array);
}

function callback_mark_as_read(url){	
	build_list();
}

function show_load_screen(){
	document.getElementById("list_div").style.opacity = 0.4;
}

function hide_load_screen(){
	document.getElementById("list_div").style.opacity = 1;
}

function change_list_elem_style(id){	
    document.getElementById("img_line_index"+id).src = "uncheck.png";
    var elem = document.getElementById("line_index_"+id);
	elem.style.opacity = 0.3;
	elem.style.textDecoration = "line-through";
}
	
function load_mylist(){
  	document.getElementById("refresh_img").src = "refresh_press.png";
	show_load_screen();
	build_list();
}

function change_title_style(id, style){
	if(style == 'on')
        document.getElementById('title_span_index_'+id).style.textDecoration = "underline";
	else
        document.getElementById('title_span_index_'+id).style.textDecoration = "none";
}	

function build_list(){	
	bgPage.get(callback_get, get_last_get_time());
}


function parse_list(list_s){	
	var list_obj = JSON.parse(list_s);	
	return list_obj;
}	
	  
function sort_list(list){
    list.sort(function(a, b){	
	if(a.time_updated > b.time_updated)
        return 1;
	else if (a.time_updated < b.time_updated)	
        return -1;
	return 0;
	});
	return list;	
}

function callback_get(resp){
	var list = RilList.parse_2jsonOK(resp);
	localStorage["json_list_iwillril"] = list;
	update_list(list);
}

function update_list(list){
    list = RilList.parse_json2obj(list);
    if(list.length > 0){
        list.sort(sort_function);
        var favicons = new Array();	
        var list_content = "";

        var page = get_actual_page();
        var items = get_items_per_page();

        var index = (page - 1) * items;

        if(index == list.length){
            --page;
            index -= items;    
            change_page(page);
        }

        var limit = items * page;
        if(list.length > index){
	        for(index; index < limit && index < list.length; index++){
	            var obj = list[index];
	            list_content += build_item_table(index, obj.title, obj.url);
	            favicons[index] = get_domain(obj.url)+"/favicon.ico";
	        }
        }
        localStorage["ril_mylist"] = list_content;
	    localStorage["actual_page_iwillril"] = get_actual_page();
	    var local_storage_favicons = favicons.join("||||");
	    localStorage["favicons"] = local_storage_favicons;
	}
	else{
	    localStorage["ril_mylist"]  = "";
	    list_content = "<tr id=\"all_msg_read\" class='list_msg' style=\"text-align:center; height: 200px\"><td class='no_border' style=\"font-size:20px;\">Congratulations!! You already read all yours items</td></tr>";
	}
	document.getElementById("table_list").innerHTML = list_content;	
	refresh_screen();
}

function refresh_screen(){
	update_data();
	hide_load_screen();
	hide_load_icon();
	build_favicons();
	change_img("refresh_img", "refresh.png");
	change_img("add_img", "bookmark.png");
}

function build_item_table(i, real_title, url){
    var title = real_title;
    if(title.length > 30)
    title = title.substr(0, 30) + "...";
    var item =  "<tr id=\"line_index_"+i+"\" >"+
                    "<td class=\"no_border\">"+
                        "<span><img id=\"favicon_index_"+i+"\" class=\"favicon\"></img></span>"+
                    "</td>"+
                    "<td>"+
                        "<span id=\"title_span_index_"+i+"\" onmouseout=\"change_title_style('"+i+"', 'off')\" onmouseover=\"change_title_style('"+i+"', 'on')\">"+
	                        "<a href=\""+url+"\" target=\"_blank\" title=\""+real_title+"\">"+title+"</a>"+
	                    "</span>"+
	                    "<br><label class=\"url_domain\">"+get_domain(url)+"</label>"+
                    "</td>"+
                    "<td class=\"no_border\">"+
                        "<span class=\"list_span\" id=\"list_img_index_"+i+"\" onclick=\"mark_as_read('"+url+"', "+i+")\">"+
	                        "<img  title=\"Mark as Read\" id=\"img_line_index"+i+"\" src='check.png'>"+
                        "</span>"+
                    "</td>"
                "</tr>";
	return item;
}

function get_domain(url){
	url = url.replace(/https?/,"");
	url = url.replace("://", "");
	var index = url.indexOf("/");
	url = "http://" + url.substr(0, index);
	return url;
}

function sort_function(a, b){	
	if(a.time_updated > b.time_updated)
        return 1;
	else if (a.time_updated < b.time_updated)	
        return -1;
	return 0;
}

function update_data(){
	setTimeout("_update_data()", 10);
}

function _update_data(){
	set_uncount_number();
}

function build_detailed_page(){
	setTimeout("_build_detailed_page()", 10);
}

function _build_detailed_page(){
	get_uncount_number();
	set_footer_msg();	
}

function build_footer(){
	set_footer_msg();
	set_footer_slc();
}

function set_footer_msg(){
	var uncount = localStorage["uncount_number"];
	var footer_msg = "I have nothing to read!!!";
	if(uncount && uncount > 0)
        footer_msg = "I will read "+uncount+" items Later!!!"
	document.getElementById("footer_msg").innerHTML = footer_msg;	
}

function set_footer_slc(){
	var select = get_footer_select();
	document.getElementById("pagination").innerHTML = select;
}

function get_footer_select(){
	var options_number = get_uncount_number() / get_items_per_page();	
	
	if(options_number == 0)
        options_number = 1;
	
	var options = "";
	
	for(var i = 0; i < options_number; i++){
        var page = localStorage["actual_page_iwillril"] ? localStorage["actual_page_iwillril"] : get_actual_page();
        var item = i + 1;	
        var selected = page == item ? " selected "	: "";
        options += "<option "+selected+" value='"+item+"'>"+item+"</option>";
	}
	var select = "<label id=\"select_text\">Page: </label><select id='page_slc' onchange='update_page()'>"+ options + "</select>";
	return select;
}

function update_page(){
	show_load_screen();
	update_list(localStorage["json_list_iwillril"]);
}

function get_items_per_page(){
	if(localStorage["ril_items_per_page"])
        return parseInt(localStorage["ril_items_per_page"]);
	return 5;	
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

function set_uncount_number(){
	bgPage.get_uncount_number(callback_set_uncount_number);  
}	

function callback_set_uncount_number(st){
    var st_json = JSON.parse(st);
    localStorage["uncount_number"] = st_json.count_unread;
    build_footer();
}

function change_img(id, img){
	if(document.getElementById(id))
        document.getElementById(id).src = img;
}

function show_load_icon(){
    document.getElementById("status_img").style.visibility = 'visible';
}

function hide_load_icon(){
    document.getElementById("status_img").style.visibility = 'hidden';
}

function get_unix_time(){
	var foo = new Date();
	var unixtime_ms = foo.getTime();
	var unixtime = parseInt(unixtime_ms / 1000);
	return unixtime;
}
