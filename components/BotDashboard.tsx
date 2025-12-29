
import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  PhoneIncoming,
  ShieldCheck,
  TrendingUp,
  Activity,
  AlertCircle
} from 'lucide-react';
import { OTPDocument } from '../types';

interface Props {
  otps: OTPDocument[];
}

const BotDashboard: React.FC<Props> = ({ otps }) => {
  const sentCount = otps.filter(o => o.status === 'sent').length;
  const pendingCount = otps.filter(o => o.status === 'pending').length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <Send size={24} />
            </div>
            <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md flex items-center gap-1">
              <TrendingUp size={12} />
              {sentCount > 0 ? 'Active' : 'Idle'}
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total OTPs Sent</h3>
          <p className="text-3xl font-extrabold text-white">{sentCount}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
              <Clock size={24} />
            </div>
            <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md">
              Queued
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Pending Requests</h3>
          <p className="text-3xl font-extrabold text-white">{pendingCount}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
              <ShieldCheck size={24} />
            </div>
            <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md">
              99.9% Up
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Success Rate</h3>
          <p className="text-3xl font-extrabold text-white">{otps.length > 0 ? '100%' : '0%'}</p>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-green-500" size={20} />
            <h3 className="font-bold text-lg">Real-time OTP Feed</h3>
          </div>
          <p className="text-xs text-gray-500 font-mono italic">Collection: otp_auth</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-950/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">User ID (Phone)</th>
                <th className="px-6 py-4">OTP Code</th>
                <th className="px-6 py-4">Time Detected</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {otps.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 bg-gray-950 rounded-full border border-gray-800">
                        <AlertCircle size={32} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-gray-400 font-semibold italic">No active requests found in Firestore.</p>
                        <p className="text-xs text-gray-600">Start the bot and simulate a request to see live data.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                otps.map((otp, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <PhoneIncoming size={14} className="text-gray-500" />
                        <span className="font-mono text-gray-300">+{otp.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-800 text-green-400 px-2 py-1 rounded font-bold font-mono border border-green-900/30">
                        {otp.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(otp.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4">
                      {otp.status === 'sent' ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full w-fit">
                          <CheckCircle2 size={12} />
                          Delivered
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-full w-fit animate-pulse">
                          <Clock size={12} />
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BotDashboard;
