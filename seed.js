const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Attendee = require('./models/Attendee');

dotenv.config();

const firstNames = [
  'Kwame', 'Abena', 'Kofi', 'Ama', 'Yaw', 'Akosua', 'Kweku', 'Adwoa',
  'Nana', 'Efua', 'Kojo', 'Araba', 'Kwabena', 'Afia', 'Fiifi', 'Akua',
  'Emmanuel', 'Grace', 'Daniel', 'Priscilla'
];

const lastNames = [
  'Mensah', 'Asante', 'Boateng', 'Darko', 'Amponsah', 'Owusu', 'Agyei',
  'Frimpong', 'Adusei', 'Antwi', 'Osei', 'Adjei', 'Bonsu', 'Sarpong',
  'Kyei', 'Acheampong', 'Tawiah', 'Yankey', 'Quansah', 'Baah'
];

const ticketTypes = ['free', 'free', 'free', 'vip']; // mostly free

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateAttendees(count) {
  const attendees = [];
  const usedEmails = new Set();

  while (attendees.length < count) {
    const firstName = random(firstNames);
    const lastName = random(lastNames);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${attendees.length}@email.com`;

    if (usedEmails.has(email)) continue;
    usedEmails.add(email);

    attendees.push({
      firstName,
      lastName,
      email,
      phone: `+233 ${Math.floor(20 + Math.random() * 30)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`,
      ticketType: random(ticketTypes),
      registeredAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000), // random day in last 30 days
    });
  }

  return attendees;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing attendees first
    await Attendee.deleteMany({});
    console.log('Cleared existing attendees');

    // Insert 30 new ones
    const attendees = generateAttendees(30);
    await Attendee.insertMany(attendees);
    console.log('✓ 30 attendees seeded successfully');

    // Show a summary
    const vipCount = attendees.filter(a => a.ticketType === 'vip').length;
    console.log(`  → ${30 - vipCount} General Admission`);
    console.log(`  → ${vipCount} VIP`);

  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
    process.exit(0);
  }
}

seed();