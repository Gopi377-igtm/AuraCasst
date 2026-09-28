/**
 * AuraCast: Location-Aware & Climate-Driven Food Suggestion Engine
 * Dynamically tailors culinary recommendations to BOTH the specific city/region
 * and the occurred meteorological conditions, complete with appetizing images and
 * direct redirecting links to Swiggy.
 */

export const CLIMATE_TYPES = {
  RAINY: 'rainy',
  COLD: 'cold',
  HOT: 'hot',
  STORMY: 'stormy',
  OVERCAST: 'overcast',
  PLEASANT: 'pleasant'
};

// Meal Time Categories (Accurate strictly to user-specified timing constraints)
export const MEAL_TIMES = {
  TIFFINS: 'tiffins',
  LUNCH: 'lunch',
  EVENING_CHILL: 'evening_chill',
  DINNER: 'dinner',
  // Backward-compatibility aliases
  MORNING: 'tiffins',
  AFTERNOON: 'lunch',
  EVENING: 'evening_chill',
  NIGHT: 'dinner'
};

// Meal Time Metadata reflecting exact timing constraints
export const MEAL_TIME_METADATA = {
  [MEAL_TIMES.TIFFINS]: {
    key: MEAL_TIMES.TIFFINS,
    label: 'Early Morning Tiffins',
    shortLabel: 'Tiffins',
    emoji: '🌅',
    timeRange: 'Early Morning – 10:30 AM',
    tagline: 'Warm morning brews, crisp dosas, soft idlis, medu vadas, poha, upma & energizing breakfast tiffins'
  },
  [MEAL_TIMES.LUNCH]: {
    key: MEAL_TIMES.LUNCH,
    label: 'Afternoon Lunch',
    shortLabel: 'Lunch',
    emoji: '☀️',
    timeRange: '11:00 AM – 3:00 PM',
    tagline: 'Hearty regional thalis, dum biryanis, wholesome rice bowls & satisfying midday meals'
  },
  [MEAL_TIMES.EVENING_CHILL]: {
    key: MEAL_TIMES.EVENING_CHILL,
    label: 'Evening Chill Foods',
    shortLabel: 'Evening Chill',
    emoji: '🌇',
    timeRange: '3:00 PM – 7:00 PM',
    tagline: 'Hot mirchi bajji, crispy samosas, pakodas, street chaats, pav bhaji & cutting chai'
  },
  [MEAL_TIMES.DINNER]: {
    key: MEAL_TIMES.DINNER,
    label: 'Night Dinner Delights',
    shortLabel: 'Dinner',
    emoji: '🌙',
    timeRange: '7:01 PM – 12:00 AM',
    tagline: 'Sizzling dum biryani handis, rich curries, butter garlic naan, kebabs & comforting dinner meals'
  }
};


// Recognized Culinary Regional Hubs
export const REGIONS = {
  MUMBAI: 'MUMBAI',
  DELHI: 'DELHI',
  HYDERABAD: 'HYDERABAD',
  BANGALORE: 'BANGALORE',
  KOLKATA: 'KOLKATA',
  CHENNAI: 'CHENNAI',
  PUNJAB: 'PUNJAB',
  RAJASTHAN: 'RAJASTHAN',
  KERALA: 'KERALA',
  GOA: 'GOA',
  TOKYO: 'TOKYO',
  NEW_YORK: 'NEW_YORK',
  SAN_FRANCISCO: 'SAN_FRANCISCO',
  LONDON: 'LONDON',
  PARIS: 'PARIS',
  ITALY: 'ITALY',
  GLOBAL: 'GLOBAL'
};

/**
 * Intelligent Location Recognizer:
 * Analyzes location name, country, and admin1 to identify regional culinary culture.
 */
export function detectLocationRegion(location = {}) {
  const name = (location?.name || '').toLowerCase();
  const country = (location?.country || '').toLowerCase();
  const admin1 = (location?.admin1 || '').toLowerCase();
  const admin2 = (location?.admin2 || '').toLowerCase();
  const combined = `${name} ${admin1} ${admin2} ${country}`;

  // Mumbai & Maharashtra
  if (/mumbai|bombay|thane|navi mumbai|pune|nashik|nagpur|aurangabad|chhatrapati sambhajinagar|solapur|kolhapur|maharashtra/.test(combined)) {
    return REGIONS.MUMBAI;
  }

  // Delhi & NCR
  if (/delhi|new delhi|noida|greater noida|gurgaon|gurugram|ghaziabad|faridabad|meerut/.test(combined)) {
    return REGIONS.DELHI;
  }

  // Hyderabad & Telangana / Andhra Pradesh
  if (/hyderabad|secunderabad|warangal|telangana|andhra|vijayawada|visakhapatnam|vizag|guntur|tirupati|kurnool/.test(combined)) {
    return REGIONS.HYDERABAD;
  }

  // Bangalore & Karnataka
  if (/bangalore|bengaluru|mysore|mysuru|mangalore|mangaluru|hubli|belgaum|belagavi|udupi|karnataka/.test(combined)) {
    return REGIONS.BANGALORE;
  }

  // Kolkata & Bengal / Eastern India
  if (/kolkata|calcutta|howrah|darjeeling|siliguri|durgapur|asansol|bengal|west bengal|bhubaneswar|odisha|cuttack|bihar|patna|assam|guwahati/.test(combined)) {
    return REGIONS.KOLKATA;
  }

  // Chennai & Tamil Nadu
  if (/chennai|madras|coimbatore|madurai|trichy|tiruchirappalli|salem|tirunelveli|vellore|tamil nadu|tamil/.test(combined)) {
    return REGIONS.CHENNAI;
  }

  // Punjab & Chandigarh & Haryana
  if (/punjab|amritsar|ludhiana|jalandhar|chandigarh|haryana|patiala|bathinda|mohali|panipat|ambala/.test(combined)) {
    return REGIONS.PUNJAB;
  }

  // Rajasthan & Gujarat
  if (/jaipur|udaipur|jodhpur|kota|bikaner|ajmer|rajasthan|ahmedabad|surat|vadodara|rajkot|gandhinagar|gujarat/.test(combined)) {
    return REGIONS.RAJASTHAN;
  }

  // Kerala
  if (/kochi|cochin|thiruvananthapuram|trivandrum|kozhikode|calicut|kannur|thrissur|kollam|alappuzha|kerala/.test(combined)) {
    return REGIONS.KERALA;
  }

  // Goa
  if (/goa|panaji|panjim|margao|vasco|mapusa|calangute/.test(combined)) {
    return REGIONS.GOA;
  }

  // Awadh / Central India (Lucknow, Kanpur, Agra, Varanasi, Bhopal, Indore)
  if (/lucknow|kanpur|agra|varanasi|banaras|prayagraj|allahabad|bhopal|indore|gwalior|uttar pradesh|madhya pradesh/.test(combined)) {
    return REGIONS.DELHI;
  }

  // Tokyo & Japan
  if (/tokyo|kyoto|osaka|yokohama|sapporo|japan|nihon/.test(combined)) {
    return REGIONS.TOKYO;
  }

  // New York & East Coast US
  if (/new york|nyc|brooklyn|manhattan|queens|bronx|jersey city|new jersey/.test(combined)) {
    return REGIONS.NEW_YORK;
  }

  // San Francisco & Bay Area
  if (/san francisco|sf|oakland|san jose|berkeley|silicon valley|palo alto|california/.test(combined)) {
    return REGIONS.SAN_FRANCISCO;
  }

  // London & UK
  if (/london|manchester|birmingham|leeds|glasgow|edinburgh|england|united kingdom|uk|britain/.test(combined)) {
    return REGIONS.LONDON;
  }

  // Paris & France
  if (/paris|lyon|marseille|nice|bordeaux|toulouse|france/.test(combined)) {
    return REGIONS.PARIS;
  }

  // Rome, Milan & Italy
  if (/rome|roma|milan|milano|florence|firenze|naples|napoli|venice|venezia|italy|italia/.test(combined)) {
    return REGIONS.ITALY;
  }

  // General India fallback if country is India
  if (/india|bharat/.test(combined)) {
    return REGIONS.DELHI;
  }

  return REGIONS.GLOBAL;
}

/**
 * Automatically determine the current meal time based on local/timezone hour.
 * Strictly adheres to user constraints:
 * - Early morning up to 10:30 AM: Tiffins (Breakfast / Morning Tiffins)
 * - 11:00 AM to 3:00 PM: Lunch (Lunch food suggestions only)
 * - 3:00 PM to 7:00 PM: Evening Chill (Evening chill time foods only)
 * - 7:01 PM to 12:00 AM: Dinner (Dinner items as food suggestions)
 */
export function detectCurrentMealTime(timezone = null) {
  const now = new Date();
  let hour = now.getHours() + now.getMinutes() / 60;
  if (timezone) {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      }).formatToParts(now);
      const h = Number(parts.find((p) => p.type === 'hour')?.value);
      const m = Number(parts.find((p) => p.type === 'minute')?.value || 0);
      if (!isNaN(h)) {
        hour = h + m / 60;
      }
    } catch (e) {
      // fallback to local hour
    }
  }

  // 1. Early morning up to 10:30 AM -> Tiffins
  if (hour < 10.5) {
    return MEAL_TIMES.TIFFINS;
  }
  // 2. From 11:00 AM to Afternoon 3:00 PM (10:30 to 11:00 AM transition to lunch) -> Lunch
  if (hour >= 10.5 && hour < 15.0) {
    return MEAL_TIMES.LUNCH;
  }
  // 3. From 3:00 PM to Evening 7:00 PM -> Evening Chill
  if (hour >= 15.0 && hour <= 19.016) {
    return MEAL_TIMES.EVENING_CHILL;
  }
  // 4. From 7:01 PM to Night 12:00 AM (and midnight late night) -> Dinner
  return MEAL_TIMES.DINNER;
}


/**
 * Determine the matching climate category from real-time meteorological variables.
 * Prioritizes active precipitation and storm dynamics over static temperature.
 */
export function detectClimateCategory(weather, mood) {
  const current = weather?.current;
  const tempC = current?.tempC ?? 24;
  const wmoCode = current?.wmoCode ?? 0;
  const precipitation = current?.precipitationMm ?? 0;
  const windSpeed = current?.windSpeedKm ?? 10;
  const isDay = current?.isDay ?? 1;
  const cloudCover = current?.cloudCover ?? 20;
  const moodId = mood?.id;

  // 1. Thunderstorms / Severe Squalls
  if ([95, 96, 99].includes(wmoCode) || moodId === 'stormy' || (windSpeed > 38 && precipitation > 2)) {
    return CLIMATE_TYPES.STORMY;
  }

  // 2. Rain / Drizzle / Wet Weather (Rain ALWAYS takes priority over heat or mild weather)
  if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(wmoCode) ||
    precipitation > 0.1 ||
    moodId === 'cozy'
  ) {
    return CLIMATE_TYPES.RAINY;
  }

  // 3. Snow / Chilly / Freezing Winter
  if (
    [71, 73, 75, 77, 85, 86].includes(wmoCode) ||
    tempC <= 16 ||
    moodId === 'tranquil'
  ) {
    return CLIMATE_TYPES.COLD;
  }

  // 4. Hot / Scorching Summer Heat (>= 29°C, or >= 27°C during bright sunny day)
  if (tempC >= 29 || (tempC >= 27 && isDay === 1 && [0, 1].includes(wmoCode) && moodId === 'radiant')) {
    return CLIMATE_TYPES.HOT;
  }

  // 5. Overcast / Gloomy / Dense Fog
  if ([3, 45, 48].includes(wmoCode) || cloudCover >= 80 || moodId === 'gloomy') {
    return CLIMATE_TYPES.OVERCAST;
  }

  // 6. Mild / Pleasant / Clear Breezy Fallback
  return CLIMATE_TYPES.PLEASANT;
}

/**
 * Regional Culinary Profiles Database
 * Cross-references local culinary identity with current climate condition.
 */
