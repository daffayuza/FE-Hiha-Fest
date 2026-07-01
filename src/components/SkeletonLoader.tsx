/**
 * SkeletonLoader — reusable skeleton components for loading states.
 * Uses CSS animations defined in index.css via the 'skeleton' class.
 */

/** Single skeleton block with a shimmer animation */
export function SkeletonBlock({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

/** Skeleton for the 4 stat cards on Dashboard */
export function SkeletonStatCards() {
  return (
    <div className="stats-grid">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="stat-card">
          <div className="stat-icon purple">
            <SkeletonBlock style={{ width: 24, height: 24, borderRadius: '50%' }} />
          </div>
          <div style={{ flex: 1 }}>
            <SkeletonBlock style={{ width: '60%', height: 14, marginBottom: 8 }} />
            <SkeletonBlock style={{ width: '40%', height: 22 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton for the BarChart card */
export function SkeletonChart() {
  return (
    <div className="dashboard-chart card">
      <SkeletonBlock style={{ width: 180, height: 20, marginBottom: 16 }} />
      <SkeletonBlock style={{ width: '100%', height: 260, borderRadius: 8 }} />
    </div>
  );
}

/** Skeleton for a table with N rows and C columns */
export function SkeletonTable({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i}>
                <SkeletonBlock style={{ width: '70%', height: 14 }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c}>
                  <SkeletonBlock
                    style={{ width: c === 0 ? '80%' : '60%', height: 14 }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Generic page header skeleton */
export function SkeletonPageHeader() {
  return (
    <div className="admin-page-header">
      <SkeletonBlock style={{ width: 220, height: 28, marginBottom: 8 }} />
      <SkeletonBlock style={{ width: 300, height: 16 }} />
    </div>
  );
}

/** Skeleton for TransactionDetailPage — two column detail cards */
export function SkeletonDetailCards({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {[0, 1].map(col => (
        <div key={col} className="card" style={{ padding: '1.5rem' }}>
          <SkeletonBlock style={{ width: 140, height: 18, marginBottom: 16 }} />
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <SkeletonBlock style={{ width: '40%', height: 14 }} />
              <SkeletonBlock style={{ width: '45%', height: 14 }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
