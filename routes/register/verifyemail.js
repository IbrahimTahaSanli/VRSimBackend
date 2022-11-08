var users = require("../../data/users/users");

const emailReg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

async function verifyEmail(req, res, route){
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

    if(user.email === undefined){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    if(user.email === ""){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    if(!user.email.match(emailReg)){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    userData = users.GetUserByUserEmail(user.email);
    if(userData !== undefined){
        res.writeHead(409, {"Content-Type":"text/html"});
        res.write("EmailAlreadyExists");
        res.end();
        return route.failRoute();
    }

    
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    res.write("EmailFree");
    res.end();

    route.next();
}

module.exports = {
    url: /^\/register\/verifyemail$/,
    method: "POST",
    route: [
        verifyEmail,
    ]
}