export const REGIONAL_FOOD_DATABASE = {
  [REGIONS.MUMBAI]: {
    regionName: 'Mumbai, Maharashtra',
    regionTitle: 'Mumbai Coastal & Street Gastronomy',
    regionEmoji: '🌊',
    climateProfiles: {
      [CLIMATE_TYPES.RAINY]: {
        headline: 'Marine Drive Monsoon Fritters & Cutting Chai',
        pairingQuote: 'Watching the Arabian Sea waves crash in the monsoon calls for piping hot Vada Pav, crispy Kanda Bhajji, and spiced cutting chai.',
        items: [
          {
            id: 'mum-rain-1',
            name: 'Mumbai Butter Vada Pav & Fried Chilies',
            category: 'Street Food',
            tag: '🌶️ Marine Drive Legend',
            vibe: 'Spiced Batata & Garlic Chutney',
            description: 'Hot spiced potato patty tucked inside a soft buttered pav, layered with fiery dry garlic coconut chutney.',
            image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~290 kcal',
            priceEstimate: '₹60 - ₹110',
            isVeg: true,
            searchQuery: 'Vada Pav Mumbai'
          },
          {
            id: 'mum-rain-2',
            name: 'Crispy Kanda Bhajji & Mumbai Cutting Chai',
            category: 'Snacks & Tea',
            tag: '🌧️ Monsoon Soulmate',
            vibe: 'Crunchy Onion Fritters & Cardamom Chai',
            description: 'Paper-thin sliced onions tossed in spiced gram flour batter and fried crispy, paired with strong ginger cutting chai.',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~270 kcal',
            priceEstimate: '₹90 - ₹150',
            isVeg: true,
            searchQuery: 'Kanda Bhaji and Cutting Chai'
          },
          {
            id: 'mum-rain-3',
            name: 'Kolhapuri Spicy Misal Pav with Farsan',
            category: 'Comfort Food',
            tag: '🔥 Fiery Maharashtra Rassa',
            vibe: 'Spicy Sprout Curry & Ladi Pav',
            description: 'Sprouted moth beans in a rich red-chili tarri gravy, crowned with crunchy farsan, lemon juice, and toasted pav.',
            image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '20-25 min',
            calories: '~380 kcal',
            priceEstimate: '₹110 - ₹180',
            isVeg: true,
            searchQuery: 'Misal Pav'
          },
          {
            id: 'mum-rain-4',
            name: 'Tawa Butter Pav Bhaji with Extra Butter',
            category: 'Street Food',
            tag: '🧈 Chowpatty Classic',
            vibe: 'Mashed Veg Curry Simmered on Tawa',
            description: 'Velvety spiced tomato and vegetable mash sizzling on a hot cast iron tawa, finished with a generous dollop of Amul butter.',
            image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-25 min',
            calories: '~460 kcal',
            priceEstimate: '₹140 - ₹220',
            isVeg: true,
            searchQuery: 'Pav Bhaji Mumbai'
          },
          {
            id: 'mum-rain-5',
            name: 'Crispy Prawn Koliwada / Paneer Koliwada',
            category: 'Snacks',
            tag: '🦐 Koli Fishermen Recipe',
            vibe: 'Red Spiced Batter Fried Seafood',
            description: 'Originating from Sion Koliwada: tender prawns or cottage cheese marinated in carom seeds, red chili, and fried crunchy.',
            image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '20-30 min',
            calories: '~340 kcal',
            priceEstimate: '₹220 - ₹340',
            isVeg: false,
            searchQuery: 'Prawn Koliwada Sion'
          },
          {
            id: 'mum-rain-6',
            name: 'Warm Ukadiche Modak with Saffron Milk',
            category: 'Sweet Treats',
            tag: '🥥 Konkan Heritage',
            vibe: 'Steamed Rice Flour Sweet Dumpling',
            description: 'Traditional steamed rice flour dumplings filled with grated fresh coconut, jaggery, cardamom, and drizzled with ghee.',
            image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-25 min',
            calories: '~240 kcal',
            priceEstimate: '₹130 - ₹200',
            isVeg: true,
            searchQuery: 'Modak Sweet'
          }
        ]
      },
      [CLIMATE_TYPES.HOT]: {
        headline: 'Chaupati Coolers & Coastal Summer Refreshments',
        pairingQuote: 'Beat the coastal Mumbai humidity with chilled royal falooda, refreshing solkadhi, and light street chaats.',
        items: [
          {
            id: 'mum-hot-1',
            name: 'Badshah Royal Kulfi Falooda with Rose & Sabja',
            category: 'Sweet Treats',
            tag: '🍨 Crawford Market Legend',
            vibe: 'Chilled Rose Milk & Dense Malai Kulfi',
            description: 'Layers of chilled rose-infused milk, delicate cornstarch vermicelli, blooming basil seeds, and malai kulfi slices.',
            image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~320 kcal',
            priceEstimate: '₹140 - ₹220',
            isVeg: true,
            searchQuery: 'Kulfi Falooda Badshah'
          },
          {
            id: 'mum-hot-2',
            name: 'Traditional Konkani Solkadhi Cooler',
            category: 'Beverages',
            tag: '🥥 Konkan Pink Cooler',
            vibe: 'Tangy Kokum & Fresh Coconut Milk',
            description: 'Chilled digestive nectar made from real kokum extract, creamy pressed coconut milk, garlic, green chili, and cilantro.',
            image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~110 kcal',
            priceEstimate: '₹80 - ₹130',
            isVeg: true,
            searchQuery: 'Solkadhi'
          },
          {
            id: 'mum-hot-3',
            name: 'Juhu Beach Dahi Sev Batata Puri (SPDP)',
            category: 'Street Food',
            tag: '✨ Crisp Beach Chaat',
            vibe: 'Chilled Spiced Yogurt & Sweet Tamarind',
            description: 'Crisp puris stuffed with boiled potato, drenched in cold sweet curd, spicy mint chutney, date paste, and nylon sev.',
            image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~220 kcal',
            priceEstimate: '₹90 - ₹150',
            isVeg: true,
            searchQuery: 'Dahi Puri Chaat'
          },
          {
            id: 'mum-hot-4',
            name: 'Ratnagiri Alphonso Mango Shake with Ice Cream',
            category: 'Beverages',
            tag: '🥭 King of Mangoes',
            vibe: 'Pure Hapus Pulp & Vanilla Scoop',
            description: 'Creamy thick shake blended with 100% authentic Devgad Alphonso mango pulp, topped with sliced mango cubes.',
            image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~260 kcal',
            priceEstimate: '₹140 - ₹220',
            isVeg: true,
            searchQuery: 'Alphonso Mango Shake'
          },
          {
            id: 'mum-hot-5',
            name: 'Natural Tender Coconut Ice Cream',
            category: 'Sweet Treats',
            tag: '🌴 Juhu Artisanal Scoops',
            vibe: 'Pure Coconut Water & Malai Cream',
            description: 'Silky frozen dessert churned from fresh tender coconut malai and natural coconut water without added preservatives.',
            image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~160 kcal',
            priceEstimate: '₹120 - ₹180',
            isVeg: true,
            searchQuery: 'Natural Tender Coconut Ice Cream'
          },
          {
            id: 'mum-hot-6',
            name: 'Bombay Grilled Vegetable Cheese Toast',
            category: 'Comfort Food',
            tag: '🧀 Street Sandwich Star',
            vibe: 'Beetroot, Cucumber & Amul Cheese',
            description: 'Triple-decker toasted bread filled with spiced potatoes, sliced beetroot, tomatoes, onions, green chutney, and cheese.',
            image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~310 kcal',
            priceEstimate: '₹110 - ₹180',
            isVeg: true,
            searchQuery: 'Bombay Grilled Sandwich'
          }
        ]
      },
      default: {
        headline: 'Iconic Mumbai Street Favorites & Coastal Comforts',
        pairingQuote: 'From the butter-soaked sizzle of Chowpatty Pav Bhaji to spicy Kolhapuri Misal and Marine Drive Vada Pav, Mumbai delivers street-food ecstasy.',
        items: [
          {
            id: 'mum-def-1',
            name: 'Mumbai Butter Vada Pav & Fried Chilies',
            category: 'Street Food',
            tag: '🌶️ Marine Drive Legend',
            vibe: 'Spiced Batata & Garlic Chutney',
            description: 'Hot spiced potato patty tucked inside a soft buttered pav, layered with fiery dry garlic coconut chutney.',
            image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~290 kcal',
            priceEstimate: '₹60 - ₹110',
            isVeg: true,
            searchQuery: 'Vada Pav Mumbai'
          },
          {
            id: 'mum-def-2',
            name: 'Tawa Butter Pav Bhaji with Extra Butter',
            category: 'Street Food',
            tag: '🧈 Chowpatty Classic',
            vibe: 'Mashed Veg Curry Simmered on Tawa',
            description: 'Velvety spiced tomato and vegetable mash sizzling on a hot cast iron tawa, finished with a generous dollop of Amul butter.',
            image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-25 min',
            calories: '~460 kcal',
            priceEstimate: '₹140 - ₹220',
            isVeg: true,
            searchQuery: 'Pav Bhaji Mumbai'
          },
          {
            id: 'mum-def-3',
            name: 'Crispy Kanda Bhajji & Mumbai Cutting Chai',
            category: 'Snacks & Tea',
            tag: '🌧️ Monsoon Soulmate',
            vibe: 'Crunchy Onion Fritters & Cardamom Chai',
            description: 'Paper-thin sliced onions tossed in spiced gram flour batter and fried crispy, paired with strong ginger cutting chai.',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~270 kcal',
            priceEstimate: '₹90 - ₹150',
            isVeg: true,
            searchQuery: 'Kanda Bhaji and Cutting Chai'
          },
          {
            id: 'mum-def-4',
            name: 'Kolhapuri Spicy Misal Pav with Farsan',
            category: 'Comfort Food',
            tag: '🔥 Fiery Maharashtra Rassa',
            vibe: 'Spicy Sprout Curry & Ladi Pav',
            description: 'Sprouted moth beans in a rich red-chili tarri gravy, crowned with crunchy farsan, lemon juice, and toasted pav.',
            image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '20-25 min',
            calories: '~380 kcal',
            priceEstimate: '₹110 - ₹180',
            isVeg: true,
            searchQuery: 'Misal Pav'
          },
          {
            id: 'mum-def-5',
            name: 'Bombay Grilled Vegetable Cheese Toast',
            category: 'Comfort Food',
            tag: '🧀 Street Sandwich Star',
            vibe: 'Beetroot, Cucumber & Amul Cheese',
            description: 'Triple-decker toasted bread filled with spiced potatoes, sliced beetroot, tomatoes, onions, green chutney, and cheese.',
            image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~310 kcal',
            priceEstimate: '₹110 - ₹180',
            isVeg: true,
            searchQuery: 'Bombay Grilled Sandwich'
          },
          {
            id: 'mum-def-6',
            name: 'Badshah Royal Kulfi Falooda with Rose & Sabja',
            category: 'Sweet Treats',
            tag: '🍨 Crawford Market Legend',
            vibe: 'Chilled Rose Milk & Dense Malai Kulfi',
            description: 'Layers of chilled rose-infused milk, delicate cornstarch vermicelli, blooming basil seeds, and malai kulfi slices.',
            image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~320 kcal',
            priceEstimate: '₹140 - ₹220',
            isVeg: true,
            searchQuery: 'Kulfi Falooda Badshah'
          }
        ]
      }
    }
  },

  [REGIONS.DELHI]: {
    regionName: 'Delhi & NCR',
    regionTitle: 'Capital Street Classics & Mughlai Feasts',
    regionEmoji: '🏛️',
    climateProfiles: {
      [CLIMATE_TYPES.COLD]: {
        headline: 'Old Delhi Winter Warmers & Tandoori Feasts',
        pairingQuote: 'Crisp Delhi winter chills call for piping hot Chole Bhature, rich Butter Chicken with Garlic Naan, and slow-cooked Gajar Ka Halwa.',
        items: [
          {
            id: 'del-cold-1',
            name: 'Old Delhi Chole Bhature with Pickled Onions',
            category: 'Hearty Meals',
            tag: '👑 Chandni Chowk Legend',
            vibe: 'Fluffy Bhaturas & Pindi Chole',
            description: 'Deep-fried golden bhaturas served with dark spiced Punjabi chickpeas, tangy pickled carrots, and green chilies.',
            image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-25 min',
            calories: '~520 kcal',
            priceEstimate: '₹140 - ₹220',
            isVeg: true,
            searchQuery: 'Chole Bhature'
          },
          {
            id: 'del-cold-2',
            name: 'Aslam Style Butter Chicken with Garlic Naan',
            category: 'Hearty Meals',
            tag: '🔥 Jama Masjid Sensation',
            vibe: 'Roasted Tandoori Tikka in Molten Butter',
            description: 'Smoky char-grilled chicken tossed in seasoned curd gravy and drenched in bubbling hot Amul butter with crisp garlic naan.',
            image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '25-35 min',
            calories: '~560 kcal',
            priceEstimate: '₹320 - ₹460',
            isVeg: false,
            searchQuery: 'Butter Chicken and Garlic Naan'
          },
          {
            id: 'del-cold-3',
            name: 'Slow-Simmered Dal Makhani with Bukhara Notes',
            category: 'Comfort Food',
            tag: '🍲 24-Hour Hearth Simmer',
            vibe: 'Whole Black Lentils & Butter Cream',
            description: 'Black lentils slow-cooked overnight over glowing charcoal with tomatoes, cream, and pure butter for incomparable depth.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '25-30 min',
            calories: '~420 kcal',
            priceEstimate: '₹220 - ₹340',
            isVeg: true,
            searchQuery: 'Dal Makhani'
          },
          {
            id: 'del-cold-4',
            name: 'Gajar Ka Halwa in Pure Desi Ghee & Khoya',
            category: 'Sweet Treats',
            tag: '🥕 Red Winter Carrot Royalty',
            vibe: 'Simmered Khoya & Roasted Cashews',
            description: 'Winter red Delhi carrots grated and slow-roasted in desi ghee, milk solids, green cardamom, and toasted pistachios.',
            image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-25 min',
            calories: '~380 kcal',
            priceEstimate: '₹150 - ₹240',
            isVeg: true,
            searchQuery: 'Gajar Halwa'
          },
          {
            id: 'del-cold-5',
            name: 'Chandni Chowk Stuffed Parathas & Sweet Lassi',
            category: 'Hearty Meals',
            tag: '🌾 Paranthe Wali Gali',
            vibe: 'Spiced Aloo, Gobhi & Paneer Stuffing',
            description: 'Crisp shallow-fried whole-wheat parathas served with pumpkin curry, mint chutney, and tamarind banana pickle.',
            image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '20-25 min',
            calories: '~440 kcal',
            priceEstimate: '₹120 - ₹190',
            isVeg: true,
            searchQuery: 'Stuffed Paratha'
          },
          {
            id: 'del-cold-6',
            name: 'Hot Saffron Rabdi with Crisp Jalebi',
            category: 'Sweet Treats',
            tag: '🍯 Winter Morning Delight',
            vibe: 'Spiraled Golden Jalebis in Thick Rabdi',
            description: 'Hot, crunchy, syrup-filled jalebis served straight from the kadai over chilled, condensed saffron milk rabdi.',
            image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~410 kcal',
            priceEstimate: '₹130 - ₹210',
            isVeg: true,
            searchQuery: 'Jalebi Rabdi'
          }
        ]
      },
      default: {
        headline: 'Capital Street Classics & Mughlai Feasts',
        pairingQuote: 'Crisp Chandni Chowk parathas, aromatic Butter Chicken, dark Pindi Chole Bhature, and rich Dal Makhani define Delhi\'s royal culinary soul.',
        items: [
          {
            id: 'del-def-1',
            name: 'Old Delhi Chole Bhature with Pickled Onions',
            category: 'Hearty Meals',
            tag: '👑 Chandni Chowk Legend',
            vibe: 'Fluffy Bhaturas & Pindi Chole',
            description: 'Deep-fried golden bhaturas served with dark spiced Punjabi chickpeas, tangy pickled carrots, and green chilies.',
            image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-25 min',
            calories: '~520 kcal',
            priceEstimate: '₹140 - ₹220',
            isVeg: true,
            searchQuery: 'Chole Bhature'
          },
          {
            id: 'del-def-2',
            name: 'Aslam Style Butter Chicken with Garlic Naan',
            category: 'Hearty Meals',
            tag: '🔥 Jama Masjid Sensation',
            vibe: 'Roasted Tandoori Tikka in Molten Butter',
            description: 'Smoky char-grilled chicken tossed in seasoned curd gravy and drenched in bubbling hot Amul butter with crisp garlic naan.',
            image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '25-35 min',
            calories: '~560 kcal',
            priceEstimate: '₹320 - ₹460',
            isVeg: false,
            searchQuery: 'Butter Chicken and Garlic Naan'
          },
          {
            id: 'del-def-3',
            name: 'Slow-Simmered Dal Makhani with Bukhara Notes',
            category: 'Comfort Food',
            tag: '🍲 24-Hour Hearth Simmer',
            vibe: 'Whole Black Lentils & Butter Cream',
            description: 'Black lentils slow-cooked overnight over glowing charcoal with tomatoes, cream, and pure butter for incomparable depth.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '25-30 min',
            calories: '~420 kcal',
            priceEstimate: '₹220 - ₹340',
            isVeg: true,
            searchQuery: 'Dal Makhani'
          },
          {
            id: 'del-def-4',
            name: 'Chandni Chowk Stuffed Parathas & Sweet Lassi',
            category: 'Hearty Meals',
            tag: '🌾 Paranthe Wali Gali',
            vibe: 'Spiced Aloo, Gobhi & Paneer Stuffing',
            description: 'Crisp shallow-fried whole-wheat parathas served with pumpkin curry, mint chutney, and tamarind banana pickle.',
            image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '20-25 min',
            calories: '~440 kcal',
            priceEstimate: '₹120 - ₹190',
            isVeg: true,
            searchQuery: 'Stuffed Paratha'
          },
          {
            id: 'del-def-5',
            name: 'Gajar Ka Halwa in Pure Desi Ghee & Khoya',
            category: 'Sweet Treats',
            tag: '🥕 Red Winter Carrot Royalty',
            vibe: 'Simmered Khoya & Roasted Cashews',
            description: 'Winter red Delhi carrots grated and slow-roasted in desi ghee, milk solids, green cardamom, and toasted pistachios.',
            image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-25 min',
            calories: '~380 kcal',
            priceEstimate: '₹150 - ₹240',
            isVeg: true,
            searchQuery: 'Gajar Halwa'
          },
          {
            id: 'del-def-6',
            name: 'Hot Saffron Rabdi with Crisp Jalebi',
            category: 'Sweet Treats',
            tag: '🍯 Winter Morning Delight',
            vibe: 'Spiraled Golden Jalebis in Thick Rabdi',
            description: 'Hot, crunchy, syrup-filled jalebis served straight from the kadai over chilled, condensed saffron milk rabdi.',
            image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~410 kcal',
            priceEstimate: '₹130 - ₹210',
            isVeg: true,
            searchQuery: 'Jalebi Rabdi'
          }
        ]
      }
    }
  },

  [REGIONS.HYDERABAD]: {
    regionName: 'Hyderabad & Andhra Pradesh',
    regionTitle: 'Nizami Biryanis & Andhra Gastronomy',
    regionEmoji: '👑',
    climateProfiles: {
      default: {
        headline: 'Authentic Hyderabadi & Andhra Specialties',
        pairingQuote: 'From royal sealed coal dum biryanis to fiery Andhra karam dosas and Charminar Irani chai.',
        items: [
          // --- MORNING: Breakfast & Tiffins ---
          {
            id: 'hyd-morn-1',
            name: 'Babai Hotel Ghee Karam Dosa with Allam Pachadi',
            category: 'Street Food',
            tag: '🧈 Andhra Golden Legend',
            vibe: 'Ghee Roasted Thin Crepe & Fiery Red Podi',
            description: 'Crispy golden crepe doused in pure desi ghee, layered with spicy red chili garlic podi, served with sweet-tangy ginger chutney.',
            image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~310 kcal',
            priceEstimate: '₹90 - ₹150',
            isVeg: true,
            mealTimes: ['morning'],
            climates: ['rainy', 'pleasant', 'cold', 'overcast'],
            mealBadge: '🌅 Breakfast',
            climateBadge: '🌧️ Morning Classic',
            searchQuery: 'Ghee Karam Dosa'
          },
          {
            id: 'hyd-morn-2',
            name: 'Steaming Ghee Idli with Karampodi & Sambar',
            category: 'Comfort Food',
            tag: '☁️ Cloud Soft Andhra Tiffin',
            vibe: 'Piping Hot Idlis Drenched in Pure Ghee',
            description: 'Melt-in-mouth steamed rice and lentil cakes showered with roasted lentil gunpowder, served with hot drumstick sambar.',
            image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '10-15 min',
            calories: '~220 kcal',
            priceEstimate: '₹70 - ₹120',
            isVeg: true,
            mealTimes: ['morning'],
            climates: ['rainy', 'hot', 'cold', 'pleasant', 'overcast'],
            mealBadge: '🌅 Breakfast',
            climateBadge: '✨ Steamy Comfort',
            searchQuery: 'Ghee Podi Idli'
          },
          {
            id: 'hyd-morn-3',
            name: 'Crispy Medu Vada with Coconut Chutney',
            category: 'Street Food',
            tag: '⭐ Golden Crunch Classic',
            vibe: 'Crispy Peppercorn Lentil Donuts',
            description: 'Deep-fried golden urad dal fritters studded with crushed black pepper, ginger, and curry leaves with fresh coconut dip.',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~280 kcal',
            priceEstimate: '₹60 - ₹110',
            isVeg: true,
            mealTimes: ['morning'],
            climates: ['rainy', 'pleasant', 'cold', 'stormy'],
            mealBadge: '🌅 Breakfast',
            climateBadge: '🌧️ Monsoon Crisp',
            searchQuery: 'Medu Vada Sambar'
          },
          {
            id: 'hyd-morn-4',
            name: 'Andhra Pesarattu Upma with Allam Chutney',
            category: 'Comfort Food',
            tag: '🌿 Coastal Andhra Heritage',
            vibe: 'Green Moong Crepe Stuffed with Semolina Upma',
            description: 'Wholesome protein-rich green gram crepe cooked crisp, stuffed with spicy roasted upma, served with allam ginger chutney.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~330 kcal',
            priceEstimate: '₹90 - ₹140',
            isVeg: true,
            mealTimes: ['morning'],
            climates: ['rainy', 'pleasant', 'cold', 'hot'],
            mealBadge: '🌅 Breakfast',
            climateBadge: '☀️ Energizing',
            searchQuery: 'Pesarattu Upma'
          },
          {
            id: 'hyd-morn-5',
            name: 'South Indian Filter Kaapi & Irani Chai',
            category: 'Beverages',
            tag: '☕ Aromatic Frothy Brew',
            vibe: 'Chicory Roasted Beans & Frothy Steamed Milk',
            description: 'Traditional slow-dripped chicory-infused strong coffee frothed in stainless steel dabara set with steaming fresh milk.',
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '5-10 min',
            calories: '~95 kcal',
            priceEstimate: '₹40 - ₹80',
            isVeg: true,
            mealTimes: ['morning', 'evening'],
            climates: ['rainy', 'cold', 'stormy', 'overcast', 'pleasant'],
            mealBadge: '🌅 Morning Brew',
            climateBadge: '🌧️ Soul Warmer',
            searchQuery: 'Filter Coffee'
          },

          // --- AFTERNOON: Hearty Lunch & Midday Meals ---
          {
            id: 'hyd-noon-1',
            name: 'Authentic Hyderabadi Dum Mutton Biryani',
            category: 'Hearty Meals',
            tag: '👑 Nizam\'s Royal Masterpiece',
            vibe: 'Saffron Basmati & Marinated Tender Meat',
            description: 'Long-grain basmati layered with succulent spiced meat, cooked on sealed coal dum with rose water, saffron, and mint.',
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '25-35 min',
            calories: '~580 kcal',
            priceEstimate: '₹280 - ₹440',
            isVeg: false,
            mealTimes: ['afternoon', 'night'],
            climates: ['rainy', 'stormy', 'pleasant', 'cold', 'hot'],
            mealBadge: '☀️ Lunch',
            climateBadge: '🔥 Royal Handi',
            searchQuery: 'Hyderabadi Mutton Biryani'
          },
          {
            id: 'hyd-noon-2',
            name: 'Hyderabadi Chicken Dum Biryani Handi',
            category: 'Hearty Meals',
            tag: '🍗 Golden Saffron Basmati',
            vibe: 'Fragrant Kacchi Dum Chicken & Salan',
            description: 'Tender bone-in chicken marinated in yogurt and Hyderabadi pot spices, slow dum-cooked with aged basmati rice and brown onions.',
            image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '25-30 min',
            calories: '~520 kcal',
            priceEstimate: '₹240 - ₹380',
            isVeg: false,
            mealTimes: ['afternoon', 'night'],
            climates: ['rainy', 'stormy', 'pleasant', 'cold', 'hot'],
            mealBadge: '☀️ Lunch',
            climateBadge: '🍗 All-Weather Star',
            searchQuery: 'Hyderabadi Chicken Biryani'
          },
          {
            id: 'hyd-noon-3',
            name: 'Fiery Andhra Gongura Mutton / Chicken with Rice',
            category: 'Hearty Meals',
            tag: '🌶️ Tangy Gongura Delicacy',
            vibe: 'Sorrel Leaf Puree Simmered with Tender Meat',
            description: 'Signature Andhra dish of succulent meat simmered in tangy red sorrel (gongura) leaf masala, best mixed with hot rice and ghee.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '25-35 min',
            calories: '~490 kcal',
            priceEstimate: '₹260 - ₹390',
            isVeg: false,
            mealTimes: ['afternoon'],
            climates: ['rainy', 'cold', 'pleasant', 'stormy'],
            mealBadge: '☀️ Lunch',
            climateBadge: '🌶️ Andhra Fire',
            searchQuery: 'Gongura Mutton Rice'
          },
          {
            id: 'hyd-noon-4',
            name: 'Classic Andhra Bhojanam (South Indian Meals Thali)',
            category: 'Hearty Meals',
            tag: '🍚 Grand Traditional Thali',
            vibe: 'Pappu, Ghee, Avakaya, Rasam, Sambar & Curd',
            description: 'Wholesome Andhra feast with Mudda Pappu, pure ghee, fiery Avakaya mango pickle, spiced rasam, kootu, curd, and crunchy papad.',
            image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-25 min',
            calories: '~460 kcal',
            priceEstimate: '₹150 - ₹240',
            isVeg: true,
            mealTimes: ['afternoon'],
            climates: ['pleasant', 'hot', 'rainy', 'overcast'],
            mealBadge: '☀️ Lunch',
            climateBadge: '🌾 Authentic Feast',
            searchQuery: 'Andhra Meals Thali'
          },
          {
            id: 'hyd-noon-5',
            name: 'Cooling Perugu Annam (Curd Rice) & Spiced Majjiga',
            category: 'Comfort Food',
            tag: '🥥 Summer Digestive Bliss',
            vibe: 'Tempered Creamy Curd Rice & Chilled Buttermilk',
            description: 'Fresh homemade curd mixed with soft rice, tempered with mustard, ginger, curry leaves, and pomegranate, paired with salted buttermilk.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '10-15 min',
            calories: '~280 kcal',
            priceEstimate: '₹80 - ₹140',
            isVeg: true,
            mealTimes: ['afternoon', 'night'],
            climates: ['hot', 'pleasant'],
            mealBadge: '☀️ Lunch Cooler',
            climateBadge: '☀️ Heat Buster',
            searchQuery: 'Curd Rice Buttermilk'
          },

          // --- EVENING: Chai, Street Bites & Snacks ---
          {
            id: 'hyd-eve-1',
            name: 'Andhra Stuffed Mirchi Bajji with Ajwain & Onions',
            category: 'Street Food',
            tag: '🌶️ Coastal Street Sensation',
            vibe: 'Besan Fried Bhavnagri Chili Stuffed with Spiced Onion',
            description: 'Plump green chilies stuffed with carom seeds and lemon-tossed chopped onions, dipped in spiced chickpea batter and double-fried crispy.',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~260 kcal',
            priceEstimate: '₹60 - ₹100',
            isVeg: true,
            mealTimes: ['evening'],
            climates: ['rainy', 'stormy', 'pleasant', 'cold'],
            mealBadge: '🌇 Evening Snack',
            climateBadge: '🌧️ Monsoon Legend',
            searchQuery: 'Mirchi Bajji'
          },
          {
            id: 'hyd-eve-2',
            name: 'Hot Crispy Punugulu with Spicy Allam Chutney',
            category: 'Street Food',
            tag: '🟡 Vijayawada Street Classic',
            vibe: 'Deep-Fried Fermented Batter Crisps',
            description: 'Bite-sized crispy fritters made from fermented idli-dosa batter, fried golden and served with fiery tomato-ginger red chutney.',
            image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~240 kcal',
            priceEstimate: '₹60 - ₹100',
            isVeg: true,
            mealTimes: ['evening'],
            climates: ['rainy', 'stormy', 'pleasant', 'cold'],
            mealBadge: '🌇 Evening Snack',
            climateBadge: '🌧️ Rain Craving',
            searchQuery: 'Punugulu'
          },
          {
            id: 'hyd-eve-3',
            name: 'Irani Chai with Sweet & Salty Osmania Biscuits',
            category: 'Snacks & Tea',
            tag: '☕ Charminar Heritage',
            vibe: 'Slow Brewed Milk Tea & Crumbly Biscuits',
            description: 'Slow-brewed strong tea blended with rich condensed milk, paired with sweet and salty crumbly Osmania bakery biscuits.',
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '10-15 min',
            calories: '~190 kcal',
            priceEstimate: '₹80 - ₹140',
            isVeg: true,
            mealTimes: ['evening', 'morning'],
            climates: ['rainy', 'cold', 'overcast', 'pleasant', 'stormy'],
            mealBadge: '🌇 Evening Chai',
            climateBadge: '☕ Timeless Classic',
            searchQuery: 'Irani Chai Osmania Biscuits'
          },
          {
            id: 'hyd-eve-4',
            name: 'Hyderabadi Chicken 65 with Crispy Curry Leaves',
            category: 'Snacks',
            tag: '🍗 Fiery Red Appetizer',
            vibe: 'Crispy Curry Leaves & Red Chili Toss',
            description: 'Bite-sized chicken chunks marinated in ginger, garlic, red chilies, and tossed crisp with mustard seeds and fresh curry leaves.',
            image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '20-25 min',
            calories: '~340 kcal',
            priceEstimate: '₹220 - ₹320',
            isVeg: false,
            mealTimes: ['evening', 'night'],
            climates: ['rainy', 'pleasant', 'cold', 'stormy'],
            mealBadge: '🌇 Evening / Dinner',
            climateBadge: '🔥 Spicy Crunch',
            searchQuery: 'Chicken 65 Hyderabad'
          },
          {
            id: 'hyd-eve-5',
            name: 'Chilled Royal Falooda with Rose Milk & Sabja',
            category: 'Sweet Treats',
            tag: '🍨 Summer Refreshment',
            vibe: 'Cooling Rose Milk, Vermicelli & Vanilla Ice Cream',
            description: 'Layers of chilled rose syrup, hydrated basil seeds, silky vermicelli noodles, chilled milk, and a scoop of royal vanilla ice cream.',
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '10-15 min',
            calories: '~340 kcal',
            priceEstimate: '₹120 - ₹190',
            isVeg: true,
            mealTimes: ['evening', 'night'],
            climates: ['hot', 'pleasant'],
            mealBadge: '🌇 Evening Chiller',
            climateBadge: '☀️ Summer Cooler',
            searchQuery: 'Royal Falooda'
          },

          // --- NIGHT: Dinner & Late-Night Comfort ---
          {
            id: 'hyd-nite-1',
            name: 'Royal Hyderabadi Mutton Dum Biryani Handi',
            category: 'Hearty Meals',
            tag: '🌙 Nizam\'s Midnight Feast',
            vibe: 'Dum-Cooked Spiced Tender Mutton & Raita',
            description: 'Clay-pot sealed dum biryani served piping hot with fiery Mirchi ka Salan, cool cucumber onion raita, and boiled egg.',
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '25-35 min',
            calories: '~590 kcal',
            priceEstimate: '₹290 - ₹460',
            isVeg: false,
            mealTimes: ['night', 'afternoon'],
            climates: ['rainy', 'cold', 'pleasant', 'stormy', 'hot'],
            mealBadge: '🌙 Dinner',
            climateBadge: '👑 Ultimate Feast',
            searchQuery: 'Hyderabadi Dum Biryani'
          },
          {
            id: 'hyd-nite-2',
            name: 'Andhra Chilli Chicken with Hot Rumali Roti',
            category: 'Hearty Meals',
            tag: '🌶️ Green Chili Infusion',
            vibe: 'Spicy Green Chili Chicken & Paper-Thin Rotis',
            description: 'Tender chicken pieces sautéed in aromatic green chili paste, onions, and curry leaves, wrapped inside paper-thin hot rumali rotis.',
            image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '20-25 min',
            calories: '~410 kcal',
            priceEstimate: '₹230 - ₹340',
            isVeg: false,
            mealTimes: ['night'],
            climates: ['rainy', 'cold', 'pleasant', 'stormy'],
            mealBadge: '🌙 Dinner',
            climateBadge: '🌶️ Andhra Kick',
            searchQuery: 'Andhra Chilli Chicken'
          },
          {
            id: 'hyd-nite-3',
            name: 'Rich Hyderabadi Mutton Haleem with Ghee',
            category: 'Comfort Food',
            tag: '🍲 Slow Simmered Meat & Wheat',
            vibe: 'Pounded Mutton, Broken Wheat & Clarified Butter',
            description: 'Slow-cooked for 8 hours with broken wheat, lentils, tender meat, and aromatics, topped with barista onions, lemon, and mint.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-30 min',
            calories: '~470 kcal',
            priceEstimate: '₹240 - ₹380',
            isVeg: false,
            mealTimes: ['night'],
            climates: ['rainy', 'cold', 'stormy', 'overcast'],
            mealBadge: '🌙 Dinner',
            climateBadge: '🍲 Comfort Bowl',
            searchQuery: 'Hyderabadi Haleem'
          },
          {
            id: 'hyd-nite-4',
            name: 'Paneer Butter Masala with Butter Garlic Naan',
            category: 'Comfort Food',
            tag: '🧈 Silky Cashew Tomato Makhani',
            vibe: 'Tandoori Baked Naan & Creamy Cottage Cheese',
            description: 'Fresh paneer cubes simmered in a velvet tomato, cashew, and butter gravy, paired with sizzling garlic coriander butter naan.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-25 min',
            calories: '~450 kcal',
            priceEstimate: '₹180 - ₹280',
            isVeg: true,
            mealTimes: ['night', 'afternoon'],
            climates: ['rainy', 'cold', 'pleasant', 'overcast'],
            mealBadge: '🌙 Dinner',
            climateBadge: '🧈 Vegetarian Delight',
            searchQuery: 'Paneer Butter Masala Garlic Naan'
          },
          {
            id: 'hyd-nite-5',
            name: 'Royal Double Ka Meetha with Saffron Rabdi',
            category: 'Sweet Treats',
            tag: '🍯 Royal Bread Pudding',
            vibe: 'Ghee Fried Bread Soaked in Cardamom Milk',
            description: 'Golden fried crusty bread triangles soaked in rich saffron cardamom rabdi, crowned with slivered almonds and silver vark.',
            image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~390 kcal',
            priceEstimate: '₹140 - ₹210',
            isVeg: true,
            mealTimes: ['night'],
            climates: ['rainy', 'cold', 'pleasant', 'hot'],
            mealBadge: '🌙 Dessert',
            climateBadge: '🍯 Sweet Finish',
            searchQuery: 'Double Ka Meetha'
          },
          {
            id: 'hyd-nite-6',
            name: 'Traditional Matka Malai Kulfi on Stick',
            category: 'Sweet Treats',
            tag: '🍨 Rich Dense Milk Delicacy',
            vibe: 'Slow Reduced Full Cream Milk & Cardamom',
            description: 'Slow-simmered rabri frozen in earthenware pots, infused with green cardamom, saffron strands, and roasted pistachios.',
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '5-10 min',
            calories: '~210 kcal',
            priceEstimate: '₹70 - ₹120',
            isVeg: true,
            mealTimes: ['night', 'evening'],
            climates: ['hot', 'pleasant'],
            mealBadge: '🌙 Dessert',
            climateBadge: '☀️ Summer Chill',
            searchQuery: 'Matka Kulfi'
          }
        ]
      }
    }
  },

  [REGIONS.BANGALORE]: {
    regionName: 'Bangalore / Bengaluru, Karnataka',
    regionTitle: 'Garden City Dosa & Filter Coffee Culture',
    regionEmoji: '☕',
    climateProfiles: {
      default: {
        headline: 'Crisp Benne Dosas & Aromatic Filter Kaapi',
        pairingQuote: 'Bangalore\'s year-round pleasant weather is made for buttery Vidyarthi Bhavan-style Benne Dosas, Bisi Bele Bath, and freshly brewed filter coffee.',
        items: [
          {
            id: 'blr-1',
            name: 'Davangere Benne Dosa with Aloo Palya',
            category: 'Comfort Food',
            tag: '🧈 Melting Butter Dosa',
            vibe: 'Crisp Golden Crust & White Butter',
            description: 'Thick, spongy, and golden-crisp crepe roasted lavishly in fresh homemade butter, served with spicy coconut chutney and potato mash.',
            image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~360 kcal',
            priceEstimate: '₹110 - ₹180',
            isVeg: true,
            searchQuery: 'Benne Dosa'
          },
          {
            id: 'blr-2',
            name: 'Traditional Bisi Bele Bath with Boondi',
            category: 'Hearty Meals',
            tag: '🍲 Spiced Rice-Lentil Elixir',
            vibe: 'Nutmeg, Cinnamon & Desi Ghee Aroma',
            description: 'Karnataka\'s signature spicy rice, pigeon peas, and seasonal vegetables cooked with special aromatic Bisi Bele powder and pure ghee.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '20-25 min',
            calories: '~370 kcal',
            priceEstimate: '₹130 - ₹190',
            isVeg: true,
            searchQuery: 'Bisi Bele Bath'
          },
          {
            id: 'blr-3',
            name: 'Frothy Degree Filter Coffee in Brass Dabarah',
            category: 'Beverages',
            tag: '☕ Chikmagalur Plantation Roast',
            vibe: 'Dark Chicory Decoction & Boiled Milk',
            description: 'Freshly roasted plantation coffee beans extracted via slow gravity drip, frothed to perfection in traditional brassware.',
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '10-15 min',
            calories: '~110 kcal',
            priceEstimate: '₹60 - ₹110',
            isVeg: true,
            searchQuery: 'Filter Coffee'
          },
          {
            id: 'blr-4',
            name: 'Crunchy Maddur Vada with Coconut Chutney',
            category: 'Snacks & Tea',
            tag: '🧅 Crispy Onion & Rice Flour Fritter',
            vibe: 'Golden Crunchy Tea-Time Bite',
            description: 'Crispy fried patty made with semolina, rice flour, thinly sliced onions, curry leaves, and green chilies.',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~260 kcal',
            priceEstimate: '₹70 - ₹120',
            isVeg: true,
            searchQuery: 'Maddur Vada'
          },
          {
            id: 'blr-5',
            name: 'Royal Ghee Mysore Pak',
            category: 'Sweet Treats',
            tag: '👑 Palace of Mysore Recipe',
            vibe: 'Melt-in-Mouth Gram Flour Sweet',
            description: 'Legendary delicacy invented in the royal kitchens of Mysore: roasted chickpea flour simmered in pure ghee and sugar syrup.',
            image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~410 kcal',
            priceEstimate: '₹140 - ₹220',
            isVeg: true,
            searchQuery: 'Mysore Pak'
          },
          {
            id: 'blr-6',
            name: 'Soft Mangalore Buns with Coconut Chutney',
            category: 'Comfort Food',
            tag: '🍌 Sweet Banana Puri',
            vibe: 'Fermented Banana & Cumin Dough',
            description: 'Fluffy, mildly sweet deep-fried bread made with mashed ripe bananas, flour, and yogurt. Soft inside and golden outside.',
            image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~280 kcal',
            priceEstimate: '₹90 - ₹150',
            isVeg: true,
            searchQuery: 'Mangalore Buns'
          }
        ]
      }
    }
  },

  [REGIONS.KOLKATA]: {
    regionName: 'Kolkata, West Bengal',
    regionTitle: 'City of Joy Street Rolls & Sweet Delicacies',
    regionEmoji: '🎭',
    climateProfiles: {
      default: {
        headline: 'Park Street Rolls & Iconic Bengali Confections',
        pairingQuote: 'Flaky Nizam Kathi rolls, spicy Puchkas, and velvet Mishti Doi capture Kolkata\'s soul in every weather condition.',
        items: [
          {
            id: 'kol-1',
            name: 'Park Street Double Egg Chicken Kathi Roll',
            category: 'Street Food',
            tag: '🌯 Nizam\'s Kolkata Original',
            vibe: 'Flaky Paratha & Smoky Charred Chicken',
            description: 'Golden layered paratha fried with double eggs, packed with succulent chicken kebabs, raw red onions, and zesty lime juice.',
            image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~390 kcal',
            priceEstimate: '₹140 - ₹220',
            isVeg: false,
            searchQuery: 'Kolkata Kathi Roll'
          },
          {
            id: 'kol-2',
            name: 'Piping Hot Luchi with Cholar Dal',
            category: 'Comfort Food',
            tag: '🌾 Bengali Festive Breakfast',
            vibe: 'Puffed Refined Flour Bread & Coconut Lentils',
            description: 'Delicate, deep-fried puffed bread served with sweet-savory Bengal gram lentils tempered with coconut chips and hing.',
            image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '20-25 min',
            calories: '~410 kcal',
            priceEstimate: '₹130 - ₹190',
            isVeg: true,
            searchQuery: 'Luchi Cholar Dal'
          },
          {
            id: 'kol-3',
            name: 'Earthen Pot Baked Sweet Mishti Doi',
            category: 'Sweet Treats',
            tag: '🍯 Matka Caramelized Yogurt',
            vibe: 'Thick, Creamy & Mild Jaggery Caramel',
            description: 'Milk slow-evaporated and fermented with caramelized sugar in clay pots, yielding an extraordinarily rich, velvety texture.',
            image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '10-15 min',
            calories: '~220 kcal',
            priceEstimate: '₹80 - ₹140',
            isVeg: true,
            searchQuery: 'Mishti Doi'
          },
          {
            id: 'kol-4',
            name: 'Slow-Cooked Kosha Mangsho with Rice',
            category: 'Hearty Meals',
            tag: '🍖 Rich Bengali Mutton Curry',
            vibe: 'Dark Caramelized Onion & Mustard Oil',
            description: 'Tender mutton pieces braised on slow fire with mustard oil, whole spices, onions, and garlic until the gravy clings to the meat.',
            image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '25-35 min',
            calories: '~540 kcal',
            priceEstimate: '₹320 - ₹480',
            isVeg: false,
            searchQuery: 'Kosha Mangsho'
          },
          {
            id: 'kol-5',
            name: 'Traditional Spongy White Rosogolla',
            category: 'Sweet Treats',
            tag: '👑 Nobin Chandra Das Heritage',
            vibe: 'Spongy Fresh Chhena Soaked in Sugar Syrup',
            description: 'Delicate spheres of freshly kneaded cow milk chhena boiled in light aromatic sugar syrup until light and melt-in-mouth soft.',
            image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '10-15 min',
            calories: '~190 kcal',
            priceEstimate: '₹70 - ₹130',
            isVeg: true,
            searchQuery: 'Kolkata Rosogolla'
          },
          {
            id: 'kol-6',
            name: 'Kolkata Crispy Fish Fry with Kasundi Mustard',
            category: 'Snacks',
            tag: '🐟 Bhetki Fish Cutlet',
            vibe: 'Crumb Coated Bhetki Fillet & Pungent Kasundi',
            description: 'Fresh bhetki fish fillet marinated in coriander, green chili, and parsley, breaded in crisp crumbs and fried golden.',
            image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '20-25 min',
            calories: '~330 kcal',
            priceEstimate: '₹210 - ₹320',
            isVeg: false,
            searchQuery: 'Fish Fry Kasundi'
          }
        ]
      }
    }
  },

  [REGIONS.CHENNAI]: {
    regionName: 'Chennai, Tamil Nadu',
    regionTitle: 'Madras Tiffin & Chettinad Spiced Flavors',
    regionEmoji: '🥥',
    climateProfiles: {
      default: {
        headline: 'Crisp Ghee Podi Dosas & Steaming Sambars',
        pairingQuote: 'Paper-thin ghee roast dosas, fragrant Chettinad pepper curries, and piping hot filter kaapi deliver authentic Tamil comfort.',
        items: [
          {
            id: 'che-1',
            name: 'Crispy Ghee Podi Masala Dosa with Sambar',
            category: 'Comfort Food',
            tag: '🥞 Saravana Bhavan Style',
            vibe: 'Gunpowder Podi, Desi Ghee & Spiced Potato',
            description: 'Ultra-crispy fermented rice crepe brushed with rich molten ghee and spiced spicy lentil gunpowder, served with 3 chutneys.',
            image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~340 kcal',
            priceEstimate: '₹120 - ₹180',
            isVeg: true,
            searchQuery: 'Ghee Podi Dosa'
          },
          {
            id: 'che-2',
            name: 'Piping Hot Medu Vada Dipped in Sambar',
            category: 'Snacks & Tea',
            tag: '🍩 Golden Lentil Fritter',
            vibe: 'Crispy Outer Crust & Soft Fluffy Center',
            description: 'Black gram lentil doughnuts fried golden with crushed black peppercorns and curry leaves, submerged in piping hot drumstick sambar.',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~280 kcal',
            priceEstimate: '₹80 - ₹130',
            isVeg: true,
            searchQuery: 'Medu Vada Sambar'
          },
          {
            id: 'che-3',
            name: 'Chettinad Spicy Pepper Chicken / Paneer Curry',
            category: 'Hearty Meals',
            tag: '🌶️ Fiery Roasted Spices',
            vibe: 'Kalpasi, Star Anise & Fresh Black Pepper',
            description: 'Authentic Karaikudi curry cooked in freshly stone-ground Chettinad spice paste, black pepper, and toasted curry leaves.',
            image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-30 min',
            calories: '~410 kcal',
            priceEstimate: '₹220 - ₹340',
            isVeg: false,
            searchQuery: 'Chettinad Pepper Chicken'
          },
          {
            id: 'che-4',
            name: 'Traditional Ven Pongal with Ghee & Cashews',
            category: 'Comfort Food',
            tag: '🍲 Temple Style Warmth',
            vibe: 'Short-Grain Rice, Moong Dal & Cumin Ghee',
            description: 'Comforting porridge of rice and yellow lentils tempered with black peppercorns, ginger, cumin, and whole roasted cashews in ghee.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~360 kcal',
            priceEstimate: '₹100 - ₹160',
            isVeg: true,
            searchQuery: 'Ven Pongal'
          },
          {
            id: 'che-5',
            name: 'Authentic Madurai Chilled Jigarthanda',
            category: 'Beverages',
            tag: '🍨 Heart Cooler Nectar',
            vibe: 'Almond Gum, Nannari Syrup & Basundi Ice Cream',
            description: 'Legendary Tamil cooling drink crafted from herbal almond gum (badam pisin), nannari syrup, boiled milk, and rich basundi.',
            image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~280 kcal',
            priceEstimate: '₹90 - ₹150',
            isVeg: true,
            searchQuery: 'Jigarthanda Madurai'
          },
          {
            id: 'che-6',
            name: 'Madras Frothy Filter Kaapi in Tumbler',
            category: 'Beverages',
            tag: '☕ South Indian Heritage',
            vibe: 'Strong Chicory Decoction & Fresh Milk Foam',
            description: 'Brewed strong in a stainless steel drip vessel, sweetened just right and stretched between tumbler and davarah.',
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '10-15 min',
            calories: '~110 kcal',
            priceEstimate: '₹60 - ₹100',
            isVeg: true,
            searchQuery: 'Filter Coffee Chennai'
          }
        ]
      }
    }
  },

  [REGIONS.TOKYO]: {
    regionName: 'Tokyo, Japan',
    regionTitle: 'Japanese Umami & Artisanal Kitchens',
    regionEmoji: '🍜',
    climateProfiles: {
      default: {
        headline: 'Steaming Tonkotsu Bowls & Artisanal Tempura',
        pairingQuote: 'Rich collagen broths, springy ramen noodles, and crisp tempura bring warmth and authentic Japanese soul to your day.',
        items: [
          {
            id: 'tyo-1',
            name: 'Steaming Tonkotsu / Chashu Miso Ramen',
            category: 'Comfort Food',
            tag: '🍜 Tokyo Broth Master',
            vibe: 'Rich Simmered Broth & Springy Noodles',
            description: 'Slow-simmered rich umami broth paired with handmade alkaline noodles, tender chashu cuts, ajitama egg, and nori.',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-30 min',
            calories: '~490 kcal',
            priceEstimate: '₹340 - ₹520',
            isVeg: false,
            searchQuery: 'Ramen Tokyo'
          },
          {
            id: 'tyo-2',
            name: 'Crispy Japanese Tempura & Tendon Bowl',
            category: 'Comfort Food',
            tag: '🍤 Light & Crackling Batter',
            vibe: 'Shrimp, Lotus Root & Dashi Dip',
            description: 'Delicately battered and flash-fried seafood and seasonal vegetables served over steaming rice with sweet tentsuyu dashi glaze.',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '20-25 min',
            calories: '~380 kcal',
            priceEstimate: '₹280 - ₹440',
            isVeg: false,
            searchQuery: 'Tempura Bowl'
          },
          {
            id: 'tyo-3',
            name: 'Pan-Seared Pork or Veg Gyoza Dumplings',
            category: 'Snacks',
            tag: '🥟 Crispy Bottom & Juicy Steamed Top',
            vibe: 'Minced Cabbage, Garlic & Soy-Vinegar Dip',
            description: 'Crescent-shaped Japanese potstickers with a golden lacy crisp bottom and juicy seasoned filling.',
            image: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~240 kcal',
            priceEstimate: '₹180 - ₹280',
            isVeg: true,
            searchQuery: 'Gyoza Dumplings'
          },
          {
            id: 'tyo-4',
            name: 'Japanese Katsu Curry with Sticky Rice',
            category: 'Hearty Meals',
            tag: '🍛 Sweet-Savory Golden Curry',
            vibe: 'Panko Battered Cutlet & Fragrant Gravy',
            description: 'Crispy panko-breaded cutlet served alongside rich, mildly sweet Japanese roux curry and steamed short-grain sushi rice.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-30 min',
            calories: '~540 kcal',
            priceEstimate: '₹320 - ₹490',
            isVeg: false,
            searchQuery: 'Japanese Katsu Curry'
          },
          {
            id: 'tyo-5',
            name: 'Uji Matcha Green Tea Parfait / Ice Cream',
            category: 'Sweet Treats',
            tag: '🍵 Kyoto First Harvest Matcha',
            vibe: 'Bittersweet Green Tea & Red Bean Paste',
            description: 'Authentic stone-ground green tea gelato layered with sweet azuki beans, chewy mochi balls, and matcha jelly.',
            image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~220 kcal',
            priceEstimate: '₹190 - ₹290',
            isVeg: true,
            searchQuery: 'Matcha Ice Cream'
          },
          {
            id: 'tyo-6',
            name: 'Osaka Style Takoyaki Octopus Balls',
            category: 'Street Food',
            tag: '🐙 Dotonbori Street Star',
            vibe: 'Bonito Flakes, Kewpie Mayo & Otafuku Sauce',
            description: 'Batter balls stuffed with tender diced octopus and pickled ginger, drizzled with savory brown sauce, mayonnaise, and dancing bonito flakes.',
            image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~290 kcal',
            priceEstimate: '₹220 - ₹340',
            isVeg: false,
            searchQuery: 'Takoyaki'
          }
        ]
      }
    }
  },

  [REGIONS.NEW_YORK]: {
    regionName: 'New York City, USA',
    regionTitle: 'Empire State Delis & Gotham Gourmet',
    regionEmoji: '🗽',
    climateProfiles: {
      default: {
        headline: 'NYC Thin-Crust Slices & Deli Pastrami Reubens',
        pairingQuote: 'Nothing beats a steaming fold-in-half NYC pizza slice, a hot pastrami on rye, or classic bagels to conquer Gotham\'s brisk breeze.',
        items: [
          {
            id: 'nyc-1',
            name: 'Authentic NYC Foldable Pepperoni / Cheese Slice',
            category: 'Comfort Food',
            tag: '🍕 Coal Oven Masterpiece',
            vibe: 'Crispy Base, Bubbly Mozzarella & Oregano',
            description: 'Classic oversized thin-crust slice with crushed San Marzano tomato sauce, low-moisture whole-milk mozzarella, and cupping pepperoni.',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~420 kcal',
            priceEstimate: '₹240 - ₹380',
            isVeg: true,
            searchQuery: 'New York Style Pizza'
          },
          {
            id: 'nyc-2',
            name: 'Hot Pastrami on Rye with Spicy Deli Mustard',
            category: 'Hearty Meals',
            tag: '🥪 Katz\'s Deli Heritage',
            vibe: 'Peppercorn Crusted Cured Beef & Pickles',
            description: 'Thick hand-sliced cured and smoked beef brisket steamed juicy, stacked high between seeded rye bread with spicy brown mustard.',
            image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-25 min',
            calories: '~520 kcal',
            priceEstimate: '₹340 - ₹510',
            isVeg: false,
            searchQuery: 'Pastrami Sandwich'
          },
          {
            id: 'nyc-3',
            name: 'New York Sourdough Bagel with Lox & Cream Cheese',
            category: 'Comfort Food',
            tag: '🥯 Boiled & Baked Brooklyn Bagel',
            vibe: 'Everything Seasoning & Smoked Salmon',
            description: 'Chewy malt-boiled bagel coated in garlic, onion, poppy and sesame seeds, slathered with cream cheese, capers, and smoked salmon.',
            image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~360 kcal',
            priceEstimate: '₹260 - ₹390',
            isVeg: false,
            searchQuery: 'Bagel with Cream Cheese'
          },
          {
            id: 'nyc-4',
            name: 'Classic Double Smash Cheeseburger with Special Sauce',
            category: 'Hearty Meals',
            tag: '🍔 Griddled Crust Patty',
            vibe: 'American Melt, Crispy Edges & Brioche Bun',
            description: 'Two thin beef or plant-based patties smashed searing hot on the flat-top for caramelized lacy edges, melted cheese, and pickles.',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-25 min',
            calories: '~560 kcal',
            priceEstimate: '₹280 - ₹420',
            isVeg: false,
            searchQuery: 'Smash Cheeseburger'
          },
          {
            id: 'nyc-5',
            name: 'Rich New York Cheesecake with Berry Compote',
            category: 'Sweet Treats',
            tag: '🍰 Dense Gotham Royalty',
            vibe: 'Cream Cheese, Graham Crust & Vanilla Bean',
            description: 'Extra-rich, dense, and velvety baked cream cheese cake on a golden buttery graham cracker crumb crust with warm berry coulis.',
            image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~440 kcal',
            priceEstimate: '₹220 - ₹340',
            isVeg: true,
            searchQuery: 'New York Cheesecake'
          },
          {
            id: 'nyc-6',
            name: 'Hot Manhattan Clam Chowder / Tomato Bisque',
            category: 'Comfort Food',
            tag: '🥣 Velvety Warm Soup',
            vibe: 'Roasted Tomato, Basil & Sourdough Toast',
            description: 'Savory broth simmered with ripe plum tomatoes, herbs, vegetables, and tender bites, served with crispy oyster crackers.',
            image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~210 kcal',
            priceEstimate: '₹190 - ₹280',
            isVeg: true,
            searchQuery: 'Tomato Soup and Grilled Cheese'
          }
        ]
      }
    }
  },

  [REGIONS.SAN_FRANCISCO]: {
    regionName: 'San Francisco, California',
    regionTitle: 'Bay Area Sourdough & Farm-to-Table Fare',
    regionEmoji: '🌁',
    climateProfiles: {
      default: {
        headline: 'Fisherman\'s Wharf Sourdough & Mission Burritos',
        pairingQuote: 'Karl the Fog and cool Pacific ocean breezes pair wonderfully with clam chowder bread bowls and fresh Mission burritos.',
        items: [
          {
            id: 'sf-1',
            name: 'Boudin Sourdough Bread Bowl with Clam Chowder',
            category: 'Comfort Food',
            tag: '🌁 Fisherman\'s Wharf Icon',
            vibe: 'Tangy Artisan Sourdough & Creamy Chowder',
            description: 'Hollowed-out freshly baked crusty San Francisco wild-yeast sourdough round filled to the brim with rich New England style chowder.',
            image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-25 min',
            calories: '~490 kcal',
            priceEstimate: '₹310 - ₹480',
            isVeg: true,
            searchQuery: 'Clam Chowder Bread Bowl'
          },
          {
            id: 'sf-2',
            name: 'Mission District Super Burrito with Guacamole',
            category: 'Hearty Meals',
            tag: '🌯 Mission Street Legend',
            vibe: 'Warm Flour Tortilla, Cilantro Rice & Salsa',
            description: 'Giant griddled flour tortilla stuffed with spiced beans, Mexican rice, avocado guacamole, sour cream, pico de gallo, and Monterey Jack.',
            image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~580 kcal',
            priceEstimate: '₹260 - ₹390',
            isVeg: true,
            searchQuery: 'Mission Burrito'
          },
          {
            id: 'sf-3',
            name: 'Fresh California Avocado Toast with Microgreens',
            category: 'Healthy Bites',
            tag: '🥑 Pacific Farm-to-Table',
            vibe: 'Mashed Hass Avocado, Chili Flakes & Seeded Bread',
            description: 'Toasted organic multi-grain loaf spread thick with seasoned Hass avocado, cherry tomatoes, radish slices, and lemon EVOO.',
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~260 kcal',
            priceEstimate: '₹190 - ₹280',
            isVeg: true,
            searchQuery: 'Avocado Toast'
          },
          {
            id: 'sf-4',
            name: 'Ghirardelli Warm Chocolate Lava Cake',
            category: 'Sweet Treats',
            tag: '🍫 Bay Square Heritage',
            vibe: 'Molten Dark Chocolate Center & Vanilla Scoop',
            description: 'Indulgent dark chocolate soufflé cake with a warm flowing cocoa core, dusted with powdered sugar and vanilla bean ice cream.',
            image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~420 kcal',
            priceEstimate: '₹230 - ₹350',
            isVeg: true,
            searchQuery: 'Chocolate Lava Cake'
          },
          {
            id: 'sf-5',
            name: 'Artisan Pour-Over Blue Bottle Style Coffee',
            category: 'Beverages',
            tag: '☕ Single Origin Roast',
            vibe: 'Hand Dripped Ethiopian Arabica',
            description: 'Freshly ground light-roast specialty coffee brewed slow using a ceramic dripper to highlight floral, stone fruit notes.',
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '10-15 min',
            calories: '~15 kcal',
            priceEstimate: '₹160 - ₹250',
            isVeg: true,
            searchQuery: 'Pour Over Coffee'
          },
          {
            id: 'sf-6',
            name: 'Crispy Garlic Parmesan Fries with Aioli',
            category: 'Snacks',
            tag: '🍟 Oracle Park Classic',
            vibe: 'Roasted Garlic Oil & Shaved Parmesan',
            description: 'Hot skin-on russet potato fries tossed in roasted garlic confit, parsley, sea salt, and aged parmesan with herb aioli.',
            image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~330 kcal',
            priceEstimate: '₹170 - ₹260',
            isVeg: true,
            searchQuery: 'Garlic Parmesan Fries'
          }
        ]
      }
    }
  },

  [REGIONS.LONDON]: {
    regionName: 'London, United Kingdom',
    regionTitle: 'British Pub Classics & Traditional Tea',
    regionEmoji: '🎡',
    climateProfiles: {
      default: {
        headline: 'Golden Fish & Chips and Afternoon Cream Tea',
        pairingQuote: 'Misty London skies and Thames drizzles call for golden beer-battered fish with tartar sauce, hearty cottage pie, and steaming Earl Grey.',
        items: [
          {
            id: 'lon-1',
            name: 'Crispy Beer-Battered Fish & Chips with Tartar',
            category: 'Comfort Food',
            tag: '🐟 British Crown Classic',
            vibe: 'Flaky Atlantic Cod & Thick Cut Chips',
            description: 'Fresh cod fillet in a light, bubbly ale batter fried golden and served with chunky chips, mushy peas, and lemon tartar sauce.',
            image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-25 min',
            calories: '~520 kcal',
            priceEstimate: '₹340 - ₹510',
            isVeg: false,
            searchQuery: 'Fish and Chips'
          },
          {
            id: 'lon-2',
            name: 'English Shepherd\'s Pie with Herb Mash',
            category: 'Hearty Meals',
            tag: '🥧 Slow-Braised Hearth Stew',
            vibe: 'Minced Meat, Carrots & Broiled Potato Crust',
            description: 'Slow-simmered seasoned meat and vegetables in rich rosemary gravy, topped with fluffy creamed potatoes baked golden brown.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '25-35 min',
            calories: '~470 kcal',
            priceEstimate: '₹310 - ₹460',
            isVeg: false,
            searchQuery: 'Shepherds Pie'
          },
          {
            id: 'lon-3',
            name: 'Traditional Afternoon Tea with Scones & Clotted Cream',
            category: 'Snacks & Tea',
            tag: '🫖 Royal High Tea Heritage',
            vibe: 'Warm Scones, Strawberry Jam & Earl Grey',
            description: 'Freshly baked English buttermilk scones served with thick Devonshire clotted cream, artisan fruit preserve, and fragrant tea.',
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~340 kcal',
            priceEstimate: '₹220 - ₹340',
            isVeg: true,
            searchQuery: 'English Afternoon Tea'
          },
          {
            id: 'lon-4',
            name: 'Warm Sticky Toffee Pudding with Custard',
            category: 'Sweet Treats',
            tag: '🍯 Decadent Sponge Dessert',
            vibe: 'Medjool Date Cake & Warm Butter Toffee',
            description: 'Moist date sponge cake smothered in rich buttery toffee sauce and served with warm vanilla custard or vanilla ice cream.',
            image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~430 kcal',
            priceEstimate: '₹240 - ₹360',
            isVeg: true,
            searchQuery: 'Sticky Toffee Pudding'
          },
          {
            id: 'lon-5',
            name: 'Chicken Tikka Masala with Pilau Rice',
            category: 'Hearty Meals',
            tag: '🍛 Britain\'s Favorite Curry',
            vibe: 'Spiced Tomato Cream Gravy & Basmati',
            description: 'Invented in the UK: char-grilled chicken tikka pieces simmered in a spiced tomato cream sauce flavored with fenugreek.',
            image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '20-30 min',
            calories: '~490 kcal',
            priceEstimate: '₹290 - ₹430',
            isVeg: false,
            searchQuery: 'Chicken Tikka Masala'
          },
          {
            id: 'lon-6',
            name: 'Golden Sausage Roll with English Mustard',
            category: 'Snacks',
            tag: '🥐 Flaky Puff Pastry',
            vibe: 'Herbed Pork or Veggie Filling',
            description: 'Seasoned minced filling wrapped in buttery, multi-layered puff pastry baked until shatteringly crisp and golden.',
            image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80',
            rating: '4.7',
            prepTime: '15-20 min',
            calories: '~310 kcal',
            priceEstimate: '₹140 - ₹220',
            isVeg: false,
            searchQuery: 'Sausage Roll Bakery'
          }
        ]
      }
    }
  },

  [REGIONS.PUNJAB]: {
    regionName: 'Punjab & Chandigarh',
    regionTitle: 'Clay Oven Tandoor & Desi Ghee Feasts',
    regionEmoji: '🧈',
    climateProfiles: {
      default: {
        headline: 'Golden Amritsari Kulchas & Clay Tandoor Classics',
        pairingQuote: 'Clay oven tandoor heat, melting white butter over flaky kulchas, and thick malai lassis bring hearty Punjabi joy to any weather.',
        items: [
          {
            id: 'pun-1',
            name: 'Crisp Amritsari Stuffed Aloo Kulcha & Chole',
            category: 'Hearty Meals',
            tag: '🧈 Amritsar Legend',
            vibe: 'Flaky Tandoori Bread & Dark Spiced Chole',
            description: 'Tandoor-baked flaky bread stuffed with spiced potatoes and onions, topped with melting butter and served with tangy Punjabi chole.',
            image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-25 min',
            calories: '~490 kcal',
            priceEstimate: '₹140 - ₹220',
            isVeg: true,
            searchQuery: 'Amritsari Kulcha Chole'
          },
          {
            id: 'pun-2',
            name: 'Sarson Ka Saag with Makki Di Roti & Makhan',
            category: 'Comfort Food',
            tag: '🌿 Pind Heritage',
            vibe: 'Mustard Greens & Fresh Homemade White Butter',
            description: 'Slow-simmered winter mustard greens cooked with ginger, garlic, and green chilies, served with maize flatbread and gur.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '25-30 min',
            calories: '~420 kcal',
            priceEstimate: '₹180 - ₹280',
            isVeg: true,
            searchQuery: 'Sarson Ka Saag Makki Roti'
          },
          {
            id: 'pun-3',
            name: 'Smoky Char-Grilled Tandoori Murgh / Paneer Tikka',
            category: 'Snacks',
            tag: '🔥 Tandoor Master',
            vibe: 'Hung Curd Marinade, Mustard Oil & Mint Dip',
            description: 'Marinated in Kashmiri red chili, aromatic garam masala, and roasted in hot clay oven with charred edges and lemon wedges.',
            image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-25 min',
            calories: '~360 kcal',
            priceEstimate: '₹240 - ₹380',
            isVeg: false,
            searchQuery: 'Tandoori Tikka'
          },
          {
            id: 'pun-4',
            name: 'Patiala Shahi Thick Sweet Lassi with Malai',
            category: 'Beverages',
            tag: '🥛 Giant Brass Glass',
            vibe: 'Churned Yogurt, Cardamom & Clotted Cream',
            description: 'Creamy sweet yogurt churned in traditional wooden madhani, topped with a thick layer of clotted malai and rose syrup.',
            image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '10-15 min',
            calories: '~310 kcal',
            priceEstimate: '₹90 - ₹150',
            isVeg: true,
            searchQuery: 'Patiala Lassi'
          },
          {
            id: 'pun-5',
            name: 'Slow-Simmered Dal Makhani with Garlic Naan',
            category: 'Comfort Food',
            tag: '🍲 12-Hour Charcoal Simmer',
            vibe: 'Whole Urad Dal & Pure Cream',
            description: 'Black lentils and kidney beans slow-simmered overnight over charcoal embers, finished with butter, fresh cream, and fenugreek.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-25 min',
            calories: '~410 kcal',
            priceEstimate: '₹190 - ₹310',
            isVeg: true,
            searchQuery: 'Dal Makhani Garlic Naan'
          },
          {
            id: 'pun-6',
            name: 'Piping Hot Jalebi with Creamy Rabdi',
            category: 'Sweet Treats',
            tag: '🍯 Golden Spirals',
            vibe: 'Crispy Saffron Jalebis in Thick Condensed Milk',
            description: 'Freshly fried crispy fermented spirals soaked in cardamom syrup, served hot alongside chilled slow-reduced creamy rabdi.',
            image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~390 kcal',
            priceEstimate: '₹120 - ₹190',
            isVeg: true,
            searchQuery: 'Jalebi Rabdi'
          }
        ]
      }
    }
  },

  [REGIONS.RAJASTHAN]: {
    regionName: 'Rajasthan & Jaipur',
    regionTitle: 'Royal Rajputana Spices & Ghee Confections',
    regionEmoji: '🏰',
    climateProfiles: {
      default: {
        headline: 'Royal Dal Baati Churma & Crispy Pyaaz Kachoris',
        pairingQuote: 'Sun-drenched forts and desert winds celebrate pure desi ghee, crushed baatis, and fiery street kachoris.',
        items: [
          {
            id: 'raj-1',
            name: 'Traditional Rajasthani Dal Baati Churma',
            category: 'Hearty Meals',
            tag: '👑 Royal Rajputana Feast',
            vibe: 'Baked Dough Baatis Drowned in Pure Ghee',
            description: 'Crisp baked wheat flour dough balls crushed and dipped in hot desi ghee, served with panchmel dal, spicy garlic chutney, and sweet churma.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '25-35 min',
            calories: '~590 kcal',
            priceEstimate: '₹220 - ₹360',
            isVeg: true,
            searchQuery: 'Dal Baati Churma'
          },
          {
            id: 'raj-2',
            name: 'Jodhpur Crispy Pyaaz Ki Kachori with Chutneys',
            category: 'Snacks & Tea',
            tag: '🧅 Rawat Mishthan Bhandar Style',
            vibe: 'Flaky Pastry Stuffed with Spiced Onion Mash',
            description: 'Flaky, crisp golden pastry filled with a fragrant mixture of caramelized onions, fennel seeds, and roasted garam spices.',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~320 kcal',
            priceEstimate: '₹70 - ₹130',
            isVeg: true,
            searchQuery: 'Pyaaz Kachori'
          },
          {
            id: 'raj-3',
            name: 'Spicy Jodhpur Mirchi Vada with Mint Chutney',
            category: 'Street Food',
            tag: '🌶️ Marwar Fire',
            vibe: 'Batter Fried Bhavnagri Chili & Spiced Potato',
            description: 'Large mild green chilies slit and stuffed with seasoned potato mash, coated in spiced gram flour batter and fried crunchy.',
            image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~260 kcal',
            priceEstimate: '₹60 - ₹110',
            isVeg: true,
            searchQuery: 'Mirchi Vada Jodhpur'
          },
          {
            id: 'raj-4',
            name: 'Royal Gatte Ki Sabzi with Bajra Roti',
            category: 'Comfort Food',
            tag: '🍲 Tangy Curd Curry',
            vibe: 'Gram Flour Dumplings in Yogurt Gravy',
            description: 'Soft boiled gram flour cylinders simmered in a spiced, velvety yogurt and mustard seed gravy, served with pearl millet flatbread.',
            image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '20-25 min',
            calories: '~360 kcal',
            priceEstimate: '₹160 - ₹250',
            isVeg: true,
            searchQuery: 'Gatte Ki Sabzi'
          },
          {
            id: 'raj-5',
            name: 'Honeycomb Malai Ghevar with Saffron & Rabdi',
            category: 'Sweet Treats',
            tag: '🍯 Teej Festival Royalty',
            vibe: 'Crispy Disc Soaked in Syrup & Pistachios',
            description: 'Intricate porous honeycomb sweet cake soaked in aromatic saffron sugar syrup, blanketed with thick malai rabdi and silver vark.',
            image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~410 kcal',
            priceEstimate: '₹140 - ₹240',
            isVeg: true,
            searchQuery: 'Malai Ghevar'
          },
          {
            id: 'raj-6',
            name: 'Chilled Gulab Shikanji Cooler with Mint',
            category: 'Beverages',
            tag: '🧊 Desert Oasis Refreshment',
            vibe: 'Fresh Lime, Rose Petals, Black Salt & Cumin',
            description: 'Traditional spiced lemonade blended with rose syrup, crushed cumin, mint leaves, and black rock salt for instant refreshment.',
            image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '10-15 min',
            calories: '~120 kcal',
            priceEstimate: '₹70 - ₹120',
            isVeg: true,
            searchQuery: 'Shikanji Cooler'
          }
        ]
      }
    }
  },

  [REGIONS.KERALA]: {
    regionName: 'Kerala & Kochi',
    regionTitle: 'God\'s Own Country Spices & Coconut Delights',
    regionEmoji: '🌴',
    climateProfiles: {
      default: {
        headline: 'Flaky Malabar Parottas & Aromatic Coconut Curries',
        pairingQuote: 'Lush tropical breezes, fresh curry leaves, and pressed coconut milk bring soulful Kerala warmth to your plate.',
        items: [
          {
            id: 'ker-1',
            name: 'Flaky Layered Malabar Parotta with Chicken Roast',
            category: 'Hearty Meals',
            tag: '🌴 Malabar Legend',
            vibe: 'Multi-Fold Crispy Flatbread & Semi-Dry Curry',
            description: 'Spiral-beaten flaky layered flatbread roasted with ghee, paired with spicy Kerala chicken or mushroom roast.',
            image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-25 min',
            calories: '~480 kcal',
            priceEstimate: '₹170 - ₹280',
            isVeg: false,
            searchQuery: 'Malabar Parotta Chicken Roast'
          },
          {
            id: 'ker-2',
            name: 'Lacy Soft Appam with Vegetable / Stew',
            category: 'Comfort Food',
            tag: '🥥 Coconut Milk Perfection',
            vibe: 'Fermented Rice Crepe & Cardamom Coconut Broth',
            description: 'Bowl-shaped fermented rice pancake with a soft spongy center and crispy lace rim, paired with aromatic coconut milk vegetable stew.',
            image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~310 kcal',
            priceEstimate: '₹130 - ₹200',
            isVeg: true,
            searchQuery: 'Appam Stew'
          },
          {
            id: 'ker-3',
            name: 'Steamed Puttu with Kadala Curry & Pappadam',
            category: 'Comfort Food',
            tag: '🌾 Traditional Breakfast',
            vibe: 'Steamed Rice Cylinders Layered with Coconut',
            description: 'Steamed cylinders of coarse rice flour layered with grated coconut, served with spicy brown chickpea curry and crispy pappadam.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~340 kcal',
            priceEstimate: '₹110 - ₹170',
            isVeg: true,
            searchQuery: 'Puttu Kadala Curry'
          },
          {
            id: 'ker-4',
            name: 'Crispy Sweet Pazham Pori (Banana Fritters)',
            category: 'Snacks & Tea',
            tag: '🍌 Tea Stall Classic',
            vibe: 'Ripe Nendran Bananas in Crispy Turmeric Batter',
            description: 'Sweet ripe Kerala plantains sliced lengthwise, dipped in a golden turmeric-cardamom batter, and fried crisp. Perfect with tea.',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~240 kcal',
            priceEstimate: '₹70 - ₹120',
            isVeg: true,
            searchQuery: 'Pazham Pori Banana Fritters'
          },
          {
            id: 'ker-5',
            name: 'Karimeen Pollichathu / Banana Leaf Fish Roast',
            category: 'Hearty Meals',
            tag: '🐟 Backwater Specialty',
            vibe: 'Shallots, Curry Leaves & Coconut Oil Roast',
            description: 'Pearl spot fish marinated in fiery ground spices, pan-seared with onion-tomato masala, and baked inside a charred plantain leaf.',
            image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '25-35 min',
            calories: '~380 kcal',
            priceEstimate: '₹280 - ₹440',
            isVeg: false,
            searchQuery: 'Karimeen Pollichathu'
          },
          {
            id: 'ker-6',
            name: 'Rich Palada Payasam with Roasted Cashews',
            category: 'Sweet Treats',
            tag: '🍯 Temple Onam Feast',
            vibe: 'Steamed Rice Flakes in Slow-Simmered Pink Milk',
            description: 'Rice flakes cooked for hours in reduced sweet milk until taking on a natural delicate pink hue, garnished with ghee-roasted cashews.',
            image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~310 kcal',
            priceEstimate: '₹110 - ₹180',
            isVeg: true,
            searchQuery: 'Palada Payasam'
          }
        ]
      }
    }
  },

  [REGIONS.GOA]: {
    regionName: 'Goa & Konkan',
    regionTitle: 'Coastal Shacks & Indo-Portuguese Gastronomy',
    regionEmoji: '🏖️',
    climateProfiles: {
      default: {
        headline: 'Coastal Goan Curries & Fresh Rava Seafood',
        pairingQuote: 'Palm-fringed beaches, gentle sea tides, and tangy kokum coconut curries make every Goan dish feel like a tropical holiday.',
        items: [
          {
            id: 'goa-1',
            name: 'Authentic Goan Fish / Prawn Curry with Steamed Rice',
            category: 'Hearty Meals',
            tag: '🥥 Konkan Beach Classic',
            vibe: 'Fresh Coconut, Kokum & Kashmiri Chilies',
            description: 'Fresh seafood simmered in a silky, tangy curry of pressed coconut milk, ground spices, garlic, and sun-dried kokum rinds.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-30 min',
            calories: '~440 kcal',
            priceEstimate: '₹260 - ₹390',
            isVeg: false,
            searchQuery: 'Goan Fish Curry Rice'
          },
          {
            id: 'goa-2',
            name: 'Crispy Rava Fried Prawns / Surmai with Lemon',
            category: 'Snacks',
            tag: '🦐 Crunchy Beach Fry',
            vibe: 'Spiced Recheado Paste & Semolina Crust',
            description: 'Seafood marinated in tangy red chili vinegar paste, crusted in coarse semolina, and shallow-fried golden crunchy.',
            image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~330 kcal',
            priceEstimate: '₹240 - ₹380',
            isVeg: false,
            searchQuery: 'Rava Fried Prawns Goa'
          },
          {
            id: 'goa-3',
            name: 'Rich Goan Chicken Xacuti with Poee Bread',
            category: 'Hearty Meals',
            tag: '🍗 Roasted Coconut & Poppy Seeds',
            vibe: 'Complex Indo-Portuguese Spiced Gravy',
            description: 'Tender chicken braised in a complex sauce of toasted coconut, white poppy seeds, nutmeg, star anise, and whole coriander.',
            image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '25-35 min',
            calories: '~490 kcal',
            priceEstimate: '₹280 - ₹420',
            isVeg: false,
            searchQuery: 'Chicken Xacuti Goa'
          },
          {
            id: 'goa-4',
            name: 'Warm Goan Poee Bread with Spicy Chorizo / Cutlet',
            category: 'Street Food',
            tag: '🍞 Village Baker Heritage',
            vibe: 'Bran Pockets & Spiced Sausage Filling',
            description: 'Fresh wheat bran pocket bread baked in wood-fired village ovens, stuffed with spicy Goan sausage or potato vegetable cutlet.',
            image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~360 kcal',
            priceEstimate: '₹140 - ₹220',
            isVeg: false,
            searchQuery: 'Goan Poi'
          },
          {
            id: 'goa-5',
            name: 'Multi-Layered Traditional Goan Bebinca Dessert',
            category: 'Sweet Treats',
            tag: '👑 Queen of Goan Sweets',
            vibe: 'Coconut Milk, Egg Yolks & Nutmeg Layers',
            description: 'Legendary seven-layer Indo-Portuguese pudding made with rich coconut milk, ghee, sugar, and nutmeg, baked layer upon layer.',
            image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~380 kcal',
            priceEstimate: '₹160 - ₹250',
            isVeg: true,
            searchQuery: 'Goan Bebinca'
          },
          {
            id: 'goa-6',
            name: 'Chilled Coconut Water & Kokum Fuzion Cooler',
            category: 'Beverages',
            tag: '🥥 Beach Shack Revitalizer',
            vibe: 'Fresh Tender Coconut & Wild Kokum Juice',
            description: 'Electrolyte-rich fresh tender coconut water infused with tangy wild kokum syrup, mint sprigs, and crushed ice.',
            image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '10-15 min',
            calories: '~90 kcal',
            priceEstimate: '₹80 - ₹140',
            isVeg: true,
            searchQuery: 'Kokum Cooler'
          }
        ]
      }
    }
  },

  [REGIONS.PARIS]: {
    regionName: 'Paris, France',
    regionTitle: 'Haute Cuisine & Artisanal Parisian Boulangeries',
    regionEmoji: '🥐',
    climateProfiles: {
      default: {
        headline: 'Buttery French Croissants & Rich Onion Soup',
        pairingQuote: 'Misty Seine strolls and Parisian bistros call for golden flaky croissants, gratinated French onion soup, and rich hot chocolate.',
        items: [
          {
            id: 'par-1',
            name: 'Warm Flaky French Butter Croissant & Café',
            category: 'Snacks & Tea',
            tag: '🥐 Pure French Butter',
            vibe: 'Golden Shattering Flakes & Honeycomb Core',
            description: 'Hand-laminated artisanal pastry made with high-fat French butter, baked to a crisp golden exterior and cloud-soft interior.',
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '10-15 min',
            calories: '~280 kcal',
            priceEstimate: '₹140 - ₹240',
            isVeg: true,
            searchQuery: 'Butter Croissant'
          },
          {
            id: 'par-2',
            name: 'Classic French Onion Soup with Gruyère Gratin',
            category: 'Comfort Food',
            tag: '🥣 Bistro Masterpiece',
            vibe: 'Caramelized Sweet Onions & Bubbly Melted Cheese',
            description: 'Slow-caramelized onions in deep herb broth, topped with toasted sourdough croutons and blanketed in broiled Swiss Gruyère.',
            image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-25 min',
            calories: '~360 kcal',
            priceEstimate: '₹260 - ₹410',
            isVeg: true,
            searchQuery: 'French Onion Soup'
          },
          {
            id: 'par-3',
            name: 'Tender Boeuf Bourguignon / Wild Mushroom Stew',
            category: 'Hearty Meals',
            tag: '🍲 Slow Braised Burgundy Pot',
            vibe: 'Red Wine Reduction, Thyme, Carrots & Pearl Onions',
            description: 'Slow-simmered tender cuts or portobello mushrooms braised in robust Burgundy reduction with smoked bacon lardons and thyme.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '25-35 min',
            calories: '~520 kcal',
            priceEstimate: '₹380 - ₹580',
            isVeg: false,
            searchQuery: 'Boeuf Bourguignon'
          },
          {
            id: 'par-4',
            name: 'Warm Sweet Crêpes with Nutella & Strawberries',
            category: 'Sweet Treats',
            tag: '🥞 Parisian Street Cart',
            vibe: 'Thin Lacy Pancakes & Melted Cocoa Cream',
            description: 'Paper-thin delicate crêpes folded hot with hazelnut chocolate spread, freshly sliced strawberries, and powdered sugar.',
            image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~340 kcal',
            priceEstimate: '₹180 - ₹280',
            isVeg: true,
            searchQuery: 'Crepes Nutella'
          },
          {
            id: 'par-5',
            name: 'Classic French Macarons Box Assortment',
            category: 'Sweet Treats',
            tag: '✨ Ladurée Confectionery Style',
            vibe: 'Almond Flour Shells & Velvety Ganache',
            description: 'Delicate meringue cookies with ruffled feet filled with dark chocolate, pistachio, Madagascar vanilla, and raspberry preserves.',
            image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '10-15 min',
            calories: '~220 kcal',
            priceEstimate: '₹220 - ₹360',
            isVeg: true,
            searchQuery: 'French Macarons'
          },
          {
            id: 'par-6',
            name: 'Croque Monsieur Toasted Brioche with Béchamel',
            category: 'Comfort Food',
            tag: '🧀 Decadent Toasted Melt',
            vibe: 'Nutmeg Cream, Smoked Ham & Emmental Crust',
            description: 'Golden grilled sandwich layered with creamy béchamel sauce, smoked fillings, and melted cheese broiled until blistered.',
            image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~470 kcal',
            priceEstimate: '₹240 - ₹360',
            isVeg: false,
            searchQuery: 'Croque Monsieur'
          }
        ]
      }
    }
  },

  [REGIONS.ITALY]: {
    regionName: 'Rome & Milan, Italy',
    regionTitle: 'Trattoria Comforts & Wood-Fired Mastery',
    regionEmoji: '🍕',
    climateProfiles: {
      default: {
        headline: 'Authentic Neapolitan Pizza & Creamy Carbonara',
        pairingQuote: 'Crisp sourdough crusts, fresh buffalo mozzarella, aromatic basil, and velvety tiramisu bring effortless Italian passion to your table.',
        items: [
          {
            id: 'ita-1',
            name: 'Wood-Fired Neapolitan Pizza Margherita D.O.P.',
            category: 'Comfort Food',
            tag: '🍕 90-Second Blistered Crust',
            vibe: 'San Marzano Tomatoes, Buffalo Mozzarella & Basil',
            description: 'Naturally fermented dough baked at 480°C in an artisanal oven, topped with crushed sweet Italian tomatoes and fresh torn basil.',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-25 min',
            calories: '~460 kcal',
            priceEstimate: '₹310 - ₹480',
            isVeg: true,
            searchQuery: 'Neapolitan Margherita Pizza'
          },
          {
            id: 'ita-2',
            name: 'Silky Tagliatelle Carbonara with Pecorino Romano',
            category: 'Hearty Meals',
            tag: '🍝 Roman Trattoria Legend',
            vibe: 'Egg Yolk Emulsion, Black Pepper & Aged Pecorino',
            description: 'Al dente handmade egg pasta tossed off the heat with pasture-raised egg yolks, freshly cracked tellicherry pepper, and pecorino.',
            image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281023?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '20-25 min',
            calories: '~510 kcal',
            priceEstimate: '₹290 - ₹440',
            isVeg: true,
            searchQuery: 'Tagliatelle Carbonara'
          },
          {
            id: 'ita-3',
            name: 'Creamy Saffron Risotto Alla Milanese',
            category: 'Comfort Food',
            tag: '🍚 Golden Lombardy Elegance',
            vibe: 'Carnaroli Rice, Saffron Strands & Parmigiano',
            description: 'Slow-stirred Italian Carnaroli rice infused with rich vegetable or chicken broth, fragrant saffron threads, and cultured butter.',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '25-30 min',
            calories: '~430 kcal',
            priceEstimate: '₹280 - ₹420',
            isVeg: true,
            searchQuery: 'Risotto Milanese'
          },
          {
            id: 'ita-4',
            name: 'Crisp Garlic Bruschetta with Vine Tomatoes & Basil',
            category: 'Snacks',
            tag: '🥖 Tuscan Olive Oil Toast',
            vibe: 'Toasted Ciabatta, Sweet Heirloom Tomatoes & EVOO',
            description: 'Grilled country bread rubbed with raw garlic cloves, piled with diced ripe tomatoes, extra virgin olive oil, and balsamic glaze.',
            image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80',
            rating: '4.8',
            prepTime: '15-20 min',
            calories: '~210 kcal',
            priceEstimate: '₹170 - ₹260',
            isVeg: true,
            searchQuery: 'Bruschetta'
          },
          {
            id: 'ita-5',
            name: 'Authentic Venetian Tiramisu with Cocoa Dust',
            category: 'Sweet Treats',
            tag: '☕ Treviso Dessert Royalty',
            vibe: 'Savoiardi Ladyfingers & Mascarpone Zabaglione',
            description: 'Espresso-dipped crisp ladyfingers layered with whipped mascarpone cream and generous cocoa dust for the ultimate pick-me-up.',
            image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '15-20 min',
            calories: '~380 kcal',
            priceEstimate: '₹210 - ₹340',
            isVeg: true,
            searchQuery: 'Tiramisu'
          },
          {
            id: 'ita-6',
            name: 'Artisanal Italian Pistachio & Stracciatella Gelato',
            category: 'Sweet Treats',
            tag: '🍨 Dense Churned Italian Cream',
            vibe: 'Sicilian Bronte Pistachio & Dark Chocolate Shards',
            description: 'Slow-churned, ultra-dense authentic Italian gelato made with whole milk, roasted Sicilian pistachio paste, and bittersweet chocolate.',
            image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=700&q=80',
            rating: '4.9',
            prepTime: '10-15 min',
            calories: '~240 kcal',
            priceEstimate: '₹160 - ₹260',
            isVeg: true,
            searchQuery: 'Pistachio Gelato'
          }
        ]
      }
    }
  }
};

