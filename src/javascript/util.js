function detectColorTheme() {
	const fetchTheme = window.localStorage.getItem('theme');
	if (fetchTheme == 'dark') {document.documentElement.setAttribute('data-theme', 'dark');} 
	else {document.documentElement.setAttribute('data-theme', 'light');}
};

detectColorTheme();

let categories = {
	TECHNOLOGY: { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml', show: true },
	EUROPE: { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Europe.xml', show: true }, 
	SPORTS: { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml', show: true },
	HEALTH: { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml', show: true },
	WORLD: { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', show: true }
};

if (!localStorage.getItem('categories')) {
	localStorage.setItem('categories', JSON.stringify(categories));
}