import time
from pydantic import BaseModel
from fastapi import HTTPException
from datetime import datetime
from collections import deque
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
# ==========================================================
# Raspberry Pi GPIO (Development Safe)
# Runs on Mac without GPIO, uses real GPIO on Raspberry Pi.
# ==========================================================

try:
    import RPi.GPIO as GPIO
    PI_MODE = True
    print("🟢 Raspberry Pi GPIO Loaded")

except ModuleNotFoundError:
    PI_MODE = False

    print("🟡 EchoMap Development Mode (GPIO Disabled)")

    class DummyGPIO:
        BCM = OUT = IN = HIGH = LOW = PUD_UP = None

        def setwarnings(self, *args, **kwargs): pass
        def setmode(self, *args, **kwargs): pass
        def setup(self, *args, **kwargs): pass
        def output(self, *args, **kwargs): pass
        def input(self, *args, **kwargs): return 0
        def cleanup(self): pass

    GPIO = DummyGPIO()
# ==========================================================
# Sensor Wrapper
# ==========================================================
# ----------------------------------------------------------
# Mac Development Mode: override sensor readings
# ----------------------------------------------------------

# ----------------------------------------------------------
# Mac Development Mode: Fake Raspberry Pi sensor readings
# ----------------------------------------------------------
# ==========================================================
# Sensor Wrapper (Mac + Raspberry Pi)
# ==========================================================

if PI_MODE:
    # Real Raspberry Pi sensors
    from sensors import (
        setup_sensors,
        read_all_sensors,
        is_stuck,
        reset_timeout_streak,
    )

else:
    # Mac development mode
    import random

    def setup_sensors():
        pass

    def reset_timeout_streak():
        pass

    def is_stuck():
        return False

    def read_all_sensors():
        """
        Simulated HC-SR04 readings for EchoMap Dashboard on Mac.
        Values change every dashboard refresh.
        """
        fake_left = random.randint(45, 120)
        fake_center = random.randint(20, 80)
        fake_right = random.randint(45, 120)
        return fake_left, fake_center, fake_right


# ==========================================================
# Remaining imports
# ==========================================================
import random
from buttons import setup_buttons, check_btn, beep
from voice import speak
from navigation import get_nav_instruction, reset_dynamic_history
from mapping import OccupancyGrid
from database import (
    init_db,
    get_landmark,
    get_all_landmark_maps,
    log_session,
    get_recent_sessions,
    save_landmark,
    get_all_landmarks
)
from landmarks import (
    register_landmark,
    ask_current_location,
    ask_destination,
)
from speech_input import (
    listen_for_name,
    listen_for_command,
    listen_for_mapping_command
)
from path_planner import (
    astar,
    path_to_instructions,
    instruction_to_speech,
    route_metrics,
)
from progression import level_for_confidence
from confidence_model import ConfidenceModel
from config import (
    STOP_REPLAN_SECS, TURN_WAIT_SECONDS, MAX_TURN_ATTEMPTS,
    DYNAMIC_REANNOUNCE_SECS, PROLONGED_BLOCK_SECS,
)
from config import WARN_DIST,STOP_DIST
# ==============================
# FastAPI Dashboard Integration
# ==============================
# ==============================
# Live Navigation State
# ==============================

current_instruction = "Walk forward 3 steps"
current_heading = "NORTH"

remaining_steps = 8
remaining_distance = 4.0      # meters
navigation_progress = 22

voice_history = [
    "Navigation started.",
    "Destination selected: Computer Lab.",
    "Walk forward 3 steps."
]


# ===================================
# EchoMap Dashboard API
# ===================================

# ===================================
# EchoMap Dashboard API
# ===================================

app = FastAPI(title="EchoMap Dashboard API")

# Allow React frontend (Vite) to access FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -------------------------------------------------------
# Modes
# -------------------------------------------------------

DISCOVERY = "DISCOVERY"
MAPPING = "MAPPING"
DESTINATION_SELECT = "DESTINATION_SELECT"
NAVIGATION = "NAVIGATION"

mode = DISCOVERY
current_path = []

mapped_percentage = 0

explored_cells = 0

goal_x = 0
goal_y = 0
destination_name = "None"
if not PI_MODE:
    destination_name = "Computer Lab"
    goal_x = 18
    goal_y = 15

grid = OccupancyGrid()
if not PI_MODE:
    grid.pos_x = 10
    grid.pos_y = 10
confidence_model = ConfidenceModel()
last_voice = ""
last_voice_time = 0

VOICE_INTERVAL = 2
# Dashboard voice history
# ==========================================
# Dashboard Live State (Shared with React)
# ==========================================
# ==========================================================
# Simple Authentication (Mac + Raspberry Pi)
# ==========================================================

users = {
    "amrutha@echomap.com": {
        "name": "Amrutha",
        "password": "echomap123"
    }
}

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

# ==========================================
# Global Dashboard State
# ==========================================

dashboard_state = {
    "connected": True,

    "system": {
        "battery": 100,
        "cpuTemp": 0,
        "ramUsage": 0,
        "confidence": 0.0,
        "level": 1,
    },

    "sensors": {
        "left": 0,
        "center": 0,
        "right": 0,
    },

    "navigation": {
        "instruction": "Waiting for destination...",
        "heading": "NORTH",
        "remainingDistance": 0,
        "remainingSteps": 0,
        "destination": "",
    },

    "mapping": {
        "currentLocation": {"x": 0, "y": 0},
        "destination": {"name": "", "x": 0, "y": 0},
        "mapped_percentage": 0,
        "exploredCells": 0,
        "visited": [],
        "obstacles": [],
        "path": [],
    },

    "landmarks": [],

    "analytics": {
        "navigationSessions": 0,
        "successfulSessions": 0,
        "totalLandmarks": 0,
        "totalSteps": 0,
        "averageConfidence": 0.0,
    },
}
# ==========================================
# Push Live EchoMap State into Dashboard
# ==========================================