/**
 * Universal Fallback Climate-Matched Database (for all other global cities)
 */
export const GLOBAL_CLIMATE_DATABASE = {
  [CLIMATE_TYPES.RAINY]: {
    headline: 'Monsoon Street Classics & Steaming Delights',
    pairingQuote: 'Crisp golden fritters, piping hot tea, and spicy comfort bowls to accompany the soothing sound of falling raindrops.',
    items: [
      {
        id: 'glo-rain-1',
        name: 'Crispy Onion Pakoras & Masala Chai',
        category: 'Snacks & Tea',
        tag: '🌧️ Ultimate Rainy Pairing',
        vibe: 'Golden Crisp & Warm Ginger Sip',
        description: 'Crispy fritters infused with carom seeds and green chilies, served with steaming hot ginger cardamom tea.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '15-20 min',
        calories: '~280 kcal',
        priceEstimate: '₹90 - ₹150',
        isVeg: true,
        searchQuery: 'Pakoda and Masala Chai'
      },
      {
        id: 'glo-rain-2',
        name: 'Piping Hot Samosas & Mint Chutney',
        category: 'Snacks & Tea',
        tag: '⭐ All-Time Classic',
        vibe: 'Flaky Golden Crunch',
        description: 'Crisp pastry stuffed with spiced potato and green peas, accompanied by sweet tamarind & fiery mint chutney.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
        rating: '4.8',
        prepTime: '15-25 min',
        calories: '~310 kcal',
        priceEstimate: '₹60 - ₹120',
        isVeg: true,
        searchQuery: 'Samosa'
      },
      {
        id: 'glo-rain-3',
        name: 'Steamed Tibetan Momos with Fiery Dip',
        category: 'Comfort Food',
        tag: '🥟 Steamy Delight',
        vibe: 'Juicy & Spicy Kick',
        description: 'Tender steamed dumplings packed with seasoned minced fillings, served with fiery garlic chili sauce.',
        image: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&w=700&q=80',
        rating: '4.8',
        prepTime: '20-30 min',
        calories: '~240 kcal',
        priceEstimate: '₹140 - ₹220',
        isVeg: true,
        searchQuery: 'Steamed Momos'
      },
      {
        id: 'glo-rain-4',
        name: 'Mumbai Butter Vada Pav & Fried Chilies',
        category: 'Street Food',
        tag: '🌶️ Monsoon Street Legend',
        vibe: 'Spicy Potato Batata Crunch',
        description: 'Spiced batata vada inside buttered pav bun with roasted garlic chutney and fried salted green chilies.',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '15-20 min',
        calories: '~290 kcal',
        priceEstimate: '₹60 - ₹100',
        isVeg: true,
        searchQuery: 'Vada Pav'
      },
      {
        id: 'glo-rain-5',
        name: 'Pure Desi Ghee Dal Khichdi & Papad',
        category: 'Comfort Food',
        tag: '🍲 Soul Food',
        vibe: 'Nourishing & Warm',
        description: 'Slow-simmered rice and lentils tempered with cumin, roasted garlic, and pure desi ghee with roasted papad.',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '25-30 min',
        calories: '~340 kcal',
        priceEstimate: '₹160 - ₹240',
        isVeg: true,
        searchQuery: 'Dal Khichdi'
      },
      {
        id: 'glo-rain-6',
        name: 'Hot Gulab Jamun with Saffron Rabdi',
        category: 'Sweet Treats',
        tag: '🍯 Warm Dessert',
        vibe: 'Melt-in-Mouth Sweet Bliss',
        description: 'Warm fried milk-solid dumplings soaked in aromatic rosewater cardamom syrup, garnished with pistachios.',
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '15-20 min',
        calories: '~360 kcal',
        priceEstimate: '₹110 - ₹180',
        isVeg: true,
        searchQuery: 'Hot Gulab Jamun'
      }
    ]
  },
  [CLIMATE_TYPES.COLD]: {
    headline: 'Winter Warmers & Hearth Comfort Feasts',
    pairingQuote: 'Rich slow-cooked curries, steaming noodle broths, and decadent warm desserts to conquer the winter frost.',
    items: [
      {
        id: 'glo-cold-1',
        name: 'Butter Chicken / Paneer Makhani with Garlic Naan',
        category: 'Hearty Meals',
        tag: '🔥 Royal Winter Curry',
        vibe: 'Rich, Velvety & Decadent',
        description: 'Aromatic slow-simmered rich tomato butter gravy served with crisp, blistered tandoori garlic naan.',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '25-35 min',
        calories: '~520 kcal',
        priceEstimate: '₹280 - ₹420',
        isVeg: false,
        searchQuery: 'Butter Chicken and Garlic Naan'
      },
      {
        id: 'glo-cold-2',
        name: 'Roasted Creamy Tomato Soup & Herb Croutons',
        category: 'Comfort Food',
        tag: '🥣 Velvety Warmth',
        vibe: 'Soothing Basil & Garlic Notes',
        description: 'Velvety roasted vine tomato soup blended with cream and fresh basil, topped with crunchy herb garlic croutons.',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=700&q=80',
        rating: '4.8',
        prepTime: '20-25 min',
        calories: '~180 kcal',
        priceEstimate: '₹140 - ₹200',
        isVeg: true,
        searchQuery: 'Tomato Soup'
      },
      {
        id: 'glo-cold-3',
        name: 'Steaming Tibetan Thukpa / Tonkotsu Ramen',
        category: 'Comfort Food',
        tag: '🍜 Piping Hot Broth',
        vibe: 'Himalayan Broth Warmth',
        description: 'Heartwarming aromatic broth laden with noodles, fresh greens, ginger, and winter mountain seasonings.',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80',
        rating: '4.8',
        prepTime: '25-35 min',
        calories: '~410 kcal',
        priceEstimate: '₹240 - ₹380',
        isVeg: false,
        searchQuery: 'Ramen or Thukpa'
      },
      {
        id: 'glo-cold-4',
        name: 'Moong Dal Halwa / Gajar Ka Halwa in Pure Ghee',
        category: 'Sweet Treats',
        tag: '👑 Winter Royal Sweet',
        vibe: 'Desi Ghee & Roasted Cashews',
        description: 'Slow-simmered grated winter carrots or lentils cooked with khoya, cardamom, and roasted dry fruits.',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '20-25 min',
        calories: '~420 kcal',
        priceEstimate: '₹150 - ₹240',
        isVeg: true,
        searchQuery: 'Gajar Ka Halwa'
      },
      {
        id: 'glo-cold-5',
        name: 'Belgian Hot Chocolate with Marshmallows',
        category: 'Beverages',
        tag: '☕ Cozy Indulgence',
        vibe: 'Rich Molten Dark Chocolate',
        description: 'Melted Belgian cocoa simmered with full cream milk, crowned with fluffy toasted marshmallows and cinnamon.',
        image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '15-20 min',
        calories: '~290 kcal',
        priceEstimate: '₹160 - ₹230',
        isVeg: true,
        searchQuery: 'Hot Chocolate'
      },
      {
        id: 'glo-cold-6',
        name: 'Crisp Amritsari Stuffed Kulcha & Chole',
        category: 'Hearty Meals',
        tag: '🧈 Clay Oven Crisp',
        vibe: 'Spiced Potato Crust & Chole',
        description: 'Tandoor-baked flaky bread stuffed with spiced potatoes and onions, served with dark spiced Punjabi chole.',
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=700&q=80',
        rating: '4.8',
        prepTime: '20-30 min',
        calories: '~470 kcal',
        priceEstimate: '₹180 - ₹280',
        isVeg: true,
        searchQuery: 'Amritsari Kulcha'
      }
    ]
  },
  [CLIMATE_TYPES.HOT]: {
    headline: 'Chilled Refreshments & Light Gourmet Coolers',
    pairingQuote: 'Beat the heatwave with frosty smoothies, authentic faloodas, refreshing chaats, and hydrating salads.',
    items: [
      {
        id: 'glo-hot-1',
        name: 'Alphonso Mango Lassi & Smoothies',
        category: 'Beverages',
        tag: '🥭 Summer King',
        vibe: 'Thick, Creamy & Refreshing',
        description: 'Chilled sweet probiotic yogurt churned with real Alphonso mango pulp, saffron strands, and crushed pistachios.',
        image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '15-20 min',
        calories: '~240 kcal',
        priceEstimate: '₹120 - ₹180',
        isVeg: true,
        searchQuery: 'Mango Lassi'
      },
      {
        id: 'glo-hot-2',
        name: 'Royal Rose Falooda with Malai Kulfi',
        category: 'Sweet Treats',
        tag: '🍨 Ultimate Summer Cooler',
        vibe: 'Rose Fragrance & Basil Seeds',
        description: 'Layers of chilled rose milk, vermicelli, blooming sabja seeds, and a rich scoop of traditional malai kulfi.',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '15-20 min',
        calories: '~330 kcal',
        priceEstimate: '₹140 - ₹220',
        isVeg: true,
        searchQuery: 'Falooda'
      },
      {
        id: 'glo-hot-3',
        name: 'Cold Brew Frappé with Vanilla Scoop',
        category: 'Beverages',
        tag: '⚡ Chilled Caffeine Kick',
        vibe: 'Silky Espresso & Vanilla Frost',
        description: 'Bold espresso blended with ice and cold milk, topped with a velvety scoop of vanilla ice cream and chocolate sauce.',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80',
        rating: '4.8',
        prepTime: '15-20 min',
        calories: '~260 kcal',
        priceEstimate: '₹160 - ₹250',
        isVeg: true,
        searchQuery: 'Cold Coffee with Ice Cream'
      },
      {
        id: 'glo-hot-4',
        name: 'Chilled Dahi Puri & Sev Puri Chaat',
        category: 'Snacks & Chaat',
        tag: '✨ Tangy Street Coolness',
        vibe: 'Crisp Puris & Sweet Chilled Curd',
        description: 'Crispy puris stuffed with spiced potatoes and sprouts, drenched in chilled sweetened yogurt and tangy chutneys.',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=700&q=80',
        rating: '4.8',
        prepTime: '15-20 min',
        calories: '~220 kcal',
        priceEstimate: '₹90 - ₹150',
        isVeg: true,
        searchQuery: 'Dahi Puri'
      },
      {
        id: 'glo-hot-5',
        name: 'Fresh Mediterranean Greek Salad Bowl',
        category: 'Healthy Bites',
        tag: '🥗 Crisp & Light',
        vibe: 'Hydrating Feta & Olives',
        description: 'Crunchy cucumbers, cherry tomatoes, Kalamata olives, bell peppers, and feta cheese tossed in extra virgin olive oil.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80',
        rating: '4.7',
        prepTime: '20-25 min',
        calories: '~190 kcal',
        priceEstimate: '₹220 - ₹320',
        isVeg: true,
        searchQuery: 'Greek Salad'
      },
      {
        id: 'glo-hot-6',
        name: 'Tender Coconut Ice Cream / Artisanal Gelato',
        category: 'Sweet Treats',
        tag: '🥥 100% Real Coconut',
        vibe: 'Silky Pure Fruit Refreshment',
        description: 'Crafted with natural tender coconut malai and fresh coconut water without heavy artificial colors.',
        image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '15-20 min',
        calories: '~160 kcal',
        priceEstimate: '₹120 - ₹190',
        isVeg: true,
        searchQuery: 'Tender Coconut Ice Cream'
      }
    ]
  },
  [CLIMATE_TYPES.STORMY]: {
    headline: 'High-Voltage Spicy Munchies & Sizzlers',
    pairingQuote: 'Match the roaring thunder and electric skies with fiery street noodles, loaded nachos, and sizzling comfort food.',
    items: [
      {
        id: 'glo-storm-1',
        name: 'Spicy Peri Peri Cheesy Maggi Noodles',
        category: 'Comfort Food',
        tag: '⛈️ Storm Companion',
        vibe: 'Melted Cheddar & Spice Kick',
        description: 'Classic wok noodles spiced with peri peri seasoning, melted cheddar cheese, sautéed bell peppers, and herbs.',
        image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '15-20 min',
        calories: '~330 kcal',
        priceEstimate: '₹110 - ₹170',
        isVeg: true,
        searchQuery: 'Cheese Maggi'
      },
      {
        id: 'glo-storm-2',
        name: 'Loaded Fiery Cheese Nachos with Dips',
        category: 'Snacks',
        tag: '🧀 Crunchy Storm Snack',
        vibe: 'Warm Queso & Jalapeño Crunch',
        description: 'Warm crispy tortilla chips smothered in spiced cheese sauce, jalapeño rings, tomato salsa, and sour cream.',
        image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=700&q=80',
        rating: '4.8',
        prepTime: '20-25 min',
        calories: '~440 kcal',
        priceEstimate: '₹190 - ₹290',
        isVeg: true,
        searchQuery: 'Loaded Nachos'
      },
      {
        id: 'glo-storm-3',
        name: 'Crispy Peri Peri Fries with Dip',
        category: 'Snacks',
        tag: '🍟 Crispy & Zesty',
        vibe: 'Golden Crisp with African Heat',
        description: 'Golden fried potatoes tossed in bird\'s eye chili spice powder, served with creamy jalapeño cheese dip.',
        image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=700&q=80',
        rating: '4.8',
        prepTime: '15-20 min',
        calories: '~310 kcal',
        priceEstimate: '₹120 - ₹180',
        isVeg: true,
        searchQuery: 'Peri Peri Fries'
      },
      {
        id: 'glo-storm-4',
        name: 'Spicy Schezwan Hakka Noodles & Chili Paneer',
        category: 'Hearty Meals',
        tag: '🥢 Indo-Chinese Wok',
        vibe: 'Smoky Garlic & Schezwan Heat',
        description: 'Wok-tossed noodles with crunchy vegetables and spring onions, paired with crispy paneer in spicy sauce.',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=700&q=80',
        rating: '4.8',
        prepTime: '25-30 min',
        calories: '~460 kcal',
        priceEstimate: '₹220 - ₹340',
        isVeg: true,
        searchQuery: 'Schezwan Hakka Noodles'
      },
      {
        id: 'glo-storm-5',
        name: 'Sizzling Hot Brownie with Vanilla Scoop',
        category: 'Sweet Treats',
        tag: '🍫 Hot & Cold Sensation',
        vibe: 'Molten Fudge on Sizzling Iron',
        description: 'Dense walnut fudge brownie sizzling on a smoking iron platter with a cold scoop of vanilla ice cream and dark chocolate fudge.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '20-25 min',
        calories: '~450 kcal',
        priceEstimate: '₹180 - ₹280',
        isVeg: true,
        searchQuery: 'Sizzling Brownie'
      },
      {
        id: 'glo-storm-6',
        name: 'Crispy Veg Spring Rolls & Hot Garlic Dip',
        category: 'Snacks',
        tag: '🥟 Golden Crisp Bites',
        vibe: 'Crackling Wrapper & Spiced Greens',
        description: 'Crisp hand-rolled pastries stuffed with shredded cabbage, bell peppers, and scallions with sweet chili dip.',
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=700&q=80',
        rating: '4.7',
        prepTime: '20-25 min',
        calories: '~320 kcal',
        priceEstimate: '₹140 - ₹220',
        isVeg: true,
        searchQuery: 'Veg Spring Rolls'
      }
    ]
  },
  [CLIMATE_TYPES.OVERCAST]: {
    headline: 'Buttery Comforts & Soulful Stews for Muted Skies',
    pairingQuote: 'Brighten overcast afternoons with fragrant spiced curries, gooey grilled cheese, and traditional South Indian filter kaapi.',
    items: [
      {
        id: 'glo-over-1',
        name: 'Mumbai Butter Pav Bhaji with Toasted Pav',
        category: 'Comfort Food',
        tag: '🧈 Street Star',
        vibe: 'Spiced Vegetable Tawa Mash',
        description: 'Slow-simmered mashed vegetables cooked with aromatic spices, topped with melted butter and toasted soft buns.',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '20-25 min',
        calories: '~460 kcal',
        priceEstimate: '₹140 - ₹220',
        isVeg: true,
        searchQuery: 'Pav Bhaji'
      },
      {
        id: 'glo-over-2',
        name: 'Delhi Style Rajma Masala & Basmati Rice',
        category: 'Hearty Meals',
        tag: '🍛 Homestyle Warmth',
        vibe: 'Tender Kidney Beans in Tomato Gravy',
        description: 'Tender red kidney beans slow-braised in a ginger, garlic, and tomato reduction over steaming long-grain rice.',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '20-30 min',
        calories: '~380 kcal',
        priceEstimate: '₹160 - ₹240',
        isVeg: true,
        searchQuery: 'Rajma Chawal'
      },
      {
        id: 'glo-over-3',
        name: 'Three-Cheese Sourdough Grilled Sandwich',
        category: 'Comfort Food',
        tag: '🧀 Epic Cheese Pull',
        vibe: 'Golden Butter Toasted Crust',
        description: 'Artisan sourdough stuffed with cheddar, mozzarella, and gouda cheese, toasted crisp with tomato soup dip.',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80',
        rating: '4.8',
        prepTime: '15-20 min',
        calories: '~360 kcal',
        priceEstimate: '₹150 - ₹230',
        isVeg: true,
        searchQuery: 'Grilled Cheese Sandwich'
      },
      {
        id: 'glo-over-4',
        name: 'Traditional South Indian Filter Kaapi',
        category: 'Beverages',
        tag: '☕ Mood Reviver',
        vibe: 'Frothy Chicory Decoction',
        description: 'Dark slow-drip coffee decoction frothed with boiled whole milk in a traditional brass dabarah and tumbler.',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '15-20 min',
        calories: '~110 kcal',
        priceEstimate: '₹70 - ₹120',
        isVeg: true,
        searchQuery: 'Filter Coffee'
      },
      {
        id: 'glo-over-5',
        name: 'Warm Cinnamon Sugar Churros & Caramel',
        category: 'Sweet Treats',
        tag: '🍩 Sweet Warm Pastry',
        vibe: 'Crispy Ridges & Dulce De Leche',
        description: 'Spanish fried dough fingers dusted in fragrant cinnamon crystals, served with warm salted caramel and chocolate sauce.',
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=700&q=80',
        rating: '4.8',
        prepTime: '15-20 min',
        calories: '~340 kcal',
        priceEstimate: '₹140 - ₹220',
        isVeg: true,
        searchQuery: 'Churros'
      },
      {
        id: 'glo-over-6',
        name: 'Punjabi Aloo Paneer Paratha & White Butter',
        category: 'Hearty Meals',
        tag: '🌾 Hearth Classic',
        vibe: 'Flaky Whole Wheat & Pickle',
        description: 'Tawa-roasted layered whole wheat flatbread stuffed with spiced potato and cottage cheese, served with curd.',
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=700&q=80',
        rating: '4.8',
        prepTime: '20-25 min',
        calories: '~420 kcal',
        priceEstimate: '₹130 - ₹200',
        isVeg: true,
        searchQuery: 'Aloo Paratha'
      }
    ]
  },
  [CLIMATE_TYPES.PLEASANT]: {
    headline: 'Gourmet Feasts & Wood-Fired Delicacies',
    pairingQuote: 'Gentle breezes and pleasant temperatures invite celebratory feasts, artisanal pizzas, and royal biryanis.',
    items: [
      {
        id: 'glo-pleas-1',
        name: 'Royal Hyderabadi Dum Biryani & Mirchi Ka Salan',
        category: 'Hearty Meals',
        tag: '👑 Celebration Feast',
        vibe: 'Saffron Basmati & Slow Cooked Dum',
        description: 'Fragrant basmati rice layered with marinated tender cuts or paneer, sealed and cooked on slow dum with aromatic spices.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '25-35 min',
        calories: '~550 kcal',
        priceEstimate: '₹260 - ₹400',
        isVeg: false,
        searchQuery: 'Hyderabadi Biryani'
      },
      {
        id: 'glo-pleas-2',
        name: 'Wood-Fired Margherita / Pepperoni Pizza',
        category: 'Comfort Food',
        tag: '🍕 Artisan Oven Baked',
        vibe: 'Blistered Crust & Bubbly Mozzarella',
        description: 'Sourdough pizza baked at 450°C with sweet San Marzano tomato puree, fresh mozzarella, and sweet basil leaves.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80',
        rating: '4.8',
        prepTime: '25-35 min',
        calories: '~480 kcal',
        priceEstimate: '₹280 - ₹450',
        isVeg: true,
        searchQuery: 'Wood Fired Margherita Pizza'
      },
      {
        id: 'glo-pleas-3',
        name: 'Smoky Char-Grilled Paneer / Chicken Tikka',
        category: 'Snacks',
        tag: '🔥 Tandoor Appetizer',
        vibe: 'Smoky Mustard & Mint Dip',
        description: 'Juicy cubes marinated in hung curd, Kashmiri chili, and garam masala, grilled over hot charcoal with sliced onions.',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '20-25 min',
        calories: '~330 kcal',
        priceEstimate: '₹220 - ₹340',
        isVeg: true,
        searchQuery: 'Tandoori Tikka'
      },
      {
        id: 'glo-pleas-4',
        name: 'Kolkata Kathi Roll / Shawarma Wrap',
        category: 'Street Food',
        tag: '🌯 Street Food Gem',
        vibe: 'Flaky Paratha & Tangy Mint Sauce',
        description: 'Crispy egg-coated paratha stuffed with juicy roasted kebabs, sliced red onions, green chilies, and chaat masala.',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80',
        rating: '4.8',
        prepTime: '15-20 min',
        calories: '~360 kcal',
        priceEstimate: '₹140 - ₹220',
        isVeg: false,
        searchQuery: 'Kathi Roll'
      },
      {
        id: 'glo-pleas-5',
        name: 'Crispy Golden Masala Dosa with Sambar',
        category: 'Comfort Food',
        tag: '🥞 South Indian Star',
        vibe: 'Paper Thin Crisp & Potato Masala',
        description: 'Fermented crepe roasted golden with butter, filled with spiced mashed potatoes, served with drumstick sambar and chutneys.',
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '15-20 min',
        calories: '~320 kcal',
        priceEstimate: '₹110 - ₹180',
        isVeg: true,
        searchQuery: 'Masala Dosa'
      },
      {
        id: 'glo-pleas-6',
        name: 'Belgian Waffles with Nutella & Hazelnuts',
        category: 'Sweet Treats',
        tag: '🍫 Belgian Craving',
        vibe: 'Warm Pockets & Roasted Hazelnuts',
        description: 'Golden crispy waffle grids drenched in warm Nutella cocoa spread and topped with roasted hazelnut crunch.',
        image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=700&q=80',
        rating: '4.9',
        prepTime: '15-20 min',
        calories: '~410 kcal',
        priceEstimate: '₹160 - ₹250',
        isVeg: true,
        searchQuery: 'Belgian Waffle Nutella'
      }
    ]
  }
};

