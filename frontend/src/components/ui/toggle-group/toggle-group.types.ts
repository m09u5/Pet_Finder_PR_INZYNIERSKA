export interface ToggleOption<Value extends string> {
  value: Value;
  label: string;
}

export interface ToggleGroupProps<Value extends string> {
  options: ToggleOption<Value>[];
  value: Value;
  fullWidth?: boolean;
  className?: string;
  onChangeAction: (value: Value) => void;
}
