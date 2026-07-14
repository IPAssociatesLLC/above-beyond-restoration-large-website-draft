import { pgTable, text, timestamp, boolean, serial, numeric, jsonb, date } from 'drizzle-orm/pg-core'

// --- Better Auth required tables ---
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ---
export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  state: text('state').default('OR'),
  zip: text('zip'),
  type: text('type').default('residential'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  clientId: serial('clientId'),
  title: text('title').notNull(),
  description: text('description'),
  service: text('service').notNull(),
  status: text('status').notNull().default('lead'),
  priority: text('priority').default('normal'),
  address: text('address'),
  scheduledDate: timestamp('scheduledDate'),
  completedDate: timestamp('completedDate'),
  estimatedValue: numeric('estimatedValue', { precision: 10, scale: 2 }),
  actualValue: numeric('actualValue', { precision: 10, scale: 2 }),
  insuranceClaim: text('insuranceClaim'),
  adjusterName: text('adjusterName'),
  adjusterPhone: text('adjusterPhone'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const estimates = pgTable('estimates', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  clientId: serial('clientId'),
  jobId: serial('jobId'),
  title: text('title').notNull(),
  status: text('status').notNull().default('draft'),
  lineItems: jsonb('lineItems').notNull().default([]),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).default('0'),
  tax: numeric('tax', { precision: 10, scale: 2 }).default('0'),
  total: numeric('total', { precision: 10, scale: 2 }).default('0'),
  notes: text('notes'),
  xactimateRef: text('xactimateRef'),
  sentAt: timestamp('sentAt'),
  acceptedAt: timestamp('acceptedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  clientId: serial('clientId'),
  jobId: serial('jobId'),
  estimateId: serial('estimateId'),
  invoiceNumber: text('invoiceNumber').notNull(),
  status: text('status').notNull().default('draft'),
  lineItems: jsonb('lineItems').notNull().default([]),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).default('0'),
  tax: numeric('tax', { precision: 10, scale: 2 }).default('0'),
  total: numeric('total', { precision: 10, scale: 2 }).default('0'),
  amountPaid: numeric('amountPaid', { precision: 10, scale: 2 }).default('0'),
  dueDate: timestamp('dueDate'),
  sentAt: timestamp('sentAt'),
  paidAt: timestamp('paidAt'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  service: text('service'),
  message: text('message'),
  source: text('source').default('website'),
  status: text('status').notNull().default('new'),
  priority: text('priority').default('normal'),
  assignedTo: text('assignedTo'),
  notes: text('notes'),
  followUpDate: timestamp('followUpDate'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  jobId: serial('jobId'),
  description: text('description').notNull(),
  category: text('category').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  vendor: text('vendor'),
  receiptUrl: text('receiptUrl'),
  date: date('date').notNull().defaultNow(),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  invoiceId: serial('invoiceId'),
  clientId: serial('clientId'),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  method: text('method').default('check'),
  reference: text('reference'),
  notes: text('notes'),
  date: date('date').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const photos = pgTable('photos', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  jobId: serial('jobId'),
  url: text('url').notNull(),
  caption: text('caption'),
  category: text('category').default('job'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const appSettings = pgTable('app_settings', {
  userId: text('userId').primaryKey(),
  companyInfo: jsonb('companyInfo').notNull().default({}),
  notificationPrefs: jsonb('notificationPrefs').notNull().default({}),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
