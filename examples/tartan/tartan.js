
//	Draw tartan-like fabric
//	(c) 2014, Petr Stanicek, pixy.cz



$(function(){

	parent._Paletton.events.trigger('ui/example/loaded');
	init();

	});




var $canvas, canvas,
	PAL = top._Paletton.palette;

function init(){
	
	$canvas = $('#container');
	canvasObj = $canvas.get(0);
	canvasObj.width = $canvas.width();
	canvasObj.height = $canvas.height();
	
	canvas = canvasObj.getContext('2d');

	$canvas.click( function(){
		url = canvasObj.toDataURL('image/png');
		window.open(url);
		});

	draw();
	
	}


function colorize(){
	draw();
	}

function draw(){
	
	var maxX = $canvas.width(),
		maxY = $canvas.height();

	function cross(x,y,w,col){
		drawHatchVert( x-2, w, maxY, col );
		drawHatchHoriz( y, maxX, w, col );
		}

	function set(x,y,w1,d1,w2,d2,w3,colId){

		cross( x, y, w1, PAL.getColorCode(colId, 2, 'sorted', true) );
		a = x-d1-w2;
		b = y-d1-w2;
		cross( a, b, w2, PAL.getColorCode(colId, 4, 'sorted', true) );
		a = a-d2-w3;
		b = b-d2-w3;
		cross( a, b, w3, PAL.getColorCode(colId, 0, 'sorted', true) );
		a = x+w1+d1;
		b = y+w1+d1;
		cross( a, b, w2, PAL.getColorCode(colId, 3, 'sorted', true) );
		a = a+w2+d2;
		b = b+w2+d2;
		cross( a, b, w3, PAL.getColorCode(colId, 1, 'sorted', true) );
		}

	canvas.clearRect(0,0,maxX,maxY);

	drawRect( 0, 0, maxX, maxY, PAL.getColorCode('pri',1, 'sorted', true) );

	set( 60, 60, 40,0,4,4,4, 'sec1')
	set(160,160, 80,0,8,0,4, 'pri')
	set(300,300, 16,8,4,0,4, 'compl')
	set(380,380, 40,4,4,4,4, 'sec2')
	set(496,496, 32,4,4,4,4, 'pri')

	set(588,588, 40,0,4,4,4, 'sec1')
	set(688,688, 80,0,8,0,4, 'pri')

	addNoise(0,0,maxX,maxY,0.75,0.96667);

	}





function drawRect(x,y,w,h,col) {
	canvas.fillStyle = col;
	canvas.fillRect(x,y,w,h);
	}

function drawHatchHoriz(y,w,h,col){
	var a = -h;
	canvas.lineWidth = 1.75;
	canvas.lineCap = 'square';
	canvas.strokeStyle = col;
	canvas.beginPath();
	while (a<w) {
		canvas.moveTo(a,y+h);
		canvas.lineTo(a+h,y);
		a += 4;
		}
	canvas.stroke();
	}

function drawHatchVert(x,w,h,col){
	var a = 0;
	canvas.lineWidth = 1.75;
	canvas.lineCap = 'square';
	canvas.strokeStyle = col;
	canvas.beginPath();
	while (a<h+w) {
		canvas.moveTo(x,a);
		canvas.lineTo(x+w,a-w);
		a += 4;
		}
	canvas.stroke();
	}

function addNoise(x,y,w,h,density,koef){
	var i, px,
		img = canvas.getImageData(x,y,w,h),
		pixelCnt = img.data.length/4,
		dens = pixelCnt * density;
	for (i=0;i<dens;i++) {
		px = Math.round(Math.random()*pixelCnt)*4;
		img.data[px] *= koef + Math.random()*(1-koef);			// random value in range koef..1 for R
		img.data[px+1] *= koef + Math.random()*(1-koef);		// random value in range koef..1 for G
		img.data[px+2] *= koef + Math.random()*(1-koef);		// random value in range koef..1 for B
		}
	canvas.putImageData(img,x,y);
	}
