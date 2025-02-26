const express = require('express');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors({
          origin: 'http://localhost:3000', // URL of your Vue app
          credentials: true              // Allow session cookie to be sent
}));

// Configure session middleware
app.use(session({
          secret: '2763',  // Change this to a secure key
          resave: false,
          saveUninitialized: false,
          cookie: { secure: false, maxAge: 1000 * 60 * 60 } // Set to true if using HTTPS in production
}));

// Dummy user data for demonstration
const jurusan = [
          {
                    "id": 1,
                    "nama": "Kimia Analis"
          },
          {
                    "id": 2,
                    "nama": "Kimia Industri"
          },
          {
                    "id": 3,
                    "nama": "Otomasi Industri"
          },
          {
                    "id": 4,
                    "nama": "Pengembangan Perangkat Lunak dan Gim"
          },
          {
                    "id": 5,
                    "nama": "Tata Pendinginan Udara"
          },
          {
                    "id": 6,
                    "nama": "Teknik Listrik"
          },
          {
                    "id": 7,
                    "nama": "Teknik Kendaraan Ringan"
          },
          {
                    "id": 8,
                    "nama": "Teknik Pengelasan"
          },
          {
                    "id": 9,
                    "nama": "Farmasi"
          },
          {
                    "id": 10,
                    "nama": "Teknik Mesin"
          }
];

const siswa = [
          {
                    "id": 1,
                    "nama": "Valen Pratama Sahedi",
                    "nis": "230501035",
                    "kelas": 2,
                    "absen": 36,
                    "subdivisi_jurusan": "tidak ada",
                    "id_jurusan": 4,
                    "password": "12345",
                    "role": "siswa"
          },
          {
                    "id": 2,
                    "nama": "Tristan Argyadeva Ravindra Maulany",
                    "nis": "230501034",
                    "kelas": 2,
                    "absen": 35,
                    "subdivisi_jurusan": "tidak ada",
                    "id_jurusan": 4,
                    "password": "12345",
                    "role": "siswa"
          },
          {
                    "id": 3,
                    "nama": "Alya Putri Ramadhan",
                    "nis": "230501100",
                    "kelas": 2,
                    "absen": 10,
                    "subdivisi_jurusan": "A",
                    "id_jurusan": 1,
                    "password": "12345",
                    "role": "siswa"
          },
          {
                    "id": 4,
                    "nama": "Bima Surya",
                    "nis": "230501101",
                    "kelas": 3,
                    "absen": 11,
                    "subdivisi_jurusan": "B",
                    "id_jurusan": 1,
                    "password": "12345",
                    "role": "siswa"
          },
          {
                    "id": 5,
                    "nama": "Citra Anggraini",
                    "nis": "230501102",
                    "kelas": 4,
                    "absen": 12,
                    "subdivisi_jurusan": "A",
                    "id_jurusan": 2,
                    "password": "12345",
                    "role": "siswa"
          },
          {
                    "id": 6,
                    "nama": "Damar Yusuf",
                    "nis": "230501103",
                    "kelas": 1,
                    "absen": 13,
                    "subdivisi_jurusan": "A",
                    "id_jurusan": 2,
                    "password": "12345",
                    "role": "siswa"
          }
];

const absensi = [
          {
                    "id": 1,
                    "keterangan": "terlambat",
                    "tanggal": "2025-02-10",
                    "waktu": "07:15:00",
                    "id_siswa": 1
          },
          {
                    "id": 2,
                    "keterangan": "hadir",
                    "tanggal": "2025-02-13",
                    "waktu": "07:00:00",
                    "id_siswa": 2
          },
          {
                    "id": 3,
                    "keterangan": "hadir",
                    "tanggal": "2025-02-25",
                    "waktu": "07:00:00",
                    "id_siswa": 2
          },
          {
                    "id": 4,
                    "keterangan": "hadir",
                    "tanggal": "2025-02-25",
                    "waktu": "07:05:00",
                    "id_siswa": 3
          },
          {
                    "id": 5,
                    "keterangan": "terlambat",
                    "tanggal": "2025-02-25",
                    "waktu": "07:20:00",
                    "id_siswa": 4
          },
          {
                    "id": 6,
                    "keterangan": "sakit",
                    "tanggal": "2025-02-24",
                    "waktu": "00:00:00",
                    "id_siswa": 3
          },
          {
                    "id": 7,
                    "keterangan": "hadir",
                    "tanggal": "2025-02-24",
                    "waktu": "07:00:00",
                    "id_siswa": 4
          },
          {
                    "id": 8,
                    "keterangan": "izin",
                    "tanggal": "2025-02-25",
                    "waktu": "00:00:00",
                    "id_siswa": 5
          },
          {
                    "id": 9,
                    "keterangan": "hadir",
                    "tanggal": "2025-02-24",
                    "waktu": "07:10:00",
                    "id_siswa": 5
          },
          {
                    "id": 10,
                    "keterangan": "terlambat",
                    "tanggal": "2025-02-25",
                    "waktu": "07:18:00",
                    "id_siswa": 6
          }
];

