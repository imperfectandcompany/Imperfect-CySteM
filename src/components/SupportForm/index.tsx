import { memo } from "preact/compat";
import { useState, useCallback, useEffect } from "preact/hooks";
import { FunctionalComponent } from "preact";
import { Link } from "preact-router";
import "tailwindcss/tailwind.css";
import Breadcrumb from "../Breadcrumb";

export interface SubIssueInput {
  label: string;
  type: string;
  placeholder: string;
  tooltip?: string; // Optional tooltip for more detailed information
}

const issueCategories: Record<string, string[]> = {
  "Website Issue": [
    "Cannot log in",
    "Unauthorized activity",
    "Update personal information",
    "Website not loading",
    "Error messages",
  ],
  "Gameplay Issue": ["Map Issues", "Surf Mechanics", "Player Behavior"],
  "Premium Membership Issue": ["Membership Benefits", "Billing and Payments"],
  "Other Issues": ["General Inquiry"],
};

const subIssuesInputs: Record<string, SubIssueInput[]> = {
  "Cannot log in": [
    {
      label: "Username or Email",
      type: "text",
      placeholder: "Enter username or email used",
      tooltip: "Use the email or username associated with your account.",
    },
  ],
  "Unauthorized activity": [
    {
      label: "Description of Activity",
      type: "text",
      placeholder: "Describe the activity",
      tooltip: "Detail any unauthorized activity on your account.",
    },
    {
      label: "Date of Occurrence",
      type: "date",
      placeholder: "Select the date of occurrence",
      tooltip: "When did you first notice the unauthorized activity?",
    },
  ],
  "Update personal information": [
    {
      label: "Information to Update",
      type: "text",
      placeholder: "Specify the information to be updated",
      tooltip:
        "Specify which part of your personal information needs updating.",
    },
  ],
  "Website not loading": [
    {
      label: "Browser and Version",
      type: "text",
      placeholder: "Enter browser and version used",
      tooltip:
        "Identify the browser and its version where you experienced the issue.",
    },
  ],
  "Error messages": [
    {
      label: "Error Messages",
      type: "text",
      placeholder: "Describe the error messages received",
      tooltip: "Provide the exact error messages you saw, if possible.",
    },
  ],
  "Map Issues": [
    {
      label: "Map Name",
      type: "text",
      placeholder: "Enter the map name",
      tooltip: "Name of the map where the issue occurred.",
    },
    {
      label: "Description",
      type: "textarea",
      placeholder: "Describe what was happening",
      tooltip: "Explain what issue you encountered on the map.",
    },
  ],
  "Surf Mechanics": [
    {
      label: "Surf Mechanic",
      type: "text",
      placeholder: "Specify the surf mechanic",
      tooltip: "Describe the surf mechanic that is not working as expected.",
    },
    {
      label: "Date of Issue",
      type: "date",
      placeholder: "Select the date this issue was experienced",
      tooltip: "When did you encounter the issue with the surf mechanic?",
    },
  ],
  "Player Behavior": [
    {
      label: "Username or Steam ID",
      type: "text",
      placeholder: "Enter username or Steam ID",
      tooltip: "Provide the username or Steam ID of the player in question.",
    },
    {
      label: "Server",
      type: "text",
      placeholder: "Enter the server where the issue occurred",
      tooltip: "Which server were you on when the issue happened?",
    },
    {
      label: "Description",
      type: "textarea",
      placeholder: "Describe what occurred",
      tooltip: "Detail the behavior that was problematic.",
    },
  ],
  "Membership Benefits": [
    {
      label: "Expected vs. Experienced",
      type: "text",
      placeholder: "Specify what was expected vs. what was experienced",
      tooltip:
        "Explain any discrepancies between what was promised and what was received.",
    },
  ],
  "Billing and Payments": [
    {
      label: "Transaction ID",
      type: "text",
      placeholder: "Enter Transaction ID",
      tooltip: "Provide the transaction ID for any payment inquiries.",
    },
    {
      label: "Error Received",
      type: "text",
      placeholder: "Describe any error received",
      tooltip: "If you received an error during payment, describe it here.",
    },
  ],
  "General Inquiry": [
    {
      label: "Inquiry Details",
      type: "textarea",
      placeholder: "Describe your inquiry",
      tooltip: "Provide as much detail as possible about your inquiry.",
    },
  ],
};

