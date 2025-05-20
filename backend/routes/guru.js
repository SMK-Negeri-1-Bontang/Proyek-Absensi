const express = require('express')
const router = express.Router()
const guruController = require('../controllers/guruController')

router.get('/', guruController.getAllGuru)
router.post('/', guruController.createGuru)
router.put('/', guruController.editGuru)
router.delete('/', guruController.deleteGuru)

module.exports = router
