var Authorize = require("../../Authentication/authorize");

const Users = require("../../data/users/users");

async function GetQuestFinalize(req, res, route){
    pathParam = route.getPathAsArray();
    if(pathParam.length != 3){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    QuestID = pathParam[1]
    if( QuestID === null || QuestID === undefined  ){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    await route.getBody();
    if(req.body === ""){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }
    
    questScore = JSON.parse(req.body);
    if(questScore === null || questScore.Score === undefined || questScore.Score === null ){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    error = Users.FinalizeQuest(route.prop.user, QuestID, questScore.Score);

    switch(error){
        case -1:
            res.writeHead( 500, {"Content-Type":"text/html"} );
            res.write("QuestCouldntFound");
            res.end()
            return route.failRoute();
        case -2:
            res.writeHead( 400, {"Content-Type":"text/html"} );
            res.write("UserDoesntHaveThisQuest");
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
    url: /^\/quest\/[0-9a-fA-F]{32}\/finalize$/,
    method: "GET",
    route: [
        Authorize,
        GetQuestFinalize,
    ]
}