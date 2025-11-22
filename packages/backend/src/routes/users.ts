import { Router, Request, Response } from 'express';
import User from '../models/User';
import Article from '../models/Article';

const router = Router();

// POST /api/users/register - Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;
    
    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email, username, and password are required'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email or username already exists'
      });
    }
    
    const user = new User({
      email,
      username,
      password, // Will be hashed by pre-save middleware
      firstName,
      lastName,
      role: 'user'
    });
    
    await user.save();
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      data: userResponse,
      message: 'User registered successfully'
    });
  } catch (error: any) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user'
    });
  }
});

// POST /api/users/login - User login (mock authentication)
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // TODO: Implement password comparison with bcrypt
    // const isPasswordValid = await user.comparePassword(password);
    const isPasswordValid = user.password === password; // Temporary mock
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    // TODO: Generate JWT token
    const token = 'mock-jwt-token-' + user._id;
    
    res.json({
      success: true,
      data: {
        user: userResponse,
        token
      },
      message: 'Login successful'
    });
  } catch (error: any) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// GET /api/users/:id - Get user profile
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

// PUT /api/users/:id - Update user profile
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, bio, avatar, socialLinks } = req.body;
    
    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, bio, avatar, socialLinks },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

// PUT /api/users/:id/preferences - Update user preferences
router.put('/:id/preferences', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { theme, preferredCategories, emailNotifications, pushNotifications } = req.body;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Update preferences
    if (theme) user.preferences.theme = theme;
    if (preferredCategories) user.preferences.preferredCategories = preferredCategories;
    if (typeof emailNotifications === 'boolean') {
      user.preferences.emailNotifications = emailNotifications;
    }
    if (typeof pushNotifications === 'boolean') {
      user.preferences.pushNotifications = pushNotifications;
    }
    
    await user.save();
    
    res.json({
      success: true,
      data: user,
      message: 'Preferences updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences'
    });
  }
});

// POST /api/users/:id/bookmarks/:articleId - Add article to bookmarks
router.post('/:id/bookmarks/:articleId', async (req: Request, res: Response) => {
  try {
    const { id, articleId } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }
    
    // Add to bookmarks if not already bookmarked
    if (!user.bookmarkedArticles.includes(articleId as any)) {
      user.bookmarkedArticles.push(articleId as any);
      await user.save();
    }
    
    res.json({
      success: true,
      data: user.bookmarkedArticles,
      message: 'Article bookmarked successfully'
    });
  } catch (error: any) {
    console.error('Error bookmarking article:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bookmark article'
    });
  }
});

// DELETE /api/users/:id/bookmarks/:articleId - Remove article from bookmarks
router.delete('/:id/bookmarks/:articleId', async (req: Request, res: Response) => {
  try {
    const { id, articleId } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    user.bookmarkedArticles = user.bookmarkedArticles.filter(
      (bookmark) => bookmark.toString() !== articleId
    );
    
    await user.save();
    
    res.json({
      success: true,
      data: user.bookmarkedArticles,
      message: 'Bookmark removed successfully'
    });
  } catch (error: any) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove bookmark'
    });
  }
});

// GET /api/users/:id/bookmarks - Get user's bookmarked articles
router.get('/:id/bookmarks', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    const user = await User.findById(id).populate({
      path: 'bookmarkedArticles',
      options: {
        skip,
        limit,
        sort: { createdAt: -1 }
      },
      populate: [
        { path: 'category', select: 'name slug color' },
        { path: 'author', select: 'username firstName lastName avatar' }
      ]
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const totalBookmarks = user.bookmarkedArticles.length;
    
    res.json({
      success: true,
      data: user.bookmarkedArticles,
      pagination: {
        page,
        limit,
        total: totalBookmarks,
        totalPages: Math.ceil(totalBookmarks / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookmarks'
    });
  }
});

// POST /api/users/:id/likes/:articleId - Like an article
router.post('/:id/likes/:articleId', async (req: Request, res: Response) => {
  try {
    const { id, articleId } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }
    
    // Add to likes if not already liked
    if (!user.likedArticles.includes(articleId as any)) {
      user.likedArticles.push(articleId as any);
      await user.save();
    }
    
    res.json({
      success: true,
      data: user.likedArticles,
      message: 'Article liked successfully'
    });
  } catch (error: any) {
    console.error('Error liking article:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to like article'
    });
  }
});

// DELETE /api/users/:id/likes/:articleId - Unlike an article
router.delete('/:id/likes/:articleId', async (req: Request, res: Response) => {
  try {
    const { id, articleId } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    user.likedArticles = user.likedArticles.filter(
      (like) => like.toString() !== articleId
    );
    
    await user.save();
    
    res.json({
      success: true,
      data: user.likedArticles,
      message: 'Like removed successfully'
    });
  } catch (error: any) {
    console.error('Error removing like:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove like'
    });
  }
});

export default router;