def update_dashboard():
    """Update dashboard JSON from live EchoMap variables."""
    global dashboard_state

    # ---------------- Sensors ----------------
    try:
        left, center, right = read_all_sensors()
    except Exception:
        left = center = right = 0

    dashboard_state["sensors"] = {
        "left": round(left, 1),
        "center": round(center, 1),
        "right": round(right, 1),
    }

    # ---------------- Navigation ----------------
    current_instruction = globals().get("current_instruction", "Waiting for destination...")
    remaining_steps = globals().get("remaining_steps", 0)
    remaining_distance = globals().get("remaining_distance", 0.0)
    navigation_progress = globals().get("navigation_progress", 0)
    voice_history = globals().get("voice_history", [])
    heading_value = getattr(grid, "heading", "NORTH")

    if isinstance(heading_value, (int, float)):
        headings = ["NORTH", "EAST", "SOUTH", "WEST"]
        current_heading = headings[int(heading_value) % 4]
    else:
        current_heading = heading_value

    voice_history = globals().get("voice_history", [])

    dashboard_state["navigation"] = {
        "instruction": current_instruction,
        "heading": current_heading,
        "remainingDistance": remaining_distance,
        "remainingSteps": remaining_steps,
        "destination": destination_name,
        "progress": navigation_progress,
        "voiceHistory": [
            item["message"] if isinstance(item, dict) else item
            for item in voice_history[-10:]
        ],
    }

    # =====================================================
    # Mapping Data
    # Raspberry Pi -> Real values
    # Mac -> Preview values only
    # =====================================================

    visited_cells = list(getattr(grid, "visited", set()))
    obstacle_cells = list(getattr(grid, "obstacles", set()))
    path_cells = list(current_path)

    current_x = getattr(grid, "pos_x", 10)
    current_y = getattr(grid, "pos_y", 10)

    map_percent = mapped_percentage
    explored = explored_cells

    dest_name = destination_name
    dest_x = goal_x
    dest_y = goal_y

    # ---------- Development Preview ----------
    if not PI_MODE and len(visited_cells) == 0:

        visited_cells = [
            (10,10),(10,11),(10,12),(11,12),(12,12),
            (13,12),(14,12),(15,13),(16,14),(17,15),(18,15),
            (11,10),(12,10),(13,11),(14,11),(15,12)
        ]

        obstacle_cells = [
            (12,9),(13,9),(14,10),(15,10),
            (16,11),(17,12),(15,15)
        ]

        path_cells = [
            (10,10),(11,10),(12,11),(13,12),
            (14,13),(15,14),(16,14),(17,15),(18,15)
        ]

        current_x = 10
        current_y = 10

        dest_name = "Computer Lab"
        dest_x = 18
        dest_y = 15

        map_percent = 62
        explored = len(visited_cells)

    dashboard_state["mapping"] = {
        "currentLocation": {
            "x": int(current_x),
            "y": int(current_y),
        },

        "destination": {
            "name": dest_name,
            "x": int(dest_x),
            "y": int(dest_y),
        },

        "mapped_percentage": map_percent,
        "exploredCells": explored,

        "visited": [
            {"x": int(x), "y": int(y)}
            for x, y in visited_cells
        ],

        "obstacles": [
            {"x": int(x), "y": int(y)}
            for x, y in obstacle_cells
        ],

        "path": [
            {"x": int(x), "y": int(y)}
            for x, y in path_cells
        ],
    }

    # ---------------- Landmarks ----------------
    # ---------------- Landmarks ----------------
    try:
        dashboard_state["landmarks"] = get_all_landmarks()
    except Exception:
        dashboard_state["landmarks"] = []
    # Mac Preview Only
    if not PI_MODE and len(dashboard_state["landmarks"]) == 0:
        dashboard_state["landmarks"] = [
            {"name": "Computer Lab", "x": 18, "y": 15},
            {"name": "Library", "x": 22, "y": 8},
            {"name": "Reception", "x": 6, "y": 18},
            {"name": "Canteen", "x": 28, "y": 20},
        ]

# Mac Preview Only (does NOT affect Raspberry Pi)
if not PI_MODE and len(dashboard_state["landmarks"]) == 0:
    dashboard_state["landmarks"] = [
        {"name": "Computer Lab", "x": 18, "y": 15},
        {"name": "Library", "x": 22, "y": 8},
        {"name": "Reception", "x": 6, "y": 18},
        {"name": "Canteen", "x": 28, "y": 20},
    ]

    # ---------------- Analytics ----------------
    try:
        sessions = get_recent_sessions()
    except Exception:
        sessions = []

    dashboard_state["analytics"] = {
        "navigationSessions": len(sessions),
        "successfulSessions": len(sessions),
        "totalLandmarks": len(dashboard_state["landmarks"]),
        "totalSteps": explored_cells,
        "averageConfidence": round(
            getattr(confidence_model, "current_confidence", 0.91), 2
        ),
    }

    # ---------------- System ----------------
    confidence = getattr(confidence_model, "current_confidence", 0.91)

    dashboard_state["system"] = {
        "battery": dashboard_state["system"].get("battery", 96),
        "cpuTemp": dashboard_state["system"].get("cpuTemp", 42),
        "ramUsage": dashboard_state["system"].get("ramUsage", 34),
        "confidence": round(confidence, 2),
        "level": level_for_confidence(confidence),
    }
# Faster re-announce interval used ONLY for STOP / PATH_BLOCKED, so the
# person gets frequent audio confirmation while stopped instead of waiting
# up to VOICE_INTERVAL seconds between repeats.
STOP_VOICE_INTERVAL = 0.75
_last_stop_voice = ""
_last_stop_voice_time = 0

# How many consecutive matching readings are required AFTER the turn-wait
# window ends before the system commits to a decision (turn again, slow,
# or clear). A single reading taken right at the deadline can still reflect
# a turn that isn't fully finished yet — requiring two agreeing readings in
# a row avoids reacting to one stale/mid-turn sample.
POST_TURN_CONFIRMATIONS = 2
# -------- Button Debounce --------
from buttons import (
    check_btn,
    beep,
    shutdown,
    BTN_TAG,
    BTN_CYCLE,
    BTN_NAVIGATE
)
last_press_time = {
    BTN_TAG: 0,
    BTN_CYCLE: 0,
    BTN_NAVIGATE: 0
}

DEBOUNCE_TIME = 0.35 
STOP_DIST = 40  # cm
# -------------------------------------------------------
# Speak without repeating continuously
# -------------------------------------------------------

def speak_once(message):
    """Standard throttle (VOICE_INTERVAL)."""

    global last_voice, last_voice_time
    global current_instruction, voice_history

    if not message:
        return

    now = time.time()

    if message != last_voice or now - last_voice_time > VOICE_INTERVAL:
        speak(message)

        last_voice = message
        last_voice_time = now

        # Dashboard update
        current_instruction = message
        voice_history.append({
            "message": message,
            "time": datetime.now().strftime("%H:%M:%S")
        })

        voice_history[:] = voice_history[-10:]
def speak_stop(message):
    global _last_stop_voice, _last_stop_voice_time
    global current_instruction, voice_history

    if not message:
        return

    now = time.time()

    if message != _last_stop_voice or now - _last_stop_voice_time > STOP_VOICE_INTERVAL:
        speak(message)

        _last_stop_voice = message
        _last_stop_voice_time = now

        current_instruction = message
        voice_history.append({
            "message": message,
            "time": datetime.now().strftime("%H:%M:%S")
        })

        voice_history[:] = voice_history[-10:]

