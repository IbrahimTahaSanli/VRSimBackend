var http = require("http");
const { timeStamp } = require("console");

module.exports = class Nhttp{
    constructor(route, port, timeoutMS, opts = {DomainName:"localhost"}){
        this.route = route;
        this.port = port;
        this.requestListener = null;
        this.logs = new Array();
        this.TIMEOUT_SEC = timeoutMS
        this.opts = opts;

    }

    startServer() {
        this.requestListener = http.createServer(
            function (req, res){
                this.logs.push({datetime: timeStamp() , req: {...req}});
                console.log( req.url + " - " + req.method + " - ");

                let isRouted = this.route.find(elem => {
                    if(elem.method === req.method)
                        if(req.url.search(elem.url) === 0)
                            return (new RouteStack(req, res, elem, this.TIMEOUT_SEC, this.opts)).next();
                        
                    return false;
                });
        
                if(isRouted === undefined){
                    res.statusCode = 404;
                    Object.keys(this.opts.PreSetHeaders).forEach((e)=>
                        {
                            res.setHeader(e, this.opts.PreSetHeaders[e]);
                        }
                    )
                    res.end();
                }
            }.bind(this)
        );
        this.requestListener.listen(this.port);
    }

}

class RouteStack{
    constructor(req, res, route, timeout, opts){
        this.route = {...route};
        this.req = req;
        this.res = res;

        this.currentIndex = -1;

        this.prevProps = {};
        this.nextProps = {};
        this.prop = {};

        this.opts = opts;

        if(this.opts !== undefined && this.opts !== null){
            if(this.opts.PreSetHeaders !== undefined && this.opts.PreSetHeaders !== null){
                Object.keys(this.opts.PreSetHeaders).forEach((e)=>
                    {
                        this.res.setHeader(e, this.opts.PreSetHeaders[e]);
                    }
                )
            }
        }

        this.timeout = setTimeout(
            ()=>
            {
                res.writeHead(503, {"Content-Type":"text/html"});
                res.write("Server response timeouted.");
                res.end();
            }
            ,timeout);
        
        this.currentFunc = null;
        this.req.cookies = this.parseCookie();
        
    }

    async next(){
        this.currentIndex += 1;
        if(this.route.route.length === this.currentIndex)
            return clearTimeout(this.timeout);
        this.prevProps = this.nextProps;
        delete this.nextProps;
        this.nextProps = {};
        try{
            this.currentFunc = this.route.route[this.currentIndex](this.req, this.res, this);
        }
        catch(err){
            console.log("Nhttp.js:70 => " + err);
        }
        
    }

    failRoute(){
        if(this.timeout)
            clearTimeout(this.timeout);
        
        delete this.route;
        delete this.req;
        delete this.res;
        delete this.currentIndex;
        delete this.prevProps;
        delete this.nextProps;
        delete this.prop;
    }

    getBody(){
        return new Promise((resolve, reject)=>{
        let body = []
        this.req.on('data', (chunk) => {
            body.push(chunk);
          }).on('end', () => {
            body = Buffer.concat(body).toString();
            this.req.body = body;
            resolve(this.req.body);
        })
        });
    }

    parseCookie(){
        let text = this.req.headers.cookie;
        let retVal = {};
    
        if(text != undefined)
        text.split(";").forEach(elem=>{
            let str = elem.split('=')
            retVal[str[0].replace("-", "_").replace(" ", "")] = str.splice(1).join("=");
        });
    
        return retVal;
    }

    addToCookie(key, value){
        if(this.res.getHeader('Set-Cookie') == undefined)
            this.res.setHeader("Set-Cookie", [key+"="+value+";Domain=" + this.opts.DomainName ] );
        else{
            let l = [...this.res.getHeader('Set-Cookie')]
            l.push(key+"="+value+";Domain=" + this.opts.DomainName)
            this.res.setHeader("Set-Cookie", l );
        }
    }

    getPathAsArray(){
        return this.req.url.split("/").slice(1)
    }
}