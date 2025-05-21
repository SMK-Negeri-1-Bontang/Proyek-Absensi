const jurusanModel = require('../models/jurusanModel')

exports.getAllJurusan = async (req, res) => {
          try {
                    const jurusan = await jurusanModel.findAll()
                    res.json(jurusan)
          } catch (error) {
                    res.status(500).json({
                              message: 'Tidak dapat mengambil data siswa.',
                    })
          }
}

exports.createJurusan = async (req, res) => {
          try {
                    const form = req.body
                    /*
                    const formExample = {
                              nama: 'nama'
                    }
                    */
                    const newJurusan = await jurusanModel.create(form)
                    res.json({
                              message: 'Jurusan created successfully',
                              error: false,
                    })
          } catch (error) {
                    console.error('Error creating jurusan:', error)
                    res.status(500).json({
                              message: 'Error creating jurusan',
                              error: error,
                    })
          }
}

exports.editJurusan = async (req, res) => {
          try {
                    const form = req.body
                    /*
                    const formExample = {
                              id: 'currentID'
                              nama: 'nama'
                    }
                    */
                    const editedJurusan = await jurusanModel.edit(form)
                    res.json({
                              message: 'Jurusan edited successfully',
                              error: false,
                    })
          } catch (error) {
                    console.error('Error editing jurusan:', error)
                    res.status(500).json({
                              message: 'Error editing jurusan',
                              error: error,
                    })
          }
}

exports.deleteJurusan = async (req, res) => {
          try {
                    const id = req.body.id
                    const deletedJurusan = await jurusanModel.delete(id)
                    res.json({
                              message: 'Jurusan deleted successfully',
                              error: false,
                    })
          } catch (error) {
                    console.error('Error deleting jurusan:', error)
                    res.status(500).json({
                              message: 'Error deleting jurusan',
                              error: true,
                    })
          }
}
