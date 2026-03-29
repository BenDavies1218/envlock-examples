import express from 'express'

const app = express()
const port = process.env.PORT ?? 3000

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from envlock + Node.js',
    secret: process.env.API_SECRET ? '[set]' : '[missing]',
    env: process.env.NODE_ENV,
  })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
