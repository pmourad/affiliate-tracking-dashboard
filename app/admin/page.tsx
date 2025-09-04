// Admin dashboard - view click statistics with Basic Auth protection
import Link from 'next/link';
import { createServerClient, type ClickRecord } from '@/lib/supabase';

// This is a server component - runs on server, not browser
export default async function AdminPage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string };
}) {
  // Get date range from URL params or default to last 30 days
  const fromDate = searchParams.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const toDate = searchParams.to || new Date().toISOString().split('T')[0];

  let stats = null;
  let error = null;

  try {
    // Connect to database (server-side only)
    const supabase = createServerClient();

    // Get all clicks in date range with full details
    const { data: clicksData, error: clicksError } = await supabase
      .from('clicks')
      .select('*')
      .gte('created_at', fromDate + 'T00:00:00Z')
      .lte('created_at', toDate + 'T23:59:59Z')
      .order('created_at', { ascending: false })
      .limit(100); // Limit to most recent 100 clicks

    if (clicksError) throw clicksError;

    // Process client stats for summary
    const clientCounts = clicksData?.reduce((acc: Record<string, number>, row) => {
      acc[row.client] = (acc[row.client] || 0) + 1;
      return acc;
    }, {}) || {};

    const topClients = Object.entries(clientCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10);

    // Process channel stats for summary
    const channelCounts = clicksData?.reduce((acc: Record<string, number>, row) => {
      acc[row.channel] = (acc[row.channel] || 0) + 1;
      return acc;
    }, {}) || {};

    const topChannels = Object.entries(channelCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10);

    stats = {
      totalClicks: clicksData?.length || 0,
      topClients,
      topChannels,
      clicksData: clicksData || [],
    };

  } catch (err) {
    console.error('Admin dashboard error:', err);
    error = 'Failed to load statistics. Check your database connection.';
  }

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      background: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#333', marginBottom: '30px' }}>
          📊 Harold&apos;s Smart Redirect - Admin Dashboard
        </h1>

        {/* Date Range Selector */}
        <div style={{ marginBottom: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '4px' }}>
          <h3 style={{ marginBottom: '15px' }}>Date Range</h3>
          <form method="GET" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>From:</label>
              <input 
                type="date" 
                name="from" 
                defaultValue={fromDate}
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>To:</label>
              <input 
                type="date" 
                name="to" 
                defaultValue={toDate}
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <button 
              type="submit"
              style={{
                padding: '10px 20px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              Update
            </button>
          </form>
        </div>

        {error ? (
          <div style={{ 
            padding: '20px', 
            background: '#f8d7da', 
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24',
            marginBottom: '20px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        ) : stats ? (
          <>
            {/* Total Clicks */}
            <div style={{ 
              padding: '20px', 
              background: '#d4edda', 
              border: '1px solid #c3e6cb',
              borderRadius: '4px',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              <h2 style={{ margin: '0 0 10px 0', color: '#155724' }}>
                🎯 {stats.totalClicks.toLocaleString()} Total Clicks
              </h2>
              <p style={{ margin: 0, color: '#155724' }}>
                From {fromDate} to {toDate}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              {/* Top Clients */}
              <div>
                <h3 style={{ marginBottom: '15px' }}>🏢 Top Clients</h3>
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
                  {stats.topClients.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {stats.topClients.map(([client, count], index) => (
                        <li key={client} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          padding: '8px 0',
                          borderBottom: index < stats.topClients.length - 1 ? '1px solid #dee2e6' : 'none'
                        }}>
                          <span style={{ fontWeight: 'bold' }}>{client}</span>
                          <span style={{ color: '#007bff' }}>{count} clicks</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>No data for this period</p>
                  )}
                </div>
              </div>

              {/* Top Channels */}
              <div>
                <h3 style={{ marginBottom: '15px' }}>📢 Top Channels</h3>
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
                  {stats.topChannels.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {stats.topChannels.map(([channel, count], index) => (
                        <li key={channel} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          padding: '8px 0',
                          borderBottom: index < stats.topChannels.length - 1 ? '1px solid #dee2e6' : 'none'
                        }}>
                          <span style={{ fontWeight: 'bold' }}>{channel}</span>
                          <span style={{ color: '#28a745' }}>{count} clicks</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>No data for this period</p>
                  )}
                </div>
              </div>
            </div>

            {/* Individual Clicks Table */}
            <div style={{ marginTop: '40px' }}>
              <h3 style={{ marginBottom: '15px' }}>📋 Recent Clicks (Last 100)</h3>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '4px',
                overflowX: 'auto'
              }}>
                {stats.clicksData.length > 0 ? (
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse',
                    fontSize: '14px'
                  }}>
                    <thead>
                      <tr style={{ background: '#e9ecef' }}>
                        <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Time</th>
                        <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Client</th>
                        <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Service</th>
                        <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Channel</th>
                        <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Campaign</th>
                        <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Destination</th>
                        <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Click ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.clicksData.map((click: ClickRecord & { id: string; created_at: string }, index: number) => (
                        <tr key={click.id} style={{ 
                          background: index % 2 === 0 ? 'white' : '#f8f9fa',
                          borderBottom: '1px solid #dee2e6'
                        }}>
                          <td style={{ padding: '10px 8px', fontSize: '12px' }}>
                            {new Date(click.created_at).toLocaleString()}
                          </td>
                          <td style={{ padding: '10px 8px', fontWeight: 'bold', color: '#007bff' }}>
                            {click.client}
                          </td>
                          <td style={{ padding: '10px 8px' }}>
                            {click.service}
                          </td>
                          <td style={{ padding: '10px 8px', color: '#28a745' }}>
                            {click.channel}
                          </td>
                          <td style={{ padding: '10px 8px', fontStyle: click.campaign ? 'normal' : 'italic', color: click.campaign ? '#333' : '#999' }}>
                            {click.campaign || 'none'}
                          </td>
                          <td style={{ padding: '10px 8px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <a href={click.dest_url} target="_blank" rel="noopener noreferrer" style={{ color: '#6f42c1', textDecoration: 'none' }}>
                              {click.dest_url}
                            </a>
                          </td>
                          <td style={{ padding: '10px 8px', fontFamily: 'monospace', fontSize: '11px', color: '#6c757d' }}>
                            {click.click_id.split('-')[0]}...
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic', margin: 0, textAlign: 'center', padding: '20px' }}>
                    No clicks found for this date range. Try creating some tracking links!
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading statistics...
          </div>
        )}

        {/* Quick Links */}
        <div style={{ marginTop: '40px', padding: '20px', background: '#e9ecef', borderRadius: '4px' }}>
          <h3 style={{ marginBottom: '15px' }}>🔗 Quick Links</h3>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link href="/" style={{ color: '#007bff', textDecoration: 'none' }}>← Back to Home</Link>
            <a href="/builder" style={{ color: '#007bff', textDecoration: 'none' }}>Link Builder</a>
            <a href="/api/health" style={{ color: '#007bff', textDecoration: 'none' }}>Health Check</a>
          </div>
        </div>
      </div>
    </div>
  );
}
