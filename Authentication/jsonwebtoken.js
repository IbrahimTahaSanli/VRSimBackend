var crypto = require('crypto');

const TOKENHEADER = "{'alg': 'HS256', 'typ': 'JWT'}";

const ACCESSTOKENSTR = "AT";
const REFRESHTOKENSTR = "RT";

const {ACCESSTOKENSEC, REFRESHTOKENSEC, AUTHSECRET} = require("./JWTConfig.json");

class JWT{
    constructor(header = TOKENHEADER, opts = null){
        this.headerRaw = header;
        this.headerBase64 = Buffer.from(this.headerRaw).toString('base64');
    }

    static createHash(text){
        return crypto.createHmac('sha256', AUTHSECRET).update(text).digest('base64');
    }

    createToken(usr){ 

    }

    static verifyToken(token){
        let arr = token.split(".");

        if(arr.length != 3)
            return false;

        if(JWT.createHash(arr[0] + "." + arr[1]) === arr[2])
            return true;
        return false;
    }

    static tokenToObject(token){
        return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf-8"));
    }

    static checkExpToken(user){
        if(user.exp >= Date.now())
            return true;

        return false;
    }
}

class AccessToken extends JWT{
    constructor(body, header = TOKENHEADER,opts = null){
        super(header, opts);
        this.body = body;
    }

    toString(){
        user = {...this.body};
        delete user.email;
        delete user.phone;
        delete user.password;
    
        user.iat = Date.now();
        user.exp = Date.now() + ACCESSTOKENSEC;

        user.type = ACCESSTOKENSTR;
    
        user = Buffer.from(JSON.stringify(user)).toString('base64');
    
        let key = this.headerBase64 + "." + user;
    
        key = key + "." + JWT.createHash(key);
        
        return key;
    }
}

class RefreshToken extends JWT{
    constructor(body, header = TOKENHEADER,opts = null){
        super(header, opts)
        this.body = body;
    }

    toString(){
        user = {...this.body};
        delete user.email;
        delete user.phone;
        delete user.password;
    
        user.iat = Date.now();
        user.exp = Date.now() + REFRESHTOKENSEC;
    
        user.type = REFRESHTOKENSTR;


        user = Buffer.from(JSON.stringify(user)).toString('base64');
    
        let key = this.headerBase64 + "." + user;
    
        key = key + "." + JWT.createHash(key);
        
        return key;
    }
}

module.exports = {AccessToken, RefreshToken, JWT}