# -------------------------------------------------------
# Discovery Mode — turn / wait / rescan state machine
# -------------------------------------------------------
#
# Hard safety rules encoded here (see EchoMap spec §9-§20):
#  - Never say "Path clear. Walk." immediately after a turn instruction.
#  - Never assume the person actually turned or actually walked.
#  - STOP always preempts the turn-wait timer, every tick.
#  - Bounded retries: after MAX_TURN_ATTEMPTS failed turns in a row,
#    declare the path blocked instead of oscillating forever.
#  - While waiting for a person to complete a physical turn, sensor noise
#    from the turn itself (misread as MOVING_CENTER, or brief side-sensor
#    echo timeouts) must not cancel the wait — see reset_dynamic_history()
#    and reset_timeout_streak() in _issue_turn().
#  - After the wait window ends, require POST_TURN_CONFIRMATIONS consecutive
#    matching readings before acting — a single sample right at the deadline
#    can still reflect an unfinished turn.


class DiscoveryController:
    def __init__(self):
        self.awaiting_rescan = False
        self.rescan_deadline = 0.0
        self.turn_history = deque(maxlen=MAX_TURN_ATTEMPTS)
        self.in_dynamic_wait = False
        self.dynamic_wait_deadline = 0.0
        self.blocked_since = None
        self.confirming = False
        self.confirm_action = None
        self.confirm_votes = 0

    def reset(self):
        self.awaiting_rescan = False
        self.turn_history.clear()
        self.in_dynamic_wait = False
        self.blocked_since = None
        self.confirming = False
        self.confirm_action = None
        self.confirm_votes = 0

    def tick(self, left, center, right):
        if is_stuck('CENTER') or is_stuck('LEFT') or is_stuck('RIGHT'):
             speak_once('Sensor unavailable. Please check EchoMap.')
             return
        action, message = get_nav_instruction(left, center, right)
        print(f'[DISCOVERY] L={left:.1f} C={center:.1f} R={right:.1f} -> {action}')
        now = time.time()

        if action == 'STOP':
            self.reset()
            speak_stop('Stop.Take a step back.')
            return

        if action == 'PATH_BLOCKED':
          if self.blocked_since is None:
            self.blocked_since = now
            speak_stop('Stop. Path blocked.')
          elif now - self.blocked_since > PROLONGED_BLOCK_SECS:
            speak_stop('No safe path detected. Please turn around and try another direction.')
          else:
            speak_stop('Stop. Path blocked.')
          self.awaiting_rescan = False
          self.confirming = False
          self.turn_history.clear()
          return

        # Shield the turn-wait window: while we're still giving the person
        # time to physically complete a turn, don't let sensor noise from
        # the turn itself (misread as MOVING_CENTER) cancel the wait.
        # STOP/PATH_BLOCKED above still preempt immediately every tick.
        if self.awaiting_rescan and now < self.rescan_deadline:
            return

        if action == 'MOVING_CENTER':
            # Cancel any pending turn-wait/confirmation — a moving obstacle
            # takes priority.
            self.awaiting_rescan = False
            self.confirming = False
            self.turn_history.clear()
            if not self.in_dynamic_wait:
                # First detection: announce once, then go quiet.
                self.in_dynamic_wait = True
                speak('Moving obstacle ahead. Please wait.')
                self.dynamic_wait_deadline = now + DYNAMIC_REANNOUNCE_SECS
            elif now >= self.dynamic_wait_deadline:
                # Still blocking after the wait window — re-announce once.
                speak('Moving obstacle ahead. Please wait.')
                self.dynamic_wait_deadline = now + DYNAMIC_REANNOUNCE_SECS
            # else: silently keep waiting, no repeat.
            return

        # Obstacle is gone (classifier no longer reports MOVING_CENTER).
        self.in_dynamic_wait = False

        if self.awaiting_rescan:
            # Deadline has passed (guaranteed by the shield above). Don't
            # act on this single reading yet — require POST_TURN_CONFIRMATIONS
            # consecutive ticks agreeing on the same action first.
            if not self.confirming:
                self.confirming = True
                self.confirm_action = action
                self.confirm_votes = 1
                return

            if action == self.confirm_action:
                self.confirm_votes += 1
            else:
                # Reading changed since the last check — restart the count
                # against the new action rather than trusting a flip.
                self.confirm_action = action
                self.confirm_votes = 1

            if self.confirm_votes < POST_TURN_CONFIRMATIONS:
                return

            # Two consecutive agreeing readings — commit to this decision.
            self.awaiting_rescan = False
            self.confirming = False
            if action in ('TURN_LEFT', 'TURN_RIGHT'):
                self._issue_turn(action, message)
            elif action == 'SLOW':
                self.turn_history.clear()
                speak_once('Slow down.')
            else:  # CLEAR
                self.turn_history.clear()
                speak_once('Path clear. Walk.')
            return

        if action in ('TURN_LEFT', 'TURN_RIGHT'):
            self._issue_turn(action, message)
        elif action == 'SLOW':
            speak_once('Slow down.')
        elif action == 'CLEAR':
            self.turn_history.clear()
            speak_once('Path clear. Walk.')

    def _issue_turn(self, action, message):
        self.turn_history.append('left' if action == 'TURN_LEFT' else 'right')
        if len(self.turn_history) >= self.turn_history.maxlen:
            self.reset()
            speak_once('Path blocked. Please wait.')
            return
        speak_once(message)
        # Don't carry pre-turn motion/timeout history into the rescan window —
        # the person is about to physically rotate, which naturally causes
        # fast sensor changes and occasional echo timeouts that must not be
        # misread as a moving obstacle or a faulty sensor.
        reset_dynamic_history()
        reset_timeout_streak()
        self.awaiting_rescan = True
        self.confirming = False
        self.confirm_action = None
        self.confirm_votes = 0
        self.rescan_deadline = time.time() + TURN_WAIT_SECONDS
        print(f'[DISCOVERY] Turn issued ({action}); waiting {TURN_WAIT_SECONDS}s before rescan.')


discovery_controller = DiscoveryController()


def discovery_loop():
    left, center, right = read_all_sensors()
    grid.update(left, center, right)
    
    discovery_controller.tick(left, center, right)


# -------------------------------------------------------
# Mapping Mode
# -------------------------------------------------------
# Mapping is for a sighted person; they don't need turn-by-turn guidance,
# only safety-relevant announcements. Position/heading here change ONLY
# from explicit STT commands (see mapping.apply_mapping_command) — never
# from this ambient obstacle scan.

