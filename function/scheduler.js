const { pushStockNotifications } = require('./checker');

function startScheduler() {
  console.log('⏳ Scheduler started...');

  setInterval(() => {
    const now = new Date();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    let categoriesToCheck = [];

    // Every 5 minutes for seed_stock and gear_stock
    if (minutes % 5 === 0) {
      categoriesToCheck.push('seed_stock', 'gear_stock');
    }

    // Every 30 minutes for egg_stock
    if (minutes % 30 === 0) {
      categoriesToCheck.push('egg_stock');
    }

    // Exactly at 12:00, 4:00, 8:00 for cosmetic_stock
    const cosmeticsHours = [0, 4, 8, 12, 16, 20];
    if (cosmeticsHours.includes(hours) && minutes === 0) {
      categoriesToCheck.push('cosmetic_stock');
    }

    if (categoriesToCheck.length > 0) {
      console.log(`⏰ ${now.toLocaleTimeString()} → Checking: ${categoriesToCheck.join(', ')}`);
      pushStockNotifications(categoriesToCheck);
    }
  }, 60 * 1000); // Check every 1 minute
}

module.exports = { startScheduler };