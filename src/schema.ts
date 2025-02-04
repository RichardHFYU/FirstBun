import { pgTable, serial, varchar, integer, date, numeric, text } from 'drizzle-orm/pg-core';

export const agents = pgTable('agents', {
  agent_id: serial('agent_id').primaryKey(),
  first_name: varchar('first_name', { length: 50 }).notNull(),
  last_name: varchar('last_name', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  phone_number: varchar('phone_number', { length: 20 }),
  address: varchar('address', { length: 200 }),
});

export const agentSales = pgTable('agent_sales', {
  sale_id: serial('sale_id').primaryKey(),
  agent_id: integer('agent_id').notNull(),
  product_name: varchar('product_name', { length: 100 }).notNull(),
  policy_number: varchar('policy_number', { length: 50 }).notNull(),
  sale_date: date('sale_date').notNull(),
  premium_amount: numeric('premium_amount', { precision: 10, scale: 2 }).notNull(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  date: date('date').notNull(),
  // Add any other fields you need
});
