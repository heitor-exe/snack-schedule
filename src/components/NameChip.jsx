import React from 'react';
import { normalize } from '../utils/filterUtils';
import './NameChip.css';

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

  const classNames = ['name-chip'];
  if (isSearchMatch) classNames.push('name-chip--active');
  if (isInline) classNames.push('name-chip--inline');
  if (isSelectedUser) classNames.push('name-chip--user');

  return (
    <li key={name}>
      <button
        className={classNames.join(' ')}
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
