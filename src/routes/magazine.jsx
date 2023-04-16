import React from "react";
import BaseLayout from "../components/BaseLayout"

export default function Card() {
    return(
        <BaseLayout>
            <div className="container mx-auto py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img src="https://source.unsplash.com/random/400x400" alt="Blog Category" className="w-full h-56 object-cover" />
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-2">Technology</h2>
                        <p className="text-gray-700">Get the latest news and updates about technology.</p>
                    </div>
                    </div>
                </div>
            </div>

        </BaseLayout>
    );
}