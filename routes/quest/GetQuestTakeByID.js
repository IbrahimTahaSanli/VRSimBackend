var Quests = require("../../data/quest/quest");
var Authorize = require("../../Authentication/authorize");

const Users = require("../../data/users/users");

async function GetQuestTakeByID(req, res, route){
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

    responseData = Quests.GetQuestByIDInAssignedStructer(id);
    if(typeof responseData === undefined || typeof responseData === null){
        res.writeHead(500, {"Content-Type":"text/html"});
        res.write("Internal server error");
        res.end();
        return route.failRoute();
    }

    if(route.prop.user.AssignedTest.find(elem => elem.RelaventQuest === responseData.QuestID) === undefined){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("UserHaventCompletedRelevantTest");
        res.end()
        return route.failRoute();
    }


    
    if(!route.prop.user.AssignedQuest.every(elem => elem.QuestID != responseData.QuestID) ){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("UserHaveBeenAssignedToQuestBefore");
        res.end()
        return route.failRoute();
    }

    responseData = JSON.parse(JSON.stringify(responseData));

    if(!Users.AddAssignedQuest(route.prop.user, responseData)){
        res.writeHead(500, {"Content-Type":"text/html"});
        res.write("Internal server error");
        res.end();
        return route.failRoute();
    }

    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000"
    });
    res.write("QuestAssignedToUser");
    res.end();

    route.next();
}

module.exports = {
    url: /^\/quest\/[0-9a-fA-F]{32}\/take$/,
    method: "GET",
    route: [
        Authorize,
        GetQuestTakeByID,
    ]
}