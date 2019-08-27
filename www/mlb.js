$(document).ready(function() {
	$("#shareView").click(function() {
	var paramLoc = $('#locationInput').val()
	var pGeoId = $('#geographyInput').val()
	var paramIndicator = $('#measureInput').val()
	paramGeo = codeToGeography(pGeoId)
	var linkText = window.location.host+window.location.pathname+ "?location=" + paramLoc + "&geography=" + paramGeo +"&indicator="+paramIndicator
	$("#linkText").html(linkText)
    })

	//var measures = ["Deaths due to Circulatory Diseases (%)","Deaths due to External Causes (%)","Deaths due to Malignant Neoplasms (%)","Deaths due to Respiratory Diseases (%)","Deaths from suicide and undetermined intent (%)","Standardised Death Rate - All Cause (per 100,000): All","Standardised Death Rate - Amenable (per 100,000): All","Standardised Death Rate - Avoidable (per 100,000): All","Standardised Death Rate - Circulatory Under 75 (per 100,000): All","Standardised Death Rate - Preventable (per 100,000): All","Standardised Death Rate - Respiratory Under 75 (per 100,000): All"]
var measures = ["Standardised Death Rates - All", "Deaths by Cause (%)", "Life Expectancy", "Road Safety", "Crime"]
		
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
       return null;
    }
    return decodeURI(results[1]) || 0;
}

var paramGeo = $.urlParam('geography')
var paramLoc = $.urlParam('location')
var paramIndicator = $.urlParam('indicator')

