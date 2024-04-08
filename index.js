const Express = require('express');
const Http = require('http');
const Https = require('https');

const App = Express();
const HttpServer = Http.createServer(App);

App.get(
    "/script/rendertest",
    (Request, Response) => {
        Response.send("I'm Alive!")
    }
)

App.post(
    '/script/getchangelogs',
    (Request, Response) => {
        if (Request.headers.authorization == 'Elf and Tears') {
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
    '/script/checkpremium/:userid',
    (Request, Response) => {
        if (Request.headers.authorization == 'Elf and Tears') {
            Https.get(
                'https://inventory.roblox.com/v1/users/' + Request.params.userid + '/items/GamePass/22739804',
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
            	                Response.send('{"code":"201","IsPremium":true}')
            	            } else {
            	                Response.send('{"code":"201","IsPremium":false}')
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