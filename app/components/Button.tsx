import React from 'react';

// Mendeklarasikan tipe untuk props
interface ButtonProps {
  onClick: () => void;  
  text: string; 
  additional_styles: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, text, additional_styles, disabled }) => {
  return (
    <button className={`rounded-3xl border px-3 py-2  ${additional_styles} font-semibold cursor-pointer`} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;