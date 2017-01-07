 var client = require('./rpc_client');

 client.add(1000, 2, function(response){
 	console.log("1000  + 2 = " + response);
 });

 client.searchArea('15206', function(response) {
 	console.log("15206:" + response); 
 });
