'use client'

import { TextInput } from '@/components/TextInput';
import { useState } from 'react'

export default function ObjectsPage() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [dated, setDated] = useState('');
  const [period, setPeriod] = useState('');
  const [culture, setCulture] = useState('');

  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setError(null);

    const queries = []
    if (title.trim()) {
      queries.push(`title=${encodeURIComponent(title.trim())}`)
    }
    if (artist.trim()) {
      queries.push(`artist=${encodeURIComponent(artist.trim())}`)
    }
    if (dated.trim()) {
      queries.push(`dated=${encodeURIComponent(dated.trim())}`)
    }
    if (period.trim()) {
      queries.push(`period=${encodeURIComponent(period.trim())}`)
    }
    if (culture.trim()) {
      queries.push(`culture=${encodeURIComponent(culture.trim())}`)
    }

    if (queries.length == 0) {
      setError('Please enter something to search for.');
      return;
    }

    try {
      const response = await fetch(`/api/search_objects?${queries.join('&')}`);

      if (!response.ok) {
        const { error } = await response.json();
        setError(error || 'Failed to fetch objects.');
        return;
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Search Objects by Culture</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <TextInput
          label="Title"
          placeholder="Enter title (e.g., The Prodigal Son)"
          value={title}
          setValue={setTitle}
        />
        <TextInput
          label="Artist"
          placeholder="Enter artist (e.g., François-Auguste-René Rodin)"
          value={artist}
          setValue={setArtist}
        />
        <TextInput
          label="Dated"
          placeholder="Enter dated (e.g., 1905)"
          value={dated}
          setValue={setDated}
        />
        <TextInput
          label="Period"
          placeholder="Enter period (e.g., Tang Dynasty)"
          value={period}
          setValue={setPeriod}
        />
        <TextInput
          label="Culture"
          placeholder="Enter culture (e.g., French)"
          value={culture}
          setValue={setCulture}
        />

        <button
          onClick={handleSearch}
          className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md shadow hover:bg-indigo-500 transition duration-300"
        >
          Search
        </button>
      </div>

      {error && (
        <p className="text-red-600 mt-4 text-sm font-medium">{error}</p>
      )}

      <div className="mt-6 w-full max-w-3xl">
        {results.length > 0 ? (
          <ul className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
            {results.map((result) => (
              <li
                key={result.object_id}
                className="px-6 py-4 flex items-start justify-between hover:bg-gray-50"
              >
                <div>
                  <p className="text-gray-900 font-bold text-lg">{result.title}</p>
                  <p className="text-gray-900 font-bold">By {result.artist_name}</p>
                  <p className="text-gray-900 font-medium ml-auto w-fit">{result.dated}</p>
                  {result.period_name && (
                    <p className="text-gray-900 font-medium ml-auto w-fit">{result.period_name}</p>
                  )}
                  {result.credit && (
                    <p className="text-gray-900 font-medium ml-auto w-fit">Credit: {result.credit}</p>
                  )}
                  <p
                    className="text-gray-600 text-sm"
                    dangerouslySetInnerHTML={{__html: result.label}}
                  />
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
  );
}
