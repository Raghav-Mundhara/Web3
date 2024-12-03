import React from "react"

interface ButtonProps {
    text: string,
    onClick: () => void
}
const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <div className="bg-slate-800 h-max w-max text-white rounded-lg p-2">
            <button onClick={onClick}>
                {text}
            </button>
        </div>
    )
}

export default Button