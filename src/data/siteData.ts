export const testimonials = [
  {
    quote: "Over the years, I have been using MyFlightBook with great satisfaction, and I have enthusiastically recommended your platform to many pilots and aviation enthusiasts.",
    name: "Maciej",
    title: "CFI",
  },
  {
    quote: "I'm going to recommend it to all my students.",
    name: "Laurenz",
    title: "CFI",
  },
  {
    quote: "I am a huge fan of MyFlightbook",
    name: "Jason",
    title: "ATP / Airline Pilot",
  },
  {
    quote: "Your software is a benefit to pilots, instructors and administrators",
    name: "Wayne",
    title: "MEI",
  },
  {
    quote: "Easy to use, amazing for training, and packed full of features",
    name: "Avery",
    title: "CPL",
  },
];

export const stats = {
  totalFlights: "26.1M",
  totalPilots: "100K+",
  totalAircraft: "377.9K",
  totalModels: "6.9K",
  weeklyPilots: "5.3K",
  weeklyFlights: "20.6K",
  weeklyAirports: "4,267",
  weeklyCountries: "156",
};

export const features = [
  {
    icon: "✈️",
    title: "Easy & Accurate Flight Logging",
    description: "Log every flight — whether you're in the cockpit of a Cessna, cruising at 35,000 feet in an airliner, flying a military mission, or piloting a drone.",
    details: [
      "Log from any browser or via free iOS and Android apps",
      "Add photos, digital signatures, and endorsements",
      "Bulk-import from spreadsheets or other logbook programs",
      "Supports all categories of aviation",
    ],
  },
  {
    icon: "📊",
    title: "Powerful Reporting & Analytics",
    description: "Stay on top of your flying with powerful analytics and tracking tools. Real-time totals across every aircraft, role, or condition.",
    details: [
      "Customizable reports and flight analysis",
      "8710/IACRA form generation",
      "Rollup by model, time, or category",
      "Visual trend analysis and charts",
    ],
  },
  {
    icon: "🛡️",
    title: "Currency & Compliance",
    description: "Track everything from flight reviews and instrument proficiency to medical expirations and night currency under FAA, EASA, or any authority.",
    details: [
      "Automatic currency tracking (FAA, EASA, and more)",
      "Flight, duty, and rest limit monitoring",
      "Custom currency rules for your operation",
      "Aircraft maintenance tracking",
    ],
  },
  {
    icon: "📤",
    title: "Share Your Adventures",
    description: "Create polished PDF and print layouts customized to your needs. Grant read-only or editable access to instructors, employers, or fellow pilots.",
    details: [
      "Jeppesen, EASA, and airline-style print formats",
      "Secure sharing with access controls",
      "Include signatures, remarks, and images",
      "Perfect for interviews and insurance",
    ],
  },
  {
    icon: "☁️",
    title: "Easy Access & Connectivity",
    description: "Secure, cloud-based access from any device. Sync seamlessly with tools you already use and back up to leading cloud storage services.",
    details: [
      "Access from any device, anywhere",
      "Auto-backup to cloud storage",
      "Push flights to CloudAhoy and FlySto",
      "Import from airline scheduling systems",
    ],
  },
  {
    icon: "🚀",
    title: "Joining is a Breeze",
    description: "Ditch the paper without losing your history. Simply enter your starting totals and begin logging new flights electronically — no scanning needed.",
    details: [
      "Enter starting totals in minutes",
      "Full flexibility to add old entries later",
      "Digital batch signature requests",
      "Import from other digital logbooks",
    ],
  },
];

export const topAirports = [
  { code: "KORD", name: "Chicago O'Hare International", flights: 571, pilots: 173 },
  { code: "ATL", name: "Hartsfield-Jackson Atlanta Intl", flights: 425, pilots: 117 },
  { code: "DFW", name: "Dallas/Fort Worth Intl", flights: 421, pilots: 127 },
  { code: "CLT", name: "Charlotte/Douglas Intl", flights: 309, pilots: 103 },
  { code: "KLGA", name: "LaGuardia, New York", flights: 295, pilots: 98 },
  { code: "DEN", name: "Denver Intl", flights: 277, pilots: 104 },
  { code: "KSEA", name: "Seattle-Tacoma International", flights: 261, pilots: 90 },
  { code: "DTW", name: "Detroit Metropolitan Wayne County", flights: 255, pilots: 90 },
  { code: "BOS", name: "General Edward Lawrence Logan Intl", flights: 240, pilots: 80 },
  { code: "JFK", name: "John F. Kennedy Intl", flights: 228, pilots: 100 },
];

