const fetch = require('node-fetch');
const { sendNotification } = require('./sender');
const admin = require('firebase-admin');

// Fetch stock data from API
async function fetchStockData() {
  const response = await fetch('https://api.joshlei.com/v2/growagarden/stock');
  return await response.json();
}

// Fetch user preferences from Firebase
async function fetchUserPreferences() {
  const snapshot = await admin.database().ref('/token').once('value');
  return snapshot.val() || {};
}

// Push notifications for selected categories
async function pushStockNotifications(categories) {
  console.log('🔄 Fetching stock for:', categories);
  const stockData = await fetchStockData();
  const userPreferences = await fetchUserPreferences();

  // For each user
  for (const token in userPreferences) {
    const userCategories = userPreferences[token];

    // For each selected category
    for (const category of categories) {
      const subscribedItems = userCategories[category]
        ? Object.values(userCategories[category]) // ["carrot", "strawberry", ...]
        : [];

      // For each subscribed item
      for (const itemKey of subscribedItems) {
        const stockArray = stockData[category];

        if (!stockArray) continue;

        const stockItem = stockArray.find(item => item.item_id === itemKey);

        if (stockItem) {
          const displayName = stockItem.display_name || itemKey;
          const largeIcon = stockItem.icon;

          const title = `${displayName} is in stock!`;
          const message = `Your favorite item ${displayName} is available.`;
          await sendNotification(token, title, message, largeIcon);

          console.log(`📢 Sent to ${token}: ${title}`);
        }
      }
    }
  }
}

module.exports = { pushStockNotifications };