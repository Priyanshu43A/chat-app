import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, AlertTriangle, Wifi, WifiOff } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    error,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLocalError(null);
        await getUsers();
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setLocalError(
          "Failed to load contacts. Please try refreshing the page."
        );
      }
    };

    fetchUsers();
  }, [getUsers]);

  // Validate and ensure users is an array
  const validUsers = Array.isArray(users) ? users : [];
  const validOnlineUsers = Array.isArray(onlineUsers) ? onlineUsers : [];

  // Filter and sort users with proper error handling
  const filteredUsers = (() => {
    try {
      if (showOnlineOnly) {
        return validUsers.filter(
          (user) => user && user._id && validOnlineUsers.includes(user._id)
        );
      }

      return validUsers
        .filter((user) => user && user._id && user.fullName) // Filter out invalid users
        .sort((a, b) => {
          try {
            // Sort by online status first (online users at top)
            const aIsOnline = validOnlineUsers.includes(a._id);
            const bIsOnline = validOnlineUsers.includes(b._id);

            if (aIsOnline && !bIsOnline) return -1;
            if (!aIsOnline && bIsOnline) return 1;

            // If both have same online status, sort alphabetically by fullName
            return (a.fullName || "").localeCompare(b.fullName || "");
          } catch (sortError) {
            console.warn("Error sorting users:", sortError);
            return 0;
          }
        });
    } catch (filterError) {
      console.error("Error filtering users:", filterError);
      setLocalError("Error processing contact list");
      return [];
    }
  })();

  const onlineCount =
    validOnlineUsers.length > 0 ? validOnlineUsers.length - 1 : 0;

  // Show loading skeleton
  if (isUsersLoading) return <SidebarSkeleton />;

  // Show error state
  if (error || localError) {
    return (
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="border-b border-base-300 w-full p-5">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <AlertTriangle className="size-8 text-error mx-auto mb-2" />
            <p className="text-sm text-error mb-2 hidden lg:block">
              {error || localError}
            </p>
            <button
              onClick={() => {
                setLocalError(null);
                getUsers();
              }}
              className="btn btn-sm btn-outline hidden lg:flex"
            >
              Try Again
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
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500 flex items-center gap-1">
            <Wifi className="size-3" />({onlineCount} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3 flex-1">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            // Additional safety check for each user
            if (!user || !user._id) {
              return null;
            }

            const isOnline = validOnlineUsers.includes(user._id);

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
                  {isOnline && (
                    <span
                      className="absolute bottom-0 right-0 size-3 bg-green-500
                       rounded-full ring-2 ring-zinc-900"
                    />
                  )}
                </div>

                {/* User info - only visible on larger screens */}
                <div className="hidden lg:block text-left min-w-0 flex-1">
                  <div className="font-medium truncate">
                    {user.fullName || user.name || "Unknown User"}
                  </div>
                  <div className="text-sm text-zinc-400 flex items-center gap-1">
                    {isOnline ? (
                      <>
                        <Wifi className="size-3 text-green-500" />
                        Online
                      </>
                    ) : (
                      <>
                        <WifiOff className="size-3" />
                        Offline
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center text-zinc-500 py-8">
            <Users className="size-8 mx-auto mb-2 opacity-50" />
            <p className="hidden lg:block">
              {showOnlineOnly ? "No online users" : "No contacts available"}
            </p>
            {!showOnlineOnly && validUsers.length === 0 && (
              <button
                onClick={() => getUsers()}
                className="btn btn-sm btn-ghost mt-2 hidden lg:flex mx-auto"
              >
                Refresh
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
