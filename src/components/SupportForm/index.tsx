import { h, FunctionalComponent } from "preact";
import { useState, useCallback, useEffect, useRef } from "preact/hooks";
import InputField from "./InputField";
import ProgressRing from "./ProgressRing";
import SubmitButton from "./SubmitButton";
import { issueCategories, subIssuesInputs } from "./supportFormData";
import Breadcrumb from "../Breadcrumb";
import { Link } from "preact-router";

const SupportForm: FunctionalComponent = () => {
  const [email, setEmail] = useState("");
  const [issueCategory, setIssueCategory] = useState("");
  const [subIssue, setSubIssue] = useState("");
  const [details, setDetails] = useState({});
  const [progress, setProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const subIssueRef = useRef<HTMLSelectElement>(null);

  const handleIssueChange = useCallback((event: Event) => {
    const target = event.target as HTMLSelectElement;
    setIssueCategory(target.value);
    setSubIssue("");
    setDetails({});
  }, []);

  const handleSubIssueChange = useCallback((event: Event) => {
    const target = event.target as HTMLSelectElement;
    setSubIssue(target.value);
    setDetails({});
  }, []);

  const handleDetailChange = useCallback((key: string, value: string) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    if (subIssueRef.current) {
      subIssueRef.current.focus();
    }
  }, [issueCategory]);

  useEffect(() => {
    const totalFields = 3; // Email, Issue Category, Sub-Issue
    let filledFields = 0;
    if (email) filledFields++;
    if (issueCategory) filledFields++;
    if (subIssue) filledFields++;

    const inputs = subIssuesInputs[subIssue] || [];
    const totalInputs = inputs.length;
    const filledInputs = inputs.filter((input) => details[input.label as keyof typeof details]).length;

    const totalProgressFields = totalFields + totalInputs;
    const totalFilledFields = filledFields + filledInputs;

    const progressPercentage = (totalFilledFields / totalProgressFields) * 100;
    setProgress(progressPercentage);
  }, [email, issueCategory, subIssue, details]);

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setSubmitted(true);
  };

  const renderInputs = () => {
    if (!subIssue) return null;
    return subIssuesInputs[subIssue].map((input, index) => (
      <InputField
        key={index}
        id={`input-${index}`}
        label={input.label}
        type={input.type}
        placeholder={input.placeholder}
        value={details[input.label as keyof typeof details] || ""}
        onChange={(e: Event) => {
          const target = e.target as HTMLInputElement;
          handleDetailChange(input.label, target.value);
        }}
        describedBy={`help-${index}`}
      />
    ));
  };

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
        <Link
          href="/"
          className="text-indigo-600 hover:text-indigo-800"
        >
        <button
          className="mt-2 px-6 py-2 bg-black/15 rounded hover:cursor-pointer focus:cursor-auto focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 ease-in-out !z-20"
        >
          Return to Home
        </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mi">
      <Breadcrumb path={"/support"}/>

      <main>
        <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
          <form onSubmit={handleSubmit} className="p6 sm:px-0">
            <div className="border-gray-200 rounded-lg h-auto bg-white">
              <div className="flex justify-between">
                <div className="mb-6">
                  <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl">
                    Submit a Support Request
                  </h1>
                  <p className="text-xl text-gray-600 sm:text-2xl lg:text-2xl mt-2">
                    How can we assist you today? Please select the relevant
                    category to help us serve you better.
                  </p>
                </div>
                <ProgressRing progress={progress} />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email-input"
                  className="block text-gray-700 text-sm font-bold mb-2"
                ></label>
                <InputField
                  id="email-input"
                  label="Your Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e: Event) =>
                    setEmail((e.target as HTMLInputElement).value)
                  }
                  describedBy="email-help"
                />
                <p id="email-help" className="text-xs text-gray-500 mt-1">
                  We'll never share your email with anyone else.
                </p>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="issue-category-select"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Issue Category
                </label>
                <select
                  id="issue-category-select"
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out input-focus-animation"
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
              {issueCategory && (
                <div className="mb-4">
                  <label
                    htmlFor="sub-issue-select"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Sub-Issue
                  </label>
                  <select
                    id="sub-issue-select"
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out input-focus-animation"
                    value={subIssue}
                    onChange={handleSubIssueChange}
                    ref={subIssueRef}
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
              {renderInputs()}
              <SubmitButton
                progress={progress}
                loading={loading}
                onClick={() => {}}
              />
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
export default SupportForm;
