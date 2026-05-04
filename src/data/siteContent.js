export const siteMeta = {
  siteName: 'Everest Expeditions',
  siteUrl: 'https://www.everestadventures.co',
  defaultTitle: 'Everest Expeditions | Tailored Travel Planning and Guided Journeys',
  defaultDescription:
    'Everest Expeditions designs bespoke journeys with destination planning, vetted stays, on-ground coordination, and round-the-clock travel support.',
  defaultImage: '/uploads/site/hero_everest_main_1777546681299.png'
};

export const companyProfile = {
  name: 'Everest Expeditions',
  legalName: 'Everest Expeditions Pvt. Ltd.',
  tagline: 'Tailored journeys with real planners, trusted partners, and calm on-ground support.',
  email: 'hello@everestadventures.co',
  phone: '+977 01 555 0198',
  emergencyPhone: '+977 9818 000 111',
  address: 'Lazimpat Road, Kathmandu 44600, Nepal',
  headquarters: 'Kathmandu, Nepal',
  officeHours: 'Sunday to Friday, 9:00 AM to 6:00 PM NPT',
  registrationNote: 'Licensed destination planning and ground coordination team based in Kathmandu.',
  shortDescription:
    'We plan premium leisure escapes, private celebrations, company retreats, and guided cultural itineraries with one lead planner from inquiry to arrival.',
  longDescription:
    'Everest Expeditions combines destination design, supplier vetting, travel logistics, and traveler support in one concierge-led planning flow. We help guests move from inspiration to confirmed itinerary without piecing together flights, transfers, stays, and local experiences on their own.',
  supportPromise: '24/7 in-trip support during confirmed travel windows.'
};

export const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Destinations', to: '/destinations' },
  { label: 'Experiences', to: '/experiences' },
  { label: 'Stories', to: '/stories' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
];

export const footerNavGroups = [
  {
    title: 'Explore',
    items: [
      { label: 'Destinations', to: '/destinations' },
      { label: 'Experiences', to: '/experiences' },
      { label: 'Stories', to: '/stories' },
      { label: 'Plan your trip', to: '/booking' }
    ]
  },
  {
    title: 'Company',
    items: [
      { label: 'About us', to: '/about' },
      { label: 'Safety', to: '/safety' },
      { label: 'Help center', to: '/help' },
      { label: 'Contact', to: '/contact' }
    ]
  },
  {
    title: 'Policies',
    items: [
      { label: 'Privacy policy', to: '/privacy' },
      { label: 'Terms of service', to: '/terms' },
      { label: 'Cancellation policy', to: '/cancellation' }
    ]
  }
];

export const heroAvatars = [
  '/uploads/site/avatar_planner_batch_1777546714901.png',
  '/uploads/site/avatar_planner_batch_1777546714901.png',
  '/uploads/site/avatar_planner_batch_1777546714901.png'
];

export const stats = [
  { value: 24, suffix: '/7', label: 'Traveler support' },
  { value: 1, suffix: ':1', label: 'Lead trip planner' },
  { value: 365, suffix: 'd', label: 'Seasonal planning' }
];

export const trustBadges = [
  {
    title: 'Supplier-vetted itineraries',
    copy: 'Every stay, transfer partner, and local host is reviewed before we recommend it to travelers.'
  },
  {
    title: 'Human trip management',
    copy: 'Guests work with an actual planner instead of a generic instant-booking workflow.'
  },
  {
    title: 'In-trip support coverage',
    copy: 'We stay available for schedule changes, disruptions, and on-ground coordination during confirmed trips.'
  }
];

