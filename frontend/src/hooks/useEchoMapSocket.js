import { useEffect, useRef, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/dashboard";
const WS_URL = "ws://127.0.0.1:8000/ws";

export default function useEchoMapSocket() {
  const [connected, setConnected] = useState(false);
  const [liveData, setLiveData] = useState({});
  const socketRef = useRef(null);

  // REST API polling every second
  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch(API_URL);
        const json = await response.json();

        setLiveData(json);
        setConnected(json.connected);

        console.log("Dashboard REST Connected", json);
      } catch (err) {
        console.error("REST API Error", err);
      }
    }

    loadDashboard();

    const timer = setInterval(loadDashboard, 1000);

    return () => clearInterval(timer);
  }, []);

  // Live WebSocket updates
  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("🟢 EchoMap WebSocket Connected");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("📡 WS DATA", data);

      setLiveData(data);
      setConnected(true);
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error", error);
    };

    socket.onclose = () => {
      console.log("🔴 EchoMap WebSocket Closed");
      setConnected(false);
    };

    return () => socket.close();
  }, []);

  return {
    connected,
    liveData,
  };
}