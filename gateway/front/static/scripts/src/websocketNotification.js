const webSocket = new WebSocket('ws://localhost:3002');

webSocket.onmessage = (message) => console.log(message);
