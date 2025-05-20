const express = require('express')
const router = express.Router()
const absensiController = require('../controllers/absensiController')

router.put('/', absensiController.editAbsensi)
router.get('/', absensiController.getAllAbsensi)
router.post('/', absensiController.createAbsensi)
router.delete('/', absensiController.deleteAbsensi)

module.exports = router
