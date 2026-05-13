# Contributing to KSG: Kid-Safe Games

Thank you for your interest in contributing! We're excited to grow our game library with new, safe, and fun experiences.

## 📋 Before You Start

- Please read our [README.md](README.md) to understand the project vision
- Ensure your contribution aligns with our **Safety First** principle
- All games must be free, ad-free, and tracking-free
- Be respectful and constructive in all discussions

## 🎮 Adding a New Game

### Step 1: Create a Game Folder
Create a new directory under `/games/`:

```bash
mkdir -p games/your-game-name
```

### Step 2: Build Your Game
Create `games/your-game-name/index.html` with your game code.

**Requirements:**
- ✅ Self-contained HTML file (or separate CSS/JS files in the same folder)
- ✅ Includes a "Back to Catalog" button linking to `../../index.html`
- ✅ Fully functional with no external CDN dependencies (optional but preferred)
- ✅ Works on desktop, tablet, and mobile devices
- ✅ Under 100KB total file size (games should load instantly)

**Example back button:**
```html
<a href="../../index.html" class="back-btn">← Back to Catalog</a>
```

### Step 3: Document Your Game
Create `games/your-game-name/README.md` with:

```markdown
# Your Game Title

Brief description of what your game is about.

## 🎮 Gameplay
- How to play
- Objective
- Controls

## 🛡️ Safety Features
- List any accessibility features
- Confirm: No ads, tracking, or paywalls

## 📝 License
Link to license (suggest MIT for consistency)
```

### Step 4: Update the Catalog
In `index.html`, find the `games` array and add your game:

```javascript
const games = [
  // ... existing games ...
  {
    id: "your-game-id",           // kebab-case identifier
    title: "Your Game Title",      // Full title
    subtitle: "Tagline/Category",  // Subtitle (optional)
    category: "Adventure",         // Category
    emoji: "🎮",                   // Emoji representing the game
    description: "A short description of what players can expect...",
    tags: ["Adventure", "Tag2"],   // Max 3 tags
    url: "games/your-game-name/index.html"
  }
];
```

### Step 5: Submit a Pull Request

1. **Fork** this repository
2. **Create a branch**: `git checkout -b add-your-game-name`
3. **Commit your changes**: `git commit -m "Add Your Game Title"`
4. **Push to your fork**: `git push origin add-your-game-name`
5. **Open a Pull Request** with a clear description:
   - Game title and brief description
   - What makes it unique/fun
   - Any notes about gameplay or controls
   - Confirmation it meets all safety guidelines

## 📋 Game Submission Checklist

Before submitting your PR, ensure:

- [ ] Game is fully functional
- [ ] No external ads or tracking code
- [ ] "Back to Catalog" button works
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] All controls are clearly explained
- [ ] Keyboard support (if applicable)
- [ ] `README.md` is complete and helpful
- [ ] Game is added to `index.html` catalog array
- [ ] File size is under 100KB total
- [ ] No console errors when playing
- [ ] All content is age-appropriate

## 🛠️ Reporting Issues & Improvements

### Found a Bug?
1. Check if it's already reported in [Issues](https://github.com/CaptainLWS/KSG_Kid-Safe-Games/issues)
2. Open a new Issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs. actual behavior
   - Device/browser details

### Suggesting Features?
1. Open an Issue with your idea
2. Describe the benefit for players
3. Be open to discussion!

### Improving Existing Games?
- Submit a PR with your improvements
- Explain why the change enhances the game
- Ensure changes don't break gameplay

## 💡 Game Ideas & Inspiration

Here are some game types we'd love to see:

- **Puzzle Games** (sudoku, match-3, word games)
- **Adventure Games** (exploration, story-driven)
- **Educational Games** (math, language, science)
- **Platformers** (jumping, collecting)
- **Card Games** (memory, turn-based strategy)
- **Casual Games** (clicker, incremental, sandbox)

## 📚 Resources & Templates

Want a starter template? Here's a minimal example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Game Title</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: #1a1a1a;
      color: #fff;
      margin: 0;
      padding: 20px;
    }
    .back-btn {
      display: inline-block;
      padding: 10px 20px;
      background: #4cff8a;
      color: #1a1a1a;
      text-decoration: none;
      border-radius: 5px;
      margin-bottom: 20px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <a href="../../index.html" class="back-btn">← Back to Catalog</a>
  <h1>Your Game Title</h1>
  <!-- Your game content here -->
</body>
</html>
```

## 🎨 Design Tips

- Use high-contrast colors for accessibility
- Keep UI clean and intuitive
- Test on multiple devices
- Prefer dark themes (easier on eyes)
- Make text large and readable
- Keep animations smooth and purposeful

## ❓ Questions?

- 💬 Start a [Discussion](https://github.com/CaptainLWS/KSG_Kid-Safe-Games/discussions)
- 📧 Check existing Issues for answers
- 🤝 Ask in your PR description

## 🙏 Thank You!

Every contribution makes KSG better for kids everywhere. We appreciate your effort to keep gaming safe, fun, and free!

---

**Let's build the safest game catalog on the internet together! 🚀**
