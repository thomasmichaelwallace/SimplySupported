//  Simply Supported
//  Copyright (C) 2014 Thomas Michael Wallace (http://www.thomasmichaelwallace.co.uk)

//  The JavaScript code in this page is free software: you can
//  redistribute it and/or modify it under the terms of the GNU
//  General Public License (GNU GPL) as published by the Free Software
//  Foundation, either version 3 of the License, or (at your option)
//  any later version.  The code is distributed WITHOUT ANY WARRANTY;
//  without even the implied warranty of MERCHANTABILITY or FITNESS
//  FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
//
//  As additional permission under GNU GPL version 3 section 7, you
//  may distribute non-source (e.g., minimized or compacted) forms of
//  that code without the copy of the GNU GPL normally required by
//  section 4, provided you include this license notice and a URL
//  through which recipients can access the Corresponding Source.

// === [ GRAPHICS ] ===========================================================

// Raphael library instance.
var r;

var canvas_height = 275;	// True height of the canvas.
var canvas_width = 600;		// True width of the canvas.

var length = 500.0;			// Drawn length of structure.

var style = {
	// Use a Monokai theme to draw the structure.
	colours: {
		background		: "#272822",
		border			: "#75715E",
		beam			: "#F8F8F2",
		support_free	: "#75715E",
		support_fixed	: "#E6DB74",
		support_prop	: "#A6E22E",
		load_point		: "#F92672",
		load_udl		: "#FD971F",
		dim_setter		: "#66D9EF",
		dim_auto		: "#AE81FF"
	},
	thicknesses: {
		border			: 1,
		beam 			: 3,
		support 		: 1, 
		load 			: 1, 
		dim 			: 1, 
	},
	font: {
		family  		: '"Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif',
		size 			: 15
	}
}

var theme = {
	// Compile the style into a theme to draw the structure.

	background: {
		"fill"			: style.colours.background, 
		"stroke"		: style.colours.border, 
		"stroke-width"	: style.thicknesses.border		
	},
	beam: {
		"stroke"		: style.colours.beam, 
		"stroke-width"	: style.thicknesses.beam
	},
	support_free: {
		"stroke"		: style.colours.support_free, 
		"stroke-width"	: style.thicknesses.support
	},
	support_fixed: {
		"stroke"		: style.colours.support_fixed, 
		"stroke-width"	: style.thicknesses.support
	},
	support_prop: {
		"fill"			: style.colours.support_prop,
		"stroke"		: style.colours.support_prop, 
		"stroke-width"	: style.thicknesses.support
	},
	load_point: {
		"fill"			: style.colours.load_point,
		"stroke"		: style.colours.load_point, 
		"stroke-width"	: style.thicknesses.load
	},
	load_udl: {
		"fill"			: style.colours.load_udl,
		"stroke-width"	: 0
	},
	dim_setter: {
		"stroke"		: style.colours.dim_setter, 
		"stroke-width"	: style.thicknesses.dim
	},
	dim_auto: {
		"stroke"		: style.colours.dim_auto, 
		"stroke-width"	: style.thicknesses.dim
	},
	font: {
		"fill"			: style.colours.beam,
		"font-family"	: style.font.family,
		"font-size"		: style.font.size
	}
}