type InputFieldProps = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value?: string;
  onChange: (e: Event) => void;
  describedBy: string;
  tooltip?: string;
};

const InputField = memo(
  ({
    id,
    label,
    type,
    placeholder,
    value,
    onChange,
    describedBy,
    tooltip,
  }: InputFieldProps) => {
    return (
      <div className="mb-4 animate-fade-in">
        <label
          htmlFor={id}
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          {label}
          {tooltip && (
            <span className="relative group ml-2">
              <i className="fas fa-info-circle text-gray-500 cursor-help"></i>
              <span className="absolute left-1/2 bottom-full transform -translate-x-1/2 translate-y-2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {tooltip}
              </span>
            </span>
          )}
        </label>
        {type === "textarea" ? (
          <textarea
            id={id}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
            rows={4}
            placeholder={placeholder}
            value={value || ""}
            onChange={onChange}
            required
            aria-label={label}
            aria-describedby={describedBy}
          ></textarea>
        ) : (
          <input
            id={id}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
            type={type}
            placeholder={placeholder}
            value={value || ""}
            onChange={onChange}
            required
            aria-label={label}
            aria-describedby={describedBy}
          />
        )}
      </div>
    );
  }
);

function useSupportForm() {
  const [email, setEmail] = useState("");
  const [issueCategory, setIssueCategory] = useState("");
  const [subIssue, setSubIssue] = useState("");
  const [details, setDetails] = useState<{ [key: string]: string }>({});
  const [progress, setProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [emailValid, setEmailValid] = useState(true);
  const [reviewMode, setReviewMode] = useState(false);
  const [subIssueTransition, setSubIssueTransition] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);

  const handleIssueChange = useCallback((event: Event) => {
    const newIssueCategory = (event.target as HTMLSelectElement).value;
    setIssueCategory(newIssueCategory);
    setSubIssue("");
    setDetails({});
    setCurrentStep(1);
    setSubIssueTransition(true);
    setTimeout(() => setSubIssueTransition(false), 500);
  }, []);

  const handleSubIssueChange = useCallback((event: Event) => {
    const newSubIssue = (event.target as HTMLSelectElement).value;
    setSubIssue(newSubIssue);
    setDetails({});
    setCurrentStep(2);
  }, []);

  const handleDetailChange = useCallback((key: string, value: string) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleBack = useCallback(() => {
    if (currentStep === 1) {
      setIssueCategory("");
      setCurrentStep(0);
    } else if (currentStep === 2) {
      setSubIssue("");
      setCurrentStep(1);
    }
  }, [currentStep]);

  useEffect(() => {
    const totalFields = 3; // Email, Issue Category, Sub-Issue
    let filledFields = 0;
    if (email) filledFields++;
    if (issueCategory) filledFields++;
    if (subIssue) filledFields++;

    const inputs = subIssuesInputs[subIssue] || [];
    const totalInputs = inputs.length;
    const filledInputs = inputs.filter((input) => details[input.label]).length;

    const totalProgressFields = totalFields + totalInputs;
    const totalFilledFields = filledFields + filledInputs;

    const progressPercentage = (totalFilledFields / totalProgressFields) * 100;
    setProgress(progressPercentage);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email, issueCategory, subIssue, details]);

  useEffect(() => {
    const interval = setInterval(() => {
      const progressDifference = Math.abs(displayProgress - progress);
      if (progressDifference > 0.5) {
        // Threshold of 0.5% to avoid minor fluctuating changes
        setDisplayProgress((prev) => {
          return progress > prev ? prev + 1 : prev - 1;
        });
      }
    }, 10);
    return () => clearInterval(interval);
  }, [displayProgress, progress]);

  return {
    email,
    setEmail,
    issueCategory,
    subIssue,
    details,
    progress,
    submitted,
    setSubmitted,
    loading,
    setLoading,
    currentStep,
    setCurrentStep,
    emailValid,
    setEmailValid,
    reviewMode,
    setReviewMode,
    subIssueTransition,
    displayProgress,
    handleIssueChange,
    handleSubIssueChange,
    handleDetailChange,
    handleBack,
  };
}

function SupportForm() {
  const {
    email,
    setEmail,
    issueCategory,
    subIssue,
    details,
    progress,
    submitted,
    setSubmitted,
    loading,
    setLoading,
    currentStep,
    setCurrentStep,
    emailValid,
    setEmailValid,
    reviewMode,
    setReviewMode,
    subIssueTransition,
    displayProgress,
    handleIssueChange,
    handleSubIssueChange,
    handleDetailChange,
    handleBack,
  } = useSupportForm();

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (!emailValid) {
      return;
    }
    setLoading(true);
    // Mock API request
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
    setLoading(false);
    setSubmitted(true);
  };

  const renderInputs = () => {
    if (!subIssue || reviewMode) return null;
    return subIssuesInputs[subIssue].map((input, index) => (
      <InputField
        key={index}
        id={`input-${index}`}
        label={input.label}
        type={input.type}
        placeholder={input.placeholder}
        value={details[input.label]}
        onChange={(e: Event) => {
          const target = e.target as HTMLInputElement;
          handleDetailChange(input.label, target.value);
        }}
        describedBy={`help-${index}`}
        tooltip={input.tooltip ?? ""}
      />
    ));
  };

  const renderReview = () => {
    return (
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-4">
              Final Review Before Submission
            </h2>
          </div>
          <div>
            <button
              className="mt-2 px-6 py-2 bg-black/15 rounded hover:cursor-pointer focus:cursor-auto focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 ease-in-out !z-20"
              onClick={() => setReviewMode(false)}
            >
              Edit Details
            </button>
          </div>
        </div>
        <div className="mb-4">
          <strong>Email:</strong> {email}
        </div>
        <div className="mb-4">
          <strong>Issue Category:</strong> {issueCategory}
        </div>
        <div className="mb-4">
          <strong>Sub-Issue:</strong> {subIssue}
        </div>
        {Object.entries(details).map(([key, value], index) => (
          <div key={index} className="mb-4">
            <strong>{key}:</strong> {value}
          </div>
        ))}
        <button
          className={`relative bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out disabled:opacity-50 ${
            progress !== 100 || loading ? "button-disabled" : ""
          }`}
          type="submit"
          disabled={progress !== 100 || loading}
          aria-disabled={progress !== 100 || loading}
        >
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="spinner"></div>
            </div>
          ) : null}
          Submit Request
        </button>
      </div>
    );
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayProgress / 100) * circumference;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">
          Support Request Submitted Successfully!
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Thank you for reaching out. We will get back to you as soon as
          possible.
        </p>
        <Link href="/">
          <button className="mt-2 px-6 py-2 bg-black/15 rounded hover:cursor-pointer focus:cursor-auto focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 ease-in-out !z-20">
            Return to Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Breadcrumb path={"/support"} />
      <main>
        <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
          <form onSubmit={handleSubmit} className="p6 sm:px-0">
            <div className="border-gray-200 rounded-lg h-auto bg-white">
              <div className="flex justify-between">
                <div className="mb-6">
                  <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl">
                    Submit a{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-500">
                      Support Request
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 sm:text-2xl lg:text-2xl mt-2">
                    How can we assist you today? Please select the relevant
                    category to help us serve you better.
                  </p>
                </div>
                <div className="mb-4 flex justify-center items-center relative">
                  <svg
                    className="progress-ring"
                    width="60"
                    height="60"
                    aria-label={`Form completion progress: ${Math.round(
                      displayProgress
                    )}%`}
                  >
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          style={{
                            stopColor: "rgb(165, 180, 252)",
                            stopOpacity: 1,
                          }}
                        />
                        <stop
                          offset="100%"
                          style={{
                            stopColor: "rgb(59, 130, 246)",
                            stopOpacity: 1,
                          }}
                        />
                      </linearGradient>
                    </defs>
                    <circle
                      className="progress-ring__circle"
                      stroke="gray"
                      strokeWidth="4"
                      fill="transparent"
                      r="20"
                      cx="30"
                      cy="30"
                    />
                    <circle
                      className="progress-ring__circle"
                      stroke={
                        displayProgress === 100
                          ? emailValid
                            ? "green"
                            : "yellow"
                          : "url(#gradient)"
                      }
                      strokeWidth="4"
                      fill="transparent"
                      r="20"
                      cx="30"
                      cy="30"
                      strokeDasharray={`${circumference} ${circumference}`}
                      strokeDashoffset={offset}
                      style={{
                        transition: "stroke-dashoffset 0.35s, stroke 0.35s",
                        transform: "rotate(-90deg)",
                        transformOrigin: "50% 50%",
                      }}
                    />
                  </svg>
                  <span className="absolute text-xs font-semibold">
                    {displayProgress === 100 ? (
                      emailValid ? (
                        <i className="fas fa-check text-green-500"></i>
                      ) : (
                        <i className="fas fa-exclamation-triangle text-yellow-500"></i>
                      )
                    ) : (
                      `${Math.round(displayProgress)}%`
                    )}
                  </span>
                </div>
              </div>
              {!reviewMode && currentStep > 0 && (
                <div className="text-end">
                  <button
                    className="mb-6 justify-end items-end hover:cursor-pointer focus:cursor-auto focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 ease-in-out !z-20"
                    type="button"
                    onClick={handleBack}
                  >
                    <i className="fas fa-arrow-left mr-2"></i> Go Back to
                    Previous Step
                  </button>
                </div>
              )}
              {!reviewMode && (
                <div className="mb-4">
                  <label
                    htmlFor="email-input"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Your Email Address
                  </label>
                  <input
                    id="email-input"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out ${
                      !emailValid && progress === 100 ? "border-red-500" : ""
                    }`}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail((e.target as HTMLInputElement).value);
                      setEmailValid(false);
                    }}
                    placeholder="Enter your email address"
                    required
                    aria-label="Your Email Address"
                    aria-describedby="email-help"
                  />
                  {!emailValid && progress === 100 && (
                    <p className="text-xs text-red-500 mt-1">
                      Please enter a valid email address to continue.
                    </p>
                  )}
                  <p id="email-help" className="text-xs text-gray-500 mt-1">
                    We'll never share your email with anyone else.
                  </p>
                </div>
              )}
              {!reviewMode && currentStep === 0 && (
                <div className="mb-4">
                  <label
                    htmlFor="issue-category-select"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Issue Category
                  </label>
                  <select
                    id="issue-category-select"
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                    value={issueCategory}
                    onChange={handleIssueChange}
                    required
                    aria-label="Select Issue Category"
                    aria-describedby="category-help"
                  >
                    <option value="" disabled>
                      Select an Issue Category
                    </option>
                    {Object.keys(issueCategories).map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                  <p id="category-help" className="text-xs text-gray-500 mt-1">
                    Select the category that best describes your issue.
                  </p>
                </div>
              )}
              {!reviewMode && currentStep === 1 && (
                <div
                  className={`mb-4 ${
                    subIssueTransition ? "animate-fade-in" : ""
                  }`}
                >
                  <label
                    htmlFor="sub-issue-select"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Sub-Issue
                  </label>
                  <select
                    id="sub-issue-select"
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                    value={subIssue}
                    onChange={handleSubIssueChange}
                    required
                    aria-label="Select Sub-Issue"
                    aria-describedby="sub-issue-help"
                  >
                    <option value="" disabled>
                      Select a Sub-Issue
                    </option>
                    {issueCategories[issueCategory].map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                  <p id="sub-issue-help" className="text-xs text-gray-500 mt-1">
                    Select the specific issue you are experiencing.
                  </p>
                </div>
              )}
              {!reviewMode && currentStep === 2 && renderInputs()}
              {!reviewMode && currentStep === 2 && (
                <div>
                  <button
                    className={`relative w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                      progress < 100 || !emailValid
                        ? "bg-gray-400"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-300`}
                    type="button"
                    onClick={() => setReviewMode(true)}
                    disabled={progress < 100 || !emailValid}
                  >
                    Review and Submit
                  </button>
                </div>
              )}
              {reviewMode && renderReview()}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default SupportForm;
