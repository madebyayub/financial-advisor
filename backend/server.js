const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const upload = multer();
dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

app.post('/chat/message', upload.array('documents'), async (req, res) => {
  try {
    const { message } = req.body;
    const files = req.files; // Array of uploaded files
    const DocumentAnalyzer = require('./services/ai/agents/DocumentAnalyzer');
    const Advisor = require('./services/ai/agents/Advisor');

    let documentAnalyses = [];
    if (files && files.length > 0) {
      // Analyze all documents in parallel
      const analysisPromises = files.map(async file => {
        try {
          const result = await DocumentAnalyzer.analyzeDocument(file);
          return result.summary;
        } catch (error) {
          console.error(`Error analyzing file ${file.originalname}:`, error);
          return `Error analyzing ${file.originalname}: ${error.message}`;
        }
      });
      documentAnalyses = await Promise.all(analysisPromises);
    }

    const userData = {
      lastMessage: message,
      documentAnalysis: documentAnalyses.join('\n\n')
    };

    const advisorResponse = await Advisor.provideAdvice(userData);
    
    res.json({ 
      response: advisorResponse.advice,
      documentAnalyses: documentAnalyses // Optional: return analyses to client
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
}); 