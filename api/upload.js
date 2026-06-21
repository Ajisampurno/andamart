import fs from 'fs'
import path from 'path'

export default function (req, res, next) {
  if (req.method === 'POST') {
    let body = ''
    
    // Read the incoming data stream
    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const payload = JSON.parse(body)
        const base64Data = payload.image

        if (base64Data && base64Data.startsWith('data:image')) {
          // Extract base64 string
          const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
          if (matches.length !== 3) {
            return res.writeHead(400).end(JSON.stringify({ error: 'Invalid base64 format' }))
          }

          const imageBuffer = Buffer.from(matches[2], 'base64')
          const fileName = `img_${Date.now()}.jpg`
          
          // Ensure static/uploads directory exists
          const uploadDir = path.join(process.cwd(), 'static', 'uploads')
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
          }

          const filePath = path.join(uploadDir, fileName)
          
          // Save file to static/uploads
          fs.writeFileSync(filePath, imageBuffer)

          // Return the URL
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ url: `/uploads/${fileName}` }))
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'No image data provided' }))
        }
      } catch (error) {
        console.error('Error in upload:', error)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Internal Server Error' }))
      }
    })
  } else {
    next()
  }
}
