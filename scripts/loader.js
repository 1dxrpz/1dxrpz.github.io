window.addEventListener('DOMContentLoaded', (event) => {
    var loader = document.querySelector("#loader");
    loader.setAttribute("loaded", "true");
    setTimeout(_=> {
    	loader.style.left = '-100%';
    }, 1500);
});
function ChangePage(e){
	var unloader = document.querySelector("#unloader");
	unloader.style.left = '0%';
    unloader.setAttribute("unloaded", "true");
    setTimeout(_=> {
    	window.location = e;
    }, 2000);
}