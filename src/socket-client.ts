import { Manager, Socket } from "socket.io-client";

export type CommonListener = () => void;

export interface MessageReceivedListenerPayload {
    fullName: string; 
    message: string;
}

export type MessageReceivedListener = (payload: MessageReceivedListenerPayload) => void;

/*const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
    extraHeaders: {
        authentication: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgzYmVlMzhiLTVkYzAtNGViNC1iZjI4LTAxYjQyN2FkMTllZCIsImlhdCI6MTcxNDg3NjU0MywiZXhwIjoxNzE0ODgzNzQzfQ.2n_3O3a4vLV4A82Ni9RNq7CGCwRQ5OCyCks3cSFZ8c0'
    }
});*/

export class ManageConnection {
    constructor(
        private readonly token: string,
        private readonly nameSpace: string,
    ){}

    connectToServer() {
        const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
            extraHeaders: {
                authentication: this.token,
            }   
        });

        return manager.socket(this.nameSpace);
        //Al aplicar manager.socker('/') obtenemos nuestro socket, que es la comunicación con nuestro servidor)
    }
}

export class SocketIoConnection {
    constructor(
        private readonly socket: Socket,
    ) {}

    addListeners(
        onConnect: CommonListener, 
        onDisconnect: CommonListener, 
        onClientUpdated: CommonListener,
        onMessageReceived: MessageReceivedListener
    ) {
        this.socket.on('connect', onConnect);
        this.socket.on('disconnect', onDisconnect);
        this.socket.on('clients-updated', onClientUpdated);
        this.socket.on('message-from-server', onMessageReceived);
    }

    emitMessage (payload: string) {
        this.socket.emit('message-from-client', { id: 'YO', message: payload});
    }
}