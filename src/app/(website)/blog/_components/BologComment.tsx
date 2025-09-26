"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

function BologComment() {
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null); // কোন comment-এ reply হচ্ছে

  const params = useParams();
  const blogId = params.id;
  const queryClient = useQueryClient();

  // ✅ get session once at top level
  const { data: session } = useSession();
  const user = session?.user as any;
  const token = user?.accessToken;

  // Fetch comments
  const {
    data: productComment,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["productComment", blogId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/blogcomment/getsingecomment/${blogId}`
      );
      if (!res.ok) throw new Error("Failed to fetch comments");
      return res.json();
    },
    enabled: !!blogId,
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("User not authenticated");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/blogcomment/addblogcomment/${blogId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ blogId, text: commentText }),
        }
      );

      if (!res.ok) throw new Error("Failed to add comment");
      return res.json();
    },
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["productComment", blogId] });
    },
  });

  // ✅ Add reply mutation
  const replyMutation = useMutation({
    mutationFn: async ({ commentId, text }: { commentId: string; text: string }) => {
      if (!token) throw new Error("User not authenticated");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/blogcomment/replycomment/${commentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!res.ok) throw new Error("Failed to add reply");
      return res.json();
    },
    onSuccess: () => {
      setReplyText("");
      setActiveReplyId(null);
      queryClient.invalidateQueries({ queryKey: ["productComment", blogId] });
    },
  });

  const handleAddComment = () => {
    if (commentText.trim()) {
      commentMutation.mutate();
    }
  };

  const handleAddReply = (commentId: string) => {
    if (replyText.trim()) {
      replyMutation.mutate({ commentId, text: replyText });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div className="text-white bg-black container mx-auto rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700 bg-gray-800">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
          Comments
        </h2>
        <span className="text-xs text-gray-400">
          {productComment?.comments?.length || 0} total
        </span>
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div className="flex items-center justify-center py-6 text-gray-400">
          <Loader2 className="animate-spin w-5 h-5 mr-2" /> Loading comments...
        </div>
      )}
      {isError && (
        <div className="text-center py-6 text-red-400">
          Failed to load comments 😢
        </div>
      )}

      {/* Comments List */}
      <div id="comment" className="divide-y divide-gray-800">
        {productComment?.comments?.map((comment: any) => (
          <div key={comment._id} className="px-5 py-4 hover:bg-gray-800 transition-colors">
            <div className="flex items-start space-x-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                {comment.userId?.name?.[0]}
              </div>

              {/* Comment Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{comment.userId?.name}</h4>
                  <span className="text-xs text-gray-400">
                    {formatTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mt-1">{comment.text}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                  <button className="hover:text-blue-400 transition-colors">Like</button>
                  <button
                    onClick={() =>
                      setActiveReplyId(activeReplyId === comment._id ? null : comment._id)
                    }
                    className="hover:text-blue-400 transition-colors"
                  >
                    Reply
                  </button>
                </div>

                {/* ✅ Replies */}
                {comment.replies?.length > 0 && (
                  <div className="mt-3 space-y-2 pl-6 border-l border-gray-700">
                    {comment.replies.map((reply: any) => (
                      <div key={reply._id} className="flex items-start space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                          {reply.userId?.name?.[0]}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{reply.userId?.name}</span>
                            <span className="text-xs text-gray-400">
                              {formatTime(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ✅ Reply Input */}
                {activeReplyId === comment._id && (
                  <div className="mt-3 flex items-start space-x-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500"
                      rows={1}
                    />
                    <button
                      onClick={() => handleAddReply(comment._id)}
                      disabled={!replyText.trim() || replyMutation.isPending}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                        replyText.trim() && !replyMutation.isPending
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : "bg-gray-600 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {replyMutation.isPending ? "Sending..." : "Reply"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {!isLoading && productComment?.comments?.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-6">
            No comments yet. Be the first one!
          </p>
        )}
      </div>

      {/* Comment Input Section */}
      <div className="px-5 py-4 border-t border-gray-700 bg-gray-800">
        <div className="flex items-start space-x-3">
          {/* Current User Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
            T
          </div>

          {/* Input Box */}
          <div className="flex-1">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={token ? "Write a comment..." : "Login to write a comment"}
              disabled={!token}
              className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              rows={2}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim() || commentMutation.isPending || !token}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  commentText.trim() && !commentMutation.isPending && token
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                {commentMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-1" />
                )}
                {commentMutation.isPending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BologComment;
