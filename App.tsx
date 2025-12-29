
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  LayoutDashboard, 
  Terminal, 
  Code2, 
  Zap, 
  Database, 
  PlusCircle,
  Play,
  Square
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import BotDashboard from './components/BotDashboard';
import LiveTerminal from './components/LiveTerminal';
import CodeViewer from './components/CodeViewer';
import { OTPDocument, LogEntry, BotStatus } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs' | 'code'>('dashboard');
  const [status, setStatus] = useState<BotStatus>(BotStatus.OFFLINE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [otps, setOtps] = useState<OTPDocument[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const aiRef = useRef<GoogleGenAI | null>(null);

  // Initialize AI once
  useEffect(() => {
    aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }, []);

  const addLog = useCallback((message: string, level: LogEntry['level'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  }, []);

  const startSystem = async () => {
    if (!aiRef.current) return;
    setIsInitializing(true);
    setStatus(BotStatus.CONNECTING);
    
    addLog("System boot sequence initiated...", "info");
    
    // Simulate complex startup logs using AI
    try {
      const response = await aiRef.current.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Generate 5 realistic technical log messages for starting a WhatsApp bot using Baileys and connecting to Firebase. Format: just the messages separated by newlines."
      });
      
      const bootLogs = response.text?.split('\n').filter(l => l.trim()) || [];
      for (const logText of bootLogs) {
        await new Promise(r => setTimeout(r, 600));
        addLog(logText, "info");
      }

      setStatus(BotStatus.CONNECTED);
      addLog("✅ NEON ELITE BOT is now ONLINE and listening for Firestore events.", "success");
    } catch (err) {
      addLog("Critical failure during initialization", "error");
      setStatus(BotStatus.OFFLINE);
    } finally {
      setIsInitializing(false);
    }
  };

  const stopSystem = () => {
    setStatus(BotStatus.OFFLINE);
    addLog("System shutdown requested...", "warn");
    addLog("Disconnected from WhatsApp and Firestore.", "info");
  };

  const simulateNewOTP = async () => {
    if (status !== BotStatus.CONNECTED) {
      addLog("Cannot process request: Bot is offline", "error");
      return;
    }

    const phone = `923${Math.floor(100000000 + Math.random() * 900000000)}`;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    const newDoc: OTPDocument = {
      id: phone,
      code,
      status: 'pending',
      timestamp: Date.now()
    };

    setOtps(prev => [newDoc, ...prev]);
    addLog(`[Firestore] New pending document detected: ${phone}`, "info");

    // Process with AI
    try {
      if (aiRef.current) {
        const aiResponse = await aiRef.current.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `A new OTP request received for ${phone} with code ${code}. 
          Generate a log-style confirmation message that the WhatsApp message has been formatted correctly for the Neon Elite Casino.`
        });
        
        addLog(`[System] ${aiResponse.text?.trim()}`, "info");
      }

      await new Promise(r => setTimeout(r, 1500));
      
      setOtps(current => 
        current.map(item => item.id === phone ? { ...item, status: 'sent' } : item)
      );
      
      addLog(`[WhatsApp] Message successfully delivered to +${phone}`, "success");
      addLog(`[Firestore] Updated status to 'sent' for doc: ${phone}`, "info");
    } catch (err) {
      addLog(`[Error] Failed to process OTP for ${phone}`, "error");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${status === BotStatus.CONNECTED ? 'bg-green-500 neon-status' : 'bg-gray-700'}`}>
              <Zap className={`text-white w-5 h-5 fill-current ${status === BotStatus.CONNECTED ? 'opacity-100' : 'opacity-30'}`} />
            </div>
            <h1 className="font-bold text-lg tracking-tight">NEON ELITE</h1>
          </div>
          <p className="text-xs text-gray-500 font-medium">WhatsApp OTP Gateway</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-green-500/10 text-green-500 font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'logs' ? 'bg-green-500/10 text-green-500 font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <Terminal size={20} />
            Live Logs
          </button>
          <button 
            onClick={() => setActiveTab('code')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'code' ? 'bg-green-500/10 text-green-500 font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <Code2 size={20} />
            Bot Source
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-950 rounded-xl p-3 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Bot Status</span>
              <span className={`w-2 h-2 rounded-full ${status === BotStatus.CONNECTED ? 'bg-green-500' : status === BotStatus.CONNECTING ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></span>
            </div>
            <p className="text-sm font-semibold">{status}</p>
          </div>
          
          <button 
            onClick={status === BotStatus.OFFLINE ? startSystem : stopSystem}
            disabled={isInitializing}
            className={`w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all ${status === BotStatus.OFFLINE ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-red-600/10 hover:bg-red-600/20 text-red-500'}`}
          >
            {status === BotStatus.OFFLINE ? <><Play size={16} /> Start Bot</> : <><Square size={16} /> Stop Bot</>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
              {activeTab === 'dashboard' ? 'Overview' : activeTab === 'logs' ? 'System Monitoring' : 'Implementation'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {status === BotStatus.CONNECTED && (
              <button 
                onClick={simulateNewOTP}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-green-900/20"
              >
                <PlusCircle size={18} />
                Simulate OTP Request
              </button>
            )}
            <div className="h-8 w-[1px] bg-gray-800 mx-2"></div>
            <div className="flex items-center gap-2 text-gray-400">
              <Database size={16} />
              <span className="text-xs font-mono">alarix-61e90</span>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-8">
          {activeTab === 'dashboard' && <BotDashboard otps={otps} />}
          {activeTab === 'logs' && <LiveTerminal logs={logs} />}
          {activeTab === 'code' && <CodeViewer />}
        </div>
      </main>
    </div>
  );
};

export default App;
