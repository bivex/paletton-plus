
$(function(){

	parent._Paletton.events.trigger('ui/example/loaded');

	$('#menu a').click(function(){
		colorize();
		})

	colorize();

	});




function colorize() {

	top._Paletton.palette.lessColorize(less,true,true);

	}

