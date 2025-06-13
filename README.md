# RPE Calculator

A simple, static web app that helps you estimate your one-rep max (1RM) and plan your next set using the RPE (Rate of Perceived Exertion) method.

## How It Works

1. **Enter Your Last Set**:
   - Weight lifted
   - Reps performed (1–12)
   - RPE (4.0–10.0)
2. **Calculate Your 1RM**:
   - The app looks up the percentage from the RPE chart and computes:
     ```text
     estimated 1RM = weight / (percentage)
     ```
3. **View the RPE Chart**:
   - Once calculated, an interactive table shows every RPE value’s %1RM and suggested load.
   - Use the rep buttons (1–12) to switch the chart for different rep ranges.
4. **Plan Your Back-off Set**:
   - On the Backoff page, enter your last set details and desired target reps/RPE.
   - The app estimates your 1RM again and multiplies by the target %1RM to give your next back-off load.


