const express = require('express')
const router = express.Router()
const siswaController = require('../controllers/siswaController')

router.get('/', siswaController.getAllSiswa)
router.post('/', siswaController.createSiswa)
router.put('/', siswaController.editSiswa)
router.delete('/', siswaController.deleteSiswa)

module.exports = router
