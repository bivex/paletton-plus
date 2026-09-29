
function rnd(min,max){
	if (max<=min) return min;
	return min + Math.floor((max-min+1)*Math.random());
	}

function shuffle(arr){
	var i, j, x;
	for (i=arr.length-1;i>0;i--) {
		j = rnd(0,i-1);
		x = arr[j];
		arr[j] = arr[i];
		arr[i] = x;
		}
	}

function dist(a, b) {
	var dx = a[0] - b[0], dy = a[1] - b[1];
	return Math.sqrt(dx * dx + dy * dy);
	}


function randomPoints(width,height,count){
	var i, points = [];
	for (i=0;i<count;i++) points.push([rnd(0,width),rnd(0,height)]);
	return points;
	}


function randomPointsUniform(width,height,count,chooseFrom){

// Uniform sample distibution, based on http://bost.ocks.org/mike/algorithms/

	// chooseFrom = count of candidates
	if (!chooseFrom) chooseFrom = 10;

	var i, points = [];
	
	points.push(randomPoint());
	
	for (i=1;i<count;i++) {
		points.push(point());
		}

	return points;


	function point() {
		var i, cBest, dMax = 0;
		for (i=0; i<chooseFrom; i++) {
			// var!; create always a new candidate
			var c = randomPoint(),
				d = closestDist(c);
			if (d>dMax) {
				dMax = d;
				cBest = c;
				}
			}
		return cBest;
		}

	function randomPoint(){
		return [rnd(0,width),rnd(0,height)];
		}

	function closestDist(a){
		var i, pLen = points.length, d, dMin = width*height;
		for (i=0; i<pLen; i++) {
			d = dist(a,points[i]);
			if (d<dMin) dMin = d;
			}
		return dMin
		}

	}


