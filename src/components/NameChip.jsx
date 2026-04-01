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
          bg-transparent border-none text-text-secondary font-body text-[0.95rem] px-[0.35rem] py-[0.15rem]
          cursor-pointer rounded-md transition-all duration-300 ease-in-out text-left inline-block
          hover:text-accent-primary hover:bg-accent-primary/12 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.25)]
          ${isSearchMatch ? 'bg-gradient-to-br from-accent-primary to-accent-secondary text-white font-semibold shadow-[0_12px_30px_-15px_rgba(139,92,246,0.8)]' : ''}
          ${isInline ? 'text-[0.85rem] px-[0.45rem] py-[0.2rem]' : ''}
          ${isSelectedUser ? 'font-bold text-white bg-gradient-to-r from-user-accent to-user-accent-strong shadow-[0_12px_25px_-14px_rgba(249,115,22,0.7)]' : ''}
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
