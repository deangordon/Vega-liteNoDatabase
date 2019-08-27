$(document).ready(function() {

	$("#shareView").click(function() {
	var paramLoc = $('#locationInput').val()
	var pGeoId = $('#geographyInput').val()
	var paramCompLoc = $('#compLocationInput').val()
	var pCompGeoId = $('#compGeographyInput').val()
	if(paramCompLoc == "")
	{
		paramCompLoc= "Northern Ireland";
	}
	paramGeo = codeToGeography(pGeoId)
	paramCompGeo = codeToGeography(pCompGeoId)
	var linkText = window.location.host+window.location.pathname+ "?location=" + paramLoc + "&geography=" + paramGeo +"&comparisonGeography="+paramCompGeo+"&comparisonLocation="+paramCompLoc
	$("#linkText").html(linkText)
    })
	
    $("#lifeExpectancyButton").click(function() {
        var paramLoc = $('#locationInput').val()
        var pGeoId = $('#geographyInput').val()
        paramGeo = codeToGeography(pGeoId)
        window.location.href = "mlb.html?location=" + paramLoc + "&geography=" + paramGeo + "&indicator=Life Expectancy"
    })

    $("#standardisedDeathRatesButton").click(function() {
        var paramLoc = $('#locationInput').val()
        var pGeoId = $('#geographyInput').val()
        paramGeo = codeToGeography(pGeoId)
        window.location.href = "mlb.html?location=" + paramLoc + "&geography=" + paramGeo + "&indicator=Standardised Death Rates - All"
    })

    $("#pyllButton").click(function() {
        var paramLoc = $('#locationInput').val()
        var pGeoId = $('#geographyInput').val()
        paramGeo = codeToGeography(pGeoId)
        window.location.href = "mlb.html?location=" + paramLoc + "&geography=" + paramGeo + "&indicator=Potential Years of Life Lost"
    })

    $("#causesOfDeathButton").click(function() {
        var paramLoc = $('#locationInput').val()
        var pGeoId = $('#geographyInput').val()
        paramGeo = codeToGeography(pGeoId)
        window.location.href = "mlb.html?location=" + paramLoc + "&geography=" + paramGeo + "&indicator=Deaths by Cause %28%25%29"
    })

    $.urlParam = function(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        }
        return decodeURI(results[1]) || 0;
    }

    var paramGeo = $.urlParam('geography')
    var paramLoc = $.urlParam('location')
    var paramCompGeo = $.urlParam('comparisonGeography')
    var paramCompLoc = $.urlParam('comparisonLocation')

    defaultGeo = "Assembly Area (2011)";
    geoId = 1
    if (paramGeo !== null) {
        switch (paramGeo) {
            case "District Electoral Area (2014)":
                geoId = 2;
                defaultGeo = paramGeo;
                break;
            case "Health and Social Care Trust":
                geoId = 3;
                defaultGeo = paramGeo;
                break;
            case "Local Government District (2014)":
                geoId = 4;
                defaultGeo = paramGeo;
                break;
        }
    }

    defaultCompGeo = "Northern Ireland";
    compGeoId = 5
    if (paramCompGeo !== null) {
        switch (paramCompGeo) {
            case "Assembly Area (2011)":
                compGeoId = 1;
                defaultCompGeo = paramCompGeo;
                break;
            case "District Electoral Area (2014)":
                compGeoId = 2;
                defaultCompGeo = paramCompGeo;
                break;
            case "Health and Social Care Trust":
                compGeoId = 3;
                defaultCompGeo = paramCompGeo;
                break;
            case "Local Government District (2014)":
                compGeoId = 4;
                defaultCompGeo = paramCompGeo;
                break;
        }
    }

    if (paramCompLoc == null) {
        paramCompLoc = "Northern Ireland";
    }

    $.getJSON("data/locations_" + defaultGeo + ".json", function(place) {
        $('#locationInput').tokenfield({
            autocomplete: {
                source: place,
                delay: 1,
                minLength: 0,
            },
            createTokensOnBlur: false,
            showAutocompleteOnFocus: true,
            tokens: paramLoc,
        }).on('tokenfield:createtoken', function(e) {
            DefineVega("p", e.attrs.value)
        }).on('tokenfield:removetoken', function(e) {
            DefineVega("-p", e.attrs.value)
        })
    })

    $('.geographySelect').select2({
        width: '100%',
        data: [{
            id: 1,
            text: 'Assembly Area (2011) - 18'
        }, {
            id: 2,
            text: 'District Electoral Area (2014) - 80'
        }, {
            id: 3,
            text: 'Health and Social Care Trust - 5'
        }, {
            id: 4,
            text: 'Local Government District (2014) - 11'
        }, ]
    }).val(geoId).trigger('change')

    $('.geographySelect').on('select2:select', function(e) {
        var n = e.params.data.text.indexOf(" - ")
        var file = e.params.data.text.substr(0, n);
        //console.log("getting file: data/locations_"+file+".json")
        $('#locationInput').tokenfield('setTokens', []);
        $('#locationInput').tokenfield('destroy');
        $.getJSON("data/locations_" + file + ".json", function(place) {
            $('#locationInput').tokenfield({
                autocomplete: {
                    source: place,
                    delay: 1,
                    minLength: 0,
                },
                createTokensOnBlur: false,
                showAutocompleteOnFocus: true,
            }).on('tokenfield:createtoken', function(e) {
                DefineVega("p", e.attrs.value)
            })
        })
    })

    /* Benchmark */

    $.getJSON("data/locations_" + defaultCompGeo + ".json", function(place) {
        $('#compLocationInput').tokenfield({
            autocomplete: {
                source: place,
                delay: 1,
                minLength: 0,
            },
            tokens: paramCompLoc,
            createTokensOnBlur: false,
            showAutocompleteOnFocus: true,
        }).on('tokenfield:createtoken', function(e) {
            DefineVega("c", e.attrs.value)
        }).on('tokenfield:removetoken', function(e) {
            DefineVega("-c", e.attrs.value)
        })
    })

    $('.compGeographySelect').select2({
        width: '100%',
        placeholder: 'Select a Geography',
        data: [{
            id: 1,
            text: 'Assembly Area (2011) - 18'
        }, {
            id: 2,
            text: 'District Electoral Area (2014) - 80'
        }, {
            id: 3,
            text: 'Health and Social Care Trust - 5'
        }, {
            id: 4,
            text: 'Local Government District (2014) - 11'
        }, {
            id: 5,
            text: 'Northern Ireland - 1'
        }, ]
    }).val(compGeoId).trigger('change')

    $('.compGeographySelect').on('select2:select', function(e) {
        var n = e.params.data.text.indexOf(" - ")
        var file = e.params.data.text.substr(0, n);
        $('#compLocationInput').tokenfield('setTokens', []);
        $('#compLocationInput').tokenfield('destroy');
        $.getJSON("data/locations_" + file + ".json", function(place) {
            $('#compLocationInput').tokenfield({
                autocomplete: {
                    source: place,
                    delay: 1,
                    minLength: 0,
                },
                createTokensOnBlur: false,
                showAutocompleteOnFocus: true,
            }).on('tokenfield:createtoken', function(e) {
                DefineVega("c", e.attrs.value)
            })
        })
    })

    /* If parameters are supplied, display charts on load */
    if (paramLoc != null & paramCompLoc != null) {
        DefineVega("o", null)
    }

	$("#loadingModal").on('shown.bs.modal', function () {
  // modal shown
  setTimeout(function () {
      $("#loadingModal").modal('hide')
  }, 500)
})

});
/* End of Document.ready */

