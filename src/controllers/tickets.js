const TicketModel = require('../models/ticket');

const TicketController = {
  /**
   * Get all tickets
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAllTickets(req, res) {
    try {
      const tickets = TicketModel.getAll();
      res.json(tickets);
    } catch (error) {
      console.error('Error getting tickets:', error);
      res.status(500).json({ error: 'Failed to retrieve tickets' });
    }
  },

  /**
   * Get a ticket by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getTicketById(req, res) {
    try {
      const { id } = req.params;
      const ticket = TicketModel.getById(id);

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      res.json(ticket);
    } catch (error) {
      console.error(`Error getting ticket ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to retrieve ticket' });
    }
  },

  /**
   * Create a new ticket
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  createTicket(req, res) {
    try {
      console.log('Received ticket data:', req.body);
      const { id, customerName, customerPhone, date, total, items } = req.body;

      if (!id || !customerName || !date || !items || !Array.isArray(items)) {
        console.log('Validation failed, missing required fields:', {
          hasId: !!id,
          hasCustomerName: !!customerName,
          hasDate: !!date,
          hasItems: !!items,
          isItemsArray: Array.isArray(items)
        });
        return res.status(400).json({ error: 'Missing required ticket information' });
      }

      // Create the ticket
      const ticket = {
        id,
        customerName,
        customerPhone: customerPhone || '',
        date,
        total: parseFloat(total) || 0
      };

      const newTicket = TicketModel.create(ticket, items);
      res.status(201).json(newTicket);
    } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(500).json({ error: 'Failed to create ticket' });
    }
  },

  /**
   * Update a ticket
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateTicket(req, res) {
    try {
      const { id } = req.params;
      const { customerName, customerPhone, date, total, items } = req.body;

      if (!customerName || !date || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Missing required ticket information' });
      }

      // Check if ticket exists
      const existingTicket = TicketModel.getById(id);
      if (!existingTicket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      // Update the ticket
      const ticket = {
        customerName,
        customerPhone: customerPhone || '',
        date,
        total: parseFloat(total) || 0
      };

      const updatedTicket = TicketModel.update(id, ticket, items);
      res.json(updatedTicket);
    } catch (error) {
      console.error(`Error updating ticket ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to update ticket' });
    }
  },

  /**
   * Delete a ticket
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  deleteTicket(req, res) {
    try {
      const { id } = req.params;

      // Check if ticket exists
      const existingTicket = TicketModel.getById(id);
      if (!existingTicket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      // Delete the ticket
      const success = TicketModel.delete(id);
      if (success) {
        res.status(204).end();
      } else {
        res.status(500).json({ error: 'Failed to delete ticket' });
      }
    } catch (error) {
      console.error(`Error deleting ticket ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to delete ticket' });
    }
  }
};

module.exports = TicketController;