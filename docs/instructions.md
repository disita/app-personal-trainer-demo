# App: Personal Cycling Trainer (AI Agent)

## Objective
Build a simple app that acts as a personal cycling coach using an AI agent that adapts training based on the user’s condition, availability, and progress.

---

## Scope (MVP)
- Single user (no multi-user support)
- Manual inputs + optional integration with data (Garmin, Strava, etc.)
- Daily training recommendations
- No complex UI required (can be chat-based or a simple dashboard)

---

## Core Functionality
The agent should:
- Generate daily workouts
- Adjust training load based on perceived fatigue
- Consider available time
- Adapt to the user’s goal (e.g. endurance, strength, competition)

---

## User Inputs
- Available time (e.g. 30, 60, 90 min)
- Fatigue level (low, medium, high)
- Goal (e.g. improve FTP, endurance, recovery)
- Recent history (manual or automatic)

---

## Expected Outputs
- Type of workout
- Duration
- Suggested intensity
- General instructions

---

## Agent Logic (simplified)
1. Evaluate current user state
2. Review recent history
3. Avoid overload (no consecutive hard sessions)
4. Adjust volume or intensity
5. Generate the workout of the day

---

## Possible Improvements (non-MVP)
- Automatic integration with Garmin/Strava
- Power / heart rate analysis
- Fatigue prediction
- Weekly plan generation
- Notifications

---

## Notes
- The app must be in Spanish (all user-facing content and outputs)
- Prioritize simplicity over perfect accuracy
- Value comes from consistency and daily adaptation
- Iterate fast instead of overengineering early