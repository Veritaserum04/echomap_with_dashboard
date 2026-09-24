import api from "./api";

export async function fetchDashboardData() {
  try {
    const [
      status,
      analytics,
      sensors,
      mapping,
      navigation,
      landmarks,
      voice,
    ] = await Promise.all([
      api.get("/status"),
      api.get("/analytics"),
      api.get("/sensors"),
      api.get("/mapping"),
      api.get("/navigation"),
      api.get("/landmarks"),
      api.get("/voice"),
    ]);

    return {
      status: status.data,
      analytics: analytics.data,
      sensors: sensors.data,
      mapping: mapping.data,
      navigation: navigation.data,
      landmarks: landmarks.data,
      voice: voice.data,
    };
  } catch (error) {
    console.error("Backend connection failed:", error);

    return null;
  }
}