export const destinations = [
  {
    slug: 'everest-base-camp',
    title: 'Everest: High-Altitude Khumbu Expedition',
    shortTitle: 'Everest Base Camp',
    country: 'Nepal',
    region: 'Khumbu',
    eyebrow: 'Elite mountain adventure',
    meta: 'Custom journeys from USD 3,400',
    rating: 'Superior safety coordination',
    heroImage: '/uploads/destinations/everest_base_camp_card_1777544793462.png',
    cardImage: '/uploads/destinations/everest_base_camp_card_1777544793462.png',
    gallery: [
      '/uploads/destinations/everest_base_camp_card_1777544793462.png'
    ],
    summary: 'The world\'s most iconic trek, managed with Sherpa-led logistics and premium high-altitude support.',
    description: 'Our Everest journeys prioritize safety and acclimatization. We coordinate every detail from Lukla flights to high-altitude medical support, ensuring a calm and focused expedition.',
    idealFor: ['Experienced trekkers', 'Mountaineers', 'Aviation enthusiasts'],
    highlights: ['Sherpa-led mountain coordination', 'Helicopter evacuation insurance coordination', 'Vetted high-altitude tea house selections'],
    itinerary: ['Arrival in Kathmandu and gear briefing', 'Scenic flight to Lukla and trail start', 'Acclimatization days in Namche Bazaar'],
    bestSeason: 'March to May and October to November',
    seoDescription: 'Plan your Everest Base Camp trek with Everest Expeditions. Professional Sherpa guides and elite logistics.'
  },
  {
    slug: 'annapurna-sanctuary',
    title: 'Annapurna: The Alpine Amphitheater',
    shortTitle: 'Annapurna Sanctuary',
    country: 'Nepal',
    region: 'Gandaki',
    eyebrow: 'Cultural mountain trekking',
    meta: 'Custom journeys from USD 2,600',
    rating: 'Gurung heritage journeys',
    heroImage: '/uploads/destinations/annapurna_sanctuary_card_1777544932384.png',
    cardImage: '/uploads/destinations/annapurna_sanctuary_card_1777544932384.png',
    gallery: [
      '/uploads/destinations/annapurna_sanctuary_card_1777544932384.png'
    ],
    summary: 'A dramatic walk into a sanctuary of 8,000m peaks, moving through rhododendron forests and Gurung villages.',
    description: 'The Annapurna Sanctuary trek combines breathtaking mountain views with deep cultural immersion in the villages of the Gandaki region.',
    idealFor: ['Intermediate trekkers', 'Nature photography', 'Culture seekers'],
    highlights: ['Sunrise over Machapuchare (Fishtail Peak)', 'Gurung village homestays and heritage lodges', 'Poon Hill panoramic view'],
    itinerary: ['Kathmandu to Pokhara scenic drive or flight', 'Ulleri to Ghorepani forest trail', 'Sunrise at Poon Hill and trail to Tadapani'],
    bestSeason: 'September to November and March to May',
    seoDescription: 'Discover the Annapurna Sanctuary with Everest Expeditions. Expert guides and traditional village stays.'
  },
  {
    slug: 'pokhara-lakeside',
    title: 'Pokhara: Lakeside Serenity & Gateway',
    shortTitle: 'Pokhara Lakeside',
    country: 'Nepal',
    region: 'Kaski',
    eyebrow: 'Lakeside relaxation',
    meta: 'Custom stays from USD 1,800',
    rating: 'Premium mountain retreats',
    heroImage: '/uploads/destinations/pokhara_lakeside_card_1777544955488.png',
    cardImage: '/uploads/destinations/pokhara_lakeside_card_1777544955488.png',
    gallery: [
      '/uploads/destinations/pokhara_lakeside_card_1777544955488.png'
    ],
    summary: 'The ultimate sanctuary for post-trek recovery, offering serene lakes, adventure sports, and a quieter Himalayan rhythm.',
    description: 'Whether you seek paragliding over Phewa Lake or a quiet retreat in a lakeside spa, we coordinate the experiences that make your stay effortless.',
    idealFor: ['Post-trek recovery', 'Adventure sports', 'Slow luxury travel'],
    highlights: ['Private boat tours on Phewa Lake', 'Paragliding and Ultralight flights', 'World Peace Pagoda sunset walks'],
    itinerary: ['Check-in and lakeside orientation', 'Mountain-facing breakfast and boat tour', 'Sarangkot sunrise and spa afternoon'],
    bestSeason: 'Year-round (Best: Oct-May)',
    seoDescription: 'Experience Pokhara in style with Everest Expeditions. Luxury lakeside stays and panoramic mountain views.'
  },
  {
    slug: 'upper-mustang',
    title: 'Upper Mustang: The Ancient Kingdom',
    shortTitle: 'Upper Mustang',
    country: 'Nepal',
    region: 'Mustang',
    eyebrow: 'Remote desert exploration',
    meta: 'Custom expeditions from USD 4,800',
    rating: 'Exclusive expedition permits',
    heroImage: '/uploads/destinations/upper_mustang_card_1777544978624.png',
    cardImage: '/uploads/site/story_mustang_cliffs_v2_1777546895301.png',
    gallery: [
      '/uploads/destinations/upper_mustang_card_1777544978624.png',
      '/uploads/site/story_mustang_cliffs_v2_1777546895301.png'
    ],
    summary: 'A transition into a high-altitude desert world of red cliffs, ancient monasteries, and Tibetan culture.',
    description: 'Upper Mustang requires specialized permits and planning. We manage the restricted area logistics and provide expert guides for this unique "mini Tibet" landscape.',
    idealFor: ['Remote travel', 'Buddhist history', 'Off-road enthusiasts'],
    highlights: ['The walled city of Lo Manthang', 'Ancient sky caves and monasteries', 'High-altitude desert panoramas'],
    itinerary: ['Jomsom arrival and jeep transition', 'Lo Gekar monastery visit', 'Exploration of Lo Manthang walled city'],
    bestSeason: 'May to October (Rain shadow region)',
    seoDescription: 'Visit the Forbidden Kingdom of Upper Mustang. Exclusive permits and remote desert luxury.'
  },
  {
    slug: 'chitwan-jungle',
    title: 'Chitwan: Subtropical Safari Journey',
    shortTitle: 'Chitwan Jungle',
    country: 'Nepal',
    region: 'Terai',
    eyebrow: 'Wildlife and river safari',
    meta: 'Custom safaris from USD 1,600',
    rating: 'Eco-luxury jungle lodges',
    heroImage: '/uploads/destinations/chitwan_safari_card_1777545004582.png',
    cardImage: '/uploads/site/exp_terai_safari_v2_1777546780464.png',
    gallery: [
      '/uploads/destinations/chitwan_safari_card_1777545004582.png',
      '/uploads/site/exp_terai_safari_v2_1777546780464.png'
    ],
    summary: 'Subtropical jungles home to the One-horned Rhino, Bengal Tiger, and over 500 species of birds.',
    description: 'Swap the mountains for the lowlands. We coordinate jungle safaris, river canoe trips, and stays in eco-conscious lodges that prioritize conservation.',
    idealFor: ['Families', 'Wildlife enthusiasts', 'Eco-travelers'],
    highlights: ['One-horned Rhino tracking', 'Canoeing on the Rapti River', 'Tharu cultural village tours'],
    itinerary: ['Flight to Bharatpur and lodge check-in', 'Bird watching walk and sunset river view', 'Jeep safari and Tharu cultural evening'],
    bestSeason: 'October to March',
    seoDescription: 'Explore Chitwan National Park with Everest Expeditions. Luxury jungle safaris and rhino tracking.'
  },
  {
    slug: 'kathmandu-heritage',
    title: 'Kathmandu: Heritage & Living Culture',
    shortTitle: 'Kathmandu Valley',
    country: 'Nepal',
    region: 'Valley',
    eyebrow: 'Historical luxury',
    meta: 'Custom tours from USD 1,400',
    rating: 'Boutique heritage stays',
    heroImage: '/uploads/destinations/kathmandu_heritage_card_1777545033554.png',
    cardImage: '/uploads/destinations/kathmandu_heritage_card_1777545033554.png',
    gallery: [
      '/uploads/destinations/kathmandu_heritage_card_1777545033554.png'
    ],
    summary: 'A convergence of history and modernity, where ancient temples stand alongside vibrant local markets.',
    description: 'Kathmandu is the gateway to the Himalayas. We help you navigate the valley\'s Seven UNESCO World Heritage Sites while staying in tucked-away heritage properties.',
    idealFor: ['Culture', 'History', 'Gourmet travelers'],
    highlights: ['Swayambhunath Monkey Temple', 'Bhaktapur medieval square', 'Patan artisan metalwork tours'],
    itinerary: ['Durbar Square history walk', 'Sunset at Swayambhunath', 'Artisan workshop tour in Patan'],
    bestSeason: 'September to May',
    seoDescription: 'Discover Kathmandu\'s UNESCO Heritage with Everest Expeditions. Boutique hotels and curated cultural tours.'
  },
  {
    slug: 'langtang-valley',
    title: 'Langtang: The Valley of Glaciers',
    shortTitle: 'Langtang Valley',
    country: 'Nepal',
    region: 'Rasuwa',
    eyebrow: 'Alpine wilderness',
    meta: 'Custom treks from USD 2,200',
    rating: 'Hidden valley expeditions',
    heroImage: '/uploads/destinations/langtang_valley_card_1777545478250.png',
    cardImage: '/uploads/destinations/langtang_valley_card_1777545478250.png',
    gallery: [
      '/uploads/destinations/langtang_valley_card_1777545478250.png'
    ],
    summary: 'A resilient valley of high-altitude monasteries, glacial lakes, and some of the most accessible 7,000m peaks.',
    description: 'Langtang is the closest Himalayan region to Kathmandu, yet remains wonderfully uncrowded. We coordinate the logistics, expert guides, and lodge stays for a pure alpine experience.',
    idealFor: ['Fast-trekking', 'Alpine scenery', 'Solo adventurers'],
    highlights: ['Kyanjin Gompa monastery', 'Kyanjin Ri mountain views', 'Local yak cheese factory tours'],
    itinerary: ['Drive to Syabrubesi and trail start', 'Trek to Lama Hotel through forests', 'Arrival in the wide Langtang Valley'],
    bestSeason: 'March to May and October to November',
    seoDescription: 'Trek the Langtang Valley with Everest Expeditions. Glacial landscapes and local culture.'
  },
  {
    slug: 'lumbini-wellness',
    title: 'Lumbini: Birthplace of the Buddha',
    shortTitle: 'Lumbini Wellness',
    country: 'Nepal',
    region: 'Kapilvastu',
    eyebrow: 'Spiritual retreat',
    meta: 'Custom retreats from USD 2,600',
    rating: 'Monastery stay journeys',
    heroImage: '/uploads/destinations/lumbini_wellness_card_1777545507523.png',
    cardImage: '/uploads/site/exp_heritage_wellness_v2_1777546814314.png',
    gallery: [
      '/uploads/destinations/lumbini_wellness_card_1777545507523.png',
      '/uploads/site/exp_heritage_wellness_v2_1777546814314.png'
    ],
    summary: 'A place of profound peace, featuring international monasteries, the sacred Maya Devi Temple, and ancient archaeological sites.',
    description: 'For travelers seeking stillness and spiritual depth, we coordinate stays near the monastic zone, meditation sessions, and guided archaeological tours.',
    idealFor: ['Wellness', 'Spirituality', 'Peace seekers'],
    highlights: ['Maya Devi Temple sacred garden', 'Ashoka Pillar', 'International Monastery tours'],
    itinerary: ['Monastic zone orientation', 'Early morning meditation window', 'Archaeological tour of Tilaurakot'],
    bestSeason: 'October to March',
    seoDescription: 'Plan your spiritual journey to Lumbini with Everest Expeditions. Guided pilgrimage tours and wellness retreats.'
  }
];

