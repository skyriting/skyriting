import Service from '../models/Service.js';

const defaultServices = [
  {
    title: 'Aircraft Management',
    slug: 'aircraft-management',
    tagline: 'Our services',
    subtitle: 'Seamless Aircraft Management',
    description: `Aircraft ownership doesn't have to be complex or daunting. Choosing a JetSetGo Aircraft Management Service takes away the stress and the burden of owning and operating an aircraft, leaving you free to concentrate on your business or lifestyle whilst we take care of the day-to-day business of operating and maintaining your aircraft.

Whether you choose a full turn-key service or a personalised program based on your specific needs JetSetGo's team of experts will ensure your aircraft is well maintained, operated to the highest standards, fully compliant with DGCA regulations, and aircraft's asset value is preserved to maximise resale value.`,
    deliverables: [
      'Pre-Purchase Inspection Oversight and Completion Monitoring',
      'Aircraft Registration & Importation',
      'Dispatch Services',
      'Crewing and Scheduling',
      'Flight Planning',
      'CAMO & Maintenance Programs',
      'Parts Procurement & Inventory Management',
      'AOG Support',
      'DGCA Compliance & Accountable Manager',
      'Charter Services',
      'Accounting, Billing & Reporting',
    ],
    benefits: [
      {
        title: 'Collaborative guidance',
        description: 'Informed decision-making and expert advice to determine the most suitable solutions for aircraft management requirements.',
      },
      {
        title: 'Efficiency & sustainability',
        description: 'Efficient maintenance and operation of aircraft to reduce fuel consumption and lower carbon emissions.',
      },
    ],
    icon: 'Settings',
    order: 1,
    isActive: true,
    showInNavigation: true,
  },
  {
    title: 'Aircraft Sourcing & Sales',
    slug: 'aircraft-sourcing-sales',
    tagline: 'Our services',
    subtitle: 'Find Your Perfect Aircraft',
    description: 'Expert guidance through every step of aircraft acquisition or sale. From market analysis and sourcing to negotiation and documentation, we ensure a seamless transaction that meets your requirements and protects your investment.',
    deliverables: [
      'Market research and aircraft sourcing',
      'Pre-purchase inspection coordination',
      'Negotiation and contract support',
      'Registration and import assistance',
      'Documentation and compliance',
    ],
    icon: 'ShoppingBag',
    order: 2,
    isActive: true,
    showInNavigation: true,
  },
  {
    title: 'Membership Program',
    slug: 'membership-program',
    tagline: 'Our services',
    subtitle: 'Flexible Access to Private Aviation',
    description: 'Our membership programs offer flexible hours and priority access to our fleet. Choose the tier that fits your travel needs and enjoy the benefits of private aviation without the commitment of ownership.',
    deliverables: [
      'Block hour packages',
      'Priority booking',
      'Dedicated account manager',
      'Transparent pricing and reporting',
    ],
    icon: 'Zap',
    order: 3,
    isActive: true,
    showInNavigation: true,
  },
  {
    title: 'Charter Services',
    slug: 'charter-services',
    tagline: 'Our services',
    subtitle: 'On-Demand Private Charter',
    description: 'Book private charter flights with ease. Our charter services provide access to a curated fleet of aircraft for one-off trips, with full flexibility on route, timing, and aircraft type.',
    deliverables: [
      'Wide range of aircraft types',
      '24/7 booking and dispatch',
      'Catering and ground transport',
      'Empty leg and last-minute options',
    ],
    icon: 'Plane',
    order: 4,
    isActive: true,
    showInNavigation: true,
  },
  {
    title: 'MRO',
    slug: 'mro',
    tagline: 'Our services',
    subtitle: 'Maintenance, Repair & Overhaul',
    description: 'Comprehensive MRO solutions to keep your aircraft airworthy and compliant. From line maintenance to heavy checks, we coordinate with certified facilities to ensure quality and timely delivery.',
    deliverables: [
      'Line and base maintenance coordination',
      'Component repair and overhaul',
      'CAMO and continuing airworthiness',
      'Parts and logistics support',
    ],
    icon: 'Wrench',
    order: 5,
    isActive: true,
    showInNavigation: true,
  },
  {
    title: 'Aviation Consultancy',
    slug: 'aviation-consultancy',
    tagline: 'Our services',
    subtitle: 'Strategic Aviation Advice',
    description: 'Strategic and operational consultancy for operators, owners, and investors. We provide expertise in regulatory compliance, operational setup, fleet planning, and market analysis.',
    deliverables: [
      'Regulatory and compliance advisory',
      'Operational setup and AOC support',
      'Fleet and route planning',
      'Due diligence and market studies',
    ],
    icon: 'FileText',
    order: 6,
    isActive: true,
    showInNavigation: true,
  },
];

/**
 * Seed default services if none exist
 */
export async function seedDefaultServices() {
  try {
    const count = await Service.countDocuments();
    if (count > 0) {
      return;
    }
    await Service.insertMany(defaultServices);
    console.log('✅ Default services seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding default services:', error.message);
  }
}
