const express = require('express')
const session = require('express-session')
const { v4: uuidv4 } = require('uuid')
const { dbAll, dbGet, dbRun, dbDelete } = require('./dbUtils') // Import the functions
const cors = require('cors')
const cron = require('node-cron')
const bcrypt = require('bcrypt')
const PORT = process.env.PORT || 5000

const app = express()
const saltRounds = 10

console.log('Server is starting...')

function formatDate(date) {
          return date
                    .toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                    })
                    .split('/')
                    .reverse()
                    .join('-')
}

cron.schedule(
          '5 8 * * *',
          async () => {
                    try {
                              const today = new Date()
                              const formattedToday = formatDate(today)
                              const dayOfWeek = today.getDay()

                              if (dayOfWeek === 0 || dayOfWeek === 6) {
                                        console.log(
                                                  'Hari ini adalah weekend. Cron job tidak berjalan.'
                                        )
                                        return
                              }

                              console.log('Mengecek siswa yang belum absen...')

                              const siswa = await dbAll('SELECT * FROM siswa')
                              const absensi = await dbAll(
                                        'SELECT id_siswa, tanggal FROM absensi WHERE tanggal = ?',
                                        [formattedToday]
                              )

                              const absentStudents = siswa.filter(
                                        (student) =>
                                                  !absensi.some(
                                                            (record) =>
                                                                      record.id_siswa ===
                                                                                student.id &&
                                                                      record.tanggal ===
                                                                                formattedToday
                                                  )
                              )

                              for (const student of absentStudents) {
                                        await dbRun(
                                                  'INSERT INTO absensi (id, id_siswa, tanggal, waktu, keterangan, hari) VALUES (?, ?, ?, ?, ?, ?)',
                                                  [
                                                            uuidv4(),
                                                            student.id,
                                                            formattedToday,
                                                            '08:05:00',
                                                            'alpha',
                                                            today.getDay(),
                                                  ]
                                        )
                              }

                              console.log(
                                        `Mengabsen ${absentStudents.length} siswa sebagai "alpha"`
                              )
                    } catch (error) {
                              console.error('Error running cron job:', error)
                    }
          },
          {
                    timezone: 'Asia/Makassar',
          }
)

app.use(express.json())
app.use(
          cors({
                    origin: 'http://localhost:3000', // URL of your Vue app
                    credentials: true, // Allow session cookie to be sent
          })
)

app.use(
          session({
                    secret: '2763', // Change this to a secure key
                    resave: false,
                    saveUninitialized: false,
                    cookie: { secure: false, maxAge: 3 * 60 * 60 * 1000 }, // Set to true if using HTTPS in production
          })
)

const lokasiSekolah = {
          red: [
                    {
                              latitude: 0.14239728878623928,
                              longitude: 117.47539841054972,
                    }, // Bottom Left
                    {
                              latitude: 0.14365367596550838,
                              longitude: 117.47618692105851,
                    }, // Top Right
          ],
          yellow: [
                    {
                              latitude: 0.14354758525449932,
                              longitude: 117.47539210783744,
                    }, // Bottom Left
                    {
                              latitude: 0.14448500973330178,
                              longitude: 117.47667389633806,
                    }, // Top Right
          ],
          blue: [
                    {
                              latitude: 0.14431282974424348,
                              longitude: 117.4760895260051,
                    }, // Bottom Left
                    {
                              latitude: 0.14535028087835974,
                              longitude: 117.47685637627917,
                    }, // Top Right
          ],
}

