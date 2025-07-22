import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Memoized scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  // Handle messages fetching and subscription
  useEffect(() => {
    if (!selectedUser?._id || !authUser) return;

    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [
    selectedUser?._id,
    authUser,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages && messages.length > 0) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, scrollToBottom]);

  // Early return if no user selected
  if (!selectedUser || !authUser) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>Select a user to start chatting</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  // Empty messages state
  const renderEmptyState = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center text-gray-500 space-y-2">
        <div className="text-6xl mb-4">💬</div>
        <p className="text-lg font-medium">No messages yet</p>
        <p className="text-sm opacity-75">
          Start a conversation with{" "}
          {selectedUser.fullName || selectedUser.username}
        </p>
      </div>
    </div>
  );

  // Message component
  const MessageBubble = ({ message, isOwnMessage }) => (
    <div
      className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
      key={message._id}
    >
      <div className="chat-image avatar">
        <div className="size-10 rounded-full border overflow-hidden bg-gray-200">
          <img
            src={
              isOwnMessage
                ? authUser.profilePic || "/avatar.png"
                : selectedUser.profilePic || "/avatar.png"
            }
            alt={`${
              isOwnMessage ? authUser.username : selectedUser.username
            } avatar`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/avatar.png";
            }}
          />
        </div>
      </div>

      <div className="chat-header mb-1">
        <span className="text-xs opacity-70 ml-1 font-medium">
          {isOwnMessage
            ? "You"
            : selectedUser.fullName || selectedUser.username}
        </span>
        <time className="text-xs opacity-50 ml-2">
          {formatMessageTime(message.createdAt)}
        </time>
      </div>

      <div
        className={`chat-bubble ${
          isOwnMessage ? "chat-bubble-primary" : "chat-bubble-secondary"
        } flex flex-col max-w-xs sm:max-w-md`}
      >
        {message.image && (
          <div className="mb-2">
            <img
              src={message.image}
              alt="Attachment"
              className="max-w-full h-auto rounded-md cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => {
                // Optional: Open image in modal or new tab
                window.open(message.image, "_blank");
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}
        {message.text && (
          <p className="break-words whitespace-pre-wrap leading-relaxed">
            {message.text}
          </p>
        )}
        {!message.text && !message.image && (
          <p className="italic opacity-60">Message content unavailable</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-base-100">
      <ChatHeader />

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {!messages || messages.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {messages.map((message) => {
              const isOwnMessage = message.senderId === authUser._id;
              return (
                <MessageBubble
                  key={message._id}
                  message={message}
                  isOwnMessage={isOwnMessage}
                />
              );
            })}
            {/* Invisible element to scroll to */}
            <div ref={messageEndRef} className="h-1" />
          </>
        )}
      </div>

      <MessageInput onMessageSent={scrollToBottom} />
    </div>
  );
};

export default ChatContainer;
