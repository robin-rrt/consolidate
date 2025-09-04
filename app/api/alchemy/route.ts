import { NextRequest, NextResponse } from 'next/server';
import { Alchemy, AssetTransfersCategory, Network, AssetTransfersResponse } from 'alchemy-sdk';

const NETWORKS = [
  { name: 'Ethereum', network: Network.ETH_MAINNET },
  { name: 'Base', network: Network.BASE_MAINNET },
  { name: 'Optimism', network: Network.OPT_MAINNET },
  { name: 'Polygon', network: Network.MATIC_MAINNET },
  { name: 'Arbitrum', network: Network.ARB_MAINNET },
];


export async function POST(request: NextRequest) {
  try {
    const { address, pageKey } = await request.json();

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const apiKey = process.env.ALCHEMY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Alchemy API key not configured' }, { status: 500 });
    }

    const results = await Promise.all(
      NETWORKS.map(async (networkConfig) => {
        try {
          console.log(`Fetching transfers for ${networkConfig.name}...`);
          
          // Use direct fetch instead of Alchemy SDK to avoid referrer issues
          const networkUrl = networkConfig.network === Network.ETH_MAINNET ? 'eth' : 
                           networkConfig.network === Network.BASE_MAINNET ? 'base' :
                           networkConfig.network === Network.OPT_MAINNET ? 'opt' :
                           networkConfig.network === Network.MATIC_MAINNET ? 'polygon' :
                           'arb';
          
          const response = await fetch(`https://${networkUrl}-mainnet.g.alchemy.com/v2/${apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              method: 'alchemy_getAssetTransfers',
              params: [{
                fromBlock: '0x0',
                toAddress: address,
                category: ['erc20'],
                pageKey: pageKey,
                maxCount: '0x14', // 16 in hex
              }]
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          if (data.error) {
            throw new Error(data.error.message || 'Alchemy API error');
          }

          // Filter for USDC transfers only
          const usdcTransfers = (data.result?.transfers || []).filter((transfer: AssetTransfersResponse['transfers'][number]) => {
            return transfer.asset === 'USDC';
          });

          console.log(`${networkConfig.name} USDC transfers:`, usdcTransfers.length);

          // Get block timestamps for each USDC transfer
          const transfersWithTimestamps = await Promise.all(
            usdcTransfers.map(async (transfer: AssetTransfersResponse['transfers'][number]) => {
              try {
                // Get block timestamp
                const blockResponse = await fetch(`https://${networkUrl}-mainnet.g.alchemy.com/v2/${apiKey}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'eth_getBlockByNumber',
                    params: [transfer.blockNum, false]
                  })
                });

                if (blockResponse.ok) {
                  const blockData = await blockResponse.json();
                  if (blockData.result) {
                    return {
                      ...transfer,
                      timestamp: parseInt(blockData.result.timestamp, 16) * 1000 // Convert to milliseconds
                    };
                  }
                }
                
                // Fallback: use current time if block timestamp not available
                return {
                  ...transfer,
                  timestamp: Date.now()
                };
              } catch (err) {
                // Fallback: use current time if block timestamp not available
                return {
                  ...transfer,
                  timestamp: Date.now()
                };
              }
            })
          );

          console.log(`${networkConfig.name} response:`, {
            transfersCount: transfersWithTimestamps.length,
            pageKey: data.result?.pageKey,
            hasMore: !!data.result?.pageKey,
            sampleTransfer: transfersWithTimestamps[0] || null
          });

          return {
            network: networkConfig.name,
            transfers: transfersWithTimestamps,
            error: undefined,
            pageKey: data.result?.pageKey,
            hasMore: !!data.result?.pageKey,
          };
        } catch (err) {
          console.error(`Error fetching ${networkConfig.name}:`, err);
          return {
            network: networkConfig.name,
            transfers: [],
            error: err instanceof Error ? err.message : 'Unknown error',
            hasMore: false,
          };
        }
      })
    );

    // Combine all transfers from all networks and sort by time
    const allTransfers = results.flatMap(networkResult => 
      networkResult.transfers.map(transfer => ({
        ...transfer,
        network: networkResult.network,
        // Use the actual timestamp we fetched
        timestamp: transfer.timestamp || Date.now()
      }))
    );

    // Sort by timestamp (most recent first)
    allTransfers.sort((a, b) => b.timestamp - a.timestamp);

    console.log('Final results:', {
      totalNetworks: results.length,
      networksWithData: results.filter(r => r.transfers.length > 0).length,
      totalTransfers: allTransfers.length,
      sortedTransfers: allTransfers.slice(0, 5).map(t => ({ network: t.network, blockNum: t.blockNum, timestamp: t.timestamp })),
      errors: results.filter(r => r.error).map(r => ({ network: r.network, error: r.error }))
    });

    // Return the sorted transfers as a single array
    return NextResponse.json({ 
      results: [{
        network: 'All Networks',
        transfers: allTransfers,
        error: undefined,
        pageKey: results.find(r => r.pageKey)?.pageKey,
        hasMore: results.some(r => r.hasMore),
      }]
    });
  } catch (error) {
    console.error('Alchemy API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transfers' },
      { status: 500 }
    );
  }
}