/**
 * Climate Metadata: labels, emojis, accent colors and tips for UI tabs
 */
export const CLIMATE_METADATA = {
  [CLIMATE_TYPES.RAINY]: {
    key: CLIMATE_TYPES.RAINY,
    label: 'Rainy & Wet',
    emoji: '🌧️',
    accentColor: '#0ea5e9',
    atmosphereTip: 'Crisp hot fritters, spicy curries & steaming chai'
  },
  [CLIMATE_TYPES.COLD]: {
    key: CLIMATE_TYPES.COLD,
    label: 'Cold & Chilly',
    emoji: '❄️',
    accentColor: '#38bdf8',
    atmosphereTip: 'Piping hot stews, rich gravies & warming halwas'
  },
  [CLIMATE_TYPES.HOT]: {
    key: CLIMATE_TYPES.HOT,
    label: 'Hot & Sunny',
    emoji: '☀️',
    accentColor: '#f59e0b',
    atmosphereTip: 'Cooling shakes, fresh lassis, chaats & light meals'
  },
  [CLIMATE_TYPES.STORMY]: {
    key: CLIMATE_TYPES.STORMY,
    label: 'Thunderstorm',
    emoji: '⚡',
    accentColor: '#8b5cf6',
    atmosphereTip: 'Hearty warm dishes & spicy bowls to weather the storm'
  },
  [CLIMATE_TYPES.OVERCAST]: {
    key: CLIMATE_TYPES.OVERCAST,
    label: 'Overcast & Fog',
    emoji: '☁️',
    accentColor: '#64748b',
    atmosphereTip: 'Aromatic teas, warm parathas & savory comfort snacks'
  },
  [CLIMATE_TYPES.PLEASANT]: {
    key: CLIMATE_TYPES.PLEASANT,
    label: 'Pleasant & Breezy',
    emoji: '🍃',
    accentColor: '#10b981',
    atmosphereTip: 'Gourmet street feasts, royal biryanis & sweet treats'
  }
};

