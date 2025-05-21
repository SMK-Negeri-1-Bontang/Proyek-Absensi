const { dbAll, dbGet, dbRun, dbDelete } = require('../utils/dbUtils')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')

exports.findAll = async () => {
          return await dbAll('SELECT * FROM siswa')
}

exports.create = async (siswaData) => {
          const {
                    nama,
                    nis,
                    kelas,
                    absen,
                    subdivisi,
                    id_jurusan,
                    password,
                    confirmPassword,
                    role,
          } = siswaData
          const id = uuidv4()

          const inputErrors = {
                    nama: false,
                    nis: false,
                    password: false,
                    confirmPassword: false,
                    kelas: false,
                    subdivisi: false,
                    jurusan: false,
          }

          const siswa = await dbAll('SELECT * FROM siswa')
          const guru = await dbAll('SELECT * FROM guru')
          const namaUsers = [...siswa, ...guru].map((user) => user.nama)
          inputErrors.nama = namaUsers.includes(nama) || nama.length > 100

          const nisUsers = siswa.map((user) => user.nis)
          const nisNumber = Number(nis)
          inputErrors.nis =
                    !nis.trim() ||
                    isNaN(nisNumber) ||
                    nis.length > 100 ||
                    nisUsers.includes(nis)

          inputErrors.password = password.length < 8

          inputErrors.confirmPassword = confirmPassword !== password

          inputErrors.kelas = !kelas

          inputErrors.jurusan = !id_jurusan

          inputErrors.subdivisi =
                    (id_jurusan === 1 || id_jurusan === 2) && !subdivisi.trim()

          const hashedPassword = await bcrypt.hash(password, 10)

          if (!Object.values(inputErrors).some((value) => value === true)) {
                    await dbRun(
                              'INSERT INTO siswa (id, nama, nis, kelas, absen, subdivisi_jurusan, id_jurusan, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                              [
                                        id,
                                        nama,
                                        nis,
                                        kelas,
                                        absen,
                                        subdivisi,
                                        id_jurusan,
                                        hashedPassword,
                                        role,
                              ]
                    )
                    return {
                              success: true,
                              message: 'Siswa added successfully',
                    }
          } else {
                    throw new Error('Failed to create siswa')
          }
}

exports.edit = async (siswaData) => {
          const {
                    id,
                    nama,
                    nis,
                    kelas,
                    absen,
                    subdivisi_jurusan,
                    id_jurusan,
          } = siswaData

          const filters = [
                    {
                              name: 'nis',
                              code: await dbGet('SELECT * FROM siswa WHERE nis = ?', [nis]),
                              message: 'NIS sudah dipakai, silahkan masukkan NIS lain.',
                    },
                    {
                              name: 'nama',
                              code: await dbGet('SELECT * FROM siswa WHERE nama = ?', [nama]),
                              message: 'Username sudah dipakai, silahkan gunakan username lain.',
                    },
                    {
                              name: 'exists',
                              code: await dbGet('SELECT * FROM siswa WHERE id = ?', [id]),
                              message: 'Siswa tidak ditemukan!',
                    },
          ]

          const errors = {
                    count: 0,
                    messages: {},
          }

          filters.forEach((filter) => {
                    if (
                              filter.name === 'exists' && !filter.code
                    ) {
                              errors.count++
                              errors.messages[filter.name] = filter.message
                    } else if (
                              filter.code &&
                              filter.code.id &&
                              filter.code.id !== id
                    ) {
                              errors.count++
                              errors.messages[filter.name] = filter.message
                    }
          })

          if (errors.count > 0) {
                    throw { status: 400, errors: errors.messages }
          }

          const updatedSiswa = await dbRun(
                    'UPDATE siswa SET nama = ?, nis = ?, kelas = ?, absen = ?, subdivisi_jurusan = ?, id_jurusan = ? WHERE id = ?',
                    [nama, nis, kelas, absen, subdivisi_jurusan, id_jurusan, id]
          )

          return updatedSiswa
}

exports.delete = async (siswaID) => {
          return await dbDelete('DELETE FROM siswa WHERE id = ?', [siswaID])
}