function drawStructure(structure) {
	// Draw a diagram representing the structure.

	// Element settings.	
	var yc = canvas_height / 2.5;
	var x0 = (canvas_width - length) / 2.0;
	var ew = 10;
	var eh = 50;
	var et = 1.75 * ew;
	var yt = yc + eh + et;
	var ydt = yt + (3.0 * et);
	var beam = [["M", x0, yc]];

	// Reset canvas.
	r.clear();	
	r.rect(style.thicknesses.border, style.thicknesses.border, (canvas_width - 2 * style.thicknesses.border), (canvas_height - 2 * style.thicknesses.border)).attr(theme.background);

	var start_x = x0;
	var end_x = start_x;
	var pointIndex = 65;
	for (index = 0; index < structure.compose.length; ++index) {

		var width;
		if (isNaN(structure.widths[index])) {
			width = structureScope[structure.widths[index]];
		} else {
			width = structure.widths[index];
		}
		end_x += (width * length);		

		var pointLabel = String.fromCharCode(pointIndex);
		switch (structure.compose[index])
		{
			case "X": 	// Propped support.

				var support = [
					// Base line.
					["M", start_x, yc - (eh / 2.0)],
					["L", start_x, yc + (eh / 2.0)]
				]

				// Tick directions.
				var sxt, ext;
				if (start_x == x0)
				{					
					ext = start_x;
					sxt = ext - ew;					
				} else {
					sxt = end_x;
					ext = sxt + ew;
				}
				
				// Append ticks from base upwards.
				var n = Math.floor(eh / ew) - 1;
				var yb = yc + (ew * n / 2.0);					
				for (i = 0; i < n; ++i) {
					support.push(["M", sxt, yb]);
					yb -= ew;
					support.push(["L", ext, yb]);
				}				
				r.path(support).attr(theme.support_fixed);

				r.text(start_x, yt, pointLabel).attr(theme.font); //.attr("fill", style.colours.support_fixed);
				pointIndex += 1;

				break;

			case "P":   // Propped support.
				drawArrow(start_x, yc, ew, eh, 1.0, theme.support_prop);
				r.text(start_x, yt, pointLabel).attr(theme.font); //.attr("fill", style.colours.support_prop);
				pointIndex += 1;
				break;

			case "R": 	// Unsupported (free) end.
				r.circle(start_x, yc, (ew / 2.0)).attr(theme.support_free);
				r.text(start_x, yt, pointLabel).attr(theme.font); //.attr("fill", style.colours.support_free);
				pointIndex += 1;
				break;

			case "S": 	// Unloaded space.
				drawDim(start_x, end_x, ydt, ew / 2.0, structure.widths[index], et);
				break;

			case "F":	// Point load.
				drawArrow(start_x, yc, ew, eh, -1.0, theme.load_point);
				r.text(start_x, yc - (yt - yc), "P").attr(theme.font).attr("fill", style.colours.load_point);				
				pointIndex += 1;
				r.text(start_x, yt, pointLabel).attr(theme.font); //.attr("fill", style.colours.load_point);				
				break;

			case "U":  	// Uniformly distributed load.				
				r.rect(start_x, yc - (ew + style.thicknesses.beam / 2.0), (end_x - start_x), ew).attr(theme.load_udl);			
				if (index > 0 && structure.compose[index - 1] == "S")
				{
					r.text(start_x, yt, pointLabel).attr(theme.font); //.attr("fill", style.colours.load_udl);
					pointIndex += 1;					
				}
				if (index < (structure.compose.length - 1) && structure.compose[index + 1] == "S")
				{
					r.text(end_x, yt, pointLabel).attr(theme.font); //.attr("fill", style.colours.load_udl);	
					pointIndex += 1;
				}
				r.text((start_x + end_x) / 2, yc - ew - (2.0 * et), "W").attr(theme.font).attr("fill", style.colours.load_udl);				
				drawDim(start_x, end_x, ydt, ew / 2.0, structure.widths[index], et);
				break;
		}

		beam.push(["L", end_x, yc]);

		start_x = end_x;
	}

	r.path(beam).attr(theme.beam);
}

function drawArrow(xa, ya, wa, ha, scale, aattr) {
	// Draws a standard arrow.
	var hh = scale * 1.5 * wa;
	var arrowHead = [	
		["M", xa, ya],
		["L", xa + (wa / 2.0), ya + hh],		
		["L", xa - (wa / 2.0), ya + hh],
		["L", xa, ya]
	]
	r.path(arrowHead).attr(aattr);
	var arrowLine = [
		["M", xa, ya + hh],
		["L", xa, ya + (scale * ha)]
	]
	r.path(arrowLine).attr(aattr);
}

function drawDim(sxd, exd, yd, wd, label, ydt) {
	// Draws a dimensioning line.
	if (isNaN(label)) {
		var dimLine = [
			["M", sxd - wd, yd - wd],
			["L", sxd + wd, yd + wd],
			["M", sxd, yd],
			["L", exd, yd],
			["M", exd - wd, yd - wd],
			["L", exd + wd, yd + wd]
		]
		var line = r.path(dimLine)
		var text = r.text((sxd + exd) / 2.0, yd - ydt, label)
		if (label == thisStructure.autoDim) {
			line.attr(theme.dim_auto);
			text.attr(theme.font).attr("fill", style.colours.dim_auto);
		} else {
			line.attr(theme.dim_setter);
			text.attr(theme.font).attr("fill", style.colours.dim_setter);
		}	
	}
}

// === [ MATHEMATICS ] ========================================================

// MathJS library instance.
var math = mathjs();

// Common variable scope for calculation.
var commonScope = {					// Default to m length, kN reaction/load, kNm moment and mm displacement.
	L: 10.0,						// Span (L)
	E: 210 * Math.pow(10, 6),		// Young's Modulus (F/L^2)
	I: 37050 * Math.pow(10, -8),	// Second Moment of Area (L^4)
	ds: 1000						// Displacement reporting scalar (Lo/Ls)
}

var structureScope = {}				// Global structural parameter scope.

var calculations = ["reactions", "moments", "displacements"];
									// Types of calculations provided for structures.

function solveStructure(structure) {
	// Solve the discrete equations linked to the structure.

	var evalScope = mathScope(structureScope);
	var results = [];
	var dims= [];
	for (calcIndex = 0; calcIndex < calculations.length; ++calcIndex) {
		var calculation = calculations[calcIndex];		
		for (index = 0; index < structure[calculation].length; ++index) {
			var result = math.eval(structure[calculation][index].eqn, evalScope);
			if (calculation == "displacements") {
				result *= structureScope.ds;
				var resultString = result.toFixed(3);
				dims.push("mm");
			} else {
				var resultString = result.toFixed(3);
				if (calculation == "moments") { dims.push("kNm"); } else { dims.push("kN"); }
			}
			var calcString = (structure[calculation][index].name + " = " + structure[calculation][index].latex + " = " + resultString);
			results.push(calcString);			
		}
	}

	return { formulars: results, units: dims };
}

