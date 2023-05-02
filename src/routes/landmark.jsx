import React, { useEffect, useState } from "react";

import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import BaseLayout from "../components/BaseLayout";
import Review from "../components/Review";
import landmarkServices from "../services/landmarkServices";
import reviewServices from "../services/reviewServices";

export default function LandmarkPage() {
  const { user } = useAuth();
  const { id } = useParams();

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

  const getLandmarkDetails = async (landmark_id) => {
    await landmarkServices
      .getLandmark(landmark_id)
      .then((res) => {
        setLandmark({
          ...res,
          reviews: res.reviews.reverse(),
        });
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleRemoveReview = async (review_id) => {
    try {
      await reviewServices.removeReview(review_id);
      getLandmarkDetails(id);
      toast.success("Review deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditReview = async (review_id, new_review) => {
    try {
      await reviewServices.updateReview(review_id, new_review);
      getLandmarkDetails(id);
      toast.success("Review updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await reviewServices.createReview(landmark.id, reviewForm);
      getLandmarkDetails(id);
      setReviewForm({
        review_text: "",
        rating: 0,
      });
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
        <div className="grid justify-center items-center rounded-3xl p-10 bg-gradient-to-b h-[26rem] from-blue-900 to-indigo-300">
          <h1 className="text-center text-white text-4xl">{landmark.name}</h1>
        </div>
        <div className="py-4 flex space-x-8">
          <p className="text-center text-neutral-500 text-sm mt-2">
            {landmark.amenity}
          </p>
          <p className="text-center text-neutral-500 text-sm mt-2">
            rating: {parseFloat(landmark.average_rating).toFixed(1)} / 5.0 (
            {landmark.reviews.length})
          </p>
        </div>
      </div>

      <div>
        {landmark.reviews.find(
          (review) => review.reviewer === user.username
        ) ? null : (
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto mt-28 mb-10"
          >
            <div className="mb-4">
              <label
                className="block text-neutral-700 font-medium mb-2"
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
                className="w-full border border-neutral-400 p-2 rounded-lg"
              ></textarea>
            </div>
            <div className="mb-4">
              <label
                className="block text-neutral-700 font-medium mb-2"
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
                        : "text-neutral-300"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setReviewForm({ ...reviewForm, rating: value });
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-3xl bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 font-medium"
            >
              Submit Review
            </button>
          </form>
        )}

        <div className="max-w-md mx-auto mt-10 space-y-4 pb-8">
          <h3 className="text-center text-4xl font-medium">Reviews</h3>
          {landmark.reviews.length !== 0 ? (
            <ul className="flex flex-col justify-center items-center space-y-8">
              {landmark.reviews.map((review, index) => (
                <li
                  key={index}
                  className="flex flex-col space-y-4 p-4 border border-neutral-300 rounded-3xl w-full relative"
                >
                  <Review
                    isOwner={review.reviewer === user.username}
                    reviewId={review.id}
                    rating={review.rating}
                    reviewer={review.reviewer}
                    review_text={review.review_text}
                    handleRemoveReview={() => handleRemoveReview(review.id)}
                    handleEditReview={handleEditReview}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">No reviews yet</p>
          )}
        </div>
      </div>
    </BaseLayout>
  );
}
