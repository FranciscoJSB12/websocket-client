import { Manager } from "socket.io-client"

export const connectToServer = () => {
    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
        extraHeaders: {
            authentication: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgzYmVlMzhiLTVkYzAtNGViNC1iZjI4LTAxYjQyN2FkMTllZCIsImlhdCI6MTcxNDc3MzExOCwiZXhwIjoxNzE0NzgwMzE4fQ.AEUV-d_ncBFor77KsDDzqgIQG3k0LuZQNwbBhcaBHI0'
        }
    });

    const socket = manager.socket('/');

    return socket;
}