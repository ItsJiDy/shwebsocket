const WebSocket = require('ws');

const Server = new WebSocket.Server({port:3000})

Server.on(
    'connection',
    (Client) => {
        Client.send("New Client Connects.")
        Client.on(
            'message',
            (Msg) => {
                const Message = JSON.parse(Msg)
                if (Message.Name == "Login") {
                    Server.clients.forEach(
                        (Item, Index) => {
                            Item.send("New user arrived " + Message.Value);
                        }
                    )
                } else if (Message.Name == "Send") {
                    Server.clients.forEach(
                        (Item, Index) => {
                            Item.send(Message.User + ": " + Message.Value);
                        }
                    )
                }
            }
        )
    }
)
