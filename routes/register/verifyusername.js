var users = require("../../data/users/users");

async function verifyUserName(req, res, route){
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

    if(user.username === undefined){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    if(user.username === ""){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }


    userData = users.GetUserByUserName(user.username);
    if(userData !== undefined){
        res.writeHead(409, {"Content-Type":"text/html"});
        res.write("UsernameAlreadyExists");
        res.end();
        return route.failRoute();
    }

    
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    res.write("UsernameFree");
    res.end();

    route.next();
}

module.exports = {
    url: /^\/register\/verifyusername$/,
    method: "POST",
    route: [
        verifyUserName,
    ]
}