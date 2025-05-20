const bcrypt = require('bcrypt')
const { dbAll } = require('../utils/dbUtils')
const lokasiSekolah = require('../utils/lokasiSekolah')

exports.login = async (req, res) => {
          try {
                    const { nama, password, userPosition } = req.body
                    const waktu = new Date(
                              `1970-01-01 ${new Date().toLocaleTimeString().replace(/ (AM|PM)$/, '')}`
                    )
                              .toTimeString()
                              .split(' ')[0]
                    const hari = new Date().toLocaleDateString('en-GB', {
                              weekday: 'long',
                    })

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
                              const isInsideZone = (pos, zone) => {
                                        const [bottomLeft, topRight] = zone
                                        return (
                                                  pos.latitude >=
                                                            bottomLeft.latitude &&
                                                  pos.latitude <=
                                                            topRight.latitude &&
                                                  pos.longitude >=
                                                            bottomLeft.longitude &&
                                                  pos.longitude <=
                                                            topRight.longitude
                                        )
                              }

                              if (
                                        !isInsideZone(
                                                  userPosition,
                                                  lokasiSekolah.red
                                        ) &&
                                        !isInsideZone(
                                                  userPosition,
                                                  lokasiSekolah.yellow
                                        ) &&
                                        !isInsideZone(
                                                  userPosition,
                                                  lokasiSekolah.blue
                                        )
                              ) {
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
          } catch (err) {
                    console.error('Login error:', err)
                    res.status(500).json({
                              message: 'Internal server error',
                              error: err.message,
                    })
          }
}

exports.logout = (req, res) => {
          req.session.destroy(() => {
                    res.json({ message: 'Logged out' })
          })
}

exports.getSession = (req, res) => {
          if (req.session.user) {
                    res.json({ loggedIn: true, user: req.session.user })
          } else {
                    res.json({ loggedIn: false })
          }
}

exports.getUsers = async (req, res) => {
          try {
                    const siswa = await dbAll('SELECT * FROM siswa')
                    const guru = await dbAll('SELECT * FROM guru')
                    res.json([...siswa, ...guru])
          } catch (error) {
                    console.error('Error fetching users:', error)
                    res.status(500).json({ message: 'Internal server error' })
          }
}
