import ReactSelect, { type StylesConfig } from 'react-select'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  ariaLabel?: string
  inputId?: string
}

const styles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 40,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: state.isFocused ? 'var(--blue)' : 'var(--line)',
    boxShadow: state.isFocused ? '0 0 0 3px var(--blue-soft)' : 'none',
    background: 'var(--surface-raised)',
    cursor: 'pointer',
  }),
  valueContainer: (base) => ({ ...base, padding: '2px 14px' }),
  singleValue: (base) => ({ ...base, color: 'var(--ink)', fontWeight: 700, fontSize: 14 }),
  input: (base) => ({ ...base, color: 'var(--ink)' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: 'var(--ink-muted)',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : undefined,
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 16,
    overflow: 'hidden',
    border: '1.5px solid var(--line)',
    boxShadow: 'var(--shadow-float)',
    background: 'var(--surface-raised)',
    zIndex: 20,
  }),
  option: (base, state) => ({
    ...base,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    background: state.isSelected ? 'var(--blue-soft)' : state.isFocused ? 'var(--line)' : 'transparent',
    color: state.isSelected ? 'var(--blue)' : 'var(--ink)',
  }),
}

export function Select({ options, value, onChange, ariaLabel, inputId }: SelectProps) {
  const selected = options.find((o) => o.value === value) ?? null

  return (
    <ReactSelect
      inputId={inputId}
      aria-label={ariaLabel}
      options={options}
      value={selected}
      onChange={(opt) => opt && onChange(opt.value)}
      isSearchable={false}
      styles={styles}
      unstyled={false}
    />
  )
}
