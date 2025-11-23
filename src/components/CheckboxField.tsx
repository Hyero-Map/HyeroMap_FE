type Props = {
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
};

export default function CheckboxField({ label, value, onToggle }: Props) {
  return (
    <label className="flex items-center justify-between cursor-pointer select-none">
      <span className="text-sm font-medium">{label}</span>

      {/* 숨겨진 실제 체크박스 */}
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onToggle(e.target.checked)}
        className="hidden"
      />

      {/* 커스텀 박스 */}
      <div
        onClick={() => onToggle(!value)}
        className={`
          w-6 h-6 rounded-md flex items-center justify-center border transition-all
          ${
            value
              ? 'bg-green-500 border-green-600'
              : 'bg-gray-200 border-gray-400'
          }
        `}
      >
        {value && <span className="text-white text-sm">✔</span>}
      </div>
    </label>
  );
}