// Backwards compatibility alias
export const CLIMATE_FOOD_DATABASE = CLIMATE_METADATA;

/**
 * Curated list of popular regional culinary hubs for quick UI switching and testing
 */
export const POPULAR_CULINARY_HUBS = [
  { name: 'Mumbai', region: REGIONS.MUMBAI, emoji: '🌊', label: 'Mumbai Coastal', country: 'India', admin1: 'Maharashtra', latitude: 19.076, longitude: 72.8777 },
  { name: 'Delhi', region: REGIONS.DELHI, emoji: '🏛️', label: 'Delhi Mughlai', country: 'India', admin1: 'Delhi', latitude: 28.6139, longitude: 77.209 },
  { name: 'Hyderabad', region: REGIONS.HYDERABAD, emoji: '👑', label: 'Hyderabad Biryani', country: 'India', admin1: 'Telangana', latitude: 17.385, longitude: 78.4867 },
  { name: 'Bengaluru', region: REGIONS.BANGALORE, emoji: '☕', label: 'Bangalore Cafe', country: 'India', admin1: 'Karnataka', latitude: 12.9716, longitude: 77.5946 },
  { name: 'Kolkata', region: REGIONS.KOLKATA, emoji: '🎭', label: 'Kolkata Rolls', country: 'India', admin1: 'West Bengal', latitude: 22.5726, longitude: 88.3639 },
  { name: 'Chennai', region: REGIONS.CHENNAI, emoji: '🥥', label: 'Chennai Tiffin', country: 'India', admin1: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707 },
  { name: 'Amritsar', region: REGIONS.PUNJAB, emoji: '🧈', label: 'Punjab Tandoor', country: 'India', admin1: 'Punjab', latitude: 31.634, longitude: 74.8723 },
  { name: 'Jaipur', region: REGIONS.RAJASTHAN, emoji: '🏰', label: 'Rajasthan Royal', country: 'India', admin1: 'Rajasthan', latitude: 26.9124, longitude: 75.7873 },
  { name: 'Kochi', region: REGIONS.KERALA, emoji: '🌴', label: 'Kerala Coconut', country: 'India', admin1: 'Kerala', latitude: 9.9312, longitude: 76.2673 },
  { name: 'Panaji', region: REGIONS.GOA, emoji: '🏖️', label: 'Goa Coastal', country: 'India', admin1: 'Goa', latitude: 15.4909, longitude: 73.8278 },
  { name: 'Tokyo', region: REGIONS.TOKYO, emoji: '🍜', label: 'Tokyo Ramen', country: 'Japan', admin1: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { name: 'New York', region: REGIONS.NEW_YORK, emoji: '🗽', label: 'New York Deli', country: 'United States', admin1: 'New York', latitude: 40.7128, longitude: -74.006 },
  { name: 'San Francisco', region: REGIONS.SAN_FRANCISCO, emoji: '🌁', label: 'San Francisco', country: 'United States', admin1: 'California', latitude: 37.7749, longitude: -122.4194 },
  { name: 'London', region: REGIONS.LONDON, emoji: '🎡', label: 'London Roast', country: 'United Kingdom', admin1: 'England', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Paris', region: REGIONS.PARIS, emoji: '🥐', label: 'Parisian Bistro', country: 'France', admin1: 'Île-de-France', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Rome', region: REGIONS.ITALY, emoji: '🍕', label: 'Italian Trattoria', country: 'Italy', admin1: 'Lazio', latitude: 41.9028, longitude: 12.4964 }
];

/**
 * Curated Master Slot Database providing rich authentic items for EVERY meal slot and climate condition.
 * Guarantees that at any hour, every single slot has delicious, verified recommendations
 * matching the user's exact timing constraints and weather moods.
 */
export const MASTER_SLOT_DATABASE = {
  [MEAL_TIMES.TIFFINS]: [
    {
      id: 'tif-1',
      name: 'Babai Hotel Ghee Karam Podi Dosa & Allam Pachadi',
      category: 'Street Food',
      tag: '🧈 Andhra Golden Legend',
      vibe: 'Ghee Roasted Thin Crepe & Fiery Red Podi',
      description: 'Crispy golden crepe doused in pure desi ghee, layered with spicy red chili garlic podi, served with sweet-tangy ginger chutney.',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '15-20 min',
      calories: '~310 kcal',
      priceEstimate: '₹90 - ₹150',
      isVeg: true,
      mealTimes: [MEAL_TIMES.TIFFINS],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.COLD, CLIMATE_TYPES.PLEASANT, CLIMATE_TYPES.OVERCAST],
      mealBadge: '🌅 Morning Tiffins',
      climateBadge: '🌧️ Monsoon Warmth',
      searchQuery: 'Ghee Karam Dosa'
    },
    {
      id: 'tif-2',
      name: 'Steaming Ghee Sambar Idli with Gunpowder Podi',
      category: 'Comfort Food',
      tag: '☁️ Cloud Soft Steamed Tiffin',
      vibe: 'Piping Hot Idlis Drenched in Drumstick Sambar',
      description: 'Melt-in-mouth steamed rice and lentil cakes showered with roasted lentil gunpowder, served with hot aromatic sambar and fresh coconut dip.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '10-15 min',
      calories: '~220 kcal',
      priceEstimate: '₹70 - ₹120',
      isVeg: true,
      mealTimes: [MEAL_TIMES.TIFFINS],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.HOT, CLIMATE_TYPES.COLD, CLIMATE_TYPES.PLEASANT, CLIMATE_TYPES.OVERCAST],
      mealBadge: '🌅 Morning Tiffins',
      climateBadge: '✨ Steamy Comfort',
      searchQuery: 'Sambar Idli'
    },
    {
      id: 'tif-3',
      name: 'Crispy Peppercorn Medu Vada with Coconut Chutney',
      category: 'Street Food',
      tag: '⭐ Golden Crunch Classic',
      vibe: 'Crispy Peppercorn Lentil Donuts',
      description: 'Deep-fried golden urad dal fritters studded with crushed black pepper, ginger, and curry leaves with fresh coconut dip.',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
      rating: '4.8',
      prepTime: '15-20 min',
      calories: '~280 kcal',
      priceEstimate: '₹60 - ₹110',
      isVeg: true,
      mealTimes: [MEAL_TIMES.TIFFINS],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.COLD, CLIMATE_TYPES.STORMY, CLIMATE_TYPES.PLEASANT],
      mealBadge: '🌅 Morning Tiffins',
      climateBadge: '🌧️ Monsoon Crisp',
      searchQuery: 'Medu Vada'
    },
    {
      id: 'tif-4',
      name: 'Punjabi Aloo Gobhi Paratha with Butter & Curd',
      category: 'Hearty Meals',
      tag: '🌾 Desi Ghee Hearth Classic',
      vibe: 'Flaky Whole-Wheat Crust & Spiced Stuffing',
      description: 'Tawa-roasted layered whole wheat flatbread stuffed with spiced potatoes and cauliflower, served with fresh curd and white butter.',
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '20-25 min',
      calories: '~410 kcal',
      priceEstimate: '₹120 - ₹190',
      isVeg: true,
      mealTimes: [MEAL_TIMES.TIFFINS],
      climates: [CLIMATE_TYPES.COLD, CLIMATE_TYPES.OVERCAST, CLIMATE_TYPES.RAINY, CLIMATE_TYPES.PLEASANT],
      mealBadge: '🌅 Morning Tiffins',
      climateBadge: '❄️ Winter Hearth Warmth',
      searchQuery: 'Aloo Paratha'
    },
    {
      id: 'tif-5',
      name: 'Indori Spiced Poha with Roasted Peanuts & Sev',
      category: 'Comfort Food',
      tag: '🍋 Light & Energizing',
      vibe: 'Tempered Flattened Rice & Crispy Ratlami Sev',
      description: 'Steamed flattened rice tossed with turmeric, mustard seeds, curry leaves, roasted crunchy peanuts, and a squeeze of fresh lemon.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      rating: '4.8',
      prepTime: '10-15 min',
      calories: '~240 kcal',
      priceEstimate: '₹60 - ₹100',
      isVeg: true,
      mealTimes: [MEAL_TIMES.TIFFINS],
      climates: [CLIMATE_TYPES.HOT, CLIMATE_TYPES.PLEASANT, CLIMATE_TYPES.OVERCAST],
      mealBadge: '🌅 Morning Tiffins',
      climateBadge: '☀️ Light & Refreshing',
      searchQuery: 'Poha'
    },
    {
      id: 'tif-6',
      name: 'Traditional Ven Pongal with Ghee & Roasted Cashews',
      category: 'Comfort Food',
      tag: '🍲 Temple Style Warmth',
      vibe: 'Short-Grain Rice, Moong Dal & Cumin Ghee',
      description: 'Comforting porridge of rice and yellow lentils tempered with black peppercorns, ginger, cumin, and whole roasted cashews in pure ghee.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      rating: '4.8',
      prepTime: '15-20 min',
      calories: '~360 kcal',
      priceEstimate: '₹90 - ₹150',
      isVeg: true,
      mealTimes: [MEAL_TIMES.TIFFINS],
      climates: [CLIMATE_TYPES.COLD, CLIMATE_TYPES.RAINY, CLIMATE_TYPES.STORMY],
      mealBadge: '🌅 Morning Tiffins',
      climateBadge: '🍲 Warming Elixir',
      searchQuery: 'Ven Pongal'
    },
    {
      id: 'tif-7',
      name: 'Fluffy Puri with Spiced Potato Bhaji / Sagu',
      category: 'Street Food',
      tag: '🟡 Puffed Golden Wheat',
      vibe: 'Crisp Hot Pooris & Savory Potato Curry',
      description: 'Golden deep-fried whole wheat puffed breads served with mild savory turmeric potato curry, green chilies, and tangy pickled mango.',
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=700&q=80',
      rating: '4.8',
      prepTime: '15-20 min',
      calories: '~380 kcal',
      priceEstimate: '₹80 - ₹140',
      isVeg: true,
      mealTimes: [MEAL_TIMES.TIFFINS],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.COLD, CLIMATE_TYPES.PLEASANT],
      mealBadge: '🌅 Morning Tiffins',
      climateBadge: '🌧️ Rainy Morning Classic',
      searchQuery: 'Poori Masala'
    },
    {
      id: 'tif-8',
      name: 'Authentic South Indian Degree Filter Coffee & Adrak Chai',
      category: 'Beverages',
      tag: '☕ Aromatic Frothy Brew',
      vibe: 'Chicory Roasted Beans & Frothy Steamed Milk',
      description: 'Traditional slow-dripped chicory-infused strong coffee frothed in stainless steel dabara set or steaming fresh ginger cardamom tea.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '5-10 min',
      calories: '~95 kcal',
      priceEstimate: '₹40 - ₹80',
      isVeg: true,
      mealTimes: [MEAL_TIMES.TIFFINS],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.COLD, CLIMATE_TYPES.STORMY, CLIMATE_TYPES.OVERCAST, CLIMATE_TYPES.PLEASANT],
      mealBadge: '🌅 Morning Tiffins',
      climateBadge: '🌧️ Soul Warmer',
      searchQuery: 'Filter Coffee'
    }
  ],

  [MEAL_TIMES.LUNCH]: [
    {
      id: 'lun-1',
      name: 'Authentic Hyderabadi Dum Chicken Biryani Handi',
      category: 'Hearty Meals',
      tag: '🍗 Golden Saffron Basmati',
      vibe: 'Fragrant Kacchi Dum Chicken & Mirchi Ka Salan',
      description: 'Tender bone-in chicken marinated in spiced yogurt and Hyderabadi pot spices, slow coal-dum cooked with aged basmati rice and brown onions.',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '25-35 min',
      calories: '~520 kcal',
      priceEstimate: '₹240 - ₹380',
      isVeg: false,
      mealTimes: [MEAL_TIMES.LUNCH],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.STORMY, CLIMATE_TYPES.PLEASANT, CLIMATE_TYPES.COLD, CLIMATE_TYPES.HOT],
      mealBadge: '☀️ Midday Lunch',
      climateBadge: '🍗 All-Weather Star',
      searchQuery: 'Hyderabadi Chicken Biryani'
    },
    {
      id: 'lun-2',
      name: 'Hyderabadi Dum Mutton Biryani with Mirchi Ka Salan',
      category: 'Hearty Meals',
      tag: '👑 Nizam\'s Royal Masterpiece',
      vibe: 'Saffron Basmati & Marinated Tender Meat',
      description: 'Long-grain basmati layered with succulent spiced meat, cooked on sealed coal dum with rose water, saffron, mint, and fiery salan.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '25-35 min',
      calories: '~580 kcal',
      priceEstimate: '₹280 - ₹440',
      isVeg: false,
      mealTimes: [MEAL_TIMES.LUNCH],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.STORMY, CLIMATE_TYPES.PLEASANT, CLIMATE_TYPES.COLD],
      mealBadge: '☀️ Midday Lunch',
      climateBadge: '🔥 Royal Handi',
      searchQuery: 'Hyderabadi Mutton Biryani'
    },
    {
      id: 'lun-3',
      name: 'Cooling Perugu Annam (Curd Rice) & Spiced Majjiga',
      category: 'Comfort Food',
      tag: '🥥 Summer Digestive Bliss',
      vibe: 'Tempered Creamy Curd Rice & Chilled Buttermilk',
      description: 'Fresh homemade curd mixed with soft rice, tempered with mustard, ginger, curry leaves, and pomegranate, paired with salted buttermilk.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '10-15 min',
      calories: '~280 kcal',
      priceEstimate: '₹80 - ₹140',
      isVeg: true,
      mealTimes: [MEAL_TIMES.LUNCH],
      climates: [CLIMATE_TYPES.HOT, CLIMATE_TYPES.PLEASANT],
      mealBadge: '☀️ Midday Lunch',
      climateBadge: '☀️ Summer Heat Buster',
      searchQuery: 'Curd Rice Buttermilk'
    },
    {
      id: 'lun-4',
      name: 'Classic Andhra Bhojanam (South Indian Meals Thali)',
      category: 'Hearty Meals',
      tag: '🍚 Grand Traditional Thali',
      vibe: 'Pappu, Ghee, Avakaya, Rasam, Sambar & Curd',
      description: 'Wholesome feast with Mudda Pappu, pure ghee, fiery Avakaya mango pickle, spiced rasam, kootu, curd, and crunchy papad.',
      image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '20-25 min',
      calories: '~460 kcal',
      priceEstimate: '₹150 - ₹240',
      isVeg: true,
      mealTimes: [MEAL_TIMES.LUNCH],
      climates: [CLIMATE_TYPES.PLEASANT, CLIMATE_TYPES.HOT, CLIMATE_TYPES.RAINY, CLIMATE_TYPES.OVERCAST],
      mealBadge: '☀️ Midday Lunch',
      climateBadge: '🌾 Authentic Feast',
      searchQuery: 'Andhra Meals Thali'
    },
    {
      id: 'lun-5',
      name: 'Piping Hot Dal Tadka with Steaming Jeera Rice & Ghee',
      category: 'Comfort Food',
      tag: '🍲 Golden Lentil Tempering',
      vibe: 'Garlic Cumin Tadka & Aromatic Basmati',
      description: 'Yellow arhar lentils slow-simmered and sizzled with garlic, cumin, and dry red chilies, served with fragrant cumin basmati rice and roasted papad.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      rating: '4.8',
      prepTime: '15-20 min',
      calories: '~360 kcal',
      priceEstimate: '₹130 - ₹190',
      isVeg: true,
      mealTimes: [MEAL_TIMES.LUNCH],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.COLD, CLIMATE_TYPES.OVERCAST, CLIMATE_TYPES.PLEASANT],
      mealBadge: '☀️ Midday Lunch',
      climateBadge: '🌧️ Rainy Lunch Comfort',
      searchQuery: 'Dal Tadka Jeera Rice'
    },
    {
      id: 'lun-6',
      name: 'Punjabi Rajma Chawal with Desi Ghee & Sirka Pyaaz',
      category: 'Hearty Meals',
      tag: '🌾 North Indian Soul Food',
      vibe: 'Melt-in-Mouth Jammu Red Kidney Beans',
      description: 'Slow-cooked red kidney beans in rich tomato-onion-ginger gravy drizzled with pure desi ghee, served with fluffy basmati and pickled vinegar onions.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '20-25 min',
      calories: '~430 kcal',
      priceEstimate: '₹140 - ₹210',
      isVeg: true,
      mealTimes: [MEAL_TIMES.LUNCH],
      climates: [CLIMATE_TYPES.COLD, CLIMATE_TYPES.RAINY, CLIMATE_TYPES.PLEASANT],
      mealBadge: '☀️ Midday Lunch',
      climateBadge: '❄️ Hearty Comfort',
      searchQuery: 'Rajma Chawal'
    },
    {
      id: 'lun-7',
      name: 'Fiery Andhra Gongura Chicken / Mutton with Hot Rice',
      category: 'Hearty Meals',
      tag: '🌶️ Tangy Gongura Delicacy',
      vibe: 'Sorrel Leaf Puree Simmered with Tender Meat',
      description: 'Signature Andhra dish of succulent meat simmered in tangy red sorrel leaf masala, best mixed with hot steamed rice and ghee.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      rating: '4.8',
      prepTime: '25-35 min',
      calories: '~490 kcal',
      priceEstimate: '₹260 - ₹390',
      isVeg: false,
      mealTimes: [MEAL_TIMES.LUNCH],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.COLD, CLIMATE_TYPES.STORMY],
      mealBadge: '☀️ Midday Lunch',
      climateBadge: '🌶️ Andhra Fire',
      searchQuery: 'Gongura Chicken Rice'
    },
    {
      id: 'lun-8',
      name: 'Royal Nizami Paneer Dum Biryani with Raita',
      category: 'Hearty Meals',
      tag: '🧀 Saffron Spiced Cottage Cheese',
      vibe: 'Layered Basmati & Golden Fried Onions',
      description: 'Fresh paneer cubes marinated in yogurt and aromatic whole spices, layered with long basmati and slow cooked on dum with mint and saffron.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
      rating: '4.8',
      prepTime: '20-25 min',
      calories: '~470 kcal',
      priceEstimate: '₹210 - ₹320',
      isVeg: true,
      mealTimes: [MEAL_TIMES.LUNCH],
      climates: [CLIMATE_TYPES.PLEASANT, CLIMATE_TYPES.RAINY, CLIMATE_TYPES.COLD, CLIMATE_TYPES.OVERCAST],
      mealBadge: '☀️ Midday Lunch',
      climateBadge: '✨ Vegetarian Feast',
      searchQuery: 'Paneer Biryani'
    }
  ],

  [MEAL_TIMES.EVENING_CHILL]: [
    {
      id: 'eve-1',
      name: 'Andhra Stuffed Mirchi Bajji with Ajwain & Onions',
      category: 'Street Food',
      tag: '🌶️ Coastal Street Sensation',
      vibe: 'Besan Fried Bhavnagri Chili Stuffed with Spiced Onion',
      description: 'Plump green chilies stuffed with carom seeds and lemon-tossed chopped onions, dipped in spiced chickpea batter and double-fried crispy.',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '15-20 min',
      calories: '~260 kcal',
      priceEstimate: '₹60 - ₹100',
      isVeg: true,
      mealTimes: [MEAL_TIMES.EVENING_CHILL],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.STORMY, CLIMATE_TYPES.PLEASANT, CLIMATE_TYPES.COLD],
      mealBadge: '🌇 Evening Chill',
      climateBadge: '🌧️ Monsoon Legend',
      searchQuery: 'Mirchi Bajji'
    },
    {
      id: 'eve-2',
      name: 'Hot Crispy Punugulu with Spicy Allam Chutney',
      category: 'Street Food',
      tag: '🟡 Vijayawada Street Classic',
      vibe: 'Deep-Fried Fermented Batter Crisps',
      description: 'Bite-sized crispy fritters made from fermented batter, fried golden and served with fiery tomato-ginger red chutney.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '15-20 min',
      calories: '~240 kcal',
      priceEstimate: '₹60 - ₹100',
      isVeg: true,
      mealTimes: [MEAL_TIMES.EVENING_CHILL],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.STORMY, CLIMATE_TYPES.PLEASANT, CLIMATE_TYPES.COLD],
      mealBadge: '🌇 Evening Chill',
      climateBadge: '🌧️ Rain Craving',
      searchQuery: 'Punugulu'
    },
    {
      id: 'eve-3',
      name: 'Piping Hot Punjabi Samosas & Masala Chai',
      category: 'Snacks & Tea',
      tag: '⭐ All-Time Sunset Classic',
      vibe: 'Flaky Golden Crunch & Spiced Potato',
      description: 'Crisp pastry stuffed with spiced potato and green peas, accompanied by sweet tamarind and fiery mint chutney with hot ginger tea.',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '15-20 min',
      calories: '~310 kcal',
      priceEstimate: '₹60 - ₹110',
      isVeg: true,
      mealTimes: [MEAL_TIMES.EVENING_CHILL],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.COLD, CLIMATE_TYPES.OVERCAST, CLIMATE_TYPES.STORMY, CLIMATE_TYPES.PLEASANT],
      mealBadge: '🌇 Evening Chill',
      climateBadge: '🌧️ Ultimate Sunset Warmth',
      searchQuery: 'Samosa Masala Chai'
    },
    {
      id: 'eve-4',
      name: 'Tawa Butter Pav Bhaji with Toasted Ladi Pav',
      category: 'Street Food',
      tag: '🧈 Sizzling Street Delight',
      vibe: 'Mashed Veg Curry Simmered on Hot Tawa',
      description: 'Velvety spiced tomato and vegetable mash sizzling on a hot cast iron tawa, finished with a generous dollop of Amul butter and soft buttered pav.',
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '20-25 min',
      calories: '~460 kcal',
      priceEstimate: '₹140 - ₹220',
      isVeg: true,
      mealTimes: [MEAL_TIMES.EVENING_CHILL],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.COLD, CLIMATE_TYPES.PLEASANT, CLIMATE_TYPES.OVERCAST],
      mealBadge: '🌇 Evening Chill',
      climateBadge: '🧈 Butter Comfort',
      searchQuery: 'Pav Bhaji'
    },
    {
      id: 'eve-5',
      name: 'Chilled Royal Rose Falooda with Malai Kulfi & Sabja',
      category: 'Sweet Treats',
      tag: '🍨 Evening Sunset Chiller',
      vibe: 'Cooling Rose Milk, Vermicelli & Vanilla Ice Cream',
      description: 'Layers of chilled rose syrup, hydrated basil seeds, silky vermicelli noodles, chilled milk, and a scoop of royal malai kulfi.',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '10-15 min',
      calories: '~340 kcal',
      priceEstimate: '₹120 - ₹190',
      isVeg: true,
      mealTimes: [MEAL_TIMES.EVENING_CHILL],
      climates: [CLIMATE_TYPES.HOT, CLIMATE_TYPES.PLEASANT],
      mealBadge: '🌇 Evening Chill',
      climateBadge: '☀️ Heat Relief Cooler',
      searchQuery: 'Royal Falooda'
    },
    {
      id: 'eve-6',
      name: 'Juhu Beach Chilled Dahi Sev Batata Puri (SPDP)',
      category: 'Street Food',
      tag: '✨ Crisp Beach Chaat',
      vibe: 'Chilled Spiced Yogurt & Sweet Tamarind',
      description: 'Crisp puris stuffed with boiled potato, drenched in cold sweet curd, spicy mint chutney, date paste, and nylon sev.',
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=700&q=80',
      rating: '4.8',
      prepTime: '15-20 min',
      calories: '~220 kcal',
      priceEstimate: '₹90 - ₹150',
      isVeg: true,
      mealTimes: [MEAL_TIMES.EVENING_CHILL],
      climates: [CLIMATE_TYPES.HOT, CLIMATE_TYPES.PLEASANT],
      mealBadge: '🌇 Evening Chill',
      climateBadge: '🧊 Chilled Street Crunch',
      searchQuery: 'Dahi Puri Chaat'
    },
    {
      id: 'eve-7',
      name: 'Steamed Himalayan Momos with Spicy Red Chili Dip',
      category: 'Comfort Food',
      tag: '🥟 Steamy Street Bite',
      vibe: 'Juicy Seasoned Filling & Fiery Garlic Chutney',
      description: 'Tender steamed dumplings packed with seasoned vegetables or chicken, served piping hot with fiery garlic red chili sauce.',
      image: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&w=700&q=80',
      rating: '4.8',
      prepTime: '15-20 min',
      calories: '~240 kcal',
      priceEstimate: '₹120 - ₹180',
      isVeg: true,
      mealTimes: [MEAL_TIMES.EVENING_CHILL],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.COLD, CLIMATE_TYPES.STORMY, CLIMATE_TYPES.OVERCAST],
      mealBadge: '🌇 Evening Chill',
      climateBadge: '🌧️ Steamy Rain Bite',
      searchQuery: 'Steamed Momos'
    },
    {
      id: 'eve-8',
      name: 'Irani Chai with Sweet & Salty Osmania Biscuits',
      category: 'Snacks & Tea',
      tag: '☕ Charminar Heritage',
      vibe: 'Slow Brewed Milk Tea & Crumbly Biscuits',
      description: 'Slow-brewed strong tea blended with rich condensed milk, paired with sweet and salty crumbly Osmania bakery biscuits.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '10-15 min',
      calories: '~190 kcal',
      priceEstimate: '₹80 - ₹140',
      isVeg: true,
      mealTimes: [MEAL_TIMES.EVENING_CHILL],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.COLD, CLIMATE_TYPES.OVERCAST, CLIMATE_TYPES.PLEASANT, CLIMATE_TYPES.STORMY],
      mealBadge: '🌇 Evening Chill',
      climateBadge: '☕ Timeless Classic',
      searchQuery: 'Irani Chai Osmania Biscuits'
    }
  ],

  [MEAL_TIMES.DINNER]: [
    {
      id: 'din-1',
      name: 'Royal Hyderabadi Dum Biryani Handi with Mirchi Ka Salan',
      category: 'Hearty Meals',
      tag: '🌙 Nizam\'s Midnight Feast',
      vibe: 'Dum-Cooked Spiced Tender Meat & Raita',
      description: 'Clay-pot sealed dum biryani served piping hot with fiery Mirchi ka Salan, cool cucumber onion raita, and boiled egg.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '25-35 min',
      calories: '~590 kcal',
      priceEstimate: '₹290 - ₹460',
      isVeg: false,
      mealTimes: [MEAL_TIMES.DINNER],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.COLD, CLIMATE_TYPES.PLEASANT, CLIMATE_TYPES.STORMY, CLIMATE_TYPES.HOT],
      mealBadge: '🌙 Dinner Delights',
      climateBadge: '👑 Ultimate Night Feast',
      searchQuery: 'Hyderabadi Dum Biryani'
    },
    {
      id: 'din-2',
      name: 'Old Delhi Butter Chicken with Butter Garlic Naan',
      category: 'Hearty Meals',
      tag: '🔥 Tandoori Makhani Gravy',
      vibe: 'Smoky Charred Tikka in Molten Butter',
      description: 'Smoky char-grilled chicken tossed in seasoned curd gravy and drenched in bubbling hot Amul butter with crisp garlic coriander naan.',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '25-35 min',
      calories: '~560 kcal',
      priceEstimate: '₹320 - ₹460',
      isVeg: false,
      mealTimes: [MEAL_TIMES.DINNER],
      climates: [CLIMATE_TYPES.COLD, CLIMATE_TYPES.RAINY, CLIMATE_TYPES.STORMY, CLIMATE_TYPES.OVERCAST, CLIMATE_TYPES.PLEASANT],
      mealBadge: '🌙 Dinner Delights',
      climateBadge: '🌧️ Warm Decadence',
      searchQuery: 'Butter Chicken and Garlic Naan'
    },
    {
      id: 'din-3',
      name: 'Paneer Butter Masala with Butter Garlic Naan',
      category: 'Comfort Food',
      tag: '🧈 Silky Cashew Tomato Makhani',
      vibe: 'Tandoori Baked Naan & Creamy Cottage Cheese',
      description: 'Fresh paneer cubes simmered in a velvet tomato, cashew, and butter gravy, paired with sizzling garlic coriander butter naan.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '20-25 min',
      calories: '~450 kcal',
      priceEstimate: '₹180 - ₹280',
      isVeg: true,
      mealTimes: [MEAL_TIMES.DINNER],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.COLD, CLIMATE_TYPES.PLEASANT, CLIMATE_TYPES.OVERCAST],
      mealBadge: '🌙 Dinner Delights',
      climateBadge: '🧈 Vegetarian Royalty',
      searchQuery: 'Paneer Butter Masala Garlic Naan'
    },
    {
      id: 'din-4',
      name: 'Slow-Simmered Bukhara Dal Makhani with Garlic Naan',
      category: 'Comfort Food',
      tag: '🍲 24-Hour Charcoal Hearth Simmer',
      vibe: 'Whole Black Lentils & Butter Cream',
      description: 'Black lentils slow-cooked overnight over glowing charcoal with tomatoes, cream, and pure butter for incomparable depth.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '25-30 min',
      calories: '~420 kcal',
      priceEstimate: '₹220 - ₹340',
      isVeg: true,
      mealTimes: [MEAL_TIMES.DINNER],
      climates: [CLIMATE_TYPES.COLD, CLIMATE_TYPES.RAINY, CLIMATE_TYPES.OVERCAST, CLIMATE_TYPES.PLEASANT],
      mealBadge: '🌙 Dinner Delights',
      climateBadge: '❄️ Hearth Comfort',
      searchQuery: 'Dal Makhani'
    },
    {
      id: 'din-5',
      name: 'Rich Hyderabadi Mutton Haleem with Pure Ghee & Cashews',
      category: 'Comfort Food',
      tag: '🍲 Slow Simmered Meat & Wheat',
      vibe: 'Pounded Mutton, Broken Wheat & Clarified Butter',
      description: 'Slow-cooked for 8 hours with broken wheat, lentils, tender meat, and aromatics, topped with barista onions, lemon, and mint.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '20-30 min',
      calories: '~470 kcal',
      priceEstimate: '₹240 - ₹380',
      isVeg: false,
      mealTimes: [MEAL_TIMES.DINNER],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.COLD, CLIMATE_TYPES.STORMY, CLIMATE_TYPES.OVERCAST],
      mealBadge: '🌙 Dinner Delights',
      climateBadge: '🍲 Rich Monsoon Bowl',
      searchQuery: 'Hyderabadi Haleem'
    },
    {
      id: 'din-6',
      name: 'Andhra Chilli Chicken with Hot Rumali Roti',
      category: 'Hearty Meals',
      tag: '🌶️ Green Chili Infusion',
      vibe: 'Spicy Green Chili Chicken & Paper-Thin Rotis',
      description: 'Tender chicken pieces sautéed in aromatic green chili paste, onions, and curry leaves, wrapped inside paper-thin hot rumali rotis.',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80',
      rating: '4.8',
      prepTime: '20-25 min',
      calories: '~410 kcal',
      priceEstimate: '₹230 - ₹340',
      isVeg: false,
      mealTimes: [MEAL_TIMES.DINNER],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.COLD, CLIMATE_TYPES.PLEASANT, CLIMATE_TYPES.STORMY],
      mealBadge: '🌙 Dinner Delights',
      climateBadge: '🌶️ Andhra Fire',
      searchQuery: 'Andhra Chilli Chicken'
    },
    {
      id: 'din-7',
      name: 'Light Vegetable Dum Pulao with Cucumber Mint Raita',
      category: 'Comfort Food',
      tag: '🌿 Gentle Evening Nourishment',
      vibe: 'Fragrant Basmati, Whole Spices & Cool Curd',
      description: 'Light basmati rice gently simmered with baby carrots, green peas, beans, and whole cinnamon, paired with cooling cucumber mint raita.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80',
      rating: '4.8',
      prepTime: '20-25 min',
      calories: '~330 kcal',
      priceEstimate: '₹160 - ₹250',
      isVeg: true,
      mealTimes: [MEAL_TIMES.DINNER],
      climates: [CLIMATE_TYPES.HOT, CLIMATE_TYPES.PLEASANT],
      mealBadge: '🌙 Dinner Delights',
      climateBadge: '☀️ Light Night Fare',
      searchQuery: 'Veg Pulao Raita'
    },
    {
      id: 'din-8',
      name: 'Warm Gulab Jamun with Saffron Rabdi',
      category: 'Sweet Treats',
      tag: '🍯 Royal Dessert Finish',
      vibe: 'Ghee-Fried Khoya Dumplings in Rose Syrup',
      description: 'Soft melt-in-mouth golden khoya spheres soaked in cardamom rose syrup, served warm over a pool of chilled saffron rabdi.',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      prepTime: '15-20 min',
      calories: '~360 kcal',
      priceEstimate: '₹110 - ₹180',
      isVeg: true,
      mealTimes: [MEAL_TIMES.DINNER],
      climates: [CLIMATE_TYPES.RAINY, CLIMATE_TYPES.COLD, CLIMATE_TYPES.PLEASANT, CLIMATE_TYPES.STORMY],
      mealBadge: '🌙 Dinner Delights',
      climateBadge: '🍯 Sweet Finish',
      searchQuery: 'Gulab Jamun Rabdi'
    }
  ]
};

