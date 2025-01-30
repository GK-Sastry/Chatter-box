// ChatContext.js
import { createContext } from "react";

// Create the ChatContext
const ChatContext = createContext();

// Custom Hook to use the context in other components
export const useChat = () => {
  return useContext(ChatContext);
};

export default ChatContext;
