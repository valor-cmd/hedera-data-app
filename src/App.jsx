const queryAccount = async () => {
  if (!accountId.trim()) return;
  
  setAccountLoading(true);
  setAccountData(null);
  
  try {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        queryType: 'account',
        accountId: accountId
      })
    });
    
    const result = await response.json();
    setAccountData(result);
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
        queryType: 'transactions'
      })
    });
    
    const result = await response.json();
    setTransactionData(result);
  } catch (error) {
    setTransactionData({ error: error.message });
  } finally {
    setTransactionLoading(false);
  }
};

const queryNetwork = async (type) => {
  setNetworkLoading(true);
  setNetworkData(null);
  
  try {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        queryType: type // 'price' or 'stats'
      })
    });
    
    const result = await response.json();
    setNetworkData(result);
  } catch (error) {
    setNetworkData({ error: error.message });
  } finally {
    setNetworkLoading(false);
  }
};