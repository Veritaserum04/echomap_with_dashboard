import { Bell, CheckCircle2 } from "lucide-react";

export default function NotificationToast({
  message,
  type = "info",
}) {
  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === "success" ? (
          <CheckCircle2 size={20} color="#22C55E" />
        ) : (
          <Bell size={20} color="#A855F7" />
        )}
      </div>

      <span>{message}</span>
    </div>
  );
}