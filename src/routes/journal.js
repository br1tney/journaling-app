const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const { dynamodb, s3 } = require('../config/aws-config');
const router = express.Router();

// Configure multer for S3 upload
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const extension = file.originalname.split('.').pop();
      cb(null, `journal-images/${Date.now()}-${uuidv4()}.${extension}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Create journal entry
router.post('/entries', upload.single('image'), async (req, res) => {
  try {
    const { date, mood, content, userId } = req.body;
    const entryId = uuidv4();
    
    const entry = {
      entryId,
      userId: userId || 'anonymous',
      date,
      mood,
      content,
      imageUrl: req.file ? req.file.location : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: entry
    };

    await dynamodb.put(params).promise();
    res.status(201).json({ success: true, entry });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
});

// Get journal entries
router.get('/entries', async (req, res) => {
  try {
    const { userId } = req.query;
    
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId || 'anonymous'
      },
      ScanIndexForward: false // Sort by newest first
    };

    const result = await dynamodb.scan(params).promise();
    res.json({ entries: result.Items || [] });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

// Update journal entry
router.put('/entries/:entryId', upload.single('image'), async (req, res) => {
  try {
    const { entryId } = req.params;
    const { date, mood, content, userId } = req.body;
    
    const updateExpression = 'SET #date = :date, mood = :mood, content = :content, updatedAt = :updatedAt';
    const expressionAttributeNames = { '#date': 'date' };
    const expressionAttributeValues = {
      ':date': date,
      ':mood': mood,
      ':content': content,
      ':updatedAt': new Date().toISOString()
    };

    if (req.file) {
      updateExpression += ', imageUrl = :imageUrl';
      expressionAttributeValues[':imageUrl'] = req.file.location;
    }

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { entryId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamodb.update(params).promise();
    res.json({ success: true, entry: result.Attributes });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
});

module.exports = router;
