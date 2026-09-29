
//	Draw animated blobs
//	(c) 2014, Petr Stanicek, pixy.cz



$(function(){

	parent._Paletton.events.trigger('ui/example/loaded');
	init();

	});




var $canvas, canvas, maxX, maxY,
	objSet, reset,
	PAL = top._Paletton.palette;

function init(){
	
	$canvas = $('#container');
	maxX = $canvas.width(),
	maxY = $canvas.height();

	canvas = $canvas.get(0);
	canvas.width = maxX;
	canvas.height = maxY;

	canvas = canvas.getContext('2d');

	createSet();
	draw();
	
	}


function colorize(){
	reset = true;
	draw();
	}


function draw(){
	drawSet();
	}


function getCol(colId,phase){ 		// phase 0..63
	var v = Math.floor(phase/16),
		d = phase - v*16,
		rgb1 = PAL.getColorCode(colId, v, 'byLum', true, -1),
		rgb2 = PAL.getColorCode(colId, v+1, 'byLum', true, -1),
		r = rgb1.r + Math.round(d*(rgb2.r-rgb1.r)/16),
		g = rgb1.g + Math.round(d*(rgb2.g-rgb1.g)/16),
		b = rgb1.b + Math.round(d*(rgb2.b-rgb1.b)/16);
	return 'rgba('+r+','+g+','+b+',0.667)';
	}

function createSet() {

	var totalObj;

	function add(countPart,colId){
		var i, f, colN,
			count = countPart * totalObj;
		for (i=0;i<count;i++) {
			f = {
				x: rnd(0,maxX),
				y: rnd(0,maxY),
				colId: colId,
				phase: rnd(0,63),
				sign: Math.random()<0.5 ? 1 : -1
				}
			objSet.push(f);
			}
		}

	objSet = [];
	totalObj = 900;
	add(0.75,'pri');
	add(0.10,'sec1');
	add(0.15,'sec2');
	add(0.05,'compl');
	shuffle(objSet);
	}


function drawSet() {
	var i, f, col1, col2;

	var grd = canvas.createLinearGradient(100,100,maxX,maxY),
		col1 = PAL.getColorCode('pri', 1, 'sorted', true),
		col2 = PAL.getColorCode('pri', 2, 'sorted', true);
	grd.addColorStop(0,col1);
	grd.addColorStop(1,col2);
	canvas.fillStyle = grd;
//	canvas.fillStyle = '#fff';
	canvas.fillRect(0,0,maxX,maxY);

	for (i=0;i<objSet.length;i++) {
		f = objSet[i];
		col = getCol(f.colId,f.phase);
		canvas.fillStyle = col;
		canvas.beginPath();
		canvas.arc(f.x,f.y,42-f.phase/63*36,0,2*Math.PI);
		canvas.fill();
		f.phase += f.sign;
/*
		f.x += f.sign*rnd(0,1);
		f.y += f.sign*rnd(0,1);
*/
		if (f.phase>63) {
			f.phase = 63;
			f.sign = -1;
			}
		if (f.phase<0) {
			f.phase = 0;
			f.sign = 1;
			}
		}
	if (canvas && !reset) {
		setTimeout(drawSet,1000/25);
		}
	reset = false;
	}


