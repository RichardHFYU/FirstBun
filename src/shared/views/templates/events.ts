export const eventsList = (events: any[]) => `
  <div class="events-container">
    <h1>Events</h1>
    
    <form hx-post="/api/v1/events" hx-target="#events-list" hx-swap="beforeend">
      <input type="text" name="title" placeholder="Event Title" required>
      <input type="date" name="date" required>
      <button type="submit">Add Event</button>
    </form>

    <div id="events-list">
      ${events.map(event => `
        <div class="event-item" id="event-${event.id}">
          <h3>${event.title}</h3>
          <p>${event.date}</p>
          <button 
            hx-delete="/api/v1/events/${event.id}"
            hx-target="#event-${event.id}"
            hx-swap="outerHTML"
            hx-confirm="Are you sure?"
          >Delete</button>
          <button
            hx-get="/api/v1/events/${event.id}/edit"
            hx-target="#event-${event.id}"
            hx-swap="outerHTML"
          >Edit</button>
        </div>
      `).join('')}
    </div>
  </div>
`

export const editEventForm = (event: any) => `
  <div class="event-item" id="event-${event.id}">
    <form 
      hx-put="/api/v1/events/${event.id}"
      hx-target="#event-${event.id}"
      hx-swap="outerHTML"
    >
      <input type="text" name="title" value="${event.title}" required>
      <input type="date" name="date" value="${event.date}" required>
      <button type="submit">Save</button>
      <button 
        type="button"
        hx-get="/api/v1/events/${event.id}"
        hx-target="#event-${event.id}"
        hx-swap="outerHTML"
      >Cancel</button>
    </form>
  </div>
` 