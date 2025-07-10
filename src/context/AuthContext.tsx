import { createContext, useContext, useState, useEffect, useRef, ReactNode   } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  // const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null); // if use NodeJS environment
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // if use browser environment (universal)

  useEffect(() => {
    const stored = localStorage.getItem('loggedIn');
    setIsLoggedIn(stored === 'true');
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => { 
        logout()
      }, 2 * 60 * 1000); // 10 minutes
    };

    const activityEvents = ['click', 'keydown', 'mousemove', 'touchstart', "scroll"];
    activityEvents.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [isLoggedIn]);

  const login = () => {
    localStorage.setItem('loggedIn', 'true');
    setIsLoggedIn(true);
  }

  const logout = () => {
    localStorage.removeItem('loggedIn');
    setIsLoggedIn(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}