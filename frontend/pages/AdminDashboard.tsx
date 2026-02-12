import React, { useState } from 'react';
import { User, FraudAlert, CreditRequest } from '../types';
import { DbService } from '../services/db'; // Import DbService for actions

interface AdminDashboardProps {
  users: User[];
  alerts: FraudAlert[];
  onBlockUser: (id: string) => void;
}

const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: string, color: string }) => {
  const colorMap: any = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    green: 'text-green-500 bg-green-500/10 border-green-500/20',
    yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    red: 'text-red-500 bg-red-500/10 border-red-500/20'
  };
  return (
    <div className="glass-panel p-6 rounded-2xl border-slate-200 dark:border-slate-800/50">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${colorMap[color]}`}>
        <i className={`fas ${icon} text-xl`}></i>
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-bold dark:text-white text-slate-900 mt-1">{value}</h3>
    </div>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, alerts, onBlockUser }) => {
  const [filter, setFilter] = useState<'all' | 'suspicious' | 'fraud' | 'ownership_review' | 'credits'>('all');
  const [creditRequests, setCreditRequests] = useState<CreditRequest[]>([]);

  React.useEffect(() => {
    if (filter === 'credits') {
      DbService.getCreditRequests().then(setCreditRequests);
    }
  }, [filter]);

  const handleApproveCredit = async (req: CreditRequest) => {
    if (window.confirm(`Approve ${req.amount} credits for ${req.userEmail}?`)) {
      const success = await DbService.approveCreditRequest(req.id);
      if (success) {
        setCreditRequests(prev => prev.filter(r => r.id !== req.id));
        alert("Approved successfully.");
      } else {
        alert("Failed to approve.");
      }
    }
  };

  const handleRejectCredit = async (req: CreditRequest) => {
    if (window.confirm("Reject this request?")) {
      const success = await DbService.rejectCreditRequest(req.id);
      if (success) {
        setCreditRequests(prev => prev.filter(r => r.id !== req.id));
        alert("Request rejected.");
      }
    }
  };

  const stats = {
    total: users.length,
    safe: users.filter(u => u.riskScore < 30).length,
    suspicious: users.filter(u => u.riskScore >= 30 && u.riskScore < 70).length,
    fraud: users.filter(u => u.riskScore >= 70).length,
  };

  return (
    <div className="fixed inset-0 z-[50] bg-slate-900 overflow-y-auto pb-32 pt-24 md:pt-28 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold dark:text-white text-white">Security Command Center</h2>
            <p className="text-slate-400">Real-time fraud monitoring and user management.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm hover:bg-slate-700 text-white">
              <i className="fas fa-download mr-2"></i> Export Report
            </button>
            <button className="px-4 py-2 bg-red-600 rounded-lg text-sm hover:bg-red-500 text-white font-bold" onClick={() => window.location.reload()}>
              <i className="fas fa-xmark mr-2"></i> Close
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={stats.total} icon="fa-users" color="blue" />
          <StatCard title="Safe Profiles" value={stats.safe} icon="fa-check-circle" color="green" />
          <StatCard title="Suspicious" value={stats.suspicious} icon="fa-triangle-exclamation" color="yellow" />
          <StatCard title="Fraud Threats" value={stats.fraud} icon="fa-skull-crossbones" color="red" />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`pb-4 px-4 font-bold text-sm whitespace-nowrap ${filter === 'all' || filter === 'suspicious' || filter === 'fraud' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500'}`}
          >
            User Monitoring
          </button>
          <button
            onClick={() => setFilter('credits')}
            className={`pb-4 px-4 font-bold text-sm whitespace-nowrap ${filter === 'credits' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500'}`}
          >
            Credit Requests
          </button>

        </div>

        {filter === 'credits' ? (
          <div className="glass-panel rounded-2xl overflow-hidden shadow-xl border-slate-200 dark:border-slate-800/50">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg dark:text-white text-slate-900">Pending Credit Approvals</h3>
              <button onClick={() => DbService.getCreditRequests().then(setCreditRequests)} className="text-xs text-blue-500"><i className="fas fa-sync"></i> Refresh</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-900/50 text-[10px] uppercase text-slate-500 font-bold tracking-widest border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Package</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Requested At</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                  {creditRequests.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No pending requests.</td></tr>
                  ) : creditRequests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{req.userEmail}</div>
                        <div className="text-[10px] text-slate-500">{req.userId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-blue-400">{req.packLabel}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-black text-white">{req.amount}</span> <span className="text-[10px] text-slate-500">CREDITS</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(req.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => handleApproveCredit(req)} className="px-3 py-1.5 bg-green-600/20 text-green-500 hover:bg-green-600 hover:text-white border border-green-600/50 rounded-lg text-xs font-bold uppercase transition-all">
                          Approve
                        </button>
                        <button onClick={() => handleRejectCredit(req)} className="px-3 py-1.5 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-600/50 rounded-lg text-xs font-bold uppercase transition-all">
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : filter === 'ownership_review' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Flagged Cases for Review */}
            <div className="glass-panel rounded-2xl overflow-hidden shadow-xl border-slate-200 dark:border-slate-800/50">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-lg dark:text-white text-slate-900">Pending Ownership Verification</h3>
                <span className="text-xs text-slate-500">Automated similarity flags</span>
              </div>
              <div className="p-6 space-y-4">
                {/* Mock Item 1 */}
                <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-yellow-500 text-xs font-bold uppercase tracking-wider">Similarity Flag</span>
                    <span className="text-slate-500 text-xs">Today, 10:23 AM</span>
                  </div>
                  <div className="flex gap-4 mb-4">
                    <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                      <i className="fas fa-image text-slate-600"></i>
                    </div>
                    <div>
                      <p className="text-sm dark:text-white text-slate-900 font-bold mb-1">Case #8829-A</p>
                      <p className="text-xs text-slate-400">User: user@example.com</p>
                      <p className="text-xs text-red-500 mt-1">98% match with Case #1102-B</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold uppercase">Approve</button>
                    <button className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold uppercase">Reject</button>
                  </div>
                </div>
                {/* Mock Item 2 */}
                <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-yellow-500 text-xs font-bold uppercase tracking-wider">Similarity Flag</span>
                    <span className="text-slate-500 text-xs">Yesterday, 4:15 PM</span>
                  </div>
                  <div className="flex gap-4 mb-4">
                    <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                      <i className="fas fa-video text-slate-600"></i>
                    </div>
                    <div>
                      <p className="text-sm dark:text-white text-slate-900 font-bold mb-1">Case #9931-C</p>
                      <p className="text-xs text-slate-400">User: test@test.com</p>
                      <p className="text-xs text-red-500 mt-1">Low distance pHash match</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold uppercase">Approve</button>
                    <button className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold uppercase">Reject</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Disputes */}
            <div className="glass-panel rounded-2xl overflow-hidden shadow-xl border-slate-200 dark:border-slate-800/50">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-lg dark:text-white text-slate-900">Active Disputes</h3>
                <span className="text-xs text-slate-500">User submitted claims</span>
              </div>
              <div className="p-6 space-y-4">
                {/* Mock Dispute 1 */}
                <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-red-500 text-xs font-bold uppercase tracking-wider">Stolen Content Claim</span>
                    <span className="text-slate-500 text-xs">2 hours ago</span>
                  </div>
                  <p className="text-sm dark:text-slate-300 text-slate-700 italic mb-4">"This user (ID: 555) uploaded my personal photos without consent. I have the originals..."</p>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-black/40 p-3 rounded-lg mb-4">
                    <span className="text-xs text-slate-500">Repoter: victim@email.com</span>
                    <button className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-white">View Evidence</button>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold uppercase">Ban User & Remove</button>
                    <button className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold uppercase">Dismiss</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden shadow-xl border-slate-200 dark:border-slate-800/50">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-lg dark:text-white text-slate-900">Identity Registry</h3>
                <div className="flex gap-2 text-xs">
                  <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-full ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 dark:text-slate-400 text-slate-600'}`}>All</button>
                  <button onClick={() => setFilter('suspicious')} className={`px-3 py-1 rounded-full ${filter === 'suspicious' ? 'bg-yellow-600 text-white' : 'bg-slate-200 dark:bg-slate-800 dark:text-slate-400 text-slate-600'}`}>Suspicious</button>
                  <button onClick={() => setFilter('fraud')} className={`px-3 py-1 rounded-full ${filter === 'fraud' ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-800 dark:text-slate-400 text-slate-600'}`}>Fraud</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-900/50 text-[10px] uppercase text-slate-500 font-bold tracking-widest border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Risk Score</th>
                      <th className="px-6 py-4">Last Active</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                    {users.map(user => {
                      if (filter === 'suspicious' && user.riskScore < 30) return null;
                      if (filter === 'fraud' && user.riskScore < 70) return null;

                      return (
                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-blue-500">
                                {(user.email || user.name || "?")[0].toUpperCase()}
                              </div>
                              <div className="text-sm font-medium dark:text-slate-300 text-slate-700">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${user.riskScore < 30 ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                              user.riskScore < 70 ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                'bg-red-500/10 text-red-500 border border-red-500/20'
                              }`}>
                              {user.riskScore < 30 ? 'Safe' : user.riskScore < 70 ? 'Suspicious' : 'Blocked'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${user.riskScore < 30 ? 'bg-green-500' : user.riskScore < 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${user.riskScore}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-mono dark:text-slate-400 text-slate-600">{user.riskScore}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">
                            {new Date(user.lastLogin || user.createdAt || Date.now()).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => onBlockUser(user.id)}
                              className="text-slate-500 hover:text-red-500 transition-colors"
                            >
                              <i className="fas fa-ban"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden shadow-xl border-slate-200 dark:border-slate-800/50">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-lg dark:text-white text-slate-900">Fraud Alerts</h3>
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">LIVE</span>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-800/50 max-h-[500px] overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <i className="fas fa-shield-check text-4xl mb-3 opacity-20"></i>
                    <p className="text-sm">No active threats detected.</p>
                  </div>
                ) : (
                  alerts.map(alert => (
                    <div key={alert.id} className="p-4 hover:bg-red-500/5 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">CRITICAL</span>
                        <span className="text-[10px] text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm font-medium mb-1 dark:text-slate-300 text-slate-700">{alert.reason}</p>
                      <p className="text-[10px] text-slate-500 truncate mb-3">Target: {alert.email}</p>
                      <div className="flex gap-2">
                        <button className="flex-1 py-1.5 bg-red-600 rounded text-[10px] font-bold text-white">BLOCK IP</button>
                        <button className="flex-1 py-1.5 bg-slate-200 dark:bg-slate-800 dark:text-slate-300 text-slate-600 rounded text-[10px] font-bold">REVIEW</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};