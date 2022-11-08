var Quests = require("../../data/quest/quest");
var Authorize = require("../../Authentication/authorize");

async function GetQuest(req, res, route){
    responseData = Quests.GetAllQuests();

    if(typeof responseData.length === undefined || typeof responseData.length === null){
        res.writeHead(500, {"Content-Type":"text/html"});
        res.write("Internal server error");
        res.end();
        return route.failRoute();
    }

    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000"
    });
    res.write(JSON.stringify(responseData));
    res.end();

    route.next();
}

module.exports = {
    url: /^\/quest$/,
    method: "GET",
    route: [
        Authorize,
        GetQuest,
    ]
}