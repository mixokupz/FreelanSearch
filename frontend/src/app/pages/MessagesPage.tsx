import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { Search, Send, Paperclip } from "lucide-react";
import { useState } from "react";
import { mockMessages, mockUsers } from "../data/mockData";

export function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");

  // Группируем сообщения по собеседникам
  const conversations = mockMessages.reduce((acc, message) => {
    const otherUserId = message.fromId === "7" ? message.toId : message.fromId;
    if (!acc[otherUserId]) {
      acc[otherUserId] = [];
    }
    acc[otherUserId].push(message);
    return acc;
  }, {} as Record<string, typeof mockMessages>);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && selectedChat) {
      // Симуляция отправки сообщения
      setMessageText("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-200px)]">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                {/* Список чатов */}
                <div className="border-r">
                  <div className="p-4 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Поиск сообщений..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <ScrollArea className="h-[calc(100%-73px)]">
                    {Object.entries(conversations).map(([userId, messages]) => {
                      const user = mockUsers.find((u) => u.id === userId);
                      const lastMessage = messages[messages.length - 1];
                      const unreadCount = messages.filter(
                        (m) => !m.read && m.toId === "7"
                      ).length;

                      return (
                        <button
                          key={userId}
                          onClick={() => setSelectedChat(userId)}
                          className={`w-full p-4 border-b hover:bg-gray-50 text-left transition-colors ${
                            selectedChat === userId ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                              {user?.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold truncate">
                                  {user?.name}
                                </h4>
                                {unreadCount > 0 && (
                                  <Badge className="ml-2 flex-shrink-0">
                                    {unreadCount}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 truncate">
                                {lastMessage.content}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(lastMessage.timestamp).toLocaleTimeString(
                                  "ru-RU",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </ScrollArea>
                </div>

                {/* Окно чата */}
                <div className="col-span-2 flex flex-col">
                  {selectedChat ? (
                    <>
                      {/* Заголовок чата */}
                      <div className="p-4 border-b flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {mockUsers.find((u) => u.id === selectedChat)?.name[0]}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {mockUsers.find((u) => u.id === selectedChat)?.name}
                          </h3>
                          <p className="text-sm text-gray-600">Онлайн</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Перейти к проекту
                        </Button>
                      </div>

                      {/* Сообщения */}
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {conversations[selectedChat]?.map((message) => {
                            const isFromMe = message.fromId === "7";
                            return (
                              <div
                                key={message.id}
                                className={`flex ${
                                  isFromMe ? "justify-end" : "justify-start"
                                }`}
                              >
                                <div
                                  className={`max-w-[70%] rounded-lg p-3 ${
                                    isFromMe
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-100 text-gray-900"
                                  }`}
                                >
                                  <p>{message.content}</p>
                                  <p
                                    className={`text-xs mt-1 ${
                                      isFromMe ? "text-blue-100" : "text-gray-500"
                                    }`}
                                  >
                                    {new Date(message.timestamp).toLocaleTimeString(
                                      "ru-RU",
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>

                      {/* Форма отправки */}
                      <div className="p-4 border-t">
                        <form
                          onSubmit={handleSendMessage}
                          className="flex gap-2"
                        >
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                          >
                            <Paperclip className="w-5 h-5" />
                          </Button>
                          <Input
                            placeholder="Введите сообщение..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className="flex-1"
                          />
                          <Button type="submit" size="icon">
                            <Send className="w-5 h-5" />
                          </Button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p>Выберите чат, чтобы начать общение</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

  
    </div>
  );
}
