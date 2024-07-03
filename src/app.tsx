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
import { Card } from "./content";
import { ErrorBoundary } from "./components/ErrorBoundary"; // Add this line to import ErrorBoundary
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminLogs } from "./components/AdminLogs";
import { AdminEditArticle } from "./components/AdminEditArticle";
import { AdminCreateArticle } from "./components/AdminCreateArticle";
import { AdminCreateCategory } from "./components/AdminCreateCategory";
import AdminEditCategory from "./components/AdminEditCategory";
import { isFeatureEnabled } from "./featureFlags";

export interface AppState {
  searchQuery: string | null;
  isSearching: boolean;
  selectedItem: Card | null;
  currentItemCount: number;
  lastRoute: string | null;
}

export interface Action {
  type: string;
  value?: string;
  item?: Card | null;
}

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

const AdminRoute: React.FC<AdminRouteProps> = ({
  component: Component,
  path: path,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Replace with your loading component or spinner
  }

  // Redirect to the admin dashboard if the user is authenticated
  useEffect(() => {
    if (isAuthenticated && path === "/admin") {
      <AdminDashboard path="/admin/dashboard" />;
      // This will replace the current entry in the history stack
      route("/admin/dashboard", true);
    }
  }, [isAuthenticated]); // Only re-run the effect if isAuthenticated changes

  // Render dashboard if authenticated
  if (isAuthenticated && path === "/admin") {
    <AdminDashboard path="/admin/dashboard" />;
    // This will replace the current entry in the history stack
    route("/admin/dashboard", true);
  }
  
  if(!isAuthenticated && path !== "/admin"){
    <Admin path="/admin" />;
    // This will replace the current entry in the history stack
    route("/admin", true);
  }
  // Render the component
  return <Component path={path} />;
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

  useEffect(() => {
    // Call handleRouteChange on mount to handle direct URL visits
    handleRouteChange();

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, [state.searchQuery]);

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

  function handleCardClick(item?: Card) {
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
    <AuthProvider>
      <div className="flex flex-col min-h-screen mx-auto md:py-8 max-w-screen-xl">
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
                <span className="text-indigo-100">Fri, Jun 21, 2024</span>
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
          searchQuery={state.searchQuery}
          onCategoryClick={() => dispatch({ type: "CLEAR_SEARCH" })}
        />
        <main className="flex-1 relative">
          <ErrorBoundary>
            <Router>
              <Home
                path="/"
                onCardClick={handleCardClick}
                searchQuery={state.searchQuery}
                isSearching={state.isSearching}
                currentItemCount={state.currentItemCount}
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
  );
}
