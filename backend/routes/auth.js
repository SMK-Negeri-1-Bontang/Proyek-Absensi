const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/login', authController.login)
router.get('/users', authController.getUsers)
router.post('/logout', authController.logout)
router.get('/session', authController.getSession)

module.exports = router
