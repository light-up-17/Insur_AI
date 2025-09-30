import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const commandOptions = [
  { cmd: "/generate-receipt", desc: "Generate a payment receipt" },
  { cmd: "/policy", desc: "Get your policy details" },
  { cmd: "/claim", desc: "Check your claim status" },
  { cmd: "/agent", desc: "Find available agents" },
  { cmd: "/pdf", desc: "Generate a PDF of documents" },
  { cmd: "/help", desc: "List all available commands" },
];

const Chatbot = () => {
  const { user, isAuthenticated, token, apiRequest } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I'm InsurAI assistant. Type `/` to see options." }
  ]);
  const [input, setInput] = useState("");
  const [showCommands, setShowCommands] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Dragging state
  const chatbotRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0
  });

  // Speech recognition setup
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Automatically send the recognized message
      setTimeout(() => {
        sendMessage(transcript);
      }, 100);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  // Initialize position at bottom-right
  useEffect(() => {
    const updateInitialPos = () => {
      const winWidth = window.innerWidth;
      const winHeight = window.innerHeight;
      setPos({
        x: winWidth - 350 - 30, // 350px width + 30px margin
        y: winHeight - 500 - 20, // 500px height + 20px margin
      });
    };

    updateInitialPos();
    window.addEventListener("resize", updateInitialPos);
    return () => window.removeEventListener("resize", updateInitialPos);
  }, []);

  // Mouse event handlers with improved performance
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragState.current.isDragging || isMaximized) return;

      const newX = e.clientX - dragState.current.offsetX;
      const newY = e.clientY - dragState.current.offsetY;

      // Update position directly on the DOM for better performance
      if (chatbotRef.current) {
        chatbotRef.current.style.left = `${newX}px`;
        chatbotRef.current.style.top = `${newY}px`;
      }
    };

    const handleMouseUp = () => {
      if (dragState.current.isDragging) {
        // Update state with final position when dragging ends
        if (chatbotRef.current) {
          const rect = chatbotRef.current.getBoundingClientRect();
          setPos({ x: rect.left, y: rect.top });
        }
        dragState.current.isDragging = false;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMaximized]);

  const onMouseDown = (e) => {
    if (isMaximized) return;

    const rect = chatbotRef.current.getBoundingClientRect();
    dragState.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    };

    e.stopPropagation();
    e.preventDefault();
  };

  const sendMessage = (messageText) => {
    const text = messageText !== undefined ? messageText : input;
    if (!text.trim()) return;
    const userMessage = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setShowCommands(false);

    setTimeout(() => {
      setMessages(prev => [...prev, { role: "bot", content: "I'll process your request..." }]);
    }, 600);

    // Send query to backend voice-query API (userId extracted from JWT token)
    apiRequest("http://localhost:8080/api/voice-query", {
      method: "POST",
      body: JSON.stringify({ query: text })
    })
    .then(res => res.json())
    .then(data => {
      if (data.response) {
        setMessages(prev => [...prev, { role: "bot", content: data.response }]);
        // Optional: Text-to-Speech
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.response);
          window.speechSynthesis.speak(utterance);
        }
      } else if (data.error) {
        setMessages(prev => [...prev, { role: "bot", content: `Error: ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: "bot", content: "Sorry, no response from server." }]);
      }
    })
    .catch(err => {
      if (err.message === 'Authentication expired') {
        setMessages(prev => [...prev, { role: "bot", content: "Your session has expired. Please refresh the page and log in again." }]);
      } else {
        setMessages(prev => [...prev, { role: "bot", content: "Error processing request. Please try again." }]);
      }
      console.error(err);
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-[#1cb08b] text-white p-3 rounded-full shadow-lg hover:bg-[#0a8a6a] transition-colors z-50"
        title="Open InsurAI Assistant"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        💬
      </button>
    );
  }

  return (
    <>
      {/* Gradient blur background when maximized */}
      {isMaximized && (
        <div className="fixed inset-0 bg-gradient-to-br from-[#111111]/80 to-[#333333]/80 backdrop-blur-sm z-40"></div>
      )}

      <div
        ref={chatbotRef}
        style={{
          position: "fixed",
          left: isMaximized ? "50%" : `${pos.x}px`,
          top: isMaximized ? "50%" : `${pos.y}px`,
          transform: isMaximized ? "translate(-50%, -50%)" : "none",
          width: isMaximized ? "70%" : "350px",
          height: isMaximized ? "80%" : isMinimized ? "auto" : "500px",
          zIndex: 50,
          transition: dragState.current.isDragging ? "none" : "transform 0.2s, width 0.3s, height 0.3s",
          fontFamily: "'Inter', sans-serif"
        }}
        className="bg-[#1c1c1c] shadow-2xl rounded-lg overflow-hidden border border-[#333333] flex flex-col"
      >
        {/* Title bar (draggable) */}
        <div
          onMouseDown={onMouseDown}
          className="flex justify-between items-center bg-[#333333] px-2 py-1 cursor-move select-none border-b border-[#555555]"
        >
          <span className="text-sm font-semibold text-white">InsurAI Assistant</span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="px-1 hover:bg-[#555555] rounded text-gray-300 hover:text-white transition-colors"
            >
              −
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="px-1 hover:bg-[#555555] rounded text-gray-300 hover:text-white transition-colors"
            >
              □
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-1 text-red-400 hover:bg-[#555555] rounded hover:text-red-300 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-2 overflow-y-auto text-sm space-y-2 bg-[#111111]">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-md max-w-[80%] ${
                    msg.role === "user" ? "bg-[#1cb08b] ml-auto text-white" : "bg-[#333333] text-gray-200"
                  }`}
                >
                  {msg.content.includes("[📄") ? (
                    <div className="flex items-center gap-2">
                      <span>{msg.content}</span>
                      <span className="text-[#1cb08b] cursor-pointer hover:text-[#0a8a6a]">⬇</span>
                    </div>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex border-t border-[#333333] relative">
              <input
                className="flex-1 p-2 text-sm outline-none bg-[#333333] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1cb08b] border border-[#333333]"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setShowCommands(e.target.value === "/");
                }}
                placeholder="Type a message or / for commands..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                onClick={() => sendMessage()}
                className="px-3 bg-[#1cb08b] text-white text-sm hover:bg-[#0a8a6a] transition-colors"
              >
                Send
              </button>
              <button
                onClick={() => {
                  if (isListening) {
                    recognitionRef.current.stop();
                    setIsListening(false);
                  } else {
                    recognitionRef.current.start();
                    setIsListening(true);
                  }
                }}
                className={`ml-2 px-3 text-white text-sm rounded transition-colors ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-[#1cb08b] hover:bg-[#0a8a6a]'}`}
                title={isListening ? "Stop Listening" : "Start Voice Input"}
              >
                {isListening ? "🎙️ Stop" : "🎙️ Speak"}
              </button>

              {/* Command suggestions */}
              {showCommands && (
                <div className="absolute bottom-10 left-0 right-0 bg-[#1c1c1c] shadow-lg border border-[#333333] rounded-md text-sm z-50 mx-2">
                  {commandOptions.map((cmd, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setInput(cmd.cmd);
                        setShowCommands(false);
                      }}
                      className="px-2 py-1 hover:bg-[#333333] cursor-pointer text-gray-200 hover:text-white transition-colors"
                    >
                      <span className="font-bold text-[#1cb08b]">{cmd.cmd}</span> – {cmd.desc}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Chatbot;
