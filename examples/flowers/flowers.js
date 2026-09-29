
//	Draw random flowers
//	(c) 2014, Petr Stanicek, pixy.cz


var $canvas, canvas, maxX, maxY,
	objSet,
	PAL;


$(function(){

	PAL = top._Paletton.palette;

	parent._Paletton.events.trigger('ui/example/loaded');
	init();

	});




	
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
	var grd = canvas.createLinearGradient(200,maxY,maxX-400,200),
		col = PAL.getColorCode('pri', 2, 'sorted', true);
	grd.addColorStop(0,col);
	grd.addColorStop(1,'#fff');
	canvas.fillStyle = grd;
	canvas.fillRect(0,0,maxX,maxY);
	drawSet();
	}


function createSet() {

	var i, n, colId, points,
		totalObj = 120,
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
		var i, col0, col1, m, n, f;

		// color variants for inner and outer circles
			m = rnd(-2,4); if (m<0) m = 0;
			n = rnd(-2,4); if (n<0) n = 0;
			while (m==n) {
				n = rnd(-2,4); if (n<0) n = 0;
				}
		// create object
			f = {
				x: points[idx][0],
				y: points[idx][1],
				colId: colId,
				col0: m,
				col1: n,
				count: rnd(5,12),
				r: rnd(10,35),
				rk: rnd(66,110)/100		// 0.66..1.1
				};

			objSet.push(f);
			}
		}



function drawSet() {
	var i, f, col0, col1;

	for (i=0;i<objSet.length;i++) {
		f = objSet[i];
		col0 = PAL.getColorCode(f.colId, f.col0, 'sorted', true);
		col1 = PAL.getColorCode(f.colId, f.col1, 'sorted', true);
		drawFlower(f,col0,col1);
		}
	}



function drawFlower(data,col0,col1){
	var i, alpha, r0, r1, x, y, pt;

	alpha = 2*Math.PI/data.count;
	
	// max radius for side circles
	r1 = data.r * Math.sin(alpha/2);
	// use koef for r1
	if (data.rk) r1 *= data.rk;

	// radius for inner circle
	r0 = data.r
	// use koef for r0
	if (data.rk) r0 *= data.rk;

	pt = []
	pt[0] = [data.r,0];

	for (i=1;i<data.count;i++) {
	// count-times rotation => side circles centers
		pt[i] = [ pt[i-1][0] * Math.cos(alpha) - pt[i-1][1] * Math.sin(alpha), pt[i-1][0] * Math.sin(alpha) + pt[i-1][1] * Math.cos(alpha) ]
		}

	canvas.fillStyle = col1;

	for (i=0;i<data.count;i++) {
	// draw side circles
		x = pt[i][0] + data.x;
		y = pt[i][1] + data.y;
		canvas.beginPath();
		canvas.arc(x,y,r1,0,2*Math.PI);
		canvas.fill();		
		}

	canvas.fillStyle = col0;
	canvas.beginPath();
	canvas.arc(data.x,data.y,r0,0,2*Math.PI);
	canvas.fill();		

	
	}