// models/index.js
const { DataTypes } = require('sequelize');
const sequelize = require('./database');

// 1. Users Table (Authentication)
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'customer' }
});

// 2. Pet Sales Inventory
const InventoryItem = sequelize.define('InventoryItem', {
  petType: { type: DataTypes.STRING, allowNull: false },
  breed: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Available' },
  age: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true }
});

// 3. Boarding Bookings
const Booking = sequelize.define('Booking', {
  customerName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  petType: { type: DataTypes.STRING, defaultValue: 'Bird' },
  breed: { type: DataTypes.STRING, allowNull: true },
  birdCount: { type: DataTypes.INTEGER, defaultValue: 1 },
  startDate: { type: DataTypes.STRING, allowNull: true },
  endDate: { type: DataTypes.STRING, allowNull: true },
  cageType: { type: DataTypes.STRING, defaultValue: 'Shop Cage' },
  ratesSummary: { type: DataTypes.STRING, allowNull: true },
  days: { type: DataTypes.INTEGER, defaultValue: 1 },
  totalCost: { type: DataTypes.FLOAT, defaultValue: 0 },
  requirements: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: 'Active' } // 'Active' or 'Completed'
});

// Relationships
User.hasMany(Booking, { foreignKey: { name: 'userId', allowNull: true } });
Booking.belongsTo(User, { foreignKey: { name: 'userId', allowNull: true } });

// Database Indexes
sequelize.addHook('afterInit', () => {
  sequelize.query('CREATE INDEX IF NOT EXISTS idx_booking_dates ON Bookings (startDate, endDate);');
  sequelize.query('CREATE INDEX IF NOT EXISTS idx_inventory_status ON InventoryItems (status);');
});

module.exports = { sequelize, User, InventoryItem, Booking };