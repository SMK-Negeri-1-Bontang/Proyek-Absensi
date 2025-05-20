const express = require('express')
const session = require('express-session')
const { v4: uuidv4 } = require('uuid')
const { dbAll, dbGet, dbRun, dbDelete } = require('./utils/dbUtils')
const siswaRoutes = require('./routes/siswa')
const guruRoutes = require('./routes/guru')
const absensiRoutes = require('./routes/absensi')
const jurusanRoutes = require('./routes/jurusan')
const authRoutes = require('./routes/auth')
const cors = require('cors')
const cron = require('node-cron')
const bcrypt = require('bcrypt')
const PORT = process.env.PORT || 5000

const app = express()
const saltRounds = 10

console.log('Server is starting...')

//Mengformat tanggal
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

//Cron adalah package untuk mengeksekusi kode sesuai jadwal
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

// Link localhost
app.use(express.json())
app.use(
          cors({
                    origin: 'http://localhost:3000', // URL of your Vue app
                    credentials: true, // Allow session cookie to be sent
          })
)

// Keamanan
app.use(
          session({
                    secret: '2763', // Change this to a secure key
                    resave: false,
                    saveUninitialized: false,
                    cookie: { secure: false, maxAge: 3 * 60 * 60 * 1000 }, // Set to true if using HTTPS in production
          })
)

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

app.use('/', authRoutes)
app.use('/siswa', siswaRoutes)
app.use('/guru', guruRoutes)
app.use('/absensi', absensiRoutes)
app.use('/jurusan', jurusanRoutes)

app.listen(PORT, () => {
          console.log(`Server is running on http://localhost:${PORT}`)
})