_MAPPING_SAFETY_ACTIONS = {'STOP', 'PATH_BLOCKED', 'MOVING_CENTER'}
_MAPPING_MESSAGES = {
    'STOP': 'Stop.',
    'PATH_BLOCKED': 'Stop. Path blocked.',
    'MOVING_CENTER': 'Moving obstacle ahead. Please wait.',
}


def mapping_loop():
    """
    Mapping Mode with Ultrasonic SLAM.
    Runs continuously while Mapping Mode is active.
    """
    # ---------------- Occupancy Grid Mapping ----------------
    grid.update(left, center, right)

    # ---------------- Ultrasonic SLAM ----------------
    grid.update_slam(left, center, right)

    # ---------------- Loop Closure ----------------
    matched = grid.loop_closure()

    if matched:
        speak(f"Landmark recognized. {matched}. Position corrected.")

    # Optional debug output
    grid.print_map()

    time.sleep(0.05)
    action, _ = get_nav_instruction(left, center, right)
    dashboard_state["navigation"] = {
    "instruction": message,
    "heading": "NORTH",
    "remainingDistance": 6.5,
    "remainingSteps": 3,
}
    if action in _MAPPING_SAFETY_ACTIONS:
        speak_once(_MAPPING_MESSAGES[action])

    # -------- Button 1 Short → Landmark --------
    press1 = check_btn(16)

    if press1 == "short":
        register_landmark(speak, grid)

    # -------- Button 1 Long → Exit Mapping -----
    if press1 == "long":
        speak("Discovery mode.")
        discovery_controller.reset()
        mode = DISCOVERY
        return

    # -------- Button 2 Short → Listen for Command -----
    press2 = check_btn(20)

    if press2 == "short":
        speak("Say movement command.")
        command = listen_for_command(timeout=5)
        if command:
            response = grid.apply_mapping_command(command)
            speak(response)
        else:
            speak("Command not detected.")


# -------------------------------------------------------
# Navigation Mode
# -------------------------------------------------------

def _plan_mapped_route(source_row, dest_row):

    """
    Follow the trajectory that was physically mapped.

    The destination landmark's saved map contains the complete
    mapping trajectory up to that destination.

    Returns:
        path, speech_steps
    """

    try:
        # ------------------------------------------------------
        # Get source and destination coordinates
        # ------------------------------------------------------
        sx, sy, sheading, _, _, _ = source_row
        dx, dy, _, _, _, dest_map = dest_row

        # ------------------------------------------------------
        # Load the map saved at the destination.
        # This should contain the complete mapped trajectory.
        # ------------------------------------------------------
        saved_map = json.loads(dest_map)

        mapped_path = [
            tuple(p)
            for p in saved_map.get("path", [])
        ]

        if len(mapped_path) < 2:
            print("[MAPPED ROUTE] No saved trajectory found.")
            return None, None

        source = (int(sx), int(sy))
        destination = (int(dx), int(dy))

        print(
            f"[MAPPED ROUTE] Searching trajectory "
            f"from {source} to {destination}"
        )

        # ------------------------------------------------------
        # Find source and destination inside mapped trajectory
        # ------------------------------------------------------
        source_indices = [
            i for i, p in enumerate(mapped_path)
            if tuple(p) == source
        ]

        destination_indices = [
            i for i, p in enumerate(mapped_path)
            if tuple(p) == destination
        ]

        if not source_indices or not destination_indices:
            print(
                "[MAPPED ROUTE] Source or destination "
                "not present in saved trajectory."
            )
            return None, None

        # ------------------------------------------------------
        # Prefer source -> destination in forward mapping order
        # ------------------------------------------------------
        start_index = None
        end_index = None

        for si in source_indices:
            possible_destinations = [
                di for di in destination_indices
                if di > si
            ]

            if possible_destinations:
                start_index = si
                end_index = possible_destinations[-1]
                break

        # ------------------------------------------------------
        # If destination was mapped before source, use reverse
        # trajectory so navigation can still follow the same path.
        # ------------------------------------------------------
        if start_index is None:
            for di in destination_indices:
                possible_sources = [
                    si for si in source_indices
                    if si > di
                ]

                if possible_sources:
                    start_index = possible_sources[0]
                    end_index = di
                    break

            if start_index is None:
                print(
                    "[MAPPED ROUTE] Could not connect "
                    "source and destination."
                )
                return None, None

            path = mapped_path[
                end_index:start_index + 1
            ][::-1]

        else:
            path = mapped_path[
                start_index:end_index + 1
            ]

        if len(path) < 2:
            print(
                "[MAPPED ROUTE] Mapped route is too short."
            )
            return None, None

        # ------------------------------------------------------
        # Convert mapped trajectory to speech instructions
        # ------------------------------------------------------
        speech_steps = []

        current_heading = float(sheading)

        direction = {
            (1, 0): 90,      # East / right
            (-1, 0): 270,   # West / left
            (0, -1): 0,     # North / forward
            (0, 1): 180     # South / backward
        }

        for i in range(1, len(path)):

            x1, y1 = path[i - 1]
            x2, y2 = path[i]

            dx_step = x2 - x1
            dy_step = y2 - y1

            if (dx_step, dy_step) not in direction:
                print(
                    f"[MAPPED ROUTE] Ignoring invalid "
                    f"movement: {(dx_step, dy_step)}"
                )
                continue

            target_heading = direction[
                (dx_step, dy_step)
            ]

            diff = (
                target_heading - current_heading
            ) % 360

            if diff == 90:
                speech_steps.append("Turn right.")

            elif diff == 270:
                speech_steps.append("Turn left.")

            elif diff == 180:
                speech_steps.append("Turn around.")

            # Every mapped grid cell = one forward movement
            speech_steps.append(
                "Walk forward one step."
            )

            current_heading = target_heading

        if not speech_steps:
            print(
                "[MAPPED ROUTE] Could not generate "
                "navigation instructions."
            )
            return None, None

        print(
            f"[MAPPED ROUTE] Route cells = {len(path)}"
        )

        print(
            f"[MAPPED ROUTE] Speech instructions = "
            f"{len(speech_steps)}"
        )

        print(
            f"[MAPPED ROUTE] Start = {path[0]} "
            f"Goal = {path[-1]}"
        )

        return path, speech_steps

    except Exception as e:
        print(
            f"[MAPPED ROUTE] Error: {e}"
        )
        return None, None

