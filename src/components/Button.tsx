import * as React from 'react';

export interface IButtonProps {
  classes?: string;
  children?: any;
  disabled?: boolean;
  onClick?: any;
}

export default function Button({
  classes,
  children,
  disabled,
  onClick,
}: IButtonProps) {
  return (
    <button
      className={`btn ${classes ?? classes}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
