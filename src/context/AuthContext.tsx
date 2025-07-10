import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  // logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem('loggedIn');
    setIsLoggedIn(stored === 'true');
  }, []);

  const login = () => {
    localStorage.setItem('loggedIn', 'true');
    setIsLoggedIn(true);
  }

  const logout = () => {
    localStorage.removeItem('loggedIn');
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}