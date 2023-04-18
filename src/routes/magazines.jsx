import React from "react";
import BaseLayout from "../components/BaseLayout";

export default function MagazinesPage() {
  return (
    <BaseLayout>
      <div className="container mt-20 mx-auto max-w-3xl h-screen space-y-8">
        <div
          className="w-full bg-cover bg-center overflow-hidden rounded-2xl text-opacity-90"
          style={{
            height: "16rem",
            backgroundImage: `url(https://images.unsplash.com/photo-1599372173702-ecf4919a527a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGFyaXMlMjBuaWdodHxlbnwwfHwwfHw%3D&w=1000&q=80)`,
          }}
        >
          <h1 className="mt-24 text-4xl font-medium text-center text-white">
            Magazines
          </h1>
          <p className="text-xd text-center text-white">
            Here is the collection of recommended magazines!
          </p>
        </div>
          <div className="bg-blue-400 text-white text-md font-medium rounded-full px-8 py-1 mt-5 ">
            Add Magazine
          </div>
        <div className="text-center">
          <h1 className="mt-14 text-2xl font-medium text-gray-800">
            Magazine Title
          </h1>
          <p className="text-xd text-gray-700 mb-5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          </p>
          <div className="flex flex-row space-y-20 space-x-5">
            <div className="basis-2/4">
              <img
                src="https://source.unsplash.com/random/400x400"
                alt="Random Unsplash"
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="basis-2/4 text-left">
              <ul className="list-disc list-inside">
                <li>Lorem ipsum dolor sit amet</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
