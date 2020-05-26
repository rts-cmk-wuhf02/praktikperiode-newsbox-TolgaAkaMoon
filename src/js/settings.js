const themeBox = document.querySelector('.theme-box')
const themeToggle = document.querySelector('.theme-toggle');
const container = document.querySelector('.categoryContainer');
const template = document.querySelector('.categoryTemplate');

let settingsGear = 0;
let localCategories = localStorage.getItem('categories');
localCategories = JSON.parse(localCategories);
let updatedCategories = Object.entries(localCategories);

updatedCategories.forEach(([key, value]) => {
	let clone = template.content.cloneNode(true);
	clone.querySelector('h3').innerHTML = key;
	if (value.show == false) {
		clone.querySelector('.toggleStatus').classList.remove('bg-primary-sage', 'border-primary-sage', 'justify-end');
		clone.querySelector('.toggleStatus').classList.add('bg-utility-bordergrey', 'border-utility-bordergrey', 'justify-start');
	}
	container.appendChild(clone);
});

container.lastChild.previousSibling.classList.remove('border-b');

themeToggle.addEventListener('click', () => {
	if (document.documentElement.dataset.theme == 'light') {
		document.documentElement.dataset.theme = 'dark';
		window.localStorage.setItem('theme', 'dark');
		themeToggle.innerHTML = 'Toggle Light Mode';
	} else {
		document.documentElement.dataset.theme = 'light';
		window.localStorage.setItem('theme', 'light');
		themeToggle.innerHTML = 'Toggle Dark Mode';
	}
});

container.addEventListener('click', (event) => {
	if (event.target.classList.contains('toggleStatus')) {
		if (event.target.classList.contains('bg-utility-bordergrey')) {
			event.target.classList.remove('bg-utility-bordergrey', 'border-utility-bordergrey', 'justify-start');
			event.target.classList.add('bg-primary-sage', 'border-primary-sage', 'justify-end');
			showTrue(event);
		} else {
			event.target.classList.remove('bg-primary-sage', 'border-primary-sage', 'justify-end');
			event.target.classList.add('bg-utility-bordergrey', 'border-utility-bordergrey', 'justify-start');
			showFalse(event);
		}
	} else if (event.target.parentElement.classList.contains('toggleStatus')) {
		if (event.target.parentElement.classList.contains('bg-utility-bordergrey')) {
			event.target.parentElement.classList.remove(
				'bg-utility-bordergrey',
				'border-utility-bordergrey',
				'justify-start'
			);
			event.target.parentElement.classList.add('bg-primary-sage', 'border-primary-sage', 'justify-end');
			showTrueChild(event);
		} else {
			event.target.parentElement.classList.remove('bg-primary-sage', 'border-primary-sage', 'justify-end');
			event.target.parentElement.classList.add('bg-utility-bordergrey', 'border-utility-bordergrey', 'justify-start');
			showFalseChild(event);
		}
	}
});

function showTrue(event) {
	let categories = localCategories;
	categories[event.target.parentElement.innerText].show = true;
	localStorage.setItem('categories', JSON.stringify(categories));
}
function showFalse(event) {
	let categories = localCategories;
	categories[event.target.parentElement.innerText].show = false;
	localStorage.setItem('categories', JSON.stringify(categories));
}
function showTrueChild(event) {
	let categories = localCategories;
	categories[event.target.parentElement.parentElement.innerText].show = true;
	localStorage.setItem('categories', JSON.stringify(categories));
}
function showFalseChild(event) {
	let categories = localCategories;
	categories[event.target.parentElement.parentElement.innerText].show = false;
	localStorage.setItem('categories', JSON.stringify(categories));
}