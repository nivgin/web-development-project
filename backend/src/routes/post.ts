import express, { Request, Response } from "express";
import {
    createPost,
    getPosts,
    getPostById,
    getPostsBySender,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    getCategories
} from "../controllers/post";
import { isValidObjectId } from "mongoose";

const postRouter = express.Router();

/**
 * @swagger
 * /post:
 *   post:
 *     tags: [Posts]
 *     summary: Create a new post
 *     description: Create a new post with a title and content. The sender is automatically taken from the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *     responses:
 *       200:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid post data
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Invalid Post"
 */
postRouter.post('/', async (req: Request, res: Response) => {
    if (!req.body) return res.status(400).send('Missing Body');

    const sender = req.user;

    const {
        title,
        content,
        imageUrl,
        ingredients,
        instructions,
        servings,
        time,
        category
    } = req.body;

    if (
        !sender ||
        !title ||
        !content ||
        !imageUrl ||
        !Array.isArray(ingredients) ||
        !Array.isArray(instructions) ||
        typeof servings !== "number" ||
        typeof time !== "number" ||
        !category
    ) {
        return res.status(400).send('Invalid Post');
    }

    const post = await createPost(
        title,
        sender._id,
        content,
        imageUrl,
        ingredients,
        instructions,
        servings,
        time,
        category
    );

    return res.status(200).send(post);
});

/**
 * @swagger
 * /post:
 *   get:
 *     tags: [Posts]
 *     summary: Get all posts or posts by sender
 *     description: Retrieve paginated posts, optionally filtered by sender ID or search query.
 *     parameters:
 *       - in: query
 *         name: sender
 *         schema:
 *           type: string
 *         description: Filter posts by sender ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search posts by title (partial, case-insensitive)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of posts per page
 *     responses:
 *       200:
 *         description: Paginated list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
postRouter.get('/', async (req, res) => {
    const sender = req.query.sender as string;
    const search = req.query.search as string;
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);

    let skip: number | undefined;

    if (!isNaN(page) && !isNaN(limit)) {
        skip = (page - 1) * limit;
    }

    if (sender) {
        const posts = await getPostsBySender(sender, req.user!._id, skip, limit, search);
        return res.status(200).send(posts);
    }

    const posts = await getPosts(req.user!._id, skip, limit, search);
    return res.status(200).send(posts);
});
/**
 * @swagger
 * /posts/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     description: Retrieve a list of all categories sorted alphabetically.
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Failed to fetch categories
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Failed to fetch categories"
 */
postRouter.get("/categories", async (req, res) => {
    const categories = await getCategories();

    return res.status(200).send(categories);
});
/**
 * @swagger
 * /post/{id}:
 *   get:
 *     tags: [Posts]
 *     summary: Get a post by ID
 *     description: Retrieve a single post by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: Post found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid post ID
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Invalid Post Id"
 *       404:
 *         description: Post not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Post Not Found"
 */
postRouter.get('/:id', async (req, res) => {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
        return res.status(400).send('Invalid Post Id');
    }

    const post = await getPostById(id, req.user!._id);

    if (!post) {
        return res.status(404).send('Post Not Found');
    }

    return res.status(200).send(post);
});

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     tags: [Posts]
 *     summary: Update a post by ID
 *     description: Update the title and content of a post. The sender is automatically taken from the authenticated user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePostRequest'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid post or missing body
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Invalid Post"
 *       404:
 *         description: Post not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Post Not Found"
 */
postRouter.put('/:id', async (req, res) => {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
        return res.status(400).send('Invalid Post Id');
    }

    if (!req.body) {
        return res.status(400).send('Missing Body');
    }

    const sender = req.user;

    const {
        title,
        content,
        imageUrl,
        ingredients,
        instructions,
        servings,
        time,
        category
    } = req.body;

    if (
        !sender ||
        !title ||
        !content ||
        !imageUrl ||
        !Array.isArray(ingredients) ||
        !Array.isArray(instructions) ||
        typeof servings !== "number" ||
        typeof time !== "number" ||
        !category
    ) {
        return res.status(400).send('Invalid Post');
    }

    const existingPost = await getPostById(id, req.user!._id);

    if (!existingPost) {
        return res.status(404).send('Post Not Found');
    }

    if (sender._id != existingPost.sender.toString()) {
        return res.status(400).send('Unauthorized');
    }

    const updatedPost = await updatePost(id, {
        ...req.body,
        sender: sender._id
    });

    return res.status(200).send(updatedPost);
});

/**
 * @swagger
 * /post/{id}/like:
 *   post:
 *     tags: [Posts]
 *     summary: Like a post
 *     description: Like a post by ID. The authenticated user is automatically used as the liker.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to like
 *     responses:
 *       200:
 *         description: Post liked successfully
 *       404:
 *         description: Post not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Post Not Found"
 */

postRouter.delete('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const sender = req.user;

    if (!isValidObjectId(id)) {
        return res.status(400).send('Invalid Post Id');
    }

    const existingPost = await getPostById(id, req.user!._id);

    if (!existingPost) {
        return res.status(404).send('Post Not Found');
    }

    if (!sender || sender._id != existingPost.sender.toString()) {
        return res.status(400).send('Unauthorized');
    }

    await deletePost(id);

    return res.sendStatus(200);
});

postRouter.post('/:id/like', async (req: Request, res: Response) => {
    const id = req.params.id;

    const existingPost = await getPostById(id, req.user!._id);

    if (!existingPost) {
        return res.status(404).send('Post Not Found');
    }

    await likePost(id, req.user!._id);

    return res.sendStatus(200);
})
 /** /post/{id}/unlike:
 *   post:
 *     tags: [Posts]
 *     summary: Unlike a post
 *     description: Unlike a post by ID. The authenticated user is automatically used to identify the like to remove.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to unlike
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *       404:
 *         description: Post not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Post Not Found"
 */
postRouter.post('/:id/unlike', async (req: Request, res: Response) => {
    const id = req.params.id;

    const existingPost = await getPostById(id, req.user!._id);

    if (!existingPost) {
        return res.status(404).send('Post Not Found');
    }

    await unlikePost(id, req.user!._id);

    return res.sendStatus(200);
});

export default postRouter;
