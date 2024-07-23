import { memo } from "preact/compat";
import { useState, useCallback, useEffect } from "preact/hooks";
import { FunctionalComponent } from "preact";
import { Link } from "preact-router";
import "tailwindcss/tailwind.css";
import Breadcrumb from "../Breadcrumb";
import { getToken } from "../../utils";

interface Input {
  input_id: number;
  input_type: string;
  input_version_id: number;
  input_label: string;
  options: string[];
}

interface Category {
  category_id: number;
  category_name: string;
  default_priority: string | null;
  subcategories: Category[];
  inputs: Input[];
  issue: Issue | null;
}

interface Issue {
  issue_version_id: number;
  issue_description: string;
}

interface Props {}

type InputFieldProps = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value?: string;
  onChange: (e: Event) => void;
  describedBy: string;
  tooltip?: string;
  options?: string[];
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
    options = [],
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
        ) : type === "dropdown" ? (
          <select
            id={id}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
            value={value || ""}
            onChange={onChange}
            required
            aria-label={label}
            aria-describedby={describedBy}
          >
            <option value="" disabled>
              Please select an option
            </option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
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

function useSupportForm(token: string | false) {
  const [email, setEmail] = useState("");
  const [issueCategory, setIssueCategory] = useState<Category | null>(null);
  const [subIssue, setSubIssue] = useState<Category | null>(null);
  const [details, setDetails] = useState<{ [key: string]: string }>({});
  const [progress, setProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [emailValid, setEmailValid] = useState(true);
  const [reviewMode, setReviewMode] = useState(false);
  const [subIssueTransition, setSubIssueTransition] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [inputs, setInputs] = useState<Input[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleIssueChange = useCallback(
    (event: Event) => {
      const categoryId = parseInt((event.target as HTMLSelectElement).value, 10);
      const selectedCat = categories.find((cat) => cat.category_id === categoryId);

      if (selectedCat) {
        setIssueCategory(selectedCat);
        setSubIssue(null);
        setDetails({});
        setCurrentStep(1);
        setSubcategories(selectedCat.subcategories);
        setInputs(selectedCat.inputs);
        setSubIssueTransition(true);
        setTimeout(() => setSubIssueTransition(false), 500);
      }
    },
    [categories]
  );

  const handleSubIssueChange = useCallback(
    (event: Event) => {
      const subcategoryId = parseInt((event.target as HTMLSelectElement).value, 10);
      const selectedSubcat = subcategories.find((cat) => cat.category_id === subcategoryId);

      if (selectedSubcat) {
        setSubIssue(selectedSubcat);
        setDetails({});
        setCurrentStep(2);
        setInputs(selectedSubcat.inputs);
      }
    },
    [subcategories]
  );

  const handleDetailChange = useCallback((key: string, value: string) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleBack = useCallback(() => {
    if (currentStep === 1) {
      setIssueCategory(null);
      setCurrentStep(0);
    } else if (currentStep === 2) {
      setSubIssue(null);
      setCurrentStep(1);
    }
  }, [currentStep]);

  useEffect(() => {
    const totalFields = 3; // Email, Issue Category, Sub-Issue
    let filledFields = 0;
    if (email) filledFields++;
    if (issueCategory) filledFields++;
    if (subIssue) filledFields++;

    const totalInputs = inputs.length;
    const filledInputs = inputs.filter((input) => details[input.input_label]).length;

    const totalProgressFields = totalFields + totalInputs;
    const totalFilledFields = filledFields + filledInputs;

    const progressPercentage = (totalFilledFields / totalProgressFields) * 100;
    setProgress(progressPercentage);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email, issueCategory, subIssue, details, inputs]);

  useEffect(() => {
    const interval = setInterval(() => {
      const progressDifference = Math.abs(displayProgress - progress);
      if (progressDifference > 0.5) {
        setDisplayProgress((prev) => {
          return progress > prev ? prev + 1 : prev - 1;
        });
      }
    }, 10);
    return () => clearInterval(interval);
  }, [displayProgress, progress]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.imperfectgamers.org/support/requests/populate/all', {
          headers: {
            Authorization: token || '',
          },
        });
        const data = await response.json();
        if (data.status === 'success') {
          const validCategories = filterValidCategories(data.data);
          setCategories(validCategories);
        } else {
          setError('Failed to fetch form data: ' + data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError('Error fetching form data');
        setLoading(false);
      }
    };

    fetchFormData();
  }, [token]);

  const filterValidCategories = (categories: Category[]): Category[] => {
    return categories.filter((category) => isValidCategory(category));
  };

  const isValidCategory = (category: Category): boolean => {
    if (category.subcategories.length > 0) {
      category.subcategories = category.subcategories.filter((subcategory) =>
        isValidCategory(subcategory)
      );
      return category.subcategories.length > 0 || (category.inputs.length > 0 && category.issue !== null);
    }
    return category.inputs.length > 0 && category.issue !== null;
  };

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
    categories,
    subcategories,
    inputs,
    error,
    setError,
  };
}

