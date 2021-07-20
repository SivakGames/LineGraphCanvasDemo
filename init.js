window.addEventListener("load",initCanvas)

function initCanvas()
{
	let data = {
		min: 50,
		max: 200,
		step: 10,
		units: "cm"
	}

	let plotData = [
		96,99,101,105,110,122
	]

	createGraphCanvas(data, plotData);
}