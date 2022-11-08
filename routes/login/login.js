var users = require("../../data/users/users");
var {AccessToken, RefreshToken} = require("../../Authentication/jsonwebtoken");


async function login(req, res, route){
    prom = await route.getBody();

    if(req.body === ""){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    user = JSON.parse(req.body);
    if(user === null){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    if(user.email === undefined || user.password === undefined){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    if(user.email === "" || user.password === ""){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }


    userData = users.GetUserByUserEmail(user.email);
    if(userData === undefined){
        res.writeHead(404, {"Content-Type":"text/html"});
        res.write("UsernotFound");
        res.end();
        return route.failRoute();
    }

    if(!(userData.password === user.password)){
        res.writeHead(403, {"Content-Type":"text/html"});
        res.write("Password wrong");
        res.end();
        return route.failRoute();
    }

    userData = JSON.parse(JSON.stringify(userData));
    delete userData.AssignedTest;
    delete userData.AssignedQuest;
    accessToken = new AccessToken(userData).toString();

    if(accessToken == undefined || accessToken ===""){
        res.writeHead(500, {"Content-Type":"text/html"});
        res.write("Internal server error");
        res.end();
        return route.failRoute();
    }
 
    refreshToken = new RefreshToken(userData).toString();

    if(refreshToken == undefined || refreshToken ===""){
        res.writeHead(500, {"Content-Type":"text/html"});
        res.write("Internal server error");
        res.end();
        return route.failRoute();
    }

    route.addToCookie("access-token", "\""+accessToken+"\";Domain=localhost");
    route.addToCookie("refresh-token", "\""+refreshToken+"\";Domain=localhost;Path=/relogin");

    console.log(accessToken);
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    res.write("Loginned");
    res.end();

    route.next();
}

module.exports = {
    url: /^\/login$/,
    method: "POST",
    route: [
        login,
    ]
}