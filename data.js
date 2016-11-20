var	neighborHoods =  [
		 {
		  name: 'Union Station',
			coordinates: [
				[-104.97345, 39.74759],
				[-104.97356, 39.77972],
				[-104.98975, 39.78014],
				[-104.98729, 39.74765]
			],
			troops: 3,
			attackableTerritories: ["Sunnyside", "Elyria Swanson", "Cole", "Whittier", "City Park West", "Cap Hill", "Down Town", "LoDo", ]
		},
	{
			name: 'Cole',
			coordinates: [
				[-104.97341, 39.7622],
				[-104.9599, 39.76208],
				[-104.95927, 39.78021],
				[-104.97351, 39.78018]
			],
			troops: 2,
			attackableTerritories: []
		},
	{
			name: 'Clayton',
			coordinates: [
				[-104.9599, 39.76208],
				[-104.94057, 39.76192],
				[-104.94052, 39.7802],
				[-104.95927, 39.78019]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'Whittier',
			coordinates: [
				[-104.959624, 39.762053],
				[-104.959796, 39.754532],
				[-104.973443, 39.754729],
				[-104.973529, 39.762185]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'skyland',
			coordinates: [
				[-104.959730, 39.762119],
				[-104.959730, 39.754663],
				[-104.940676, 39.754597],
				[-104.940504, 39.761922]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'City Park',
			coordinates: [
				[-104.959730, 39.754597],
				[-104.959988, 39.740211],
				[-104.940676, 39.740211],
				[-104.940676, 39.754532]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'City Park West',
			coordinates: [
				[-104.959816, 39.754548],
				[-104.959644, 39.740162],
				[-104.973377, 39.740228],
				[-104.973463, 39.754548]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'Cap Hill',
			coordinates: [
				[-104.9874, 39.74758],
				[-104.98631, 39.74023],
				[-104.97348, 39.74016],
				[-104.97345, 39.74756]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'Cheeseman',
			coordinates: [
				[-104.986381, 39.740151],
				[-104.986552, 39.725629],
				[-104.95919, 39.72556],
				[-104.95903, 39.74014]
			],
			troops: 2,
			attackableTerritories: []
		},
	{
			name: 'Congress Park',
			coordinates: [
				[-104.959017, 39.740116],
				[-104.940821, 39.740182],
				[-104.940992, 39.725660],
				[-104.959189, 39.725726]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'Parkhill',
			coordinates: [
				[-104.940564, 39.761910],
				[-104.940649, 39.740199],
				[-104.912583, 39.740133],
				[-104.912583, 39.761976]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'North Parkhill',
			coordinates: [
				[-104.912586, 39.762062],
				[-104.940567, 39.761996],
				[-104.940481, 39.783617],
				[-104.912757, 39.783963]
			],
			troops: 3,
			attackableTerritories: []
		},
	{
			name: 'Elyria Swanson',
			coordinates: [
				[-104.940704, 39.780189],
				[-104.98973, 39.78015],
				[-104.988083, 39.791203],
				[-104.940361, 39.794567]
			],
			troops: 1,
			attackableTerritories: ["Chaffee Park", "Sunnyside", "Union Station", "Cole", "Clayton", "North Parkhill"]
		},
	{
			name: 'Chaffee Park',
			coordinates: [
				[-104.98967, 39.78414],
				[-104.98846, 39.791],
				[-105.0252, 39.79396],
				[-105.02537, 39.7846]
			],
			troops: 2,
			attackableTerritories: ["Sunnyside", "Elyria Swanson"]
		},
	{
			name: 'Sunnyside',
			coordinates: [
				[-105.025399, 39.784499],
				[-104.989694, 39.784235],
				[-104.989866, 39.769591],
				[-105.025399, 39.769327]
			],
			troops: 1,
			attackableTerritories: ["Hihhlands", "Chaffee Park", "Elyria Swanson", "Union Station"]
		},
	{
			name: 'LoDo',
			coordinates: [
				[-104.9897, 39.76939],
				[-104.9888, 39.7556],
				[-105.0034, 39.74542],
				[-105.01128, 39.75583]
			],
			troops: 2,
			attackableTerritories: ["Highlands", "Auraria", "Down Town", "Union Station"]
		},
	{
			name: 'Down Town',
			coordinates: [
				[-104.98872, 39.75537],
				[-105.0033, 39.74541],
				[-104.9994, 39.74046],
				[-104.98635, 39.74027]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'Auraria',
			coordinates: [
				[-104.999730, 39.740675],
				[-105.011403, 39.755854],
				[-105.017239, 39.750971],
				[-105.014493, 39.740543]
			],
			troops: 1,
			attackableTerritories: ["LoDo", "Downtown", "Baker", "Broncos Stadium", "Highlands"]
		},
	{
			name: 'Broncos Stadium',
			coordinates: [
				[-105.017239, 39.751498],
				[-105.014149, 39.740543],
				[-105.025479, 39.740675],
				[-105.025136, 39.751235]
			],
			troops: 1,
			attackableTerritories: ["Sun Valley", "Sloan's Lake", "Highlands", "Auraria"]
		},
	{
			name: 'Highlands',
			coordinates: [
				[-105.016895, 39.751568],
				[-104.98986, 39.76961],
				[-105.025307, 39.769383],
				[-105.025135, 39.751568]
			],
			troops: 1,
			attackableTerritories: ["Broncos Stadium", "Auraria", "Sloan's Lake", "Sunnyside", "LoDo"]
		},
	{
			name: 'Sun Valley',
			coordinates: [
				[-105.025135, 39.740415],
				[-105.02505, 39.72565],
				[-105.01333, 39.72562],
				[-105.013805, 39.740415]
			],
			troops: 1,
			attackableTerritories: ["Villa Park", "Valverde", "Baker", "Broncos Stadium"]
		},
	{
			name: 'Baker',
			coordinates: [
				[-105.014018, 39.740415],
				[-105.013331, 39.725629],
				[-104.9988, 39.71133],
				[-104.998740, 39.740415]
			],
			troops: 1,
			attackableTerritories: ["Auraria", "Sun Valley", "Golden Triangle", "Valverde", "Sputnik", ]
		},
	{
			name: 'Golden Triangle',
			coordinates: [
				[-104.99873, 39.74043],
				[-104.99869, 39.72571],
				[-104.98656, 39.72565],
				[-104.986381, 39.740283]
			],
			troops: 1,
			attackableTerritories: ["Baker", "Cheeseman", "Down Town", "Sputnik"]
		},
	{
			name: 'Hale',
			coordinates: [
				[-104.940783, 39.740283],
				[-104.940783, 39.725497],
				[-104.923446, 39.725629],
				[-104.923446, 39.740283]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'Montclair',
			coordinates: [
				[-104.923274, 39.725761],
				[-104.923446, 39.740151],
				[-104.903533, 39.740283],
				[-104.903705, 39.725629]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'Lowry Air Force Base',
			coordinates: [
				[-104.903380, 39.740316],
				[-104.903552, 39.711534],
				[-104.865958, 39.711138],
				[-104.884841, 39.740316]
			],
			troops: 2,
			attackableTerritories: []
		},
	{
			name: 'Delmar',
			coordinates: [
				[-104.865958, 39.711270],
				[-104.88475, 39.74039],
				[-104.847119, 39.740184],
				[-104.847290, 39.711270]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'Jewell Heights',
			coordinates: [
				[-104.846947, 39.740184],
				[-104.847119, 39.725794],
				[-104.824803, 39.725794],
				[-104.825146, 39.740316]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'Lynn Knoll',
			coordinates: [
				[-104.824803, 39.725662],
				[-104.826691, 39.711270],
				[-104.847119, 39.711402],
				[-104.847290, 39.725662]
			],
			troops: 2,
			attackableTerritories: []
		},
	{
			name: 'Aurora Hills',
			coordinates: [
				[-104.847250, 39.711340],
				[-104.826651, 39.711472],
				[-104.829054, 39.696944],
				[-104.847079, 39.696812]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'Utah Park',
			coordinates: [
				[-104.829054, 39.696581],
				[-104.828539, 39.674916],
				[-104.847250, 39.674916],
				[-104.846907, 39.696713]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'Dayton Triangle',
			coordinates: [
				[-104.847248, 39.696705],
				[-104.847076, 39.674908],
				[-104.903381, 39.675833],
				[-104.903553, 39.697498]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'Windsor',
			coordinates: [
				[-104.865615, 39.711200],
				[-104.865787, 39.696936],
				[-104.903381, 39.697729],
				[-104.903209, 39.711332]
			],
			troops: 2,
			attackableTerritories: []
		},
	{
			name: 'Glendale',
			coordinates: [
				[-104.903608, 39.711302],
				[-104.903436, 39.696775],
				[-104.940687, 39.696775],
				[-104.940687, 39.711698]
			],
			troops: 3,
			attackableTerritories: []
		},
	{
			name: 'Hilltop',
			coordinates: [
				[-104.903469, 39.711401],
				[-104.903469, 39.725530],
				[-104.940547, 39.725662],
				[-104.940547, 39.711533]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'Cherry Creek',
			coordinates: [
				[-104.940736, 39.725662],
				[-104.940736, 39.711665],
				[-104.973352, 39.711137],
				[-104.973695, 39.725794]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'Speer',
			coordinates: [
				[-104.973695, 39.725530],
				[-104.973352, 39.711401],
				[-104.987600, 39.711269],
				[-104.987428, 39.725662]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'Washington Park',
			coordinates: [
				[-104.998586, 39.711311],
				[-104.97352, 39.69026],
				[-104.959275, 39.684763],
				[-104.959275, 39.711179]
			],
			troops: 1,
			attackableTerritories: ["Speer", "Sputnik", "Platte Park", "Cherry Creek", "Belcaro", "Triangle Land"]
		},
	{
			name: 'Platte Park',
			coordinates: [
				[-104.99876, 39.71133],
				[-104.973523, 39.690212],
				[-104.973695, 39.678719],
				[-105.003221, 39.678983]
			],
			troops: 1,
			attackableTerritories: ["Ruby", "Athmar Park", "Washington Park", "Triangle Land", ]
		},
	{
			name: 'Athmar Park',
			coordinates: [
				[-105.000818, 39.696817],
				[-104.9988, 39.71133],
				[-105.02532, 39.71123],
				[-105.025022, 39.696949]
			],
			troops: 1,
			attackableTerritories: ["Ruby Hill", "West Wood", "Valverde", "Platte Park"]
		},
	{
			name: 'Ruby Hill',
			coordinates: [
				[-105.000646, 39.696684],
				[-105.003564, 39.678983],
				[-105.025193, 39.678851],
				[-105.025022, 39.696817]
			],
			troops: 1,
			attackableTerritories: ["West Wood", "Harvey Park", "Athmar Park", "Platte Park"]
		},
	{
			name: 'University',
			coordinates: [
				[-104.973695, 39.678620],
				[-104.973523, 39.666332],
				[-104.940506, 39.653249],
				[-104.94048, 39.68291]
			],
			troops: 2,
			attackableTerritories: []
		},
	{
			name: 'Belcaro',
			coordinates: [
				[-104.959218, 39.711179],
				[-104.959389, 39.685027],
				[-104.940506, 39.682914],
				[-104.940678, 39.711575]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'University Hill',
			coordinates: [
				[-104.940279, 39.682920],
				[-104.940623, 39.653453],
				[-104.918307, 39.653189],
				[-104.925345, 39.667858]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'Valverde',
			coordinates: [
				[-105.025053, 39.725649],
				[-105.025225, 39.711256],
				[-104.9988, 39.71133],
				[-105.01333, 39.72562]
			],
			troops: 1,
			attackableTerritories: []
		},
	{
			name: 'Barnum Park',
			coordinates: [
				[-105.025053, 39.725781],
				[-105.025225, 39.711256],
				[-105.053034, 39.711520],
				[-105.053206, 39.725913]
			],
			troops: 1,
			attackableTerritories: ["West Wood", "Valverde", "Villa Park"]
		},
	{
		name: 'Villa Park',
		coordinates: [
				[-105.02505, 39.72578],
				[-105.025225, 39.740500],
				[-105.053377, 39.740632],
				[-105.053206, 39.726111]
			],
			troops: 1,
			attackableTerritories: ["Barnum Park", "Sun Valley", "Sloan\'s Lake"]
		},
	{
			name: 'Sloan\'s Lake',
			coordinates: [
				[-105.025397, 39.740599],
				[-105.053034, 39.740467],
				[-105.053549, 39.761980],
				[-105.025568, 39.759868]
			],
			troops: 2,
			attackableTerritories: ["Villa Park", "Broncos Stadium", "Highlands"]
		},
	{
		name: 'West Wood',
		coordinates: [
				[-105.025359, 39.711128],
				[-105.025016, 39.682466],
				[-105.053168, 39.682466],
				[-105.053168, 39.711260]
			],
			troops: 1,
			attackableTerritories: ["Harvey Park", "Ruby Hill", "Athmar Park", "Barnum Park" ]
		},
	{
			name: 'Harvey Park',
			coordinates: [
				[-105.025187, 39.682532],
				[-105.025016, 39.667998],
				[-105.053512, 39.668130],
				[-105.053168, 39.682400]
			],
			troops: 1,
			attackableTerritories: ["West Wood", "Fort Logan", "Ruby Hill"]
		},
	{
			name: 'Fort Logan',
			coordinates: [
				[-105.053306, 39.667897],
				[-105.052791, 39.653493],
				[-105.024982, 39.652171],
				[-105.025154, 39.667765]
			],
			troops: 3,
			attackableTerritories: ["Bear Valley", "Harvey Park"]
		},
	{
			name: 'Sputnik',
			coordinates: [
				[-104.99876, 39.72571],
				[-104.98743, 39.72565],
				[-104.9876, 39.71128],
				[-104.9988, 39.71134]
			],
			troops: 3,
			attackableTerritories: ["Baker", "Washington Park", "Speer", "Golden Triangle", "Speer", ]
		},
	{
			name: 'Triangle Land',
			coordinates: [
				[-104.9735, 39.69021],
				[-104.97369, 39.67862],
				[-104.94051, 39.68291],
				[-104.95928, 39.68476]
			],
			troops: 3,
			attackableTerritories: []
		},
	{
			name: 'BooBoo Caca',
			coordinates: [
				[-104.86561, 39.71122],
				[-104.84727, 39.71126],
				[-104.84709, 39.69671],
				[-104.86578, 39.69697]
			],
			troops: 3,
			attackableTerritories: []
		},
	{
			name: 'Bear Valley',
			coordinates: [
				[-105.052734, 39.653228],
				[-105.081058, 39.653228],
				[-105.081058, 39.667897],
				[-105.053077, 39.667765]
			],
			troops: 1,
			attackableTerritories: ["Fort Logan"]
		}
	]
