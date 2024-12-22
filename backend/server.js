const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const OpenAI = require('openai');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT;

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Ensure uploads directory exists
fs.mkdir('uploads').catch(() => {});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// Chat routes
app.post('/chat/analyze', upload.array('file'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const analyses = [];
    
    for (const uploadedFile of req.files) {
      try {
        // Create a file stream
        const fileStream = await fs.readFile(uploadedFile.path);

        // Upload the file to OpenAI
        const openaiFile = await openai.files.create({
          file: fileStream,
          purpose: 'assistants',
        });

        // Create a message with the file
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a financial analyst AI. Analyze the provided financial document and extract key information about spending patterns, income, and financial habits. Format the response in a clear, structured way."
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Please analyze this financial document." },
                { type: "file_url", file_url: openaiFile.url }
              ]
            }
          ],
        });

        analyses.push({
          filename: uploadedFile.originalname,
          analysis: response.choices[0].message.content
        });

        // Clean up: delete the uploaded file
        await fs.unlink(uploadedFile.path).catch(console.error);
      } catch (error) {
        // If one file fails, add error to analyses but continue with other files
        analyses.push({
          filename: uploadedFile.originalname,
          error: error.message
        });
        await fs.unlink(uploadedFile.path).catch(console.error);
      }
    }

    res.json({ analyses });
  } catch (error) {
    console.log('Error:', error);
    // Clean up on error
    for (const file of req.files || []) {
      await fs.unlink(file.path).catch(console.error);
    }
    res.status(500).json({ error: error.message });
  }
});

app.post('/chat/message', async (req, res) => {
  try {
    const { message } = req.body;
    
    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a helpful financial advisor. Provide clear, concise advice about personal finance, investments, and money management."
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "gpt-4o-mini",
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
}); 