function codeToGeography(code) {
    var paramName = "Assembly Area (2011)"
    switch (code) {
        case "2":
            paramName = "District Electoral Area (2014)"
            break;
        case "3":
            paramName = "Health and Social Care Trust"
            break;
        case "4":
            paramName = "Local Government District (2014)"
            break;
		case "5":
			paramName = "Northern Ireland"
			break;
    }
    return paramName
}

function DefineVega(i, e) {
    var year1 = 20112013;
    var year2 = 20082012;
    var year3 = 2015;
    var year4 = 20122014;

    var p = $('#locationInput').val()
    var places = null;
    var c = $('#compLocationInput').val();
    var comparitor = null;

    /*	console.log(e)
    	console.log(p)
    	console.log(i)
    	console.log(c)*/

    if (i === "p") {
        comparitor = c
        places = e
        if (p.length > 0) {
            places = p + "," + e
        }
    }

    if (i === "-p") {
        comparitor = c
        places = p.replace("," + e, "")
        places = p.replace(e + ",", "")
        places = p.replace(e, "")
    }

    if (i === "c") {
        places = p
        comparitor = e
        if (c.length > 0) {
            comparitor = c + "," + e
        }
    }

    if (i === "-c") {
        places = p
        comparitor = c.replace("," + e, "")
        comparitor = c.replace(e + ",", "")
        comparitor = c.replace(e, "")
    }

    if (i == "o") {
        $.urlParam = function(name) {
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            if (results == null) {
                return null;
            }
            return decodeURI(results[1]) || 0;
        }

        var paramGeo = $.urlParam('geography')
        var paramLoc = $.urlParam('location')
        var paramCompGeo = $.urlParam('comparisonGeography')
        var paramCompLoc = $.urlParam('comparisonLocation')
        places = paramLoc;
        comparitor = paramCompLoc;
        $('#compLocationInput').val(paramCompLoc);
        $('#locationInput').val(paramLoc);
    }

    var places = places.split(',').map(function(item) {
        return item.trim();
    });

    if (comparitor == "") {
        comparitor = "Northern Ireland";
    }
    var comparitor = comparitor.split(',').map(function(item) {
        return item.trim();
    });

    var geo = $('#geographyInput').select2('data')[0].text
    var n = geo.indexOf(" - ")
    var geography = geo.substr(0, n);

    var compGeo = $('#compGeographyInput').select2('data')[0].text
    var m = compGeo.indexOf(" - ")
    var compGeography = compGeo.substr(0, m);

    var requests = []
    var flatArray = []
    var count = 0

	if (places[0] != "" & comparitor[0] != "")
	{
		$("#loadingModal").modal('show')
		for (i in places) {
			$.getJSON("data/" + geography + "_" + places[i] + ".json", function(d) {
				var f = $(d).filter(function(i, n) {
					return n.AgeBand == 'All' & (n.YearNumber == year1 | n.YearNumber == year2 | n.YearNumber == year3 | n.YearNumber == year4);
				})
				requests.push(f)
			}).always(function() {
				count++
				if (count === places.length) {
					var comps;
					//Download the comparitor data set - only 1 allowed
					$.getJSON("data/" + compGeography + "_" + comparitor[0] + ".json", function(d) {
						comps = d
					}).always(function() {
						for (var arr in requests) {
							var filteredComp = $(comps).filter(function(i, n) {
									return n.AgeBand == 'All' & (n.YearNumber == year1 | n.YearNumber == year2 | n.YearNumber == year3 | n.YearNumber == year4);
								})
								//console.log(filteredComp)
								//var comparedArray = []
							for (j in requests[arr]) {
								x = requests[arr][j]
								g = filteredComp.filter(function(i, n) {
									return n.AgeBand === x.AgeBand & n.ColumnName === x.ColumnName & n.Gender === x.Gender & n.YearNumber === x.YearNumber & n.DataSetName === x.DataSetName;
								})
								if (g.length > 0) {
									requests[arr][j]["comparitor"] = g[0].StatisticalValue
								}
							}
							// Join the comparitor data before loading into the flatArray
							flatArray = flatArray.concat(requests[arr].get())
						}
						//console.log(flatArray)
						var dataString = JSON.stringify(flatArray)
						presentVega(dataString)
					})
				}
			})
		}
	}
}

