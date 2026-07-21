import { pgTable, text, real, integer, timestamp } from 'drizzle-orm/pg-core';

// ---------- Flights ----------

export const flights = pgTable('flights', {
  id: text('id').primaryKey(),
  date: text('date').notNull(), // YYYY-MM-DD
  aircraft: text('aircraft').notNull(),
  model: text('model').notNull().default(''),
  route: text('route').notNull().default(''),
  totalTime: real('total_time').notNull().default(0),
  pic: real('pic').notNull().default(0),
  sic: real('sic').notNull().default(0),
  dual: real('dual').notNull().default(0),
  night: real('night').notNull().default(0),
  instrument: real('instrument').notNull().default(0),
  simInstrument: real('sim_instrument').notNull().default(0),
  crossCountry: real('cross_country').notNull().default(0),
  landings: integer('landings').notNull().default(0),
  nightLandings: integer('night_landings').notNull().default(0),
  approaches: integer('approaches').notNull().default(0),
  comments: text('comments').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ---------- Aircraft ----------

export const aircraft = pgTable('aircraft', {
  id: text('id').primaryKey(),
  tailNumber: text('tail_number').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull().default(2020),
  category: text('category').notNull().default('Single Engine Land'),
  notes: text('notes').notNull().default(''),
  imageColor: text('image_color').notNull().default('#0ea5e9'),
});

// ---------- Flight Costs ----------

export const flightCosts = pgTable('flight_costs', {
  id: text('id').primaryKey(),
  flightId: text('flight_id').notNull().default(''),
  date: text('date').notNull(),
  aircraft: text('aircraft').notNull().default(''),
  fuelCost: real('fuel_cost').notNull().default(0),
  rentalCost: real('rental_cost').notNull().default(0),
  instructorCost: real('instructor_cost').notNull().default(0),
  landingFees: real('landing_fees').notNull().default(0),
  otherCost: real('other_cost').notNull().default(0),
  notes: text('notes').notNull().default(''),
});

// ---------- External Costs ----------

export const externalCosts = pgTable('external_costs', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  category: text('category').notNull().default('misc'),
  amount: real('amount').notNull().default(0),
  description: text('description').notNull().default(''),
});

// ---------- Inferred Types ----------

export type Flight = typeof flights.$inferSelect;
export type NewFlight = typeof flights.$inferInsert;
export type Aircraft = typeof aircraft.$inferSelect;
export type NewAircraft = typeof aircraft.$inferInsert;
export type FlightCost = typeof flightCosts.$inferSelect;
export type NewFlightCost = typeof flightCosts.$inferInsert;
export type ExternalCost = typeof externalCosts.$inferSelect;
export type NewExternalCost = typeof externalCosts.$inferInsert;
