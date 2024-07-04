import { createContext } from "preact";
import { useState, useContext, useEffect } from "preact/hooks";
import {
  setUserToken,
  removeLoginSession,
  removeUserToken,
  getToken,
} from "../utils";

// Define the shape of your context state and functions
interface AuthContextType {
  user: UserType;
  login: (username: string, password: string) => void;
  logout: () => void;
  getUsernameById: (userId: number) => Promise<string>;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void; // Specify the type for setIsAuthenticated
  isLoading: boolean; // Add this line
  setUser: (user: UserType | null) => void; // Specify the type for setUser
}

export const AuthContext = createContext<AuthContextType>(null!);
interface UserType {
  userId: number;
  userToken: string;
  username: string;
}

// Create a provider component
export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  const verifyToken = async () => {
    setIsLoading(true); // Set loading to true when starting verification
    const token = getToken();
    if (token) {
      try {
        const url = new URL("https://api.imperfectgamers.org/auth/verifyToken");
        url.searchParams.append("token", token); // Append token as a query parameter

        const response = await fetch(url.toString(), {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Token validation failed");
        }

        const data = await response.json();
        const { uid, username } = data;

        setUser({
          userId: uid,
          userToken: token,
          username: username,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token validation error:", error);
        removeUserToken();
      }
    }
    setIsLoading(false); // Set loading to false after verification is complete
  };

  // Call verifyToken when the component mounts
  useEffect(() => {
    verifyToken();
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch("https://api.imperfectgamers.org/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const { token, uid, username: usernameTODO } = data;

      setUserToken(token);

      setUser({
        userId: uid,
        userToken: token,
        username: usernameTODO,
      });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      const backendRemoved = await removeLoginSession();
      if (backendRemoved) {
        removeUserToken();

        setUser(null);
        setIsAuthenticated(false);
        console.log("User has been logged out and state has been reset.");
        return true;
      } else {
        console.error("Failed to remove the login session.");
        return false;
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
      return false;
    }
  };

  const getUsernameById = async (userId: number): Promise<string> => {
    // todo call endpoint that gets us the userId for the user.
    return "";
  };
  return (
    <AuthContext.Provider
      value={{
        user: user as UserType,
        login,
        logout,
        isAuthenticated,
        getUsernameById,
        isLoading,
        setIsAuthenticated,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