function presentVega(dataString){
	var measuresStandardised = ["Standardised Death Rate - All Cause (per 100,000): All","Standardised Death Rate - Amenable (per 100,000): All","Standardised Death Rate - Preventable (per 100,000): All","Standardised Death Rate - Avoidable (per 100,000): All",
		"Standardised Cancer Death Rate","Standardised Death Rate - Circulatory Under 75 (per 100,000): All","Standardised Death Rate - Respiratory Under 75 (per 100,000): All"]
	var measuresDueto = ["Deaths due to Circulatory Diseases (%)","Deaths due to External Causes (%)","Deaths due to Malignant Neoplasms (%)","Deaths due to Respiratory Diseases (%)","Deaths from suicide and undetermined intent (%)"]
	var opt = {
		"actions": {"source": false, "editor": true},
		defaultStyle: true
	}
	
	//first spec: life expectancy: does not use measures list, coded for male and female to display one after the other
	var vlSpec1 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v3.0.0-rc4.json",
    "title": null,
	
  "data": {
    "values":  dataString
  },
  "transform": [
	{"filter": {"field": "ColumnName", "equal": "Life expectancy at birth: Years" }}, 
	{"filter": {"field": "Gender", "equal": "Male" }}, 
	{"filter": {"field": "YearNumber", "oneOf": [20112013]}}
	],

  "facet": {"row": {"field": "ColumnName","type": "nominal", "header": {"title": null, "labelAngle": 0, "labelFontSize": 15, "titleOffset": -2}},
			"column":{"field":"Gender","type":"ordinal", "header": {"title":"max/min and Inter-quartile range", "labelFontSize": 15}}},
  "spec":
  {
	"layer":[
	{
		"mark":{"type":"errorband"},
		"encoding":{
		"x":{"field":"upper","type":"quantitative", "axis": {"title": null}},
		"x2":{"field":"lower","type":"quantitative"},
		"color": {"value": "black"},
		"opacity": {"value": 0.1}
		},
		"width": 200,
		"height": 40
	},
	{ 
		"mark":{"type":"rule", "strokeDash": [6,6]},
		"encoding":{
		"x":{"field":"max","type":"quantitative"},
		"color":{"value":"red"},
		"size": {"value": 1},
		},
    },
	{ 
		"mark":{"type":"rule", "strokeDash": [6,6]},
		"encoding":{
		"x":{"field":"min","type":"quantitative"},
		"color":{"value":"red"},
		"size": {"value": 1},
		},
    },
		{ 
		"mark":{"type":"rule"},
		"encoding":{
		"x":{"field":"comparitor","type":"quantitative"},
		"color":{"value":"#e6ab02"},
		"size": {"value": 1},
		},
    },
	{ 
		"mark":{"type":"square"},
		"encoding":{
		"x":{"field":"StatisticalValue","type":"quantitative", "scale": {"type":"linear", "zero": false}},
		"color":{"field":"LocationName","type":"nominal",
		"scale": {"scheme": "dark2"}},
		"size": {"value": 50},
		}
    },


  ]
},
"resolve": {
	"scale": {"x": "independent"}
}
}
;
// Spec2: Life expectancy for females, again not using measures included in the measures variable
var vlSpec2 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v3.0.0-rc4.json",
	"transform": [
	{"filter": {"field": "ColumnName", "equal": "Life expectancy at birth: Years" }}, 
	{"filter": {"field": "Gender", "equal": "Female" }}, 
	{"filter": {"field": "YearNumber", "oneOf": [20112013]}}
	],
  "data": {
    "values":  dataString
  },
  "facet": {"row": {"field": "ColumnName","type": "nominal", "header": {"title": null, "labelAngle": 0, "labelFontSize": 15}},
			"column":{"field":"Gender","type":"ordinal", "header": {"title":null, "labelFontSize": 15}}},
  "spec":
  {
	"layer":[
	{
		"mark":{"type":"errorband"},
		"encoding":{
		"x":{"field":"upper","type":"quantitative", "axis": {"title": null}},
		"x2":{"field":"lower","type":"quantitative"},
		"color": {"value": "black"},
		"opacity": {"value": 0.1}
		},
		"width": 200,
		"height": 40
	},
	{ 
		"mark":{"type":"rule", "strokeDash": [6,6]},
		"encoding":{
		"x":{"field":"max","type":"quantitative"},
		"color":{"value":"red"},
		"size": {"value": 1},
		},
    },
	{ 
		"mark":{"type":"rule", "strokeDash": [6,6]},
		"encoding":{
		"x":{"field":"min","type":"quantitative"},
		"color":{"value":"red"},
		"size": {"value": 1},
		},
    },
	{ 
		"mark":{"type":"square"},
		"encoding":{
		"x":{"field":"StatisticalValue","type":"quantitative", "scale": {"type":"linear", "zero": false}},
		"color":{"field":"LocationName","type":"nominal",
		"scale": {"scheme": "dark2"},
		"legend": null},
		"size": {"value": 50},
		}
    },
	{ 
		"mark":{"type":"rule"},
		"encoding":{
		"x":{"field":"comparitor","type":"quantitative", "scale": {"type":"linear", "zero": false}},
		"color":{"value":"#e6ab02"},
		"size": {"value": 1},
		}
	}
  ]
},
"resolve": {
	"scale": {"x": "independent"}
}
}
;

