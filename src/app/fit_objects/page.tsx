'use client'

import { SelectInput } from '@/components/SelectInput'
import { TextInput } from '@/components/TextInput'
import { useEffect, useState } from 'react'

type Comparison = '<=' | '=' | '>='

export default function ObjectsPage() {
  const [height, setHeight] = useState('')
  const [width, setWidth] = useState('')
  const [depth, setDepth] = useState('')

  const [comparison, setComparison] = useState<string>('<=')

  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFit = async () => {
    setError(null)

    let foundNaN = false
    const queries = []

    if (height.trim()) {
      const parsedHeight = parseFloat(height.trim())
      if (isNaN(parsedHeight)) {
        foundNaN = true
      } else {
        queries.push(`height=${parsedHeight}`)
      }
    }
    if (width.trim()) {
      const parsedWidth = parseFloat(width.trim())
      if (isNaN(parsedWidth)) {
        foundNaN = true
      } else {
        queries.push(`width=${parsedWidth}`)
      }
    }
    if (depth.trim()) {
      const parsedDepth = parseFloat(depth.trim())
      if (isNaN(parsedDepth)) {
        foundNaN = true
      } else {
        queries.push(`depth=${parsedDepth}`)
      }
    }

    if (foundNaN) {
      setError('Dimensions must be numbers')
      return
    }

    if (queries.length == 0) {
      setError('Please enter a value.')
      return
    }

    queries.push(`comparison=${encodeURIComponent(comparison)}`)

    try {
      const response = await fetch(`/api/fit_objects?${queries.join('&')}`)

      if (!response.ok) {
        const { error } = await response.json()
        setError(error || 'Failed to fetch objects.')
        return
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred.')
    }
  }

  const handleClear = async () => {
    setResults([])
    setError(null)

    setHeight('')
    setWidth('')
    setDepth('')

    setComparison('<=')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Fit Objects</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <SelectInput
          label="Comparison"
          options={[
            {id: '<=', name: 'Less than or equal to'},
            {id: '=', name: 'Equal to'},
            {id: '>=', name: 'More than or equal to'},
          ]}
          value={comparison}
          setValue={setComparison}
          noFilterOption={false}
        />

        <TextInput
          label="Height (cm)"
          value={height}
          setValue={setHeight}
        />
        <TextInput
          label="Width (cm)"
          value={width}
          setValue={setWidth}
        />
        <TextInput
          label="Depth (cm)"
          value={depth}
          setValue={setDepth}
        />

        <button
          onClick={handleFit}
          className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md shadow hover:bg-indigo-500 transition duration-300"
        >
          Fit
        </button>

        <button
          onClick={handleClear}
          className="w-full bg-gray-600 text-white font-medium py-2 px-4 rounded-md shadow hover:bg-gray-500 transition duration-300 mt-2"
        >
          Clear
        </button>
      </div>

      {error && (
        <p className="text-red-600 mt-4 text-sm font-medium">{error}</p>
      )}

      <div className="mt-6 w-full max-w-3xl">
        {results.length > 0 ? (
          <ul className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
            {results.map(result => (
              <li
                key={result[0]}
                className="px-6 py-4 flex items-start justify-between hover:bg-gray-50"
              >
                <div className='w-full'>
                  <p className="text-gray-900 font-bold text-lg">{result[1].title}</p>
                  <p className="text-gray-900 font-bold">By {result[1].artist}</p>
                  {result[1].dimensions.map((dimension: any) => (
                    <p key={dimension.id} className="text-gray-900 font-medium w-fit ml-auto">
                      {dimension.description}: {' '}
                      {dimension.height.toFixed(2)} x {dimension.width.toFixed(2)}
                      {dimension.depth && (
                        <> x {dimension.depth.toFixed(2)}</>
                      )}
                      {' '} cm
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 mt-4 text-sm text-center">
            No results found.
          </p>
        )}
      </div>
    </div>
  )
}
