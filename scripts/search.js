var searchTab = document.querySelector("#searchTab");
var search_bar = document.querySelector(".search_bar");
var searchHistory_container = document.querySelector(".searchHistory_container");
var shortcut_links_wrapper = document.querySelector(".shortcut_links_wrapper");
var searchEngineLogo = document.querySelector(".searchEngineLogo");
var clocks = document.querySelector("#clocks");
var searchHistory = {items:[]};
var ShortcutLinks = [];
var searchEngines = document.querySelectorAll(".searchEngine");
var searchEngine = "";

var engines = {
	google: {
		logo:'../images/google_logo.webp',
		query: 'https://www.google.com/search?q='
	},
	duckduckgo: {
		logo: '../images/DuckDuckGo.webp',
		query: 'https://duckduckgo.com/?q='
	},
	yandex: {
		logo: '../images/yandex.webp',
		query: 'https://yandex.ru/search/?text='
	}
}

const isValidUrl = urlString=> {
	var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
	'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
	'((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
	'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
	'(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
	'(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
	return !!urlPattern.test(urlString);
}
var maxSize = 5 * 1024 * 1024 / 24;
function readFile() {
	if (!this.files || !this.files[0]) return;
	const reader = new FileReader();
	let imageFile = this.files[0];
	reader.addEventListener("load", () => {
		var img = document.createElement("img");
		img.onload = function (event) {
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			var r =  (img.height * img.width / 25) / maxSize;
			r = r >= 1 ? r + 0.5 : r <= 0.2 ? r + 0.1 : r;
			canvas.width = img.width / r;
			canvas.height = img.height / r;
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			var dataurl = canvas.toDataURL(imageFile.type);
			document.querySelector("body").style.backgroundImage = `url(${dataurl})`;
			localStorage.setItem("background", dataurl);
		}
		img.src = reader.result;
	});
	reader.readAsDataURL(this.files[0]);
}

document.querySelector("#inp").addEventListener("change", readFile);
window.onload = () => {
	clocks.innerHTML = formatAMPM(new Date);
	searchTab.focus();
	
	if (localStorage.getItem("ShortcutLinks") == null)
	{
		localStorage.setItem("ShortcutLinks", JSON.stringify(ShortcutLinks));
	} else {
		ShortcutLinks = JSON.parse(localStorage.getItem("ShortcutLinks"));
	}
	if (localStorage.getItem("background") == null)
	{
		localStorage.setItem("background", "undefined");
	} else {
		if (localStorage.getItem("background") != "undefined") {
			document.querySelector("body").style.backgroundImage = `url(${localStorage.getItem("background")})`;
		}
	}
	if (localStorage.getItem("searchHistory") == null) {
		localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
	} else {
		searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
	}

	if (localStorage.getItem("searchEngine") == null) {
		localStorage.setItem("searchEngine", "google");
	}
	searchEngine = localStorage.getItem("searchEngine");
	searchEngines.forEach(v => {
		v.removeAttribute("selected");
	});
	[...searchEngines]
		.filter(v => v.value == searchEngine)[0]
		.setAttribute("selected", true);
	searchEngineLogo.setAttribute("src", engines[searchEngine].logo);

	UpdateLinks();
}

var webpage = false;
var ajaxDelay = false;
var CurrentSearchInput = "";
var currentAcSelected = -1;

searchTab.addEventListener("keydown", e => {
	var acompletions = document.querySelectorAll(".search_autocomplete");
	
	if (e.keyCode == 38 && currentAcSelected > -1) {
		currentAcSelected = currentAcSelected > -1 ? currentAcSelected - 1 : acompletions.length - 1;
	}
	if (e.keyCode == 40) {
		currentAcSelected = currentAcSelected < acompletions.length - 1 ? currentAcSelected + 1 : -1;
	}
	if (e.keyCode == 40 || e.keyCode == 38) {
		e.preventDefault();
		acompletions.forEach(v => {
			v.setAttribute("data-selected", false);
		});
		if (currentAcSelected != -1) {
			acompletions[currentAcSelected].setAttribute("data-selected", true);
			SelectAutocomplete(acompletions[currentAcSelected]);
		} else {
			searchTab.value = CurrentSearchInput;
		}
	}
});
function Autocomplete(input) {
	CurrentSearchInput = input.value;
	currentAcSelected = -1;
	let visible = input.value.trim().length != 0;
	searchHistory_container.innerHTML = "";
	searchHistory_container.setAttribute("data-visible", visible);
	webpage = isValidUrl(input.value);
	search_bar.setAttribute("data-webpage", webpage);
	searchTab.style.paddingRight = webpage ? "100px" : "0";
	ajaxDelay = true;

	if (visible && ajaxDelay) {
		$.ajax({
			url: `https://dxrpz-common-utils.herokuapp.com/https://suggestqueries.google.com/complete/search?client=firefox&q=${input.value}`,
			method: 'get',
			success: function(data){
				JSON.parse(data)[1].forEach(v => {
					var ac = v.split(input.value)[1];
					searchHistory_container.innerHTML += `<div class="search_autocomplete" data-value="${v}" onclick="SelectAutocomplete(this)"
					>${ac != undefined ? input.value : ""}<span>${ac != undefined ? ac : v}</span></div>`;
			    })
			},
			error: function (jqXHR, exception) {
				console.log(exception);
			}
		});
	}
}
function search(input) {
    if(event.key === 'Enter') {
    	if (webpage) {
    		window.location.href = input.value.includes("https://") ? input.value : "https://" + input.value;
    	} else {
    		window.location.href = `${engines[searchEngine].query}${input.value.split(' ').join('+')}`;
    	}
        searchHistory.items.push(input.value);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
}
function ClearSearchHistory() {
	searchHistory = {items:[]};
	localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}
function ClearBackgroundImage() {
	localStorage.setItem("background", undefined);
	window.location.reload()
}
function SelectAutocomplete(v) {
	searchTab.value = v.getAttribute("data-value");
	searchTab.focus();
}
function AddNewLink() {
	var url = new URL(prompt("URL"));
	if (!ShortcutLinks.some(v => v.link == url.href)) {
		ShortcutLinks.push({link:url.href, icon:`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url.origin}&size=64`});
		localStorage.setItem("ShortcutLinks", JSON.stringify(ShortcutLinks));
		UpdateLinks();
	}
}
function RemoveLink(el) {
	event.preventDefault();
	var index = ShortcutLinks.indexOf(v => v.link == el.getAttribute("href"));
	ShortcutLinks.splice(index, 1);
	localStorage.setItem("ShortcutLinks", JSON.stringify(ShortcutLinks));
	UpdateLinks();
}
function ClearShortcutLinks() {
	ShortcutLinks = [];
	localStorage.setItem("ShortcutLinks", JSON.stringify(ShortcutLinks));
	UpdateLinks();	
}
function UpdateLinks() {
	shortcut_links_wrapper.innerHTML = "";
	ShortcutLinks.forEach(v => {
		shortcut_links_wrapper.innerHTML += `<a class="link" href="${v.link}" oncontextmenu="RemoveLink(this)"><img alt="icon" src="${v.icon}" /></a>`;
	});
}
function ChangeSearchEngine(v) {
	localStorage.setItem("searchEngine", v.value);
	searchEngine = v.value;
	searchEngineLogo.setAttribute("src", engines[v.value].logo);
}
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + `<span>${ampm}</span>`;
  return strTime;
}

setInterval(_ => {
	clocks.innerHTML = formatAMPM(new Date);
}, 1000);