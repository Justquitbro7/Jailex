// JAILEX SIGNAL BRIDGE v1.1.1
window.addMessageToOverlay = function(user, msg, platform) {
    console.log(`[SIGNAL] ${platform}: ${user} - ${msg}`);
    
    // 1. Update the Dashboard Preview
    const preview = document.getElementById('chat-preview');
    if (preview) {
        const color = platform === 'TWITCH' ? '#9146FF' : '#53FC18';
        preview.innerHTML = `<span style="color:${color}">${platform} | ${user}:</span> ${msg}`;
    }

    // 2. Send to Overlay Window (Crucial Fix)
    // This looks for any open window (like your OBS source) and sends the data
    const overlayFrame = document.getElementById('overlayFrame');
    if (overlayFrame && overlayFrame.contentWindow) {
        overlayFrame.contentWindow.postMessage({
            type: 'CHAT_MSG',
            user: user,
            msg: msg,
            platform: platform
        }, '*');
    }
};

// This ensures the Audio Engine still works alongside the overlay
function speakMessage(msg, user = "") {
    if (!window.speechSynthesis) return;
    const voiceMsg = new SpeechSynthesisUtterance(user ? `${user} says ${msg}` : msg);
    const vol = document.getElementById('volSlider')?.value || 1;
    voiceMsg.volume = vol;
    window.speechSynthesis.speak(voiceMsg);
}
