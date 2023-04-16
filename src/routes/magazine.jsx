import React from "react"
import BaseLayout from "../components/BaseLayout"

export default function MagazinePage() {
  return (
    <BaseLayout>
        <div className="container mt-20 mx-auto max-w-3xl h-screen space-y-8 ">
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-medium">Magazine Title</h1>
                <p className="text-md text-gray-600 mt-2">Magazine ID: <span className="font-bold">ID12345</span></p>
            </div>
            <p className="text-md text-md text-gray-700 mt-20 first-line:tracking-widest first-letter:text-3xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <ul className="grid grid-cols-1 gap-10 mt-7">
                <li className="bg-white rounded-lg shadow-lg overflow-hidden py-5">
                    <div className="p-6 items-center text-center">
                        <h2 className="text-2xl font-bold mb-2">Roadtrip1</h2>
                        <p className="text-gray-700">Roadtrip Description</p>
                        <button className="bg-blue-400 text-white text-md font-medium rounded-full px-8 py-1 mt-5">
                            Visit this roadtrip
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </BaseLayout>
)
}