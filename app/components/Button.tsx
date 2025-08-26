import React from 'react';

// Mendeklarasikan tipe untuk props
interface ButtonProps {
  onClick: () => void;  
  text: string; 
  additional_styles: string; 
}

const Button: React.FC<ButtonProps> = ({ onClick, text, additional_styles}) => {
  return (
    <button className={`rounded-3xl border ${additional_styles}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;