export const experiences = [
  {
    slug: 'himalayan-ascent',
    title: 'The Himalayan Ascent',
    eyebrow: 'High-altitude challenge',
    shortTitle: 'Himalayan Ascent',
    heroImage: '/uploads/site/exp_himalayan_ascent_1777546747287.png',
    summary: 'A high-impact itinerary designed for trekkers who want to push their limits in the Everest or Annapurna regions.',
    description: 'We manage everything: Sherpa guides, porters, high-altitude lodge reservations, and helicopter contingency planning so you can focus on the trail.',
    bullets: ['Sherpa-led guiding', 'Logistics coordination', 'High-altitude tracking'],
    inclusions: [
      'Pre-trek gear consultation',
      'TIMS and National Park permits',
      'Sherpa guide and porter support',
      'All teahouse or lodge accommodations'
    ],
    bestFor: ['Athletes', 'Experienced trekkers', 'Mountaineering fans'],
    destinationSlugs: ['everest-base-camp', 'annapurna-sanctuary'],
    seoDescription: 'Master the high-altitude trails of Nepal with the Himalayan Ascent package by Everest Expeditions.'
  },
  {
    slug: 'terai-safari',
    title: 'The Terai Safari',
    eyebrow: 'Wildlife discovery',
    shortTitle: 'Terai Safari',
    heroImage: '/uploads/site/exp_terai_safari_v2_1777546780464.png',
    summary: 'Swap the peaks for the plains. Explore the jungles of Chitwan or Bardia for One-horned Rhinos and Tigers.',
    description: 'A polished jungle expedition featuring private jeep safaris, canoe trips, and boutique lodges that blend comfort with conservation.',
    bullets: ['Private jeep safaris', 'River bird-watching', 'Eco-luxury lodging'],
    inclusions: [
      'Jungle expert guides',
      'Private river navigation',
      'National Park entry fees',
      'Local Tharu community experiences'
    ],
    bestFor: ['Families', 'Nature lovers', 'Wildlife photographers'],
    destinationSlugs: ['chitwan-jungle'],
    seoDescription: 'Go on a high-fidelity jungle safari in Nepal with Everest Expeditions. Rhino tracking and eco-luxury stays.'
  },
  {
    slug: 'heritage-wellness',
    title: 'Heritage & Wellness',
    eyebrow: 'Cultural reset',
    shortTitle: 'Heritage Wellness',
    heroImage: '/uploads/site/exp_heritage_wellness_v2_1777546814314.png',
    summary: 'A curated journey through the Kathmandu Valley and Lumbini, focusing on history, art, and spiritual restoration.',
    description: 'Designed for the traveler who appreciates artisan craftsmanship, ancient architecture, and moments of profound peace.',
    bullets: ['Boutique heritage stays', 'Meditation windows', 'Artisan workshop access'],
    inclusions: [
      'UNESCO Heritage site access',
      'Local historian guides',
      'Private meditation or yoga windows',
      'Boutique hotel or monastic stay coordination'
    ],
    bestFor: ['Couples', 'Solo travelers', 'History enthusiasts'],
    destinationSlugs: ['kathmandu-heritage', 'lumbini-wellness'],
    seoDescription: 'Discover the cultural and spiritual heart of Nepal with our Heritage & Wellness package.'
  }
];

