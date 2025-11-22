import { Router, Request, Response } from 'express';
import Article from '../models/Article';
import { ApiResponse, PaginatedResponse, ArticleCardData } from '../../../shared/src/types';

const router = Router();

// GET /api/articles - Get all articles with pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const category = req.query.category as string;
    const status = req.query.status as string || 'published';
    
    const skip = (page - 1) * limit;
    
    const filter: any = { status };
    if (category) {
      filter.category = category;
    }

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate('category', 'name slug')
        .populate('author', 'name avatar')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments(filter)
    ]);

    const response: PaginatedResponse<ArticleCardData> = {
      data: articles as any[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/articles/:slug - Get single article by slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
      .populate('category')
      .populate('author');

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Increment view count
    article.views += 1;
    await article.save();

    res.json({ success: true, data: article });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/articles - Create new article
router.post('/', async (req: Request, res: Response) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json({ success: true, data: article });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT /api/articles/:id - Update article
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.json({ success: true, data: article });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /api/articles/:id - Delete article
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.json({ success: true, message: 'Article deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/articles/:id/like - Like article
router.post('/:id/like', async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    article.likes += 1;
    await article.save();

    res.json({ success: true, data: { likes: article.likes } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
