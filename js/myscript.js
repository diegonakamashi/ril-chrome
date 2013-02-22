window.addEventListener('keyup', keyboardShortCut, false);//Keyboard ShortCut

function keyboardShortCut(e){
	if(e.altKey && e.ctrlKey){
		chrome.extension.sendRequest({name : 'keyShortCut', keyCode : e.keyCode, url: window.location.href, title: document.title});
	}
}

function intervalTest(){
  console.log("testando intervalo "+ new Date())
}

setInterval("intervalTest", 1000)
