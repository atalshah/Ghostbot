
import React, { useState } from 'react';
import { Copy, Check, FileCode, FileJson } from 'lucide-react';

const CodeViewer: React.FC = () => {
  const [copied, setCopied] = useState<'index' | 'package' | null>(null);
  const [activeFile, setActiveFile] = useState<'index' | 'package'>('index');

  const indexJsCode = `/**
 * Expert Node.js Developer - WhatsApp OTP Bot
 * Library: @whiskeysockets/baileys
 * Database: Firebase Admin Firestore
 */

const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    delay 
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const admin = require("firebase-admin");
const express = require("express");
const readline = require("readline");

// 1. Firebase Initialization
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// 2. Logger Setup
const logger = pino({ level: 'silent' });

// 3. Keep Alive Server
const app = express();
app.get("/", (req, res) => res.send("Bot is active and running 24/7."));
app.listen(3000, () => console.log("Health check server active on port 3000"));

// 4. Terminal Interface for Startup
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_session');
    const { version } = await fetchLatestBaileysVersion();

    console.log("-----------------------------------------");
    console.log("🎰 NEON ELITE CASINO - WHATSAPP OTP BOT 🎰");
    console.log("-----------------------------------------");

    let choice = "";
    if (!state.creds.registered) {
        choice = await question("Choose connection method: 1 for QR, 2 for Pairing Code: ");
    }

    const sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: choice === "1",
        auth: state,
        browser: ["Neon Elite Bot", "Chrome", "1.0.0"]
    });

    if (choice === "2" && !sock.authState.creds.registered) {
        const phoneNumber = await question("Enter your WhatsApp number (e.g., 923xxxxxxxx): ");
        const code = await sock.requestPairingCode(phoneNumber);
        console.log(\`🔑 Your Pairing Code: \${code}\`);
    }

    // WhatsApp Event Listeners
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed. Reconnecting...', shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('✅ WhatsApp Connected Successfully!');
            startMonitoringFirestore(sock);
        }
    });
}

function startMonitoringFirestore(sock) {
    console.log("📡 Listening to Firestore collection: 'otp_auth'...");
    
    db.collection("otp_auth")
        .where("status", "==", "pending")
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                if (change.type === "added" || change.type === "modified") {
                    const data = change.doc.data();
                    const docId = change.doc.id; // User's phone number
                    const code = data.code;

                    if (data.status === "pending") {
                        try {
                            const jid = \`\${docId}@s.whatsapp.net\`;
                            const message = 
\`🎰 *NEON ELITE CASINO* 🎰

Welcome! Your VIP Verification Code is: 🔑 *\${code}*

Please enter this code in the app to claim your Rs. 177 Signup Bonus. 
_Do not share this code with anyone._\`;

                            await sock.sendMessage(jid, { text: message });
                            
                            // Update Firestore status
                            await db.collection("otp_auth").doc(docId).update({
                                status: "sent",
                                sentAt: admin.firestore.FieldValue.serverTimestamp()
                            });

                            console.log(\`🚀 OTP sent successfully to \${docId}\`);
                        } catch (error) {
                            console.error(\`❌ Error sending to \${docId}:\`, error.message);
                        }
                    }
                }
            });
        });
}

startBot();`;

  const packageJsonCode = `{
  "name": "neon-elite-otp-bot",
  "version": "1.0.0",
  "description": "WhatsApp OTP Automation for Casino Application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "@whiskeysockets/baileys": "^6.6.0",
    "@hapi/boom": "^10.0.1",
    "firebase-admin": "^11.11.1",
    "express": "^4.18.2",
    "pino": "^8.16.2",
    "qrcode-terminal": "^0.12.0"
  },
  "author": "Expert Developer",
  "license": "ISC"
}`;

  const handleCopy = (type: 'index' | 'package') => {
    const text = type === 'index' ? indexJsCode : packageJsonCode;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveFile('index')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeFile === 'index' ? 'bg-gray-800 text-white border border-gray-700' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <FileCode size={18} />
            index.js
          </button>
          <button 
            onClick={() => setActiveFile('package')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeFile === 'package' ? 'bg-gray-800 text-white border border-gray-700' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <FileJson size={18} />
            package.json
          </button>
        </div>
        <button 
          onClick={() => handleCopy(activeFile)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-bold border border-gray-700 transition-all"
        >
          {copied === activeFile ? (
            <><Check size={18} className="text-green-500" /> Copied!</>
          ) : (
            <><Copy size={18} /> Copy Code</>
          )}
        </button>
      </div>

      <div className="relative group">
        <div className="absolute top-4 right-4 text-[10px] font-bold text-gray-700 uppercase tracking-widest pointer-events-none">
          {activeFile === 'index' ? 'JavaScript / Baileys SDK' : 'JSON / NPM Config'}
        </div>
        <pre className="bg-gray-950 border border-gray-800 p-8 rounded-2xl overflow-x-auto text-sm font-mono leading-relaxed text-gray-300 scrollbar-thin scrollbar-thumb-gray-800">
          <code>
            {activeFile === 'index' ? indexJsCode : packageJsonCode}
          </code>
        </pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-500/5 border border-green-500/10 p-4 rounded-xl">
          <h4 className="text-green-500 font-bold text-sm mb-1 uppercase tracking-tight">Deployment Tip</h4>
          <p className="text-xs text-gray-400">Run this on Render.com or Koyeb using the included Express server to prevent idle spin-down.</p>
        </div>
        <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl">
          <h4 className="text-blue-500 font-bold text-sm mb-1 uppercase tracking-tight">Persistence</h4>
          <p className="text-xs text-gray-400">The <code>auth_session</code> folder stores your tokens. Ensure this folder is backed up or persistent.</p>
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;
