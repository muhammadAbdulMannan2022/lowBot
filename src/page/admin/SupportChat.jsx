"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Paperclip, Mic, Send, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import videoMic from "../../assets/video.svg";
import voice from "../../assets/voice.svg";
import Sidebar from "../../component/admin/Sidebar";
import ChatSideBaIcon from "../../assets/chatbar.svg";
import axiosInstance from "../../component/axiosInstance";
import { Link, useParams } from "react-router-dom";
import wsManager from "../../socket/socket";

export default function SupportChat() {
  const [activeFilter, setActiveFilter] = useState("critical");
  const [message, setMessage] = useState("");
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [chats, setChats] = useState([]); // List of chats
  const [selectedChat, setSelectedChat] = useState(null); // Selected chat
  const [messages, setMessages] = useState([]); // Messages for the selected chat
  const messagesEndRef = useRef(null); // Ref to scroll to the latest message
  const route = useParams();
  const [chatId, setChatId] = useState(null);
  // Fetch all chats for the mentor
  const fetchChats = async () => {
    try {
      const response = await axiosInstance.get(
        "/realtime/chats/list_user_chats/"
      ); // Adjust endpoint as needed
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      alert("An error occurred while fetching chats.");
    }
  };
  useEffect(() => {
    fetchChats();
  }, []);

  const fetchMessages = async (chat_id) => {
    try {
      const response = await axiosInstance.get(
        `/realtime/chats/history/${chat_id}/`
      );
      setMessages(response.data);
      const chat = await axiosInstance.get("/chats/");
      const filter = chat.data.find((item) => item.chat_id === chat_id);
      setSelectedChat(filter);
      setActiveFilter(filter.problem_level);
    } catch (error) {
      console.error("Error fetching messages:", error);
      alert("An error occurred while fetching messages.");
    }
  };
  useEffect(() => {
    if (route.id) {
      const chat_id = route.id;
      setChatId(chat_id);

      fetchMessages(chat_id);
    }
  }, [route.id]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filter chats based on priority
  const filteredChats = chats.filter((chat) => {
    if (activeFilter === "critical") return chat.problem_level === "Critical";
    if (activeFilter === "medium") return chat.problem_level === "Medium";
    if (activeFilter === "general") return chat.problem_level === "General";
    return true;
  });

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;
    try {
      await axiosInstance.post(`/chats/${chatId}/history/`, {
        message: message,
        sender_type: "mentor",
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender_type: "mentor",
          message: message,
          timestamp: new Date(),
        },
      ]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred while sending the message.");
    }
  };

  // Handle accepting a chat
  const handleAccept = async () => {
    if (!selectedChat) return;

    try {
      await axiosInstance.put(`/chats/${chatId}/mentor_accept_request/`);
      // Refresh chats after accepting
      const response = await axiosInstance.get(
        "/realtime/chats/list_user_chats/"
      );
      setChats(response.data);

      const filter = response.data.find((item) => item.chat_id === chatId);

      setSelectedChat(filter);
    } catch (error) {
      console.error("Error accepting chat:", error);
      alert("An error occurred while accepting the chat.");
    }
  };

  // Handle declining a chat
  const handleDecline = async () => {
    if (!selectedChat) return;

    try {
      // Assuming there's an endpoint to decline a chat
      await axiosInstance.put(`/chats/${chatId}/decline/`, {});
      setSelectedChat(null);
      const response = await axiosInstance.get("/chats/");
      setChats(response.data);
    } catch (error) {
      console.error("Error declining chat:", error);
      alert("An error occurred while declining the chat.");
    }
  };

  // Toggle user list sidebar
  const toggleUserList = () => {
    setIsUserListOpen((prev) => !prev);
  };

  const handleMark = async () => {
    await axiosInstance.put(`chats/${chatId}/mark-as-solved/`, {});

    fetchMessages(chatId);
  };

  // console.logf('chat.is_finding', selectedChat);
  return (
    <div className="flex flex-col h-screen bg-[#f0f7ff]">
      <Sidebar>
        <div className="mt-10 rounded-lg bg-gray-50 p-4 md:p-6">
          <div className="flex items-center gap-4">
            <img
              src={ChatSideBaIcon}
              alt=""
              className="h-10 w-10 md:hidden"
              onClick={toggleUserList}
            />
            <h1 className="text-xl font-semibold py-4">Messages</h1>
          </div>
          <div className="flex bg-white rounded-md border relative">
            {/* Overlay for User List on Mobile */}
            {isUserListOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-50 md:hidden"
                onClick={toggleUserList}
                aria-hidden="true"
              />
            )}

            {/* User List Sidebar */}
            <div
              className={`fixed inset-y-0 left-0 w-64 bg-white border-r z-50 md:z-0 transition-transform duration-300 ease-in-out md:static md:w-80 md:translate-x-0 ${
                isUserListOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="p-4 border-b">
                <div className="relative border rounded-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search name"
                    className="pl-9 bg-white w-full"
                    aria-label="Search users"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-sm mb-2">Filters:</p>
                  <Tabs
                    defaultValue="critical"
                    value={activeFilter}
                    onValueChange={setActiveFilter}
                  >
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger
                        value="critical"
                        className={
                          activeFilter.toLowerCase() === "critical"
                            ? "bg-blue-500 text-white"
                            : ""
                        }
                        aria-label="Filter by critical priority"
                      >
                        Critical
                      </TabsTrigger>
                      <TabsTrigger
                        className={
                          activeFilter.toLowerCase() == "medium"
                            ? "bg-blue-500 text-white"
                            : ""
                        }
                        value="medium"
                        aria-label="Filter by medium priority"
                      >
                        Medium
                      </TabsTrigger>
                      <TabsTrigger
                        className={
                          activeFilter.toLowerCase() === "general"
                            ? "bg-blue-500 text-white"
                            : ""
                        }
                        value="general"
                        aria-label="Filter by general priority"
                      >
                        General
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              <div className="overflow-y-auto md:h-[calc(100vh-25rem)] h-[calc(100vh-14rem)]">
                {filteredChats.map((chat) => (
                  <Link
                    to={`/supportchat/${chat.chat_id}`}
                    key={chat.chat_id}
                    className={`flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer border-b ${
                      chatId === chat.chat_id ? "bg-gray-200" : ""
                    }`}
                  >
                    <Avatar>
                      <img
                        src={`http://127.0.0.1:8000${chat?.user?.user_profile?.profile_picture}`}
                        alt={chat?.user?.username || "User"}
                        className="h-10 w-10 rounded-full"
                      />
                    </Avatar>
                    <span className="text-sm md:text-base">
                      {chat?.user?.user_profile?.first_name || "Unknown User"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              <div className="overflow-y-auto md:h-[70vh]">
                {selectedChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <img
                            src={`http://127.0.0.1:8000${selectedChat?.user?.user_profile?.profile_picture}`}
                            alt={
                              selectedChat.user?.user_profile?.first_name ||
                              "User"
                            }
                            className="h-10 w-10 rounded-full"
                          />
                        </Avatar>
                        <span className="text-sm md:text-base">
                          {selectedChat.user?.user_profile?.first_name ||
                            "Unknown User"}
                        </span>
                      </div>
                      {selectedChat.status === "UNSOLVED" && (
                        <Button
                          onClick={() => handleMark()}
                          variant="outline"
                          className="bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto"
                          aria-label="Mark as solved"
                        >
                          Mark as Sloved
                        </Button>
                      )}
                    </div>

                    {/* Chat Details */}
                    <div className="p-4 border-b bg-slate-100 px-4 py-2 ">
                      <div className="mb-2">
                        <span className="font-medium text-sm md:text-base">
                          Title:
                        </span>{" "}
                        {selectedChat?.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm md:text-base">
                          Priority level:
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-blue-500 text-white"
                        >
                          {selectedChat?.problem_level}
                        </Badge>
                      </div>
                      <p className="mt-2 text-gray-700 text-sm md:text-base">
                        {selectedChat.description ||
                          messages[5]?.message ||
                          "No description provided."}
                      </p>
                    </div>

                    {/* Support Request */}
                    {selectedChat?.mentor?.length > 1 && (
                      <div className="p-4 border-b flex flex-col gap-4 justify-between items-center">
                        <span className="text-sm md:text-base">
                          Person giving you support request?
                        </span>
                        <div className="flex gap-2 flex-wrap justify-center">
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto hover:text-white"
                            onClick={handleDecline}
                          >
                            Decline
                          </Button>
                          <Button
                            className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
                            onClick={handleAccept}
                          >
                            Accept
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Chat Messages */}
                    <div
                      className="flex-1 overflow-y-auto p-4 space-y-4"
                      style={{ paddingBottom: "80px" }}
                    >
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender_type === "mentor" ||
                            msg.sender_type === "bot"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {msg.sender_type !== "mentor" &&
                            msg.sender_type !== "bot" && (
                              <Avatar className="mr-2 flex-shrink-0">
                                <img
                                  src={`http://127.0.0.1:8000${selectedChat?.user?.user_profile?.profile_picture}`}
                                  alt={selectedChat?.user?.username || "User"}
                                  className="h-8 w-8 rounded-full"
                                />
                              </Avatar>
                            )}
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              msg.sender_type === "mentor"
                                ? "bg-[#EAF3FB] text-gray-800"
                                : "bg-white border text-gray-800"
                            }`}
                          >
                            <p className="text-sm md:text-base">
                              {msg.message}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center min-h-[60vh] text-center text-gray-500">
                    <div className="p-4 text-lg">
                      Select a chat to start messaging.
                    </div>
                  </div>
                )}
              </div>

              {/* Fixed Chat Input */}
              {selectedChat && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-center gap-2 md:static md:bg-transparent md:border-t-0 md:p-4 z-20">
                  <img
                    src={videoMic}
                    alt="Video icon"
                    className="cursor-pointer h-10 w-10"
                  />
                  <div className="px-2 py-2 bg-[#E9ECF3] w-full max-w-5xl rounded-3xl flex items-center gap-2">
                    <Paperclip size={20} className="text-gray-500" />
                    <div className="bg-white w-full rounded-3xl px-4 flex items-center justify-between">
                      <input
                        placeholder="Start chat"
                        // className="border-none focus-visible: outline-none rounded-3xl text-sm md:text-base"
                        className="flex h-10 w-full border border-input bg-background px-3 py-2  file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 border-none outline-none rounded-3xl text-sm md:text-base"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                      />
                      <div className="flex items-center gap-2">
                        <Mic
                          size={20}
                          className="text-gray-500 cursor-pointer md:block hidden"
                        />
                        <Mic
                          size={35}
                          className="text-gray-500 cursor-pointer md:hidden block"
                        />
                        <img src={voice} alt="Voice icon" className="h-5 w-5" />
                      </div>
                    </div>
                    <button
                      aria-label="Send message"
                      onClick={handleSendMessage}
                    >
                      <Send size={20} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
