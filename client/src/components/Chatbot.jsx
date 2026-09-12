import React, { useState } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I'm your Job Portal Assistant. I can help you find jobs, answer career questions, and prepare for interviews. How can I help you?"
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
  if (!message.trim() || loading) {
    return;
  }

  const userMessage = message.trim();

  // Add user's message to UI
  setMessages((prev) => [
    ...prev,
    {
      sender: "user",
      text: userMessage
    }
  ]);

  setMessage("");
  setLoading(true);

  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userMessage,
        history: messages
      })
    });

    const data = await response.json();

    if (data.success) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply
        }
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, something went wrong."
        }
      ]);
    }

  } catch (error) {
    console.error("Chatbot error:", error);

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "Unable to connect to the server."
      }
    ]);
  } finally {
    setLoading(false);
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 w-[360px] max-w-[calc(100vw-30px)] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-purple-700 to-blue-600 text-white px-5 py-4 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                🤖
              </div>

              <div>
                <h3 className="font-semibold text-base">
                  Job Portal Assistant
                </h3>

                <p className="text-xs text-purple-100">
                  Your AI career guide
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-xl hover:bg-white/20 w-8 h-8 rounded-full transition"
            >
              ×
            </button>

          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {msg.sender === "bot" && (
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2 shrink-0">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-purple-600 text-white rounded-br-sm"
                      : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>

              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  🤖
                </div>

                <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200">

            <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 focus-within:border-purple-500 transition">

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="flex-1 outline-none text-sm text-gray-700"
              />

              <button
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 disabled:opacity-40 transition"
              >
                ➤
              </button>

            </div>

            <p className="text-[10px] text-gray-400 text-center mt-2">
              Powered by Gemini • AI responses may not always be accurate
            </p>

          </div>

        </div>
      )}

      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-purple-700 to-blue-600 text-white shadow-xl hover:scale-105 transition-transform flex items-center justify-center text-2xl"
        >
          🤖
        </button>
      )}
    </>
  );
};

export default Chatbot;