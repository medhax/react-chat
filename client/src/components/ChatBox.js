import React, { useEffect, useRef, useState } from 'react';
import { db, auth } from '../firebase';
import { ref, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import Message from './Message';
import SendMessage from './SendMessage';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const scroll = useRef();

  const { uid, displayName, photoURL } = auth.currentUser;

  useEffect(() => {

    const messagesRef = query(ref(db, 'messages/'+uid +"/"), orderByChild('createdAt'), limitToLast(50));

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const fetchedMessages = [];
      snapshot.forEach((childSnapshot) => {
        fetchedMessages.push({ ...childSnapshot.val(), id: childSnapshot.key });
      });
      // The messages are fetched in descending order, so we reverse them to display in ascending order
      setMessages(fetchedMessages.reverse());
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="chat-box">
      <div className="messages-wrapper">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <span ref={scroll}></span>
      <SendMessage scroll={scroll} />
    </main>
  );
};

export default ChatBox;
