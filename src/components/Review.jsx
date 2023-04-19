import React, { useState } from "react";
import DialogLayout from "../components/DialogLayout";
import { useNavigate } from "react-router-dom";

export default function Review({
  reviewId,
  reviewer,
  isOwner,
  review_text,
  rating,
  handleRemoveReview,
  handleEditReview,
}) {
  const [reviewOptionMenu, setReviewOptionMenu] = useState(false);
  const [editReviewDialog, setEditReviewDialog] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    review_text,
    rating,
  });

  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-between items-center">
        <p
          onClick={(e) => {
            e.preventDefault();
            navigate(`/profile/${reviewer}`);
          }}
          className="text-lg font-bold hover:underline cursor-pointer"
        >
          {reviewer}
        </p>

        {isOwner && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setReviewOptionMenu(!reviewOptionMenu);
              setReviewForm({
                review_text: review_text,
                rating: rating,
              });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="grid gap-4">
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              className={`text-2xl ${
                value <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <p className="text-gray-500">{review_text}</p>
      </div>

      {editReviewDialog && (
        <DialogLayout>
          {" "}
          <div className="flex flex-col p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Edit Review</h2>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setEditReviewDialog(false)}
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
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditReview(reviewId, reviewForm);
              setEditReviewDialog(false);
            }}
            className="p-4"
          >
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
              className="w-full rounded-3xl bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 font-bold"
            >
              Submit Review
            </button>
          </form>
        </DialogLayout>
      )}
      {reviewOptionMenu && (
        <ul
          onMouseLeave={(e) => {
            e.preventDefault();
            setReviewOptionMenu(false);
          }}
          className="absolute right-4 top-8 mt-8 bg-white rounded-md shadow-lg overflow-hidden w-32 z-20"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              setEditReviewDialog(true);
            }}
            className="py-2 px-4 cursor-pointer hover:bg-gray-100 w-full"
          >
            Edit
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              handleRemoveReview();
            }}
            className="py-2 px-4 cursor-pointer hover:bg-gray-100 w-full"
          >
            Remove
          </button>
        </ul>
      )}
    </>
  );
}
