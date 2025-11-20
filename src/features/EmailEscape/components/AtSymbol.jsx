export default function AtSymbol({ flying, style, onClick }) {
    return (
        <div 
            className={`at-symbol ${flying ? 'flying' : ''}`}
            style={style}
            onClick={onClick}
        >
            @
        </div>
    );
}