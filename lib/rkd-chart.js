const pRequest = require("./pRequest");

const requestURL = "http://api.rkd.refinitiv.com/api/Charts/Charts.svc/REST/Charts_1/GetChart_2";


exports.getChart = (ric, startTime, endTime, cWidth, cHeight) => {
	if(!global.token)
		return Promise.reject("Unable to get quotes, Authorization token not available");
		
	const chartMsg = {
	   "GetChart_Request_2": {
		  "chartRequest": {
			 "TimeSeries": { 
				"TimeSeriesRequest_typehint": [ "TimeSeriesRequest" ],
				"TimeSeriesRequest": [{
					  "Symbol": ric,
					  "Reference": "d1"
				}]
			 },
			 "Analyses": {
				"Analysis_typehint": [ "Analysis", "Analysis" ],
				"Analysis": [{
					  "Reference": "a1",
					  "OHLC": {"Instrument1": {"Reference": "d1"}}
				   },
				   {
					  "Reference": "a2",
					  "Vol": {"Instrument1": {"Reference": "d1"}}
				   }]
			 },
			 "StandardTemplate": {
				"Title": {
				   "Caption": {"Visible": true, "Customized": false},
				   "Range": {"Visible": true}
				},
				"Legend": {"Visible": true, "Information": "Long", "Layout": "MultiLine", "Position": "Overlaid"},
				"Instrument": "Symbol",
				"Delimiter": "%",
				"GridLines": "None",
				"YAxisMarkers": "None",
				"Interval": {"CommonType": "Days", "Multiplier": "1"},
				"ShowNonTradedPeriods": false,
				"ShowHolidays": false,
				"ShowGaps": true,
				"XAxis": {
				   "Visible": true,
				   "Position": "Bottom",
				   "Range": {
					  "Fixed": {
						 "First": startTime,
						 "Last": endTime
					  }
				   }
				},
				"Subchart": [
				   {
					  "Weight": 5.0,
					  "YAxis": [
						 {
							"Visible": true,
							"Position": "Right",
							"Invert": false,
							"Logarithmic": false,
							"Display": {"Mode": "Automatic"},
							"Range": {"Automatic": ""},
							"Analysis": [{"Reference": "a1"}]
						 }
					  ]
				   },
				   {
					  "Weight": 2.0,
					  "YAxis": [
						 {
							"Visible": true,
							"Position": "Right",
							"Invert": false,
							"Logarithmic": false,
							"Display": {"Mode": "Automatic"},
							"Range": {"Automatic": ""},
							"Analysis": [{"Reference": "a2"}]
						 }
					  ]
				   }
				],
				"YAxisTitles": "All",
				"Brand": "None"
			 },
			 "Scheme": {
				"Background": {
				   "BackgroundMode": "Solid",
				   "StartColor": {"Named": "White"},
				   "EndColor": {"Named": "White"},
				   "HatchStyle": "LargeGrid",
				   "GradientMode": "ForwardDiagonal",
				   "ImageMode": "Centered"
				},
				"Border": {
				   "Color": {"RGB": "139;139;155"},
				   "DashStyle": "Solid",
				   "Width": 1.0
				},
				"GridLines": {
				   "Color": {"RGB": "139;139;155"},
				   "DashStyle": "Dot",
				   "Width": 1.0
				},
				"Title": {
				   "Caption": {
					  "Color": {"Named": "Black"},
					  "Family": "Arial",
					  "Style": "Bold",
					  "Size": 12.0
				   },
				   "Range": {
					  "Color": {"Named": "Black"},
					  "Family": "Arial",
					  "Style": "Regular",
					  "Size": 8.25
				   }
				},
				"Legend": {
				   "Color": {"Named": "Black"},
				   "Family": "Arial",
				   "Style": "Regular",
				   "Size": 8.25
				},
				"XAxis": {
				   "Major": {
					  "Color": {"Named": "Black"},
					  "Family": "Arial",
					  "Style": "Bold",
					  "Size": 9.75
				   },
				   "Minor": {
					  "Color": {"Named": "Black"},
					  "Family": "Arial",
					  "Style": "Regular",
					  "Size": 8.25
				   }
				},
				"YAxis": {
				   "Major": {
					  "Color": {"Named": "Black"},
					  "Family": "Arial",
					  "Style": "Bold",
					  "Size": 9.75
				   },
				   "Minor": {
					  "Color": {"Named": "Black"},
					  "Family": "Arial",
					  "Style": "Regular",
					  "Size": 8.25
				   },
				   "Title": {
					  "Color": {"Named": "Black"},
					  "Family": "Arial",
					  "Style": "Regular",
					  "Size": 8.25
				   }
				},
				"Series": [
				   {
					  "Color": {"Named": "Black"},
					  "DashStyle": "Solid",
					  "Width": 0.0,
					  "FillColor": {"Named": "Black"},
					  "FillStyle": "Percent20"
				   },
				   {
					  "Color": {"Named": "Red"},
					  "DashStyle": "Solid",
					  "Width": 0.0,
					  "FillColor": {"Named": "Red"},
					  "FillStyle": "Percent20"
				   },
				   {
					  "Color": {"RGB": "62;169;0"},
					  "DashStyle": "Solid",
					  "Width": 0.0,
					  "FillColor": {"RGB": "62;169;0"},
					  "FillStyle": "Percent20"
				   }
				],
				"LevelLine": [
				   {
					  "Color": {"RGB": "0;0;153"},
					  "DashStyle": "Solid",
					  "Width": 1.0
				   },
				   {
					  "Color": {"RGB": "120;120;120"},
					  "DashStyle": "Solid",
					  "Width": 1.0
				   }
				]
			 },
			 "ImageType": "PNG",
			 "Width": cWidth,
			 "Height": cHeight,
			 "Culture": "en-US",
			 "ReturnPrivateNetworkURL": false
		  }
	   }
	};

	
	const opt = {
		url: requestURL,
		headers: {
			"content-type": "application/json;charset=utf-8",
			"X-Trkd-Auth-ApplicationID": global.applicationID,
			"X-Trkd-Auth-Token": global.token
		},
		body: JSON.stringify(chartMsg)
	};
	
	return pRequest.sendRequest(opt)
		.then(resp => { return resp.GetChart_Response_2.ChartImageResult.Url; });
};
	


