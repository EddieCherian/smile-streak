⸻

Smile Streak

Smile Streak is a habit-building web application designed to help users maintain a consistent daily dental routine while lowering friction to real-world dental care. The project combines behavioral design, lightweight intelligence, and location-based discovery into a single, focused experience.

Rather than overwhelming users with features, Smile Streak emphasizes consistency, recovery, and informed decision-making.

This project grew out of my own difficulty maintaining routines after missed days, as well as my frustration with how difficult it can be to evaluate dental care options responsibly.

⸻

Problem Statement

Many people understand the importance of daily dental care but struggle with consistency. Missed days often lead to discouragement, broken streaks, and eventual abandonment. At the same time, finding a dentist that aligns with one’s insurance, location, and trust expectations is unnecessarily difficult and fragmented.

Smile Streak addresses both problems by:
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
•	Responses are stored locally to promote self-awareness  
•	Reflections are intentionally lightweight to avoid friction  
•	A prompt system that encourages users to articulate why a day was missed, reinforcing metacognition without adding cognitive or emotional overhead  

Nearby Dentist Discovery

•	Finds dentists near the user using location data  
•	Displays Yelp ratings when available  
•	Uses probabilistic inference to suggest likely accepted insurance plans  
•	Includes a fallback data source to ensure reliability across regions and API limitations  

⸻

Uncertainty-Aware Insights

Smile Streak deliberately avoids drawing conclusions from insufficient data.
•	Insights are only surfaced after a minimum data threshold is met
•	When data is limited, the app communicates uncertainty rather than making claims
•	Patterns such as commonly missed tasks or days are withheld until statistically meaningful
•	Confidence messaging is shown alongside insights to prevent overinterpretation

This approach prioritizes responsible interpretation over premature analytics.

⸻

Longitudinal Insight Synthesis

In addition to individual metrics, Smile Streak generates a high-level summary insight when sufficient data is available.

Rather than listing isolated statistics, the app synthesizes patterns across time to produce a concise, human-readable overview of behavioral trends.
•	Summary insights are generated only when minimum reliability thresholds are met
•	The synthesis combines task-level and temporal patterns (e.g., routines and days)
•	Language is intentionally descriptive, not prescriptive
•	When data is limited, the overview is withheld or accompanied by confidence messaging

This synthesis layer is designed to mirror how a human analyst would responsibly summarize small behavioral datasets, prioritizing clarity and caution over exhaustiveness.

⸻

Design Decisions

Probabilistic Insurance Matching

Insurance acceptance data is fragmented and often inaccurate. Instead of claiming certainty, Smile Streak infers likely acceptance based on clinic characteristics and clearly communicates uncertainty to the user.

Recovery Days Are Limited

Unlimited forgiveness undermines habit formation. Limiting recovery to once per week balances compassion with accountability.

Reflection Over Punishment

Missed days trigger reflection instead of streak loss, shifting the focus from guilt to learning.

Yelp + OpenStreetMap Fallback

Yelp provides ratings and social proof, while OpenStreetMap ensures the app continues functioning even when API limits are reached.

⸻

Design Rationale & Interpretability

Throughout development, design decisions were guided not only by functionality, but by how users interpret feedback.

Rather than maximizing metrics or visualizing every available data point, Smile Streak prioritizes:
•	Trends over single-day judgments
•	Explanations over raw scores
•	Transparency over false precision

This framing is intended to reduce anxiety-driven disengagement and promote reflective habit formation rather than performance pressure.

⸻

Limitations & Open Questions

Smile Streak intentionally acknowledges its constraints:
•	Insights are derived from small, self-reported datasets
•	Reflection keyword analysis is coarse and non-diagnostic
•	Insurance inference is probabilistic and may vary by region
•	Habit data reflects consistency, not clinical outcomes

These limitations highlight opportunities for future refinement and emphasize that behavioral tools must be interpreted cautiously.

⸻

Ethical Boundaries & Medical Disclaimer

Smile Streak is designed for education and habit awareness only.
It does not provide medical diagnosis or treatment recommendations.

All educational content is based on published dental research and public health guidance. Users are encouraged to consult licensed dental professionals for personalized advice or concerns.

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

Building Smile Streak highlighted how much behavior change depends on design decisions rather than raw functionality. Small choices — such as limiting recovery, avoiding false certainty, and reducing friction — have a disproportionate impact on user retention.

The project also revealed the challenges of working with real-world healthcare data, where imperfect information must be handled responsibly and transparently.

⸻

Future Improvements

•	Aggregated reflection insights to surface long-term patterns  
•	Optional account system for cross-device synchronization  
•	Accessibility and localization improvements  
•	Expanded provider data sources  

⸻

Status

Actively maintained and open to iteration.

⸻
