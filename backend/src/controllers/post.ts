import { Request, Response } from 'express';
import { prisma } from '../app';
import { createError } from '../utils/error';

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, mediaUrl, isExclusive } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        mediaUrl,
        isExclusive,
        authorId: req.user!.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json(createError('Error creating post'));
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', authorId, isExclusive } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (authorId) where.authorId = authorId;
    if (isExclusive !== undefined) where.isExclusive = isExclusive === 'true';

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      skip,
      take: parseInt(limit as string),
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = await prisma.post.count({ where });

    res.json({
      posts,
      total,
      pages: Math.ceil(total / parseInt(limit as string)),
      currentPage: parseInt(page as string)
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json(createError('Error getting posts'));
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        likes: {
          select: {
            userId: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json(createError('Post not found', 404));
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json(createError('Error getting post'));
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, mediaUrl, isExclusive } = req.body;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json(createError('Post not found', 404));
    }

    if (post.authorId !== req.user!.id) {
      return res.status(403).json(createError('Not authorized to update this post', 403));
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        mediaUrl,
        isExclusive
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json(createError('Error updating post'));
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json(createError('Post not found', 404));
    }

    if (post.authorId !== req.user!.id) {
      return res.status(403).json(createError('Not authorized to delete this post', 403));
    }

    await prisma.post.delete({
      where: { id }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json(createError('Error deleting post'));
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json(createError('Post not found', 404));
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: req.user!.id,
          postId: id
        }
      }
    });

    if (existingLike) {
      return res.status(400).json(createError('Post already liked', 400));
    }

    await prisma.like.create({
      data: {
        userId: req.user!.id,
        postId: id
      }
    });

    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json(createError('Error liking post'));
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: req.user!.id,
          postId: id
        }
      }
    });

    if (!like) {
      return res.status(404).json(createError('Like not found', 404));
    }

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: req.user!.id,
          postId: id
        }
      }
    });

    res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error('Unlike post error:', error);
    res.status(500).json(createError('Error unliking post'));
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json(createError('Post not found', 404));
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: req.user!.id,
        postId: id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json(createError('Error adding comment'));
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id, commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return res.status(404).json(createError('Comment not found', 404));
    }

    if (comment.authorId !== req.user!.id) {
      return res.status(403).json(createError('Not authorized to delete this comment', 403));
    }

    await prisma.comment.delete({
      where: { id: commentId }
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json(createError('Error deleting comment'));
  }
}; 