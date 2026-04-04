```markdown
# Design System Specification: JoByte Editorial Engine

## 1. Overview & Creative North Star
**Creative North Star: The Precision Architect**

This design system moves away from the "generic SaaS" aesthetic into a realm of high-end, editorial authority. We are not just building a job portal; we are building a career headquarters. The visual language is inspired by architectural blueprints and premium financial journals—where white space is as functional as the content itself. 

By leveraging a strict dot-grid texture and deep-black structural panels, we create an environment of "High-Contrast Professionalism." We break the template through **Intentional Asymmetry**: large typography offset by deep-black utility panels creates a visual rhythm that feels custom-built and MNC-grade.

---

## 2. Colors & Surface Logic

The palette is rooted in a binary tension between pure whites and deep blacks, ignited by a "Striking Red" that commands action.

### The Palette (Material Logic)
- **Primary (The Pulse):** `#B7131A` (Primary) | `#E53935` (Accent Brand Red)
- **Neutral (The Structure):** `#0D0D0D` (Deep Black Panels) | `#191C1D` (On-Surface)
- **Background:** `#FFFFFF` (Main Canvas) | `#F8F9FA` (Surface)

### The "No-Line" Rule
While the original brief mentions 1px borders, as a signature experience, we must use them sparingly. **Boundaries should primarily be defined by the Dot-Grid Texture or Background Shifts.** 
- Do not use a border to separate a sidebar from a main feed. Instead, use a color shift from `surface-container-lowest` to `surface-container-low`.
- Reserve the `outline-variant` (`#E4BEB9`) at 20% opacity for "Ghost Borders" only when high-density data requires containment.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
1.  **Level 0 (Canvas):** Pure `#FFFFFF` with the 24px dot-grid texture (`radial-gradient(circle, #D1D5DB 1px, transparent 1px)`).
2.  **Level 1 (Panels):** Deep Black (`#0D0D0D`) for sidebars or ATS dashboards to create an "anchor."
3.  **Level 2 (Objects):** Use `surface-container-lowest` (#FFFFFF) for cards, floating on the dot-grid canvas to create a subtle lift.

---

## 3. Typography: The Inter Editorial
We use **Inter** exclusively. It is a typeface of utility and modernism. To achieve a premium feel, we use extreme scale—very large displays paired with tight, high-contrast labels.

- **Display (The Statement):** `display-lg` (3.5rem / 700 weight). Use for hero headlines. Track at -0.02em for a "tight" editorial feel.
- **Headlines (The Anchor):** `headline-sm` (1.5rem / 600 weight). Use for section titles.
- **Body (The Data):** `body-md` (0.875rem / 400 weight). Optimized for readability in long-form job descriptions.
- **Labels (The Precision):** `label-md` (0.75rem / 700 weight). All-caps for status indicators or metadata.

---

## 4. Elevation & Depth: Tonal Layering
In this system, "Elevation" is not about shadows; it’s about **Tonal Intent.**

- **The Layering Principle:** Instead of traditional shadows, stack your surfaces. A `#FFFFFF` card sits on a `#F8F9FA` background. The contrast is the elevation.
- **Ambient Shadows:** For floating elements (like Modals), use a "Whisper Shadow": `0px 12px 32px rgba(13, 13, 13, 0.04)`. It should feel like a natural light source, not a digital effect.
- **Texture as Depth:** The 24px dot-grid acts as our "ground floor." Anything without the grid is perceived as being on a higher, more focused plane.

---

## 5. Components

### The "Deep Black" ATS Panels
For high-focus areas (Candidate Profiles, Applicant Tracking), use the `#0D0D0D` color for the container. Use `on-primary-fixed` (white) for typography within these zones to create a "Command Center" feel.

### Buttons
- **Primary:** Background: `#B7131A`; Text: `#FFFFFF`; Radius: `8px`. No gradients. Flat, bold, and authoritative.
- **Secondary:** Background: `#0D0D0D`; Text: `#FFFFFF`; Radius: `8px`.
- **Tertiary (Ghost):** Text: `#B7131A`; No background. 1px ghost border at 20% opacity on hover.

### Inputs & Fields
- **Default State:** `8px` radius, `1px` border using `outline-variant` at 40%.
- **Active/Focus State:** Border changes to `#0D0D0D` (Deep Black) with a `2px` stroke. This "heaviness" signals focus better than a color change.

### The "JoByte" Card
Cards must not use divider lines. Use `1.5rem` (xl) spacing between the "Job Title" and the "Salary Label." If separation is needed, use a subtle background shift to `surface-container-high`.

### Additional Component: The "Status Dot"
In an ATS, status is everything. Use the **Striking Red** (`#E53935`) for urgent/new applicants, and `secondary` (`#5F5E5E`) for archived. The dot should be a 6px perfect circle.

---

## 6. Do’s and Don’ts

### Do:
- **Embrace White Space:** If a section feels crowded, double the padding. This system relies on "Airy" layouts.
- **Use the Grid:** Align every element to the 24px dot-grid intersections.
- **Nesting Surfaces:** Use `#F3F4F5` (Surface-low) for background sections to make `#FFFFFF` cards pop.

### Don’t:
- **No Glassmorphism:** Never use background blurs. This system is about "Solid Materiality."
- **No Rounded Corners > 8px:** Except for pill-shaped chips, stick to the `0.5rem` (8px) rule to maintain a professional, MNC-grade rigidity.
- **No Purple/Indigo:** These are strictly forbidden. If you need a "success" state, use a neutral dark green or stick to the brand's Deep Black/Red hierarchy.
- **No 100% Opaque Borders:** Avoid harsh black lines for containment. Use the "Ghost Border" fallback or tonal shifts.