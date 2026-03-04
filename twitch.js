function startTwitchChat(channel) {
    if (!channel) {
        if (window.logAudit) window.logAudit("Twitch Error: No channel provided.");
        return;
    }

    if (window.logAudit) window.logAudit(`Initializing Twitch WebSocket for #${channel}...`);
    const socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

    socket.onopen = () => {
        socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
        socket.send('PASS oauth:xyz'); 
        socket.send('NICK justinfan' + Math.floor(Math.random() * 99999));
        socket.send('JOIN #' + channel.toLowerCase());
        
        if (window.logAudit) window.logAudit(`SUCCESS: Twitch Uplink Connected to #${channel}`);
    };

    socket.onmessage = (event) => {
        if (event.data.includes('PING :tmi.twitch.tv')) {
            socket.send('PONG :tmi.twitch.tv');
            return;
        }
        if (event.data.includes('PRIVMSG')) {
            const userMatch = event.data.match(/:(\w+)!/);
            const user = userMatch ? userMatch[1] : "Unknown";
            const msgParts = event.data.split('PRIVMSG #' + channel.toLowerCase() + ' :');
            const message = msgParts.length > 1 ? msgParts[1].trim() : "";

            if (window.handleNewChat) window.handleNewChat(user, message, 'TWITCH');
        }
    };

    socket.onerror = (error) => {
        if (window.logAudit) window.logAudit(`TWITCH SOCKET ERROR: Connection refused.`);
    };

    socket.onclose = () => {
        if (window.logAudit) window.logAudit("Twitch Uplink Lost. Reconnecting in 5s...");
        setTimeout(() => startTwitchChat(channel), 5000);
    };
}
