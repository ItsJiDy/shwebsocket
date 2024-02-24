const Express = require('express');
const Http = require('http');
const WebSocket = require('ws');

const App = Express();
const HttpServer = Http.createServer(App);
const Server = new WebSocket.Server({
    server: HttpServer
});
const GlobalChat = []
const ServerStatus = "Online"

App.get(
    '/script/shutdown/status',
    (Request, Response) => {
        if (Request.headers.authorization == 'Elf and Tears') {
            Response.send('{"status":"' + ServerStatus + '","code":"200","message":"OK"}');
        } else {
            Response.send('{"code":"403","message":"Unauthorized."}');
        }
    }
)

App.post(
    '/script/shutdown/set/:Item',
    (Request, Response) => {
        if (Request.headers.authorization == 'Elf and Tears') {
            if (Request.params.Item == 'Online' || Request.params.Item == 'Offline') {
                ServerStatus = Request.params.Item
                Response.send('{"code":"200","message":"OK"}');
            } else {
                Response.send('{"code":"401","message":"Status can be only set as Online or Offline."}');
            }
        } else {
            Response.send('{"code":"403","message":"Unauthorized."}');
        }
    }
)

Server.on(
    'connection',
    (Client, Request) => {
        if (Request.url == '/script/websocketserver') {
            Client.on(
                'message',
                (Message) => {
                    const Msg = JSON.parse(Message)
                    if (Msg.Name == "Login") {
                        Server.clients.forEach(
                            (Item, Index) => {
                                if (Item.id == Msg.Value && Item.readyState != 3) {
                                    Item.close()
                                }
                            }
                        )
                        Client.id = Msg.Value
                    } else if (Msg.Name == "AddGlobalChat") {
                        if (GlobalChat.length == 30) {
                            GlobalChat.splice(0, 1)
                        }
                        GlobalChat.push(Msg.Data)
                        Server.clients.forEach(
                            (Item, Index) => {
                                if (Item.readyState != 3) {
                                    Item.send('{"Name":"' + Msg.Name + '","Data":' + JSON.stringify(Msg.Data) + '}')
                                }
                            }
                        )
                    } else if (Msg.Name == "GetGlobalChatData") {
                        Client.send('{"Name":"' + Msg.Name + '","Data":' + JSON.stringify(GlobalChat) + '}')
                    } else if (Msg.Name == "SendUser") {
                        Server.clients.forEach(
                            (Item, Index) => {
                                if (Item.id == Msg.To && Item.readyState != 3) {
                                    Item.send('{"Name":"FromUser","From":"' + Client.id + '","Title":"' + Msg.Title + '","Text":"' + Msg.Text + '"}')
                                }
                            }
                        )
                    } else if (Msg.Name == "SendGlobal") {
                        Server.clients.forEach(
                            (Item, Index) => {
                                if (Item.readyState != 3) {
                                    Item.send('{"Name":"FromUser","From":"' + Client.id + '","Title":"' + Msg.Title + '","Text":"' + Msg.Text + '"}')
                                }
                            }
                        )
                    } else if (Msg.Name == "Announcement") {
                        Server.clients.forEach(
                            (Item, Index) => {
                                if (Item.readyState != 3) {
                                    Item.send('{"Name":"' + Msg.Name + '","Text":"' + Msg.Text + '"}')
                                }
                            }
                        )
                    } else if (Msg.Name == "GetAllPlayers") {
                        const Found = []
                        Server.clients.forEach(
                            (Item, Index) => {
                                if (Item.readyState != 3) {
                                    Found.push(Item.id)
                                }
                            }
                        )
                        Client.send('{"Name":"' + Msg.Name + '","Data":' + JSON.stringify(Found) + '}')
                    }
                }
            )
        } else {
            Client.terminate()
        }
    }
)

HttpServer.listen(
    3000,
    () => {
        console.log('Server listening on port 3000');
    }
)
