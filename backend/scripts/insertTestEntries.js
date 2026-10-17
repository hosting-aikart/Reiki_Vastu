import { connectDB, disconnectDB } from '../src/config/db.js';
import Enquiry from '../src/models/Enquiry.js';
import Testimonial from '../src/models/Testimonial.js';
import { generateReference } from '../src/utils/reference.js';

async function seedTestEntries() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await connectDB();

    console.log('Inserting 2 test enquiries...');
    const enquiries = await Enquiry.insertMany([
      {
        reference: generateReference('RVW'),
        type: 'consultation',
        name: 'Rajesh Sharma',
        phone: '+919823456781',
        email: 'rajesh.sharma@example.com',
        location: 'amravati',
        serviceKey: 'residential_vaastu_audit',
        preferredDate: '2026-10-22',
        preferredSlot: '10:00',
        message: 'Looking for an on-site Vaastu audit for my new 3BHK home.',
        status: 'new'
      },
      {
        reference: generateReference('RVW'),
        type: 'course',
        name: 'Pooja Kulkarni',
        phone: '+919823456782',
        email: 'pooja.k@example.com',
        location: 'online',
        courseId: 'reiki',
        message: 'Interested in enrolling in the upcoming Reiki Level 1 & 2 weekend batch.',
        status: 'contacted'
      }
    ]);

    console.log('✅ Created Enquiries:');
    enquiries.forEach((e) => {
      console.log(` - [${e.reference}] ${e.name} (${e.type}) - Status: ${e.status}`);
    });

    console.log('\nInserting 2 test testimonials...');
    const testimonials = await Testimonial.insertMany([
      {
        name: 'Amit Deshmukh',
        city: 'Nagpur',
        serviceKey: 'reiki_healing_session',
        rating: 5,
        story: 'Experiencing severe chronic stress, I attended a healing session with Dr. Naresh. The energy shift was profound and gave me deep mental peace.',
        status: 'approved',
        featured: true,
        sortOrder: 1
      },
      {
        name: 'Sneha Patel',
        city: 'Amravati',
        serviceKey: 'residential_vaastu_audit',
        rating: 5,
        story: 'Dr. Naresh suggested simple Vaastu corrections without demolition. Within a few months, our household harmony and peace improved remarkably.',
        status: 'pending',
        featured: false,
        sortOrder: 0
      }
    ]);

    console.log('✅ Created Testimonials:');
    testimonials.forEach((t) => {
      console.log(` - [${t._id}] ${t.name} from ${t.city} (${t.serviceKey}) - Status: ${t.status}`);
    });

    console.log('\nAll test entries inserted successfully.');
  } catch (error) {
    console.error('Error inserting test entries:', error);
  } finally {
    await disconnectDB();
    console.log('Database disconnected.');
  }
}

seedTestEntries();