def load_complete_map():
    """
    Merge all saved landmark map snapshots into one common
    occupancy grid.

    All mapping sessions use the same global coordinate system
    starting around (50,50), so the snapshots can be combined.
    """

    rows = get_all_landmark_maps()

    if not rows:
        print("[MAP] No saved landmark maps found.")
        return False

    merged = grid.grid.copy()

    for name, map_data in rows:
        try:
            saved = json.loads(map_data)

            saved_grid = saved.get("grid")

            if saved_grid is None:
                continue

            for x in range(len(saved_grid)):
                for y in range(len(saved_grid[x])):
                    value = saved_grid[x][y]

                    # Occupied information has highest priority.
                    if value >= 1:
                        merged[x, y] = value

                    # Otherwise preserve known FREE cells.
                    elif value == 0:
                        if merged[x, y] != 1:
                            merged[x, y] = 0

            print(f"[MAP] Merged map from landmark: {name}")

        except Exception as e:
            print(
                f"[MAP] Could not merge map from "
                f"'{name}': {e}"
            )

    grid.grid = merged

    print("[MAP] Complete environment map loaded.")
    return True

def _plan_route(goal_x, goal_y):
    """
    Plan A* path and convert it into simple navigation instructions.
    Returns:
    path, speech_steps
    """

    start = (grid.pos_x, grid.pos_y)
    goal = (goal_x, goal_y)

    print(f"[A*] Planning from {start} to {goal}")

    path = astar(grid.grid, start, goal)

    if path is None or len(path) < 2:
        return None, None

    speech_steps = []
    current_heading = float(grid.heading)

    direction = {
        (1, 0): 90,     # right/east
        (-1, 0): 270,   # left/west
        (0, -1): 0,     # forward/north
        (0, 1): 180     # backward/south
    }

    for i in range(1, len(path)):
        x1, y1 = path[i - 1]
        x2, y2 = path[i]

        dx = x2 - x1
        dy = y2 - y1

        if (dx, dy) not in direction:
            continue

        target_heading = direction[(dx, dy)]

        diff = (target_heading - current_heading) % 360

        if diff == 90:
            speech_steps.append("Turn right.")
        elif diff == 270:
            speech_steps.append("Turn left.")
        elif diff == 180:
            speech_steps.append("Turn around.")

    # Every A* cell represents one forward movement.
        speech_steps.append("Walk forward one step.")

        current_heading = target_heading

    print(f"[A*] Path cells = {len(path)}")
    print(f"[A*] Speech instructions = {len(speech_steps)}")

    return path, speech_steps


def _predict_confidence(errors, walk_steps, complexity, dynamic_obstacles):
    """Feed recent session history + this session into the confidence model.
    This is a heuristic recurrent scorer, not a trained/validated LSTM —
    see confidence_model.py."""
    recent = get_recent_sessions(5)
    seq = [
        {
            'error_rate': r[7] or 0,
            'reaction_time': r[6] or 0,
            'route_complexity': r[8] or 0,
            'success': r[4] or 0,
            'dynamic_obstacles': r[10] or 0,
        }
        for r in reversed(recent)
    ]
    seq.append({
        'error_rate': errors / max(walk_steps, 1),
        'reaction_time': 0,  # not yet measured on-device
        'route_complexity': complexity,
        'success': 1,
        'dynamic_obstacles': dynamic_obstacles,
    })
    return confidence_model.predict(seq)
def heading_to_text(angle):
    angle = int(angle) % 360
    if angle == 0:
        return "NORTH"
    elif angle == 90:
        return "EAST"
    elif angle == 180:
        return "SOUTH"
    elif angle == 270:
        return "WEST"
    return "NORTH"

def navigation_loop(source_name, destination_name):

    """
    Navigate from a selected source landmark to a destination landmark
    using A* + ultrasonic safety sensing.

    Navigation pose is controlled by the planned A* route.
    Ultrasonic sensors are used for real-time obstacle detection.
    """
    global current_instruction
    global current_heading
    global remaining_steps
    global remaining_distance
    global navigation_progress
    global voice_history
    global current_path
    global current_destination_name
    global goal_x, goal_y
    start_time = datetime.now().isoformat()
    # ---------------- Dashboard Live State ----------------

    current_instruction = "Waiting for destination..."
    current_heading = "NORTH"
    remaining_distance = 0.0
    remaining_steps = 0
    navigation_progress = 0
    voice_history = []

    # ==========================================================
    # Load SOURCE landmark
    # ==========================================================

    source_row = get_landmark(source_name)

    if source_row is None:
        speak("Source location not found.")
        return

    sx, sy, sheading, sconf, sscan, smap = source_row

    # Restore map and pose from source landmark
    try:
        grid.from_dict(json.loads(smap))
    except Exception as e:
        print(f"[NAV] Failed to restore map: {e}")
        speak("Unable to load source map.")
        return

    grid.pos_x = sx
    grid.pos_y = sy
    grid.heading = sheading
    grid.pose_confidence = sconf

    # ==========================================================
    # Load DESTINATION landmark
    # ==========================================================

    dest_row = get_landmark(destination_name)

    if dest_row is None:
        speak("Destination not found.")
        return

    goal_x, goal_y, goal_heading, goal_conf, goal_scan, goal_map = dest_row
    current_destination_name = destination_name
    current_path = []

    print(
        f"[START] ({grid.pos_x}, {grid.pos_y}) "
        f"Heading={grid.heading}"
    )

    print(
        f"[GOAL] ({goal_x}, {goal_y}) "
        f"Heading={goal_heading}"
    )

    # ==========================================================
    # LOAD COMPLETE MAPPED ENVIRONMENT
    # ==========================================================

    load_complete_map()

    # ==========================================================
    # A* ROUTE PLANNING
    # ==========================================================

    instructions, speech_steps = _plan_route(
        goal_x,
        goal_y
    )

    if instructions is None or speech_steps is None:
        speak("No route found.")
        return

    print("[NAV] Using A* on complete mapped environment.")

    if instructions is None or speech_steps is None:
        speak("No route found.")
        return

    print(f"[NAV] Path cells = {len(instructions)}")
    print(f"[NAV] Speech instructions = {len(speech_steps)}")

    # ==========================================================
    # ROUTE METRICS
    # ==========================================================

    walk_steps = sum(
        1
        for step in speech_steps
        if step == "Walk forward one step."
    )

    turns = sum(
        1
        for step in speech_steps
        if step.startswith("Turn")
    )

    complexity = round(
        turns * 0.5 + walk_steps / 20.0,
        2
    )

    # ==========================================================
    # NAVIGATION METRICS
    # ==========================================================

    dynamic_obstacles = 0
    errors = 0

    waiting_dynamic = False
    stop_since = None

    step_idx = 0

    # ==========================================================
    # WALK SAFETY CONFIRMATION
    # ==========================================================
    #
    # A walk instruction is spoken only after two consecutive
    # ultrasonic scans confirm that the forward path is safe.
    #
    # This prevents:
    #
    # STOP -> sensor fluctuation -> WALK -> STOP -> WALK
    #
    # ==========================================================

    safe_walk_confirmations = 0
    REQUIRED_SAFE_WALK_CONFIRMATIONS = 2

    # ==========================================================
    # EXECUTE ROUTE
    # ==========================================================

    while step_idx < len(speech_steps):

        current_step = speech_steps[step_idx]

        print(
            f"[NAV] Step {step_idx + 1}/"
            f"{len(speech_steps)}: {current_step}"
        )

        finished = False

        while not finished:

            # --------------------------------------------------
            # Read ultrasonic sensors
            # --------------------------------------------------

            left, center, right = read_all_sensors()

            print(
                f"[SENSORS] "
                f"L={left} cm "
                f"C={center} cm "
                f"R={right} cm"
            )
            dashboard_state["sensors"] = {
                "left": round(left, 1),
                "center": round(center, 1),
                "right": round(right, 1),
            }

            # --------------------------------------------------
            # Update occupancy grid ONLY
            #
            # Do NOT call update_slam() here.
            # Do NOT call loop_closure() here.
            #
            # Navigation pose is controlled by the A* route.
            # --------------------------------------------------

            # --------------------------------------------------
            # Real-time ultrasonic safety
            # --------------------------------------------------

            grid.update(left, center, right)
            explored_cells = len(grid.visited)

            mapped_percentage = min(
                100,
                int((explored_cells / 400) * 100)
            )
