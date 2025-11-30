// api/query.js - Direct Hgraph API Integration
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, queryType, accountId } = req.body;

    const HGRAPH_API = 'https://mainnet.hedera.api.hgraph.io/v1/graphql';
    const HGRAPH_KEY = 'pk_prod_138b03d98573dd8992cc9af61c748f56e329b09a';

    let graphqlQuery = '';
    let variables = {};

    // Determine which query to run based on queryType
    if (queryType === 'account') {
      // Account query
      const accountNum = parseInt(accountId.replace('0.0.', ''));
      graphqlQuery = `
        query GetAccount($accountNum: bigint!) {
          entity(where: {num: {_eq: $accountNum}, type: {_eq: "ACCOUNT"}}, limit: 1) {
            num
            balance
            evm_address
            created_timestamp
          }
        }
      `;
      variables = { accountNum };
    } else if (queryType === 'transactions') {
      // Recent transactions query
      graphqlQuery = `
        query GetRecentTransactions {
          transaction(
            order_by: [{consensus_timestamp: desc}]
            limit: 10
          ) {
            consensus_timestamp
            type
            result
            payer_account_id
            charged_tx_fee
          }
        }
      `;
    } else if (queryType === 'price') {
      // HBAR price query
      graphqlQuery = `
        query GetHBARPrice {
          ecosystem_metric(
            where: {name: {_eq: "avg_usd_conversion"}, period: {_eq: "minute"}}
            order_by: [{end_date: desc_nulls_last}]
            limit: 1
          ) {
            total
            end_date
          }
        }
      `;
    } else if (queryType === 'stats') {
      // Network stats query
      graphqlQuery = `
        query GetNetworkStats {
          tps: ecosystem_metric(
            where: {name: {_eq: "network_tps"}, period: {_eq: "hour"}}
            order_by: [{end_date: desc_nulls_last}]
            limit: 1
          ) {
            total
            end_date
          }
          activeAccounts: ecosystem_metric(
            where: {name: {_eq: "active_accounts"}, period: {_eq: "day"}}
            order_by: [{end_date: desc_nulls_last}]
            limit: 1
          ) {
            total
            end_date
          }
        }
      `;
    }

    // Make GraphQL request to Hgraph
    const response = await fetch(HGRAPH_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': HGRAPH_KEY
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: variables
      })
    });

    const result = await response.json();

    if (result.errors) {
      return res.status(500).json({ error: result.errors[0].message });
    }

    // Format the response based on query type
    let formattedData = {};

    if (queryType === 'account' && result.data.entity && result.data.entity.length > 0) {
      const account = result.data.entity[0];
      formattedData = {
        accountId: `0.0.${account.num}`,
        balance: (account.balance / 100000000).toFixed(2) + ' HBAR',
        balanceRaw: account.balance,
        evmAddress: account.evm_address || 'N/A',
        createdAt: new Date(account.created_timestamp / 1000000).toISOString()
      };
    } else if (queryType === 'transactions' && result.data.transaction) {
      formattedData = {
        transactions: result.data.transaction.map(tx => ({
          timestamp: new Date(tx.consensus_timestamp / 1000000).toISOString(),
          type: tx.type,
          result: tx.result,
          payerAccount: `0.0.${tx.payer_account_id}`,
          fee: (tx.charged_tx_fee / 100000000).toFixed(8) + ' HBAR'
        }))
      };
    } else if (queryType === 'price' && result.data.ecosystem_metric && result.data.ecosystem_metric.length > 0) {
      const priceData = result.data.ecosystem_metric[0];
      formattedData = {
        hbarPrice: '$' + (priceData.total / 100000).toFixed(5),
        timestamp: priceData.end_date
      };
    } else if (queryType === 'stats' && result.data) {
      formattedData = {
        tps: result.data.tps && result.data.tps.length > 0 ? result.data.tps[0].total : 'N/A',
        activeAccounts: result.data.activeAccounts && result.data.activeAccounts.length > 0 ? result.data.activeAccounts[0].total : 'N/A',
        lastUpdated: result.data.tps && result.data.tps.length > 0 ? result.data.tps[0].end_date : 'N/A'
      };
    }

    res.status(200).json({
      data: formattedData,
      rawData: result.data,
      source: 'Hgraph GraphQL API'
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}