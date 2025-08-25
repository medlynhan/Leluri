import React from 'react';

// Mendeklarasikan tipe untuk props
interface ButtonProps {
  onClick: () => void;  // onClick adalah fungsi tanpa parameter dan tidak mengembalikan nilai
  text: string;  // text adalah string
}

const Button: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <button className="p-3 rounded-3xl border hover:bg-red-200" onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;