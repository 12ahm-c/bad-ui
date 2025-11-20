export default function UsernameInput({ value, onChange }) {
    return (
        <input
            type="text"
            className="input-field"
            placeholder="votre.nom"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}