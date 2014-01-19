//  Simply Supported
//   - Structures Library.
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

// === [ LIBRARY ] ============================================================

// Library Schema:
// 	type (string)
//	name (string)
//		These form the structure identitfy in the drop down list, formatted as "TYPE: Name"/
//		These values do not alter the behaviour of Simply Supported at all.

//	compose (array of strings)
//		This forms the graphical make-up of the structure, such that:
//			R - Free (unsupported) end
//			P - Proppped (vertical) support
//			X - Fixed support (start/end orientation is automatically detected)
//			L - Point load (labelled 'P')
//			U - Uniformly distributed load (labelled 'W')
//			S - Unloaded length

//	widths (array of numbers and strings)
//		This forms the width (as a proportion of length) of each item in the compose array:
//			For point elements (R, P and X) the value should be 0
//			For long elements (U, S) the value should either be a fixed proportion of the length (e.g. 0.5),
//				or a string relating to a respective propertiy of the dimScope (e.g. "a").

//	loadScope (JSON properties with default numerical values)
//		Identifies the parameter acting as the magnitude of loading in the structure, i.e. P or W.

//	dimScope (JSON properties with deafult numerical values of total length proportion)
//		Identifies the parameters used to define the widths of the structure.

//	autoDim (string)
//		Identifies the dimension parameter that is calculated automatically from the remaining length.

//	moments (array of JSON objects)
//	reactions (array of JSON objects)
//	displacements (array of JSON objects)
//		Describes the formulae for the structure form, as:
//			name (LaTeX string):
//				The name of the formula, e.g. R_A	
//			eqn (Mathematical string):
//				The formula to evaluate, as a string, e.g. "(WL^2)/8"
//				Note, all variables in dimScope and loadScope along with L, E and I can be referenced.
//			latex (LaTeX string):
//				The LaTeX transcription of the forumla.


