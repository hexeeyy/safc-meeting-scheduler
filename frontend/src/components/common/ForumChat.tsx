"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Send, Users, MoreVertical } from "lucide-react"

interface User {
  id: string
  name: string
  avatar: string
  online: boolean
  lastSeen?: string
}

interface Message {
  id: string
  userId: string
  content: string
  timestamp: Date
  type: "text" | "system"
}

const mockUsers: User[] = [
  { id: "1", name: "Alice Johnson", avatar: "/placeholder.svg?height=32&width=32", online: true },
  { id: "2", name: "Bob Smith", avatar: "/placeholder.svg?height=32&width=32", online: true },
  {
    id: "3",
    name: "Carol Davis",
    avatar: "/placeholder.svg?height=32&width=32",
    online: false,
    lastSeen: "2 hours ago",
  },
  { id: "4", name: "David Wilson", avatar: "/placeholder.svg?height=32&width=32", online: true },
  { id: "5", name: "Eva Brown", avatar: "/placeholder.svg?height=32&width=32", online: false, lastSeen: "1 day ago" },
]

const initialMessages: Message[] = [
  {
    id: "1",
    userId: "2",
    content: "Hey everyone! How's the project going?",
    timestamp: new Date(Date.now() - 3600000),
    type: "text",
  },
  {
    id: "2",
    userId: "1",
    content: "Going great! Just finished the user authentication part.",
    timestamp: new Date(Date.now() - 3500000),
    type: "text",
  },
  {
    id: "3",
    userId: "4",
    content: "Nice work Alice! I'm working on the database schema now.",
    timestamp: new Date(Date.now() - 3000000),
    type: "text",
  },
  {
    id: "4",
    userId: "2",
    content: "Perfect timing. Let me know if you need any help with the API endpoints.",
    timestamp: new Date(Date.now() - 2500000),
    type: "text",
  },
  {
    id: "5",
    userId: "1",
    content: "Thanks Bob! I might need some help with the real-time features later.",
    timestamp: new Date(Date.now() - 2000000),
    type: "text",
  },
]

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [currentUser] = useState<User>(mockUsers[0]) // Simulate current user as Alice
  const [onlineUsers, setOnlineUsers] = useState<User[]>(mockUsers)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulate receiving messages from other users
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance every 10 seconds
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
        if (randomUser.id !== currentUser.id && randomUser.online) {
          const responses = [
            "That sounds great!",
            "I agree with that approach.",
            "Let me check on that.",
            "Good point!",
            "I'll get back to you on this.",
            "Thanks for the update!",
          ]
          const randomResponse = responses[Math.floor(Math.random() * responses.length)]

          const newMsg: Message = {
            id: Date.now().toString(),
            userId: randomUser.id,
            content: randomResponse,
            timestamp: new Date(),
            type: "text",
          }

          setMessages((prev) => [...prev, newMsg])
        }
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [currentUser.id])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        userId: currentUser.id,
        content: newMessage.trim(),
        timestamp: new Date(),
        type: "text",
      }

      setMessages((prev) => [...prev, message])
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getUserById = (userId: string) => {
    return onlineUsers.find((user) => user.id === userId)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}

    messages.forEach((message) => {
      const dateKey = message.timestamp.toDateString()
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
    })

    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar with users */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Team Chat</h2>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
              <AvatarFallback>
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Online ({onlineUsers.filter((u) => u.online).length})
            </h3>
            {onlineUsers
              .filter((user) => user.online)
              .map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-green-600">Online</p>
                  </div>
                </div>
              ))}

            {onlineUsers.filter((user) => !user.online).length > 0 && (
              <>
                <Separator className="my-3" />
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Offline ({onlineUsers.filter((u) => !u.online).length})
                </h3>
                {onlineUsers
                  .filter((user) => !user.online)
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer opacity-60"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.lastSeen}</p>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">General</h1>
              <p className="text-sm text-gray-500">{onlineUsers.filter((u) => u.online).length} members online</p>
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {Object.entries(messageGroups).map(([dateKey, dayMessages]) => (
              <div key={dateKey}>
                <div className="flex items-center justify-center my-4">
                  <Badge variant="secondary" className="text-xs">
                    {formatDate(new Date(dateKey))}
                  </Badge>
                </div>

                {dayMessages.map((message, index) => {
                  const user = getUserById(message.userId)
                  const isCurrentUser = message.userId === currentUser.id
                  const prevMessage = index > 0 ? dayMessages[index - 1] : null
                  const showAvatar = !prevMessage || prevMessage.userId !== message.userId

                  return (
                    <div key={message.id} className={`flex gap-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                      {!isCurrentUser && (
                        <div className="flex-shrink-0">
                          {showAvatar ? (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                              <AvatarFallback>
                                {user?.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-8 w-8" />
                          )}
                        </div>
                      )}

                      <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? "order-1" : ""}`}>
                        {showAvatar && !isCurrentUser && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                            <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                          </div>
                        )}

                        <div
                          className={`rounded-lg px-3 py-2 ${
                            isCurrentUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          {isCurrentUser && (
                            <p className="text-xs text-blue-100 mt-1">{formatTime(message.timestamp)}</p>
                          )}
                        </div>
                      </div>

                      {isCurrentUser && (
                        <div className="flex-shrink-0">
                          {showAvatar ? (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                              <AvatarFallback>
                                {currentUser.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-8 w-8" />
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
