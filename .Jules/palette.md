## 2024-05-23 - Chat Interface Accessibility
**Learning:** Chat interfaces require `aria-live` regions to announce new incoming messages to screen readers. Standard scroll areas don't announce content changes by default.
**Action:** Always wrap the message list in a container with `aria-live="polite"` and ensure `aria-atomic="false"` so that only new additions are read, not the whole history. Also, decorative icons in chat bubbles (like avatars) should be hidden with `aria-hidden="true"` to reduce noise.
