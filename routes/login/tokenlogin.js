const {JWT} = require("../../Authentication/jsonwebtoken");
const users = require("../../data/users/users");

async function tokenLogin(req, res, route){
    if(req.cookies === undefined || req.cookies === null){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }


    if(req.cookies.access_token === undefined || req.cookies.access_token === null || req.cookies.access_token === ""){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    accessToken = req.cookies.access_token;

    if(JWT.verifyToken(accessToken)){
        res.writeHead( 530, {"Content-Type":"text/html"} );
        res.write("Login credentials wrong");
        res.end()
        return route.failRoute();
    }

    accessToken = JWT.tokenToObject(accessToken);
    if(!JWT.checkExpToken(accessToken)){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    let user = users.GetUserByID(accessToken.id);
    if(user == undefined){
        res.writeHead( 404, {"Content-Type":"text/html"} );
        res.write("User Not Found");
        res.end()
        return route.failRoute();
    }

    user = JSON.parse(JSON.stringify(user));
    delete user.password;
    res.writeHead( 200, {"Content-Type":"application/json"} );
    res.write(JSON.stringify(user));
    res.end()

    route.next();
}

module.exports =
    {
        url: /^\/tokenlogin$/,
        method: "GET",
        route: [
            tokenLogin,
        ]
    }