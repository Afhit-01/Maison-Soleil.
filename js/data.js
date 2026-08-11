/**
 * data.js
 * Single source of truth for guest/booking data used across every page.
 * In a production build this would come from a booking API — kept here
 * as a plain object so every page can render/validate against the
 * same facts (dates, wifi, host notes, etc).
 */
window.MS_DATA = {

  booking: {
    guestName: "Lucia",
    confirmationCode: "MS-2026-Q421-AH",
    room: { name: "La Garrigue" },
    checkIn:  { iso: "2026-09-12T15:00:00", label: "12 Sep", day: "Saturday",  time: "15:00" },
    checkOut: { iso: "2026-09-16T11:00:00", label: "16 Sep", day: "Wednesday", time: "11:00" },
    guests: 2,
    lineItems: [
      { label: "Room · La Garrigue × 4 nights", amount: 620.00 },
      { label: "Breakfast × 2 guests",          amount: 96.00 },
      { label: "Tourist tax",                   amount: 14.40 }
    ],
    total: 730.40,
    currency: "EUR",
    paymentMethod: "WISE · GBP",
    wifi: { network: "Le Soleil · Guest", password: "soleil-2026" },
    host: {
      name: "Margaux",
      note: "We're so glad you're coming. The shutters will be open, the lemonade cold, and the cat – Poivre – pretending not to notice you."
    }
  },

  location: { name: "Cassis", lat: 43.2148, lon: 5.5390, tz: "Europe/Paris" },

  house: {
    amenities: [
      { icon: "wifi",    name: "Fibre wifi",        detail: "300mb/s, mesh across the whole house" },
      { icon: "kitchen", name: "Full kitchen",       detail: "Gas hob, dishwasher, espresso machine" },
      { icon: "aircon",  name: "Air conditioning",   detail: "In both bedrooms" },
      { icon: "laundry", name: "Washer & dryer",     detail: "In the courtyard utility room" },
      { icon: "parking", name: "Private parking",    detail: "One spot, off Rue des Oliviers" },
      { icon: "pool",    name: "Plunge pool",        detail: "Unheated, shared with the garden studio" }
    ],
    rules: [
      { q: "Quiet hours", a: "22:00 – 08:00. The terrace carries sound further than you'd think." },
      { q: "Smoking", a: "Outside only, please — there's an ashtray by the blue door." },
      { q: "Poivre the cat", a: "Free to roam and very food-motivated. Please don't feed him from the table." },
      { q: "Checkout", a: "Leave the key in the terracotta pot and pull the shutters to. No need to strip the beds." }
    ],
    gallery: [
      { name: "The terrace",     tag: "Morning light" },
      { name: "La Garrigue",     tag: "Your room" },
      { name: "The kitchen",     tag: "Stocked pantry" },
      { name: "The courtyard",   tag: "Evening drinks" },
      { name: "The plunge pool", tag: "Afternoon dip" },
      { name: "The blue door",   tag: "Front entrance" }
    ]
  },

  spots: [
    { name: "Chez Nino",        category: "eat",   desc: "Grilled fish straight off the boats, cash only.", hours: { open: "12:00", close: "22:30" }, distance: "6 min walk" },
    { name: "La Villa Madie",   category: "eat",   desc: "Two Michelin stars, book weeks ahead.",             hours: { open: "19:00", close: "22:00" }, distance: "14 min walk" },
    { name: "Marché de Cassis", category: "eat",   desc: "Wednesday & Friday morning market on Place Baragnon.", hours: { open: "08:00", close: "13:00" }, distance: "5 min walk" },
    { name: "Calanque d'En-Vau", category: "beach", desc: "The furthest calanque, and the most dramatic — go early.", hours: { open: "06:00", close: "20:00" }, distance: "45 min hike" },
    { name: "Plage de la Grande Mer", category: "beach", desc: "The town beach — pebbly, easy, five minutes from the door.", hours: { open: "00:00", close: "23:59" }, distance: "8 min walk" },
    { name: "Château de Cassis", category: "see",  desc: "Private, but the walk up gives you the whole bay.", hours: { open: "09:00", close: "18:00" }, distance: "20 min walk" },
    { name: "Musée Méditerranéen", category: "see", desc: "Small, free, and cool on a hot afternoon.",         hours: { open: "10:00", close: "17:00" }, distance: "10 min walk" },
    { name: "Kayak Cassis",     category: "do",    desc: "Rent a kayak and paddle the calanques yourself.",   hours: { open: "09:00", close: "18:00" }, distance: "12 min walk" },
    { name: "Cave de Cassis",   category: "do",    desc: "Tastings of the local white — ask for Clément.",    hours: { open: "10:00", close: "19:00" }, distance: "9 min walk" }
  ],

  breakfastMenu: [
    { id: "figs",      name: "Fresh figs",           tag: "Seasonal",   desc: "From the tree by the courtyard, when they're ready." },
    { id: "honey",      name: "Marseille honey",      tag: "Local",      desc: "Wild lavender honey from the hills above town." },
    { id: "levain",     name: "Pain au levain",       tag: "Baked daily", desc: "From the bakery two doors down, delivered at 7." },
    { id: "espresso",   name: "Espresso",             tag: "House blend", desc: "Or a café au lait, if you'd rather." },
    { id: "yaourt",     name: "Yaourt fermier",       tag: "Local",      desc: "Farmhouse yoghurt from the Wednesday market." },
    { id: "orange",     name: "Fresh orange juice",   tag: "Seasonal",   desc: "Pressed to order, not from a carton." },
    { id: "gluten_free", name: "Gluten-free bread",   tag: "On request", desc: "Ask and it'll be ready — needs a night's notice." },
    { id: "eggs",       name: "Eggs any style",       tag: "Cooked to order", desc: "Scrambled, fried, or a simple omelette." }
  ],

  messages: [
    { from: "host", time: "2026-09-05T09:12:00", text: "Bonjour Lucia! All set for the 12th. Let me know if your arrival time changes." },
    { from: "guest", time: "2026-09-05T11:40:00", text: "Perfect, thank you! We should land around 2pm so 15:00 works well." },
    { from: "host", time: "2026-09-05T11:52:00", text: "Wonderful — the bell by the blue door is the loudest thing in Cassis, you won't miss it." }
  ]
};
