import { useEffect, useRef, useState } from "react";
import {
  StreamVideo,
  StreamCall,
  StreamTheme,
  CallControls,
  SpeakerLayout,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { apiRequest } from "../api/api";

const apiKey = "426a26dx6gct";

export default function VideoCall({ currentUser, activeSession, onCallEnd }) {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!currentUser?._id || !activeSession?._id) return;

    const initVideo = async () => {
      try {
        if (clientRef.current) return;

        console.log("Requesting video token...");
        const { token } = await apiRequest("/stream/token");
        console.log("video token", token);
        if (!token) {
          console.error("No video token received");
          return;
        }

        console.log("Video token:", token);

        const videoClient = new StreamVideoClient({ apiKey });

        await videoClient.connectUser(
          {
            id: String(currentUser._id),
            name: currentUser.name,
          },
          token
        );

        console.log("User connected to video");

        const callId = `session-${activeSession._id}`;
        const callInstance = videoClient.call("default", callId);

        await callInstance.getOrCreate({
          data: { created_by_id: String(currentUser._id) },
        });

        await callInstance.join();

        console.log("Call joined successfully");

        try { await callInstance.camera.enable(); } catch { }
        try { await callInstance.microphone.enable(); } catch { }

        clientRef.current = videoClient;
        setClient(videoClient);
        setCall(callInstance);

      } catch (err) {
        console.error("Video initialization failed:", err);
      }
    };

    initVideo();

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnectUser().catch(() => { });
        clientRef.current = null;
      }
      setClient(null);
      setCall(null);
    };
  }, [currentUser?._id, activeSession?._id]);

  if (!client || !call) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Connecting Call...
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <StreamTheme theme="light">
          <div className="relative w-[90vw] h-[90vh] bg-slate-900 rounded-2xl overflow-hidden">
            <div className="absolute inset-0">
              <SpeakerLayout participantsBarPosition="bottom" />
            </div>

            <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-md p-4">
              <CallControls onLeave={onCallEnd} />
            </div>
          </div>
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
}