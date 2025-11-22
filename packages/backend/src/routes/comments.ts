import { Router, Request, Response } from 'express';
import Comment from '../models/Comment';
import Article from '../models/Article';

const router = Router();

// GET /api/comments/article/:articleId - Get comments for an article
router.get('/article/:articleId', async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    // Only get top-level comments (no parent)
    const comments = await Comment.find({ 
      article: articleId,
      parentComment: null 
    })
      .populate('author', 'username firstName lastName avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username firstName lastName avatar'
        },
        options: { sort: { createdAt: 1 } }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalComments = await Comment.countDocuments({ 
      article: articleId,
      parentComment: null 
    });
    
    res.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total: totalComments,
        totalPages: Math.ceil(totalComments / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comments'
    });
  }
});

// GET /api/comments/:id/replies - Get replies to a comment
router.get('/:id/replies', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const replies = await Comment.find({ parentComment: id })
      .populate('author', 'username firstName lastName avatar')
      .sort({ createdAt: 1 });
    
    res.json({
      success: true,
      data: replies,
      count: replies.length
    });
  } catch (error: any) {
    console.error('Error fetching replies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch replies'
    });
  }
});

// POST /api/comments - Create a new comment
router.post('/', async (req: Request, res: Response) => {
  try {
    const { article, author, content, parentComment } = req.body;
    
    // Validation
    if (!article || !author || !content) {
      return res.status(400).json({
        success: false,
        error: 'Article, author, and content are required'
      });
    }
    
    if (content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Comment content cannot be empty'
      });
    }
    
    if (content.length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'Comment is too long (max 2000 characters)'
      });
    }
    
    // Verify article exists
    const articleExists = await Article.findById(article);
    if (!articleExists) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }
    
    // If replying to a comment, verify parent exists
    if (parentComment) {
      const parentExists = await Comment.findById(parentComment);
      if (!parentExists) {
        return res.status(404).json({
          success: false,
          error: 'Parent comment not found'
        });
      }
    }
    
    const comment = new Comment({
      article,
      author,
      content: content.trim(),
      parentComment: parentComment || null
    });
    
    await comment.save();
    
    // Populate author information
    await comment.populate('author', 'username firstName lastName avatar');
    
    res.status(201).json({
      success: true,
      data: comment,
      message: 'Comment posted successfully'
    });
  } catch (error: any) {
    console.error('Error creating comment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create comment'
    });
  }
});

// PUT /api/comments/:id - Update a comment
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }
    
    if (content.length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'Comment is too long (max 2000 characters)'
      });
    }
    
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    comment.content = content.trim();
    comment.isEdited = true;
    comment.editedAt = new Date();
    
    await comment.save();
    await comment.populate('author', 'username firstName lastName avatar');
    
    res.json({
      success: true,
      data: comment,
      message: 'Comment updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating comment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update comment'
    });
  }
});

// DELETE /api/comments/:id - Delete a comment
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    // Delete all replies to this comment first
    await Comment.deleteMany({ parentComment: id });
    
    // Delete the comment itself
    await Comment.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Comment and its replies deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete comment'
    });
  }
});

// POST /api/comments/:id/like - Like a comment
router.post('/:id/like', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    comment.likes += 1;
    await comment.save();
    
    res.json({
      success: true,
      data: { likes: comment.likes },
      message: 'Comment liked successfully'
    });
  } catch (error: any) {
    console.error('Error liking comment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to like comment'
    });
  }
});

// GET /api/comments/user/:userId - Get comments by a user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    const comments = await Comment.find({ author: userId })
      .populate('article', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalComments = await Comment.countDocuments({ author: userId });
    
    res.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total: totalComments,
        totalPages: Math.ceil(totalComments / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching user comments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user comments'
    });
  }
});

export default router;
