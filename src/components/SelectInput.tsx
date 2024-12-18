type Props = {
  label: string
  options: Array<{id: number|string, name: string}>
  value: number|string
  setValue: (v: string) => void
  noFilterOption: boolean
}

export function SelectInput(props: Props) {
  return (
    <div className="mb-4">
      <label
        htmlFor={props.label}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {props.label}
      </label>
      <select
        id={props.label}
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black cursor-pointer"
      >
        {props.noFilterOption && (
          <option value={-1}>
            No filter
          </option>
        )}
        {props.options.map(option => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  )
}