const guru = [
          {
                    "id": 1,
                    "nama": "Pak Wahyu",
                    "password": "12345",
                    "role": "guru"
          },
          {
                    "id": 2,
                    "nama": "Bu Damaris",
                    "password": "12345",
                    "role": "guru"
          }
];

// Login endpoint
app.post('/login', (req, res) => {
          const { nama, password } = req.body;
          const users = [...siswa, ...guru];
          const user = users.find(u => u.nama === nama);

          if (!user) {
                    return res.status(401).json({ message: 'Invalid credentials', error: { nama: true, password: false } });
          } else if (String(user.password) !== String(password)) {
                    return res.status(401).json({ message: 'Invalid credentials', error: { nama: false, password: true } });
          } else {
                    const { userPassword, ...userSessionData } = user;
                    req.session.user = userSessionData;
                    res.json({ message: 'Login successful' });
          }
});

app.get('/users', (req, res) => {
          res.json([...siswa, ...guru]);
});

app.post('/logout', (req, res) => {
          req.session.destroy(() => {
                    res.json({ message: 'Logged out' });
          });
});

// auth-status
app.get('/session', (req, res) => {
          if (req.session.user) {
                    res.json({ loggedIn: true, user: req.session.user });
          } else {
                    res.json({ loggedIn: false });
          }
});

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

app.get('/jurusan', (req, res) => {
          res.json(jurusan);
});

app.get('/siswa', (req, res) => {
          res.json(siswa);
});

app.post('/siswa', (req, res) => {
          const newUser = req.body;

          const inputErrors = {
                    nama: false,
                    nis: false,
                    password: false,
                    confirmPassword: false,
                    kelas: false,
                    subdivisi: false,
                    jurusan: false
          };

          const namaUsers = [...siswa, ...guru].map(user => user.nama);
          inputErrors.nama = namaUsers.includes(newUser.nama) || newUser.nama.length > 100;

          const nisUsers = siswa.map(user => user.nis);
          const nisNumber = Number(newUser.nis);
          inputErrors.nis = !newUser.nis.trim() || isNaN(nisNumber) || newUser.nis.length > 100 || nisUsers.includes(newUser.nis);

          inputErrors.password = newUser.password.length < 8;

          inputErrors.confirmPassword = newUser.confirmPassword !== newUser.password;

          inputErrors.kelas = !newUser.kelas;

          inputErrors.jurusan = !newUser.id_jurusan;

          inputErrors.subdivisi = (newUser.jurusan === 1 || newUser.jurusan === 2) && !newUser.subdivisi.trim();

          if ( !Object.values(inputErrors).some(value => value === true) ) {
                    const newSiswa = { id: uuidv4(), ...newUser };
                    siswa.push(newSiswa);
                    res.status(201).json({ message: "Siswa added successfully", newSiswa });
          } else {
                    res.status(400).json({ message: "Validation failed", errors: inputErrors })
          }

});

app.get('/absensi', (req, res) => {
          const { tanggal, id } = req.query;
          filteredAbsensi = absensi;

          if (tanggal) {
                    filteredAbsensi = absensi.filter(a => String(a.tanggal) === String(tanggal));
                    return res.json(filteredAbsensi);
          }

          if (id) {
                    filteredAbsensi = absensi.find(a => a.id == id);
                    return res.json(filteredAbsensi);
          }

          res.json(filteredAbsensi[0]);
});

app.get('/guru', (req, res) => {
          res.json(guru);
});

app.listen(PORT, () => {
          console.log(`Server is running on http://localhost:${PORT}`);
});