app.post('/login', async (req, res) => {
          try {
                    const { nama, password, userPosition } = req.body
                    const waktu =
                              '07:00:00' ||
                              new Date(
                                        `1970-01-01 ${new Date().toLocaleTimeString().replace(/ (AM|PM)$/, '')}`
                              )
                                        .toTimeString()
                                        .split(' ')[0] // PLACEHOLDER FOR TESTING ( REPLACE )
                    const hari =
                              'Monday' ||
                              new Date().toLocaleDateString('en-GB', {
                                        weekday: 'long',
                              }) // PLACEHOLDER FOR TESTING ( REPLACE )
                    const siswa = await dbAll('SELECT * FROM siswa')
                    const guru = await dbAll('SELECT * FROM guru')
                    const users = [...guru, ...siswa]
                    const user = users.find(
                              (u) => u.nama.trim() === nama.trim()
                    )

                    const error = {
                              nama: false,
                              password: false,
                              ontime: false,
                              hari: false,
                              position: '',
                    }

                    if (!user) {
                              error.nama = true
                              return res.status(401).json({
                                        message: 'Invalid credentials',
                                        error,
                              })
                    }

                    // Simulate user location (for testing)
                    userPosition.latitude =
                              lokasiSekolah.red[0].latitude + 0.0001 // PLACEHOLDER FOR TESTING ( DELETE )
                    userPosition.longitude =
                              lokasiSekolah.red[0].longitude + 0.0001 // PLACEHOLDER FOR TESTING ( DELETE )

                    function isInsideZone(user, zone) {
                              const [bottomLeft, topRight] = zone
                              return (
                                        user.latitude >= bottomLeft.latitude &&
                                        user.latitude <= topRight.latitude &&
                                        user.longitude >=
                                                  bottomLeft.longitude &&
                                        user.longitude <= topRight.longitude
                              )
                    }

                    if (
                              user.role === 'siswa' &&
                              !(waktu >= '06:00:00' && waktu <= '08:00:00')
                    ) {
                              error.ontime = true
                    }

                    if (
                              ['Saturday', 'Sunday'].includes(hari) &&
                              user.role === 'siswa'
                    ) {
                              error.hari = true
                    }

                    if (
                              (!userPosition.latitude ||
                                        !userPosition.longitude) &&
                              user.role === 'siswa'
                    ) {
                              error.position =
                                        'Tidak dapat mendapatkan lokasi anda.'
                    } else if (user.role === 'siswa') {
                              if (
                                        isInsideZone(
                                                  userPosition,
                                                  lokasiSekolah.red
                                        ) ||
                                        isInsideZone(
                                                  userPosition,
                                                  lokasiSekolah.yellow
                                        ) ||
                                        isInsideZone(
                                                  userPosition,
                                                  lokasiSekolah.blue
                                        )
                              ) {
                                        console.log(
                                                  `Received location: Lat ${userPosition.latitude}, Lon ${userPosition.longitude}`
                                        )
                              } else {
                                        error.position =
                                                  'Anda tidak di sekolah.'
                              }
                    }

                    if (!(await bcrypt.compare(password, user.password))) {
                              error.password = true
                    }

                    if (
                              error.nama ||
                              error.password ||
                              error.ontime ||
                              error.hari ||
                              error.position
                    ) {
                              return res.status(401).json({
                                        message: 'Invalid credentials',
                                        error,
                              })
                    }

                    const { password: _, ...userSessionData } = user
                    req.session.user = userSessionData
                    res.json({ message: 'Login successful' })
          } catch (error) {
                    console.error('Login error:', error)
                    res.status(500).json({
                              message: 'Internal server error',
                              error: error.message,
                    })
          }
})

app.get('/users', async (req, res) => {
          try {
                    const siswa = await dbAll('SELECT * FROM siswa')
                    const guru = await dbAll('SELECT * FROM guru')
                    res.json([...siswa, ...guru])
          } catch (error) {
                    console.error('Error fetching users:', error)
                    res.status(500).json({ message: 'Internal server error' })
          }
})

app.post('/logout', (req, res) => {
          req.session.destroy(() => {
                    res.json({ message: 'Logged out' })
          })
})

app.get('/session', async (req, res) => {
          if (req.session.user) {
                    res.json({ loggedIn: true, user: req.session.user })
          } else {
                    res.json({ loggedIn: false })
          }
})

/*
// Protected route example
app.get('/profile', (req, res) => {
          if (req.session.user) {
                    res.json({ profile: req.session.user });
          } else {
                    res.status(401).json({ message: 'Not authenticated' });
          }
});
*/

app.get('/jurusan', async (req, res) => {
          try {
                    const jurusan = await dbAll('SELECT * FROM jurusan')
                    res.json(jurusan)
          } catch (error) {
                    console.error('Error fetching jurusan:', error)
                    res.status(500).json({ message: 'Internal server error' })
          }
})

app.get('/siswa', async (req, res) => {
          try {
                    const siswa = await dbAll('SELECT * FROM siswa')
                    res.json(siswa)
          } catch (error) {
                    console.error('Error fetching siswa:', error)
                    res.status(500).json({ message: 'Internal server error' })
          }
})

