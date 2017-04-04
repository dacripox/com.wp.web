var express = require('express');
var promotionController = require('../controllers/promotionController.js');
var router = express.Router();

/*
 * GET
 */
//router.get('/', promotionController.redirect);

/*
 * GET
 */
router.get('/p/:promoId', promotionController.showPromotion);


/*
 * GET
 */
router.get('/p/:promoId/:refFriend', promotionController.showPromotion);

module.exports = router;