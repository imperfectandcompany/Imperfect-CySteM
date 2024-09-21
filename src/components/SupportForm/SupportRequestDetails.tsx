import { FunctionalComponent } from "preact";
import { useState, useEffect } from "preact/hooks";
import { getToken } from "../../utils";

interface Input {
  id: number;
  label: string;
  value: string;
  type: string;
}

interface Comment {
  id: number;
  comment: string;
  created_at: string;
}

export interface RequestDetails {
  request: {
    status: string;
    priority: string;
    email: string;
    created_at: string;
  };
  inputs: Input[];
  comments: Comment[];
}

export interface SupportRequestDetailsProps {
  supportRequestSlug: string;
}

const SupportRequestDetails: FunctionalComponent<
  SupportRequestDetailsProps
> = ({ supportRequestSlug }) => {
  const requestId = supportRequestSlug;
  const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const token = getToken();

  useEffect(() => {
    fetchSupportRequestDetails();
  }, [requestId]);

  const fetchSupportRequestDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.imperfectgamers.org/support/requests/${requestId}`,
        {
          method: "GET",
          headers: token ? { Authorization: token } : undefined,
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setRequestDetails(data.data);
      } else {
        setError("Failed to fetch support request details: " + data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching support request details:", error);
      setError("Error fetching support request details");
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await fetch(
        `https://api.imperfectgamers.org/support/requests/${requestId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify({ comment: newComment }),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        if (requestDetails) {
          setRequestDetails({
            ...requestDetails,
            comments: [
              ...requestDetails.comments,
              {
                id: data.comment_id,
                comment: newComment,
                created_at: new Date().toISOString(),
              },
            ],
          });
        }
        setNewComment("");
      } else {
        setError("Failed to add comment: " + data.message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Error adding comment");
    }
  };

  const handleChangeStatus = async (newStatus: string) => {
    try {
      const response = await fetch(
        `https://api.imperfectgamers.org/support/requests/${requestId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        if (requestDetails) {
          setRequestDetails({
            ...requestDetails,
            request: { ...requestDetails.request, status: newStatus },
          });
        }
      } else {
        setError("Failed to change status: " + data.message);
      }
    } catch (error) {
      console.error("Error changing status:", error);
      setError("Error changing status");
    }
  };

  const handleChangePriority = async (newPriority: string) => {
    try {
      const response = await fetch(
        `https://api.imperfectgamers.org/support/requests/${requestId}/priority`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify({ priority: newPriority }),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        if (requestDetails) {
          setRequestDetails({
            ...requestDetails,
            request: { ...requestDetails.request, priority: newPriority },
          });
        }
      } else {
        setError("Failed to change priority: " + data.message);
      }
    } catch (error) {
      console.error("Error changing priority:", error);
      setError("Error changing priority");
    }
  };

  const handleCancelMembership = async () => {
    // Display a confirmation alert before proceeding
    const confirmed = window.confirm("Are you sure you want to cancel their membership? This action cannot be undone.");
  
    if (!confirmed) {
      // If the user cancels the confirmation, stop further execution
      return;
    }
  
    try {
      setLoading(true);
  
      // Fetch the Tebex API key from environment variables
      const tebexApiKey = process.env.TEBEX_API_KEY;
  
      if (!tebexApiKey || !recurringPaymentReference) {
        throw new Error("Missing Tebex API key or Recurring Payment Reference");
      }
  
      // Make the request to cancel the membership via Tebex API
      const response = await fetch(
        `https://checkout.tebex.io/api/recurring-payments/${recurringPaymentReference}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-Tebex-Secret": tebexApiKey, // Include the Tebex API key in the headers
          },
        }
      );
  
      const data = await response.json();
  
      if (response.ok && data.id) {
        // Handle successful cancellation on Tebex
        console.log("Membership cancelled successfully on Tebex");
  
        // Notify your backend about the cancellation
        const apiResponse = await fetch(
          `https://api.imperfectgamers.org/support/requests/${requestId}/cancel-membership`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token || "",
            },
          }
        );
  
        const apiData = await apiResponse.json();
  
        if (apiData.status === "success") {
          // Handle successful cancellation on your server
          console.log("Membership cancelled successfully on Imperfect Gamers");
  
          // Show an alert to the user
          alert("Membership cancelled successfully!");
  
          // Optionally, update the UI or state to reflect the cancellation
        } else {
          // Handle failure on your backend
          setError("Failed to cancel membership on Imperfect Gamers: " + apiData.message);
        }
      } else {
        // Handle failure from Tebex
        setError("Failed to cancel membership on Tebex: " + data.cancel_reason);
      }
    } catch (error) {
      console.error("Error cancelling membership:", error);
      setError("Error cancelling membership");
    } finally {
      setLoading(false);
    }
  };
  


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!requestDetails) {
    return null;
  }

  const [isPremium, setIsPremium] = useState(false); // State for tracking premium status
  const [transactionId, setTransactionId] = useState(null); // State for tracking transaction ID
  const [recurringPaymentReference, setRecurringPaymentReference] =
    useState(null); // State for recurring payment reference

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (requestDetails?.request.email) {
        try {
          const response = await fetch(
            `https://api.imperfectgamers.org/premium/support/status/${requestDetails.request.email}`
          );
          const data = await response.json();

          if (response.ok && data.is_premium !== undefined) {
            // Set premium status
            setIsPremium(data.is_premium);

            // Set transaction ID if available
            if (data.payment_data?.transaction_id) {
              setTransactionId(data.payment_data.transaction_id);
            } else {
              console.warn("Transaction ID not found for this user");
            }

            // Set recurring payment reference if available
            if (data.payment_data?.recurring_payment_reference) {
              setRecurringPaymentReference(
                data.payment_data.recurring_payment_reference
              );
            } else {
              console.warn(
                "Recurring payment reference not found for this user"
              );
            }
          } else {
            throw new Error(data.message || "Failed to check premium status");
          }
        } catch (error) {
          console.error("Error checking premium status:", error);
        }
      }
    };

    checkPremiumStatus();
  }, [requestDetails?.request.email]); // Depend on the email from requestDetails

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Support Request Details</h2>
      <p>Status: {requestDetails.request.status}</p>
      <p>Priority: {requestDetails.request.priority}</p>
      <p>Email: {requestDetails.request.email}</p>
      <p>
        Created At:{" "}
        {new Date(requestDetails.request.created_at).toLocaleString()}
      </p>
{/* Conditionally render the Cancel Membership button and display transaction details */}
{isPremium ? (
  <div className="mt-2">
    <button
      onClick={handleCancelMembership}
      className="bg-red-500 text-white py-2 px-4 rounded"
      disabled={loading} // Disable the button when loading
    >
      {loading ? "Cancelling..." : "Cancel Membership"}
    </button>

    {/* Display transaction details */}
    <div className="mt-4">
      <div className="text-gray-800">
        <strong>Transaction ID:</strong>{" "}
        {transactionId ? transactionId : "No transaction data available"}
      </div>
      <div className="text-gray-800">
        <strong>Recurring Payment Reference:</strong>{" "}
        {recurringPaymentReference ? recurringPaymentReference : "No recurring payment reference available"}
      </div>
    </div>
  </div>
) : (
  <div className="text-sm text-gray-600 mt-2">
    They are currently not a premium member or in the website database.
  </div>
)}


      <h3 className="text-xl font-semibold mt-4">Inputs</h3>
      <ul className="space-y-2">
        {requestDetails.inputs.map((input) => (
          <li key={input.id} className="bg-gray-100 p-2 rounded">
            <strong>{input.label}:</strong> {input.value}
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mt-4">Comments</h3>
      <ul className="space-y-2">
        {requestDetails.comments.map((comment) => (
          <li key={comment.id} className="bg-gray-100 p-2 rounded">
            {comment.comment} - {new Date(comment.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
      <textarea
        value={newComment}
        onChange={(e) =>
          setNewComment((e.target as HTMLTextAreaElement).value ?? "")
        }
        className="w-full p-2 mt-2 border rounded"
        placeholder="Add a comment..."
      />
      <button
        onClick={handleAddComment}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
      >
        Add Comment
      </button>

      <h3 className="text-xl font-semibold mt-4">Change Status</h3>
      <select
        value={requestDetails.request.status}
        onChange={(e) =>
          handleChangeStatus((e.target as HTMLSelectElement).value)
        }
        className="p-2 border rounded"
      >
        <option value="open">Open</option>
        <option value="in progress">In Progress</option>
        <option value="closed">Closed</option>
      </select>

      <h3 className="text-xl font-semibold mt-4">Change Priority</h3>
      <select
        value={requestDetails.request.priority}
        onChange={(e) =>
          handleChangePriority((e.target as HTMLSelectElement).value)
        }
        className="p-2 border rounded"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
};

export default SupportRequestDetails;