export const stories = [
  {
    slug: 'khumbu-ice-story',
    title: 'Beyond the Base Camp: A journey through the blue ice of Khumbu',
    excerpt: 'How one traveler found stillness among the scale of the world\'s highest mountains with a local Sherpa team.',
    image: '/uploads/site/story_khumbu_glacier_1777546856363.png',
    publishedAt: '2026-03-12',
    readTime: '6 min read',
    author: 'Khumbu Team',
    destinationSlug: 'everest-base-camp',
    body: [
      'The Everest region isn\'t just about the peak; it\'s about the pulse of the Khumbu. We spent 12 days moving through Sherpa villages that felt like they hadn\'t changed in a century.',
      'Our guide, Nuru, didn\'t just show us the path; he showed us his childhood home, the monastery where his brother lived, and the secret tea spots far from the main tourist trail.',
      'The final push to the base camp was grueling, but with the support of our team, we felt safe to focus entirely on the dramatic sky and the cracking of the blue ice below.'
    ]
  },
  {
    slug: 'mustang-cliffs-story',
    title: 'Red Cliffs and Sky Caves: Lost in the Forbidden Kingdom',
    excerpt: 'Exploring the windswept plains of Upper Mustang, where Tibetan culture remains untouched by time.',
    image: '/uploads/site/story_mustang_cliffs_v2_1777546895301.png',
    publishedAt: '2026-02-20',
    readTime: '8 min read',
    author: 'Expedition Lead',
    destinationSlug: 'upper-mustang',
    body: [
      'Upper Mustang feels like another planet. The red, wind-carved cliffs and the ancient sky caves look more like a Martian landscape than anything in Nepal.',
      'In Lo Manthang, we were invited into the palace grounds. We sat with local monks and discussed the preservation of their 600-year-old thangkas.',
      'It is a place where prayer flags are the only sound, and the modern world feels infinitely far away.'
    ]
  },
  {
    slug: 'chitwan-jungle-story',
    title: 'Where Tigers Roam: A Jungle Awakening in Chitwan',
    excerpt: 'Trading mountain treks for jungle safaris revealed a different side of Nepal\'s wilderness and wildlife.',
    image: '/uploads/site/exp_terai_safari_v2_1777546780464.png',
    publishedAt: '2026-01-15',
    readTime: '7 min read',
    author: 'Safari Team',
    destinationSlug: 'chitwan-jungle',
    body: [
      'After weeks in the mountains, the lowland jungles of Chitwan felt like stepping into a different world. The humidity, the sounds, the sheer biodiversity was overwhelming in the best way.',
      'Our first morning jeep safari led us through dense rhododendron forests where we spotted One-horned Rhinos bathing in the Rapti River. The experience was humbling and raw.',
      'By the end of our stay, we understood why conservation efforts in this region matter so deeply. Every encounter reinforced that wildlife and humans can coexist with the right planning and respect.'
    ]
  }
];

