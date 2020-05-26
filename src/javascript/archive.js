document.addEventListener('DOMContentLoaded', async function() {
	const main = document.querySelector('.main');
	const categoryContainerTemplate = document.querySelector('.categoryContainerTemplate');
	const articleTemplate = document.querySelector('.articleTemplate');
	const db = firebase.firestore();
	const archivedArticles = await db.collection('articles').get();

	let articles = [];
	archivedArticles.forEach((item) => {
		const data = item.data();
		const id = item.id;
		articles.push({ ...data, id });
	});

	const categories = seperateCategories(articles);
	createArticles(categories, categoryContainerTemplate, articleTemplate, main);

	main.addEventListener('click', (e) => {
		if (e.target.classList.contains('main__categoryContainer')) {
			const currentCategory = e.target.children[1].children[0].innerHTML;
			if (e.target.querySelector('svg').classList.contains('-rotate-90')) {
				arrowTurn(e, '-rotate-90', '-rotate-180');
				articleHide(e, categories, currentCategory);
			} else {
				arrowTurn(e, '-rotate-180', '-rotate-90');
				articleShow(e, categories, currentCategory);
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

	main.addEventListener('click', async (e) => {
		if (e.target.classList.contains('archiveBtn')) {
			const id = e.target.parentElement.getAttribute('data-id');
			if (!e.target.parentElement.nextElementSibling && e.target.parentElement.previousElementSibling.classList.contains('main__categoryContainer')) {
				e.target.parentElement.previousElementSibling.remove();
			}
			if (
				e.target.parentElement.previousElementSibling.classList.contains('main__categoryContainer') &&
				e.target.parentElement.nextElementSibling.classList.contains('main__categoryContainer')
			) {
				e.target.parentElement.previousElementSibling.remove();
			}
			try {
				await db
					.collection('articles')
					.doc(id)
					.delete();
				console.log(id, 'Document deleted');
				e.target.parentElement.remove();
			} catch (error) {
				console.log('Error removing document', error);
			}
		}
	});
});

function seperateCategories(articles) {
	return articles.reduce((categories, article) => {
		const category = article.category;
		if (categories[category]) {
			const articles = categories[category];
			articles.push(article);
			categories[category] = articles;
		} else categories[category] = [article];
		return categories;
	}, {});
}

function createArticles(categories, categoryContainerTemplate, articleTemplate, main) {
	for (let [category, articles] of Object.entries(categories)) {
		let clone = categoryContainerTemplate.content.cloneNode(true);
		clone.querySelector('h3').innerHTML = category;
		main.appendChild(clone);
		articles.forEach((article) => {
			let clone = articleTemplate.content.cloneNode(true);
			if (article.link) clone.querySelector('a').href = article.link;
			if (article.img) clone.querySelector('img').src = article.img;
			clone.querySelector('div').setAttribute('data-id', article.id);
			clone.querySelector('h4').innerHTML = article.title;
			clone.querySelector('p').innerHTML = article.description;
			main.appendChild(clone);
		});
	}
}

function arrowTurn(e, remove, add) {
	e.target.querySelector('svg').classList.remove(remove);
	e.target.querySelector('svg').classList.add(add);
}

function articleHide(e, categories, currentCategory) {
	const articleCount = categories[currentCategory].length;
	let child = e.target;
	for (let step = 0; step < articleCount; step++) {
		if (child.nextElementSibling.classList.contains('relative', '-left-20')) {
			child.nextElementSibling.classList.remove('relative', '-left-20');
		}
		child.nextElementSibling.classList.add('invisible', 'absolute');
		child = child.nextElementSibling;
	}
}

function articleShow(e, categories, currentCategory) {
	const articleCount = categories[currentCategory].length;
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