const router = require('express').Router();
const controller = require('../controllers/ticketsController')

router.post('/',controller.createTicket);
router.delete('/',controller.deleteTicket);
router.get('/',controller.getTickets);
router.get('/:name',controller.getTicket);
router.put('/updateCost',controller.updateTicketCost)
router.put('/updateBalance',controller.updateTicketBalance)
router.put('/updateZone',controller.updateTicketZone)
router.get('/zoneTickets/:zone',controller.getTicketsByZone)


module.exports = router;