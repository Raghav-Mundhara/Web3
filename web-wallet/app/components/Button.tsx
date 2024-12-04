interface ButtonProps {
    text: string;
    onClick: () => void;
    color?: string;
    textColor?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, color = "bg-slate-700"  , textColor = "text-white"}) => {
    return (
        <div className={`h-max w-max text-white rounded-lg p-2 ${color} ${textColor}`}>
            <button onClick={onClick}>
                {text}
            </button>
        </div>
    );
};

export default Button;
