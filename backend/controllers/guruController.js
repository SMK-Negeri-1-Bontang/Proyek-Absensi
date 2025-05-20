const guruModel = require('../models/guruModel')

exports.getAllGuru = async (req, res) => {
          try {
                    const gurus = await guruModel.findAll()
                    res.json(gurus)
          } catch (error) {
                    console.error('Error fetching guru:', error)
                    res.status(500).json({ message: 'Internal server error' })
          }
}

exports.createGuru = (req, res) => {
          try {
                    const newGuru = guruModel.create(req.body)
                    res.status(201).json(newGuru)
          } catch (error) {
                    console.error('Error creating guru:', error)
                    res.status(500).json({ message: 'Internal server error' })
          }
}

exports.editGuru = async (req, res) => {
          const formData = req.body
          /*
          const formExample = {
                    id: 'currentID',
                    nama: 'newNama',
                    password: 'newPassword',
                    nip: 'newNip',
          }
          */
          try {
                    const editedGuru = await guruModel.edit(formData)
                    res.json({
                              message: 'Guru successfully editted',
                              error: false,
                    })
          } catch (error) {
                    console.error('Error editing guru:', error)
                    res.status(500).json({
                              message: 'Error editing guru',
                              error: error,
                    })
          }
          /*
          const errorExample = {
                    message: 'Error editing guru',
                    error: {
                              nama: 'Username sudah dipakai, selahkan gunakan username lain.',
                              nip: 'NIP sudah dipakai, silahkan masukkan NIP lain.',
                    },
          }
          */
}

exports.deleteGuru = async (req, res) => {
          try {
                    const id = req.body
                    const result = await absensiModel.delete(id)
                    res.json({
                              message: 'Guru deleted successfully',
                              error: false,
                    })
          } catch (error) {
                    console.error('Error deleting guru:', error)
                    res.status(500).json({
                              message: 'Error deleting guru',
                              error: true,
                    })
          }
}
