import React from 'react';

export default function AppFooter({ year = 2026 }) {
  return (
    <footer style={{ marginTop: '4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
      <p>© {year} Heitor Macedo</p>
    </footer>
  );
}
