import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { ref, push, serverTimestamp } from 'firebase/database';
import axios from 'axios';

const SendMessage = ({ scroll }) => {
  const [message, setMessage] = useState('');

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === '') {
      alert('Enter a valid message');
      return;
    }

    // Get the ID token from the Firebase Auth currentUser
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);

    const { uid, displayName, photoURL } = auth.currentUser;

    const messageObj = {
      text: message,
      name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      uid,
    };

    // Make an authenticated request to your endpoint
    try {
      const response = await axios.post('http://localhost:3000/send-message', {
        idToken, // Send the ID token in the request
        message: messageObj,
      });

      console.log(response.data); // Handle the response as needed
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message.');
    }

    // Update UI after sending message
    setMessage('');
    scroll.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <form onSubmit={(event) => sendMessage(event)} className="send-message">
      <label htmlFor="messageInput" hidden>
        Escribe aquí tu consulta
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder="Escribe aquí tu consulta"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default SendMessage;
