
import React, { useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Search, Trash2 } from 'lucide-react';
import { LogEntry } from '../types';

interface Props {
  logs: LogEntry[];
}

const LiveTerminal: React.FC<Props> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto">
      <div className="bg-black border border-gray-800 rounded-t-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="h-4 w-[1px] bg-gray-800"></div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
            <TerminalIcon size={14} />
            pino-console-output
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 text-gray-600" size={14} />
            <input 
              type="text" 
              placeholder="Filter logs..." 
              className="bg-gray-900 border border-gray-800 rounded-md py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-black border-x border-b border-gray-800 p-6 font-mono text-sm overflow-auto scrollbar-thin scrollbar-thumb-gray-800">
        <div className="space-y-1.5">
          <p className="text-gray-600 mb-4 font-bold text-xs uppercase tracking-widest border-b border-gray-900 pb-2">
            [ System Startup ] - {new Date().toLocaleDateString()}
          </p>
          
          {[...logs].reverse().map((log) => (
            <div key={log.id} className="group flex gap-3 leading-relaxed">
              <span className="text-gray-600 shrink-0 select-none">[{log.timestamp}]</span>
              <span className={`shrink-0 font-bold ${
                log.level === 'success' ? 'text-green-500' : 
                log.level === 'error' ? 'text-red-500' : 
                log.level === 'warn' ? 'text-yellow-500' : 'text-blue-400'
              }`}>
                {log.level.toUpperCase()}
              </span>
              <span className="text-gray-300">{log.message}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      
      <div className="bg-gray-900 border-x border-b border-gray-800 rounded-b-2xl p-3 flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span>Connected: ws://localhost:3000</span>
          <span>Encoding: utf-8</span>
        </div>
        <span className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          System Live
        </span>
      </div>
    </div>
  );
};

export default LiveTerminal;
