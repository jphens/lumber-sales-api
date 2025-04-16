const db = require('../database');

const TicketModel = {
  /**
   * Get all tickets
   * @returns {Array} Array of ticket objects
   */
  getAll() {
    const stmt = db.prepare(`
      SELECT * FROM tickets ORDER BY createdAt DESC
    `);
    return stmt.all();
  },

  /**
   * Get a ticket by ID with its items
   * @param {string} id - Ticket ID
   * @returns {Object|null} Ticket object with items array
   */
  getById(id) {
    // Get the ticket
    const ticketStmt = db.prepare(`
      SELECT * FROM tickets WHERE id = ?
    `);
    const ticket = ticketStmt.get(id);

    if (!ticket) return null;

    // Get the ticket items
    const itemsStmt = db.prepare(`
      SELECT * FROM ticket_items WHERE ticketId = ?
    `);
    const items = itemsStmt.all(id);

    // Combine ticket with its items
    return { ...ticket, items };
  },

  /**
   * Create a new ticket
   * @param {Object} ticket - Ticket object
   * @param {Array} items - Array of ticket item objects
   * @returns {Object} Created ticket
   */
  create(ticket, items) {
    // Start a transaction
    const createTicket = db.transaction((ticket, items) => {
      // Insert the ticket
      const ticketStmt = db.prepare(`
        INSERT INTO tickets (id, customerName, customerPhone, date, total)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      ticketStmt.run(
        ticket.id, 
        ticket.customerName, 
        ticket.customerPhone, 
        ticket.date, 
        ticket.total
      );

      // Insert each item
      const itemStmt = db.prepare(`
        INSERT INTO ticket_items (ticketId, quantity, width, height, length, pricePerBF, total)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const item of items) {
        itemStmt.run(
          ticket.id,
          item.quantity,
          item.width,
          item.height,
          item.length,
          item.pricePerBF,
          item.total
        );
      }

      // Return the created ticket
      return this.getById(ticket.id);
    });

    // Execute the transaction
    return createTicket(ticket, items);
  },

  /**
   * Update a ticket
   * @param {string} id - Ticket ID
   * @param {Object} ticket - Updated ticket data
   * @param {Array} items - Updated ticket items
   * @returns {Object} Updated ticket
   */
  update(id, ticket, items) {
    // Start a transaction
    const updateTicket = db.transaction((id, ticket, items) => {
      // Update the ticket
      const ticketStmt = db.prepare(`
        UPDATE tickets
        SET customerName = ?, customerPhone = ?, date = ?, total = ?
        WHERE id = ?
      `);
      
      ticketStmt.run(
        ticket.customerName,
        ticket.customerPhone,
        ticket.date,
        ticket.total,
        id
      );

      // Delete all existing items for this ticket
      const deleteItemsStmt = db.prepare(`
        DELETE FROM ticket_items WHERE ticketId = ?
      `);
      deleteItemsStmt.run(id);

      // Insert new items
      const itemStmt = db.prepare(`
        INSERT INTO ticket_items (ticketId, quantity, width, height, length, pricePerBF, total)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const item of items) {
        itemStmt.run(
          id,
          item.quantity,
          item.width,
          item.height,
          item.length,
          item.pricePerBF,
          item.total
        );
      }

      // Return the updated ticket
      return this.getById(id);
    });

    // Execute the transaction
    return updateTicket(id, ticket, items);
  },

  /**
   * Delete a ticket
   * @param {string} id - Ticket ID
   * @returns {boolean} Success status
   */
  delete(id) {
    const stmt = db.prepare(`
      DELETE FROM tickets WHERE id = ?
    `);
    const result = stmt.run(id);
    return result.changes > 0;
  }
};

module.exports = TicketModel;