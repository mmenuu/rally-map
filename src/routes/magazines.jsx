import React, { useState, useEffect } from "react";
import BaseLayout from "../components/BaseLayout";

import magazineServices from "../services/magazineServices";
import roadtripServices from "../services/roadtripServices";

import DialogLayout from "../components/DialogLayout";

import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";

export default function MagazinesPage() {
  const [magazines, setMagazines] = useState([]);

  const [magazineForm, setMagazineForm] = useState({
    title: "",
    description: "",
    roadtrips: [],
  });

  const [showCreateMagazineModal, setShowCreateMagazineModal] = useState(false);
  const [roadtrips, setRoadtrips] = useState([]);

  const fetchMagazines = async () => {
    try {
      const res = await magazineServices.getMagazines();
      setMagazines(res);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchRoadtrips = async () => {
    try {
      const res = await roadtripServices.getRoadtrips();
      setRoadtrips(res);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCreateMagazine = async (newMagazine) => {
    try {
      alert(JSON.stringify(newMagazine));
      const res = await magazineServices.createMagazine(newMagazine);

      console.log(res);
      fetchMagazines();
      toast.success("Magazine created successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchMagazines();
    fetchRoadtrips();
  }, []);

  return (
    <BaseLayout>
      <div
        className="w-full bg-cover h-[30vh] bg-center overflow-hidden rounded-2xl text-opacity-90 items-center"
        style={{
          height: "16rem",
          backgroundImage: `url(https://images.unsplash.com/photo-1599372173702-ecf4919a527a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGFyaXMlMjBuaWdodHxlbnwwfHwwfHw%3D&w=1000&q=80)`,
        }}
      >
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h1 className="text-4xl font-medium text-center text-white">
            Magazines
          </h1>
          <p className="text-xd text-center text-white">
            Here is the collection of recommended magazines!
          </p>
        </div>
      </div>
      <button
        onClick={() => setShowCreateMagazineModal(!showCreateMagazineModal)}
        className="bg-blue-400 text-white text-md text-center font-medium rounded-full py-1 px-10 mt-5"
      >
        Add Magazine
      </button>

      {showCreateMagazineModal && (
        <DialogLayout>
          <div className="flex flex-col p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Create New Magazine</h2>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => {
                  setShowCreateMagazineModal(!showCreateMagazineModal);
                  setMagazineForm({
                    title: "",
                    description: "",
                    roadtrips: [],
                  });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateMagazine(magazineForm);
                setShowCreateMagazineModal(!showCreateMagazineModal);
              }}
            >
              <div className="flex flex-col mt-5">
                <label className="text-gray-700">Title</label>
                <input
                  type="text"
                  className="border-2 border-gray-300 p-2 rounded-lg mt-1 focus:outline-none focus:border-blue-400"
                  value={magazineForm.title}
                  onChange={(e) =>
                    setMagazineForm({
                      ...magazineForm,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col mt-5">
                <label className="text-gray-700">Description</label>
                <input
                  type="text"
                  className="border-2 border-gray-300 p-2 rounded-lg mt-1 focus:outline-none focus:border-blue-400"
                  value={magazineForm.description}
                  onChange={(e) =>
                    setMagazineForm({
                      ...magazineForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col mt-5">
                <label className="text-gray-700">Roadtrips</label>

                {/* Multi Select Roadtrips */}
                <div className="relative inline-block w-full text-gray-700">
                  <div className="flex flex-col">
                    <div className="relative">
                      <select
                        className="w-full pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline"
                        placeholder="Regular input"
                        multiple
                        value={magazineForm.roadtrips}
                        onChange={(e) =>
                          setMagazineForm({
                            ...magazineForm,
                            roadtrips: Array.from(
                              e.target.selectedOptions,
                              (item) => item.value
                            ),
                          })
                        }
                      >
                        {roadtrips.map((roadtrip) => (
                          <option value={roadtrip.id}>{roadtrip.title}</option>
                        ))}
                      </select>
                    </div>{" "}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-400 text-white text-md text-center font-medium rounded-full py-1 px-10 mt-5"
              >
                Create Magazine
              </button>
            </form>
          </div>
        </DialogLayout>
      )}
      <ul className="mt-10 space-y-10">
        {magazines.map((magazine) => (
          <li>
            <div className="mb-5">
              <h1 className="text-2xl font-medium text-gray-800">
                {magazine.title}
              </h1>
              <p className="text-xd text-gray-700">{magazine.description}</p>
            </div>
            <div className="flex space-x-5">
              <div className="basis-2/4">
                <img
                  src="https://source.unsplash.com/random/400x400"
                  alt="Random Unsplash"
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
              <ul className="basis-2/4 text-left">
                {magazine.roadtrips.map((roadtrip) => (
                  <li className="text-xd text-gray-700">
                    {roadtrip.title} - {roadtrip.description}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </BaseLayout>
  );
}
