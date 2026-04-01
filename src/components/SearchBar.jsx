import React, { useRef, useTransition } from 'react';

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
    <div className={`
      bg-card border border-white/8 rounded-2xl px-6 py-4 backdrop-blur-xl mb-8
      transition-all duration-300 ease-in-out
      ${isActive ? 'border-accent-primary shadow-[0_0_0_3px_rgba(139,92,246,0.15),0_8px_32px_rgba(139,92,246,0.1)]' : ''}
    `}>
      <div className="flex items-center gap-3">
        <span className={`text-[1.1rem] flex-shrink-0 transition-all duration-300 ease-in-out ${isActive ? 'opacity-100' : 'opacity-70'}`} aria-hidden="true">🔍</span>
        <input
          ref={inputRef}
          className="flex-1 bg-transparent border-none outline-none text-text-primary font-body text-[1.05rem] min-w-0 placeholder:text-text-secondary/55"
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
            className="bg-white/7 border border-white/12 text-text-secondary text-[0.8rem] cursor-pointer px-2 py-1 rounded-md transition-all duration-300 ease-in-out flex-shrink-0 font-body leading-none hover:text-text-primary hover:bg-white/13 hover:border-white/22"
            onClick={handleClear}
            aria-label="Limpar busca"
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      {isActive && resultCount !== null && (
        <p className="mt-2.5 ml-8 text-[0.82rem] text-text-secondary/80 animate-fade-in">
          {resultCount === 0
            ? 'Nenhuma escala encontrada.'
            : `${resultCount} escala${resultCount !== 1 ? 's' : ''} encontrada${resultCount !== 1 ? 's' : ''} para "${value}"`}
        </p>
      )}
    </div>
  );
};

export default SearchBar;