export const topModels = [
  { model: "Cessna C172", flights: 2863 },
  { model: "Piper P28A", flights: 1450 },
  { model: "Embraer ERJ-170/190", flights: 1412 },
  { model: "Bombardier CL-65", flights: 1240 },
  { model: "Boeing B-737", flights: 1137 },
  { model: "Airbus A-320", flights: 1057 },
  { model: "Eurocopter AS50", flights: 461 },
  { model: "Embraer EMB-145", flights: 396 },
  { model: "Robinson R44", flights: 375 },
  { model: "Cessna C152", flights: 313 },
];

export const mockFlights = [
  { id: 1, date: "2026-06-28", aircraft: "N172SP", model: "Cessna C172S", route: "KPAO → KSQL → KPAO", totalTime: 1.2, landings: 3, night: 0, instrument: 0, approaches: 0, comments: "Pattern work, 3 touch-and-goes" },
  { id: 2, date: "2026-06-25", aircraft: "N5251R", model: "Piper PA-28-181", route: "KPAO → KWVI → KPAO", totalTime: 2.1, landings: 2, night: 0.4, instrument: 0, approaches: 0, comments: "Sunset coastal flight" },
  { id: 3, date: "2026-06-22", aircraft: "N172SP", model: "Cessna C172S", route: "KPAO → KSJC → KRHV → KPAO", totalTime: 1.8, landings: 3, night: 0, instrument: 0.5, approaches: 2, comments: "ILS practice with hood" },
  { id: 4, date: "2026-06-20", aircraft: "N8520G", model: "Cessna C182T", route: "KPAO → KMOD → KPAO", totalTime: 2.5, landings: 2, night: 0, instrument: 0, approaches: 0, comments: "Central valley cross-country" },
  { id: 5, date: "2026-06-18", aircraft: "N172SP", model: "Cessna C172S", route: "KPAO → KPAO", totalTime: 1.0, landings: 5, night: 0, instrument: 0, approaches: 0, comments: "Solo pattern practice" },
  { id: 6, date: "2026-06-15", aircraft: "N5251R", model: "Piper PA-28-181", route: "KPAO → KSFO → KOAK → KPAO", totalTime: 3.2, landings: 3, night: 1.2, instrument: 0.8, approaches: 1, comments: "Bay tour, night currency" },
  { id: 7, date: "2026-06-12", aircraft: "N8520G", model: "Cessna C182T", route: "KPAO → KMRY → KPAO", totalTime: 2.8, landings: 2, night: 0, instrument: 0, approaches: 0, comments: "Monterey day trip" },
  { id: 8, date: "2026-06-10", aircraft: "N172SP", model: "Cessna C172S", route: "KPAO → KPAO", totalTime: 1.5, landings: 1, night: 0, instrument: 1.0, approaches: 3, comments: "IFR proficiency with CFII" },
];

export const mockAircraft = [
  { tailNumber: "N172SP", model: "Cessna C172S Skyhawk SP", year: 2005, totalHours: 342.5, category: "Single Engine Land", imageColor: "#0ea5e9" },
  { tailNumber: "N5251R", model: "Piper PA-28-181 Archer III", year: 2003, totalHours: 186.2, category: "Single Engine Land", imageColor: "#22c55e" },
  { tailNumber: "N8520G", model: "Cessna C182T Skylane", year: 2008, totalHours: 95.8, category: "Single Engine Land", imageColor: "#f59e0b" },
  { tailNumber: "SIM", model: "Redbird FMX (C172)", year: 2020, totalHours: 28.0, category: "AATD", imageColor: "#a855f7" },
];

export const mockCurrency = [
  { name: "Flight Review (FAR 61.56)", status: "current", expires: "2027-03-15", daysRemaining: 259 },
  { name: "Medical Certificate (3rd Class)", status: "current", expires: "2027-06-01", daysRemaining: 337 },
  { name: "Day Passenger Currency", status: "current", expires: null, daysRemaining: null, detail: "5 landings in last 90 days" },
  { name: "Night Passenger Currency", status: "warning", expires: null, daysRemaining: null, detail: "2 of 3 required night landings" },
  { name: "Instrument Currency (FAR 61.57)", status: "current", expires: "2026-12-31", daysRemaining: 185, detail: "6 approaches, holding, intercepting" },
  { name: "IPC Required", status: "not-required", expires: null, daysRemaining: null },
];

