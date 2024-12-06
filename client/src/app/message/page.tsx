
"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { useRouter, useSearchParams } from "next/navigation";

interface ChatMessage {
  from: "me" | "other";
  text: string;
  role: string;
}

interface ChatUser {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  messages: ChatMessage[];
}
interface Message {
  messageId: number;
  expertId: number;
  expertName: string;
  userId: number;
  userName: string;
  message: string;
  role: string;
}


const MessagePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const Id = searchParams.get("id");
  const userName = searchParams.get("name");
  const role = searchParams.get("role");
  const chatId = searchParams.get("chatId");
  const newmsgId=searchParams.get("newchatId");
  const newchatname=searchParams.get("newchatName");

  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [activeChat, setActiveChat] = useState<ChatUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch chats from backend
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const queryParams =
        role === "expert"
          ? `role=${role}&id=${Id}`
          : role === "user"
          ? `role=${role}&id=${Id}`
          : "";

        const response = await fetch(`http://localhost:8000/message/?${queryParams}`);
  
        if (!response.ok) {
          throw new Error("Failed to fetch chats.");
        }
  
        const messages: Message[] = await response.json();
        console.log(messages)
  
        // Group messages by `expertId`
        const groupedChats: ChatUser[] = [];
        const chatMap: Record<number, ChatUser> = {};
  
        messages.forEach((msg) => {
          const dynamicId = role === "expert" ? msg.userId : msg.expertId;
          const dynamicName = role === "expert" ? msg.userName : msg.expertName;
          if (!chatMap[dynamicId]) {
            chatMap[dynamicId] = {
              id: dynamicId,
              name: dynamicName,
              avatar: "https://via.placeholder.com/40",
              lastMessage: msg.message, // Start with the current message
              messages: [],
            };
          }
          chatMap[dynamicId].messages.push({
            from: msg.role === "user" ? "me" : "other",
            text: msg.message,
            role: msg.role,
          });
  
          // Update the lastMessage dynamically to ensure it's the latest message
          chatMap[dynamicId].lastMessage = msg.message;
        });
  
        groupedChats.push(...Object.values(chatMap));
        setChatUsers(groupedChats);
  
        if (newmsgId) {
          const match =
            role === "expert"
              ? groupedChats.find((chat) => chat.id === parseInt(newmsgId, 10))
              : groupedChats.find((chat) => chat.id === parseInt(newmsgId, 10));
  
          if (match) {
            // If matching chat exists, set it as active and update the URL
            setActiveChat(match);
            router.push(
              `/message?id=${Id}&name=${encodeURIComponent(
                userName!
              )}&role=${role}&chatId=${newmsgId}`
            );
          } else {
            // If no matching chat exists, create a new chat
            const newChat: ChatUser = {
              id: parseInt(newmsgId, 10),
              name: newchatname?? "New Conversation",
              avatar: "https://via.placeholder.com/40",
              lastMessage: "",
              messages: [],
            };
  
            setChatUsers((prevChats) => [...prevChats, newChat]);
            setActiveChat(newChat);
            router.push(
              `/message?id=${Id}&name=${encodeURIComponent(
                userName!
              )}&role=${role}&chatId=${newmsgId}`
            );
          }
        } else if (chatId) {
          // If `chatId` exists, set it as active chat
          const activeChat = groupedChats.find((chat) => chat.id === parseInt(chatId, 10));
          if (activeChat) setActiveChat(activeChat);
        }
      } catch (err: any) {
        console.error("Error fetching chats:", err);
        setError(err.message);
      }
    };
  
    fetchChats();
  }, [role,Id, chatId,newmsgId]);
  
  
  
  
// Handle Sending Messages
const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const messageInput = e.currentTarget.message as HTMLInputElement;

  if (!messageInput.value.trim() || !activeChat) return;

  const newMessage: ChatMessage = {
    from: "me",
    text: messageInput.value,
    role: role!,
  };

  try {
    const payload = {
      // If the role is expert, `id` is the expert's ID, and `activeChat.id` is the user's ID
      // If the role is user, `id` is the user's ID, and `activeChat.id` is the expert's ID
      id: Id,
      expertId: role === "expert" ? Id : activeChat.id, // Expert sends their own ID, user sends activeChat ID
      userId: role === "expert" ? activeChat.id : Id, // Expert sends activeChat ID, user sends their own ID
      message: newMessage.text,
      role,
    };

    const response = await fetch("http://localhost:8000/message/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to send message.");
    }

    const result = await response.json();
    console.log("Message sent:", result);

    // Update the active chat's messages and lastMessage
    setActiveChat((prevChat) => {
      if (!prevChat) return null;
      return {
        ...prevChat,
        lastMessage: newMessage.text,
        messages: [...prevChat.messages, newMessage],
      };
    });

    // Update the sidebar's `chatUsers` to reflect the latest message
    setChatUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === activeChat.id
          ? { ...user, lastMessage: newMessage.text }
          : user
      )
    );

    messageInput.value = "";
  } catch (err) {
    console.error("Error sending message:", err);
    setError("Failed to send message.");
  }
};

  

  const handleChatSelection = (user: ChatUser) => {
    setActiveChat(user);
    console.log("activechat",activeChat)
    router.push(
      `/message?id=${Id}&name=${encodeURIComponent(userName!)}&role=${role}&chatId=${user.id}`
    );
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="mt-24 flex-grow flex bg-gray-100">
        {/* Left Sidebar */}

        <div className="w-1/4 bg-white shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">Chats</h2>
          <ul className="space-y-4">
            {chatUsers.map((user) => (
              <li
                key={user.id}
                onClick={() => handleChatSelection(user)}
                className={`cursor-pointer p-2 rounded-lg ${
                  activeChat?.id === user.id ? "bg-gray-200" : ""
                }`}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      {user.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>


        {/* Chat Area */}
        <div className="flex-grow flex flex-col bg-white shadow-md">
          {/* Chat Header */}
          <div className="flex items-center p-4 border-b border-gray-200">
            <img
              src={activeChat?.avatar || "https://via.placeholder.com/40"}
              alt={activeChat?.name || "Unknown"}
              className="w-10 h-10 rounded-full"
            />
            <h2 className="ml-4 text-lg font-bold">{activeChat?.name || "Select a chat"}</h2>
          </div>

          {/* Chat History */}

            <div className="flex-grow p-4 overflow-y-auto">
              {activeChat?.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    (role === "user" && message.role === "expert") ||
                    (role === "expert" && message.role === "user")
                      ? "justify-start"
                      : "justify-end"
                  } mb-4`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      (role === "user" && message.role === "expert") ||
                      (role === "expert" && message.role === "user")
                        ? "bg-gray-200 text-gray-800"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>


          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
              <input
                name="message"
                type="text"
                placeholder="Type your message..."
                className="flex-grow border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
