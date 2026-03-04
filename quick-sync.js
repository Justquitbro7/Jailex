// quick-sync.js
function startJailexSync() {
    const tUser = document.getElementById('twitchInput').value;
    const kUser = document.getElementById('kickInput').value;

    if (tUser && typeof startTwitchChat === 'function') {
        startTwitchChat(tUser);
    }
    
    if (kUser && typeof startKickChat === 'function') {
        startKickChat(kUser);
    }
}
