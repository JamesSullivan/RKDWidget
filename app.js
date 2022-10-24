const http = require("http");
const fs = require("fs");
const url = require("url");
const authWidget = require("./lib/rkd-authenticate");
const quoteWidget = require("./lib/rkd-quote");
const chartWidget = require("./lib/rkd-chart");
const fundamentalWidget = require("./lib/rkd-finStatement");

const config = require("./config.json")
const indexFile = "index.html";
const port = config.httpPort || 3000;

const promise1 = new Promise((resolve, reject) => {
	resolve('Success!');
      });      
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')
const scheduler = new ToadScheduler()
const task = new AsyncTask(
	'simple task', 
	() => { return authWidget.authenticate(config.username, config.password, config.applicationID)
		.then(token => {
			// successful authentication, keep a global copy of appID and token
			global.applicationID = config.applicationID;
			global.token = token;
			console.log(`Received authorization token: ${token}`);
			
		})
		.catch(err => {
			console.log("Unable to get authentication token. Please check username/password in config.json");
			console.log("");
			console.log("Received error: ", err);
		});
	 }
    )
    const job = new SimpleIntervalJob({ minutes: 60, runImmediately: true }, task)
    
    scheduler.addSimpleIntervalJob(job)

// attach a binding to serve http requests
var server = http.createServer(function(req, resp) {
	var urlData = url.parse(req.url, true);
	var ric = urlData.query.ric || "6758.T";
	var lang = urlData.query.lang || "en-US";
	
	// TODO: Regenerate token if required

	// get the access URI
	if(urlData.pathname === "/api/quoteWidget")	{
		quoteWidget.getQuoteDiv(ric, lang)
			.then(quoteD => resp.end(quoteD))
			.catch(err => resp.end(`Received error: ${err}`));
	}

	else if(urlData.pathname === "/api/quoteRaw")	{
		quoteWidget.getQuoteJSON(ric, lang)
			.then(quote => {
				resp.setHeader("Content-Type", "application/json; charset=utf-8");
				resp.end(JSON.stringify(quote));
			})
			.catch(err => resp.end(`Received error: ${err}`));
	}

	else if(urlData.pathname === "/api/chartWidget")	{
		const cWidth = 400;
		const cHeight = 300;

		// get chart for last 12 months
		const dtNow = new Date();
		const endTime = dtNow.toISOString();
		dtNow.setFullYear(dtNow.getFullYear() - 1)
		const startTime = dtNow.toISOString();

		chartWidget.getChart(ric, startTime, endTime, cWidth, cHeight)
			.then(chartURL => resp.end(chartURL))
			.catch(err => {
				resp.statusCode = 404;
				resp.end(`Received error: ${err}`);
			});
	}

	else if(urlData.pathname === "/api/statementsWidget")	{
		fundamentalWidget.getStatementsDiv(ric, lang)
			.then(refD => resp.end(refD))
			.catch(err => resp.end(`Received error: ${err}`));
	}

	else if(urlData.pathname === "/api/statementsRaw")	{
		fundamentalWidget.getStatementsJSON(ric, lang)
			.then(fin => {
				resp.setHeader("Content-Type", "application/json; charset=utf-8");
				resp.end(JSON.stringify(fin));
			})
			.catch(err => resp.end(`Received error: ${err}`));
	}

	else	{
		resp.setHeader("Content-Type", "text/html; charset=utf-8");
		fs.createReadStream(indexFile).pipe(resp);
	}
});

console.log("Starting HTTP server...");
// start the http server
server.listen(port, function(){
	console.log("Node server HTTP started on: " + port);
});