import React from "react"
import BaseLayout from "../components/BaseLayout"

export default function MagazinePage() {
  return (
    <BaseLayout>
    <div className="container mt-20 mx-auto max-w-3xl h-screen space-y-8 ">
        <div className="flex flex-col items-center my-5">
            <h1 className="text-4xl font-medium">Magazines</h1>
            <p className="text-md">
            Here is the collection of recommended magazines!
            </p>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <li className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
                src="https://source.unsplash.com/random/400x400"
                alt="Blog Category"
                className="w-full h-56 object-cover"
            />
            <div className="p-6">
                <h2 className="text-xl font-bold mb-2">Technology</h2>
                <p className="text-gray-700">
                Get the latest news and updates about technology.
                </p>
            </div>
            </li>
        </ul>
    </div>
    </BaseLayout>
  )
}
