export function formatDistance(distance) {
  if (distance === null || distance === undefined) return "--";
  return `${Number(distance).toFixed(1)} m`;
}

export function formatSteps(steps) {
  return `${steps ?? 0} steps`;
}

export function formatBattery(level) {
  return `${level ?? 0}%`;
}

export function formatTemperature(temp) {
  return `${temp ?? 0}°C`;
}

export function formatConfidence(value) {
  return `${value ?? 0}%`;
}

export function formatCoordinates(position = {}) {
  return `(${position.x ?? 0}, ${position.y ?? 0})`;
}