export const testimonials = [
  {
    name: 'Marcus Chen',
    role: 'Founder, Sentient Labs',
    quote:
      'We had one planner, one clear itinerary, and one number to call when weather forced a change. That alone made the trip feel premium.',
    avatar:
      '/uploads/site/avatar_planner_batch_1777546714901.png',
    location: 'Swiss Alps retreat',
    thumbs: [
      '/uploads/destinations/everest_base_camp_card_1777544793462.png',
      '/uploads/destinations/annapurna_sanctuary_card_1777544932384.png',
      '/uploads/destinations/pokhara_lakeside_card_1777544955488.png'
    ],
    rating: 'Client interview'
  },
  {
    name: 'Sofia Alvarez',
    role: 'Creative Director, Tala House',
    quote:
      'The trip felt spacious, not over-planned. We always knew what was handled, and we still had room to change our minds.',
    avatar:
      '/uploads/site/avatar_planner_batch_1777546714901.png',
    location: 'Bali villa escape',
    thumbs: [
      '/uploads/destinations/upper_mustang_card_1777544978624.png',
      '/uploads/destinations/chitwan_safari_card_1777545004582.png',
      '/uploads/destinations/kathmandu_heritage_card_1777545033554.png'
    ],
    rating: 'Traveler testimonial'
  },
  {
    name: 'Omar Haddad',
    role: 'Product Lead, North Atlas',
    quote:
      'What stood out was the calm. The support team had already thought through timing, backups, and the little details we would have missed.',
    avatar:
      '/uploads/site/avatar_planner_batch_1777546714901.png',
    location: 'Morocco celebration journey',
    thumbs: [
      '/uploads/destinations/langtang_valley_card_1777545478250.png',
      '/uploads/destinations/lumbini_wellness_card_1777545507523.png',
      '/uploads/site/hero_everest_main_1777546681299.png'
    ],
    rating: 'Post-trip review'
  }
];

