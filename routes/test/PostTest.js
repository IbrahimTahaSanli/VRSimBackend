var Tests = require("../../data/tests/tests");
var Authorize = require("../../Authentication/authorize");

async function PostTest(req, res, route){
    await route.getBody();
    
    if(req.body === ""){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    test = JSON.parse(req.body);
    if(test === null){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    test.Creator = route.prop.user.id;

    suc = Tests.AddTest(test);
    if(!suc){
        res.writeHead(403, {"Content-Type":"text/html"});
        res.write("TestStructerIsInvalid");
        res.end();
        return route.failRoute();
    }

    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    res.write(
        "TestAdded"
    );
    res.end();

    route.next();
}

module.exports = {
    url: /^\/test$/,
    method: "POST",
    route: [
        Authorize,
        PostTest,
    ]
}