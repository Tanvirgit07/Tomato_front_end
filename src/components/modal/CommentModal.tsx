"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";

interface CommentModalProps {
  blogId: string;
}

function CommentModal({ blogId }: CommentModalProps) {
  const [commentText, setCommentText] = useState("");
  const { data: session } = useSession();
  const user = session?.user as any;
  const token = user?.accessToken;
  console.log(token)

  console.log("blogId", blogId);

  const commentMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/blogcomment/addblogcomment/${blogId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // যদি auth থাকে
          },
          body: JSON.stringify({ blogId, text: commentText }),
        }
      );

      if (!res.ok) throw new Error("Failed to add comment");
      return res.json();
    },
    onSuccess: () => {
      setCommentText("");
      alert("Comment added successfully"); // চাইলে Sonner Toast ব্যবহার করা যায়
    },
    onError: (err: any) => {
      alert(err.message || "Failed to add comment");
    },
  });

  return (
    <Dialog>
      {/* Trigger */}
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors duration-300">
          <MessageCircle className="w-5 h-5 text-indigo-500" />
          <span className="text-sm font-medium">Add Comment</span>
        </button>
      </DialogTrigger>

      {/* Modal Content */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Comment</DialogTitle>
          <DialogDescription>
            Share your thoughts about this blog post.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="comment">Your Comment</Label>
            <Input
              id="comment"
              type="text"
              placeholder="Write something..."
              className="w-full"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            onClick={() => commentMutation.mutate()}
            disabled={commentText.trim() === ""}
          >
            Submit Comment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentModal;
