const siswaModel = require('../models/siswaModel')

exports.getAllSiswa = async (req, res) => {
          try {
                    const siswas = await siswaModel.findAll()
                    res.json(siswas)
          } catch (error) {
                    console.error('Error fetching siswa:', error)
                    res.status(500).json({ message: 'Internal server error' })
          }
}

exports.createSiswa = async (req, res) => {
          try {
                    const newSiswa = siswaModel.create(req.body)
                    res.status(201).json(newSiswa)
          } catch (err) {
                    res.status(err.status || 500).json({
                              message: err.message || 'Internal server error',
                              ...(err.errors && { errors: err.errors }),
                    })
          }
}

exports.editSiswa = async (req, res) => {
          const formData = req.body
          /*
          const formExample = {
                    id: 'currentID',
                    nama: 'newNama',
                    nis: 'newNis',
                    kelas: 2,
                    absen: 30,
                    subdivisi_jurusan: 'A',
                    id_jurusan: 9
          }
          */
          try {
                    const editedSiswa = await siswaModel.edit(formData)
                    res.json({
                              message: 'Siswa successfully editted',
                              error: false,
                    })
          } catch (error) {
                    console.error('Error editing siswa:', error)
                    res.status(500).json({
                              message: 'Error editing siswa',
                              error: error,
                    })
          }
          /*
          const errorExample = {
                    message: 'Error editing siswa',
                    error: {
                              nama: 'Username sudah dipakai, selahkan gunakan username lain.',
                              nis: 'NIS sudah dipakai, silahkan masukkan NIS lain.',
                              
                    },
          }
          */
}

exports.deleteSiswa = async (req, res) => {
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
