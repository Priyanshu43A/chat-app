import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });

      const res = await axiosInstance.get("/auth/check-auth");
      set({
        authUser: res.data.user,
      });
      get().connectSocket();
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({
        authUser: null,
      });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      set({
        authUser: res.data.user,
      });
      get().connectSocket();
    } catch (error) {
      console.error("Error signing up:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      if (res.status !== 200) {
        throw new Error("Login failed");
      }
      set({
        authUser: res.data.user,
      });
      localStorage.setItem("accessToken", res.data.accessToken || "");
      get().connectSocket();
      return res.data; // Return the data for UI handling
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to log in. Please try again."
      );
      throw error; // Re-throw the error for further handling if needed
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      //clear the cookies
      await axiosInstance.post("/auth/logout");
      // Clear the authUser and accessToken
      set({ authUser: null });
      localStorage.removeItem("accessToken");
      // Optionally, disconnect the socket if connected
      get().disconnectSocket();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  },

  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put(
        "/auth/update-profile-picture",
        formData
      );
      console.log("Profile update response:", res.data);
      if (res.status !== 200) {
        throw new Error("Profile update failed");
      }
      set({
        authUser: res.data.user,
      });
      toast.success("Profile updated successfully");
      return res.data.user;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile. Please try again."
      );
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) {
      console.log("already connected or invalid user!");
      return;
    }
    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });
    socket.connect();
    set({ socket: socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null });
    }
  },
}));
