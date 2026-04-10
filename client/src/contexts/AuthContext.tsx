import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";

interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  username: string;
  studentNumber: string | null;
  preferredName: string | null;
  photoURL: string | null;
  faculty: string | null;
  program: string | null;
  yearOfStudy: number | null;
  totalYears: number | null;
  academicStanding: string | null;
  department: string | null;
  gpa: number | null;
  creditsCompleted: number;
  enrolledCourses: Course[];
  residence: ResidenceInfo | null;
  lastLogin: string | null;
}

interface Course {
  code: string;
  name: string;
  credits: number;
  status: string;
  currentMark: number | null;
  progress: number;
}

interface ResidenceInfo {
  name: string;
  room: string;
  mealPlan: string;
  feeStatus: string;
  houseCommitteeRole: string | null;
}

interface AuthContextValue {
  firebaseUser: { uid: string; email: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<{ uid: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(token?: string) {
    try {
      const authToken = token || localStorage.getItem(TOKEN_KEY);
      if (!authToken) {
        setProfile(null);
        return;
      }

      const headers: Record<string, string> = { Authorization: `Bearer ${authToken}` };
      const data = await api.get<UserProfile>("/api/users/me", headers);
      setProfile(data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setProfile(null);
    }
  }

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setFirebaseUser(user);
        fetchProfile(token);
      } catch (err) {
        console.error("Failed to restore session:", err);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }

    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post<{ token: string; uid: string; email: string }>(
        "/api/auth/login",
        { email, password }
      );

      const { token, uid } = response;
      const user = { uid, email };

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      setFirebaseUser(user);
      await fetchProfile(token);
    } catch (err: any) {
      // Clear any invalid tokens on login failure
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      throw new Error(err.response?.data?.error || "Login failed");
    }
  }

  async function signOut() {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        await api.post("/api/auth/logout", { token });
      }
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setFirebaseUser(null);
    setProfile(null);
  }

  async function register(data: RegisterData) {
    try {
      const response = await api.post<{
        token: string;
        uid: string;
      }>("/api/auth/register", data);

      const { token, uid } = response;
      const user = { uid, email: data.email };

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      setFirebaseUser(user);
      await fetchProfile(token);
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Registration failed");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        loading,
        signIn,
        signOut,
        register,
        refreshProfile: () => fetchProfile(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

