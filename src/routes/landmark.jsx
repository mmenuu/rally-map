import React, { useEffect, useState } from "react";

import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import BaseLayout from "../components/BaseLayout";

import landmarkServices from "../services/landmarkServices";
import reviewServices from "../services/reviewServices";
export default function LandmarkPage() {
  const [landmark, setLandmark] = useState({
    name: "",
    amenity: "",
    average_rating: 0,
    reviews: [],
  });
  const [reviewForm, setReviewForm] = useState({
    review_text: "",
    rating: 0,
  });

  const { user } = useAuth();

  const { id } = useParams();

  const getLandmarkDetails = async (landmark_id) => {
    await landmarkServices
      .getLandmark(landmark_id)
      .then((res) => {
        setLandmark(res);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await reviewServices.createReview(landmark.id, reviewForm);
      setLandmark({ ...landmark, reviews: [...landmark.reviews, reviewForm] });
      setReviewForm({ review_text: "", rating: 0 });
      toast.success(res.detail);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getLandmarkDetails(id);
  }, []);

  return (
    <BaseLayout>
      <div>
        <div className="grid justify-center items-center rounded-3xl p-10 bg-gradient-to-b h-[30vh] from-blue-900 to-indigo-300">
          <h1 className="text-center text-white text-4xl">{landmark.name}</h1>
        </div>
        <p>{landmark.amenity}</p>
        <p>
          rating: {parseFloat(landmark.average_rating).toFixed(1)} / 5.0 (
          {landmark.reviews.length})
        </p>
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
              value={reviewForm.review_text}
              onChange={(e) => {
                setReviewForm({ ...reviewForm, review_text: e.target.value });
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
                    value <= reviewForm.rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() =>
                    setReviewForm({ ...reviewForm, rating: value })
                  }
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

        <div className="max-w-md mx-auto mt-10 space-y-4 pb-8">
          <h3 className="text-center text-4xl font-bold">Reviews</h3>
          <ul className="flex flex-col justify-center items-center space-y-8">
            {landmark.reviews.map((review, index) => (
              <li
                key={index}
                className="flex flex-col space-y-4 p-4 border border-gray-300 rounded-3xl w-full"
              >
                <div className="flex justify-between">
                  <p className="text-lg font-bold">{review.reviewer}</p>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <span
                        key={value}
                        className={`text-2xl ${
                          value <= review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p>{review.review_text}</p>
                {user && user.id === review.reviewer && (
                  <button
                    className="hover:underline text-red-500"
                    onClick={async (e) => {
                      e.preventDefault();
                      await reviewServices.removeReview(review.id);
                      setLandmark({
                        ...landmark,
                        reviews: landmark.reviews.filter(
                          (r) => r.id !== review.id
                        ),
                      });
                    }}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BaseLayout>
  );
}
