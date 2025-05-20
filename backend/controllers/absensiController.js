const absensiModel = require('../models/absensiModel')

exports.editAbsensi = async (req, res) => {
          try {
                    const absensi = await absensiModel.edit(req.body)
                    res.json(absensi)
          } catch (error) {
                    console.error('Error editing absensi:', error.message)
                    res.status(500).json({
                              message: error.message || 'Internal server error',
                    })
          }
}

exports.getAllAbsensi = async (req, res) => {
          try {
                    const absensi = await absensiModel.findAll(req.query)
                    res.json(absensi)
          } catch (error) {
                    console.error('Error fetching absensi:', error.message)
                    res.status(500).json({
                              message: error.message || 'Internal server error',
                    })
          }
}

exports.createAbsensi = async (req, res) => {
          try {
                    const newAbsensi = await absensiModel.create(req.body)
                    res.status(201).json(newAbsensi)
          } catch (error) {
                    console.error('Error creating absensi:', error.message)
                    res.status(500).json({
                              message: error.message || 'Internal server error',
                    })
          }
}

exports.deleteAbsensi = async (req, res) => {
          try {
                    const id = req.body
                    const result = await absensiModel.delete(id)
                    res.json({ message: 'Absensi deleted successfully' })
          } catch (error) {
                    console.error('Error deleting absensi:', error)
                    res.status(500).json({ message: 'Internal server error' })
          }
}