vegaEmbed("#vis1", vlSpec1, opt);
vegaEmbed("#vis2", vlSpec2, opt);
$("#lifeExpectancy").collapse('show');
$("#loadingModal").modal('hide')

// Spec3: Standardised causes of death: using measures specified above
var vlSpec3 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v3.0.0-rc4.json",
	"transform": [
	{"filter": {"field": "ColumnName", "oneOf": measuresStandardised }}, 
	{"filter": {"field": "YearNumber", "oneOf": [2012014,20082012, 2015]}},
	{"filter": {"field": "Gender", "equal": "All"}},
	{"filter": {"field": "AgeBand", "equal": "All"}}
	],
  "data": {
    "values":  dataString
  },
  "facet": {"row": {"field": "ColumnName","type": "nominal", "header": {"title": null, "labelAngle": 0, "labelFontSize": 15}}},
  "spec":
  {
	"layer":[
	{
		"mark":{"type":"errorband"},
		"encoding":{
		"x":{"field":"upper","type":"quantitative", "axis": {"title": null}},
		"x2":{"field":"lower","type":"quantitative"},
		"color": {"value": "black"},
		"opacity": {"value": 0.1}
		},
		"width": 200,
		"height": 40
	},
	{ 
		"mark":{"type":"rule", "strokeDash": [6,6]},
		"encoding":{
		"x":{"field":"max","type":"quantitative"},
		"color":{"value":"red"},
		"size": {"value": 1},
		},
    },
	{ 
		"mark":{"type":"rule", "strokeDash": [6,6]},
		"encoding":{
		"x":{"field":"min","type":"quantitative"},
		"color":{"value":"red"},
		"size": {"value": 1},
		},
    },
	{ 
		"mark":{"type":"square"},
		"encoding":{
		"x":{"field":"StatisticalValue","type":"quantitative", "scale": {"type":"linear", "zero": false}},
		"color":{"field":"LocationName","type":"nominal",
		"scale": {"scheme": "dark2"}},
		"size": {"value": 50},
		}
    },
	{ 
		"mark":{"type":"rule"},
		"encoding":{
		"x":{"field":"comparitor","type":"quantitative", "scale": {"type":"linear", "zero": false}},
		"color":{"value":"#e6ab02"},
		"size": {"value": 1},
		}
	}
  ]
},
"resolve": {
	"scale": {"x": "independent"}
}
}
;