# ==========================================
# Update Mapping Data for Dashboard
# ==========================================

            dashboard_state["mapping"]["currentLocation"] = {
                "x": grid.pos_x,
                "y": grid.pos_y,
            }

            dashboard_state["mapping"]["mapped_percentage"] = 61

            action, message = get_nav_instruction(
                left,
                center,
                right
            )
            # ==========================================
# Update Navigation Card
# ==========================================

            dashboard_state["navigation"]["instruction"] = message
            dashboard_state["navigation"]["heading"] = "NORTH"

            # ==================================================
            # MOVING OBSTACLE
            # ==================================================

            if action == "MOVING_CENTER":

                # A moving obstacle means the current walk
                # instruction must not be announced yet.

                safe_walk_confirmations = 0

                if not waiting_dynamic:
                    dynamic_obstacles += 1
                    waiting_dynamic = True

                    print(
                        "[NAV] Dynamic obstacle detected."
                    )

                speak_once(message)

                finished = False
                time.sleep(0.10)
                continue

            # ==================================================
            # STOP / BLOCKED PATH
            # ==================================================

            elif action in ("STOP", "PATH_BLOCKED"):

                errors += 1

                # Reset safe confirmation because the path
                # is currently unsafe.
                safe_walk_confirmations = 0

                # STOP must be announced immediately.
                speak_stop(message)

                print(
                    f"[NAV] Obstacle detected at "
                    f"({grid.pos_x}, {grid.pos_y})."
                )

                print(
                    f"[A*] Immediate replanning from "
                    f"({grid.pos_x}, {grid.pos_y}) "
                    f"to ({goal_x}, {goal_y})"
                )

                # The grid.update() call above has already inserted
                # the newly detected obstacle into the occupancy grid.

                # Replan immediately from the CURRENT position.
                new_instructions, new_speech_steps = _plan_route(
                    goal_x,
                    goal_y
                )

                if (
                    new_instructions is None
                    or new_speech_steps is None
                ):
                    speak("No alternate route found.")
                    finished = False
                    time.sleep(0.10)
                    continue

                # Replace the old route with the new A* route.
                instructions = new_instructions
                speech_steps = new_speech_steps

                # Recalculate route metrics.
                walk_steps = sum(
                    1
                    for step in speech_steps
                    if step == "Walk forward one step."
                )

                turns = sum(
                    1
                    for step in speech_steps
                    if step.startswith("Turn")
                )

                complexity = round(
                    turns * 0.5 + walk_steps / 20.0,
                    2
                )

                # Reset safety confirmation.
                safe_walk_confirmations = 0

                # Restart the new route from its first instruction.
                step_idx = -1

                stop_since = None
                waiting_dynamic = False

                print("[NAV] Immediate alternate route accepted.")

                # Exit inner loop.
                finished = True

            # ==================================================
            # PATH CLEAR / SAFE
            # ==================================================

            else:

                # --------------------------------------------------
                # WALK SAFETY
                # --------------------------------------------------
                #
                # Never announce a WALK instruction unless the
                # forward path is safe.
                #
                # < 30 cm  = emergency STOP
                # < 100 cm = unsafe for walking
                # >= 100 cm = potentially safe
                #
                # Two consecutive safe readings are required.
                # --------------------------------------------------

                if "walk" in current_step.lower():

                    # ----------------------------------------------
                    # Emergency STOP
                    # ----------------------------------------------

                    if center < STOP_DIST:

                        safe_walk_confirmations = 0

                        speak_stop(
                            "Stop. Obstacle ahead."
                        )

                        print(
                            f"[NAV] EMERGENCY STOP: "
                            f"center={center} cm"
                        )

                        # Do NOT advance the grid position.
                        finished = False

                        time.sleep(0.05)
                        continue

                    # ----------------------------------------------
                    # Walking path still blocked
                    # ----------------------------------------------

                    if center < WARN_DIST:

                        safe_walk_confirmations = 0

                        speak_stop(
                            "Stop. Obstacle ahead."
                        )

                        print(
                            f"[NAV] WALK BLOCKED: "
                            f"center={center} cm"
                        )

                        # ------------------------------------------
                        # Immediately replan from CURRENT pose
                        # ------------------------------------------

                        print(
                            f"[A*] Replanning from "
                            f"({grid.pos_x}, {grid.pos_y}) "
                            f"to ({goal_x}, {goal_y})"
                        )

                        new_instructions, new_speech_steps = _plan_route(
                            goal_x,
                            goal_y
                        )

                        if (
                            new_instructions is None
                            or new_speech_steps is None
                        ):
                            speak("No alternate route found.")
                            time.sleep(0.10)
                            continue

                        instructions = new_instructions
                        speech_steps = new_speech_steps

                        # Recalculate metrics.
                        walk_steps = sum(
                            1
                            for step in speech_steps
                            if step == "Walk forward one step."
                        )

                        turns = sum(
                            1
                            for step in speech_steps
                            if step.startswith("Turn")
                        )

                        complexity = round(
                            turns * 0.5 + walk_steps / 20.0,
                            2
                        )

                        # Reset safety confirmation after replan.
                        safe_walk_confirmations = 0

                        # Restart from first instruction.
                        step_idx = -1

                        stop_since = None
                        waiting_dynamic = False

                        print(
                            "[NAV] Alternate route accepted."
                        )

                        finished = True
                        break

                    # ----------------------------------------------
                    # First safe reading
                    # ----------------------------------------------

                    safe_walk_confirmations += 1

                    print(
                        f"[NAV] Safe walk confirmation "
                        f"{safe_walk_confirmations}/"
                        f"{REQUIRED_SAFE_WALK_CONFIRMATIONS} "
                        f"(center={center} cm)"
                    )

                    # Do not announce WALK yet.
                    if (
                        safe_walk_confirmations
                        < REQUIRED_SAFE_WALK_CONFIRMATIONS
                    ):
                        finished = False
                        time.sleep(0.10)
                        continue

                    # ----------------------------------------------
                    # Two consecutive safe readings confirmed
                    # ----------------------------------------------

                    safe_walk_confirmations = 0

                else:

                    # A turn/destination instruction does not use
                    # the walk confirmation counter.
                    safe_walk_confirmations = 0

                # ==================================================
