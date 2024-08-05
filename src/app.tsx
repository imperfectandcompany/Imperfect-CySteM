// src/App.tsx

import { Router, route } from "preact-router";
import { useEffect, useReducer, useState } from "preact/hooks";
import { VNode } from "preact";
import Article from "./components/Article";
import { Categories } from "./components/Categories";
import { CategoryItems } from "./components/CategoryItems";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { NotFound } from "./components/NotFound";
import Home from "./components/Home";
import { Admin } from "./components/Admin";
import { ErrorBoundary } from "./components/ErrorBoundary"; // Add this line to import ErrorBoundary
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminLogs } from "./components/AdminLogs";
import { AdminEditArticle } from "./components/AdminEditArticle";
import { AdminCreateArticle } from "./components/AdminCreateArticle";
import { AdminCreateCategory } from "./components/AdminCreateCategory";
import AdminEditCategory from "./components/AdminEditCategory";
import { isFeatureEnabled } from "./featureFlags";
import { getToken, removeUserToken } from "./utils";
import { ContentProvider, IArticle } from "./contexts/ContentContext";
import { AdminRecycleBin } from "./components/AdminRecycleBin";
import SupportForm from "./components/SupportForm";
import AdminSupportForm from "./components/AdminSupportForm";
import SupportRequestDetails from "./components/SupportForm/SupportRequestDetails";
import { ToastProvider } from "./contexts/ToastContext";
import ToastContainer from "./components/ToastContainer";

export interface AppState {
  searchQuery: string | null;
  isSearching: boolean;
  selectedItem: IArticle | null;
  currentItemCount: number;
  lastRoute: string | null;
}

export interface Action {
  type: string;
  value?: string;
  item?: IArticle | null;
}

/**
 * This is the initial state of the application.
 */
export const initialState: AppState = {
  searchQuery: "",
  isSearching: false,
  selectedItem: null,
  currentItemCount: 0,
  lastRoute: null,
};

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "UPDATE_SEARCH":
      if (isFeatureEnabled("HomeSearch")) {
        return { ...state, searchQuery: action.value ?? "", isSearching: true };
      } else {
        return state;
      }
    case "NO_RESULTS_FOUND":
      if (isFeatureEnabled("HomeSearch")) {
        return {
          ...state,
          searchQuery: action.value ?? null,
          isSearching: false,
        };
      } else {
        return state;
      }
    case "CLEAR_SEARCH":
      if (isFeatureEnabled("HomeSearch")) {
        return {
          ...state,
          searchQuery: "",
          isSearching: false,
          selectedItem: null,
        };
      } else {
        return state;
      }
    case "UPDATE_LAST_ROUTE":
      return { ...state, lastRoute: action.value ?? null };
    case "SELECT_ITEM":
      if (isFeatureEnabled("HomeSearch")) {
        return {
          ...state,
          selectedItem: action.item ?? null,
          isSearching: false,
          searchQuery: null,
        }; // Clear searchQuery when item is selected
      } else {
        return {
          ...state,
          selectedItem: action.item ?? null,
        };
      }
    case "UNSELECT_ITEM":
      return { ...state, selectedItem: null };
    case "STOP_SEARCH":
      if (isFeatureEnabled("HomeSearch")) {
        return { ...state, isSearching: false };
      } else {
        return state;
      }
    default:
      return state;
  }
}

interface AdminRouteProps {
  component: React.ComponentType<any>;
  [key: string]: any;
  path: string;
}

interface ProgressBarProps {
  duration?: number; // duration in milliseconds, default to 3000ms
  color?: string; // default red
}

