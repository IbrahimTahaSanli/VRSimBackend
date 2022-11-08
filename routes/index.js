async function index(req, res, route){    
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    res.write(
        JSON.stringify(
            {
                "Name": "VRSimBackend",
                "Version": "V0.1",
                "Contact": "Ibrahim Taha SANLI",
                "ContactMail": "ibrahimtahasanli@gmail.com"
            },null, 2
            )
    );
    res.end();

    route.next();
}

module.exports = {
    url: /^\/$/,
    method: "GET",
    route: [
        index,
    ]
}