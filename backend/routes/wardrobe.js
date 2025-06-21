import express from 'express';
import Joi from 'joi';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadImageToS3, deleteImageFromS3 } from '../services/s3Service.js';
import { 
  addWardrobeItem, 
  getUserWardrobeItems, 
  deleteWardrobeItem,
  getWardrobeItem 
} from '../services/wardrobeService.js';

const router = express.Router();

const wardrobeItemSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  category: Joi.string().valid('Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories').required(),
  color: Joi.string().required(),
});

// Get user's wardrobe items
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const items = await getUserWardrobeItems(req.user.id);
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Add wardrobe item with image upload
router.post('/', authenticateToken, upload.single('image'), async (req, res, next) => {
  try {
    const { error, value } = wardrobeItemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Upload image to S3
    const imageUrl = await uploadImageToS3(req.file, req.user.id, value.category);

    // Save item to database
    const item = await addWardrobeItem({
      ...value,
      userId: req.user.id,
      imageUrl,
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

// Delete wardrobe item
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const item = await getWardrobeItem(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this item' });
    }

    // Delete image from S3
    if (item.imageUrl) {
      await deleteImageFromS3(item.imageUrl);
    }

    // Delete item from database
    await deleteWardrobeItem(req.params.id, req.user.id);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
