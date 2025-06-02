const router = require('express').Router();
const VideoController = require('../controllers/VideoController');

router.get('/search', VideoController.search);
router.get('/:youtube_id', VideoController.getById);

module.exports = router;
