import React from 'react';

export default function LoadingState({ message = 'Carregando escalas...' }) {
  return <div className="loading-state">{message}</div>;
}
