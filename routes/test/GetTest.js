var Tests = require("../../data/tests/tests");
var Authorize = require("../../Authentication/authorize");

async function GetTest(req, res, route){
    responseData = Tests.GetAllTests();

    if(typeof responseData.length === undefined || typeof responseData.length === null){
        res.writeHead(500, {"Content-Type":"text/html"});
        res.write("Internal server error");
        res.end();
        return route.failRoute();
    }

    responseData = JSON.parse(JSON.stringify(responseData));
    responseData.forEach(elem => {
        delete elem.RelevantQuest;
        delete elem.Questions;
        delete elem.Creator;
    });


    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000"
    });
    res.write(JSON.stringify(responseData));
    res.end();

    route.next();
}

module.exports = {
    url: /^\/test$/,
    method: "GET",
    route: [
        Authorize,
        GetTest,
    ]
}