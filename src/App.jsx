import React, { useState, useEffect } from 'react';
import { Loader2, Database, RefreshCw, AlertCircle, Sparkles, TrendingUp, Users, FileText, Activity, Wallet, ArrowRight, ChevronDown, Search } from 'lucide-react';

export default function HgraphMCPApp() {
  const [scrollY, setScrollY] = useState(0);
  const [accountData, setAccountData] = useState(null);
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [transactionData, setTransactionData] = useState(null);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [networkData, setNetworkData] = useState(null);
  const [networkLoading, setNetworkLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const queryAccount = async () => {
    if (!accountId.trim()) return;
    
    setAccountLoading(true);
    setAccountData(null);
    
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Get account balance, details, and creation date for Hedera account ${accountId}. Format as JSON with balance in HBAR, account ID, EVM address if available, and creation timestamp.`
        })
      });
      
      const data = await response.json();
      setAccountData(data);
    } catch (error) {
      setAccountData({ error: error.message });
    } finally {
      setAccountLoading(false);
    }
  };

  const queryTransactions = async () => {
    setTransactionLoading(true);
    setTransactionData(null);
    
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'Show the 10 most recent successful transactions on Hedera mainnet. Include transaction type, timestamp, and payer account.'
        })
      });
      
      const data = await response.json();
      setTransactionData(data);
    } catch (error) {
      setTransactionData({ error: error.message });
    } finally {
      setTransactionLoading(false);
    }
  };

  const queryNetwork = async (queryType) => {
    setNetworkLoading(true);
    setNetworkData(null);
    
    const queries = {
      price: 'What is the current HBAR price in USD?',
      stats: 'Show current Hedera network statistics including TPS and active accounts.',
      activity: 'Show recent network activity metrics for Hedera.'
    };
    
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queries[queryType] || queries.price
        })
      });
      
      const data = await response.json();
      setNetworkData(data);
    } catch (error) {
      setNetworkData({ error: error.message });
    } finally {
      setNetworkLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      
      {/* Main Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0" style={{transform: `translateY(${scrollY * 0.5}px)`}}>
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="mb-12 flex justify-center" style={{transform: `translateY(${scrollY * 0.3}px)`}}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-80 h-80 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-full flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <div className="w-72 h-72 bg-black rounded-full flex items-center justify-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-full flex items-center justify-center backdrop-blur-xl">
                    <Database className="w-32 h-32 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black text-white mb-6 tracking-tight">
            Your Hedera
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Data Companion
            </span>
          </h1>
          
          <p className="text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Query Hedera blockchain data with AI-powered natural language. Powered by Hgraph MCP.
          </p>
          
          <div className="mt-16 animate-bounce">
            <ChevronDown className="w-12 h-12 text-purple-400 mx-auto" />
          </div>
        </div>
      </section>

      {/* Data Explorer Cards */}
      <section className="relative min-h-screen flex items-center bg-black py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/3 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-3xl" style={{transform: `translateY(${scrollY * 0.15}px)`}}></div>
          <div className="absolute top-1/2 right-1/3 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl" style={{transform: `translateY(${-scrollY * 0.1}px)`}}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Account Information Card */}
            <div className="bg-black/60 backdrop-blur-xl rounded-3xl border border-orange-500/20 overflow-hidden hover:border-orange-500/40 transition-all" style={{aspectRatio: '4/5'}}>
              <div className="p-8 h-full flex flex-col">
                <div className="inline-block px-4 py-2 bg-orange-500/20 text-orange-300 text-xs font-bold rounded-full border border-orange-500/30 mb-6 self-start">
                  ACCOUNT DATA
                </div>
                
                <h3 className="text-3xl font-black text-white mb-4 leading-tight">
                  Explore Account
                  <br />
                  <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Information</span>
                </h3>
                
                <p className="text-slate-400 mb-6 text-sm">
                  Enter a Hedera account ID to view balance and details.
                </p>
                
                <div className="mb-6 relative">
                  <input
                    type="text"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && queryAccount()}
                    placeholder="0.0.123456"
                    className="w-full px-4 py-3 pr-12 bg-black/60 border border-orange-500/30 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={queryAccount}
                    disabled={accountLoading || !accountId.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-orange-400 hover:text-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {accountLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {!accountData ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <Wallet className="w-5 h-5 text-orange-400/50" />
                        <span>Account Balance</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <Users className="w-5 h-5 text-orange-400/50" />
                        <span>Account Details</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <Sparkles className="w-5 h-5 text-orange-400/50" />
                        <span>Creation Date</span>
                      </div>
                    </div>
                  ) : accountData.error ? (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                      <p className="text-red-400 text-sm">{accountData.error}</p>
                    </div>
                  ) : (
                    <div className="bg-black/40 border border-orange-500/20 rounded-xl p-4">
                      <h4 className="text-orange-400 font-semibold text-sm mb-2 flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Account Data
                      </h4>
                      <pre className="text-slate-300 text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
                        {JSON.stringify(accountData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Transaction Activity Card */}
            <div className="bg-black/60 backdrop-blur-xl rounded-3xl border border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-all" style={{aspectRatio: '4/5'}}>
              <div className="p-8 h-full flex flex-col">
                <div className="inline-block px-4 py-2 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30 mb-6 self-start">
                  TRANSACTIONS
                </div>
                
                <h3 className="text-3xl font-black text-white mb-4 leading-tight">
                  Track Transaction
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Activity</span>
                </h3>
                
                <p className="text-slate-400 mb-6 text-sm">
                  View recent transactions on Hedera network.
                </p>
                
                <button
                  onClick={queryTransactions}
                  disabled={transactionLoading}
                  className="w-full mb-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                >
                  {transactionLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Activity className="w-5 h-5" />
                      Show Recent Transactions
                    </>
                  )}
                </button>
                
                <div className="flex-1 overflow-y-auto">
                  {!transactionData ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <Activity className="w-5 h-5 text-purple-400/50" />
                        <span>Recent Transactions</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <FileText className="w-5 h-5 text-purple-400/50" />
                        <span>Transaction Types</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <RefreshCw className="w-5 h-5 text-purple-400/50" />
                        <span>Network Activity</span>
                      </div>
                    </div>
                  ) : transactionData.error ? (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                      <p className="text-red-400 text-sm">{transactionData.error}</p>
                    </div>
                  ) : (
                    <div className="bg-black/40 border border-purple-500/20 rounded-xl p-4">
                      <h4 className="text-purple-400 font-semibold text-sm mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Transaction Data
                      </h4>
                      <pre className="text-slate-300 text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
                        {JSON.stringify(transactionData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Network Performance Card */}
            <div className="bg-black/60 backdrop-blur-xl rounded-3xl border border-pink-500/20 overflow-hidden hover:border-pink-500/40 transition-all" style={{aspectRatio: '4/5'}}>
              <div className="p-8 h-full flex flex-col">
                <div className="inline-block px-4 py-2 bg-pink-500/20 text-pink-300 text-xs font-bold rounded-full border border-pink-500/30 mb-6 self-start">
                  NETWORK METRICS
                </div>
                
                <h3 className="text-3xl font-black text-white mb-4 leading-tight">
                  Monitor Network
                  <br />
                  <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">Performance</span>
                </h3>
                
                <p className="text-slate-400 mb-6 text-sm">
                  Access real-time network statistics and metrics.
                </p>
                
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => queryNetwork('price')}
                    disabled={networkLoading}
                    className="w-full px-4 py-3 bg-black/60 hover:bg-black/40 border border-pink-500/20 hover:border-pink-500/40 rounded-xl text-white transition-all disabled:opacity-50 text-left flex items-center gap-3"
                  >
                    <TrendingUp className="w-5 h-5 text-pink-400" />
                    <span className="text-sm">HBAR Price</span>
                  </button>
                  
                  <button
                    onClick={() => queryNetwork('stats')}
                    disabled={networkLoading}
                    className="w-full px-4 py-3 bg-black/60 hover:bg-black/40 border border-pink-500/20 hover:border-pink-500/40 rounded-xl text-white transition-all disabled:opacity-50 text-left flex items-center gap-3"
                  >
                    <Activity className="w-5 h-5 text-pink-400" />
                    <span className="text-sm">Network Stats</span>
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {networkLoading ? (
                    <div className="flex items-center justify-center gap-2 text-pink-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Loading...</span>
                    </div>
                  ) : !networkData ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <TrendingUp className="w-5 h-5 text-pink-400/50" />
                        <span>Network Statistics</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <Activity className="w-5 h-5 text-pink-400/50" />
                        <span>Network Activity</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <Database className="w-5 h-5 text-pink-400/50" />
                        <span>Real-time Metrics</span>
                      </div>
                    </div>
                  ) : networkData.error ? (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                      <p className="text-red-400 text-sm">{networkData.error}</p>
                    </div>
                  ) : (
                    <div className="bg-black/40 border border-pink-500/20 rounded-xl p-4">
                      <h4 className="text-pink-400 font-semibold text-sm mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Network Data
                      </h4>
                      <pre className="text-slate-300 text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
                        {JSON.stringify(networkData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}