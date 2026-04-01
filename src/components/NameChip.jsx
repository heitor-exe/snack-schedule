import React from 'react';
import { normalize } from '../utils/filterUtils';

const NameChip = ({
  name,
  onNameClick,
  activeQuery = '',
  isInline = false,
  selectedMember = '',
}) => {
  const cleanedQuery = activeQuery?.trim() ?? '';
  const isSearchMatch =
    cleanedQuery.length > 0 && normalize(name).includes(normalize(cleanedQuery));
  const isSelectedUser = selectedMember && selectedMember === name;

  return (
    <li key={name}>
      <button
        className={`
          bg-transparent border-none text-text-muted font-body text-xs uppercase tracking-wider
          cursor-pointer rounded-sm transition-all duration-300 text-left inline-block font-bold
          hover:text-primary hover:bg-primary/10
          ${isSearchMatch ? 'bg-primary/20 text-primary border border-primary/30 font-black rounded-sm' : ''}
          ${isInline ? 'text-[10px] px-1.5 py-0.5' : 'px-1 py-0.5'}
          ${isSelectedUser ? 'font-black text-white bg-gradient-to-r from-user-accent to-user-accent-strong rounded-sm' : ''}
        `}
        onClick={() => onNameClick(name)}
        title={`Ver todas as escalas de ${name}`}
        type="button"
      >
        {name}
      </button>
    </li>
  );
};

export default NameChip;
