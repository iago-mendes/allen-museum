type Props = {
  label: string
  placeholder?: string
  value: string
  setValue: (v: string) => void
}

export function TextInput(props: Props) {
  return (
    <div className="mb-4">
      <label
        htmlFor={props.label}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {props.label}
      </label>
      <input
        type="text"
        id={props.label}
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        placeholder={props.placeholder}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
      />
    </div>
  )
}