var ss_library = [
	// Cantilevers ----------------------------------------------------------------
	{
		type: "Canilever",
		name: "Base Loaded UDL",
		compose: ["X", "U", "S", "R"],
		widths: [0, "a", "b", 0],
		loadScope: {
			W: 25.0
		},
		dimScope : {
			a: 0.75,
			b: 0.25
		},
		autoDim : "b",
		moments: [
			{
				name: "M_{max}",
				eqn: "W*a/2.0",
				latex: "\\frac{Wa}{2}"
			}
		],
		reactions: [
			{
				name: "R_{A}",
				eqn: "W",
				latex: "W"
			}
		],
		displacements: [
			{
				name: "d_{B}",
				eqn: "(W * a^3)/(8 * E*I)",
				latex: "\\frac{Wa^3}{8EI}"
			},
			{
				name: "d_{max}",
				eqn: "(W * a^3)/(8 * E*I)*(1 + (4*b)/(3*a))",
				latex: "\\frac{Wa^3}{8EI}(1+\\frac{4b}{3a})"
			}			
		]
	},	
	{
		type: "Canilever",
		name: "End Loaded UDL",
		compose: ["X", "S", "U", "R"],
		widths: [0, "a", "b", 0],
		loadScope: {
			W: 25.0
		},
		dimScope : {
			a: 0.75,
			b: 0.25
		},
		autoDim : "a",
		moments: [
			{
				name: "M_{max}",
				eqn: "W*(a + b/2.0)",
				latex: "W(a+\\frac{b}{2})"
			}
		],
		reactions: [
			{
				name: "R_{A}",
				eqn: "W",
				latex: "W"
			}
		],
		displacements: [
			{
				name: "d_{max}",
				eqn: "(W*a^3 + 18*a^2*b + 12*a*b^2 + 3*b^3)/(24 * E*I)",
				latex: "\\frac{Wa^3 + 18a^2b + 12ab^2 + 3b^3}{24EI}\\]\\[\\qquad"
			}			
		]
	},		
	{
		type: "Canilever",
		name: "Centre Loaded UDL",
		compose: ["X", "S", "U", "S", "R"],
		widths: [0, "a", "b", "c", 0],
		loadScope: {
			W: 25.0
		},
		dimScope : {
			a: 0.35,
			b: 0.30,
			c: 0.35
		},
		autoDim : "c",
		moments: [
			{
				name: "M_{max}",
				eqn: "W*(a + b/2.0)",
				latex: "W(a+\\frac{b}{2})"
			}
		],
		reactions: [
			{
				name: "R_{A}",
				eqn: "W",
				latex: "W"
			}
		],
		displacements: [
			{
				name: "d_{max}",
				eqn: "(W/(24*E*I))*(8*a^3 + 18*a^2*b + 12*a*b^2 + 3*b^3 + 12*a^3*c + 12*a*b*c + 4*b^2*c)",
				latex: "\\frac{W}{24EI}(8a^3 + 18a^2b + 12ab^2 + \\]\\[\\quad 3b^3 + 12a^2c + 12abc + 4b^2c)\\]\\[\\qquad"
			}			
		]
	},	
	{
		type: "Canilever",
		name: "Single Point Load",
		compose: ["X", "S", "F", "S", "R"],
		widths: [0, "a", 0, "b", 0],
		loadScope: {
			P: 25.0
		},
		dimScope : {
			a: 0.5,
			b: 0.5
		},
		autoDim : "b",
		moments: [
			{
				name: "M_{max}",
				eqn: "P*a",
				latex: "Pa"
			}
		],
		reactions: [
			{
				name: "R_{A}",
				eqn: "P",
				latex: "P"
			}
		],
		displacements: [
			{
				name: "d_{C}",
				eqn: "(P * a^3)/(3 * E*I)",
				latex: "\\frac{Pa^3}{3EI}"
			},		
			{
				name: "d_{max}",
				eqn: "(P * a^3)/(3 * E*I)* (1 + (3 * b)/(2 * a))",
				latex: "\\frac{Pa^3}{3EI}(1 + \\frac{3b}{2a})"
			}
		]
	},	
	// Simply Supported Beams -----------------------------------------------------
	{
		type: "Simply Supported",		
		name: "Full Length UDL",
		compose: ["P", "U", "P"],
		widths: [0, 1.0, 0],
		loadScope: {
			W: 25.0
		},
		dimScope: {},
		autoDim: "",
		moments: [
			{
				name: "M_{max}",
				eqn: "W*L/8",
				latex: "\\frac{WL}{8}"
			}
		],
		reactions: [
			{
				name: "R_A",
				eqn: "W/2",
				latex: "\\frac{W}{2}"
			},{
				name: "R_B",
				eqn: "W/2",
				latex: "\\frac{W}{2}"
			}
		],
		displacements: [
			{
				name: "d_{max}",
				eqn: "(5 * W * L^3)/(384 * E*I)",
				latex: "\\frac{5}{384}\\frac{WL^3}{EI}"
			}
		]
	},
	{
		type: "Simply Supported",		
		name: "Two Edge UDLs",
		compose: ["P", "U", "S", "U", "P"],
		widths: [0, "a", "b", "a", 0],
		loadScope: {
			W: 25.0
		},
		dimScope: {
			a: 0.25,
			b: 0.5
		},
		autoDim: "b",
		moments: [
			{
				name: "M_{max}",
				eqn: "2*W*a/4",
				latex: "\\frac{(2W)a}{4}"
			}
		],
		reactions: [
			{
				name: "R_A",
				eqn: "2*W/2",
				latex: "\\frac{(2W)}{2}"
			},{
				name: "R_B",
				eqn: "2*W/2",
				latex: "\\frac{(2W)}{2}"
			}
		],
		displacements: [
			{
				name: "d_{max}",
				eqn: "((2*W)*a * (3*L^2 - 2*a^2))/(96 * E*I)",
				latex: "\\frac{(2W)a * (3L^3 - 2a^2)}{96EI}"
			}
		]
	},
	{
		type: "Simply Supported",		
		name: "Centre Loaded UDL",
		compose: ["P", "S", "U", "S", "P"],
		widths: [0, "a", "b", "c", 0],
		loadScope: {
			W: 25.0
		},
		dimScope: {
			a: 0.25,
			b: 0.25,
			c: 0.5
		},
		autoDim: "c",
		moments: [
			{
				name: "M_{max}",
				eqn: "(W/b)*(((a + (W/L)*(0.5*b + c)/W)^2 - a^2)/2)",
				latex: "\\frac{W}{b}(\\frac{x^2-a^2}{2})\\]\\[\\quad\\mathrm{When}\\:x=a+\\frac{R_ab}{W}\\]\\[\\qquad"
			}
		],
		reactions: [
			{
				name: "R_A",
				eqn: "(W/L)*(b/2 + c)",
				latex: "\\frac{W}{L}(\\frac{b}{2} + c)"
			},{
				name: "R_B",
				eqn: "(W/L)*(b/2 + a)",
				latex: "\\frac{W}{L}(\\frac{b}{2} + a)"
			}
		],
		displacements: [
			{
				name: "d_{max}",
				eqn: "(W)/(384 * E*I)*(8*L^3 - 4*L*b^2 + b^3)",
				latex: "\\frac{W}{384EI}(8L^3 - 4Lb^2 + b^3)\\]\\[\\quad\\mathrm{When}\\:a=c\\]\\[\\qquad"
			}
		]
	},
	{
		type: "Simply Supported",		
		name: "Central Point Load",
		compose: ["P", "S", "F", "S", "P"],
		widths: [0, 0.5, 0, 0.5, 0],
		loadScope: {
			P: 25.0
		},
		dimScope: {},
		autoDim: "",
		moments: [
			{
				name: "M_{max}",
				eqn: "P*L/4",
				latex: "\\frac{PL}{4}"
			}
		],
		reactions: [
			{
				name: "R_A",
				eqn: "P/2",
				latex: "\\frac{P}{2}"
			},{
				name: "R_B",
				eqn: "P/2",
				latex: "\\frac{P}{2}"
			}
		],
		displacements: [
			{
				name: "d_{max}",
				eqn: "(P * L^3)/(48 * E*I)",
				latex: "\\frac{PL^3}{48EI}"
			}
		]
	},
	{
		type: "Simply Supported",		
		name: "Double Centre Point Load",
		compose: ["P", "S", "F", "S", "F", "S", "P"],
		widths: [0, "a", 0, "b", 0, "a", 0],
		loadScope: {
			P: 25.0
		},
		dimScope: {
			a: 0.25,
			b: 0.5
		},
		autoDim: "b",
		moments: [
			{
				name: "M_{max}",
				eqn: "P*a",
				latex: "Pa"
			}
		],
		reactions: [
			{
				name: "R_A",
				eqn: "P",
				latex: "P"
			},{
				name: "R_B",
				eqn: "P",
				latex: "P"
			}
		],
		displacements: [
			{
				name: "d_{max}",
				eqn: "(P * L^3)/(6 * E*I)*((3*a)/(4*L)-(a/L)^3)",
				latex: "\\frac{PL^3}{6EI}[\\frac{3a}{4L}-(\\frac{a}{L})^3]"
			}
		]
	},
	{
		type: "Simply Supported",		
		name: "Single In-Span Point Load",
		compose: ["P", "S", "F", "S", "P"],
		widths: [0, "a", 0, "b", 0],
		loadScope: {
			P: 25.0
		},
		dimScope: {
			a: 0.25,
			b: 0.75
		},
		autoDim: "b",
		moments: [
			{
				name: "M_{max}",
				eqn: "P*a*b/L",
				latex: "\\frac{Pab}{L}"
			}
		],
		reactions: [
			{
				name: "R_A",
				eqn: "P*b/L",
				latex: "\\frac{Pb}{L}"
			},{
				name: "R_B",
				eqn: "P*a/L",
				latex: "\\frac{Pa}{L}"
			}
		],
		displacements: []
	}
];