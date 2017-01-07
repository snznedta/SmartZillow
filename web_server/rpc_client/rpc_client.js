var jayson = require('jayson');

// create client connection
var client = jayson.client.http({
	hostname: 'localhost',
	port: 4040
});

// call add function to test
function add(a,b,callback) {
	client.request('add',[a,b],function(err, error, response) {
		if (err) throw err;
		console.log(response);
		callback(response);
	});
}

// search area method
function searchArea(query, callback) {
    client.request('searchArea', [query], function(err, error, response) {
        if (err) throw err;
        console.log(response);
        callback(response);
    });
}

module.exports = {
	add: add, 
	searchArea: searchArea
}