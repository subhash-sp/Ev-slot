import React, { useId } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

/**
 * Text field with label, helper/error text and adornments.
 * Adornments sit in the flex row (not absolutely positioned), so icons can
 * never overlap the placeholder or typed value.
 */
export function Input({
  id,
  label,
  error,
  helperText,
  startAdornment,
  endAdornment,
  className = '',
  readOnly,
  disabled,
  ...rest
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const message = error ?? helperText;

  return (
    <div className={className}>
      {label &&
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      }
      <div
        className={`flex h-11 items-center rounded-xl border transition-colors focus-within:ring-2 ${
        error ?
        'border-red-500 focus-within:ring-red-500/30' :
        'border-slate-300 focus-within:border-green-600 focus-within:ring-green-600/20'} ${
        readOnly || disabled ? 'bg-slate-50' : 'bg-white'} ${disabled ? 'opacity-60' : ''}`}>
        
        {startAdornment &&
        <span className="flex h-full shrink-0 items-center pl-3 text-slate-500 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-slate-500" aria-hidden>
            {startAdornment}
          </span>
        }
        <input
          id={inputId}
          readOnly={readOnly}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={`h-full w-full min-w-0 flex-1 rounded-xl bg-transparent pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed ${
          startAdornment ? 'pl-2.5' : 'pl-3'} ${
          readOnly ? 'cursor-default text-slate-600' : ''}`}
          {...rest} />
        
        {endAdornment && <span className="flex h-full shrink-0 items-center pr-3 text-slate-500">{endAdornment}</span>}
      </div>
      {message &&
      <p id={messageId} className={`mt-1.5 text-xs ${error ? 'text-red-600' : 'text-slate-500'}`}>
          {message}
        </p>
      }
    </div>);

}