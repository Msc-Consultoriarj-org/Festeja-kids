## 2024-05-23 - Chat Interface Accessibility

**Learning:** Chat interfaces require `aria-live` regions to announce new incoming messages to screen readers. Standard scroll areas don't announce content changes by default.
**Action:** Always wrap the message list in a container with `aria-live="polite"` and ensure `aria-atomic="false"` so that only new additions are read, not the whole history. Also, decorative icons in chat bubbles (like avatars) should be hidden with `aria-hidden="true"` to reduce noise.

## 2024-05-23 - Accessible Toggle Sections

**Learning:** Buttons that toggle content visibility need `aria-expanded` and `aria-controls` to inform screen reader users of the state change and relationship. The toggled content should also be a marked region.
**Action:** Add `aria-expanded={isOpen}` and `aria-controls="section-id"` to the toggle button. Add `id="section-id"`, `role="region"`, and `aria-label` to the container being toggled.

## 2025-02-17 - Accessible Skeleton Loading

**Learning:** Skeleton loaders improve perceived performance but are invisible to screen readers by default.
**Action:** Always add `role="status"` and a descriptive `aria-label` (e.g., "Loading dashboard data") to the skeleton container. Include a hidden `<span>` with the same text for maximum compatibility.
