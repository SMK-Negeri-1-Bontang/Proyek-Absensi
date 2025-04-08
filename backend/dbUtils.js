const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('../database/database.db', (error) => {
          if (error) {
                    console.error('Error connecting to database:', err.message)
          } else {
                    console.log('Connected to the database ✅')
          }
})

// Run a SELECT query that returns multiple rows
const dbAll = (query, params = []) => {
          return new Promise((resolve, reject) => {
                    db.all(query, params, (error, rows) => {
                              if (error) reject(error)
                              else resolve(rows)
                    })
          })
}

// Run a SELECT query that returns a single row
const dbGet = (query, params = []) => {
          return new Promise((resolve, reject) => {
                    db.get(query, params, (error, row) => {
                              if (error) reject(error)
                              else resolve(row)
                    })
          })
}

// Run an INSERT, UPDATE, DELETE query
const dbRun = (query, params = []) => {
          return new Promise((resolve, reject) => {
                    db.run(query, params, function (error) {
                              if (error) reject(error)
                              else
                                        resolve({
                                                  changes: this.changes,
                                                  lastID: this.lastID,
                                        })
                    })
          })
}

// Delete data from the database
const dbDelete = (query, params = []) => {
          return dbRun(query, params)
}

// Export all functions
module.exports = { dbAll, dbGet, dbRun, dbDelete }
