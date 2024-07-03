import { useEffect, useState } from "preact/hooks";
import { content } from "../content";
import { FunctionalComponent } from "preact";
import { route } from "preact-router";
import Breadcrumb from "./Breadcrumb";
import { isFeatureEnabled } from "../featureFlags";

export const AdminDashboard: FunctionalComponent = ({}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [cardStates, setCardStates] = useState(content.sections);

  const handleEdit = (id: number) => {
    // Correctly pass the article ID to the AdminEditArticle component
    route(`/admin/edit/article/${id}`);
  };

  const toggleSection = (sectionKey: string) => {
    setActiveSection((prevSection) =>
      prevSection === sectionKey ? null : sectionKey
    );
  };

  const toggleArchive = (sectionKey: string, cardIndex: number) => {
    setCardStates((prevStates) => {
      const newState = { ...prevStates };
      const section = newState[parseInt(sectionKey)];
      const card = section.cards[cardIndex];
      card.archived = !card.archived;
      return newState;
    });
  };

  const toggleStaffOnly = (sectionKey: string, cardIndex: number) => {
    setCardStates((prevStates) => {
      const newState = { ...prevStates };
      const section = newState[parseInt(sectionKey)];
      const card = section.cards[cardIndex];
      card.staffOnly = !card.staffOnly;
      return newState;
    });
  };

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Close the popover when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".popover-container")) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Function to handle routing and prevent event propagation
  const handleRoute = (
    path: string,
    event: { stopPropagation: () => void }
  ) => {
    event.stopPropagation(); // Prevent the click from closing the popover
    route(path); // Replace with your routing logic
  };

  return (
    <div>
      <Breadcrumb path={`/admin`} />
      <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
        <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl">
          Admin Dashboard
        </h1>
        <section className="mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-indigo-600 mb-4 sm:mb-0">
              Content Management
            </h2>
            <div className="relative popover-container space-x-2">
              <button
                onClick={() => route("/admin/logs")}
                className="px-4 py-2 bg-indigo-100 text-stone-800 hover:text-white font-bold rounded hover:bg-indigo-600 transition duration-300 ease-in-out"
              >
                Visit Admin Logs
              </button>
              <button
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                className="px-4 py-2 bg-indigo-50 text-stone-800 transition hover:text-white font-medium rounded-md inline-flex items-center"
              >
                Create New
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              {isPopoverOpen && (
                <div className="absolute z-10 mt-2 w-48 right-0 bg-white shadow-lg rounded-md border border-gray-200">
                  <div className="py-1">
                    {isFeatureEnabled("CreateArticle") && (
                      <button
                        onClick={(e) => handleRoute("/admin/create/article", e)}
                        className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                      >
                        Article
                      </button>
                    )}
                    {isFeatureEnabled("CreateCategory") && (
                      <button
                        onClick={(e) =>
                          handleRoute("/admin/create/category", e)
                        }
                        className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                      >
                        Category
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {Object.keys(cardStates).map((sectionKey) => {
            const section = cardStates[parseInt(sectionKey)];
            const latestSectionVersion = section.versions.slice(-1)[0];
            const isActive = activeSection === sectionKey;
            return (
              <div key={sectionKey} className="mt-5">
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className="flex hover:opacity-80 justify-between items-center w-full text-left text-lg font-semibold text-stone-900 py-2 transition duration-300 ease-in-out transform hover:scale-100 focus:outline-none"
                >
                  {latestSectionVersion.title} ({section.cards.length} Articles)
                  <span
                    className={`transform transition-transform duration-300 text-indigo-500 ${
                      isActive ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
                    isActive ? "max-h-screen" : "max-h-0"
                  }`}
                >
                  {/* Category-specific content here */}
                  {isFeatureEnabled("EditCategory") && (
                    <button
                      onClick={() =>
                        route(`/admin/edit/category/${sectionKey}`)
                      }
                      className="text-stone-500 hover:text-indigo-900 transition duration-300 ease-in-out"
                    >
                      Edit Category
                    </button>
                  )}
                  <div className="border-b border-gray-200">
                    {section.cards.map((card, index) => {
                      const latestCardVersion = card.versions.slice(-1)[0];
                      return (
                        <div
                          key={index}
                          className={`flex justify-between items-center mb-4 transition duration-300 ease-in-out p-4 transform ${
                            card.archived ? "bg-stone-50" : ""
                          } ${
                            card.staffOnly ? "border-l-4 border-indigo-600" : ""
                          }`}
                        >
                          <div className="m2">
                            <h4 className="font-medium text-lg">
                              {latestCardVersion.title}
                            </h4>
                            <p className="mt-1">
                              {latestCardVersion.description}
                            </p>
                            <div className="flex space-x-4 text-sm mt-1">
                              {isFeatureEnabled("ArchiveArticle") && (
                                <button
                                  onClick={() =>
                                    toggleArchive(sectionKey, index)
                                  }
                                  className="text-indigo-500 hover:underline"
                                >
                                  {card.archived ? "Unarchive" : "Archive"}
                                </button>
                              )}
                              {isFeatureEnabled("StaffOnly") && (
                                <button
                                  onClick={() =>
                                    toggleStaffOnly(sectionKey, index)
                                  }
                                  className="text-indigo-500 hover:underline"
                                >
                                  {card.staffOnly
                                    ? "Make Public"
                                    : "Make Staff Only"}
                                </button>
                              )}
                            </div>
                          </div>

                          {isFeatureEnabled("StaffOnly") && (
                            <button
                              onClick={() => handleEdit(card.id)}
                              className="text-indigo-500 hover:text-indigo-800 transition duration-300 ease-in-out"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
};
