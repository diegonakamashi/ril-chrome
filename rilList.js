function RilList(){

}

RilList.parse_2jsonOK = function(list_wrong){
    var obj = JSON.parse(list_wrong);  
    var list = obj.list;
	var list_s =  JSON.stringify(list);	
	list_s = list_s.replace("{", "[");
	list_s = list_s.replace("}}", "}]");
			
	while(list_s.match(/\"[0-9]+\":/) != null)			
	    list_s = list_s.replace(/\"[0-9]+\":/,"");					
				
    return list_s;	
}

RilList.parse_json2obj = function(list){
    var list_obj = JSON.parse(list);			
	return list_obj;
}

RilList.sort_function = function(a, b){	
	if(a.time_updated > b.time_updated)
        return 1;
	else if (a.time_updated < b.time_updated)	
        return -1;
	return 0;
}
