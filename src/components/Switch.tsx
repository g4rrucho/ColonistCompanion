import React, { useState } from "react";

interface ISwitchProps {
  checked?: boolean;
  label?: string;
  onChange?: (val: boolean) => void;
}

const Switch: React.FC<ISwitchProps> = ({ checked, label, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked ?? false);

  const toggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <label className="cc-inline-flex cc-items-center cc-cursor-pointer cc-gap-4">
      {label && <span>{label}</span>}

      <input
        type="checkbox"
        className="cc-sr-only"
        checked={isChecked}
        onChange={toggle}
      />

      <div
        className={`cc-w-11 cc-h-6 cc-rounded-full cc-transition-colors cc-relative ${
          isChecked ? "cc-bg-blue-600" : "cc-bg-gray-300"
        }`}
      >
        <div
          className={`cc-w-5 cc-h-5 cc-bg-white cc-rounded-full cc-absolute cc-top-[2px] cc-left-[2px] cc-transition-transform ${
            isChecked ? "cc-translate-x-5" : ""
          }`}
        />
      </div>
    </label>
  );
};

export default Switch;
