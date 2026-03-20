export interface UserData {
  id: string;
  name: string;
  region: string;
  email: string;
  createdAt: number;
  status: "pending" | "approved" | "rejected";
}

export interface RegisterRequest {
  name: string;
  region?: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  user?: T;
  error?: string;
  message?: string;
}

const API_BASE_URL = "http://localhost:3001/api";
const CURRENT_USER_KEY = "asimov_current_user";

export async function registerUser(data: RegisterRequest): Promise<ApiResponse<UserData>> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.error || "Registration failed",
        message: result.message || "Failed to register user",
      };
    }

    if (result.success && result.user) {
      setCurrentUser(result.user);
    }

    return result;
  } catch (error) {
    console.error("Registration error:", error);
    return {
      error: "Network error",
      message: "Unable to connect to server",
    };
  }
}

export async function loginUser(data: LoginRequest): Promise<ApiResponse<UserData>> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.error || "Login failed",
        message: result.message || "Invalid credentials",
      };
    }

    if (result.success && result.user) {
      setCurrentUser(result.user);
    }

    return result;
  } catch (error) {
    console.error("Login error:", error);
    return {
      error: "Network error",
      message: "Unable to connect to server",
    };
  }
}

export async function getUserById(id: string): Promise<ApiResponse<UserData>> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.error || "User not found",
        message: result.message || "Failed to get user",
      };
    }

    return result;
  } catch (error) {
    console.error("Get user error:", error);
    return {
      error: "Network error",
      message: "Unable to connect to server",
    };
  }
}

export function setCurrentUser(user: UserData): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): UserData | null {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 6) {
    return { valid: false, message: "密码至少需要6个字符" };
  }
  return { valid: true, message: "" };
}
