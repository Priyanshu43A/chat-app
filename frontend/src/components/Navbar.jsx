import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageCircle, UserCircle, LogOut } from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        width: "100%",
        background: "#18181b",
        boxShadow: "0 2px 8px rgba(0,0,0,0.24)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.75rem 2rem",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 700,
          fontSize: "1.5rem",
          color: "#f1f5f9",
          letterSpacing: 1,
        }}
      >
        <MessageCircle style={{ marginRight: 8, color: "#60a5fa" }} size={28} />{" "}
        chatty
      </div>
      {/* Right side nav items */}
      {authUser ? (
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {/* Profile */}
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              fontSize: "1.1rem",
              color: "#f1f5f9",
              transition: "color 0.2s",
            }}
            title="Profile"
            onClick={() => (window.location.href = "/profile")}
            onMouseOver={(e) => (e.currentTarget.style.color = "#60a5fa")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#f1f5f9")}
          >
            <UserCircle
              style={{ marginRight: 6, color: "#60a5fa" }}
              size={24}
            />
            Profile
          </button>
          {/* Logout */}
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              fontSize: "1.1rem",
              color: "#f1f5f9",
              transition: "color 0.2s",
            }}
            title="Logout"
            onClick={logout}
            onMouseOver={(e) => (e.currentTarget.style.color = "#f87171")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#f1f5f9")}
          >
            <LogOut style={{ marginRight: 6, color: "#f87171" }} size={22} />
            Logout
          </button>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
