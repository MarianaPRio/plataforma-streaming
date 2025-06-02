const router = require('express').Router();
const PlaylistController = require('../controllers/PlaylistController');

router.post('/', PlaylistController.create);
router.get('/', PlaylistController.list);
router.get('/:id', PlaylistController.get);
router.put('/:id', PlaylistController.update);
router.delete('/:id', PlaylistController.remove);
router.delete('/:id', PlaylistController.remove);

router.post('/:id/videos', PlaylistController.addVideo);
router.get('/:id/videos', PlaylistController.listVideos);
router.delete('/:id/videos/:videoId', PlaylistController.removeVideo);

module.exports = router;
