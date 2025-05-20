const { dbAll, dbGet, dbRun, dbDelete } = require('../utils/dbUtils')

exports.edit = async (absensiData) => {
          const idAbsensi = absensiData.id
          const newKeterangan = absensiData.editedKeterangan
          const absen = await dbGet('SELECT * FROM absensi WHERE id = ?', [
                    idAbsensi,
          ])

          if (!absen) {
                    throw new Error('Absensi not found.')
          }

          const edittedAbsensi = await dbRun(
                    'UPDATE absensi SET keterangan = ? WHERE id = ?',
                    [newKeterangan, idAbsensi]
          )

          return edittedAbsensi
}

exports.findAll = async (absensiParams) => {
          const {
                    tanggal = '',
                    id_siswa = '',
                    keterangan = '',
                    waktu = '',
          } = absensiParams
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

          return absensi
}

exports.create = async (absensiData) => {
          const { tanggal, id_siswa, keterangan, waktu, hari } = absensiData
          const absensi = await dbAll(
                    'SELECT * FROM absensi WHERE id_siswa = ? AND tanggal = ?',
                    [id_siswa, tanggal]
          )
          const id = uuidv4()

          if (absensi.length > 0) {
                    throw new Error('Absensi already exists for this student.')
          }

          const newAbsensi = await dbRun(
                    'INSERT INTO absensi (id, tanggal, id_siswa, keterangan, waktu, hari) VALUES (?, ?, ?, ?, ?, ?)',
                    [id, tanggal, id_siswa, keterangan, waktu, hari]
          )

          return newAbsensi
}

exports.delete = async (absenID) => {
          return await dbDelete('DELETE FROM absensi WHERE id = ?', [absenID])
}
