## 2024-05-23 - Chat Interface Accessibility

**Learning:** Chat interfaces require `aria-live` regions to announce new incoming messages to screen readers. Standard scroll areas don't announce content changes by default.
**Action:** Always wrap the message list in a container with `aria-live="polite"` and ensure `aria-atomic="false"` so that only new additions are read, not the whole history. Also, decorative icons in chat bubbles (like avatars) should be hidden with `aria-hidden="true"` to reduce noise.

## 2025-02-17 - Button Icon Accessibility

**Learning:** Icon-only buttons (like those in tables for actions) are invisible to screen readers without explicit labels.
**Action:** Always add `aria-label` to buttons that only contain an icon. This ensures users using assistive technologies understand the button's purpose (e.g., "Edit party", "Delete item").
