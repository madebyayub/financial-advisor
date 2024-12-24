const { OpenAI } = require('openai');
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { CSVLoader } = require("@langchain/community/document_loaders/fs/csv");
const { DocxLoader } = require("@langchain/community/document_loaders/fs/docx");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { ChatOpenAI } = require("@langchain/openai");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const fs = require('fs');
const path = require('path');
const os = require('os');
const config = require('../config');

const ALLOWED_TYPES = {
  'application/pdf': PDFLoader,
  'text/csv': CSVLoader,
  'application/msword': DocxLoader,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': DocxLoader,
  // Add more mime types and their corresponding loaders as needed
};

class DocumentAnalyzer {
  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: config.apiKey
    });
    this.model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      openAIApiKey: config.apiKey,
      temperature: 0
    });
  }

  async analyzeDocument(file) {
    try {
      // 1. Validate file type
      const LoaderClass = ALLOWED_TYPES[file.mimetype];
      if (!LoaderClass) {
        throw new Error(`Unsupported file type: ${file.mimetype}`);
      }

      // 2. Create a temporary file
      const tempPath = path.join(os.tmpdir(), file.originalname);
      fs.writeFileSync(tempPath, file.buffer);

      // 3. Load and split the document
      const loader = new LoaderClass(tempPath);
      const rawDocs = await loader.load();
      
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
      });
      const docs = await textSplitter.splitDocuments(rawDocs);

      // 4. Create vector store and index documents
      const vectorStore = await MemoryVectorStore.fromDocuments(
        docs,
        this.embeddings
      );

      // 5. Create the prompt and chains
      const prompt = ChatPromptTemplate.fromTemplate(`
        Answer the following question based on the provided context:

        Context: {context}
        Question: {input}

        Please provide a detailed response.
      `);

      const documentChain = await createStuffDocumentsChain({
        llm: this.model,
        prompt,
      });

      const retrievalChain = await createRetrievalChain({
        combineDocsChain: documentChain,
        retriever: vectorStore.asRetriever(),
      });

      // 6. Query the chain for analysis
      const response = await retrievalChain.invoke({
        input: "Please provide a comprehensive analysis and summary of this document. Include key points and main themes."
      });

      // 7. Clean up
      fs.unlinkSync(tempPath);

      return {
        summary: response.answer,
        timestamp: new Date(),
        status: 'success'
      };

    } catch (error) {
      console.error('Document analysis error:', error);
      throw new Error('Failed to analyze document: ' + error.message);
    }
  }
}

module.exports = new DocumentAnalyzer(); 