export const diaryMoments = [
  {
    title: 'Himalayan dawn',
    image: '/uploads/site/moment_dawn_v2_1777546931930.png'
  },
  {
    title: 'Pokhara lakeside',
    image: '/uploads/site/pokhara_lakeside_card_1777544955488.png'
  },
  {
    title: 'Durbar history',
    image: '/uploads/site/kathmandu_heritage_card_1777545033554.png'
  }
];

export const journeySteps = [
  {
    number: '01',
    title: 'Tell us what the trip needs to achieve',
    copy: 'We start with dates, budget, pacing, who is traveling, and any must-have moments or operational constraints.'
  },
  {
    number: '02',
    title: 'Review a planner-built travel concept',
    copy: 'You receive a destination direction, stay options, routing logic, and a clearer sense of what the trip can become.'
  },
  {
    number: '03',
    title: 'Confirm the itinerary and guest details',
    copy: 'Once approved, we lock in suppliers, collect preferences, and prepare the working trip brief.'
  },
  {
    number: '04',
    title: 'Travel with live support behind the scenes',
    copy: 'During the journey, our team stays available for schedule adjustments, service recovery, and coordination.'
  }
];

export const faqs = [
  {
    question: 'What type of trips do you plan?',
    answer:
      'We plan premium leisure journeys, milestone celebrations, family escapes, executive retreats, and destination-led travel with a clear service component.'
  },
  {
    question: 'Do you sell flights directly?',
    answer:
      'We can coordinate flight recommendations and timing logic, but direct ticketing depends on the supplier structure used for the trip.'
  },
  {
    question: 'How early should we inquire?',
    answer:
      'For best choice of stays and guides, we recommend starting 8 to 12 weeks ahead for standard trips and earlier for peak-season or group travel.'
  },
  {
    question: 'Can you work with a fixed budget?',
    answer:
      'Yes. We use budget as a planning constraint from the beginning so we can shape destination, pacing, and service levels realistically.'
  },
  {
    question: 'What happens if something changes during the trip?',
    answer:
      'Confirmed travelers receive support contact details and escalation paths so we can help with schedule shifts, supplier communication, and service recovery.'
  }
];

