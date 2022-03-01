var el = document.querySelectorAll(".parallax");
document.body.addEventListener("wheel", e => {
	y += e.deltaY;
	y = y < 0 ? 0 : y;
});
var y = 0;
var ty = 0;
var mouse = { x: 0, y: 0 }
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}
document.body.addEventListener("mousemove", e => {
	mouse.x = e.clientX / window.innerWidth - .5;
	mouse.y = e.clientY / window.innerHeight - .5;
});
render();
function render(){
	requestAnimationFrame(render);
	el.forEach(v => {
		var t = lerp(+v.style.top.split("px")[0], (window.scrollY / +v.getAttribute("data-parallax")), .5);
		v.style.top = t + 'px';
	});
	ty = lerp(ty, y, .05);
	window.scroll(0, ty);
}
function ScrollTo(e){
	y = typeof e == "number" ? e : document.querySelector(e).getBoundingClientRect().top;
}