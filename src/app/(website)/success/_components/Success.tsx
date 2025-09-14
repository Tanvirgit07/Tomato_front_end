"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

async function fetchSession(sessionId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/session/${sessionId}`
  );
  if (!res.ok) throw new Error("Failed to fetch session");
  return res.json();
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data, isLoading, error } = useQuery({
    queryKey: ["paymentSession", sessionId],
    queryFn: () => fetchSession(sessionId!),
    enabled: !!sessionId,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">
          Error loading payment details
        </p>
      </div>
    );

  const session = data.session;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8 sm:p-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-green-600 mb-2">
            🎉 Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase, {session.customer_details?.name}!
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-xl mb-6">
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Customer Info
          </h2>
          <p>
            <span className="font-medium">Name:</span>{" "}
            {session.customer_details?.name}
          </p>
          <p>
            <span className="font-medium">Email:</span>{" "}
            {session.customer_details?.email}
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl mb-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">
            Order Summary
          </h2>
          <p className="mb-2">
            <span className="font-medium">Total Amount:</span> $
            {(session.amount_total / 100).toFixed(2)}
          </p>
          <ul className="divide-y divide-blue-200">
            {session.line_items.data.map((item: any) => (
              <li
                key={item.id}
                className="py-2 flex justify-between items-center"
              >
                <span>{item.description} x {item.quantity}</span>
                <span className="font-semibold">
                  ${(item.amount_total / 100).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center mt-6">
          <a
            href="/"
            className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-green-700 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
