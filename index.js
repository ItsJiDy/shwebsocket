const Express = require('express');
const Http = require('http');
const Https = require('https');

const App = Express();
const HttpServer = Http.createServer(App);

let bans = []
let cdkeys = []
let codes = ""

App.get(
    "/script/rendertest",
    (Request, Response) => {
        Response.send("I'm Alive!")
    }
)

App.post(
    "/script/getcode",
    (Request, Response) => {
        if (Request.headers.authorization == 'elf and tears') {
            Response.send('{"code":"202","success":true,"code":"' + codes + '"}');
        } else {
            Response.send('{"code":"402","message":"Unauthorized."}');
        }
    }
)

App.post(
    "/script/hostredeemcode/:cdkey",
    (Request, Response) => {
        if (Request.headers.authorization == 'elf and tears') {
            if (Request.params.cdkey) {
                cdkeys = []
                codes = Request.params.cdkey
                Response.send('{"code":"202","success":true}');
            } else {
                Response.send('{"code":"401","message":"Please provide a valid cd key."}');
            }
        } else {
            Response.send('{"code":"402","message":"Unauthorized."}');
        }
    }
)

App.post(
    "/script/checkforredeem/:userid/:cdkey",
    (Request, Response) => {
        if (Request.headers.authorization == 'elf and tears') {
            if (Request.params.userid) {
                if (Request.params.cdkey) {
                    if (Request.params.cdkey == codes) {
                        let Exist = false
                        let Res
                        cdkeys.forEach(
                            (Child, Index) => {
                                if (Child.userid == Request.params.userid) {
                                    Exist = true
                                    Res = Child.time
                                }
                            }
                        )
                        if (Exist) {
                            Response.send('{"code":"202","success":true,"time":' + Res + '}');
                        } else {
                            Response.send('{"code":"202","success":false}');
                        }
                    } else {
                        Response.send('{"code":"202","success":false}');
                    }
                } else {
                    Response.send('{"code":"401","message":"Please provide a valid cd key."}');
                }
            } else {
                Response.send('{"code":"401","message":"Please provide a valid user."}');
            }
        } else {
            Response.send('{"code":"402","message":"Unauthorized."}');
        }
    }
)

App.post(
    "/script/redeemcode/:userid/:time/:cdkey",
    (Request, Response) => {
        if (Request.headers.authorization == 'elf and tears') {
            if (Request.params.cdkey) {
                if (Request.params.cdkey == codes) {
                    if (cdkeys.length < 6) {
                        cdkeys.push(
                            {
                                "userid": Request.params.userid,
                                "time": Request.params.time
                            }
                        )
                        Response.send('{"code":"202","success":true}');
                    } else {
                        Response.send('{"code":"202","success":false,"limited":true}');
                    }
                } else {
                    Response.send('{"code":"202","success":false,"limited":false}');
                }
            } else {
                Response.send('{"code":"401","message":"Please provide a valid cd key."}');
            }
        } else {
            Response.send('{"code":"402","message":"Unauthorized."}');
        }
    }
)

App.post(
    "/script/ban/get/:userid",
    (Request, Response) => {
        if (Request.headers.authorization == 'elf and tears') {
            if (Request.params.userid) {
                let Exist = false
                bans.forEach(
                    (Child, Index) => {
                        if (Child.userid == Request.params.userid) {
                            Exist = true
                            Response.send('{"code":"202","banned":true,"reason":"' + Child.reason + '"}');
                        }
                    }
                )
                if (!Exist) {
                    Response.send('{"code":"202","banned":false}');
                }
            } else {
                Response.send('{"code":"401","message":"Please provide a valid user."}');
            }
        } else {
            Response.send('{"code":"402","message":"Unauthorized."}');
        }
    }
)

App.post(
    "/script/ban/add/:userid/:reason",
    (Request, Response) => {
        if (Request.headers.authorization == 'elf and tears') {
            if (Request.params.userid) {
                let Exist = false
                bans.forEach(
                    (Child, Index) => {
                        if (Child.userid == Request.params.userid) {
                            Exist = true
                        }
                    }
                )
                if (Exist) {
                    Response.send('{"code":"401","message":"The user is already banned."}');
                } else {
                    bans.push(
                        {
                            "userid": Request.params.userid,
                            "reason": Request.params.reason || "Unspecified."
                        }
                    )
                    Response.send('{"code":"201","success":true}');
                }
            } else {
                Response.send('{"code":"401","message":"Please provide a valid user."}');
            }
        } else {
            Response.send('{"code":"402","message":"Unauthorized."}');
        }
    }
)

App.post(
    "/script/ban/remove/:userid",
    (Request, Response) => {
        if (Request.headers.authorization == 'elf and tears') {
            if (Request.params.userid) {
                let Success = false
                bans.forEach(
                    (Child, Index) => {
                        if (Child.userid == Request.params.userid) {
                            bans.splice(Index, 1)
                            Success = true
                        }
                    }
                )
                if (Success) {
                    Response.send('{"code":"201","success":true}');
                } else {
                    Response.send('{"code":"401","message":"Failed to find the user."}');
                }
            } else {
                Response.send('{"code":"401","message":"Please provide a valid user."}');
            }
        } else {
            Response.send('{"code":"402","message":"Unauthorized."}');
        }
    }
)

App.post(
    '/script/getchangelogs',
    (Request, Response) => {
        if (Request.headers.authorization == 'elf and tears') {
            Https.get(
                'https://raw.githubusercontent.com/ItsJiDy/shwebsocket/main/changelogs.json',
                (Res) => {
                    let Data = ''
                    Res.on(
                        'data',
                        (Chunk) => {
            	            Data += Chunk
            	        }
            	    )
            	    Res.on(
            	        'end',
            	        () => {
            	            Response.send(Data)
            	        }
            	    )
                }
            )
        } else {
            Response.send('{"code":"403","message":"Unauthorized."}');
        }
    }
)

App.post(
    '/script/checkpass/:userid/:pass',
    (Request, Response) => {
        if (Request.headers.authorization == 'elf and tears') {
            Https.get(
                'https://inventory.roblox.com/v1/users/' + Request.params.userid + '/items/GamePass/' + Request.params.pass,
                (Res) => {
                    let Data = ''
                    Res.on(
                        'data',
                        (Chunk) => {
            	            Data += Chunk
            	        }
            	    )
            	    Res.on(
            	        'end',
            	        () => {
            	            Data = JSON.parse(Data)
            	            if (Data.data.length > 0) {
            	                Response.send('{"code":"201","owned":true}')
            	            } else {
            	                Response.send('{"code":"201","owned":false}')
            	            }
            	        }
            	    )
                }
            )
        } else {
            Response.send('{"code":"403","message":"Unauthorized."}');
        }
    }
)

HttpServer.listen(
    3000,
    () => {
        console.log('Server listening on port 3000');
    }
)