/**
 * JAILEX OFFICIAL KICK ENGINE
 * Version: Authorized & Synchronized
 */
async function startKickChat(username) {
    const token = localStorage.getItem('jailex_kick_token');
    
    if (!token) {
        if (window.logAudit) window.logAudit("KICK ERROR: Official Token missing. Click 'LINK KICK' first.");
        return;
    }

    if (window.logAudit) window.logAudit(`Authorizing Kick Uplink for @${username}...`);

    try {
        // STEP 1: Convert username to Numeric ID (The server only speaks in numbers)
        const targetUrl = `https://kick.com/api/v1/channels/${username.trim().toLowerCase()}`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(proxyUrl);
        const rawData = await response.json();
        const channelData = JSON.parse(rawData.contents);
        const chatroomId = channelData.chatroom.id;

        if (window.logAudit) window.logAudit(`ID Verified: ${chatroomId}. Engaging WebSocket...`);

        // STEP 2: Connect to Kick's WebSocket
        const socket = new WebSocket('wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=7.6.0');
        
        socket.onopen = () => {
            // STEP 3: Subscribe using the Token AND the Numeric ID
            socket.send(JSON.stringify({ 
                event: "pusher:subscribe", 
                data: { 
                    auth: token, 
                    channel: `chatrooms.${chatroomId}.v2` 
                } 
            }));
            
            // STEP 4: Keep-Alive Ping (Prevents audio from hanging/stopping)
            setInterval(() => {
                socket.send(JSON.stringify({ event: "pusher:ping", data: {} }));
            }, 20000);

            if (window.logAudit) window.logAudit(`SUCCESS: Kick Engine Fully Connected.`);
        };

        socket.onmessage = (event) => {
            const payload = JSON.parse(event.data);
            
            // Filter for Chat Messages
            if (payload.event === "App\\Events\\ChatMessageEvent") {
                const messageData = JSON.parse(payload.data);
                const user = messageData.sender.username;
                const message = messageData.content;

                // Send to the Main JAILEX App Function
                if (window.handleNewChat) {
                    window.handleNewChat(user, message, 'KICK');
                }
            }
        };

        socket.onclose = () => {
            if (window.logAudit) window.logAudit("Kick Connection lost. Auto-reconnecting...");
            setTimeout(() => startKickChat(username), 5000);
        };

        socket.onerror = (err) => {
            if (window.logAudit) window.logAudit("KICK SOCKET ERROR: Authorization failed.");
        };

    } catch (error) {
        if (window.logAudit) window.logAudit(`FATAL KICK ERROR: Could not fetch channel ID.`);
    }
}
