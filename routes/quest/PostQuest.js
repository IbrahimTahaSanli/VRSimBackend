var Quests = require("../../data/quest/quest");
var Authorize = require("../../Authentication/authorize");

async function PostQuest(req, res, route){
    await route.getBody();
    
    if(req.body === ""){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    quest = JSON.parse(req.body);
    if(quest === null){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    quest.Creator = route.prop.user.id;

    suc = Quests.AddQuest(quest);
    if(!suc){
        res.writeHead(403, {"Content-Type":"text/html"});
        res.write("QuestStructerIsInvalid");
        res.end();
        return route.failRoute();
    }

    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    res.write(
        "QuestAdded"
    );
    res.end();

    route.next();
}

module.exports = {
    url: /^\/quest$/,
    method: "POST",
    route: [
        Authorize,
        PostQuest,
    ]
}