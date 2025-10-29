"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "@/styles/Assistant.module.css";
import { postDataAPI } from "@/utils/fetchData";
import { useAuth } from "@/contexts/authContext";

/**
 * Helper to correctly map database message objects to the UI state format.
 * The server returns an array where each object contains a full user turn (prompt + rawText response).
 * @param {Array<Object>} fetchedMessages - Array of server message objects.
 * @returns {Array<Object>} Array of alternating {role, content} objects for the UI state.
 */
const processFetchedMessages = (fetchedMessages) => {
    const uiMessages = [];
    if (!fetchedMessages || fetchedMessages.length === 0) return uiMessages;

    fetchedMessages.forEach(msg => {
        // 1. Add User's prompt
        if (msg.prompt) {
            uiMessages.push({ role: "user", content: msg.prompt });
        }
        // 2. Add AI's response (using rawText which contains the full LLM output)
        if (msg.rawText) {
            uiMessages.push({ role: "assistant", content: msg.rawText });
        }
    });

    return uiMessages;
};

/**
 * Component to safely render LLM text output, preserving newlines and basic formatting.
 * For complex Markdown, a full renderer is typically needed, but for bold/lists,
 * preserving whitespace via CSS and simple replacements is effective.
 */
const MessageContent = ({ content }) => {
    // Splits text by newline and wraps each line in a <p> tag, 
    // which, combined with CSS 'white-space: pre-wrap', handles lists and paragraphs well.
    const lines = content.split('\n');

    return (
        <div className={styles.messageContent}>
            {lines.map((line, index) => (
                // Use a key that combines index and content for stable rendering
                <p key={index + line.substring(0, 10)}>{line}</p>
            ))}
        </div>
    );
};


const Assistant = () => {
    const { authState } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fetch old messages on mount
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // Assuming the fetch endpoint is /api/v1/fetch-messages as in the original code
                const res = await postDataAPI(
                    "/api/v1/fetch-messages",
                    {},
                    false,
                    authState.access_token,
                    "application/json"
                );

                // Map the fetched messages (which is an array of objects with prompt/rawText)
                if (res?.data?.data) {
                    setMessages(processFetchedMessages(res.data.data));
                }
            } catch (err) {
                console.error("❌ Error fetching messages:", err);
            }
        };
        // Dependency array needs to be complete
        if (authState.access_token) {
            fetchMessages();
        }
    }, [authState.access_token]);

    // Send message to assistant
    const handleSend = async () => {
        const userPrompt = input.trim();
        if (!userPrompt || loading) return;

        // 1. Add user message to local state immediately
        const userMsg = { role: "user", content: userPrompt };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await postDataAPI(
                "/api/v1/chat",
                { prompt: userPrompt },
                false,
                authState.access_token,
                "application/json"
            );

            // The response structure is { response: { text: "..." } }
            const replyContent =
                res?.data?.response?.text ||
                "⚠️ No response received from the assistant. Try again.";

            // 2. Add AI response to local state
            setMessages((prev) => [...prev, { role: "assistant", content: replyContent }]);
        } catch (err) {
            console.error("❌ Chat error:", err);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "❌ Something went wrong. Check the console for details." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.assistant}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>⚙️</div>
                    <h1>Operations AI Agent</h1>
                </div>
                <div className={styles.description}>
                    <p>
                        Your mission control for factory intelligence. Ask the assistant to
                        analyze operational risks, summarize production anomalies, or
                        suggest preventive measures.
                    </p>
                    <div className={styles.examples}>
                        <h3>Try asking:</h3>
                        <ul>
                            <li>“Show risk summary for Zone B.”</li>
                            <li>“Detect anomalies from today’s shift.”</li>
                            <li>“Recommend mitigation actions.”</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className={styles.chatArea}>
                <div className={styles.messages}>
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`${styles.message} ${msg.role === "user" ? styles.user : styles.assistantMsg
                                }`}
                        >
                            <MessageContent content={msg.content} />
                        </div>
                    ))}
                    {loading && (
                        <div className={styles.loadingMsg}>
                            <p>⏳ Assistant is analyzing data...</p>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className={styles.inputBar}>
                    <input
                        type="text"
                        placeholder="Ask the Operations Assistant..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button onClick={handleSend} disabled={loading}>
                        {loading ? "..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Assistant;
