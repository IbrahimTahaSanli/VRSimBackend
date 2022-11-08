var Authorize = require("../../Authentication/authorize");

const Users = require("../../data/users/users");

async function PostAnswer(req, res, route){
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

    QuestionID = pathParam[2]
    if( QuestionID === null || QuestionID === undefined  ){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    prom = await route.getBody();
    if(req.body === ""){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    answer = JSON.parse(req.body);
    if(answer === null || answer.Answer === undefined || answer.Answer === null ){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    error = Users.AnswerQuestion(route.prop.user, TestID, QuestionID, answer.Answer);

    switch(error){
        case 0:
            res.writeHead(200, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:3000"
            });
            res.write("QuestionAnswered");
            res.end();
        
            return route.next();
        case -1:
            res.writeHead( 400, {"Content-Type":"text/html"} );
            res.write("AnswerIndexWrong");
            res.end()
            return route.failRoute();
        case -2:
            res.writeHead( 400, {"Content-Type":"text/html"} );
            res.write("TestDoesntHaveThisQuestionID");
            res.end()
            return route.failRoute();
        case -3:
            res.writeHead( 400, {"Content-Type":"text/html"} );
            res.write("UserDoesntHaveThisTest");
            res.end()
            return route.failRoute();
        case -4:
            res.writeHead( 400, {"Content-Type":"text/html"} );
            res.write("TestHasBeenCompleted");
            res.end()
            return route.failRoute();
    }
}

module.exports = {
    url: /^\/answer\/[0-9a-fA-F]{32}\/[0-9a-fA-F]{64}$/,
    method: "POST",
    route: [
        Authorize,
        PostAnswer,
    ]
}