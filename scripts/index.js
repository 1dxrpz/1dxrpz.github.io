document.body.addEventListener("wheel", _ => {
	document.querySelector("header>nav").setAttribute("data-oncontent", 
		document.querySelector("#content").getBoundingClientRect().top <= 0);
});