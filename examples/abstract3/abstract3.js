
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
	canvas.fillStyle = '#fff';
	canvas.fillRect(0,0,maxX,maxY);
	drawSet();
	}


function createSet() {

	var i, n, colId, points, midPoint = [maxX*0.333,maxY*0.667],
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
		var i, col0, col1, n, f;

	// color variants
		n = rnd(-2,4); if (n<0) n = 0;

	// the closer to the mid point, the smaller circles
		k = dist(points[idx],midPoint);
		k = k/Math.max(maxX,maxY);

	// create object
		f = {
			x: points[idx][0],
			y: points[idx][1],
			colId: colId,
			colN: n,
			alpha: Math.random()<0.33 ? 0 : rnd(1,10)/10,
			r: rnd(2,k*45),
			};

		objSet.push(f);
		}
	}


function drawSet() {
	var i, f, col;

	for (i=0;i<objSet.length;i++) {
		f = objSet[i];
		col = PAL.getColorCode(f.colId, f.colN, 'sorted', true, f.alpha);
		drawObj(f,col);
		}
	}


function drawObj(data,col){
	canvas.fillStyle = col;
	canvas.beginPath();
	canvas.arc(data.x,data.y,data.r,0,2*Math.PI);
	canvas.fill();		

	
	}