import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Database of the Allen Memorial Art Museum</h1>

      <main className="max-w-xl flex flex-col">
        <p>
          This website was created by
          {' '}<a href="https://iagomendes.com" target="_blank" rel="noopener noreferrer" className="hover:underline font-bold">Iago B. Mendes</a>{' '}
          and turned in as the final project for the Database Systems course at Oberlin College (CSCI 311).
        </p>

        <h2 className="text-2xl font-bold mb-3 mt-10 text-gray-800">Functionalities</h2>

        <Link
          href="/search_objects"
          className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md shadow hover:bg-indigo-500 transition duration-300 flex items-center justify-between mb-3"
        >
          Search objects based on title, artist, culture, and more.
          <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
        </Link>
        <Link
          href="/fit_objects"
          className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md shadow hover:bg-indigo-500 transition duration-300 flex items-center justify-between"
        >
          Check which objects fit your available space.
          <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
        </Link>
      </main>
    </div>
  );
}
