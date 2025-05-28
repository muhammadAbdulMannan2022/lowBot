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
import { useAuth } from "../../component/AuthContext";

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
  const [isRequest, setIsRequest] = useState(true);
  const [oldChats, setOldChats] = useState([]);
  const { auth } = useAuth();
  // socket
  const chatWs = useRef(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    setChatId(route.id);
  }, [route]);

  const RECONNECT_INTERVAL = 100; // 3 seconds

  useEffect(() => {
    let reconnectTimeout;
    let shouldReconnect = true;

    const connectWebSocket = () => {
      if (!token || !chatId) return;

      chatWs.current = new WebSocket(
        `ws://192.168.10.124:3100/ws/api/v1/chat/?Authorization=Bearer ${token}`
      );

      chatWs.current.onopen = () => {
        console.log("chat WebSocket connected");
      };

      chatWs.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const receivedData = data.message;

        if (data.main_chat_id === chatId) {
          const mess = {
            id: receivedData.id || "",
            message: receivedData.message,
            attachment_name: receivedData.attachment_name || null,
            attachment_data: receivedData.attachment_data || null,
            sender: receivedData.sender,
            receiver: receivedData.receiver,
            reply_to: receivedData.reply_to,
            timestamp: receivedData.timestamp,
            is_read: receivedData.is_read,
            is_deleted: receivedData.is_deleted,
            is_edited: receivedData.is_edited,
            is_reported: receivedData.is_reported,
            sender_type: receivedData.sender_type || "user",
          };
          setMessages((prevMessage) => [...prevMessage, mess]);
        }
      };

      chatWs.current.onerror = (err) => {
        console.error("chat WebSocket error:", err);
        chatWs.current.close(); // Trigger onclose to reconnect
      };

      chatWs.current.onclose = () => {
        console.log("chat WebSocket closed");
        if (shouldReconnect) {
          reconnectTimeout = setTimeout(connectWebSocket, RECONNECT_INTERVAL);
        }
      };
    };

    connectWebSocket(); // Initial connection

    return () => {
      shouldReconnect = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (chatWs.current) chatWs.current.close();
    };
  }, [token, chatId]);

  //
  //
  //
  const handleRToggle = () => {
    setIsRequest((prev) => !prev);
  };

  // Fetch all chats for the mentor
  const fetchChats = async () => {
    try {
      const endpoint = isRequest
        ? "/chats/help-desk/tickets/list/"
        : "/chats/help_desk/running/list/";
      const response = await axiosInstance.get(endpoint);
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      alert("An error occurred while fetching chats.");
    }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(() => {
      fetchChats();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [isRequest]);

  const fetchMessages = async (chat_id) => {
    try {
      const response = await axiosInstance.get(
        `/realtime/chats/history/${chat_id}/`
      );
      const currentUserId = Number(localStorage.getItem("id"));

      // Combine and set sender_type if missing
      const combinedMessages = [
        ...(response.data?.bot_messages || []),
        ...(response.data?.messages || []),
      ].map((msg) => {
        if (!msg.sender_type) {
          // If receiver is current user, sender is mentor
          if (msg.sender === currentUserId) {
            console.log(msg.receiver, currentUserId);
            return { ...msg, sender_type: "mentor" };
          } else {
            return { ...msg, sender_type: "user" };
          }
        }
        return msg;
      });

      setMessages(combinedMessages);
      console.log(response.data?.bot_messages, combinedMessages);
      const endpoint = isRequest
        ? "/chats/help-desk/tickets/list/"
        : "/chats/help_desk/running/list/";
      const chat = await axiosInstance.get(endpoint);
      // const chat = await axiosInstance.get("/chats/help-desk/tickets/list/");
      const filter = chat.data.find((item) => {
        console.log(item.chat_id, chat_id);
        return item.chat_id === chat_id;
      });

      setSelectedChat(filter);
      // setActiveFilter(filter.problem_level);
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
  }, [route.id, isRequest]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filter chats based on priority
  const filteredChats = chats.filter((chat) => {
    console.log(chat.problem_level);
    if (activeFilter === "critical") return chat.problem_level === "Critical";
    if (activeFilter === "medium") return chat.problem_level === "Medium";
    if (activeFilter === "general") return chat.problem_level === "General";
    return true;
  });

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;
    const user_to_send = chats.find((chat) => chat.chat_id === chatId);
    console.log(user_to_send?.user);
    chatWs.current.send(
      JSON.stringify({
        user_id: user_to_send?.user,
        message,
        main_chat_id: chatId,
        sender_type: "mentor",
      })
    );
    try {
      // await axiosInstance.post(`/chats/${chatId}/history/`, {
      //   message: message,
      //   sender_type: "mentor",
      // });
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
      await axiosInstance.post(`/chats/help_desk/approved/${chatId}/`);
      // Refresh chats after accepting
      const response = await axiosInstance.get(
        "/realtime/chats/list_user_chats/"
      );
      setOldChats(response.data);

      const filter = response.data.find((item) => item.chat_id === chatId);

      setSelectedChat(filter);
      setMessage("");
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
    <div className="flex flex-col h-screen bg-[#f0f7ff] dark:bg-gray-900">
      <Sidebar>
        <div className="mt-10 rounded-lg bg-gray-50 dark:bg-gray-800 p-4 md:p-6">
          <div className="flex items-center gap-4">
            <img
              src={ChatSideBaIcon}
              alt=""
              className="h-10 w-10 md:hidden"
              onClick={toggleUserList}
            />
            <h1 className="text-xl font-semibold py-4 text-gray-900 dark:text-white">
              Messages
            </h1>
          </div>
          <div className="flex bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700 relative">
            {isUserListOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-50 md:hidden"
                onClick={toggleUserList}
                aria-hidden="true"
              />
            )}

            <div
              className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 z-50 md:z-0 transition-transform duration-300 ease-in-out md:static md:w-80 md:translate-x-0 ${
                isUserListOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="p-4 border-b dark:border-gray-700">
                <div className="flex items-center justify-center rounded-lg overflow-hidden mb-4">
                  <button
                    onClick={handleRToggle}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded ${
                      isRequest
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    Request
                  </button>
                  <button
                    onClick={handleRToggle}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded ${
                      !isRequest
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    Running
                  </button>
                </div>
                <div className="flex gap-4">
                  <div className="relative border rounded-md dark:border-gray-700 w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 h-4 w-4" />
                    <Input
                      placeholder="Search name"
                      className="pl-9 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full"
                      aria-label="Search users"
                    />
                  </div>
                </div>

                {isRequest && (
                  <div className="mt-4">
                    <Tabs
                      defaultValue="critical"
                      value={activeFilter}
                      onValueChange={setActiveFilter}
                    >
                      <TabsList className="grid grid-cols-3 w-full">
                        {["critical", "medium", "general"].map((val) => (
                          <TabsTrigger
                            key={val}
                            value={val}
                            className={`${
                              activeFilter.toLowerCase() === val
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            }`}
                            aria-label={`Filter by ${val} priority`}
                          >
                            {val.charAt(0).toUpperCase() + val.slice(1)}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                )}
              </div>

              <div className="overflow-y-auto md:h-[calc(100vh-25rem)] h-[calc(100vh-14rem)]">
                {filteredChats.map((chat) => (
                  <Link
                    to={`/supportchat/${chat.chat_id}`}
                    key={chat.chat_id}
                    className={`flex items-center gap-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b dark:border-gray-700 ${
                      chatId === chat.chat_id
                        ? "bg-gray-200 dark:bg-gray-700"
                        : ""
                    }`}
                  >
                    <Avatar>
                      <img
                        src={
                          `http://127.0.0.1:8000${chat?.user?.user_profile?.profile_picture}` ||
                          chat.image
                        }
                        alt={chat?.user?.username || "User"}
                        className="h-10 w-10 rounded-full"
                      />
                    </Avatar>
                    <span className="text-sm md:text-base text-gray-900 dark:text-white">
                      {chat?.user?.user_profile?.first_name ||
                        chat?.username ||
                        "Unknown User"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="overflow-y-auto md:h-[70vh]">
                {selectedChat ? (
                  <>
                    <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b dark:border-gray-700 gap-4">
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
                        <span className="text-sm md:text-base text-gray-900 dark:text-white">
                          {selectedChat.user?.user_profile?.first_name ||
                            "Unknown User"}
                        </span>
                      </div>
                      {selectedChat.status === "UNSOLVED" && (
                        <Button
                          onClick={handleMark}
                          variant="outline"
                          className="bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto"
                          aria-label="Mark as solved"
                        >
                          Mark as Solved
                        </Button>
                      )}
                    </div>

                    <div className="p-4 border-b dark:border-gray-700 bg-slate-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
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
                          className="bg-blue-500 text-white dark:text-white"
                        >
                          {selectedChat?.problem_level}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm md:text-base">
                        {selectedChat.description ||
                          messages[5]?.message ||
                          "No description provided."}
                      </p>
                    </div>

                    {!selectedChat?.mentor && (
                      <div className="p-4 border-b dark:border-gray-700 flex flex-col gap-4 justify-between items-center">
                        <span className="text-sm md:text-base text-gray-900 dark:text-white">
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
                                ? "bg-[#EAF3FB] dark:bg-blue-900 text-gray-800 dark:text-white"
                                : "bg-white dark:bg-gray-700 border dark:border-gray-600 text-gray-800 dark:text-gray-100"
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
                  <div className="flex items-center justify-center min-h-[60vh] text-center text-gray-500 dark:text-gray-300">
                    <div className="p-4 text-lg">
                      Select a chat to start messaging.
                    </div>
                  </div>
                )}
              </div>

              {selectedChat && (
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4 flex items-center justify-center gap-2 md:static md:bg-transparent md:border-t-0 md:p-4 z-20">
                  {/* <img
                    src={videoMic}
                    alt="Video icon"
                    className="cursor-pointer h-10 w-10"
                  /> */}
                  <div className="px-2 py-2 bg-[#E9ECF3] dark:bg-gray-700 w-full max-w-5xl rounded-3xl flex items-center gap-2">
                    <Paperclip size={20} className="text-gray-500" />
                    <div className="bg-white dark:bg-gray-800 w-full rounded-3xl px-4 flex items-center justify-between">
                      <input
                        placeholder="Start chat"
                        className="flex h-10 w-full bg-background dark:bg-gray-800 text-black dark:text-white placeholder:text-muted-foreground dark:placeholder-gray-400 border-none outline-none rounded-3xl text-sm md:text-base"
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
                        {/* <img src={voice} alt="Voice icon" className="h-5 w-5" /> */}
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
