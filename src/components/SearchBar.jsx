import React, { useRef, useTransition } from 'react';
import './SearchBar.css';

/**
 * SearchBar — barra de busca principal exibida no topo do app.
 *
 * Permite que o usuário busque pelo próprio nome para ver todas
 * as suas escalas de uma vez.
 *
 * Props:
 *   value      {string}    valor atual da busca (estado elevado em App)
 *   onChange   {Function}  setter do valor
 *   resultCount {number|null} null = sem busca ativa, number = qt. de resultados
 */
const SearchBar = ({ value, onChange, resultCount = null }) => {
  const inputRef = useRef(null);
  const [, startTransition] = useTransition();
  const isActive = value.trim().length > 0;

  const handleChange = (e) => {
    const val = e.target.value;
    startTransition(() => onChange(val));
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`search-hero${isActive ? ' search-hero--active' : ''}`}>
      <div className="search-hero__inner">
        <span className="search-hero__icon" aria-hidden="true">🔍</span>
        <input
          ref={inputRef}
          className="search-hero__input"
          type="text"
          placeholder="Busque seu nome para ver suas escalas..."
          value={value}
          onChange={handleChange}
          aria-label="Buscar membro por nome"
          autoComplete="off"
          spellCheck={false}
        />
        {isActive && (
          <button
            className="search-hero__clear"
            onClick={handleClear}
            aria-label="Limpar busca"
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      {isActive && resultCount !== null && (
        <p className="search-hero__hint">
          {resultCount === 0
            ? 'Nenhuma escala encontrada.'
            : `${resultCount} escala${resultCount !== 1 ? 's' : ''} encontrada${resultCount !== 1 ? 's' : ''} para "${value}"`}
        </p>
      )}
    </div>
  );
};

export default SearchBar;
