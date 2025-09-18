import { useState, useRef, useEffect } from "react";

const commandOptions = [
  { cmd: "/generate-receipt", desc: "Generate a payment receipt" },
  { cmd: "/policy", desc: "Get policy details (Policy No. PXXXXXX)" },
  { cmd: "/pdf", desc: "Generate a PDF of documents" },
  { cmd: "/help", desc: "List all available commands" },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(true);
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

    if (text.startsWith("/")) {
      handleCommand(text);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "bot", content: "I'll process your request..." }]);
      }, 600);
    }
  };

  const handleCommand = (cmd) => {
    switch (cmd) {
      case "/help":
        setMessages(prev => [
          ...prev,
          { role: "bot", content: "Available commands: " + commandOptions.map(c => c.cmd).join(", ") },
        ]);
        break;
      case "/generate-receipt":
        setMessages(prev => [...prev, { role: "bot", content: "✅ Receipt generated. [📄 receipt.pdf]" }]);
        break;
      case "/policy":
        const policyNo = "P" + Math.floor(100000 + Math.random() * 900000);
        setMessages(prev => [...prev, { role: "bot", content: `📑 Your policy number: ${policyNo}` }]);
        break;
      case "/pdf":
        setMessages(prev => [...prev, { role: "bot", content: "📄 PDF generated successfully." }]);
        break;
      default:
        setMessages(prev => [...prev, { role: "bot", content: "Unknown command. Type /help for options." }]);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Gradient blur background when maximized */}
      {isMaximized && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-400/40 to-gray-700/40 backdrop-blur-sm z-40"></div>
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
          transition: dragState.current.isDragging ? "none" : "transform 0.2s, width 0.3s, height 0.3s"
        }}
        className="bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-300 flex flex-col"
      >
        {/* Title bar (draggable) */}
        <div
          onMouseDown={onMouseDown}
          className="flex justify-between items-center bg-gray-200 px-2 py-1 cursor-move select-none"
        >
          <span className="text-sm font-semibold text-gray-800">InsurAI Assistant</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsMinimized(!isMinimized)} 
              className="px-1 hover:bg-gray-300 rounded"
            >
              −
            </button>
            <button 
              onClick={() => setIsMaximized(!isMaximized)} 
              className="px-1 hover:bg-gray-300 rounded"
            >
              □
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              className="px-1 text-red-600 hover:bg-gray-300 rounded"
            >
              ✕
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-2 overflow-y-auto text-sm space-y-2 bg-gray-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-md max-w-[80%] ${
                    msg.role === "user" ? "bg-blue-100 ml-auto" : "bg-gray-200"
                  }`}
                >
                  {msg.content.includes("[📄") ? (
                    <div className="flex items-center gap-2">
                      <span>{msg.content}</span>
                      <span className="text-blue-600 cursor-pointer">⬇</span>
                    </div>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex border-t border-gray-300 relative">
              <input
                className="flex-1 p-2 text-sm outline-none"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setShowCommands(e.target.value === "/");
                }}
                placeholder="Type a message or / for commands..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button 
                onClick={sendMessage} 
                className="px-3 bg-blue-600 text-white text-sm hover:bg-blue-700"
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
                className={`ml-2 px-3 text-white text-sm rounded ${isListening ? 'bg-red-600' : 'bg-green-600'} hover:opacity-80`}
                title={isListening ? "Stop Listening" : "Start Voice Input"}
              >
                {isListening ? "🎙️ Stop" : "🎙️ Speak"}
              </button>

              {/* Command suggestions */}
              {showCommands && (
                <div className="absolute bottom-10 left-0 right-0 bg-white shadow-lg border rounded-md text-sm z-50 mx-2">
                  {commandOptions.map((cmd, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setInput(cmd.cmd);
                        setShowCommands(false);
                      }}
                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                    >
                      <span className="font-bold">{cmd.cmd}</span> – {cmd.desc}
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