defaultGeo = "Assembly Area (2011)";
geoId = 1
if(paramGeo !== null)
{
	switch(paramGeo)
	{
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


$('#measureInput').tokenfield({
  autocomplete: {
	source: measures,
	delay: 1,
	minLength: 0,
  },
  tokens: paramIndicator,
  createTokensOnBlur: false,
  showAutocompleteOnFocus: true,
	}).on('tokenfield:createtoken', function(e){
					DefineVega("m",e.attrs.value)
				}).on('tokenfield:removetoken', function(e){
					DefineVega("-m",e.attrs.value)
				})

$.getJSON("data/locations_Assembly Area (2011).json", function(place){
				$('#locationInput').tokenfield({
				  autocomplete: {
					source: place,
					delay: 1,
					minLength: 0,
				  },
				  tokens: paramLoc,
				  createTokensOnBlur: false,
				  showAutocompleteOnFocus: true,
				}).on('tokenfield:createtoken', function(e){
					DefineVega("p",e.attrs.value)
				}).on('tokenfield:removetoken', function(e){
					DefineVega("-p",e.attrs.value)
	  })
		})

	$('.geographySelect').select2({
		width: 'resolve',
		placeholder: 'Select a Geography',
		data: [
			{ id: 1, text: 'Assembly Area (2011) - 18' },
			{ id: 2, text: 'District Electoral Area (2014) - 80' },
			{ id: 3, text: 'Health and Social Care Trust - 5' },
			{ id: 4, text: 'Local Government District (2014) - 11' },
			{ id: 5, text: 'Northern Ireland - 1' },
		]
	}).val(geoId).trigger('change')
	
	$('.geographySelect').on('select2:select',function(e){
		var n = e.params.data.text.indexOf(" - ")
		var file = e.params.data.text.substr(0,n);
		//console.log("getting file: data/locations_"+file+".json")
		$('#locationInput').tokenfield('setTokens',[]);
		$('#locationInput').tokenfield('destroy');
		$.getJSON("data/locations_"+file+".json", function(place){
				$('#locationInput').tokenfield({
				  autocomplete: {
					source: place,
					delay: 1,
					minLength: 0,
				  },
				  createTokensOnBlur: false,
				  showAutocompleteOnFocus: true,
				}).on('tokenfield:createtoken', function(e){
					DefineVega("p",e.attrs.value)
				})
			})
		})
console.log(paramLoc)
if (paramLoc != null & paramGeo != null & paramIndicator != null)
{
	console.log("params supplied"+paramLoc+":"+paramGeo+":"+paramIndicator)
	 $("#loadingModal").modal('show')
	DefineVega("o",null)
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

	
function DefineVega(i,e)
{
	var p = $('#locationInput').val()
	var m = $('#measureInput').val()
	var places = null;
	var measures = null;
	
	console.log(m)
	console.log(e)
	console.log(p)
	
	if(i==="p")
	{
		measures = m
		places = e
		if(p.length > 0)
		{
			places = p+","+e
		}
	}
	
	if(i==="m")
	{
		places = p
		measures = e
		if(m.length > 0)
		{
			measures = m+","+e
		}
	}
	
	if(i ==="-p")
	{
		measures = m
		places = p.replace(","+e,"")
		places = p.replace(e+",","")
		places = p.replace(e,"")
	}
	
	if(i ==="-m")
	{
		places = p
		measures = m.replace(","+e,"")
		measures = m.replace(e+",","")
		measures = m.replace(e,"")
	}
	
	if(i==="o")
	{
		$.urlParam = function(name){
			var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
			if (results==null) {
			   return null;
			}
			return decodeURI(results[1]) || 0;
		}

		places = $.urlParam('location');
		measures = $.urlParam('indicator');
		$('#locationInput').val(places);
		$('#measureInput').val(measures);
	}
	
	if (measures == null | places == null)
	{
		console.log("breaking")
		return;
	}
	
//	console.log(measures)
//	console.log(places)
	
	measures = measures.replace(/100,000/g,"100~000").replace(/1,000/g,"1~000")
	var measures = measures.split(',').map(function(item){
	return item.trim().replace(/~/g,",");
	});
	
	var places = places.split(',').map(function(item){
	return item.trim();
	});
	
	var geo = $('#geographyInput').select2('data')[0].text
	var n = geo.indexOf(" - ")
	var geography = geo.substr(0,n);
//	console.log(geography)

	var requests = []
	var flatArray = []
	var count = 0
	
	if (measures[0] != "" & places[0] != "")
	{
		$("#loadingModal").modal('show')

	
		for (i in places)
		{
			$.getJSON("data/"+geography+"_"+places[i]+".json", function(d){
				requests.push(d)
			}).always(function(){
				count++
				if (count === places.length)
				{
					for (var arr in requests)
					{
						flatArray = flatArray.concat(requests[arr])
					}
					var dataString = JSON.stringify(flatArray)
	//				console.log(dataString)
					presentVega(dataString, measures)
				}
			})
		}
	}
}

function presentVega(dataString, measures){
	
	var measureGroups = new Object()
		measureGroups["Standardised Death Rates - All"] = ["Standardised Death Rate - All Cause (per 100,000): All","Standardised Death Rate - Amenable (per 100,000): All","Standardised Death Rate - Avoidable (per 100,000): All","Standardised Death Rate - Preventable (per 100,000): All","Standardised Death Rate - Circulatory Under 75 (per 100,000): All","Standardised Death Rate - Respiratory Under 75 (per 100,000): All"]
		measureGroups["Deaths by Cause (%)"] = ["Deaths due to Circulatory Diseases (%)","Deaths due to External Causes (%)","Deaths due to Malignant Neoplasms (%)","Deaths due to Respiratory Diseases (%)","Deaths from suicide and undetermined intent (%)"]
		measureGroups["Life Expectancy"] = ["Life Expectancy","Life expectancy at age 65: Lower confidence limit (Female)","Life expectancy at age 65: Lower confidence limit (Male)","Life expectancy at age 65: Upper confidence limit (Female)","Life expectancy at age 65: Upper confidence limit (Male)","Life expectancy at age 65: Years","Life expectancy at birth: Lower confidence limit","Life expectancy at birth: Upper confidence limit","Life expectancy at birth: Years"]
		measureGroups["Road Safety"] = ["Serious Collision","Seriously injured","Seriously Injured (60+ years)","Slight Collision","Slightly injured","Slightly Injured (60+ years)","Killed","Killed (60+ years)","Seriously Injured (60+ years)","Fatal Collision","Fatalities per 10,000 population","Casualties per 10,000 population","Collisions","Collisions per 10,000 population","Casualties"]
		measureGroups["Crime"] = ["Incidents Recorded with a Domestic Abuse Motivation","Incidents Recorded with a Homophobic Motivation","Incidents Recorded with a Racist Motivation","Incidents Recorded with a Sectarian Motivation","Recorded crime - all offences"]
	var measureMembers = []
	
	var ageOrGender = "AgeBand";

	for (var meas in measures)
	{
		console.log("meas is "+meas)
		console.log(measures[meas])
		if (measures[meas] == "Life Expectancy")
		{
			ageOrGender = "Gender"
		}
		console.log(measureGroups[measures[meas]])
		measureMembers.push(measureGroups[measures[meas]])
	}
	
	var flatArray = []
	for (var arr in measureMembers)
	{
		flatArray = flatArray.concat(measureMembers[arr])
	}
	
	memberString = JSON.stringify(flatArray)
//	console.log(memberString)
//	console.log(dataString)
	
	var opt = {
		"actions": {"source": false, "editor": true},
		defaultStyle: true
	}
	var vlSpec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v3.0.0-rc4.json",
    "title": "Making Life Better Indicators, with max/min and inter-quartile range for all other locations by geography",
	"transform": [
	{"filter": {"field": "ColumnName", "oneOf": flatArray }}
	],
  "data": {
    "values":  dataString
  },
    "facet": {"column": {"field": ageOrGender,"type": "ordinal", "header": {"title": ageOrGender, "labelAngle": 0, "labelFontSize": 15}},
		"row": {"field": "ColumnName","type": "nominal", "header": {"title": null, "labelFontSize": 15, "labelAngle": 0}}
	},
  "spec":
  {
  "layer":[
  {
  "mark": "errorband",
  "encoding": {
	  "y": {
		  "field": "min",
		  "type": "quantitative", "axis":{"title": null},
	  },
	  "y2": {
		  "field": "max",
		  "type": "quantitative", "axis":{"title": null},
		  
	  },
	  "x":{"field":"YearName","type":"ordinal", "axis":{"title":"Year"}},
	  "color": {"value": "black"},
	  "opacity": {"value": 0.1},
	  "detail": [{"field": ageOrGender, "type":"nominal"}, {"field":"ColumnName", "type":"nominal"}],
  },
    "width":300,
    "height": 150,
	
  }
    ,
  {
  "mark": {"type":"errorband",
	
  },
  "color": {"value": "black"},
  "encoding": {
	  "y": {
		  "field": "lower",
		  "type": "quantitative", "axis":{"title": null}
	  },
	  "y2": {
		  "field": "upper",
		  "type": "quantitative", "axis":{"title": null}
	  },
	  "x":{"field":"YearName","type":"ordinal", "axis":{"title":"Year"}},
	  "detail": [{"field":"ColumnName", "type":"nominal"},{"field": ageOrGender, "type":"nominal"}],
  }
  },
  {
    "mark":{"type":"line","point": {"filled":false}},
  "encoding":{
    "x":{"field":"YearName","type":"ordinal", "axis":{"title":"Year"}},
    "y":{"field":"StatisticalValue", "type":"quantitative", "scale": {"type":"linear", "zero": false}},
    "color":{"field":"LocationName","type":"nominal",
	"scale": {"scheme": "dark2"}},
	"detail": [{"field": ageOrGender, "type":"nominal"}, {"field":"ColumnName", "type":"nominal"}],
    },
    "width":300,
    "height": 150,
    }
  ]
  },
  "resolve": {
	"scale": {"y": "independent", "x": "independent"}
}
}
;
  // Embed the visualization in the container with id `vis`
//	vegaEmbed("#vis", vlSpec, opt);
//	  $("#loadingModal").modal('hide')
	   console.log("display charts")
	vegaEmbed("#vis", vlSpec, opt);
	console.log("remove modal")
	  $("#loadingModal").modal('hide')
	  console.log("modal removed")
}	
