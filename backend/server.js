const express = require('express');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const cron = require("node-cron");
const PORT = process.env.PORT || 5000;

const app = express();

console.log("Server is starting...");

cron.schedule("5 8 * * *", () => {
    console.log("Mengecek siswa yang belum absen...");

    const today = new Date().toISOString().split("T")[0];
    const absentStudents = siswa.filter(student =>
        !absensi.some(record => record.id_siswa === student.id && record.tanggal === today)
    );

    absentStudents.forEach(student => {
        absensi.push({
            id: uuidv4(),
            id_siswa: student.id,
            tanggal: today,
            waktu: "08:05:00",
            keterangan: "alpha"
        });
    });

    console.log(`Mengabsen ${absentStudents.length} siswa sebagai "alpha"`);
}, {
    timezone: "Asia/Makassar"
});

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // URL of your Vue app
    credentials: true              // Allow session cookie to be sent
}));

app.use(session({
    secret: '2763',  // Change this to a secure key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 } // Set to true if using HTTPS in production
}));

const lokasiSekolah = {
    latitude: 0.00,
    longitude: 0.00
}

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

app.post('/login', (req, res) => {
    const { nama, password } = req.body;
    const userPosition = req.body.userPosition;
    const waktu = "07:00:00" || new Date(`1970-01-01 ${new Date().toLocaleTimeString().replace(/ (AM|PM)$/, "")}`).toTimeString().split(" ")[0];
    const hari = "Monday" || new Date().toLocaleDateString('en-GB', { weekday: 'long' });
    const users = [...siswa, ...guru];
    const user = users.find(u => u.nama === nama);
    const error = {
        nama: false,
        password: false,
        ontime: false,
        hari: false,
        position: false
    }

    console.log( new Date().toLocaleDateString('en-GB', { weekday: 'long' }) );

    if (user && user.role == "siswa" && !(waktu >= "06:00:00" && waktu <= "08:00:00")) {
        error.ontime = true;
    }

    if (["Saturday", "Sunday"].includes(hari)) {
        error.hari = true;
    }

    if (!userPosition.latitude || !userPosition.longitude) {
        error.position = true;
    } else {
        console.log(`Received location: Lat ${userPosition.latitude}, Lon ${userPosition.longitude}`);
    }

    if (!user) {
        error.nama = true;
        return res.status(401).json({ message: 'Invalid credentials', error: error });
    } else if (String(user.password) !== String(password)) {
        error.password = true;
        return res.status(401).json({ message: 'Invalid credentials', error: error });
    } else if (error.ontime) {
        return res.status(401).json({ message: 'Invalid credentials', error: error });
    } else if (error.hari) {
        return res.status(401).json({ message: 'Invalid credentials', error: error });
    } else if (error.position) {
        return res.status(401).json({ message: 'Invalid credentials', error: error });
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

    if (!Object.values(inputErrors).some(value => value === true)) {
        const newSiswa = { id: uuidv4(), ...newUser };
        siswa.push(newSiswa);
        res.status(201).json({ message: "Siswa added successfully", newSiswa });
    } else {
        res.status(400).json({ message: "Validation failed", errors: inputErrors })
    }

});

app.get('/absensi', (req, res) => {
    const { tanggal, id_siswa, keterangan, waktu } = req.query;
    let filteredAbsensi = absensi;

    if (tanggal) {
        filteredAbsensi = filteredAbsensi.filter(item => item.tanggal === tanggal);
    }
    if (id_siswa) {
        filteredAbsensi = filteredAbsensi.filter(item => item.id_siswa == id_siswa);
    }
    if (keterangan) {
        filteredAbsensi = filteredAbsensi.filter(item => item.keterangan === keterangan);
    }
    if (waktu) {
        filteredAbsensi = filteredAbsensi.filter(item => item.waktu === waktu);
    }

    if (filteredAbsensi.length === 0) {
        return res.status(404).json({ message: "Data not found" });
    }

    res.json(filteredAbsensi);
});

app.post('/absensi', (req, res) => {
    const newAbsen = req.body;
    newAbsen.id = uuidv4();
    absensi.push(newAbsen);
    res.status(201).json({ message: "Absensi berhasil ditambahkan", data: newAbsen });
});

app.put('/absensi', (req, res) => {
    const idAbsensi = req.body.id;
    const newKeterangan = req.body.editedKeterangan;
    const absen = absensi.find(a => a.id === idAbsensi);

    if (!absen) {
        return res.status(404).json({ message: "Absensi tidak ditemukan" });
    }

    absen.keterangan = newKeterangan;

    res.status(200).json({ message: "Absensi updated successfully", data: absen });
});


app.get('/guru', (req, res) => {
    res.json(guru);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});