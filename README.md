# Pantrii

Pantrii is an evolution of the FlavorMind concept, focusing on intelligent meal planning based on your pantry inventory, flavor preferences, and dietary needs.

## Features

This version builds on the previous MVPs, adding meal planning functionality:

- Weekly calendar view with day selection
- Ability to add custom meals to specific days
- Generate meal suggestions based on pantry items
- Remove meals from the plan

## Core Functionality

### Smart Pantry Management
- Inventory tracking with expiration dates
- Automatic shopping list generation
- Barcode scanning for quick item entry

### Intelligent Meal Planning
- Recipe suggestions based on pantry contents
- Flavor profile analysis for personalized recommendations
- Dietary restriction and preference filtering

### Weekly Meal Calendar
- Interactive calendar with day selection and meal display
- Drag-and-drop meal scheduling
- Nutritional overview of planned meals

### Recipe Discovery
- AI-powered recipe generation
- Community recipe sharing
- Recipe adaptation based on available ingredients

## How to Run

1. Make sure you have Node.js and npm installed
2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npx expo start
```

4. Scan the QR code with Expo Go app (available on iOS App Store or Google Play)

## Troubleshooting

### ActivityIndicator Render Error

If you encounter this error:
```
Exception in HostFunction: Unable to convert string to floating point value: "large"
```

This is due to a compatibility issue with the ActivityIndicator component in newer versions of React Native. The app includes a patch in App.js that fixes this by converting string sizes like "large" to numeric values (36).

If you still encounter the error, try these solutions:

1. Run the fix script:
```
node fix-activity-indicator.js
```

2. Manually edit any component that uses ActivityIndicator to use numeric values:
```jsx
// Instead of this:
<ActivityIndicator size="large" />

// Use this:
<ActivityIndicator size={36} />
```

## Project Roadmap

### Phase 1 (Current)
- Core pantry management and meal planning functionality
- Basic recipe suggestion algorithms
- User interface foundations

### Phase 2 (Upcoming)
- AI-enhanced flavor profiling
- Expanded recipe database integration
- Enhanced nutritional analysis

### Phase 3 (Future)
- Community features and social sharing
- Smart kitchen device integration
- Advanced personalization using machine learning

## License

MIT License
