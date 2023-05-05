import React, { useState, useEffect } from "react";
import BaseLayout from "../components/BaseLayout";

import { Link } from "react-router-dom";

import magazineServices from "../services/magazineServices";
import roadtripServices from "../services/roadtripServices";

import DialogLayout from "../components/DialogLayout";

import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";

export default function MagazinesPage() {
  const [magazines, setMagazines] = useState([]);
  const { user } = useAuth();

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
      const res = await magazineServices.createMagazine(newMagazine);
      setMagazineForm({
        title: "",
        description: "",
        roadtrips: [],
      });
      fetchMagazines();
      toast.success("Magazine created successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchMagazines();
  }, []);

  return (
    <BaseLayout>
      <div
        className="w-full bg-cover h-[26rem] bg-center overflow-hidden rounded-2xl text-opacity-90 items-center"
        style={{
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
      {user?.is_admin && (
        <button
          onClick={() => {
            fetchRoadtrips();
            setShowCreateMagazineModal(!showCreateMagazineModal);
          }}
          className="bg-blue-400 text-white text-md text-center font-medium rounded-full py-1 px-10 mt-5"
        >
          Add Magazine
        </button>
      )}

      <ul className="mt-8 grid grid-cols-1 gap-8">
        {magazines.map((magazine) => (
          <li key={magazine.id} className="mb-8">
            <div className="mb-3">
              <Link to={`/magazine/${magazine.id}`}>
                <h1 className="text-2xl font-medium text-neutral-800 hover:underline">
                  {magazine.title}
                </h1>
              </Link>
              <p className="text-xd text-neutral-700">{magazine.description}</p>
            </div>
            {magazine.roadtrips.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-80">
                <div className="relative overflow-clip group">
                  <img
                    src={`https://source.unsplash.com/400x225/?roadtrip&sig=${magazine.roadtrips[0].id}`}
                    className="object-cover rounded-lg shadow-lg w-full h-full group-hover:opacity-75 transition-opacity duration-150"
                    alt="Random Unsplash"
                  />
                  <Link to={`/roadtrip/${magazine.roadtrips[0].id}`}>
                    <span className="text-sm text-neutral-50 mr-2 absolute left-2 bottom-2 right-2 hover:underline">
                      {magazine.roadtrips[0].title}
                    </span>
                  </Link>
                </div>
                <ul className="grid grid-cols-2 gap-1">
                  {magazine.roadtrips.map(
                    (roadtrip, index) =>
                      index < 4 &&
                      index !== 0 && (
                        <li key={roadtrip.id}>
                          <div className="relative overflow-clip group">
                            <img
                              src={`https://source.unsplash.com/400x225/?roadtrip&sig=${roadtrip.id}`}
                              className="object-cover rounded-lg shadow-lg w-full h-full group-hover:opacity-75 transition-opacity duration-150"
                              alt="Random Unsplash"
                            />
                            <Link to={`/roadtrip/${roadtrip.id}`}>
                              <span className="text-sm text-neutral-100 mr-2 absolute left-2 bottom-2 right-2 hover:underline">
                                {roadtrip.title}
                              </span>
                            </Link>
                          </div>
                        </li>
                      )
                  )}

                  {magazine.roadtrips.length > 4 && (
                    <li>
                      <Link to={`/magazine/${magazine.id}`}>
                        <div className="flex justify-center items-center bg-neutral-50 rounded-lg shadow-lg w-full h-full">
                          <span className="text-sm text-neutral-900 hover:underline">
                            +{magazine.roadtrips.length - 4} more
                          </span>
                        </div>
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

      {showCreateMagazineModal && (
        <DialogLayout>
          <div className="flex flex-col p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Create New Magazine</h2>
              <button
                className="text-neutral-400 hover:text-neutral-500"
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
                <label className="text-neutral-700">Title</label>
                <input
                  type="text"
                  className="border-2 border-neutral-300 p-2 rounded-lg mt-1 focus:outline-none focus:border-blue-400"
                  value={magazineForm.title}
                  minLength={1}
                  onChange={(e) =>
                    setMagazineForm({
                      ...magazineForm,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex flex-col mt-5">
                <label className="text-neutral-700">Description</label>
                <input
                  type="text"
                  className="border-2 border-neutral-300 p-2 rounded-lg mt-1 focus:outline-none focus:border-blue-400"
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
                <div className="flex justify-between items-center">
                  <label className="text-neutral-700">Roadtrips</label>
                  <span className="text-xs text-neutral-700">
                    {magazineForm.roadtrips.length} selected
                  </span>
                </div>
                <div className="relative inline-block w-full text-neutral-700">
                  <div className="flex flex-col">
                    <div className="relative">
                      <select
                        className="w-full text-base placeholder-neutral-600 border rounded-lg appearance-none focus:shadow-outline"
                        placeholder="Regular input"
                        multiple={true}
                        value={magazineForm.roadtrips}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            magazineForm.roadtrips.includes(value) === false
                          ) {
                            setMagazineForm({
                              ...magazineForm,
                              roadtrips: [
                                ...magazineForm.roadtrips,
                                e.target.value,
                              ],
                            });
                          } else {
                            setMagazineForm({
                              ...magazineForm,
                              roadtrips: magazineForm.roadtrips.filter(
                                (roadtrip) => roadtrip !== value
                              ),
                            });
                          }
                        }}
                      >
                        {roadtrips.map((roadtrip) => (
                          <option
                          key={roadtrip.id}
                            className="text-base placeholder-neutral-600 appearance-none focus:shadow-outline py-4 px-2 hover:bg-neutral-100 hover:text-neutral-900"
                            value={roadtrip.id}
                          >
                            {roadtrip.title}
                          </option>
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
    </BaseLayout>
  );
}

// import React, { useState } from 'react';

// function MultiSelectDropdown() {
//   const [selectedOptions, setSelectedOptions] = useState([]);

//   const handleSelect = (event) => {
//     const value = event.target.value;
//     if (selectedOptions.includes(value)) {
//       setSelectedOptions(selectedOptions.filter(option => option !== value));
//     } else {
//       setSelectedOptions([...selectedOptions, value]);
//     }
//   }

//   return (
//     <div className='mt-20'>
//       <h3>Select multiple options:</h3>
//       <select multiple={true} value={selectedOptions} onChange={handleSelect}>
//         <option value="option1">Option 1</option>
//         <option value="option2">Option 2</option>
//         <option value="option3">Option 3</option>
//       </select>
//       <p>Selected options: {selectedOptions.join(', ')}</p>
//     </div>
//   );
// }

// export default MultiSelectDropdown;
