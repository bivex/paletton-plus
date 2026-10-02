
$(function(){

	if (parent && parent._Paletton && parent._Paletton.events) {
		parent._Paletton.events.trigger('ui/example/loaded');
		parent._Paletton.events.register('palette/typography/changed', function(e, typo) {
			applyTypography(typo);
		});
	}

	$('#menu a').click(function(){
		colorize();
	});

	colorize();

});

function applyTypography(typo) {
	try {
		typo = typo || (top && top._Paletton && top._Paletton.palette && top._Paletton.palette.getTypography ? top._Paletton.palette.getTypography() : null);
		if (!typo) return;
		var root = document.documentElement;
		if (root && root.style) {
			if (typo.heading) root.style.setProperty('--font-heading', typo.heading);
			if (typo.body) root.style.setProperty('--font-body', typo.body);
			if (typo.weightHeading) root.style.setProperty('--font-weight-heading', typo.weightHeading);
			if (typo.letterSpacing) root.style.setProperty('--letter-spacing-heading', typo.letterSpacing);
			if (typo.lineHeight) root.style.setProperty('--line-height-body', typo.lineHeight);
			if (typo.scale) root.style.setProperty('--type-scale-ratio', typo.scale);
		}
		if (document.body) {
			document.body.style.fontFamily = typo.body;
			var hd = document.querySelectorAll('h1, h2, h3, h4, h5, h6, .ttl, header h2');
			for (var i = 0; i < hd.length; i++) {
				hd[i].style.fontFamily = typo.heading;
				if (typo.weightHeading) hd[i].style.fontWeight = typo.weightHeading;
				if (typo.letterSpacing) hd[i].style.letterSpacing = typo.letterSpacing;
			}
		}
	} catch(e) {}
}

function colorize() {
	if (top && top._Paletton && top._Paletton.palette) {
		top._Paletton.palette.lessColorize(less,true,true);
	}
	applyTypography();
}


