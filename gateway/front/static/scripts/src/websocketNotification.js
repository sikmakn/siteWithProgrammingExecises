const achievementsLink = document.getElementById('achievementsLink');

function connect() {
    const ws = new WebSocket(`ws://${window.location.hostname}:3002`);

    achievementsLink.onclick = () => ws.send('');
    ws.onmessage = (message) => {
        achievementsLink.children[0].innerText = message.data < 10 ? message.data : '9+';
        achievementsLink.children[0].style.display = 'block';
    };

    ws.onclose = () => setTimeout(connect, 1000);

    ws.onerror = () => {
        ws.close();
        setTimeout(connect, 1000);
    };
}

connect();