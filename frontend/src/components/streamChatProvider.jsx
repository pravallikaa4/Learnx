import { useEffect, useState, useRef } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { apiRequest } from "../api/api";

const apiKey = "426a26dx6gct";

export default function StreamChatProvider({ user, session }) {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!user?._id || !session?._id) return;

    const initChat = async () => {
      try {
        // Prevent duplicate client creation
        if (clientRef.current) return;

        const chatClient = new StreamChat(apiKey);

        const { token } = await apiRequest("/stream/token");
        console.log("chat Token:", token);
        // Prevent consecutive connectUser error
        if (!chatClient.userID) {
          await chatClient.connectUser(
            {
              id: String(user._id),
              name: user.name,
            },
            token
          );
        }

        const chatChannel = chatClient.channel("messaging", session._id, {
          members: session.users.map((u) => String(u._id)),
        });

        await chatChannel.watch();

        clientRef.current = chatClient;
        setClient(chatClient);
        setChannel(chatChannel);
      } catch (err) {
        console.error("Chat init failed:", err);
      }
    };

    initChat();

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnectUser();
        clientRef.current = null;
      }
    };
  }, [user?._id, session?._id]);

  if (!client || !channel) {
    return (
      <div className="flex items-center justify-center h-full">
        Connecting Chat...
      </div>
    );
  }

  return (
    <Chat client={client} theme="messaging light">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
}