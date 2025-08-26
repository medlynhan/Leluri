import React from 'react';

// Mendeklarasikan tipe untuk props
interface ButtonProps {
  onClick: () => void;  
  text: string; 
  additional_styles: string; 
}

const Button: React.FC<ButtonProps> = ({ onClick, text, additional_styles}) => {
  return (
    <button className={`rounded-3xl border px-3 py-2 ${additional_styles} font-semibold cursor-pointer`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;