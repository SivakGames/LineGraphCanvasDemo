const CANVAS_BG_COLOR = "#E8E8E8";
const CANVAS_DIVIDER_COLOR = "#CCCCCC";
const CANVAS_TEXT_COLOR = "#666666";
const CANVAS_LINE_COLOR = "#EA789A"

const CANVAS_PAD = 32;
const CANVAS_HORIZ_LEFT_MARGIN = 32;
const CANVAS_LINE_THICKNESS = 2;

const CANVAS_FONT_SIZE = 16;
const CANVAS_VERT_CAPTION_WIDTH = CANVAS_FONT_SIZE*3;
const CANVAS_UNIT_HEIGHT = CANVAS_FONT_SIZE * 2;

const CANVAS_PLOT_LINE_THICKNESS = 2;
const CANVAS_PLOT_RADIUS = 5;

//======================================================================
/*
	data
	{
		min: minimum value in graph
		max: maximum value in graph
		step: how much to step between values
		units: (e.g. "cm", "kg", etc.)
	}

	plotData: array of numbers to plot on the graph

*/
//======================================================================
function createGraphCanvas(data, plotData)
{

	const canvasMaxNum = data.max || null;
	const canvasMinNum = data.min || null;
	const canvasStep = data.step || 1;
	const canvasUnits = data.units || "";

	const canvas = document.getElementById('canvas-area');
	const ctx = canvas.getContext('2d');

//Needed for math
	const totalYunits = parseInt((canvasMaxNum - canvasMinNum) / canvasStep);
	const canvasMinYpos = (totalYunits+1) * CANVAS_UNIT_HEIGHT + CANVAS_PAD - CANVAS_LINE_THICKNESS;
	const canvasMaxYpos = CANVAS_UNIT_HEIGHT + CANVAS_PAD - CANVAS_LINE_THICKNESS;

	canvas.height = ( (totalYunits+2) * CANVAS_UNIT_HEIGHT) + (CANVAS_PAD * 2) + (CANVAS_FONT_SIZE * 2);
	const cw = canvas.width;
	const ch = canvas.height;

//Text definitions
	ctx.font = `${CANVAS_FONT_SIZE}px Arial`;

//Line sizing
	const GRAPH_LINE_HEIGHT = (totalYunits+2) * CANVAS_UNIT_HEIGHT;
	const GRAPH_LINE_WIDTH = cw - (CANVAS_PAD * 2) - CANVAS_VERT_CAPTION_WIDTH - CANVAS_HORIZ_LEFT_MARGIN;


//Draw BG
//------------------------------------------------------------------------------------
	ctx.fillStyle = CANVAS_BG_COLOR;
	ctx.fillRect(0,0,cw,ch);

//Draw vertical labels
//------------------------------------------------------------------------------------
	ctx.textAlign = "right";
	const vertX = CANVAS_PAD + CANVAS_VERT_CAPTION_WIDTH;
	let vertY = CANVAS_PAD + (CANVAS_UNIT_HEIGHT);
	

	for(let i=canvasMaxNum; i>=canvasMinNum; i -= canvasStep)
	{
		ctx.fillStyle = CANVAS_TEXT_COLOR;
		ctx.fillText(i + canvasUnits, vertX, vertY);
		ctx.fillStyle = CANVAS_DIVIDER_COLOR;
		ctx.fillRect(vertX + CANVAS_HORIZ_LEFT_MARGIN, vertY - (CANVAS_FONT_SIZE / 4), GRAPH_LINE_WIDTH, CANVAS_LINE_THICKNESS);
		vertY += CANVAS_UNIT_HEIGHT;
	}

//Draw months
//------------------------------------------------------------------------------------
	vertY += CANVAS_UNIT_HEIGHT;
	ctx.textAlign = "center";
	
	const monthStep = GRAPH_LINE_WIDTH / 12;
	let monthX = CANVAS_PAD + CANVAS_VERT_CAPTION_WIDTH + CANVAS_HORIZ_LEFT_MARGIN + (monthStep/2);
	let lineX = monthX;

	const monthY = vertY;
	
	for(let i=0; i<12; i++)
	{
		let m = (i+3)%12 + 1;
		ctx.fillStyle = CANVAS_TEXT_COLOR;
		ctx.fillText(m + "月", monthX, monthY);
		ctx.fillStyle = CANVAS_DIVIDER_COLOR;
		ctx.fillRect(monthX, CANVAS_PAD, CANVAS_LINE_THICKNESS, GRAPH_LINE_HEIGHT);

		monthX += monthStep;

	}

//Draw line points
//------------------------------------------------------------------------------------
	const base1 = canvasMaxNum - canvasMinNum
	const base2 = canvasMaxYpos - canvasMinYpos;

	ctx.strokeStyle = CANVAS_LINE_COLOR;
	ctx.lineWidth = CANVAS_PLOT_LINE_THICKNESS;
	ctx.fillStyle = CANVAS_LINE_COLOR;

	for(let k in plotData)
	{
		k = parseInt(k);

		let v1 = plotData[k];
		let relativeToData1 = v1 - canvasMinNum;
		let percentRelativeToData1 = relativeToData1 / base1;
		let lineY1 = base2 * percentRelativeToData1 + canvasMinYpos;
		
		let v2 = (k+1 < plotData.length) ? plotData[k+1] : null;
		let relativeToData2 = v2 - canvasMinNum;
		let percentRelativeToData2 = relativeToData2 / base1;
		let lineY2 = base2 * percentRelativeToData2 + canvasMinYpos;

		if(v2 !== null)
		{	
			ctx.beginPath();
			ctx.moveTo(lineX, lineY1);
			ctx.lineTo(lineX+monthStep, lineY2);
			ctx.stroke(); 
		}

		ctx.beginPath();
		ctx.arc(lineX, lineY1, CANVAS_PLOT_RADIUS, 0, 2 * Math.PI);
		ctx.stroke(); 
		ctx.fill();
		
		lineX += monthStep;
	}
}
