var Authorize = require("../../Authentication/authorize");

const Users = require("../../data/users/users");

async function GetAnswerFinalize(req, res, route){
    pathParam = route.getPathAsArray();
    if(pathParam.length != 3){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    TestID = pathParam[1]
    if( TestID === null || TestID === undefined  ){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    error = Users.FinalizeTest(route.prop.user, TestID);

    switch(error){
        case -1:
            res.writeHead( 500, {"Content-Type":"text/html"} );
            res.write("TestCouldntFound");
            res.end()
            return route.failRoute();
        case -2:
            res.writeHead( 400, {"Content-Type":"text/html"} );
            res.write("UserDoesntHaveThisTest");
            res.end()
            return route.failRoute();
        default:
            res.writeHead(200, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:3000"
            });
            res.write(JSON.stringify(error,null,2));
            res.end();
    
            return route.next();
    }
}

module.exports = {
    url: /^\/answer\/[0-9a-fA-F]{32}\/finalize$/,
    method: "GET",
    route: [
        Authorize,
        GetAnswerFinalize,
    ]
}