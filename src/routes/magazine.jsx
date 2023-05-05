import React, { useState } from "react";
import BaseLayout from "../components/BaseLayout";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import magazineServices from "../services/magazineServices";
import { useNavigate } from "react-router-dom";

import DialogLayout from "../components/DialogLayout";
import ConfirmDialog from "../components/ConfirmDialog";

export default function MagazinePage() {
  const { id } = useParams();
  const [magazine, setMagazine] = useState({});
  const [showEditMagazineModal, setShowCreateMagazineModal] = useState(false);
  const [showRemoveMagazineDialog, setShowRemoveMagazineDialog] =
    useState(false);
  const [magazineForm, setMagazineForm] = useState({
    title: "",
    description: "",
    roadtrips: [],
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const getMagazine = async () => {
    const data = await magazineServices.getMagazine(id);
    if (data) {
      setMagazine(data);
    }
  };

  useEffect(() => {
    getMagazine();
  }, [id]);

  return (
    <BaseLayout>
      <div className="container mt-20 mx-auto max-w-3xl h-screen space-y-8 ">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-medium">{magazine.title}</h1>
          <p className="text-md text-neutral-600 mt-2">
            <span className="font-medium">ID: {magazine.id}</span>
          </p>
        </div>
        <p className="text-md text-md text-neutral-700 mt-20 first-line:tracking-widest first-letter:text-3xl">
          {magazine.description}
        </p>
        {user?.is_admin && (
          <div className="flex justify-center">
            <button
              className="text-neutral-700 text-md text-center font-medium py-1 px-10 mt-5 ml-5 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                setMagazineForm({
                  title: magazine.title,
                  description: magazine.description,
                  roadtrips: magazine.roadtrips,
                });
                setShowCreateMagazineModal(!showEditMagazineModal);
              }}
            >
              Edit Magazine
            </button>
          </div>
        )}
        <ul className="grid grid-cols-1 gap-10 mt-7 pb-10">
          {magazine.roadtrips?.map((roadtrip) => (
            <li key={roadtrip.id}>
              <Link to={`/roadtrip/${roadtrip.id}`}>
                <div className="flex space-x-4 group">
                  <img
                    className="object-cover rounded-lg shadow-lg group-hover:opacity-75 transition-opacity duration-150"
                    src={`https://source.unsplash.com/400x225/?roadtrip&sig=${roadtrip.id}`}
                    alt="random"
                  />

                  <div className="flex flex-col justify-center">
                    <h2 className="text-2xl font-medium group-hover:underline">
                      {roadtrip.title}
                    </h2>
                    <p className="text-md text-neutral-600 mt-2">
                      {roadtrip.description}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {user?.is_admin && (
          <div className="flex justify-center">
            <button
              className="text-neutral-700 text-md text-center font-medium py-1 px-10 mt-5 ml-5 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                setShowRemoveMagazineDialog(!showRemoveMagazineDialog);
              }}
            >
              Remove Magazine
            </button>
          </div>
        )}
      </div>

      {showRemoveMagazineDialog && (
        <ConfirmDialog
          title="Remove Magazine"
          message="Are you sure you want to remove this magazine?"
          onConfirm={() => {
            magazineServices.removeMagazine(id);
            navigate("/magazines");
          }}
          onCancel={() => setShowRemoveMagazineDialog(false)}
        />
      )}

      {showEditMagazineModal && (
        <DialogLayout>
          <div className="flex flex-col p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Edit Magazine</h2>
              <button
                className="text-neutral-400 hover:text-neutral-500"
                onClick={() => {
                  setShowCreateMagazineModal(!showEditMagazineModal);
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
                setShowCreateMagazineModal(!showEditMagazineModal);
                magazineServices.updateMagazine(id, magazineForm);
                getMagazine();
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
              <button
                type="submit"
                className="bg-blue-400 text-white text-md text-center font-medium rounded-full py-1 px-10 mt-5"
              >
                Update Magazine
              </button>
            </form>
          </div>
        </DialogLayout>
      )}
    </BaseLayout>
  );
}
