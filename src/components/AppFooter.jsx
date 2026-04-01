import React from 'react';

export default function AppFooter({ year = 2026 }) {
  return (
    <footer className="mt-16 text-text-secondary text-[0.9rem]">
      <p>© {year} Heitor Macedo</p>
    </footer>
  );
}
