const btn = document.getElementById('summarise');
const play = document.getElementById('play');
const output = document.getElementById('output');
const translate = document.getElementById('translate');
const lang = document.getElementById('lang');
const myAudio = new Audio('');
async function logTabs(tabs) {
	for (const tab of tabs) {
		console.log(tab.url);
		if (tab.url !== undefined) {
			const url = new URL(tab.url);
			var videoId = url.searchParams.get('v');
			const res = await fetch('http://localhost:5000/transcript/' + videoId);
			const data = await res.json();
			output.innerHTML = data.summary_text;
			btn.innerHTML = 'Summarised';
			btn.disabled = false;
		}
	}
}

function onError(error) {
	console.error(`Error: ${error}`);
}

btn.addEventListener('click', function() {
	btn.disabled = true;
	btn.innerHTML = 'Summarising...';
	chrome.tabs.query({ currentWindow: true, active: true }).then(logTabs, onError);
});

play.addEventListener('click', function() {
	play.disabled = true;
	fetch('http://localhost:3000/text-to-speech?text=' + output.innerText)
		.then((response) => response.json())
		.then((result) => {
			play.innerText = 'Playing';
			myAudio.src = 'data:audio/mpeg;base64,' + result.map((e) => e.base64).join('');
			myAudio.load();

			myAudio.play();
			play.innerText = 'Play';
			play.disabled = false;
		})
		.catch((error) => {
			play.innerText = error;
			console.log('error', error);
		});
});

translate.addEventListener('click', function() {
	translate.disabled = true;
	translate.innerHTML = 'Translating...';
	fetch('http://localhost:3000/translate?text=' + output.innerText + '&langCode=' + lang.value)
		.then((response) => response.json())
		.then((result) => {
			translate.innerText = 'Translating...';
			output.innerText = result.text;
			translate.innerText = 'Translate';
			translate.disabled = false;
		})
		.catch((error) => {
			output.innerText = error;
			console.log('error', error);
			translate.disabled = false;
		});
});
