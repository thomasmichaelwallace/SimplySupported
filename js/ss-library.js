// === [ STRUCTURES ] =========================================================

var ss_library = [
	// Cantilevers ----------------------------------------------------------------
	{
		type: "Canilever",
		name: "Full-Length UDL",
		compose: ["X", "U", "R"],
		widths: [0, 1.0, 0],
		loadScope: {
			W: 25.0
		},
		dimScope : {},
		autoDim : "",
		moments: [
			{
				name: "M_{max}",
				eqn: "W*L/2.0",
				latex: "\\frac{WL}{2}"
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
				eqn: "(W * L^3)/(8 * E*I)",
				latex: "\\frac{WL^3}{8EI}"
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
		name: "Central Point Load",
		compose: ["P", "S", "F", "S", "P"],
		widths: [0, "a", 0, "b", 0],
		loadScope: {
			P: 25.0
		},
		dimScope: {
			a: 0.5,
			b: 0.5
		},
		autoDim: "b",
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
	}
];