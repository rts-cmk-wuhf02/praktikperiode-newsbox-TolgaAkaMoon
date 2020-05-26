import xmlToJson from './xmlConverter.js';
document.addEventListener('DOMContentLoaded', async function() {
	const main = document.querySelector('.main');
	const categoryContainerTemplate = document.querySelector('.categoryContainerTemplate');
	const articleTemplate = document.querySelector('.articleTemplate');
	const articleCount = 4;

	let localCategories = localStorage.getItem('categories');
	localCategories = JSON.parse(localCategories);
	let categoryArr = Object.entries(localCategories);
	const jsons = await fetchJsons(visibility(categoryArr));

	jsons.forEach(([key, value]) => {
		let clone = categoryContainerTemplate.content.cloneNode(true);
		clone.querySelector('h3').innerHTML = key;
		main.appendChild(clone);
		articleCreator(value, articleTemplate, main, articleCount);
	});

	main.addEventListener('click', (e) => {
		if (e.target.classList.contains('main__categoryContainer')) {
			if (e.target.querySelector('svg').classList.contains('-rotate-90')) {
				arrowTurn(e, '-rotate-90', '-rotate-180');
				articleHide(e, articleCount);
			} else {
				arrowTurn(e, '-rotate-180', '-rotate-90');
				articleShow(e, articleCount);
			}
		}
	});

	let touchstartX = 0;
	let touchendX = 0;

	main.addEventListener(
		'touchstart',
		function(e) {
			touchstartX = e.changedTouches[0].screenX;
		}, false
	);

	main.addEventListener(
		'touchend',
		function(e) {
			touchendX = e.changedTouches[0].screenX;
			handleGesture(e, touchendX, touchstartX);
		}, false
	);

	main.addEventListener('click', (e) => {
		if (e.target.classList.contains('archiveBtn')) {
			const db = firebase.firestore();
			const title = e.target.previousElementSibling.children[1].children[0].innerHTML;
			const description = e.target.previousElementSibling.children[1].children[1].innerHTML;
			const img = e.target.previousElementSibling.children[0].src;
			const link = e.target.previousElementSibling.href;
			archiveArticle(db, fetchCategory(e, articleCount), title, description, img, link);
			e.target.parentElement.classList.remove('relative', '-left-20');
		}
	});
});

function visibility(arr) {
	const visible = arr.filter((category) => {
		return category[1].show === true;
	});
	return visible;
}

async function fetchConverter([key, value]) {
	const response = await fetch(value.url);
	const result = await response.text();
	let xmlnode = new window.DOMParser().parseFromString(result, 'text/xml');
	let data = [key, xmlToJson(xmlnode)];
	return data;
}

async function fetchJsons(categories) {
	const promises = categories.map((category) => {
		return fetchConverter(category);});
	const result = await Promise.all(promises);
	return result;
}

function articleCreator(data, articleTemplate, main, articleCount) {
	for (let step = 0; step < articleCount; step++) {
		let clone = articleTemplate.content.cloneNode(true);
		if (data.rss.channel.item[step][`atom:link`].attributes) {
			clone.querySelector('a').href = data.rss.channel.item[step][`atom:link`].attributes.href;}
		if (data.rss.channel.item[step][`media:content`]) {
			clone.querySelector('img').src = data.rss.channel.item[step][`media:content`].attributes.url;}
		clone.querySelector('h4').innerHTML = data.rss.channel.item[step].title[`#text`];
		clone.querySelector('p').innerHTML = data.rss.channel.item[step].description[`#text`];
		main.appendChild(clone);
	}
}

function arrowTurn(e, remove, add) {
	e.target.querySelector('svg').classList.remove(remove);
	e.target.querySelector('svg').classList.add(add);
}

function articleHide(e, articleCount) {
	let child = e.target;
	for (let step = 0; step < articleCount; step++) {
		if (child.nextElementSibling.classList.contains('relative', '-left-20')) {
			child.nextElementSibling.classList.remove('relative', '-left-20');
		}
		child.nextElementSibling.classList.add('invisible', 'absolute');
		child = child.nextElementSibling;
	}
}

function articleShow(e, articleCount) {
	let child = e.target;
	for (let step = 0; step < articleCount; step++) {
		child.nextElementSibling.classList.remove('invisible', 'absolute');
		child = child.nextElementSibling;
	}
}

function handleGesture(e, touchendX, touchstartX) {
	if (touchendX + 50 < touchstartX) {
		if (e.target.classList.contains('article__link')) {
			e.target.parentElement.classList.add('relative', '-left-20');
		}
	}
	if (touchstartX + 50 < touchendX) {
		if (e.target.classList.contains('article__link')) {
			e.target.parentElement.classList.remove('relative', '-left-20');
		}
	}
}

function fetchCategory(e, articleCount) {
	let sibling = e.target.parentElement.previousElementSibling;
	for (let i = 0; i < articleCount; i++) {
		if (sibling.classList.contains('main__categoryContainer')) {
			break;
		}
		sibling = sibling.previousElementSibling;
	}
	return sibling.children[1].children[0].innerHTML;
}

function archiveArticle(db, category, title, description, img, link) {
	db.collection('articles')
		.add({ title, description, img, link, category })
		.then(function(docRef) {
			console.log('Document written with ID: ', docRef.id);
		})
		.catch(function(error) {
			console.error('Error adding document: ', error);
		});
}
