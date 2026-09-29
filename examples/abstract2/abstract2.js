
//	Draw random abstract picture
//	(c) 2014, Petr Stanicek, pixy.cz



$(function(){

	parent._Paletton.events.trigger('ui/example/loaded');
	init();

	});




var $canvas, canvas, maxX, maxY,
	objSet,
	PAL = top._Paletton.palette;

function init(){
	
	$canvas = $('#container');

	maxX = $canvas.width(),
	maxY = $canvas.height();

	canvasObj = $canvas.get(0);
	canvasObj.width = maxX;
	canvasObj.height = maxY;
	
	canvas = canvasObj.getContext('2d');

	$canvas.click( function(){
		url = canvasObj.toDataURL('image/png');
		window.open(url);
		});

	createSet();
	draw();
	
	}


function colorize(){
	draw();
	}


function draw(){
	var grd = canvas.createLinearGradient(500,200,maxX,maxY),
		col = PAL.getColorCode('pri', 1, 'sorted', true);
	grd.addColorStop(0,'#fff');
	grd.addColorStop(1,col);
	canvas.fillStyle = grd;
	canvas.fillRect(0,0,maxX,maxY);
	drawSet();
	}


function createSet() {

	var i, n, colId, points, midPoint = [maxX*0.75,maxY*0.75],
		totalObj = 900,
		distribution = {
			'pri': 0.6,
			'sec1': 0.15,
			'sec2': 0.15,
			'compl': 0.1
			};

	objSet = [];
	points = randomPointsUniform(maxX,maxY,totalObj);

	n = 0;
	for (colId in distribution) {
		count = Math.floor(distribution[colId]*totalObj);
		for (i=0;i<count;i++) {
			add(n,colId);
			n++;
			}
		}

	shuffle(objSet);


	function add(idx,colId){
		var i, col0, col1, n, k, f;

	// color variants
		n = rnd(-2,4); if (n<0) n = 0;

	// random triangle
		k = dist(points[idx],midPoint);
		k = k/Math.max(maxX,maxY);
		k = 20 + k*100;

		function get(){
			var minK = 2, x = rnd(-k,k);
			if (x<0 && x>-minK) x = -minK;
			else if (x>=0 && x<minK) x = minK;
			return x
			}

	// create object
		f = {
			x: points[idx][0],
			y: points[idx][1],
			dx1: get(),
			dy1: get(),
			dx2: get(),
			dy2: get(),
			colId: colId,
			colN: n,
			alpha: Math.random()<0.33 ? 0 : rnd(1,10)/10
			};

		objSet.push(f);
		}
	}


/*
	var totalObj;

	function add(countPart,colId){
		var i, f, colN,
			count = countPart * totalObj;
		for (i=0;i<count;i++) {
			f = randomObj();
			f.colId = colId;
			f.colN = rnd(-2,4);  if (f.colN<0) f.colN = 0;
			f.alpha = Math.random()<0.33 ? 0 : rnd(1,10)/10;
			objSet.push(f);
			}
		}

	objSet = [];
	totalObj = 800;
	add(0.60,'pri');
	add(0.15,'sec1');
	add(0.15,'sec2');
	add(0.10,'compl');
	shuffle(objSet);
	}



function randomObj(){
	var k = (Math.random()<0.075) ? 150 : 40,
		minK = 2;
	function get(){
		var x = rnd(-k,k);
		if (x<0 && x>-minK) x = -minK;
		else if (x>=0 && x<minK) x = minK;
		return x
		}
	return {
		x: rnd(0,maxX),
		y: rnd(0,maxY),
		dx1: get(),
		dy1: get(),
		dx2: get(),
		dy2: get()
		}

	}
*/



function drawSet() {
	var i, f, col;

	for (i=0;i<objSet.length;i++) {
		f = objSet[i];
		col = PAL.getColorCode(f.colId, f.colN, 'sorted', true, f.alpha);
		drawObj(f,col);
		}
	}


function drawObj(data,col){
	var x = data.x, y = data.y;
	canvas.fillStyle = col;
	canvas.beginPath();
	canvas.moveTo(x,y);
	x += data.dx1; y += data.dy1;
	canvas.lineTo(x,y);
	x += data.dx2; y += data.dy2;
	canvas.lineTo(x,y);
	canvas.fill();			
	}