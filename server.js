const WebSocket = require('ws');

const Server = new WebSocket.Server({port:3000})

const Clients = []
const GlobalChats = []

Server.on(
    'connection',
    (Client) => {
        Client.on(
            'message',
            (Message) => {
                const Msg = JSON.parse(Message)
                if (Msg.Name == "Login") {
                    Clients[Msg.Value] = Client
                } else if (Msg.Name == "AddGlobalChat") {
                    if (GlobalChats.length > 29) {
                        GlobalChats.splice(0, 1)
                    }
                    GlobalChats.push(Msg.Value)
                } else if (Msg.Name == "GetGlobalChatData") {
                    Client.send(JSON.stringify(GlobalChats))
                } else if (Msg.Name == "Send") {
                    if (Msg.Value.Type == "User") {
                        if (Clients[Msg.Value.Name] != undefined) {
                            Clients[Msg.Value.Name].send(Msg.Value.Data)
                        }
                    } else if (Msg.Value.Type == "Global") {
                        for (const Index in Clients) {
                            Clients[Index].send(Msg.Value.Data);
                        }
                    }
                }
            }
        )
    }
)
