import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { db } from './db'
import { agents, agentSales, events } from './schema'
import { eq } from 'drizzle-orm'
import { template, eventsList, editEventForm } from './html'

const app = new Hono()

app.use('/*', cors())

app.get('/', (c) => {
  return c.html(template())
})

app.get('/api/agents', async (c) => {
  try {
    const data = await db.select().from(agents).execute()
    return c.json(data)
  } catch (error) {
    return c.json({ error: 'Failed to fetch agents' }, 500)
  }
})

app.get('/api/agents/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const result = await db
      .select()
      .from(agents)
      .where(eq(agents.agent_id, Number(id)))
      .execute()
    
    if (!result.length) {
      return c.json({ error: 'Agent not found' }, 404)
    }
    return c.json(result[0])
  } catch (error) {
    return c.json({ error: 'Failed to fetch agent' }, 500)
  }
})

app.get('/api/agents/:id/sales', async (c) => {
  try {
    const id = c.req.param('id')
    const sales = await db
      .select()
      .from(agentSales)
      .where(eq(agentSales.agent_id, Number(id)))
      .execute()
    return c.json(sales)
  } catch (error) {
    return c.json({ error: 'Failed to fetch agent sales' }, 500)
  }
})

// HTMX Event Routes
app.get('/events', async (c) => {
  try {
    const allEvents = await db.select().from(events).execute()
    return c.html(eventsList(allEvents))
  } catch (error) {
    return c.text('Failed to load events', 500)
  }
})

app.post('/events', async (c) => {
  try {
    const body = await c.req.json()
    const [newEvent] = await db.insert(events)
      .values(body)
      .returning()
    
    return c.html(`
      <div class="event-item" id="event-${newEvent.id}">
        <h3>${newEvent.title}</h3>
        <p>${newEvent.date}</p>
        <button 
          hx-delete="/events/${newEvent.id}"
          hx-target="#event-${newEvent.id}"
          hx-swap="outerHTML"
          hx-confirm="Are you sure you want to delete this event?"
        >
          Delete
        </button>
        <button
          hx-get="/events/${newEvent.id}/edit"
          hx-target="#event-${newEvent.id}"
          hx-swap="outerHTML"
        >
          Edit
        </button>
      </div>
    `)
  } catch (error) {
    return c.text('Failed to create event', 500)
  }
})

app.get('/events/:id/edit', async (c) => {
  try {
    const id = c.req.param('id')
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .execute()
    
    return c.html(editEventForm(event))
  } catch (error) {
    return c.text('Failed to load event', 500)
  }
})

app.put('/events/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    
    const [event] = await db
      .update(events)
      .set(body)
      .where(eq(events.id, id))
      .returning()
    
    return c.html(`
      <div class="event-item" id="event-${event.id}">
        <h3>${event.title}</h3>
        <p>${event.date}</p>
        <button 
          hx-delete="/events/${event.id}"
          hx-target="#event-${event.id}"
          hx-swap="outerHTML"
          hx-confirm="Are you sure you want to delete this event?"
        >
          Delete
        </button>
        <button
          hx-get="/events/${event.id}/edit"
          hx-target="#event-${event.id}"
          hx-swap="outerHTML"
        >
          Edit
        </button>
      </div>
    `)
  } catch (error) {
    return c.text('Failed to update event', 500)
  }
})

app.delete('/events/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await db.delete(events).where(eq(events.id, id))
    return c.text('') // HTMX will remove the element
  } catch (error) {
    return c.text('Failed to delete event', 500)
  }
})

export default {
  port: 3000,
  fetch: app.fetch,
}
