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

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
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
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(result.user));
    }

    return result;
  } catch (error) {
    return {
      error: "Network error",
      message: "Failed to connect to server",
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
        message: result.message || "Failed to login",
      };
    }

    if (result.success && result.user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(result.user));
    }

    return result;
  } catch (error) {
    return {
      error: "Network error",
      message: "Failed to connect to server",
    };
  }
}

export function getCurrentUser(): UserData | null {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

export function setCurrentUser(user: UserData | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function validateEmail(email: string): { valid: boolean; message: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { valid: false, message: "邮箱地址不能为空" };
  }
  if (!emailRegex.test(email)) {
    return { valid: false, message: "请输入有效的邮箱地址" };
  }
  return { valid: true, message: "" };
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (!password) {
    return { valid: false, message: "密码不能为空" };
  }
  if (password.length < 6) {
    return { valid: false, message: "密码至少需要6个字符" };
  }
  return { valid: true, message: "" };
}