const ProgressBar: preact.FunctionalComponent<ProgressBarProps> = ({ duration = 3000, color = 'red' }) => {
  const [width, setWidth] = useState<number>(0);
  const [closing, setClosing] = useState<boolean>(false);

  useEffect(() => {
    const increment = 100 / (duration / 100);
    let progress = 0;

    const interval = setInterval(() => {
      progress += increment;
      setWidth(Math.min(progress, 100));

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setClosing(true), 500); // delay before starting the closing animation
      }
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div
      className={`w-full h-2 bg-gray-200 rounded overflow-hidden relative transition-all duration-500 ${closing ? 'transform scale-y-0' : ''}`}
    >
      <div
        className={`h-full bg-${color}-500 rounded transition-all duration-500 ${closing ? 'w-0' : ''}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};
export default ProgressBar;


const AdminRoute: React.FC<AdminRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, isLoading, setIsAuthenticated, setUser } = useAuth();

  const [showLoading, setShowLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (isLoading) {
      setShowLoading(true);
      setLoadingStartTime(Date.now());
    } else if (loadingStartTime !== null) {
      const elapsedTime = Date.now() - loadingStartTime;

      if (elapsedTime < 1000) {
        timer = setTimeout(() => {
          setShowLoading(false);
          setLoadingStartTime(null); // Reset loading start time
        }, 1000 - elapsedTime);
      } else {
        setShowLoading(false);
        setLoadingStartTime(null); // Reset loading start time
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isLoading, loadingStartTime]);

 // Handle loading state at the top to avoid rendering additional logic
 if (showLoading) {
  return (
    <div className="fixed inset-0 z-50 space-x-8  mx-auto text-center mr-0 flex items-center w-full justify-center animate-pulse text-3xl font-bold bg-white">
      <img
        className="h-26 w-32 "
        src="https://imperfectdesignsystem.com/assets/img/imperfectandcompany/umbrella.png"
        alt="Imperfect and Company logo"
      />
<div className="flex flex-col mr-8 space-y-8">
      <div className="flex items-center mx-auto">Imperfect Identity</div>
<ProgressBar duration={250}/>
</div>
    </div>
  );
}

useEffect(() => {
  // Check if the current path is an admin path
  const isAdminPath = window.location.pathname.startsWith("/admin");

  if (isLoading) {
    // If still loading, do not perform any routing
    return;
  }

  if (!getToken() && isAuthenticated) {
    removeUserToken();
    setUser(null);
    setIsAuthenticated(false);
    if (isAdminPath) {
      // Redirect to admin login if not authenticated and trying to access an admin path
      route("/admin", true);
    }
  } else if (isAuthenticated) {
    if (window.location.pathname === "/admin" || window.location.pathname === "/admin/") {
      // Redirect from base admin path to dashboard only if authenticated
      route("/admin/dashboard", true);
    }
    // If the user is authenticated and on an admin path, do nothing
  } else if (!isAuthenticated && isAdminPath) {
    // Redirect to admin login if not authenticated and on an admin path
    route("/admin", true);
  }
}, [isAuthenticated, isLoading, setIsAuthenticated, setUser]);

  // Directly return the component if authenticated, otherwise handle redirection
  return <Component {...rest} />;
};


export function App(): VNode {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  const handleRouteChange = () => {
    const path = window.location.pathname;
    const queryParams = new URLSearchParams(window.location.search);
    const searchQueryFromURL = queryParams.get("query");

    if (path === "/" || path.startsWith("/article/")) {
      dispatch({ type: "CLEAR_SEARCH" });
      dispatch({ type: "STOP_SEARCH" });
    } else if (searchQueryFromURL) {
      dispatch({ type: "UPDATE_SEARCH", value: searchQueryFromURL });
      // Ensure the search input is pre-filled and search is initiated
      if (
        path.startsWith("/search") &&
        searchQueryFromURL !== state.searchQuery
      ) {
        dispatch({ type: "START_SEARCH", value: searchQueryFromURL });
      }
    } else {
      dispatch({ type: "STOP_SEARCH" });
    }
  };

  {
    isFeatureEnabled("HomeSearch") &&
      useEffect(() => {
        // Call handleRouteChange on mount to handle direct URL visits
        handleRouteChange();

        window.addEventListener("popstate", handleRouteChange);
        return () => window.removeEventListener("popstate", handleRouteChange);
      }, [state.searchQuery]);
  }

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      const queryParams = new URLSearchParams(window.location.search);
      const searchQueryFromURL = queryParams.get("query") || "";

      // Regex to identify empty or malformed search queries
      const emptyOrMalformedQueryRegex = /^$|^\s*$|^\?|query=?$/;

      if (path.startsWith("/search")) {
        if (
          emptyOrMalformedQueryRegex.test(searchQueryFromURL) ||
          path === "/search" ||
          path === "search?query" ||
          path === "search?" ||
          path === "search?="
        ) {
          // Dispatch an action to handle the empty search query scenario
          dispatch({ type: "NO_RESULTS_FOUND" });
        }
      }

      if (path === "/" || path.startsWith("/article/")) {
        dispatch({ type: "CLEAR_SEARCH" });
        dispatch({ type: "STOP_SEARCH" });
      } else if (searchQueryFromURL) {
        dispatch({ type: "UPDATE_SEARCH", value: searchQueryFromURL });
        // Ensure the search input is pre-filled and search is initiated
        if (
          path.startsWith("/search") &&
          searchQueryFromURL !== state.searchQuery
        ) {
          dispatch({ type: "START_SEARCH", value: searchQueryFromURL });
        }
      } else {
        dispatch({ type: "STOP_SEARCH" });
      }
    };

    // Call handleRouteChange on mount and on every popstate event
    handleRouteChange();
    window.addEventListener("popstate", handleRouteChange);

    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []); // Ensure this effect runs only once on mount and unmount

  {
    isFeatureEnabled("HomeSearch") &&
      useEffect(() => {
        if (searchTimeout) {
          window.clearTimeout(searchTimeout);
        }

        if (state.searchQuery && !state.isSearching) {
          const timeoutId = window.setTimeout(() => {
            dispatch({ type: "STOP_SEARCH" });
            if (!state.selectedItem) {
              const currentURL = `/search?query=${state.searchQuery}`;
              if (
                window.location.pathname + window.location.search !==
                currentURL
              ) {
                route(currentURL);
              }
            }
          }, 500);

          setSearchTimeout(timeoutId);
          return () => window.clearTimeout(timeoutId);
        } else {
          dispatch({ type: "STOP_SEARCH" });
        }
      }, [state.searchQuery, state.selectedItem, state.isSearching]);
  }

  function handleCardClick(item?: IArticle) {
    if (item) {
      dispatch({
        type: "UPDATE_LAST_ROUTE",
        value: window.location.pathname + window.location.search,
      });
      dispatch({ type: "SELECT_ITEM", item });
    }
  }

  function handleSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.toLowerCase();

    // Unselect any selected item and ensure you leave the article view when typing begins
    if (state.selectedItem) {
      dispatch({ type: "UNSELECT_ITEM" });
    }

    dispatch({ type: "UPDATE_SEARCH", value });

    // Navigate back to the home page if the search query is empty, else navigate to the search page
    if (value === "") {
      // Clear the search state and navigate to home
      dispatch({ type: "CLEAR_SEARCH" });
      route("/");
    } else {
      const newPath = `/search?query=${value}`;
      if (window.location.pathname + window.location.search !== newPath) {
        route(newPath);
      }
    }

    // Update the URL without navigating if already on the search page
    if (window.location.pathname.startsWith("/search") && value !== "") {
      history.replaceState({}, "", `/search?query=${value}`);
    } else if (value === "") {
      history.replaceState({}, "", "/");
    }
  }

  return (
    <ToastProvider>
    <ContentProvider>
      <AuthProvider>
      <div className="flex flex-col min-h-screen mx-auto md:py-8 md:max-w-screen-xl lg:max-w-screen-lg xl:max-w-screen-2xl">
          {isFeatureEnabled("NotificationBanner") && (
            <div class="relative my-8 md:my-0 bg-gradient-to-b from-indigo-500 via-indigo-500/5 to-indigo-500/10 shadow-lg rounded-lg p-1 mx-4 sm:mx-6 md:mx-8 lg:mx-10 xl:mx-4">
              <div className="bg-blue-900 text-white text-center p-4 rounded-lg">
                <button
                  className="absolute top-3 right-3 text-indigo-300 hover:text-indigo-500"
                  onClick={(e) => {
                    const parentElement = e.currentTarget.parentElement;
                    if (parentElement) {
                      const grandParentElement = parentElement.parentElement;
                      if (grandParentElement) {
                        grandParentElement.style.display = "none";
                      }
                    }
                  }}
                >
                  &#x2715;
                </button>
                <p className="text-xs sm:text-sm md:text-base">
                  <span className="font-medium text-indigo-50">Update:</span>{" "}
                  <span className="text-indigo-100">Mon, Aug 4th, 2024</span>
                  <br />
                  This site is currently a work in progress. For immediate
                  assistance, please visit our discord at{" "}
                  <a
                    href="https://imperfectgamers.org/discord/"
                    class="text-indigo-300 hover:text-indigo-500"
                  >
                    https://imperfectgamers.org/discord/
                  </a>
                  .
                </p>
                <p class="text-right text-xs mt-1 sm:text-sm italic">
                  - Imperfect Gamers Team
                </p>
              </div>
            </div>
          )}

          <Header
            onSearchChange={handleSearchChange}
            onLogoClick={() => dispatch({ type: "CLEAR_SEARCH" })}
            searchQuery={
              isFeatureEnabled("HomeSearch") ? state.searchQuery : null
            }
            onCategoryClick={() => dispatch({ type: "CLEAR_SEARCH" })}
          />
          <main className="flex-1 relative">
          <ToastContainer />
            <ErrorBoundary>
              <Router>
                <Home
                  path="/"
                  onCardClick={handleCardClick}
                  searchQuery={state.searchQuery}
                  isSearching={state.isSearching}
                  currentItemCount={state}
                  onBreadcrumbClick={() => dispatch({ type: "CLEAR_SEARCH" })}
                />
                {isFeatureEnabled("HomeSearch") && (
                  <Home
                    path="/search"
                    onCardClick={handleCardClick}
                    searchQuery={state.searchQuery}
                    isSearching={state.isSearching}
                    currentItemCount={state.currentItemCount}
                    onBreadcrumbClick={() =>
                      dispatch({ type: "NO_RESULTS_FOUND" })
                    }
                    onBreadcrumbClickHome={() =>
                      dispatch({ type: "CLEAR_SEARCH" })
                    }
                  />
                )}
                {isFeatureEnabled("SupportSystem") && (
                  <SupportForm path="/support" />
                )}

                <Article
                  path="/article/:title"
                  lastRoute={state.lastRoute || "/"}
                  onBreadcrumbClick={() => dispatch({ type: "CLEAR_SEARCH" })}
                />
                {isFeatureEnabled("CategoriesPage") && (
                  <Categories
                    path="/categories"
                    onBreadcrumbClick={() => dispatch({ type: "CLEAR_SEARCH" })}
                  />
                )}
                {isFeatureEnabled("SpecificCategoryPage") && (
                  <CategoryItems
                    path="/category/:categorySlug"
                    categorySlug=""
                    onCardClick={handleCardClick} // Pass handleCardClick to CategoryItems
                  />
                )}
                {isFeatureEnabled("AdminDashboard") && (
                  <AdminRoute
                  component={AdminDashboard}
                  path="/admin/dashboard"
                />
                )}
                {isFeatureEnabled("AdminViewRequests") && (
<AdminRoute
                component={AdminSupportForm}
                path="/admin/requests"
              />
                )}
                  <AdminRoute component={SupportRequestDetails} path="/admin/requests/:supportRequestSlug" />
                {isFeatureEnabled("AdminDashboard") && (
                  <AdminRoute component={Admin} path="/admin" />
                )}
                {isFeatureEnabled("ViewAdminLogs") && (
                  <AdminRoute component={AdminLogs} path="/admin/logs" />
                )}
                {isFeatureEnabled("CreateArticle") && (
                  <AdminRoute
                    component={AdminCreateArticle}
                    path="/admin/create/article"
                  />
                )}
                {isFeatureEnabled("CreateCategory") && (
                  <AdminRoute
                    component={AdminCreateCategory}
                    path="/admin/create/category"
                  />
                )}

                {isFeatureEnabled("ViewRecycleBin") && (
                  <AdminRoute
                    component={AdminRecycleBin}
                    path="/admin/recycle-bin"
                  />
                )}

                {isFeatureEnabled("EditArticle") && (
                  <AdminRoute
                    component={AdminEditArticle}
                    path="/admin/edit/article/:articleId"
                  />
                )}
                {isFeatureEnabled("EditCategory") && (
                  <AdminRoute
                    component={AdminEditCategory}
                    path="/admin/edit/category/:id"
                  />
                )}
                <NotFound default />
              </Router>
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ContentProvider>
    </ToastProvider>
  );
}
