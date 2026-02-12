# Background Image Instructions

## How to Add Your Background Image

1. **Save your image** (the one with "EMPLOYEE MATERIAL INVENTORY MANAGEMENT SYSTEM" and the futuristic warehouse schematic) as:
   - **Filename:** `background.png`
   - **Location:** `frontend/public/assets/background.png`

2. **Image Specifications:**
   - Recommended size: 1920x1080 pixels or higher
   - Format: PNG (for transparency support) or JPG
   - The current image path in the code is: `/assets/background.png`

3. **Current Setup:**
   - The Layout component is already configured to display this image
   - It will appear as a full-screen background with a subtle dark overlay
   - The overlay opacity is set to 40% to ensure text readability

## Alternative: Use a Different Image Path

If you want to use a different location or filename, update the `backgroundImage` in:
`frontend/src/components/Layout.jsx` (around line 49)

```javascript
backgroundImage: 'url(/assets/background.png)',
```

Change this to your preferred path.