# ONLY NOW SPEAK THE CURRENT INSTRUCTION
# ==================================================

                speak(current_step)

# ---------- Dashboard Live Navigation ----------
                current_instruction = current_step
                headings = {
                    0: "NORTH",
                    90: "EAST",
                    180: "SOUTH",
                    270: "WEST"
                }

                heading_angle = int(grid.heading) % 360
                current_heading = headings.get(int(grid.heading) % 360, "NORTH")

                remaining_steps = max(0, len(speech_steps) - step_idx - 1)
                remaining_distance = round(remaining_steps * 0.5, 1)

                navigation_progress = int(
                    ((step_idx + 1) / len(speech_steps)) * 100
                )

                dashboard_state["navigation"].update({
                    "instruction": current_instruction,
                    "heading": current_heading,
                    "remainingSteps": remaining_steps,
                    "remainingDistance": remaining_distance,
                    "progress": navigation_progress,
                })

                current_path = instructions

                voice_history.append({
                "time": datetime.now().strftime("%H:%M:%S"),
                "message": current_step,
                })

# Keep only the last 10 messages
                voice_history = voice_history[-10:]
# -----------------------------------------------

                if waiting_dynamic:
                    speak_once("Path clear. Continuing.")
                    waiting_dynamic = False

                stop_since = None

                # ==================================================
                # UPDATE NAVIGATION POSE
                #
                # Only update the pose AFTER the ultrasonic
                # safety check says it is safe to continue.
                # ==================================================

                step = current_step.lower()

                if "turn around" in step:

                    grid.turn(180)
                    headings = {0:"NORTH",90:"EAST",180:"SOUTH",270:"WEST"}
                    current_heading = headings.get(int(grid.heading) % 360, "NORTH")

                    dashboard_state["navigation"]["heading"] = current_heading

                    print(
                        f"[NAV] Turn around -> "
                        f"Heading={grid.heading}"
                    )

                elif "turn left" in step:

                    grid.turn(-90)
                    headings = {0:"NORTH",90:"EAST",180:"SOUTH",270:"WEST"}
                    current_heading = headings.get(int(grid.heading) % 360, "NORTH")

                    dashboard_state["navigation"]["heading"] = current_heading

                    print(
                        f"[NAV] Turn left -> "
                        f"Heading={grid.heading}"
                    )

                elif "turn right" in step:

                    grid.turn(90)
                    headings = {0:"NORTH",90:"EAST",180:"SOUTH",270:"WEST"}
                    current_heading = headings.get(int(grid.heading) % 360, "NORTH")

                    dashboard_state["navigation"]["heading"] = current_heading

                    print(
                        f"[NAV] Turn right -> "
                        f"Heading={grid.heading}"
                    )

                elif "walk" in step:

                    old_x = grid.pos_x
                    old_y = grid.pos_y

# Move one grid cell
                    grid.advance_steps(1)

# Dashboard live current location
                    dashboard_state["mapping"]["currentLocation"] = {
                        "x": grid.pos_x,
                        "y": grid.pos_y,
                    }

# Update visited cells
                    dashboard_state["mapping"]["visited"] = [
                        {"x": x, "y": y}
                        for x, y in list(grid.visited)
                    ]

# Remove current cell from remaining path
                    if current_path:
                        current_path = current_path[1:]

                    dashboard_state["mapping"]["path"] = [
                        {"x": x, "y": y}
                        for x, y in current_path
                    ]

                    print(
                        f"[NAV] Walk -> "
                        f"({old_x}, {old_y}) "
                        f"to "
                        f"({grid.pos_x}, {grid.pos_y})"
                    )

                print(
                    f"[POSE] "
                    f"X={grid.pos_x}, "
                    f"Y={grid.pos_y}, "
                    f"Heading={grid.heading:.0f}°"
                )

                finished = True

            time.sleep(0.05)

        # Move to next instruction
        step_idx += 1

    # ==========================================================
    # VERIFY DESTINATION
    # ==========================================================

    current_pose = (
        grid.pos_x,
        grid.pos_y
    )

    goal_pose = (
        goal_x,
        goal_y
    )

    print(
        f"[NAV] Final pose = {current_pose} "
        f"Goal = {goal_pose} "
        f"Heading={grid.heading}"
    )

    # ==========================================================
    # DESTINATION CONFIRMED
    # ==========================================================

    if current_pose == goal_pose:

        speak("Destination reached.")
        current_instruction = "Destination reached."
        remaining_steps = 0
        remaining_distance = 0
        navigation_progress = 100
        current_path = []

        print(
            "[NAV] Destination confirmed."
        )

        success = True

    # ==========================================================
    # DESTINATION NOT CONFIRMED
    # ==========================================================

    else:

        print(
            f"[NAV] Destination NOT confirmed. "
            f"Current={current_pose}, "
            f"Goal={goal_pose}"
        )

        speak(
            "Route completed. "
            "Destination not confirmed."
        )

        success = False

    # ==========================================================
    # CONFIDENCE CALCULATION
    # ==========================================================

    confidence = _predict_confidence(
        errors,
        walk_steps,
        complexity,
        dynamic_obstacles
    )

    # ==========================================================
    # LOG NAVIGATION SESSION
    # ==========================================================

    confidence = log_session(
        start_time=start_time,
        destination=destination_name,
        steps=walk_steps,
        errors=errors,
        success=success,
        route_complexity=complexity,
        route_steps=walk_steps,
        turns=turns,
        dynamic_obstacles=dynamic_obstacles,
        level=level_for_confidence(confidence),
        confidence=confidence
    )

    # ==========================================================
    # FINAL CONFIDENCE ANNOUNCEMENT
    # ==========================================================

    speak(
        f"Confidence score "
        f"{int(confidence * 100)} percent."
    )

    print(
        f"[NAV] Navigation complete. "
        f"Success={success}, "
        f"Confidence={confidence:.2f}"
    )
# -------------------------------------------------------
# Destination Selection
# -------------------------------------------------------

