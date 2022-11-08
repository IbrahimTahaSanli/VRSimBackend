var Tests = require("../../data/tests/tests");
var Authorize = require("../../Authentication/authorize");

const Users = require("../../data/users/users");

async function GetTestTakeByID(req, res, route){
    pathParam = route.getPathAsArray();
    if(pathParam.length != 3){
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

    responseData = Tests.GetTestByIDInAssignedStructer(id);
    if(typeof responseData === undefined || typeof responseData === null){
        res.writeHead(500, {"Content-Type":"text/html"});
        res.write("Internal server error");
        res.end();
        return route.failRoute();
    }

    
    if( !route.prop.user.AssignedTest.every(elem => elem.TestID != responseData.TestID) ){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("UserHaveBeenAssignedToTestBefore");
        res.end()
        return route.failRoute();
    }

    responseData = JSON.parse(JSON.stringify(responseData));

    if(!Users.AddAssignedTest(route.prop.user, responseData)){
        res.writeHead(500, {"Content-Type":"text/html"});
        res.write("Internal server error");
        res.end();
        return route.failRoute();
    }

    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000"
    });
    res.write("TestAssignedToUser");
    res.end();

    route.next();
}

module.exports = {
    url: /^\/test\/[0-9a-fA-F]{32}\/take$/,
    method: "GET",
    route: [
        Authorize,
        GetTestTakeByID,
    ]
}