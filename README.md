Smile Streak

Smile Streak is a habit-building web application designed to help users maintain a consistent daily dental routine while lowering friction to real-world dental care. The project combines behavioral design, lightweight intelligence, and location-based discovery into a single, focused experience.

Rather than overwhelming users with features, Smile Streak emphasizes consistency, recovery, and informed decision-making.

⸻

Problem Statement

Many people understand the importance of daily dental care but struggle with consistency. Missed days often lead to discouragement, broken streaks, and eventual abandonment. At the same time, finding a dentist that aligns with one’s insurance and trust expectations is unnecessarily difficult and fragmented.

Smile Streak addresses both problems:
	•	Helping users build sustainable habits without perfection pressure
	•	Making dental care more approachable through nearby provider discovery and contextual signals

⸻

Core Features

Daily Habit Tracking
	•	Morning brushing, night brushing, and flossing
	•	Built-in timers to encourage proper brushing duration
	•	Visual progress indicators to reinforce completion

Recovery System
	•	Users can recover from a missed day once per week
	•	Prevents streak loss while avoiding abuse
	•	Designed to encourage long-term consistency rather than all-or-nothing behavior

Reflection Intelligence
	•	When a recovery day is triggered, users are asked a brief reflection question
	•	Responses are stored to promote self-awareness
	•	Reflections are intentionally lightweight to avoid friction

Nearby Dentist Discovery
	•	Finds dentists near the user using location data
	•	Displays Yelp ratings when available
	•	Uses probabilistic inference to suggest likely accepted insurance plans
	•	Includes a fallback data source to ensure reliability

⸻

Design Decisions
	•	Probabilistic insurance matching
Insurance acceptance data is fragmented and often inaccurate. Instead of claiming certainty, Smile Streak infers likely acceptance based on clinic type and clearly communicates uncertainty.
	•	Recovery days are limited
Unlimited forgiveness undermines habit formation. Limiting recovery to once per week balances compassion with accountability.
	•	Reflection over punishment
Missed days trigger reflection instead of streak loss, shifting the focus from guilt to learning.
	•	Yelp + OpenStreetMap fallback
Yelp provides ratings and social proof, while OpenStreetMap ensures the app continues functioning if API limits are reached.

⸻

Tech Stack
	•	React
	•	Vite
	•	Tailwind CSS
	•	Yelp Places API
	•	OpenStreetMap / Overpass API
	•	Local storage persistence

⸻

What I Learned

Building Smile Streak highlighted how much behavior change depends on design decisions rather than raw functionality. Small choices — such as limiting recovery, avoiding false certainty, and reducing friction — have a disproportionate impact on whether a user stays engaged.

The project also revealed the challenges of working with real-world healthcare data, where imperfect information must be handled responsibly and transparently.

⸻

Future Improvements
	•	Aggregated reflection insights to surface patterns over time
	•	Optional account system for cross-device sync
	•	Accessibility and localization improvements
	•	Expanded provider data sources

⸻

Status

Actively maintained and open to iteration.