vegaEmbed("#vis3", vlSpec3, opt);
$("#standardisedDeathRates").collapse('show');

// Spec4: Potential Years of life lost: Male | hard-coded
var vlSpec4 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v3.0.0-rc4.json",
	"transform": [
	{"filter": {"field": "ColumnName", "equal": "Potential Years of Life Lost (PYLL) per 100 persons: Male" }}, 
	{"filter": {"field": "YearNumber", "oneOf": [20122014]}},
	{"filter": {"field": "AgeBand", "equal": "All"}}
	],
  "data": {
    "values":  dataString
  },
  "facet": {"row": {"field": "ColumnName","type": "nominal", "header": {"title": null, "labelAngle": 0, "labelFontSize": 15}},
			"column":{"field":"Gender","type":"ordinal", "header": {"title":"max/min and Inter-quartile range", "labelFontSize": 15}}},
  "spec":
  {
	"layer":[
	{
		"mark":{"type":"errorband"},
		"encoding":{
		"x":{"field":"upper","type":"quantitative", "axis": {"title": null}},
		"x2":{"field":"lower","type":"quantitative"},
		"color": {"value": "black"},
		"opacity": {"value": 0.1}
		},
		"width": 200,
		"height": 40
	},
	{ 
		"mark":{"type":"rule", "strokeDash": [6,6]},
		"encoding":{
		"x":{"field":"max","type":"quantitative"},
		"color":{"value":"red"},
		"size": {"value": 1},
		},
    },
	{ 
		"mark":{"type":"rule", "strokeDash": [6,6]},
		"encoding":{
		"x":{"field":"min","type":"quantitative"},
		"color":{"value":"red"},
		"size": {"value": 1},
		},
    },
	{ 
		"mark":{"type":"square"},
		"encoding":{
		"x":{"field":"StatisticalValue","type":"quantitative", "scale": {"type":"linear", "zero": false}},
		"color":{"field":"LocationName","type":"nominal",
		"scale": {"scheme": "dark2"}},
		"size": {"value": 50},
		}
    },
	{ 
		"mark":{"type":"rule"},
		"encoding":{
		"x":{"field":"comparitor","type":"quantitative", "scale": {"type":"linear", "zero": false}},
		"color":{"value":"#e6ab02"},
		"size": {"value": 1},
		}
	}
  ]
},
"resolve": {
	"scale": {"x": "independent"}
}
};

