import { insertInquiryRecord } from '../api/_lib/database.js';
import crypto from 'node:crypto';

const sampleInquiries = [
  {
    fullName: 'James Miller',
    email: 'james.miller@outlook.com',
    phone: '+1 555-0102',
    partySize: 2,
    tripType: 'Base Camp Trek',
    budgetBand: '$5,000 - $10,000',
    destinationInterests: ['Everest Base Camp', 'Kala Patthar'],
    startDate: '2026-09-15',
    endDate: '2026-10-02',
    flexibleDates: true,
    accommodations: 'Tea Houses',
    specialOccasion: '50th Birthday',
    specialRequests: 'Interested in a photography-focused guide.',
    consent: true
  },
  {
    fullName: 'Elena Rodriguez',
    email: 'elena.rodriguez@gmail.com',
    phone: '+34 912 345 678',
    partySize: 4,
    tripType: 'Island Peak Climbing',
    budgetBand: '$10,000 - $15,000',
    destinationInterests: ['Island Peak', 'Chhukung Valley'],
    startDate: '2026-10-10',
    endDate: '2026-10-30',
    flexibleDates: false,
    accommodations: 'Camping & Lodges',
    specialOccasion: '',
    specialRequests: 'Need high-altitude gear rental for the whole group.',
    consent: true
  },
  {
    fullName: 'Akira Tanaka',
    email: 'atanaka88@yahoo.co.jp',
    phone: '+81 90-1234-5678',
    partySize: 1,
    tripType: 'Annapurna Circuit',
    budgetBand: '$3,000 - $5,000',
    destinationInterests: ['Thorong La Pass', 'Tilicho Lake'],
    startDate: '2026-11-05',
    endDate: '2026-11-25',
    flexibleDates: true,
    accommodations: 'Standard Lodges',
    specialOccasion: 'Retirement Trip',
    specialRequests: 'Fluent English-speaking guide required.',
    consent: true
  },
  {
    fullName: 'Sarah Jenkins',
    email: 'sarah.j@tech-nomad.io',
    phone: '',
    partySize: 2,
    tripType: 'Gokyo Lakes Trek',
    budgetBand: '$5,000 - $10,000',
    destinationInterests: ['Gokyo Ri', 'Cho La Pass'],
    startDate: '2026-05-20',
    endDate: '2026-06-05',
    flexibleDates: false,
    accommodations: 'Best available lodges',
    specialOccasion: 'Anniversary',
    specialRequests: 'Vegetarian meals only.',
    consent: true
  },
  {
    fullName: 'Michael Chen',
    email: 'mchen.pro@outlook.com',
    phone: '+65 8822 9911',
    partySize: 3,
    tripType: 'Upper Mustang Jeep Tour',
    budgetBand: '$10,000+',
    destinationInterests: ['Lo Manthang', 'Muktinath'],
    startDate: '2026-08-12',
    endDate: '2026-08-25',
    flexibleDates: true,
    accommodations: 'Luxury Heritage Hotels',
    specialOccasion: '',
    specialRequests: 'Private luxury vehicle and experienced cultural guide.',
    consent: true
  },
  {
    fullName: 'Chloe Dupont',
    email: 'c.dupont@orange.fr',
    phone: '+33 6 12 34 56 78',
    partySize: 2,
    tripType: 'Manaslu Circuit',
    budgetBand: '$5,000 - $10,000',
    destinationInterests: ['Larke Pass', 'Samagaon'],
    startDate: '2026-10-01',
    endDate: '2026-10-22',
    flexibleDates: false,
    accommodations: 'Standard Tea Houses',
    specialOccasion: '',
    specialRequests: 'Planning for a very remote experience.',
    consent: true
  },
  {
    fullName: 'David Wilson',
    email: 'david.wilson@icloud.com',
    phone: '+44 7700 900123',
    partySize: 5,
    tripType: 'Everest Helicopter Tour',
    budgetBand: '$15,000+',
    destinationInterests: ['Kalapatthar landing', 'Everest View Hotel'],
    startDate: '2026-04-20',
    endDate: '2026-04-21',
    flexibleDates: true,
    accommodations: 'Day tour',
    specialOccasion: 'Family Celebration',
    specialRequests: 'Needs wheelchair assistance for airport transfers.',
    consent: true
  },
  {
    fullName: 'Sophia Mueller',
    email: 'sophia.m@berlin-adventures.de',
    phone: '+49 171 2233445',
    partySize: 2,
    tripType: 'Langtang Valley Trek',
    budgetBand: '$3,000 - $5,000',
    destinationInterests: ['Kyanjin Gompa', 'Cherko Ri'],
    startDate: '2026-03-10',
    endDate: '2026-03-24',
    flexibleDates: false,
    accommodations: 'Cozy lodges',
    specialOccasion: '',
    specialRequests: 'Interest in local cheese factory visit.',
    consent: true
  },
  {
    fullName: 'Robert Brown',
    email: 'rbrown_explorer@gmail.com',
    phone: '+61 412 345 678',
    partySize: 1,
    tripType: 'Lobuche East Peak',
    budgetBand: '$10,000 - $15,000',
    destinationInterests: ['Lobuche East', 'High Camp'],
    startDate: '2026-04-15',
    endDate: '2026-05-05',
    flexibleDates: false,
    accommodations: 'Base camp tents',
    specialOccasion: '',
    specialRequests: 'Experienced climber, needs personal climbing Sherpa.',
    consent: true
  },
  {
    fullName: 'Isabella Silva',
    email: 'isabella.silva@uol.com.br',
    phone: '+55 11 98765-4321',
    partySize: 3,
    tripType: 'Kathmandu Valley Tour',
    budgetBand: '$2,000 - $3,000',
    destinationInterests: ['Pashupatinath', 'Boudhanath', 'Bhaktapur'],
    startDate: '2026-12-20',
    endDate: '2026-12-27',
    flexibleDates: true,
    accommodations: 'Boutique hotels',
    specialOccasion: 'Christmas Trip',
    specialRequests: 'Focus on history and spiritual traditions.',
    consent: true
  }
];

async function seed() {
  console.log('Seeding sample inquiries...');
  
  const timestamp = new Date().toISOString();
  
  for (const item of sampleInquiries) {
    const payload = {
      ...item,
      id: `inq_${crypto.randomBytes(8).toString('hex')}`,
      destinationInterests: JSON.stringify(item.destinationInterests),
      source: 'website',
      client_ip: '127.0.0.1',
      receivedAt: timestamp,
      status: 'new',
      crmStatus: 'pending',
      updatedAt: timestamp
    };
    
    try {
      insertInquiryRecord(payload);
      console.log(`Added inquiry for: ${item.fullName}`);
    } catch (error) {
      console.error(`Failed to add inquiry for ${item.fullName}:`, error);
    }
  }
  
  console.log('Seeding complete.');
}

seed();
