// src/components/Header.tsx

import { FunctionalComponent } from "preact";
import { Link } from "preact-router/match";
import { useState, useEffect } from "preact/hooks";
import { isFeatureEnabled } from "../featureFlags";

interface HeaderProps {
  onSearchChange: (event: Event) => void;
  onLogoClick: () => void;
  onCategoryClick: () => void;
  searchQuery: string | null;
}

export const Header: FunctionalComponent<HeaderProps> = ({
  onSearchChange,
  onLogoClick,
  onCategoryClick,
  searchQuery,
}) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  function onAdminClick() {

  }

  return (
    <header className="flex flex-wrap  md:items-center justify-between px-4 py-3 ite shadow-sm sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <div className="flex items-center cursor-pointer z-30">
        <Link href="/" onClick={onLogoClick}>
          <img
            alt="Imperfect Gamers Logo, a gaming community"
            src="https://cdn.imperfectgamers.org/inc/assets/img/logo.svg"
            className="h-10 sm:h-12"
          />
        </Link>
      </div>
      <div className="flex items-center space-x-4 mt-3 sm:mt-0">
        {isFeatureEnabled("AdminDashboard") && (
          <Link
            href="/admin"
            className={`flex items-center hidden md:block px-4 py-3 text-indigo-400 hover:text-indigo-550 transition ${
              currentPath === "/categories" ? "hidden" : ""
            }`}
            onClick={onAdminClick}
          >
            Admin
          </Link>
        )}
        {isFeatureEnabled("CategoriesPage") && (
          <Link
            href="/categories"
            className={`flex items-center hidden md:block px-4 py-3 text-indigo-400 hover:text-indigo-550 transition ${
              currentPath === "/categories" ? "hidden" : ""
            }`}
            onClick={onCategoryClick}
          >
            Categories
          </Link>
        )}
        {isFeatureEnabled("HomeSearch") && (
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery ?? ""}
            onInput={onSearchChange}
            className="block w-full items-center max-w-xs h-10 px-4 py-2 text-indigo-300 border rounded-lg appearance-none focus:border-stone-300 focus:outline-none focus:ring-stone-300 sm:text-sm"
          />
        )}
                {isFeatureEnabled("SupportSystem") && (
<>
<Link
          href="/support"
          className={`flex items-center hidden md:block px-4 py-3 text-indigo-400 hover:text-indigo-550 transition ${
            currentPath === "/support" ? "hidden" : ""
          }`}
        >
          Support
        </Link>
        {isFeatureEnabled("AdminViewRequests") && (
<Link
href="/admin/requests"
className={`flex items-center hidden md:block px-4 py-3 text-indigo-400 hover:text-indigo-550 transition ${
  currentPath === "/support" ? "hidden" : ""
}`}
>
Support Admin
</Link>
        )}
</>
        )}
      </div>
    </header>
  );
};
