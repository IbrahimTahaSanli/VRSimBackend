const {JWT, AccessToken, RefreshToken} = require("../../Authentication/jsonwebtoken");
const users = require("../../data/users/users");

async function relogin(req, res, route){
    if(req.cookies === undefined || req.cookies === null){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }


    if(req.cookies.refresh_token === undefined || req.cookies.refresh_token === null || req.cookies.refresh_token === ""){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    refreshToken = req.cookies.refresh_token;

    if(JWT.verifyToken(refreshToken)){
        res.writeHead( 530, {"Content-Type":"text/html"} );
        res.write("Login credentials wrong");
        res.end()
        return route.failRoute();
    }

    refreshToken = JWT.tokenToObject(refreshToken);
    if(!JWT.checkExpToken(refreshToken)){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    let user = users.GetUserByID(accessToken.id);
    if(user === undefined){
        res.writeHead(404, {"Content-Type":"text/html"});
        res.write("UsernotFound");
        res.end();
        return route.failRoute();
    }


    accessToken = new AccessToken(user).toString();
    if(accessToken == undefined || accessToken ===""){
        res.writeHead(500, {"Content-Type":"text/html"});
        res.write("Internal server error");
        res.end();
        return route.failRoute();
    }
 
    refreshToken = new RefreshToken(user).toString();
    if(refreshToken == undefined || refreshToken ===""){
        res.writeHead(500, {"Content-Type":"text/html"});
        res.write("Internal server error");
        res.end();
        return route.failRoute();
    }

    route.addToCookie("access-token", "'"+accessToken+"';Domain=localhost");
    route.addToCookie("refresh-token", "'"+refreshToken+"';Domain=localhost;Path=/relogin");

    console.log(accessToken);
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000"
    });
    res.write(JSON.stringify(userData));
    res.end();

    route.next();
}

module.exports =
    {
        url: /^\/relogin$/,
        method: "GET",
        route: [
            relogin,
        ]
    }