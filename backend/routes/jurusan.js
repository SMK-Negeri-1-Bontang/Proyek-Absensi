const express = require('express')
const router = express.Router()
const jurusanController = require('../controllers/jurusanController')

router.get('/', jurusanController.getAllJurusan)
router.post('/', jurusanController.createJurusan)
router.put('/', jurusanController.editJurusan)
router.delete('/', jurusanController.deleteJurusan)

module.exports = router
