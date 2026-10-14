---
name: Algorithmic Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#545c72'
  on-tertiary: '#ffffff'
  tertiary-container: '#6c748b'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-code-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  stat-numeric:
    fontFamily: JetBrains Mono
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-dense: 0.5rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system targets software engineers, computer science students, and technical interview candidates who demand a focused, distraction-free environment for algorithmic benchmarking and code refactoring. The interface evokes a sense of intellectual clarity, technical rigor, and measured speed. 

The aesthetic is grounded in a refined, minimalist developer workbench. Rather than relying on gamified flashy graphics or ornamental blur gradients, the visual direction prioritizes crisp structural boundaries, high-density data legibility, and immediate performance feedback. The design leverages crisp white work surfaces layered over subtle warm/neutral off-whites, balanced by precise dark slate typography and vivid emerald/forest green indicators that validate algorithmic correctness, test passes, and runtime efficiency gains.

## Colors

The color palette is calibrated for high contrast, prolonged technical problem-solving sessions, and precise data feedback:

- **Primary (`#059669`) & Secondary (`#10B981`)**: Forest and emerald greens signify successful runs, code optimization thresholds, runtime percentile improvements, and primary action states (e.g., "Run Benchmark", "Submit Solution").
- **Tertiary (`#0F172A`)**: Deep slate serves as the dominant high-contrast anchor for headings, syntax chrome, and active split-pane states.
- **Neutrals**: 
  - Canvas Base: `#FFFFFF` for primary code editors, execution outputs, and content cards.
  - Workspace Canvas: `#F8FAFC` for peripheral sidebars, test case trays, and gutter regions.
  - Structural Borders: `#E2E8F0` and `#E5E7EB` maintain strict partition logic across multi-pane split views.
  - Secondary Text: `#64748B` for meta stats, line counts, and runtime complexity metrics.
- **Semantic Accents**:
  - Failure/Regression: `#DC2626`
  - Warning/Time Limit Exceeded (TLE): `#D97706`
  - Informational/Memory: `#2563EB`

## Typography

Typography balances rapid UI comprehension with dense technical accuracy. 

- **Geist** acts as the primary typeface for all interface chrome, challenge descriptions, problem assertions, and tab navigation. Its neutral geometry and tight tracking keep multi-column desktop layouts compact and scannable without optical fatigue.
- **JetBrains Mono** governs all code blocks, diff inspectors, memory profiles, runtime percentiles, and input/output test case matrices. Tabular figures and distinct character distinctions (e.g., distinguishing `0` vs `O`, `1` vs `l`) are mandatory for zero-ambiguity refactoring evaluations.

## Layout & Spacing

The platform is optimized for desktop split-pane productivity while gracefully reflowing for tablet and review viewports:

- **Desktop Layout**: Fluid multi-pane workspace layout. Standard split arranges problem prompt / test criteria on the left (fixed minimum 380px, fluid up to 45%), code editor / refactor diff viewer in the center/right, and a collapsible bottom execution console (tabs for Testcases, Result, Complexity Analysis). Gaps between split panels rely on strict 1px border dividers with a draggable divider handle.
- **Tablet / Small Desktop (<1024px)**: Transition from three-pane horizontal layout to a tabbed vertical orientation: Problem Specification, Solution Editor, and Benchmark Metrics switch to primary workspace tabs.
- **Rhythm**: Layouts employ a strict 4px/8px incremental rhythm (`space-xs` through `space-xl`). Dense component areas such as AST breakdown views, status indicators, and line-number gutters use `space-xs` and `space-sm` to maintain high spatial efficiency.

## Elevation & Depth

Visual hierarchy is maintained primarily through **low-contrast outlines and tonal surface stratification** rather than heavy blurred drop shadows:

- **Surface Tiers**:
  - `Level 0 (Base Canvas)`: `#F8FAFC` for app shell, toolbar backdrops, and unfocused panel trays.
  - `Level 1 (Card & Pane Workspace)`: `#FFFFFF` with a 1px solid `#E2E8F0` border. Applied to active code editor panes, test scenario containers, and documentation modules.
  - `Level 2 (Dropdowns, Overlays, Command Palette)`: `#FFFFFF` bounded by a 1px solid `#CBD5E1` border with a subtle, non-diffused elevation: `0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Active State Highlights**: Active editor focus is indicated with a crisp, inset or outline ring using `#059669` at 1.5px thickness, never using glowing, feathered diffusion.

## Shapes

The design system uses a strict **Soft (`1`)** roundedness profile. Standard interactive elements (buttons, input fields, test case pills, editor panels) use a crisp `0.25rem` (4px) corner radius. Structural containers, modals, and benchmark stat cards apply `0.5rem` (8px). 

Circular or pill radii are strictly prohibited except for micro numeric badges and test status chips to retain an engineered, IDE-grade character across every surface.

## Components

### Buttons
- **Primary ("Run", "Submit", "Apply Refactor")**: Solid `#059669` background, `#FFFFFF` text, 4px border radius. Hover state transitions to `#047857`. Active state `#065F46`.
- **Secondary / Action Toolbars**: `#FFFFFF` background, 1px solid `#E2E8F0`, `#0F172A` text. Hover state `#F8FAFC` with border `#CBD5E1`.
- **Ghost (Icon Actions, Reset, Copy Code)**: Transparent background, `#64748B` text. Hover background `#F1F5F9`, text `#0F172A`.

### Badges & Status Chips
- **Success / Optimal (Passed, O(n), Fast)**: Background `#ECFDF5`, text `#065F46`, border 1px solid `#A7F3D0`. Uses `JetBrains Mono` at `11px`.
- **Regression / Failed (WA, TLE, O(n²))**: Background `#FEF2F2`, text `#991B1B`, border 1px solid `#FECACA`.
- **Difficulty / Neutral (Medium, Memory, Node Count)**: Background `#F1F5F9`, text `#334155`, border 1px solid `#E2E8F0`.

### Code Editor & Diff Panels
- Background `#FFFFFF` with alternating gutter line numbers in `#94A3B8`.
- In diff view: removed lines render `#FEF2F2` background with `#DC2626` text and a `-` gutter sign; inserted lines render `#ECFDF5` background with `#059669` text and a `+` gutter sign.
- Active line highlight: solid `#F8FAFC` background spanning 100% width.

### Form Inputs & Selectors
- Search inputs, language dropdowns (`Python 3`, `Rust`, `Go`), and custom testcase inputs use `#FFFFFF` background, 1px solid `#E2E8F0`, and text `#0F172A`. Focused state transitions border to `#059669` with an accompanying subtle outline.

### Metric Cards & Benchmarking Panels
- Built on Level 1 white surfaces with 1px border `#E2E8F0`.
- Metric layout: Monospace title in `#64748B` uppercase 11px, large stat figure in `#0F172A` (e.g., `42 ms`, `14.2 MB`), followed by an emerald inline sparkline or comparative benchmark progress bar depicting percentile rank against existing test cohorts.