export const reservationHighlights = [
  { label: 'Planning style', value: 'Planner-led, not self-serve' },
  { label: 'Support', value: '24/7 during active travel' },
  { label: 'Suppliers', value: 'Vetted stay and activity partners' },
  { label: 'Routing', value: 'Transfers and timing mapped for you' }
];

export const destinationDetails = destinations.map((destination) => ({
  title: destination.title,
  copy: destination.summary,
  image: destination.gallery[0]
}));

export const featuredDestinations = destinations.map((destination) => ({
  slug: destination.slug,
  title: destination.title,
  shortTitle: destination.shortTitle,
  country: destination.country,
  region: destination.region,
  meta: destination.meta,
  rating: destination.rating,
  image: destination.cardImage,
  description: destination.summary,
  highlights: destination.highlights
}));

export const experiencePackages = experiences.map((experience) => ({
  title: experience.title,
  copy: experience.summary,
  bullets: experience.bullets
}));

export const storySnapshots = stories.map((story) => ({
  slug: story.slug,
  title: story.title,
  copy: story.excerpt,
  image: story.image
}));

export const bookingModes = [
  {
    title: 'Private escape',
    copy: 'Best for couples or solo travelers who want a lead planner, curated stays, and full itinerary support.'
  },
  {
    title: 'Group retreat',
    copy: 'Built for families, founders, and teams who need rooming logic, timing control, and shared experiences.'
  },
  {
    title: 'Celebration travel',
    copy: 'Ideal for proposals, anniversaries, birthdays, and milestone moments where service timing matters.'
  }
];

export const contactChannels = [
  { label: 'Email concierge', value: companyProfile.email, href: `mailto:${companyProfile.email}` },
  { label: 'Call office', value: companyProfile.phone, href: `tel:${companyProfile.phone.replace(/\s+/g, '')}` },
  {
    label: 'Emergency support',
    value: companyProfile.emergencyPhone,
    href: `tel:${companyProfile.emergencyPhone.replace(/\s+/g, '')}`
  }
];

export const officeLocations = [
  {
    city: 'Kathmandu',
    address: companyProfile.address,
    hours: companyProfile.officeHours,
    note: 'Primary planning and operations desk'
  }
];

export const teamMembers = [
  {
    name: 'Anika Sherpa',
    role: 'Founder and Lead Planner',
    copy: 'Owns itinerary strategy, supplier review, and high-touch journeys that need tighter operational choreography.'
  },
  {
    name: 'Rohan Basnet',
    role: 'Guest Operations Manager',
    copy: 'Coordinates arrivals, transfer plans, and in-trip service recovery for multi-stop itineraries.'
  },
  {
    name: 'Mina Gurung',
    role: 'Experience Design Lead',
    copy: 'Matches local hosts, activity pacing, and milestone moments to the tone each traveler wants.'
  }
];

export const safetyStandards = [
  {
    title: 'Supplier vetting',
    copy: 'We review transfer partners, stays, and local hosts before they become part of our recommendations.'
  },
  {
    title: 'Arrival and routing controls',
    copy: 'Transfer windows, buffers, and daylight considerations are built into the planning process.'
  },
  {
    title: 'Emergency escalation',
    copy: 'Confirmed travelers receive support contacts and an escalation path for urgent itinerary disruptions.'
  },
  {
    title: 'Traveler readiness',
    copy: 'We share trip briefs covering timing, practical preparation, local expectations, and key supplier notes.'
  }
];