/**
 * Helper to infer meal time categories if not explicitly assigned
 * Maps legacy names (morning, afternoon, evening, night) to strict timing categories.
 */
export function inferMealTimes(item) {
  if (Array.isArray(item.mealTimes) && item.mealTimes.length > 0) {
    return item.mealTimes.map((m) => {
      if (m === 'morning') return MEAL_TIMES.TIFFINS;
      if (m === 'afternoon') return MEAL_TIMES.LUNCH;
      if (m === 'evening') return MEAL_TIMES.EVENING_CHILL;
      if (m === 'night') return MEAL_TIMES.DINNER;
      return m;
    });
  }
  const text = `${item.name} ${item.category} ${item.description || ''} ${item.tag || ''}`.toLowerCase();
  
  // 1. Tiffins (Up to 10:30 AM)
  if (/dosa|idli|poha|vada|upma|pongal|paratha|puri|poori|croissant|bagel|breakfast|tiffin|omelette|pancake|buns|chutney/.test(text)) {
    return [MEAL_TIMES.TIFFINS];
  }
  // 2. Evening Chill (3:00 PM – 7:00 PM)
  if (/bajji|pakora|pakoda|samosa|chaat|bhel|sev puri|dahi puri|pani puri|kachori|punugulu|bonda|momo|fries|chai|tea|cutting|osmania|snack|falooda|bites|street food|bruschetta|takoyaki/.test(text)) {
    return [MEAL_TIMES.EVENING_CHILL];
  }
  // 3. Lunch Only (11:00 AM – 3:00 PM)
  if (/thali|bhojanam|meals|curd rice|perugu annam|sambar rice|lemon rice|lunch|khichdi|gongura|saag|makki|rajma chawal|dal baati/.test(text)) {
    return [MEAL_TIMES.LUNCH];
  }
  // 4. Dinner (7:01 PM – 12:00 AM)
  if (/dinner|haleem|kebab|tikka|tandoori|naan|rumali|rogan|butter chicken|paneer butter masala|dal makhani|cheeseburger|pizza|pasta|carbonara|ramen|steak|stew|bourguignon|biryani|jamun|halwa|kulfi/.test(text)) {
    return [MEAL_TIMES.DINNER, MEAL_TIMES.LUNCH];
  }
  return [MEAL_TIMES.DINNER];
}

