
//	Draw animated stripes
//	(c) 2014, Petr Stanicek, pixy.cz



$(function(){

	parent._Paletton.events.trigger('ui/example/loaded');
	init();

	});




var $canvas, canvas, maxX, maxY,
	objSet, objPhase, reset,
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


function createSet() {

	var totalObj, ratio = maxY/(maxX+maxY);

	function add(countPart,colId,minSize,maxSize){
		var i, f, n,
			alpha, size, isVert, pos, vector, speed,
			count = countPart * totalObj;

		for (i=0;i<count;i++) {
		// color variant
			n = rnd(-2,4); if (n<0) n = 0;
			alpha = rnd(1,5);  if (alpha>4) alpha = 4; alpha = alpha/4;
			size = rnd(minSize,maxSize);
			isVert = Math.random()>ratio;
			pos = rnd(0, isVert ? maxX : maxY);
			vector = rnd(0,1) ? 1 : -1;
			speed = Math.random()*0.75;
			f = {
				colId: colId,
				colN: n,
				alpha: alpha,
				size: size,
				isVert: isVert,
				pos: pos,
				vector: vector,
				speed: speed
				}
			objSet.push(f);
			}
		}

	objSet = [];
	totalObj = 100;
	add(0.60,'pri',16,48);
	add(0.15,'sec1',8,24);
	add(0.15,'sec2',8,24);
	add(0.10,'compl',4,16);
	shuffle(objSet);
	}


function drawSet() {
	var i, d, pos, maxPos, maxD = 2;

/*
	var test = PAL.getColorGrid(10);
	console.log(test);
*/

//	canvas.fillStyle = '#fff';
	canvas.fillStyle = PAL.getColorCode('pri', 0, 'byPalette', false)
	canvas.fillRect(0,0,maxX,maxY);

	for (i=0;i<objSet.length;i++) {
		f = objSet[i];
//		if (!f.isVert) continue;
		maxPos = f.isVert ? maxX : maxY;
		d = f.vector * f.speed * maxD;
		f.pos += d;
		if (f.pos<-f.size || f.pos>maxPos) {
			f.vector = -f.vector;
			f.speed = Math.random();
			}
		pos = Math.round(f.pos);
		canvas.fillStyle = PAL.getColorCode(f.colId, f.colN, 'byLum', true, f.alpha);
		if (f.isVert) canvas.fillRect(pos,0,f.size,maxY);
		else canvas.fillRect(0,pos,maxX,f.size);
		}

	if (canvas && !reset) {
		setTimeout(drawSet,1000/25);
		}
	reset = false;
	}


