const table = document.querySelector("table");
const input = document.querySelector("input");
const form = document.querySelector("form");
const button = document.querySelector("button");
const insert = document.querySelector("#insert");
const failButton = document.querySelector("#fail");
const reload = document.querySelector("#re");

button.addEventListener("click", async (event) => {
	event.preventDefault();
	insert.innerHTML = "";
	const inputValue = input.value.toLowerCase().replace(" ", "-").trim();
	const metaData = await getData(inputValue);
	if (metaData) {
		for (const type in metaData) {
			const td = document.createElement("td");
			td.innerText = metaData[type];
			insert.appendChild(td);
		}
		form.classList.add("hide");
		table.classList.remove("hide");
		reload.classList.remove("hide");
		reload.addEventListener("click", onReload);
	} else {
		form.classList.add("hide");
		failButton.classList.remove("hide");
		failButton.addEventListener("click", onFail);
	}
});
function onReload() {
	form.classList.remove("hide");
	table.classList.add("hide");
	reload.classList.add("hide");
}
function onFail() {
	input.value = "";
	form.classList.remove("hide");
	failButton.classList.add("hide");
}
async function getData(name) {
	try {
		const country = await axios.get(
			`https://api.covid19api.com/live/country/${name}`
		);
		const countryData = country.data;
		const confirm = countryData.reduce((prev, curr) => {
			return prev + curr.Confirmed;
		}, 0);
		const recovery = countryData.reduce((prev, curr) => {
			return prev + curr.Recovered;
		}, 0);
		const death = countryData.reduce((prev, curr) => {
			return prev + curr.Deaths;
		}, 0);
		return {
			country: countryData[0].Country,
			confirmed: confirm,
			recoveries: recovery,
			deaths: death,
			total: confirm + recovery + death,
		};
	} catch (err) {
		if (err) {
			return false;
		}
	}
}
