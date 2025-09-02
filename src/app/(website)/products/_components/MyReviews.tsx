/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

// Review টাইপ define করলাম
interface Review {
  _id: string;
  rating: number;
  comment: string;
  name?: string;
  review?: string;
  user?: any;
  food?: any;
}

interface ReviewsResponse {
  success: boolean;
  message: string;
  data: Review[];
}

function MyReviews({ productId }: { productId: string }) {
  const queryClient = useQueryClient();
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Fetch reviews
  const {
    data,
    isLoading,
    isError,
  } = useQuery<ReviewsResponse>({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/review/allreviews/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
  });

  const reviews = data?.data ?? [];

  // Delete review
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/review/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete review");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },
  });

  // Edit review
  const editMutation = useMutation({
    mutationFn: async (updatedReview: Review) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/review/${updatedReview._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedReview),
        }
      );
      if (!res.ok) throw new Error("Failed to update review");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      setEditingReview(null);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading reviews</div>;
  if (reviews.length === 0) return <div>No reviews found</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Reviews</h2>
      <ul className="space-y-4">
        {reviews.map((review) => (
          <li
            key={review._id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{review.name ?? "Anonymous"}</p>
              <p className="text-sm text-gray-600">Rating: {review.rating}</p>
              <p>{review.comment ?? review.review}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingReview(review)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm("Are you sure to delete this review?")) {
                    deleteMutation.mutate(review._id);
                  }
                }}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-bold mb-4">Edit Review</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editMutation.mutate(editingReview);
              }}
              className="space-y-3"
            >
              <input
                type="text"
                value={editingReview.name ?? ""}
                onChange={(e) =>
                  setEditingReview({ ...editingReview, name: e.target.value })
                }
                className="w-full border p-2 rounded"
                placeholder="Name"
              />
              <input
                type="number"
                value={editingReview.rating}
                onChange={(e) =>
                  setEditingReview({
                    ...editingReview,
                    rating: Number(e.target.value),
                  })
                }
                className="w-full border p-2 rounded"
                placeholder="Rating"
              />
              <textarea
                value={editingReview.comment ?? editingReview.review ?? ""}
                onChange={(e) =>
                  setEditingReview({
                    ...editingReview,
                    comment: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                placeholder="Review"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyReviews;
