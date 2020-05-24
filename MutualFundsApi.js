const request = require('request');
var myUtilities = {
	CallApi : function(url){
		return HitApi(url);
	},
	SearchQueryFormer : function(searchTerm){
		return "https://api.mfapi.in/mf/search?q=".concat(searchTerm.replace(" ","%20"));
	},
	GetMFUrl : function(code){
		return "https://api.mfapi.in/mf/".concat(code);
	}
}

function HitApi(url){
	var requestPromise = new Promise(function(resolve, reject) { 
	    request.get(url, function(err, resp, body) { 
	        if (err) { 
	            reject(err); 
	        } else { 
	            resolve(JSON.parse(body)); 
	        } 
	    }) 
	});
	return requestPromise;
}




console.log("-------------------------------------------------");
var searchTerm = process.argv[2];
//console.log("Search Term = ", searchTerm);

searchUrl = myUtilities.SearchQueryFormer(searchTerm);
//console.log("SearchUrl = ", searchUrl);

searchUrlResponse = myUtilities.CallApi(searchUrl).then(body => {
		body.forEach((item,index) => {
			var schemeUrl = myUtilities.GetMFUrl(item.schemeCode);
			myUtilities.CallApi(schemeUrl).then(body => {
				console.log(item.schemeName);
				console.log("Last Known NAV on ",body.data[0].date, " was ", body.data[0].nav);
				console.log("");	//For New Line
			}).catch(() => console.log("Failed"));
		})
	}
)
.catch(() => {
	console.log("Something went wrong");
});