// Spec5: Potential Years of life lost: Female | hard-coded
var vlSpec5 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v3.0.0-rc4.json",
	"transform": [
	{"filter": {"field": "ColumnName", "equal": "Potential Years of Life Lost (PYLL) per 100 persons: Female" }}, 
	{"filter": {"field": "YearNumber", "oneOf": [20122014]}},
	{"filter": {"field": "AgeBand", "equal": "All"}}
	],
  "data": {
    "values":  dataString
  },
	"facet": {"row": {"field": "ColumnName","type": "nominal", "header": {"title": null, "labelAngle": 0, "labelFontSize": 15}},
			"column":{"field":"Gender","type":"ordinal", "header": {"title":null, "labelFontSize": 15}}},
  "spec":
  {
	"layer":[
	{
		"mark":{"type":"errorband"},
		"encoding":{
		"x":{"field":"upper","type":"quantitative", "axis": {"title": null}},
		"x2":{"field":"lower","type":"quantitative"},
		"color": {"value": "black"},
		"opacity": {"value": 0.1}
		},
		"width": 200,
		"height": 40
	},
	{ 
		"mark":{"type":"rule", "strokeDash": [6,6]},
		"encoding":{
		"x":{"field":"max","type":"quantitative"},
		"color":{"value":"red"},
		"size": {"value": 1},
		},
    },
	{ 
		"mark":{"type":"rule", "strokeDash": [6,6]},
		"encoding":{
		"x":{"field":"min","type":"quantitative"},
		"color":{"value":"red"},
		"size": {"value": 1},
		},
    },
	{ 
		"mark":{"type":"square"},
		"encoding":{
		"x":{"field":"StatisticalValue","type":"quantitative", "scale": {"type":"linear", "zero": false}},
		"color":{"field":"LocationName","type":"nominal",
		"scale": {"scheme": "dark2"}},
		"size": {"value": 50},
		}
    },
	{ 
		"mark":{"type":"rule"},
		"encoding":{
		"x":{"field":"comparitor","type":"quantitative", "scale": {"type":"linear", "zero": false}},
		"color":{"value":"#e6ab02"},
		"size": {"value": 1},
		}
	}
  ]
},
"resolve": {
	"scale": {"x": "independent"}
}
};

vegaEmbed("#vis4", vlSpec4, opt);
vegaEmbed("#vis5", vlSpec5, opt);
$("#pyll").collapse('show');

// Spec6: Standardised causes of death: using measures specified above
var vlSpec6 = {
  "$schema": "https://vega.github.io/schema/vega-lite/v3.0.0-rc4.json",
	"transform": [
	{"filter": {"field": "ColumnName", "oneOf": measuresDueto }}, 
	{"filter": {"field": "YearNumber", "oneOf": [2012014,20082012, 2015]}},
	{"filter": {"field": "Gender", "equal": "All"}},
	{"filter": {"field": "AgeBand", "equal": "All"}}
	],
  "data": {
    "values":  dataString
  },
  "facet": {"row": {"field": "ColumnName","type": "nominal", "header": {"title": null, "labelAngle": 0, "labelFontSize": 15}}},
  "spec":
  {
	"layer":[
	{
		"mark":{"type":"errorband"},
		"encoding":{
		"x":{"field":"upper","type":"quantitative", "axis": {"title": null}},
		"x2":{"field":"lower","type":"quantitative"},
		"color": {"value": "black"},
		"opacity": {"value": 0.1}
		},
		"width": 200,
		"height": 40
	},
	{ 
		"mark":{"type":"rule", "strokeDash": [6,6]},
		"encoding":{
		"x":{"field":"max","type":"quantitative"},
		"color":{"value":"red"},
		"size": {"value": 1},
		},
    },
	{ 
		"mark":{"type":"rule", "strokeDash": [6,6]},
		"encoding":{
		"x":{"field":"min","type":"quantitative"},
		"color":{"value":"red"},
		"size": {"value": 1},
		},
    },
	{ 
		"mark":{"type":"square"},
		"encoding":{
		"x":{"field":"StatisticalValue","type":"quantitative", "scale": {"type":"linear", "zero": false}},
		"color":{"field":"LocationName","type":"nominal",
		"scale": {"scheme": "dark2"}},
		"size": {"value": 50},
		}
    },
	{ 
		"mark":{"type":"rule"},
		"encoding":{
		"x":{"field":"comparitor","type":"quantitative", "scale": {"type":"linear", "zero": false}},
		"color":{"value":"#e6ab02"},
		"size": {"value": 1},
		}
	}
  ]
},
"resolve": {
	"scale": {"x": "independent"}
}
}
;

vegaEmbed("#vis6", vlSpec6, opt);
$("#CoD").collapse('show');

}	
