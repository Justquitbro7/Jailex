<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JAILEX STUDIOS - Main Control Hub</title>
    <style>
        /* JAILEX STUDIOS MAIN HUB - PC DESKTOP VERSION */
        :root {
            --bg-dark: #05070a;
            --panel-bg: #10141b;
            --accent-blue: #00d2ff;
            --accent-green: #00ff88;
            --text-main: #e0e6ed;
            --border-color: #1f2937;
        }

        body {
            background-color: var(--bg-dark);
            color: var(--text-main);
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            display: flex;
            height: 100vh;
            overflow: hidden;
        }

        /* Sidebar Navigation */
        nav {
            width: 80px;
            background: #000;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 20px;
            border-right: 1px solid var(--border-color);
        }

        .nav-icon {
            width: 40px;
            height: 40px;
            background: var(--panel-bg);
            border-radius: 8px;
            margin-bottom: 20px;
            cursor: pointer;
            border: 1px solid var(--border-color);
        }

        /* Main Content Area */
        main {
            flex-grow: 1;
            padding: 30px;
            display: grid;
            grid-template-columns: 2fr 1fr;
            grid-gap: 20px;
        }

        .panel {
            background: var(--panel-bg);
            border-radius: 12px;
            border: 1px solid var(--border-color);
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        h1, h2 {
            margin-top: 0;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--accent-blue);
        }

        /* Console Status Indicators */
        .status-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .status-badge {
            background: rgba(0,0,0,0.3);
            padding: 10px 20px;
            border-radius: 6px;
            border: 1px solid var(--border-color);
            text-align: center;
            min-width: 100px;
        }

        .indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
            background: #444;
        }

        .online { background: var(--accent-green); box-shadow: 0 0 10px var(--accent-green); }

        /* Control Buttons */
        .btn {
            background: var(--accent-blue);
            color: #000;
            border: none;
            padding: 15px 25px;
            border-radius: 6px;
            font-weight: bold;
            text-transform: uppercase;
            cursor: pointer;
            transition: 0.2s;
            width: 100%;
            margin-bottom: 10px;
        }

        .btn:hover {
            filter: brightness(1.2);
            transform: translateY(-2px);
        }

        /* Log / Console Output */
        #console-log {
            background: #000;
            height: 300px;
            border-radius: 8px;
            padding: 15px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.9rem;
            color: var(--accent-green);
            overflow-y: auto;
            border: 1px solid #333;
        }
    </style>
</head>
<body>

    <nav>
        <div class="nav-icon" title="Dashboard"></div>
        <div class="nav-icon" title="Settings"></div>
        <div class="nav-icon" title="Overlay"></div>
    </nav>

    <main>
        <section>
            <div class="panel">
                <h1>JAILEX STUDIOS HUB</h1>
                <p>Welcome back, <strong>justquitbro7</strong>. System status is nominal.</p>
                
                <div class="status-row">
                    <div class="status-badge">
                        <span id="twitch-ind" class="indicator"></span> TWITCH
                    </div>
                    <div class="status-badge">
                        <span id="kick-ind" class="indicator"></span> KICK
                    </div>
                    <div class="status-badge">
                        <span id="api-ind" class="indicator"></span> API
                    </div>
                </div>

                <h2>Console Log</h2>
                <div id="console-log">
                    [SYSTEM] Jailex Main Hub Initializing...<br>
                    [SYSTEM] Checking API connectivity...<br>
                </div>
            </div>
        </section>

        <section>
            <div class="panel">
                <h2>Quick Actions</h2>
                <button class="btn" onclick="testSystem()">Test Main API</button>
                <button class="btn" onclick="testTTS()">Test Voice (TTS)</button>
                <a href="/overlay" target="_blank" style="text-decoration: none;">
                    <button class="btn" style="background: #58a6ff;">Launch Overlay</button>
                </a>

                <div style="margin-top: 30px;">
                    <h3>Stream Config</h3>
                    <p style="font-size: 0.8rem; color: #8b949e;">
                        Platform: Xbox Console<br>
                        Software: Lightstream<br>
                        Audio: Browser TTS Enabled
                    </p>
                </div>
            </div>
        </section>
    </main>

    <script>
        const log = document.getElementById('console-log');
        
        function writeToLog(msg) {
            const time = new Date().toLocaleTimeString();
            log.innerHTML += `[${time}] ${msg}<br>`;
            log.scrollTop = log.scrollHeight;
        }

        async function testSystem() {
            writeToLog("Pinging API services...");
            try {
                const res = await fetch('/api');
                const data = await res.json();
                if(data.status === "online") {
                    document.getElementById('api-ind').className = "indicator online";
                    writeToLog("API Status: ONLINE");
                }
            } catch (err) {
                writeToLog("API Status: OFFLINE - Check Vercel deployment.");
            }
        }

        async function testTTS() {
            writeToLog("Testing Voice Output...");
            try {
                const res = await fetch('/api/tts?text=System+check+successful.+Jailex+is+operational.');
                const data = await res.json();
                
                const utterance = new SpeechSynthesisUtterance(data.message);
                window.speechSynthesis.speak(utterance);
                writeToLog("TTS Request Sent: 'System check successful.'");
            } catch (err) {
                writeToLog("TTS Error: Could not trigger voice.");
            }
        }

        // Run connectivity check on startup
        testSystem();
    </script>
</body>
</html>
