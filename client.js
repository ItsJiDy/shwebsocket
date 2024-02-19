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
                    Client.id = Message.Value
                    Server.clients.forEach(
                        (Item, Index) => {
                            Item.send("New user arrived " + Message.Value);
                        }
                    )
                } else if (Message.Name == "SendUser") {
                    Server.clients.forEach(
                        (Item, Index) => {
                            if (Item.id == Message.To) {
                                Item.send(Message.From + ": " + Message.Text);
                            }
                        }
                    )
                } else if (Message.Name == "SendGlobal") {
                    Server.clients.forEach(
                        (Item, Index) => {
                            Item.send(Message.From + ": " + Message.Text);
                        }
                    )
                }
            }
        )
    }
)
