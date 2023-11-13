
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const serviceAccount = require("../"+ process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://plaved-gpt-default-rtdb.europe-west1.firebasedatabase.app" // Replace with your database URL
});

 const db = admin.database();
const { push, ref } = require('firebase/database');

const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_SK,
    baseURL: "https://oai.hconeai.com/v1",
    defaultHeaders: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_SK}`,
      "OpenAI-Beta": "assistants-v1"
    },
    
  });
async function getOrCreateThreadForUser(userId) {
    const userRef = db.ref(`users/${userId}`);
  
    return new Promise((resolve, reject) => {
      userRef.once('value', async (snapshot) => {
        if (snapshot.exists() && snapshot.val().thread ) {
          // If the user exists, return the existing thread ID
          resolve(snapshot.val().thread);
        } else {
          // If the user does not exist, create a new thread and save it
          const thread = await openai.beta.threads.create();
          userRef.update({ thread: thread.id }, (error) => {
            if (error) {
              reject(error);
            } else {
              resolve(thread.id);
            }
          });
        }
      }, reject);
    });
  }
  
  
  
  router.post('/send-message', async (req, res) => {
    try {
      // Verify Firebase Auth ID token
      const { idToken, message } = req.body;
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { uid, displayName, photoURL } = decodedToken;
    
  
      // Replace getOrCreateThreadForUser with your logic to retrieve or create a thread ID
      const threadId = await getOrCreateThreadForUser(uid);
      console.log(threadId);
  
    
  
     
  
      await push(ref(db, 'messages/'+uid+"/"), message);
  
      await openai.beta.threads.messages.create(
        threadId,
        { role: "user", content: message.text }
      );
  
      const runCreation = await openai.beta.threads.runs.create(
        threadId,
        { assistant_id: "asst_Xnyceqlgra1Tm2HSS0WUiI40" }
      );
  
      let run = await openai.beta.threads.runs.retrieve(
        threadId,
        runCreation.id
      );
  
      // Check if the Run is completed, if not, wait and then retrieve again
      while (run.status !== 'completed') {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
          run = await openai.beta.threads.runs.retrieve(
              threadId,
              runCreation.id
          );
      }
  console.log(run)
      const messages = await openai.beta.threads.messages.list(threadId);
  const assistantMessages = messages.data.filter(m => m.role === "assistant");
  
  // Sort the messages by created_at in descending order (newest first)
  const sortedAssistantMessages = assistantMessages.sort((a, b) => {
  return new Date(b.created_at) - new Date(a.created_at);
  });
  
  if (sortedAssistantMessages.length > 0) {
  const latestMessage = sortedAssistantMessages[0];
  console.log(latestMessage.content[0].text.value);
  
  
  const messageObj = {
    text: latestMessage.content[0].text.value,
    name: "BuilderGPT",
    avatar: "https://cdn4.cdn-telegram.org/file/F9OuXrOHo0iWPXv6mpYemb9AQkh_y2G3QJ4_ZyNgqSK_SwXFYptMxMHsAQNYIb2LUkfawflYyKFy9DQRknC3Dda47cLixzn09dhIU3yW2IekmIApcds7vutuATyVMisADb2rcIagn4X1qsN8RVo5k30n_yII0ZshoMxy2eFtU_EdG2BAYuOAQzVcwqiltBFd6lS2bnmWBY2D6Wz56UHTM4adPVxrjKwmMpKVqojDHx8KpyeYZk_hPY0k9PzbHaucv6aZVSlPLlCuumA5AAQJMsTOzVC9OBaYPUpJ1gOuWfmGDjA-CY5bowMlRaJNddCVAFdJpIpD0jY7bubpVCIl6g.jpg",
    createdAt: Date.now(),
    uid: "BuilderGPT:"+uid,
  };
  
  await push(ref(db, 'messages/'+uid+"/"), messageObj);
  // Send the message to the user
  res.json({ success: true, message: "Message processed successfully", response: latestMessage });
  }
  
     
    } catch (error) {
      console.error("Error handling message:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

module.exports = router;
