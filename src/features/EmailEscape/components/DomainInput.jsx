export default function DomainInput({ value, onChange }) {
    return (
        <input
            type="text"
            className="input-field"
            placeholder="domaine.com"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}