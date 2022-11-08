const {JWT} = require("../Authentication/jsonwebtoken");
const Conf = require("../conf.json");
const users = require("../data/users/users");

module.exports = async function Authorize(req, res, route){
    console.log(req.cookies);
    if(req.cookies == undefined || req.cookies == null){
        res.writeHead( 400, {"Content-Type":"text/html"} );
        res.write("Bad Request");
        res.end()
        return route.failRoute();
    }

    if(req.cookies.access_token == undefined || req.cookies.access_token == null){
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
        console.log()
        res.writeHead(301, {Location: Conf.HOSTPATH+"/relogin?"+ req.path});
        res.write("AccessToken Expired");
        res.end();
        return route.failRoute();
    }

    let user = users.GetUserByID(accessToken.id);
    if(user == undefined){
        res.writeHead( 404, {"Content-Type":"text/html"} );
        res.write("User Not Found");
        res.end()
        return route.failRoute();
    }

    route.prop.user = user;

    route.next();
}