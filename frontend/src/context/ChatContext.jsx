import React, { createContext, useState, useContext, useEffect } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

// Static knowledge base for the chatbot
const knowledgeBase = [
  // Greetings
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'namaste'],
    response: "🙏 Namaste! Welcome to Nepal National Ex-Army Association. How can I assist you today?"
  },
  {
    keywords: ['how are you', 'how are u', 'how r u', 'how do you do'],
    response: "I'm doing great! Thank you for asking. How can I help you with your queries about the association?"
  },
  
  // Association Info
  {
    keywords: ['association', 'organization', 'about', 'what is', 'who are you'],
    response: "The Nepal National Ex-Army Association is a premier organization dedicated to the welfare and unity of retired army personnel. Established in 2047 BS, we serve as a social welfare organization under the Ministry of Defence and recognized by the Nepali Army."
  },
  {
    keywords: ['mission', 'vision', 'objective', 'purpose', 'goal'],
    response: "Our mission is to unite retired army personnel, contribute to national security, promote welfare and development of ex-army members, engage in social service activities, and create employment opportunities for veterans."
  },
  {
    keywords: ['established', 'founded', 'started', 'when'],
    response: "The association was established in 2047 BS (1990 AD) and was officially registered in 2075 BS. It has been a member of the World Veterans Federation since 2015."
  },
  
  // Membership
  {
    keywords: ['membership', 'member', 'join', 'register', 'become member'],
    response: "To become a member, you need to be a retired army personnel from the Nepali Army. There are three types of membership: General Member (Rs. 1,000 for 5 years), Lifetime Member (approved by Central Committee), and Honorary Member (for special contributors)."
  },
  {
    keywords: ['fee', 'cost', 'price', 'charge', 'payment'],
    response: "The general membership fee is Rs. 1,000 for 5 years. Renewal fee is the same amount. For lifetime membership, please contact the Central Committee for approval."
  },
  
  // Leadership
  {
    keywords: ['leader', 'leadership', 'committee', 'president', 'sabhapati', 'executive'],
    response: "The association is led by a Central Committee consisting of 18 members including President, Senior Vice President, General Secretary, Secretary, Treasurer, and other executive members. The current President is S.R. Shri Diwakar Shamsher J.B. Rana."
  },
  {
    keywords: ['central committee', 'kendriya', 'sanchalan', 'samiti'],
    response: "The Central Committee has 18 members including President (1), Senior Vice President (1), Vice President (1), General Secretary (1), Secretary (2), Treasurer (1), Assistant Treasurer (1), and 10 members."
  },
  
  // Contact
  {
    keywords: ['contact', 'reach', 'call', 'phone', 'email', 'address', 'location'],
    response: "You can reach us at: 📍 Address: Sainik Smriti Sthal, Pulchok, Lalitpur, Ward No. 3, Kathmandu, Nepal 📞 Phone: +977-1-1234567 📧 Email: info@nepalarmy.org"
  },
  {
    keywords: ['office', 'visit', 'come', 'meeting'],
    response: "Our central office is located at Sainik Smriti Sthal, Pulchok, Lalitpur. Office hours are Monday to Friday, 10:00 AM to 5:00 PM."
  },
  
  // Services
  {
    keywords: ['service', 'help', 'support', 'assistance', 'welfare'],
    response: "We provide various services including social welfare programs, veteran assistance, disaster response, skills development, health camps, blood donation campaigns, and community development initiatives."
  },
  {
    keywords: ['training', 'program', 'course', 'skill', 'development'],
    response: "We offer training programs in security & surveillance, leadership development, community engagement, skills enhancement, mental health & wellbeing, and physical fitness & wellness."
  },
  
  // Events
  {
    keywords: ['event', 'program', 'function', 'ceremony', 'celebration'],
    response: "We organize various events throughout the year including Annual General Meeting, Veterans Day Celebration, Health Camps, Scholarship Programs, and Community Service Programs. Check our Events page for upcoming events."
  },
  
  // Statistics
  {
    keywords: ['member count', 'how many', 'total', 'statistics', 'numbers'],
    response: "Currently, we have over 70,000 ex-army members, 3,50,000+ dependents, totaling 4,20,000+ population. We have 61 district committees and 20,561 total members across the country."
  },
  
  // History
  {
    keywords: ['history', 'foundation', 'start', 'begin', 'origin'],
    response: "The association was founded in 2047 BS with the vision of serving the nation beyond active military service. It was officially registered in 2075 BS and has been recognized by the Ministry of Defence and the Nepali Army."
  },
  
  // Default response
  {
    keywords: [],
    response: "I'm not sure I understand that question. Please try asking about membership, services, leadership, events, or contact information. You can also visit our website for more details."
  }
];

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [
      {
        id: Date.now(),
        text: "👋 Hello! Welcome to Nepal National Ex-Army Association. How can I help you today?",
        sender: 'bot',
        timestamp: new Date().toLocaleString()
      }
    ];
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const findResponse = (message) => {
    const lowerMsg = message.toLowerCase().trim();
    
    // Check for exact match or partial match
    for (const item of knowledgeBase) {
      if (item.keywords.length === 0) continue;
      const matched = item.keywords.some(keyword => 
        lowerMsg.includes(keyword) || keyword.includes(lowerMsg)
      );
      if (matched) {
        return item.response;
      }
    }
    
    // Return default response if no match found
    return knowledgeBase[knowledgeBase.length - 1].response;
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleString()
    };
    setMessages(prev => [...prev, userMessage]);

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const responseText = findResponse(text);
      const botMessage = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'bot',
        timestamp: new Date().toLocaleString()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 500 + Math.random() * 1000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        text: "👋 Chat cleared. How can I help you today?",
        sender: 'bot',
        timestamp: new Date().toLocaleString()
      }
    ]);
    localStorage.removeItem('chatMessages');
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ChatContext.Provider value={{
      messages,
      isOpen,
      isTyping,
      sendMessage,
      clearChat,
      toggleChat,
      setIsOpen
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
