import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import BaseLayout from "../components/BaseLayout";

import landmarkServices from "../services/landmarkServices";
import reviewServices from "../services/reviewServices";
export default function LandmarkPage() {
  const [landmark, setLandmark] = useState({});
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({
    review_text: "",
    rating: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await reviewServices.createReview(landmark.id, review);
      setReviews([...reviews, review]);
      setReview({ review_text: "", rating: 0 });
      toast.success(res.detail);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const { id } = useParams();

  const getLandmarkDetails = async (landmark_id) => {
    await landmarkServices
      .getLandmark(landmark_id)
      .then((res) => {
        setLandmark(res);
        setReviews(res.reviews);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (id) {
      getLandmarkDetails(id);
    }
  }, [reviews]);

  return (
    <BaseLayout>
      <div>
        <div className="grid justify-center items-center rounded-3xl p-10 bg-gradient-to-b h-[30vh] from-blue-900 to-indigo-300">
          <h1 className="text-center text-white text-4xl">{landmark.name}</h1>
        </div>
        <p>{landmark.amenity}</p>
      </div>

      <div>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-28 mb-10">
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="review"
            >
              Review
            </label>
            <textarea
              id="review"
              name="review"
              value={review.review_text}
              onChange={(e) => {
                setReview({ ...review, review_text: e.target.value });
              }}
              required
              className="w-full border border-gray-400 p-2 rounded-lg"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="rating"
            >
              Rating
            </label>
            <div className="flex space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  className={`text-2xl ${
                    value <= review.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setReview({ ...review, rating: value })}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-3xl bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 font-bold"
          >
            Submit Review
          </button>
        </form>

        <h1 className="text-center text-4xl font-bold">Reviews</h1>
        <ul className="flex flex-col space-y-8">
          {reviews &&
            reviews.map((review) => {
              return (
                <li className="border-2 border-black p-4" key={review.id}>
                  <p>{review.reviewer}</p>
                  <p>{review.review_text}</p>
                  <p>{review.rating}</p>
                </li>
              );
            })}
        </ul>
      </div>
    </BaseLayout>
  );
}
