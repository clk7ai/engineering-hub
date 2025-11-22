import { Router, Request, Response } from 'express';
import Category from '../models/Category';

const router = Router();

// GET /api/categories - Get all categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await Category.find()
      .sort({ displayOrder: 1, name: 1 });
    
    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// GET /api/categories/:slug - Get category by slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error: any) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category'
    });
  }
});

// POST /api/categories - Create new category (admin only)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, slug, description, color, icon } = req.body;
    
    // Validation
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        error: 'Name and slug are required'
      });
    }
    
    // Check if category with slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        error: 'Category with this slug already exists'
      });
    }
    
    const category = new Category({
      name,
      slug,
      description,
      color: color || '#0A7FBF',
      icon
    });
    
    await category.save();
    
    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (error: any) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create category'
    });
  }
});

// PUT /api/categories/:id - Update category
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, color, icon, displayOrder } = req.body;
    
    // Check if slug is being changed and if it's already taken
    if (slug) {
      const existingCategory = await Category.findOne({ slug, _id: { $ne: id } });
      if (existingCategory) {
        return res.status(409).json({
          success: false,
          error: 'Category with this slug already exists'
        });
      }
    }
    
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug, description, color, icon, displayOrder },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update category'
    });
  }
});

// DELETE /api/categories/:id - Delete category
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete category'
    });
  }
});

// PUT /api/categories/reorder - Reorder categories
router.put('/reorder', async (req: Request, res: Response) => {
  try {
    const { categoryIds } = req.body; // Array of category IDs in new order
    
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category order data'
      });
    }
    
    // Update display order for each category
    const updatePromises = categoryIds.map((id, index) => 
      Category.findByIdAndUpdate(id, { displayOrder: index })
    );
    
    await Promise.all(updatePromises);
    
    const updatedCategories = await Category.find()
      .sort({ displayOrder: 1, name: 1 });
    
    res.json({
      success: true,
      data: updatedCategories,
      message: 'Categories reordered successfully'
    });
  } catch (error: any) {
    console.error('Error reordering categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reorder categories'
    });
  }
});

export default router;
