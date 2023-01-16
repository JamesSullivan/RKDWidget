const request = require("request");


// wrap the requests module in a promise
exports.sendRequest = (httpOptions) => {
	return new Promise((resolve, reject) => {
		request.post(httpOptions, function(error, response, body) {
			if(!error && response.statusCode == 200)
				resolve(JSON.parse(body));
			else	{
				if(error)
					reject(error);
				else if(body)
					reject(body);
				else
					reject(`Request failed, status code: ${response.statusCode} - ${response.statusMessage}`);
			}
		});
	});
};