const SupportForm: FunctionalComponent<Props> = () => {
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
    categories,
    subcategories,
    inputs,
    error,
    setError,
  } = useSupportForm(getToken());

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    const requestData = {
      email,
      category_id: subIssue ? subIssue.category_id : issueCategory?.category_id,
      inputs: inputs.map((input) => ({
        input_id: input.input_id,
        value: details[input.input_label] || ""
      })),
    };

    // Validate required inputs
    let validationFailed = false;
    requestData.inputs.forEach((input) => {
      if (input.value.trim() === "") {
        validationFailed = true;
        setError(`Validation failed: Input is required.`);
      }
    });

    if (validationFailed) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://api.imperfectgamers.org/support/requests/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getToken() || '',
        },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setSubmitted(true);
      } else {
        setError('Failed to submit support request: ' + data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error submitting support request:', error);
      setError('Error submitting support request');
      setLoading(false);
    }
  };

  const renderInputs = () => {
    if (!subIssue || reviewMode) return null;
    return inputs.map((input) => (
      <InputField
        key={input.input_id}
        id={`input-${input.input_id}`}
        label={input.input_label}
        type={input.input_type}
        placeholder={input.input_label}
        value={details[input.input_label]}
        onChange={(e: Event) => {
          const target = e.target as HTMLInputElement;
          handleDetailChange(input.input_label, target.value);
        }}
        describedBy={`help-${input.input_id}`}
        options={input.options}
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
          <strong>Issue Category:</strong> {issueCategory?.category_name}
        </div>
        <div className="mb-4">
          <strong>Sub-Issue:</strong> {subIssue?.category_name}
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
                    disabled={loading}
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
                    value={
                      issueCategory ? issueCategory.category_id.toString() : ""
                    }
                    onChange={handleIssueChange}
                    required
                    aria-label="Select Issue Category"
                    aria-describedby="category-help"
                    disabled={loading}
                  >
                    <option value="" disabled>
                      Select an Issue Category
                    </option>
                    {categories.map((category) => (
                      <option
                        key={category.category_id}
                        value={category.category_id}
                      >
                        {category.category_name}
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
                    value={subIssue ? subIssue.category_id.toString() : ""}
                    onChange={handleSubIssueChange}
                    required
                    aria-label="Select Sub-Issue"
                    aria-describedby="sub-issue-help"
                    disabled={loading}
                  >
                    <option value="" disabled>
                      Select a Sub-Issue
                    </option>
                    {subcategories.map((sub) => (
                      <option
                        key={sub.category_id}
                        value={sub.category_id}
                      >
                        {sub.category_name}
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
              {loading && <div className="text-center mt-10">Loading...</div>}
              {error && <div className="text-center mt-10 text-red-500">{error}</div>}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SupportForm;