function setScope(structure) {
	// Sets the mathematics scope object up for the structure.	
	
	var loading;
	var loadParams = ["P", "W"];
	for (var index = 0; index < loadParams.length; ++index) {
		// Persevere loading as a pseudo-common parameter.
		if (loadParams[index] in structureScope) { loading = structureScope[loadParams[index]]; }
	}

	structureScope = {};
	$.extend(structureScope, structure.loadScope, structure.dimScope, commonScope);
	
	for (var index = 0; index < loadParams.length; ++index) {
		if (loading != null && loadParams[index] in structureScope) { structureScope[loadParams[index]] = loading; }
	}

}

function mathScope(structure) {
	// Creates a mathematics scope object with the lengths correctly scaled.
	absDimScope = {};
	$.extend(absDimScope, structureScope);
	for (property in structureScope) {
		if (property in thisStructure.dimScope)
		{
			absDimScope[property] = structureScope[property] * structureScope.L;
		}	
	}
	return absDimScope;
}

// === [ INTERFACE ] ==========================================================

// LaTeX to HTML conversion.
MathJax.Hub.Config({ displayAlign: "left" });

var thisStructure;					// Currently active structure.
var thisLibrary = [];				// Currently active library.

var resultsDiv = "#results"			// Element to show results within.
var inputsDiv = "#inputs"			// Element to show inputs within.
var libraryDiv = "#library"			// Element to list library within.

function showInputs() {
	// Shows the input interface for scope properties.

	$(inputsDiv).empty();

	for (var property in structureScope) {
		if (property == "ans" || property == "ds" || property == thisStructure.autoDim) { continue; }
		var value = structureScope[property]
		var units = "kN"
		if (property == "L") { units = "m"; }
		if (property == "E") { units = "kN/m<sup>2</sup>"; }
		if (property == "I") { units = "m<sup>4</sup>"; }
		if (property in thisStructure.dimScope) {
			value = value * structureScope.L;
			units = "m";
		}
		$(inputsDiv).append(
			'<div class="form-group">' +
				'<label class="col-md-2 control-label">' + property + '</label>' + 
				'<div class="col-md-10">' + 
					'<div class="input-group">' +
						'<input type="text" class="form-control scope" id="' + property + '" value="' + value + '" />' +
						'<span class="input-group-addon">' + units + '</span>' +
					'</div>' + 
				'</div>' + 
			'</div>'
		);
	}

}

function setScopeValue(property, value) {
	// Set a mathematics scope value by name.

	if (property in thisStructure.dimScope) {
		value = value / structureScope.L;
		var nL = 1.0 - value;
		for (var dim in thisStructure.dimScope) {
			if (dim != property && dim != thisStructure.autoDim) {
				nL -= structureScope[dim];
			}			
		}
		if (nL > 0) {
			// Only allow the auto-dim to set if parametrically possible.
			structureScope[property] = value;
			structureScope[thisStructure.autoDim] = nL;
		} 
	} else {		
		structureScope[property] = value;

		if (property in commonScope) {
			// Prevent common properties reseting.
			commonScope[property] = value;
		}
	}
}

function showResults(results, units) {
	// Shows the current results, marked-up, on the page.

	$(resultsDiv).empty();
	for (index = 0; index < results.length; ++index) {
		$(resultsDiv).append(	
			'<div class="row">' + 				
				'<div class="col-md-12">' + 
					'<p>' + '\\[' + results[index] + '\\:\\mathrm{' + units[index] + '}' + '\\]' + '</p>' +
				'</div>' +
			'</div>'
		);
	}
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);	
}

function setStructure(structure) {
	// Swap the currently active structure.
	
	thisStructure = structure;
	setScope(thisStructure);	
	refreshSS();
}

function refreshSS() {
	// Refreshes the Simply Supported application.
	
	drawStructure(thisStructure);
	showInputs(thisStructure);	
	var results = solveStructure(thisStructure);
	showResults(results.formulars, results.units);
}

function loadLibrary(library) {	
	// Loads in a Simply Supported structure library.

	thisLibrary = library;
	$(libraryDiv).empty();	
	for (index = 0; index < library.length; ++index) {
		$(libraryDiv).append(
			'<li>' + 
				'<a href="#" class="library" id="' + index + '">' +
					'<small>' + library[index].type.toUpperCase() + '</small>' + 
					': ' + library[index].name + 
				'</a>' + 
			'</li>'
		);
	}
	setStructure(library[0]);
}

window.onload = function () {
	// First-time setup of Simply Supported web application.

    r = Raphael("diagram", canvas_width, canvas_height);

	$(inputsDiv).on('change', 'input.scope', function() {
		// Update scope variables to input value.
		var value = parseFloat(this.value);
		if (!isNaN(value)) {
			setScopeValue(this.id, parseFloat(this.value))
		}
		refreshSS();
	});	
	$(libraryDiv).on('click', 'a.library', function() {
		// Set structure to selected library object.
		setStructure(thisLibrary[parseInt(this.id)]);
	});

    loadLibrary(ss_library);
};