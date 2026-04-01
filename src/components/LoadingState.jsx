import React from 'react';

export default function LoadingState({ message = 'CARREGANDO ESCALAS...' }) {
  return <div className="text-center text-lg text-text-muted uppercase tracking-widest font-bold py-20">{message}</div>;
}
