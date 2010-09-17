setTimeout(greader_add_rilicon, 3000);

                
busy = false;
     function greader_add_rilicon() {
       
                        alert("asds1");
                        
                        var titles = document.evaluate('//h2[@class="entry-title"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                        var iconsx = document.evaluate('//*[@class="entry-icons"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                        if (! titles.snapshotLength) return;
                                  
                         var icons = new Array();         
                        for(var i = 0; i < iconsx.snapshotLength; i++){
                            icons.push(iconsx.snapshotItem(i));
                        }  
                                    
                        busy = true;

                        var titleArray = new Array();
                        for (var i = 0; i < titles.snapshotLength; i++) {
                                    
                                var title = titles.snapshotItem(i);
                                var nodes = title.childNodes;
                                if ((nodes == null) || true) {

                                        var link = null;
                                        var titleStr = '';

                                        if (title.firstChild.tagName == 'A') {

                                                // entry-container (Expanded view or Collapsed item)
                                                    link = title.firstChild;
                                                        titleStr = link.firstChild.textContent;
                                             } 
                                        else {

                                                // entry (List view)
                                             

                                                        link = title.parentNode.parentNode.firstChild;
                                                        if (link.tagName != 'A') link = null;
                                                        titleStr = title.textContent;
                                             
                                        }

                                        if (link != null) {

                                                titleArray.push({ node: title, href: link.href, titleStr: titleStr });
                                        }

                                }
                        }
                        
                        alert("ad");
                        if (titleArray.length == 0) {
                                busy = false;
                                return;
                        }
                        //make RIL icons
                        setRtmIcons(titleArray, icons);
                        busy = false;
                }
                
                //make RTM icon as earch article
    function setRtmIcon(targetNode, href, titleStr) {

        //make linking string
        //var anker = "javascript:(function(){name=\""+def_prefix+"\"+encodeURIComponent(\""+titleStr+"\");due=\""+def_due+"\";tags=\""+def_tag+"\";url=\""+href+"\";cp=\"http://m.rememberthemilk.com/add?name=\"+name+\"&due=\"+due+\"&tags=\"+tags+\"&url=\"+url;w=window.open(cp,\"_blank\",\"status=no,toolbar=no,width=200,height=560,resizable=yes\");setTimeout(function(){w.focus();},500);})();";
        var anker = "";
        //make anker tags
        var a = document.createElement("a");
        a.setAttribute('href', anker);
/*        a.setAttribute('target', '_blank');*/
        //make img tag
        var imgTag = document.createElement("img");


        var icon =  'data:image/png;base64,'+"iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ"+
"bWFnZVJlYWR5ccllPAAAAJFJREFUeNpi/F/AQAhoAXE/EFtC+ceBuBCIr4E4TCRqZoCy+6FyeA1A"+
"1dz/nxeM0QxhxOEFTM3IoJDxM8w7TCRrRhWzZCJZMxpgIkszFi+QpRnEY6JEMygtMFGiGRYGZGsG"+
"AVA62ImW0lANw6MZ5oJCqCRJNiMbABJ0B2I+UjVjywvHSdGMzQBk7xDUDAIAAQYAVeBL2TDxtaoA"+
"AAAASUVORK5CYII=";
        
        imgTag.src = icon;
        imgTag.border="0px";
        //set img tag in anker tag
        a.appendChild(imgTag);
        //set anker tag in span tag
        with (targetNode) {
            appendChild(document.createTextNode(" "));
            appendChild(a);
        }
        
    }

    //make RTM icons
    function setRtmIcons(titleArray, icons) {
    alert("setRtmIcons");
        //loop for articles
        for (var i = 0; i < titleArray.length; i++) {
            var href = titleArray[i].href;
            //var title = titleArray[i].node;
            var title = icons[i];
            var titleStr = titleArray[i].titleStr;
            //make span tag
            var node = document.createElement('span');
            node.className = 'googlereader2rtm';
            //make RTM icon
            setRtmIcon(node, href, titleStr);
            //title.insertBefore(node, title.childNodes[1]);
            icons[i].innerHTML = "";
        }
    }
