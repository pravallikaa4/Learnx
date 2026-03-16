import React, { createContext, useContext, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { apiRequest } from "../api/api";

const apiKey = "426a26dx6gct";
const StreamVideoContext = createContext(null);

export const StreamVideoProvider = ({ children, currentUser }) => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!currentUser?._id || client) return;

    const initVideo = async () => {
      try {
        const videoClient = new StreamVideoClient({ apiKey });
        const { token } = await apiRequest("/stream/token");

        await videoClient.connectUser(
          {
            id: String(currentUser._id),
            name: currentUser.name,
          },
          token
        );
        setClient(videoClient);
      } catch (e) { console.error("Video Init Error", e); }
    };

    initVideo();

    return () => {
      if (client) {
        client.disconnectUser();
        setClient(null);
      }
    };
  }, [currentUser?._id]);

  return (
    <StreamVideoContext.Provider value={client}  >
      {client ? <StreamVideo client={client} >{children}</StreamVideo> : children}
    </StreamVideoContext.Provider>
  );
};

export const useVideoClient = () => useContext(StreamVideoContext);