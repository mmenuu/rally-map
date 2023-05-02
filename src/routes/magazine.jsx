import React, { useState } from "react";
import BaseLayout from "../components/BaseLayout";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import magazineServices from "../services/magazineServices";

export default function MagazinePage() {
  const { id } = useParams();
  const [magazine, setMagazine] = useState({});

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
                    <h2 className="text-2xl font-medium group-hover:underline">{roadtrip.title}</h2>
                    <p className="text-md text-neutral-600 mt-2">
                      {roadtrip.description}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </BaseLayout>
  );
}