export const preDepartureChecklist = [
  'Confirm passport validity, visa requirements, and any destination-specific entry rules.',
  'Review your arrival brief, transfer contact details, and first-night supplier information.',
  'Share dietary, mobility, health, or celebration notes before final supplier confirmation.',
  'Carry travel insurance that covers disruption, medical support, and activity-specific needs where relevant.'
];

export const helpTopics = [
  {
    title: 'Booking and payment timing',
    copy: 'We outline deposit schedules, supplier deadlines, and when balance payments are due before confirmation.'
  },
  {
    title: 'Arrival planning',
    copy: 'Every confirmed itinerary includes pickup details, check-in expectations, and a primary contact path.'
  },
  {
    title: 'Changes and disruptions',
    copy: 'If a supplier or transport plan changes, we step in to help coordinate the next best option.'
  }
];

export const policyPages = {
  privacy: {
    title: 'Privacy policy',
    description:
      'How Everest Expeditions collects, stores, and uses traveler information during inquiry, planning, and confirmed travel support.',
    sections: [
      {
        heading: 'What we collect',
        body:
          'We collect inquiry details such as names, contact details, travel dates, party size, budgets, destination interests, and trip notes so we can evaluate and respond to a request.'
      },
      {
        heading: 'How we use it',
        body:
          'We use traveler information to respond to inquiries, prepare itineraries, coordinate suppliers, support confirmed trips, and improve planning operations.'
      },
      {
        heading: 'Data sharing',
        body:
          'We only share the information needed to operate a trip with relevant suppliers, partners, or service providers involved in delivery and support.'
      },
      {
        heading: 'Retention and requests',
        body:
          'Traveler data is retained only as long as operationally necessary or legally required. Guests may request updates or deletion where appropriate.'
      }
    ]
  },
  terms: {
    title: 'Terms of service',
    description:
      'The operating terms for using the Everest Expeditions website, sending an inquiry, and working with our planning team.',
    sections: [
      {
        heading: 'Website use',
        body:
          'Website content is provided for planning and informational purposes. Destination examples and itinerary structures do not guarantee availability until confirmed in writing.'
      },
      {
        heading: 'Quotes and confirmations',
        body:
          'Pricing and supplier availability can change until a traveler accepts a proposal and required payments are completed.'
      },
      {
        heading: 'Third-party suppliers',
        body:
          'Trips may involve third-party stays, guides, transport operators, and activity providers. Their service terms apply alongside ours where relevant.'
      },
      {
        heading: 'Traveler responsibilities',
        body:
          'Travelers remain responsible for passport validity, visas, insurance, health disclosures, and providing accurate guest details during booking.'
      }
    ]
  },
  cancellation: {
    title: 'Cancellation policy',
    description:
      'How deposits, supplier commitments, and itinerary changes are handled once planning or confirmations are underway.',
    sections: [
      {
        heading: 'Planning-stage changes',
        body:
          'Before supplier confirmation, itinerary direction can usually be revised. Some special-order planning work may still be non-refundable once delivered.'
      },
      {
        heading: 'Post-confirmation cancellations',
        body:
          'Once suppliers are confirmed, cancellation penalties depend on the property, transport, guide, and event services attached to the booking.'
      },
      {
        heading: 'Force majeure and disruptions',
        body:
          'In cases of disruption, we work to recover value or alternate arrangements through suppliers, but final outcomes depend on each supplier’s terms.'
      },
      {
        heading: 'Recommended protection',
        body:
          'We strongly recommend travel insurance with trip interruption and cancellation coverage before any non-refundable commitments are made.'
      }
    ]
  }
};

export const allStaticRoutes = [
  '/',
  '/destinations',
  '/experiences',
  '/stories',
  '/about',
  '/contact',
  '/booking',
  '/safety',
  '/help',
  '/privacy',
  '/terms',
  '/cancellation'
];

export function getDestinationBySlug(slug) {
  return destinations.find((item) => item.slug === slug) ?? null;
}

export function getExperienceBySlug(slug) {
  return experiences.find((item) => item.slug === slug) ?? null;
}

export function getStoryBySlug(slug) {
  return stories.find((item) => item.slug === slug) ?? null;
}
