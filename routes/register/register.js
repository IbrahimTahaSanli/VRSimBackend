var users = require("../../data/users/users");

const emailReg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

async function register(req, res, route){
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

    resp = users.AddUser(user);
    if(!resp){
        res.writeHead(403, {"Content-Type":"text/html"});
        res.write("CredentialsWrong");
        res.end();
        return route.failRoute();
    }

    
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    res.write("UserCreated");
    res.end();

    route.next();
}

module.exports = {
    url: /^\/register$/,
    method: "POST",
    route: [
        register,
    ]
}