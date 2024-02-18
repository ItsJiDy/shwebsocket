const WebSocket = require('ws');

const Server = new WebSocket.Server({port:3000})

var Clients = []
var GlobalChats = []

Server.on(
    'connection',
    (Client) => {
        Client.on(
            'message',
            (Message) => {
                const Msg = JSON.parse(Message)
                if (Msg.Name == "Login") {
                    if (Clients[Msg.Value.Name] != undefined) {
                        Clients[Msg.Value.Name].close()
                        Clients[Msg.Value.Name] = undefined
                    }
                    Clients[Msg.Value.Name] = {
                        Server: Client,
                        JobId: Msg.Value.JobId
                    }
                } else if (Msg.Name == "AddGlobalChat") {
                    if (GlobalChats.length > 29) {
                        GlobalChats.splice(0, 1)
                    }
                    GlobalChats.push(Msg.Data)
                    Client.send(JSON.stringify(GlobalChats))
                } else if (Msg.Name == "GetGlobalChatData") {
                    Client.send(JSON.stringify(GlobalChats))
                } else if (Msg.Name == "Send") {
                    if (Msg.Value.Type == "User") {
                        if (Clients[Msg.Value.Name] != undefined) {
                            Clients[Msg.Value.Name].Server.send(Msg.Value.Data)
                        }
                    } else if (Msg.Value.Type == "Global") {
                        for (const Index in Clients) {
                            if (Msg.Value != Index) {
                                Clients[Index].Server.send(Msg.Value.Data)
                            }
                        }
                    }
                } else if (Msg.Name == "CheckForPlayers") {
                    const Found = []
                    for (const Index in Clients) {
                        if (Msg.Value.Name != Index) {
                            if (Clients[Index].JobId == Msg.Value.JobId) {
                                Found.push(Index)
                            }
                        }
                    }
                    Client.send(JSON.stringify(Found))
                }
            }
        )
    }
)
