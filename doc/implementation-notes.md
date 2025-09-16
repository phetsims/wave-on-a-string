# Wave on a String – Implementation Notes

Audience: engineers familiar with PhET libraries (axon, dot, kite, scenery, scenery‑phet, joist, sun, tandem). For physics, equations, and boundary behavior, see doc/model.md.

## Repository Layout

- `WOASConstants.ts`: Numeric/view constants and shared styles.
- `model/WOASModel.ts`: Core state machine and stepping/interpolation.
- `model/WOASMode.ts`, `model/WOASEndType.ts`: Enums for drive mode and right‑end type.
- `view/WOASScreen.ts`, `view/WOASScreenView.ts`: Screen wiring and composition.
- `view/*`: String/endpoint nodes, controls, radio groups, keyboard help, colors.

## Architecture Overview

- Model (WOASModel):
  - Maintains three string buffers (`yLast`, `yNow`, `yNext`) and an interpolated `yDraw` used by the view.
  - Advances with fixed model ticks and per‑frame interpolation; cadence scales with tension/time speed.
  - Left drive is set by mode (manual, oscillator, pulse). Right end behavior depends on end type (fixed/loose/no end). Details are in model.md.
  - Exposes properties for controls, tools, visibility, and timing; emits `yNowChangedEmitter` for view updates.
  - PhET‑iO: serializes core arrays and selected scalars; most properties are tandem‑instrumented.

- View (WOASScreenView):
  - Composes play area (`StringNode`, `StartNode`, `EndNode`, `ReferenceLine`) and controls (time controls, bottom panel, restart/reset, radio groups).
  - Uses a local frame emitter and dirty flags to update only when model state changes.
  - Performance practices: buffer reuse, layer splitting, rasterized images, minimal recomputation in frame loop.

- Controls & A11y:
  - Bottom panel provides tension/damping and mode‑specific amplitude/frequency or pulse width.
  - Radio groups select wave mode and end type.
  - Keyboard drags for wrench/rulers/reference line; headings and paragraphs describe play‑area state; restart has a global hotkey.

- Instrumentation:
  - Tandem coverage across model/view with `phetioFeatured` and `phetioReadOnly` where appropriate.
  - Model I/O uses `Float64ArrayIO.applyState` to avoid temporary arrays.