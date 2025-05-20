const { dbAll, dbGet, dbRun, dbDelete } = require('../utils/dbUtils')
const bcrypt = require('bcrypt')

exports.findAll = async () => {
          const guru = await dbAll('SELECT * FROM guru')
          return guru
}

exports.create = async (guruData) => {
          let errors = 0
          const form = guruData
          const names = await dbAll(
                    `SELECT nama FROM guru UNION SELECT nama FROM siswa`
          )
          const nips = await dbAll('SELECT nip FROM guru')
          /*
          const filter = {
                    nama: {
                              'isNotEmpty': form.nama.content.trim() !== '' ? false : 'Nama tidak boleh kosong.',
                              'isNotOver': form.nama.content.length() < 100 ? false : 'Nama tidak boleh lebih dari 100 karakter',
                              'isNotSame': !guru.map( g => g.nama ).includes( form.nama.content ) ? false : 'Nama sudah terpakai.'
                    },
                    nip: {
                              'isNotEmpty': form.nip.content.trim() !== '' ? false : 'NIP tidak boleh kosong.',
                              'isNotOver': form.nip.content.length() < 18 ? false : 'NIP tidak boleh lebih dari 18 karakter.',
                              'isNotValid': typeof Number( form.nip.content ) === 'number' ? false : 'NIP tidak valid.'
                    },
                    password: {
                              'isNotEmpty': form.password.content.trim() !== '' ? false : 'Password tidak boleh kosong.',
                              'isNotOver': form.password.content.length() < 100 ? false : 'Password tidak boleh lebih dari 100 karakter.'
                    },
                    confirmPassword: {
                              'isTheSame': form.confirmPassword.content === form.password.content ? false : 'Password tidak cocok.'
                    },
          }
          */
          const filter = {
                    nama: {
                              isNotSame: names
                                        .map((n) => n.nama)
                                        .includes(form.nama.content)
                                        ? 'Nama sudah terpakai.'
                                        : false,
                              isInRange: !(
                                        form.nama.content.trim() === '' ||
                                        form.nama.content.length >= 100
                              )
                                        ? false
                                        : 'Nama harus diisi dan tidak boleh lebih dari 100 karakter.',
                    },
                    nip: {
                              isValid: isNaN(Number(form.nip.content))
                                        ? 'NIP tidak valid.'
                                        : false,
                              isInRange: !(
                                        form.nip.content.trim() === '' ||
                                        form.nip.content.length !== 18
                              )
                                        ? false
                                        : 'NIP harus 18 karakter.',
                              isNotSame: nips
                                        .map((n) => n.nip)
                                        .includes(form.nip.content.trim())
                                        ? 'NIP telah digunakan.'
                                        : false,
                    },
                    password: {
                              isInRange: !(
                                        form.password.content.trim() === '' ||
                                        form.password.content.length >= 100 ||
                                        form.password.content.length < 8
                              )
                                        ? false
                                        : 'Password minimal 8 karakter dan tidak boleh lebih dari 100 karakter.',
                    },
                    confirmPassword: {
                              isTheSame:
                                        form.confirmPassword.content !==
                                        form.password.content
                                                  ? 'Password tidak cocok.'
                                                  : false,
                              password404:
                                        form.password.content.trim() === ''
                                                  ? 'Password belum dibuat.'
                                                  : false,
                    },
          }
          function validate(fieldNames) {
                    fieldNames.forEach((field) => {
                              const conditions = Object.values(filter[field])
                              for (const condition of conditions) {
                                        if (condition) {
                                                  form[field].error = condition
                                                  errors++
                                                  break
                                        }
                              }
                    })
          }
          function checkForErrors() {
                    if (errors) {
                              res.status(400).json({
                                        message: 'Validasi Gagal',
                                        form,
                              })
                              return true
                    }
                    return false
          }
          async function addGuru() {
                    const hashedPassword = await bcrypt.hash(
                              form.password.content,
                              10
                    )

                    await dbRun(
                              'INSERT INTO guru (id, nama, nip, password, role) VALUES (?, ?, ?, ?, ?)',
                              [
                                        uuidv4(),
                                        form.nama.content,
                                        form.nip.content,
                                        hashedPassword,
                                        'guru',
                              ]
                    )

                    res.status(201).json({
                              message: 'Guru berhasil ditambah',
                    })
          }

          validate(['nama', 'nip', 'password', 'confirmPassword'])
          if (checkForErrors()) return
          const newGuru = await addGuru()
          return newGuru
}

exports.edit = async (guruData) => {
          const { id, nama, password, nip } = guruData
          const hashedPassword = await bcrypt.hash(password, 10)
          const filters = [
                    {
                              name: 'nip',
                              code: await dbGet(
                                        'SELECT * FROM guru WHERE nip = ?',
                                        [nip]
                              ),
                              message: 'NIP sudah dipakai, silahkan masukkan NIP lain.',
                    },
                    {
                              name: 'nama',
                              code: await dbGet(
                                        'SELECT * FROM guru WHERE nama = ?',
                                        [nama]
                              ),
                              message: 'Username sudah dipakai, selahkan gunakan username lain.',
                    },
                    {
                              nama: 'exists',
                              code: !(await dbGet(
                                        'SELECT * FROM guru WHERE id = ?',
                                        [id]
                              )),
                              message: 'Guru tidak ditemukan!',
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

          const updatedGuru = await dbRun(
                    'UPDATE guru SET nama = ?, password = ?, nip = ? WHERE id = ?',
                    [nama, hashedPassword, nip, id]
          )
          return updatedGuru
}

exports.delete = async (guruID) => {
          return await dbDelete('DELETE FROM guru WHERE id = ?', [guruID])
}