/**
 * Helper to infer climate conditions if not explicitly assigned
 */
export function inferClimates(item) {
  if (Array.isArray(item.climates) && item.climates.length > 0) {
    return item.climates;
  }
  const text = `${item.name} ${item.category} ${item.description || ''} ${item.tag || ''}`.toLowerCase();
  const list = [];
  if (/hot|spicy|crispy|fried|chai|pakora|bajji|samosa|soup|stew|haleem|dumpling|monsoon|rain|biryani/.test(text)) {
    list.push(CLIMATE_TYPES.RAINY, CLIMATE_TYPES.STORMY);
  }
  if (/chilled|ice|cold|kulfi|falooda|shake|lassi|juice|buttermilk|majjiga|salad|summer|cooling|refresh/.test(text)) {
    list.push(CLIMATE_TYPES.HOT);
  }
  if (/soup|stew|curry|naan|gravy|warm|hot|rogan|halwa|sheera|paya|nihari|coffee|tea|ghee/.test(text)) {
    list.push(CLIMATE_TYPES.COLD, CLIMATE_TYPES.OVERCAST);
  }
  if (list.length === 0) {
    list.push(CLIMATE_TYPES.PLEASANT, CLIMATE_TYPES.HOT, CLIMATE_TYPES.RAINY);
  }
  return list;
}

