import { ThermometerSun } from "lucide-react";

export default function TemperatureGauge({
  temperature = 43,
}) {
  const angle = Math.min((temperature / 100) * 180, 180);

  return (
    <section className="glass temperature-card">
      <div className="panel-header">
        <div>
          <p>CPU TEMPERATURE</p>
          <h2>System Temperature</h2>
        </div>

        <ThermometerSun size={22} color="#FB923C" />
      </div>

      <div className="gauge-wrapper">
        <div className="gauge-circle">
          <div
            className="gauge-fill"
            style={{
              transform: `rotate(${angle}deg)`,
            }}
          />

          <div className="gauge-inner">
            <h2>{temperature}°C</h2>
            <span>Normal</span>
          </div>
        </div>
      </div>

      <p className="gauge-text">
        CPU temperature is within the recommended operating range.
      </p>
    </section>
  );
}