app.post('/siswa', async (req, res) => {
          try {
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
                    } = req.body
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
                    const namaUsers = [...siswa, ...guru].map(
                              (user) => user.nama
                    )
                    inputErrors.nama =
                              namaUsers.includes(nama) || nama.length > 100

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
                              (id_jurusan === 1 || id_jurusan === 2) &&
                              !subdivisi.trim()

                    const hashedPassword = await bcrypt.hash(password, 10)

                    if (
                              !Object.values(inputErrors).some(
                                        (value) => value === true
                              )
                    ) {
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
                              res.status(201).json({
                                        message: 'Siswa added successfully',
                              })
                    } else {
                              res.status(400).json({
                                        message: 'Validation failed',
                                        errors: inputErrors,
                              })
                    }
          } catch (error) {
                    console.error('Register error:', error)
                    res.status(500).json({
                              message: 'Internal server error',
                              error: error.message,
                    })
          }
})

app.get('/absensi', async (req, res) => {
          try {
                    const {
                              tanggal = '',
                              id_siswa = '',
                              keterangan = '',
                              waktu = '',
                    } = req.query
                    let sql = 'SELECT * FROM absensi WHERE 1=1'
                    const params = []

                    if (tanggal) {
                              sql += ' AND tanggal = ?'
                              params.push(tanggal)
                    }
                    if (id_siswa) {
                              sql += ' AND id_siswa = ?'
                              params.push(id_siswa)
                    }
                    if (keterangan) {
                              sql += ' AND keterangan = ?'
                              params.push(keterangan)
                    }
                    if (waktu) {
                              sql += ' AND waktu = ?'
                              params.push(waktu)
                    }

                    const absensi = await dbAll(sql, params)

                    if (absensi.length === 0) {
                              return res
                                        .status(404)
                                        .json({ message: 'Data not found' })
                    }

                    res.json(absensi)
          } catch (error) {
                    console.error('Error fetching absensi:', error)
                    res.status(500).json({
                              message: 'Error fetching absensi',
                              error: error,
                    })
          }
})

app.post('/absensi', async (req, res) => {
          try {
                    const { tanggal, id_siswa, keterangan, waktu, hari } =
                              req.body
                    const absensi = await dbAll(
                              'SELECT * FROM absensi WHERE id_siswa = ? AND tanggal = ?',
                              [id_siswa, tanggal]
                    )
                    const id = uuidv4()

                    if (absensi.length > 0) {
                              return res.status(400).json({
                                        error: 'Absensi already exists for this student.',
                              })
                    }

                    await dbRun(
                              'INSERT INTO absensi (id, tanggal, id_siswa, keterangan, waktu, hari) VALUES (?, ?, ?, ?, ?, ?)',
                              [id, tanggal, id_siswa, keterangan, waktu, hari]
                    )

                    res.status(201).json({
                              message: 'Absensi berhasil ditambahkan',
                              data: {
                                        id,
                                        tanggal,
                                        id_siswa,
                                        keterangan,
                                        waktu,
                                        hari,
                              },
                    })
          } catch (error) {
                    res.status(500).json({ error: error.message })
          }
})

app.put('/absensi', async (req, res) => {
          try {
                    const idAbsensi = req.body.id
                    const newKeterangan = req.body.editedKeterangan
                    const absen = await dbGet(
                              'SELECT * FROM absensi WHERE id = ?',
                              [idAbsensi]
                    )

                    if (!absen) {
                              return res.status(404).json({
                                        message: 'Absensi tidak ditemukan',
                              })
                    }

                    await dbRun(
                              'UPDATE absensi SET keterangan = ? WHERE id = ?',
                              [newKeterangan, idAbsensi]
                    )

                    res.status(200).json({
                              message: 'Absensi updated successfully',
                              data: absen,
                    })
          } catch (error) {
                    console.error('Error fetching absensi:', error)
                    res.status(500).json({ message: 'Internal server error' })
          }
})

app.get('/guru', async (req, res) => {
          try {
                    const guru = await dbAll('SELECT * FROM guru')
                    res.json(guru)
          } catch (error) {
                    console.error('Error fetching guru:', error)
                    res.status(500).json({ message: 'Internal server error' })
          }
})

app.post('/guru', async (req, res) => {
          let errors = 0
          const form = req.body
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
          await addGuru()
})

app.listen(PORT, () => {
          console.log(`Server is running on http://localhost:${PORT}`)
})
