const WebSocket = require('ws');

const Server = new WebSocket.Server({port:3000})

Server.on(
    'connection',
    (Client) => {
        Client.on(
            'message',
            (Message) => {
                const Msg = JSON.parse(Message)
                if (Msg.Name == "Login") {
                    Server.clients.forEach(
                        (Item, Index) => {
                            if (Item.id == Msg.Value) {
                                Item.close()
                            }
                        }
                    )
                    Client.id = Msg.Value
                if (Msg.Name == "AddGlobalChat") {
                    Server.clients.forEach(
                        (Item, Index) => {
                            Item.send('{"Name":"' + Msg.Name + '","Data":' + JSON.stringify(Msg.Data) + '}')
                        }
                    )
                } else if (Msg.Name == "SendUser") {
                    Server.clients.forEach(
                        (Item, Index) => {
                            if (Item.id == Msg.To) {
                                Item.send('{"Name":"FromUser","From":"' + Client.id + '","Title":"' + Msg.Title + '","Text":"' + Msg.Text + '"}')
                            }
                        }
                    )
                } else if (Msg.Name == "SendGlobal") {
                    Server.clients.forEach(
                        (Item, Index) => {
                            Item.send('{"Name":"FromUser","From":"' + Client.id + '","Title":"' + Msg.Title + '","Text":"' + Msg.Text + '"}')
                        }
                    )
                } else if (Msg.Name == "GetAllPlayers") {
                    const Found = []
                    Server.clients.forEach(
                        (Item, Index) => {
                            Found.push(Item.id)
                        }
                    )
                    Client.send('{"Name":"' + Msg.Name + '","Data":' + JSON.stringify(Found) + '}')
                }
            }
        )
    }
)

