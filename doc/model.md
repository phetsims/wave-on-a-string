# Wave on a String - Model Description

This document provides a high-level description of the model used in PhET's Wave on a String simulation. It focuses on the conceptual behavior, screens, and key equations/assumptions.

## Overview

The sim models transverse waves on a 1D string discretized into a sequence of beads. Users can drive the left end by hand (wrench), with a sinusoidal oscillator, or with a finite-width pulse. The right end can be configured as a fixed (clamped) end, a loose (free) end, or an open "no end" that approximates an absorbing boundary. Tension and damping affect wave speed and decay.

Screens expose: creating waves (manual, oscillator, pulse), observing reflections at different ends, and how 
tension/damping change propagation, interference, and standing waves.

## Key Concepts and Controls

- Left drive:
  - Wrench: manually set the left bead’s vertical displacement.
  - Oscillator: sinusoidal displacement at the left end with adjustable frequency and amplitude.
  - Pulse: finite‑duration triangular pulse applied at the left end with adjustable width and amplitude.
- Right end types:
  - Fixed end (clamped): displacement constrained to zero at the end; reflections invert.
  - Loose end (free): zero slope at the end (free tip); reflections do not invert.
  - No end (open): approximates an absorbing boundary; waves largely transmit off the string.
- Parameters: tension (affects effective wave speed), damping (amplitude decay), frequency (oscillator), pulse width, amplitude.
- Tools: rulers, reference line, stopwatch; a "string still" indicator turns on when the string returns to an effectively straight line.

## Terminology, Units, and Symbols

- y[i]: vertical displacement of bead i (model units).
- i = 0...N-1: bead index from left (0) to right (N-1).
- "Amplitude": centimeters at the left drive, mapped to model units internally.
- Frequency: hertz; Pulse width: seconds.
- Tension and damping are unitless relative controls that scale speed / decay within the model.

## Model and Equations (Discrete)

The string is modeled as a 1D chain of N beads with uniform spacing delta x and fixed time step delta t. At interior points (i = 1...N-2) we use a standard two-step explicit central-difference scheme for the damped 1D wave equation

  y_tt = v^2*y_xx - 2*gamma*y_t

Discretization overview:
- State buffers: yLast[i] = y_i^(n-1), yNow[i] = y_i^n, yNext[i] = y_i^(n+1).
- Courant number: alpha = v*delta t/delta x. For stability (CFL), alpha <= 1; this model chooses alpha = 1.
- Damping scale: beta ~= (b*delta t)/2, where b is a UI-controlled damping factor; larger beta increases attenuation.
- Interior update:
  - yNext[i] = a*((beta - 1)*yLast[i] + c*yNow[i] + alpha^2*(yNow[i-1] + yNow[i+1]))
  - with a = 1/(beta+1), c = 2*(1 - alpha^2)

Notes:
- With alpha = 1, c = 0 and the update reduces to a damped average of neighbors plus a contribution from the previous step.
- Damping is effectively proportional to velocity; increasing the UI damping increases beta, reducing amplitude step-by-step.
- Rendering interpolation: Between fixed physics updates, yDraw blends between yLast and yNow to provide smooth motion.

### Driving the Left End (i = 0)

- Wrench (manual): yNow[0] is set by the user; between model steps it is interpolated for smooth motion.
- Oscillator: yNow[0] = A*sin(2*pi*f*t + phi) with adjustable frequency (f) and amplitude (A).
- Pulse: a single triangular pulse at the left end with adjustable width; the drive rises then falls back to zero over the chosen duration.

### Right End Boundary Conditions (i = N−1)

- Fixed end (clamped, Dirichlet): y[N-1] = 0 each step. This enforces a displacement node at the boundary; reflections invert phase.
- Loose end (free, Neumann): partial y / partial x = 0 at the boundary. Discretely: y[N-1] = y[N-2], enforcing zero slope; reflections do not invert.
- No end (open, absorbing approximation): Approximates a one-way (Sommerfeld) boundary: partial y / partial t + v*partial y / partial x = 0 so that outgoing waves leave with minimal reflection. A simple first-order discrete form sets y[N-1]^n ~= y[N-2]^(n-1), effectively "shifting" the interior value forward one time level. This greatly reduces but does not perfectly eliminate reflections.

## Approximations and Assumptions

- 1D transverse motion only (no longitudinal motion, no gravity sag).
- Uniform spacing and mass per bead; constant “effective” wave speed for given tension.
- Simple linear damping (proportional to velocity) applied uniformly.
- Fixed time step integration with per‑frame interpolation for smooth rendering.
- The left end is a prescribed displacement (Dirichlet) boundary y_0(t) set by the user mode (manual, oscillator, pulse).
- The "no end" uses a first-order absorbing boundary approximation; small residual reflections depend on alpha and damping.

## Behavior of Parameters

- Tension: increases effective propagation speed. Internally this reduces the minimum interval between physics steps, leading to faster wave travel times at higher tension.
- Damping: increases amplitude decay rate and reduces the sharpness of reflections/standing waves.
- Frequency/Amplitude (oscillator): set the sinusoidal drive at the left end.
- Pulse width/Amplitude: set the duration and height of the finite pulse introduced at the left end.

## Observations and Learning Connections

- Reflection phase depends on boundary condition (inverting at fixed end, non‑inverting at free end).
- Standing waves emerge when the drive frequency matches resonant modes under fixed/loose ends.
- Increased tension yields higher wave speed (shorter travel/return times for pulses); increased damping reduces ringing.
