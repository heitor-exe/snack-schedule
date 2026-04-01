import React from 'react';

export default function LoadingState({ message = 'Carregando escalas...' }) {
  return <div className="text-center text-xl text-text-secondary py-20">{message}</div>;
}
