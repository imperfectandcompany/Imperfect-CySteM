import { useState, useCallback, useEffect } from "preact/hooks";
import { Link } from "preact-router";
import "tailwindcss/tailwind.css";
import Breadcrumb from "../Breadcrumb";
import { InputField } from "./InputField";
import { useSupportRequest } from "../../contexts/supportRequestContext";

export function useSupportForm() {
  const { categories, loading, error } = useSupportRequest();
  const [email, setEmail] = useState<string>("");
  const [issueCategory, setIssueCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [subIssue, setSubIssue] = useState<string>("");
  const [details, setDetails] = useState<{ [key: string]: string }>({});
  const [progress, setProgress] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [emailValid, setEmailValid] = useState<boolean>(true);
  const [reviewMode, setReviewMode] = useState<boolean>(false);
  const [subIssueTransition, setSubIssueTransition] = useState<boolean>(false);
  const [displayProgress, setDisplayProgress] = useState<number>(0);

  const handleIssueChange = useCallback((event: Event) => {
    const newIssueCategory = (event.target as HTMLSelectElement).value;
    setIssueCategory(newIssueCategory);
    setSubCategory("");
    setSubIssue("");
    setDetails({});
    setCurrentStep(1);
    setSubIssueTransition(true);
    setTimeout(() => setSubIssueTransition(false), 500);
  }, []);

  const handleSubCategoryChange = useCallback((event: Event) => {
    const newSubCategory = (event.target as HTMLSelectElement).value;
    setSubCategory(newSubCategory);
    setSubIssue("");
    setDetails({});
    setCurrentStep(2);
  }, []);

  const handleSubIssueChange = useCallback((event: Event) => {
    const newSubIssue = (event.target as HTMLSelectElement).value;
    setSubIssue(newSubIssue);
    setDetails({});
    setCurrentStep(3);
  }, []);

  const handleDetailChange = useCallback((key: string, value: string) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleBack = useCallback(() => {
    if (currentStep === 1) {
      setIssueCategory("");
      setCurrentStep(0);
    } else if (currentStep === 2) {
      setSubCategory("");
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setSubIssue("");
      setCurrentStep(2);
    }
  }, [currentStep]);

  useEffect(() => {
    const totalFields = 4; // Email, Issue Category, Sub-Category, Sub-Issue
    let filledFields = 0;
    if (email) filledFields++;
    if (issueCategory) filledFields++;
    if (subCategory) filledFields++;
    if (subIssue) filledFields++;

    const category = categories.find((cat) => cat.label === issueCategory);
    const subCategoryObj = category?.subCategories[subCategory];
    const inputs = subCategoryObj?.subIssues.find((sub) => sub.label === subIssue)?.inputs || [];
    const totalInputs = inputs.length;
    const filledInputs = inputs.filter((input) => details[input.label]).length;

    const totalProgressFields = totalFields + totalInputs;
    const totalFilledFields = filledFields + filledInputs;

    const progressPercentage = (totalFilledFields / totalProgressFields) * 100;
    setProgress(progressPercentage);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email, issueCategory, subCategory, subIssue, details, categories]);

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

  return {
    email,
    setEmail,
    issueCategory,
    subCategory,
    subIssue,
    details,
    progress,
    submitted,
    setSubmitted,
    loadingSubmit,
    setLoadingSubmit,
    currentStep,
    setCurrentStep,
    emailValid,
    setEmailValid,
    reviewMode,
    setReviewMode,
    subIssueTransition,
    displayProgress,
    handleIssueChange,
    handleSubCategoryChange,
    handleSubIssueChange,
    handleDetailChange,
    handleBack,
  };
}

export function SupportForm() {
  const {
    email,
    setEmail,
    issueCategory,
    subCategory,
    subIssue,
    details,
    progress,
    submitted,
    setSubmitted,
    loadingSubmit,
    setLoadingSubmit,
    currentStep,
    emailValid,
    setEmailValid,
    reviewMode,
    setReviewMode,
    subIssueTransition,
    displayProgress,
    handleIssueChange,
    handleSubCategoryChange,
    handleSubIssueChange,
    handleDetailChange,
    handleBack,
  } = useSupportForm();

  const { categories, loading, error } = useSupportRequest();

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (!emailValid) {
      return;
    }
    setLoadingSubmit(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
    setLoadingSubmit(false);
    setSubmitted(true);
  };

  const renderInputs = () => {
    if (!subIssue || reviewMode) return null;
    const category = categories.find((cat) => cat.label === issueCategory);
    const subCategoryObj = category?.subCategories[subCategory];
    const subIssues = subCategoryObj?.subIssues || [];
    const inputs = subIssues.find((sub) => sub.label === subIssue)?.inputs || [];
    return inputs.map((input, index) => (
      <InputField
        key={index}
        id={`input-${index}`}
        label={input.label}
        type={input.type}
        describedBy={`input-${index}-description`}
        placeholder={input.placeholder}
        value={details[input.label]}
        onChange={(e) => handleDetailChange(input.label, (e.target as HTMLInputElement).value)}
        tooltip={input.tooltip}
      />
    ));
  };

  const renderReview = () => {
    return (
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-4">Final Review Before Submission</h2>
          </div>
          <div>
            <button className="mt-2 px-6 py-2 bg-black/15 rounded hover:cursor-pointer focus:cursor-auto focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 ease-in-out !z-20" onClick={() => setReviewMode(false)}>Edit Details</button>
          </div>
        </div>
        <div className="mb-4"><strong>Email:</strong> {email}</div>
        <div className="mb-4"><strong>Issue Category:</strong> {issueCategory}</div>
        <div className="mb-4"><strong>Sub-Category:</strong> {subCategory}</div>
        <div className="mb-4"><strong>Sub-Issue:</strong> {subIssue}</div>
        {Object.entries(details).map(([key, value], index) => (
          <div key={index} className="mb-4"><strong>{key}:</strong> {value}</div>
        ))}
        <button className={`relative bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out disabled:opacity-50 ${progress !== 100 || loadingSubmit ? "button-disabled" : ""}`} type="submit" disabled={progress !== 100 || loadingSubmit} aria-disabled={progress !== 100 || loadingSubmit}>{loadingSubmit ? <div className="absolute inset-0 flex justify-center items-center"><div className="spinner"></div></div> : null}Submit Request</button>
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Support Request Submitted Successfully!</h1>
        <p className="text-lg text-gray-600 mb-4">Thank you for reaching out. We will get back to you as soon as possible.</p>
        <Link href="/"><button className="mt-2 px-6 py-2 bg-black/15 rounded hover:cursor-pointer focus:cursor-auto focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 ease-in-out !z-20">Return to Home</button></Link>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
                  <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl">Submit a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-500">Support Request</span></h1>
                  <p className="text-xl text-gray-600 sm:text-2xl lg:text-2xl mt-2">How can we assist you today? Please select the relevant category to help us serve you better.</p>
                </div>
                <div className="mb-4 flex justify-center items-center relative">
                  <svg className="progress-ring" width="60" height="60" aria-label={`Form completion progress: ${Math.round(displayProgress)}%`}>
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                        <stop offset="0%" style={{stopColor: "rgb(165, 180, 252)", stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: "rgb(59, 130, 246)", stopOpacity: 1}} />
                      </linearGradient>
                    </defs>
                    <circle className="progress-ring__circle" stroke=                    "gray" strokeWidth="4" fill="transparent" r="20" cx="30" cy="30" />
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
                    <i className="fas fa-arrow-left mr-2"></i> Go Back to Previous Step
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
                    onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
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
                    {categories
                      .filter((cat) =>
                        Object.values(cat.subCategories).some(
                          (subCat) => subCat.subIssues.length > 0
                        )
                      )
                      .map((category) => (
                        <option key={category.id.toString()} value={category.label}>
                          {category.label}
                        </option>
                      ))}
                  </select>
                  <p id="category-help" className="text-xs text-gray-500 mt-1">
                    Select the category that best describes your issue.
                  </p>
                </div>
              )}
              {!reviewMode && currentStep === 1 && (
                <div className={`mb-4 ${subIssueTransition ? "animate-fade-in" : ""}`}>
                  <label
                    htmlFor="sub-category-select"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Sub-Category
                  </label>
                  <select
                    id="sub-category-select"
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                    value={subCategory}
                    onChange={handleSubCategoryChange}
                    required
                    aria-label="Select Sub-Category"
                    aria-describedby="sub-category-help"
                  >
                    <option value="" disabled>
                      Select a Sub-Category
                    </option>
                    {categories
                      .find((cat) => cat.label === issueCategory)
                      ?.subCategories &&
                      Object.values(
                        categories.find((cat) => cat.label === issueCategory)
                          ?.subCategories || {}
                      ).map((sub) => (
                        <option key={sub.id} value={sub.label}>
                          {sub.label}
                        </option>
                      ))}
                  </select>
                  <p id="sub-category-help" className="text-xs text-gray-500 mt-1">
                    Select the sub-category that best describes your issue.
                  </p>
                </div>
              )}
              {!reviewMode && currentStep === 2 && (
                <div className={`mb-4 ${subIssueTransition ? "animate-fade-in" : ""}`}>
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
                    {categories
                      .find((cat) => cat.label === issueCategory)
                      ?.subCategories[subCategory]?.subIssues.map((sub) => (
                        <option key={sub.id} value={sub.label}>
                          {sub.label || sub.label}
                        </option>
                      ))}
                  </select>
                  <p id="sub-issue-help" className="text-xs text-gray-500 mt-1">
                    Select the specific issue you are experiencing.
                  </p>
                </div>
              )}
              {!reviewMode && currentStep === 3 && renderInputs()}
              {!reviewMode && currentStep === 3 && (
                <div>
                  <button
                    className={`relative w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                      progress < 100 || !emailValid ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
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
