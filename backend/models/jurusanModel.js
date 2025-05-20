const { dbAll, dbGet, dbRun, dbDelete } = require('../utils/dbUtils')

exports.findAll = async () => {
          return await dbAll('SELECT * FROM jurusan')
}

exports.create = async (formData) => {
          const { nama } = formData

          if (dbGet('SELECT * FROM jurusan WHERE nama = ?', [nama])) {
                    throw {
                              status: 400,
                              errors: {
                                        nama: 'Nama jurusan sudah digunakan, silahkan gunakan nama lain!',
                              },
                    }
          }

          return await dbRun('INSERT INTO jurusan (nama) VALUES (?)', [nama])
}

exports.edit = async (formData) => {
          const { id, nama } = formData
          const filters = [
                    {
                              name: 'nama',
                              code: await dbGet(
                                        'SELECT * FROM jurusan WHERE nama = ?',
                                        [nama]
                              ),
                              message: 'Nama jurusan sudah digunakan, silahkan gunakan nama lain!.',
                    },
                    {
                              nama: 'exists',
                              code: !(await dbGet(
                                        'SELECT * FROM jurusan WHERE id = ?',
                                        [id]
                              )),
                              message: 'Jurusan tidak ditemukan!',
                    },
          ]
          const errors = {
                    count: 0,
                    messages: {},
          }

          filters.forEach((filter) => {
                    if (filter.code && filter.code.id !== id) {
                              errors.count++
                              errors.messages[filter.name] = filter.message
                    }
          })

          if (errors.count > 0) {
                    throw { status: 400, errors: errors.messages }
          }

          const editedJurusan = await dbRun(
                    'UPDATE siswa SET nama = ? WHERE id = ?',
                    [nama]
          )
          return editedJurusan
}

exports.delete = async (jurusanID) => {
          return await dbDelete('DELETE FROM jurusan WHERE id = ?', [jurusanID])
}
