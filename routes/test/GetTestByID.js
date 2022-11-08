var Tests = require("../../data/tests/tests");
var Authorize = require("../../Authentication/authorize");

async function GetTestByID(req, res, route){
    pathParam = route.getPathAsArray();
    if(pathParam.length != 2){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    id = pathParam[1]
    if( id === null || id === undefined  ){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    responseData = Tests.GetTestByID(id);

    if(typeof responseData.length === undefined || typeof responseData.length === null){
        res.writeHead(500, {"Content-Type":"text/html"});
        res.write("Internal server error");
        res.end();
        return route.failRoute();
    }

    responseData = JSON.parse(JSON.stringify(responseData));
    
    delete responseData.Questions;

    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000"
    });
    res.write(JSON.stringify(responseData));
    res.end();

    route.next();
}

module.exports = {
    url: /^\/test\/[0-9a-fA-F]{32}$/,
    method: "GET",
    route: [
        Authorize,
        GetTestByID,
    ]
}