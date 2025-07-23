import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setHasError(false);
        await getUsers();
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setHasError(true);
      }
    };

    fetchUsers();
  }, [getUsers]);

  // Safe array handling with fallbacks
  const safeUsers = Array.isArray(users) ? users : [];
  const safeOnlineUsers = Array.isArray(onlineUsers) ? onlineUsers : [];

  // Filter users safely
  const filteredUsers = showOnlineOnly
    ? safeUsers.filter(
        (user) => user?._id && safeOnlineUsers.includes(user._id)
      )
    : safeUsers.filter((user) => user?._id); // Only include users with valid IDs

  // Calculate online count safely (excluding current user)
  const onlineCount = Math.max(0, safeOnlineUsers.length - 1);

  // Helper function to check if user is online
  const isUserOnline = (userId) => {
    return userId && safeOnlineUsers.includes(userId);
  };

  // Loading state
  if (isUsersLoading) return <SidebarSkeleton />;

  // Error state
  if (hasError) {
    return (
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-zinc-500">
            <Users className="size-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Failed to load contacts</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-blue-500 hover:underline mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
              disabled={safeUsers.length === 0}
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineCount} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {/* Loading state for when users data is being refreshed */}
        {isUsersLoading && safeUsers.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="loading loading-spinner loading-sm"></div>
          </div>
        )}

        {/* Users list */}
        {filteredUsers.map((user) => {
          // Additional safety check for user object
          if (!user || !user._id) {
            return null;
          }

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePicture || "/avatar.png"}
                  alt={user.fullName || user.name || "User"}
                  className="size-12 object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = "/avatar.png";
                  }}
                />
                {isUserOnline(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500
                     rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">
                  {user.fullName || user.name || "Unknown User"}
                </div>
                <div className="text-sm text-zinc-400">
                  {isUserOnline(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}

        {/* Empty states */}
        {!isUsersLoading &&
          filteredUsers.length === 0 &&
          safeUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-8">
              <Users className="size-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No contacts found</p>
            </div>
          )}

        {!isUsersLoading &&
          filteredUsers.length === 0 &&
          safeUsers.length > 0 &&
          showOnlineOnly && (
            <div className="text-center text-zinc-500 py-8">
              <Users className="size-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No online users</p>
              <button
                onClick={() => setShowOnlineOnly(false)}
                className="text-xs text-blue-500 hover:underline mt-1"
              >
                Show all contacts
              </button>
            </div>
          )}
      </div>
    </aside>
  );
};

export default Sidebar;
