import { useEffect, useRef, useState } from "react";

import { Send, Loader2, ChevronLeft, Sparkles, ThumbsDown } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { useNavigate, useLocation } from "react-router-dom";

import ReactMarkdown from "react-markdown";

import toast, { Toaster } from "react-hot-toast";

import LogoMermo from "../assets/images/logotipo_mermo.png";

import { api } from "../services/api";

export default function Mermo() {
  const navigate = useNavigate();

  const location = useLocation();

  const backRoute = location.state?.from || "/home-gestion";

  const messagesEndRef = useRef(null);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [usuarioNombre, setUsuarioNombre] = useState("Usuario");

  const [feedbackInputs, setFeedbackInputs] = useState({});

  const [openFeedback, setOpenFeedback] = useState({});

  const [sendingFeedback, setSendingFeedback] = useState({});

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "## Hola 👋\nSoy **Mermo AI**.\n\nPuedo ayudarte con análisis de mermas, pérdidas, productos críticos y comportamiento de inventario.",
      turnId: null,
    },
  ]);

  // =========================================
  // LOAD USER
  // =========================================
  useEffect(() => {
    const user = localStorage.getItem("usuario");

    const usersMap = {
      ovelez: "Omar Velez",
      driquelme: "David Riquelme",
      asanchez: "Alicia Sánchez",
      osaez: "Orlando Saenz",
      dbonilla: "Ditzia Bonilla",
      jortiz: "Julio Ortiz",
    };

    if (user) {
      const clean = user.toLowerCase().trim();

      setUsuarioNombre(usersMap[clean] || user);
    }
  }, []);

  // =========================================
  // AUTO SCROLL
  // =========================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =========================================
  // SEND MESSAGE
  // =========================================
  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    setMessage("");

    setLoading(true);

    try {
      const res = await api.post("/chat/send", {
        Message: userMessage.content,
      });

      console.log("CHAT RESPONSE:", res.data);

      // =========================================
      // TURN ID DEL BACK
      // =========================================
      const turnId =
        res.data?.turnId ||
        res.data?.TurnId ||
        res.data?.data?.turnId ||
        res.data?.data?.TurnId ||
        res.data?.data?.id ||
        null;

      console.log("TURN ID:", turnId);

      // =========================================
      // RESPUESTA IA
      // =========================================
      const responseText =
        res.data?.response ||
        res.data?.Response ||
        res.data?.data?.response ||
        res.data?.data?.Response ||
        res.data?.message ||
        res.data?.Message ||
        "No se recibió respuesta.";

      // =========================================
      // MENSAJE IA
      // =========================================
      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: String(responseText),
        turnId: turnId,
      };

      console.log("AI MESSAGE:", aiMessage);

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "assistant",
          content: "❌ Ocurrió un error al conectar con Mermo AI.",
          turnId: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // SEND FEEDBACK
  // =========================================
  const sendFeedback = async (msg) => {
    try {
      console.log("MENSAJE COMPLETO:", msg);

      // =========================================
      // VALIDAR TURN ID
      // =========================================
      if (!msg.turnId) {
        toast.error("No existe TurnId");

        return;
      }

      // =========================================
      // FEEDBACK
      // =========================================
      const feedbackText = feedbackInputs[msg.id] || "";

      setSendingFeedback((prev) => ({
        ...prev,
        [msg.id]: true,
      }));

      // =========================================
      // PAYLOAD
      // =========================================
      const payload = {
        TurnId: String(msg.turnId),
        Obs: feedbackText,
      };

      console.log("FEEDBACK PAYLOAD:", payload);

      const formData = new FormData();

      formData.append("TurnId", payload.TurnId);
      formData.append("Obs", payload.Obs);

      // =========================================
      // REQUEST
      // =========================================
      const res = await api.post("/chat/feedback", formData);

      console.log("FEEDBACK RESPONSE:", res.data);

      toast.success("Retroalimentación enviada");

      // =========================================
      // LIMPIAR INPUT
      // =========================================
      setFeedbackInputs((prev) => ({
        ...prev,
        [msg.id]: "",
      }));
    } catch (err) {
      console.error(err);

      toast.error("No se pudo enviar feedback");
    } finally {
      setSendingFeedback((prev) => ({
        ...prev,
        [msg.id]: false,
      }));
    }
  };

  // =========================================
  // ENTER
  // =========================================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div
      className="
        fixed inset-0
        bg-[#f6f7fb]
        flex flex-col
        overflow-hidden
      "
    >
      <Toaster position="top-center" />

      {/* HEADER */}
      <div
        className="
          shrink-0
          backdrop-blur-xl
          bg-white/85
          border-b border-gray-200
        "
      >
        <div
          className="
            max-w-6xl mx-auto
            px-4 sm:px-6
            py-4
            flex items-center justify-between
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(backRoute)}
              className="
                w-12 h-12
                rounded-2xl
                bg-[#f3f4f6]
                hover:bg-[#e5e7eb]
                transition
                flex items-center justify-center
              "
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-4">
              <img
                src={LogoMermo}
                className="
                  w-16 h-16
                  object-contain
                "
              />

              <div>
                <h1
                  className="
                    text-xl sm:text-2xl
                    font-black
                    text-gray-900
                  "
                >
                  Mermo AI
                </h1>

                <p
                  className="
                    text-xs sm:text-sm
                    text-gray-500
                  "
                >
                  Inteligencia artificial para mermas
                </p>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div
            className="
              hidden md:flex
              items-center gap-2
              bg-[#d73c26]/10
              text-[#d73c26]
              px-4 py-2
              rounded-2xl
              font-semibold
              text-sm
            "
          >
            <Sparkles size={16} />
            IA Activa
          </div>
        </div>
      </div>

      {/* CHAT */}
      <div
        className="
          flex-1
          min-h-0
          w-full
          max-w-6xl
          mx-auto
          px-4 sm:px-6
          py-4
          flex
          overflow-hidden
        "
      >
        <div
          className="
            flex-1
            min-h-0
            bg-white
            rounded-[36px]
            border border-gray-100
            shadow-sm
            overflow-hidden
            flex flex-col
          "
        >
          {/* MESSAGES */}
          <div
            className="
              flex-1
              min-h-0
              overflow-y-auto
              overflow-x-hidden
              p-4 sm:p-6
              space-y-5
              bg-[#fcfcfd]
            "
          >
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      max-w-[92%] sm:max-w-[75%]
                      rounded-[28px]
                      px-5 py-4
                      shadow-sm
                      break-words
                      ${
                        msg.role === "user"
                          ? "bg-[#d73c26] text-white rounded-br-md"
                          : "bg-white border border-gray-200 text-gray-700 rounded-bl-md"
                      }
                    `}
                  >
                    {/* HEADER */}
                    <div className="flex items-center gap-2 mb-3">
                      {msg.role === "assistant" ? (
                        <img
                          src={LogoMermo}
                          alt="Mermo AI"
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <div
                          className="
                            w-7 h-7
                            rounded-full
                            bg-white/20
                            flex items-center justify-center
                            text-[11px]
                            font-bold
                            text-white
                          "
                        >
                          {usuarioNombre.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <span
                        className="
                          text-xs
                          uppercase
                          tracking-wider
                          font-semibold
                          opacity-70
                        "
                      >
                        {msg.role === "assistant" ? "Mermo AI" : usuarioNombre}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div
                      className="
                        prose prose-sm max-w-none
                        prose-p:leading-relaxed
                        prose-headings:mb-2
                        prose-headings:mt-2
                      "
                    >
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>

                    {/* FEEDBACK */}
                    {msg.role === "assistant" && msg.turnId && (
                      <div className="mt-5 pt-4 border-t border-gray-100">
                        {/* BOTÓN */}
                        <button
                          onClick={() =>
                            setOpenFeedback((prev) => ({
                              ...prev,
                              [msg.id]: !prev[msg.id],
                            }))
                          }
                          className="
        flex items-center gap-2
        text-xs font-semibold
        text-red-500
        hover:text-red-600
        transition
      "
                        >
                          <ThumbsDown size={15} />
                          La respuesta estuvo mal
                        </button>

                        {/* TARJETA FEEDBACK */}
                        <AnimatePresence>
                          {openFeedback[msg.id] && (
                            <motion.div
                              initial={{
                                opacity: 0,
                                y: 10,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              exit={{
                                opacity: 0,
                                y: 10,
                              }}
                              className="
            mt-4
            bg-[#fafafa]
            border border-gray-200
            rounded-[24px]
            p-4
          "
                            >
                              <p className="text-sm font-semibold text-gray-700 mb-3">
                                ¿Qué debería mejorar Mermo AI?
                              </p>

                              <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                  type="text"
                                  value={feedbackInputs[msg.id] || ""}
                                  onChange={(e) =>
                                    setFeedbackInputs((prev) => ({
                                      ...prev,
                                      [msg.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="Describe el problema de la respuesta..."
                                  className="
                flex-1
                h-11
                rounded-2xl
                bg-white
                border border-gray-200
                px-4
                text-sm
                outline-none
                focus:border-[#d73c26]
              "
                                />

                                <button
                                  onClick={async () => {
                                    const text = feedbackInputs[msg.id] || "";

                                    if (!text.trim()) {
                                      toast.error("Escribe un comentario");

                                      return;
                                    }

                                    await sendFeedback(msg);
                                  }}
                                  disabled={sendingFeedback[msg.id]}
                                  className="
    h-11
    px-5
    rounded-2xl
    bg-black
    text-white
    text-sm
    font-medium
    whitespace-nowrap
    disabled:opacity-50
  "
                                >
                                  {sendingFeedback[msg.id]
                                    ? "Enviando..."
                                    : "Enviar"}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* LOADING */}
            {loading && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="flex justify-start"
              >
                <div
                  className="
                    bg-white
                    border border-gray-200
                    rounded-[28px]
                    rounded-bl-md
                    px-5 py-4
                    shadow-sm
                    flex items-center gap-3
                  "
                >
                  <Loader2
                    size={18}
                    className="
                      animate-spin
                      text-[#d73c26]
                    "
                  />

                  <span
                    className="
                      text-sm
                      text-gray-600
                    "
                  >
                    Mermo AI está analizando...
                  </span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div
            className="
              shrink-0
              border-t border-gray-100
              bg-white
              p-4
            "
          >
            <div
              className="
                flex items-center
                gap-3
              "
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pregúntale algo a Mermo AI..."
                className="
                  flex-1
                  h-14
                  rounded-2xl
                  bg-[#f7f7f8]
                  border border-gray-200
                  px-5
                  outline-none
                  focus:border-[#d73c26]
                  focus:ring-4
                  focus:ring-[#d73c26]/10
                  transition
                "
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="
                  w-14 h-14
                  rounded-2xl
                  bg-[#d73c26]
                  hover:bg-[#bf331f]
                  disabled:opacity-50
                  transition
                  flex items-center justify-center
                  shadow-lg
                "
              >
                <Send size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
