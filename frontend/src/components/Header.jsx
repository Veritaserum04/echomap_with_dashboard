import { Bell, CalendarDays } from "lucide-react";

export default function Header() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="page-header">
      <div>
        <p className="header-date">
          <CalendarDays size={16} />
          {today}
        </p>

        <h2>EchoMap Dashboard</h2>
      </div>

      <button className="notification-button">
        <Bell size={20} />
      </button>
    </header>
  );
}