export const mockTotals = {
  totalTime: 624.5,
  pic: 580.2,
  sic: 12.0,
  dual: 44.3,
  cfi: 0,
  night: 82.4,
  instrument: 45.6,
  simInstrument: 22.1,
  crossCountry: 198.3,
  solo: 312.5,
  landings: 1847,
  nightLandings: 124,
  approaches: 86,
};

export const faqCategories = [
  {
    category: "General",
    questions: [
      {
        q: "Can I bulk edit my flights?",
        a: "Yes! Download your logbook as CSV, edit in a spreadsheet, and re-import. The FlightID column ensures flights are updated rather than duplicated.",
      },
      {
        q: "Can I merge flights?",
        a: "Yes, there are two methods: merge complete flights using the merge tool, or merge multiple telemetry files separately. Note that merging is inherently lossy with no undo.",
      },
      {
        q: "Can I trust that MyFlightbook will be around for a long time?",
        a: "Yes. The service is not run for profit, has dedicated operating funds, open-source code on GitHub, multiple backups, and documented transition plans.",
      },
      {
        q: "How do you make money if it's free?",
        a: "We don't try to make money. It's a passion project giving back to the pilot community. Donations cover operating costs, and a few features are thank-you gifts for donors.",
      },
    ],
  },
  {
    category: "Getting Started",
    questions: [
      {
        q: "Are there any tutorials for using MyFlightbook?",
        a: "Yes! We have a growing library of video tutorials on YouTube covering getting started, importing data, signing flights, mobile apps, and more.",
      },
      {
        q: "I have lots of hours — is there an easy way to import them?",
        a: "Yes, MyFlightbook supports bulk-import from CSV files. Simply ensure your aircraft are in the system, format your flights in a CSV, preview the import, and upload.",
      },
      {
        q: "Is there an easy way to set my starting totals?",
        a: "Yes! Use the Starting Totals feature under the Logbook tab. Create catch-up flights to capture your historical totals without entering every past flight.",
      },
    ],
  },
  {
    category: "Aircraft",
    questions: [
      {
        q: "How can I delete or update an aircraft?",
        a: "Go to the Aircraft tab, click on the tail number to edit details, or click the delete button to remove it. Aircraft with logged flights cannot be deleted but can be hidden.",
      },
      {
        q: "How do I add a training device (simulator)?",
        a: "Use 'SIM' as the tail number prefix when adding a training device. You'll specify the certification level (BATD, AATD, FTD, FFS) and the model it represents.",
      },
    ],
  },
  {
    category: "Currency & Compliance",
    questions: [
      {
        q: "How does currency tracking work?",
        a: "MyFlightbook automatically computes your currency based on your logged flights, supporting FAA, EASA, and custom rules for flight reviews, medicals, and more.",
      },
      {
        q: "Can I create custom currency rules?",
        a: "Yes! Donors can create custom currency rules tailored to their operation, making it ideal for flight schools and corporate operators.",
      },
    ],
  },
  {
    category: "Sharing & Export",
    questions: [
      {
        q: "Can I share my logbook with someone?",
        a: "Yes, you can grant read-only or editable access to instructors, schools, employers, or fellow pilots with full control over what they see.",
      },
      {
        q: "What print/export formats are available?",
        a: "MyFlightbook offers CSV, Excel, PDF, and multiple print layouts including Jeppesen, EASA, and airline-style grid formats.",
      },
    ],
  },
];

export const navLinks = [
  {
    label: "Logbook",
    href: "/logbook",
    children: [
      { label: "Flight Log", href: "/logbook" },
      { label: "Add Flight", href: "/logbook" },
      { label: "Search", href: "/logbook" },
      { label: "Totals", href: "/logbook" },
      { label: "Currency", href: "/logbook" },
      { label: "Analysis", href: "/logbook" },
    ],
  },
  {
    label: "Aircraft",
    href: "/aircraft",
    children: [
      { label: "My Aircraft", href: "/aircraft" },
      { label: "Models", href: "/aircraft" },
      { label: "Flying Clubs", href: "/aircraft" },
    ],
  },
  {
    label: "Airports",
    href: "/airports",
    children: [
      { label: "Routes", href: "/airports" },
      { label: "Find Airports", href: "/airports" },
      { label: "Visited Airports", href: "/airports" },
    ],
  },
  {
    label: "Training",
    href: "/training",
    children: [
      { label: "Ratings Progress", href: "/training" },
      { label: "Endorsements", href: "/training" },
      { label: "Achievements", href: "/training" },
    ],
  },
];
