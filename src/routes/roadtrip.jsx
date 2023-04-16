import React from "react"
import BaseLayout from "../components/BaseLayout"

export default function RoadtripPage() {
return(
    <BaseLayout>
        <div className="flex flex-col items-center my-10">
            <h1 className="text-4xl font-medium">Roadtrip Title</h1>
            <p className="text-md text-gray-600 mt-2">sub-title avsjdkfdhgfkdjghfsjgtrrhtjy</p>
            <button className="bg-blue-400 text-white text-md font-medium rounded-full px-8 py-1 mt-10">
                Start this roadtrip
            </button>
            </div>
        <p className="text-md text-md text-gray-700 mt-10 first-line:tracking-widest first-letter:text-3xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <h1 className="text-md text-3xl mt-10 text-center">Waypoints</h1>
        <ul className="grid grid-cols-3 gap-10 mt-7 items-center">
            <li className="bg-white rounded-lg shadow-lg overflow-hidden py-5">
                <div className="p-6 items-center text-center">
                    <h2 className="text-2xl font-bold mb-2">Waypoint1</h2>
                    <p className="text-gray-700">Waypoint Description</p>
                    <button className="bg-gray-500 text-white text-md font-medium rounded-full px-8 py-1 mt-5">
                        view more
                    </button>
                </div>
            </li>
        </ul>
        <p className="text-sm text-gray-600 mt-20 text-center">created by Author</p>
    </BaseLayout>
);
}