/**
 * Generate clean meal badge for dish display
 */
export function getMealBadge(mealTimes) {
  if (mealTimes.includes(MEAL_TIMES.TIFFINS)) return '🌅 Morning Tiffins';
  if (mealTimes.includes(MEAL_TIMES.EVENING_CHILL)) return '🌇 Evening Chill';
  if (mealTimes.includes(MEAL_TIMES.DINNER)) return '🌙 Dinner Delights';
  if (mealTimes.includes(MEAL_TIMES.LUNCH)) return '☀️ Midday Lunch';
  return '✨ Time-Matched Classic';
}

/**
 * Contextual headline and pairing quote generator matching BOTH time of day and climate
 */
function generateContextualPairing(cityName, mealTime, climate) {
  const mealLabels = {
    [MEAL_TIMES.TIFFINS]: 'Morning Tiffins',
    [MEAL_TIMES.LUNCH]: 'Midday Lunch',
    [MEAL_TIMES.EVENING_CHILL]: 'Evening Chill Foods',
    [MEAL_TIMES.DINNER]: 'Dinner Delights'
  };


  const climateLabels = {
    [CLIMATE_TYPES.RAINY]: 'Monsoon Rain',
    [CLIMATE_TYPES.COLD]: 'Chilly Weather',
    [CLIMATE_TYPES.HOT]: 'Sunny & Radiant Heat',
    [CLIMATE_TYPES.STORMY]: 'Thunderstorm Skies',
    [CLIMATE_TYPES.OVERCAST]: 'Cloudy & Overcast',
    [CLIMATE_TYPES.PLEASANT]: 'Pleasant & Breezy Air'
  };

  const mealMeta = MEAL_TIME_METADATA[mealTime] || MEAL_TIME_METADATA[MEAL_TIMES.DINNER];
  const headline = `${mealMeta.emoji} ${mealLabels[mealTime]} • ${climateLabels[climate]} in ${cityName}`;

  if (mealTime === MEAL_TIMES.TIFFINS) {
    if (climate === CLIMATE_TYPES.RAINY || climate === CLIMATE_TYPES.STORMY) {
      return {
        headline,
        quote: `Start your rainy morning in ${cityName} with piping hot tiffins: crispy ghee karam dosas, steaming sambar idlis, and strong filter coffee.`
      };
    }
    if (climate === CLIMATE_TYPES.HOT) {
      return {
        headline,
        quote: `Stay light and cool this warm morning in ${cityName} with soft steamed idlis, fresh coconut chutney, and light poha.`
      };
    }
    if (climate === CLIMATE_TYPES.COLD) {
      return {
        headline,
        quote: `Warm up your chilly morning in ${cityName} with hot stuffed parathas, pure desi ghee pongal, and steaming kulhad chai.`
      };
    }
    return {
      headline,
      quote: `A pleasant morning in ${cityName} is best paired with golden crisp dosas, soft idlis, and freshly brewed filter coffee.`
    };
  }

  if (mealTime === MEAL_TIMES.LUNCH) {
    if (climate === CLIMATE_TYPES.RAINY || climate === CLIMATE_TYPES.STORMY) {
      return {
        headline,
        quote: `The rainy midday weather in ${cityName} calls for steaming hot dum biryani handis, spicy dal tadka with ghee rice, and rich comfort bowls.`
      };
    }
    if (climate === CLIMATE_TYPES.HOT) {
      return {
        headline,
        quote: `Beat the midday heat in ${cityName} with refreshing tempered curd rice, light South Indian thalis, and chilled spiced buttermilk.`
      };
    }
    return {
      headline,
      quote: `Enjoy a hearty afternoon lunch in ${cityName} with authentic regional thalis, dum biryanis, and wholesome comforting curries.`
    };
  }

  if (mealTime === MEAL_TIMES.EVENING_CHILL) {
    if (climate === CLIMATE_TYPES.RAINY || climate === CLIMATE_TYPES.STORMY) {
      return {
        headline,
        quote: `Nothing beats a rainy evening in ${cityName}: fiery stuffed mirchi bajji, golden crispy pakodas, and piping hot cutting chai.`
      };
    }
    if (climate === CLIMATE_TYPES.HOT) {
      return {
        headline,
        quote: `Unwind this warm sunset in ${cityName} with chilled royal falooda, tangy dahi puri, and refreshing cold brew frappés.`
      };
    }
    return {
      headline,
      quote: `Sundown in ${cityName} calls for hot street chaats, crispy snacks, Irani chai, and freshly prepared chill bites.`
    };
  }

  // DINNER
  if (climate === CLIMATE_TYPES.RAINY || climate === CLIMATE_TYPES.COLD) {
    return {
      headline,
      quote: `Cap off your cool night in ${cityName} with rich hot dum biryani handis, sizzling butter chicken or paneer makhani, and warm desserts.`
    };
  }
  if (climate === CLIMATE_TYPES.HOT) {
    return {
      headline,
      quote: `End your warm night in ${cityName} with light aromatic pulao, soft phulkas with dal tadka, and traditional matka malai kulfi.`
    };
  }
  return {
    headline,
    quote: `Tonight's curated dinner in ${cityName}: slow-cooked royal dum biryanis, butter garlic naan with creamy curries, and indulgent desserts.`
  };
}

/**
 * Get personalized culinary recommendations taking BOTH Location, Climate, AND Time of Day into account.
 * Strictly guarantees that ONLY items matching the active time of day are returned!
 */
export function getRegionalClimateSuggestions(
  location,
  weather,
  mood,
  climateOverride = null,
  mealTimeOverride = null
) {
  const regionKey = detectLocationRegion(location);
  const activeClimate = climateOverride || detectClimateCategory(weather, mood);
  const activeMealTime = mealTimeOverride || detectCurrentMealTime(weather?.timezone);
  const cityName = location?.name || 'Your Area';
  const meta = CLIMATE_METADATA[activeClimate] || CLIMATE_METADATA[CLIMATE_TYPES.PLEASANT];
  const mealMeta = MEAL_TIME_METADATA[activeMealTime] || MEAL_TIME_METADATA[MEAL_TIMES.DINNER];

  const regionalData = REGIONAL_FOOD_DATABASE[regionKey];

  // Gather candidate items from:
  // 1. Regional database
  // 2. Master Slot Database (guarantees deep variety for every slot)
  let rawItems = [];
  let regionTitle = `${cityName} Curated Specialties`;
  let regionEmoji = '📍';
  let regionName = cityName;

  if (regionalData) {
    regionTitle = regionalData.regionTitle || regionTitle;
    regionEmoji = regionalData.regionEmoji || regionEmoji;
    regionName = regionalData.regionName || regionName;

    const profileValues = Object.values(regionalData.climateProfiles || {});
    profileValues.forEach((p) => {
      if (Array.isArray(p.items)) {
        rawItems.push(...p.items);
      }
    });
  }

  // Also include items from Master Slot Database for this specific meal time
  const slotDefaults = MASTER_SLOT_DATABASE[activeMealTime] || [];
  rawItems.push(...slotDefaults);

  // Deduplicate items by ID
  const seenIds = new Set();
  const uniqueItems = [];
  rawItems.forEach((item) => {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      uniqueItems.push(item);
    }
  });

  // Strictly filter: ONLY include items matching the active meal time!
  const strictlyMealItems = uniqueItems.filter((item) => {
    const itemTimes = inferMealTimes(item);
    return itemTimes.includes(activeMealTime);
  });

  // Fallback: If strictlyMealItems is empty, use slotDefaults
  const candidates = strictlyMealItems.length > 0 ? strictlyMealItems : slotDefaults;

  // Score each item based on active climate condition
  const scoredItems = candidates.map((item) => {
    const itemClimates = inferClimates(item);
    let score = 0;

    // Direct Climate match (+100)
    const matchesClimate = itemClimates.includes(activeClimate);
    if (matchesClimate) {
      score += 100;
    } else if (itemClimates.includes('all')) {
      score += 50;
    }

    // Keyword relevance to active climate
    const text = `${item.name} ${item.description || ''} ${item.vibe || ''}`.toLowerCase();
    if (
      (activeClimate === CLIMATE_TYPES.RAINY || activeClimate === CLIMATE_TYPES.STORMY) &&
      /hot|spicy|crispy|fried|chai|pakora|bajji|samosa|soup|stew|haleem|dumpling|biryani/.test(text)
    ) {
      score += 40;
    }
    if (
      activeClimate === CLIMATE_TYPES.HOT &&
      /chilled|ice|cold|kulfi|falooda|shake|lassi|juice|buttermilk|majjiga|salad|summer|cooling|refresh/.test(text)
    ) {
      score += 40;
    }
    if (
      activeClimate === CLIMATE_TYPES.COLD &&
      /soup|stew|curry|naan|gravy|warm|hot|rogan|halwa|sheera|paya|nihari|coffee|tea|ghee/.test(text)
    ) {
      score += 40;
    }

    // Quality weight
    score += Number(item.rating || 4.5) * 2;

    const assignedMealBadge = item.mealBadge || getMealBadge([activeMealTime]);

    return {
      ...item,
      score,
      matchesMeal: true,
      matchesClimate,
      mealBadge: assignedMealBadge,
      swiggyUrl: getSwiggySearchUrl(item.searchQuery || item.name, location?.name)
    };
  });

  // Sort by score descending so that items best matching the current weather appear first
  scoredItems.sort((a, b) => b.score - a.score);

  const pairing = generateContextualPairing(cityName, activeMealTime, activeClimate);

  return {
    regionKey: regionalData ? regionKey : REGIONS.GLOBAL,
    regionName,
    regionTitle,
    regionEmoji,
    climateKey: activeClimate,
    climateLabel: meta.label,
    climateEmoji: meta.emoji,
    accentColor: meta.accentColor,
    atmosphereTip: meta.atmosphereTip,
    mealTimeKey: activeMealTime,
    mealTimeLabel: mealMeta.label,
    mealTimeShortLabel: mealMeta.shortLabel,
    mealTimeEmoji: mealMeta.emoji,
    mealTimeRange: mealMeta.timeRange,
    mealTimeTagline: mealMeta.tagline,
    headline: pairing.headline,
    pairingQuote: pairing.quote,
    items: scoredItems
  };
}

/**
 * Search across all dishes in the database for instant craving satisfaction.
 */
export function searchFoodCraving(query, locationName = '') {
  const clean = (query || '').trim().toLowerCase();
  if (!clean) return { matches: [], query: '', swiggyUrl: getSwiggySearchUrl('', locationName) };

  const allItems = [];
  const seen = new Set();

  // Gather from Master Slot Database
  Object.values(MASTER_SLOT_DATABASE).forEach((list) => {
    list.forEach((item) => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        allItems.push(item);
      }
    });
  });

  // Gather from Regional Food Database
  Object.values(REGIONAL_FOOD_DATABASE).forEach((reg) => {
    Object.values(reg.climateProfiles || {}).forEach((prof) => {
      (prof.items || []).forEach((item) => {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          allItems.push(item);
        }
      });
    });
  });

  const matches = allItems.filter((item) => {
    const text = `${item.name} ${item.description || ''} ${item.tag || ''} ${item.category || ''} ${item.vibe || ''}`.toLowerCase();
    return text.includes(clean);
  });

  return {
    query: clean,
    matches,
    swiggyUrl: getSwiggySearchUrl(clean, locationName)
  };
}

/**
 * Build direct Swiggy redirecting link with encoded search query localized to city.
 * Swiggy search URL format: https://www.swiggy.com/search?query=<query>
 */
export function getSwiggySearchUrl(query, locationName = '') {
  const cleanQuery = (query || '').trim();
  if (!cleanQuery) return 'https://www.swiggy.com';
  return `https://www.swiggy.com/search?query=${encodeURIComponent(cleanQuery)}`;
}

