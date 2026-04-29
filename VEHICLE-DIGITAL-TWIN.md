<img width="1043" height="925" alt="image" src="https://github.com/user-attachments/assets/79284fb2-3e84-4f33-ab54-f88f90257966" />

The vehicle's Digital Health Twin — a living model that tracks the overall condition of this vehicle over time. It is built automatically from every diagnostic session, OBD2 scan, inspection report, and comprehensive analysis performed on this vehicle.

VCI (Vehicle Condition Index)
A single 0–100 score representing the vehicle's overall health right now. It's computed by weighing all subsystem scores below.

85+ Excellent
65–84 Healthy
40–64 Watch
<40 Poor
Trajectory
Shows whether the vehicle's health is improving, stable, or degrading compared to previous sessions. A degrading trajectory means recent data is worse than the historical baseline.

Stress Areas (PFRE)
The Probabilistic Fault Ranking Engine uses Bayesian analysis to identify which vehicle domain (engine, fuel, electrical, etc.) is most likely under stress. The percentages show the probability each domain is the primary source of issues — higher means the system has more evidence pointing there.

Subsystem Scores
Each bar shows the health of a specific vehicle subsystem on a 0–100 scale. These are derived from OBD2 sensor readings, DTC codes, analysis results, and inspection findings. Low scores highlight where to focus diagnosis.

Mechanical — engine internals, compression, vibration
Combustion — misfire, ignition quality, fuel burn
Fuel System — fuel trims, injectors, pressure
Airflow — MAF, MAP, intake, throttle response
Emissions — O2 sensors, catalytic converter, EGR
Electrical — battery voltage, charging stability
Thermal — coolant temp, operating temperature range
Drivability — smooth operation, load handling, idle quality
How it evolves
Every time you run a recorded OBD2 session, complete an inspection, or generate a diagnostic report, the system fuses the new data into this model. Older data naturally decays over time so the scores always reflect the vehicle's current condition. More sessions = higher confidence and more accurate scores.

Confidence
Indicates how much data the system has to support its scores. Low confidence means the vehicle is new to the system — run more sessions to build a reliable picture. High confidence means the readings are well-substantiated across multiple data points