def destination_selection():
    """
    Discovery Mode destination workflow:
    1. Ask source location.
    2. Ask destination.
    """

    # -------- Source Selection --------
    speak("Choose source location.")

    current_location = ask_current_location(speak, grid)

    if current_location is None:
        speak("No source selected.")
        return None, None

    # -------- Destination Selection --------
    speak("Choose destination.")

    destination = ask_destination(speak, current_location)

    if destination is None:
        speak("No destination selected.")
        return None, None

    speak(f"Navigating from {current_location} to {destination}.")
    return current_location, destination
# -------------------------------------------------------
# Startup
# -------------------------------------------------------

# ==========================================================
# STARTUP
# ==========================================================

def startup():
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)

    # Database always initializes
    init_db()

    if PI_MODE:
        # Raspberry Pi hardware
        setup_sensors()
        setup_buttons()

        speak("Echo Map started.")
        speak("Discovery mode ready.")
    else:
        # Mac / Laptop development
        print("🟡 EchoMap Development Mode")
        print("Skipping GPIO, buttons and speaker initialization.")


# ==========================================================
# MAIN LOOP
# ==========================================================

def button_pressed(button_pin, press_type):
    """
    Returns True only once for each physical button press.
    Prevents repeated triggers while the button is held.
    """
    global last_press_time

    if not PI_MODE:
        return False

    press = check_btn(button_pin)

    if press != press_type:
        return False

    now = time.time()

    if now - last_press_time[button_pin] < DEBOUNCE_TIME:
        return False

    last_press_time[button_pin] = now
    return True


def main():
    global mode

    startup()

    try:
        while True:
            update_dashboard()
            # Read buttons only on Raspberry Pi
            if PI_MODE:
                press1 = check_btn(BTN_TAG)
                press2 = check_btn(BTN_CYCLE)
                press3=check_btn(BTN_NAVIGATE)
            else:
                press1 = None
                press2 = None
            if press3=="long":
                shutdown(speak)
                return

            # ==========================================
            # Button 1 Long Press → Toggle Modes
            # ==========================================
            if press1 == "long":

                if PI_MODE:
                    beep(2)

                if mode == DISCOVERY:
                    speak("Mapping mode activated.")
                    discovery_controller.reset()
                    mode = MAPPING
                else:
                    speak("Discovery mode activated.")
                    discovery_controller.reset()
                    mode = DISCOVERY

                time.sleep(0.3)
                continue

            # ==========================================
            # DISCOVERY MODE
            # ==========================================
            if mode == DISCOVERY:

                # Button 2 → Destination selection
                if press2 == "short":

                    print("[BUTTON] Button 2 detected.")

                    if PI_MODE:
                        beep()

                    mode = DESTINATION_SELECT
                    continue

                discovery_loop()

            # ==========================================
            # DESTINATION SELECTION MODE
            # ==========================================
            elif mode == DESTINATION_SELECT:

                source, destination = destination_selection()

                if source is not None and destination is not None:

                    discovery_controller.current_location = source
                    discovery_controller.destination = destination

                    print(
                        f"[ROUTE] Source: {source} Destination: {destination}"
                    )

                    speak(f"Route ready from {source} to {destination}.")

                    navigation_loop(source, destination)

                discovery_controller.reset()
                speak("Discovery mode.")
                mode = DISCOVERY

            # ==========================================
            # MAPPING MODE
            # ==========================================
            elif mode == MAPPING:

                mapping_loop()

                # Save Landmark
                if press1 == "short":

                    if PI_MODE:
                        beep()

                    register_landmark(speak, grid)
                    time.sleep(0.25)

                # Voice Turn Command
                elif press2 == "short":

                    if PI_MODE:
                        beep()

                    speak("Say command.")

                    command = listen_for_mapping_command(timeout=5)

                    if command:
                        response = grid.apply_mapping_command(command)
                        speak(response)
                    else:
                        speak("Turn left or turn right only.")

                    time.sleep(0.25)

            time.sleep(0.05)

    except KeyboardInterrupt:
        print("EchoMap stopped.")

    finally:
        GPIO.cleanup()


# ==========================================================
# RUN MAIN ONLY ON RASPBERRY PI
# ==========================================================

if __name__ == "__main__" and PI_MODE:
    main()


# ==========================================================
# DASHBOARD PREVIEW DATA (Mac Development)
# ==========================================================

dashboard_state = {
    "connected": True,

    "system": {
        "battery": 96,
        "cpuTemp": 42,
        "ramUsage": 34,
        "confidence": 0.91,
        "level": 4,
    },

    "sensors": {
        "left": 48,
        "center": 31,
        "right": 57,
    },

    "navigation": {
        "instruction": "Walk Forward 3 Steps",
        "heading": "NORTH",
        "remainingDistance": 6.5,
        "remainingSteps": 3,
    },

    "mapping": {
        "currentLocation": {
            "x": 10,
            "y": 10,
        },

        "destination": {
            "name": "Computer Lab",
            "x": 18,
            "y": 15,
        },

        "mapped_percentage": 62,
        "exploredCells": 182,

        "visited": [],
        "obstacles": [],
        "path": [],
    },

    "landmarks": [],

    "analytics": {
        "navigationSessions": 14,
        "successfulSessions": 12,
        "totalLandmarks": 9,
        "totalSteps": 248,
        "averageConfidence": 0.91,
    },
}


# ==========================================================
# DASHBOARD REST API
# ==========================================================
# ==========================================================
# AUTH APIs
# ==========================================================

@app.post("/api/auth/login")
def login(request: LoginRequest):

    user = users.get(request.email)

    if user is None or user["password"] != request.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "success": True,
        "user": {
            "name": user["name"],
            "email": request.email,
        }
    }


@app.post("/api/auth/register")
def register(request: RegisterRequest):

    if request.email in users:
        raise HTTPException(status_code=400, detail="User already exists")

    users[request.email] = {
        "name": request.name,
        "password": request.password,
    }

    return {
        "success": True,
        "message": "Registration successful",
        "user": {
            "name": request.name,
            "email": request.email,
        }
    }


@app.get("/api/auth/me")
def me():
    return {
        "authenticated": True,
        "user": {
            "name": "Amrutha",
            "email": "amrutha@echomap.com",
        }
    }
@app.get("/api/dashboard")
def get_dashboard():
    update_dashboard()
    return JSONResponse(content=dashboard_state)


# ==========================================================
# DASHBOARD WEBSOCKET
# ==========================================================

connected_clients = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            update_dashboard()              # <-- refresh dashboard_state

            await websocket.send_json(dashboard_state)

            await asyncio.sleep(1)

    except WebSocketDisconnect:
        print("Dashboard disconnected")