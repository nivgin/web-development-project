import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API',
      version: '1.0.0',
      description: 'API Documentation',
    },
    tags: [
      {
        name: 'Users',
        description: 'User management operations',
      },
      {
        name: 'Comments',
        description: 'Comment management operations',
      },
    ],
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    security: [
      {
        BearerAuth: []
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'passwordHash'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ObjectId',
              example: '507f1f77bcf86cd799439011',
            },
            username: {
              type: 'string',
              description: 'Unique username for the user',
              example: 'johndoe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Unique email address for the user',
              example: 'john@example.com',
            },
            passwordHash: {
              type: 'string',
              description: 'Bcrypt hashed password',
              example: '$2b$10$...',
            },
            pfpUrl: { 
              type: "string", 
              description: "Profile picture image url",
              example: "http://localhost:8000/image.png" 
            }
          },
        },
        UpdateUserRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'New email address for the user',
              example: 'newemail@example.com',
            },
            password: {
              type: 'string',
              description: 'New password (will be hashed)',
              example: 'newPassword123',
            },
            pfpUrl: { 
              type: "string", 
              description: "New profile picture image url",
              example: "http://localhost:8000/image.png" 
            }
          },
        },
          RegisterRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", example: "niv" },
            email: { type: "string", example: "niv@example.com" },
            password: { type: "string", example: "strongpassword123" },
            pfpUrl: { type: "string", example: "http://localhost:8000/image.png" }
          }
        },
        LoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", example: "niv" },
            password: { type: "string", example: "strongpassword123" }
          }
        },
        LogoutRequest: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: { type: "string", example: "eyJhbGciOi..." }
          }
        },
        GoogleAuthRequest: {
          type: "object",
          required: ["idToken"],
          properties: {
            idToken: { type: "string", description: "Google OAuth2 ID token", example: "eyJhbGciOiJSUzI1NiIs..." }
          }
        },
        AuthTokens: {
          type: "object",
          properties: {
            accessToken: { type: "string", example: "eyJhbGciOi..." },
            refreshToken: { type: "string", example: "eyJhbGciOi..." }
          }
        },
        CreatePostRequest: {
          type: "object",
          required: [
            "title",
            "content",
            "imageUrl",
            "ingredients",
            "instructions",
            "servings",
            "time",
            "category"
          ],
          properties: {
            title: { type: "string", example: "Perfect Homemade Pizza" },
            content: { type: "string", example: "This is my favorite pizza recipe..." },
            imageUrl: { type: "string", example: "http://localhost:8000/pizza.png" },
            ingredients: {
              type: "array",
              items: { type: "string" },
              example: ["Flour", "Tomato sauce", "Cheese"]
            },
            instructions: {
              type: "array",
              items: { type: "string" },
              example: ["Mix dough", "Spread sauce", "Bake 15 minutes"]
            },
            servings: { type: "number", example: 4 },
            time: { type: "number", example: 20 },
            category: { type: "string", example: "Dinner" }
          }
        },
        UpdatePostRequest: {
          type: "object",
          required: [
            "title",
            "content",
            "imageUrl",
            "ingredients",
            "instructions",
            "servings",
            "time",
            "category"
          ],
          properties: {
            title: { type: "string", example: "Updated Pizza Recipe" },
            content: { type: "string", example: "Updated content..." },
            imageUrl: { type: "string", example: "http://localhost:8000/newpizza.png" },
            ingredients: {
              type: "array",
              items: { type: "string" },
              example: ["Flour", "Mozzarella", "Basil"]
            },
            instructions: {
              type: "array",
              items: { type: "string" },
              example: ["Prepare dough", "Add toppings", "Bake 12 minutes"]
            },
            servings: { type: "number", example: 2 },
            time: { type: "number", example: 15 },
            category: { type: "string", example: "Lunch" }
          }
        },
        Post: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65b7c9c8e2f0a9a1f2c9d111" },
            title: { type: "string", example: "Perfect Homemade Pizza" },
            content: { type: "string", example: "This is my favorite pizza recipe..." },
            sender: { type: "string", example: "65b7c9c8e2f0a9a1f2c9d111" },
            imageUrl: { type: "string", example: "http://localhost:8000/pizza.png" },
            ingredients: {
              type: "array",
              items: { type: "string" },
              example: ["Flour", "Tomato sauce", "Cheese"]
            },
            instructions: {
              type: "array",
              items: { type: "string" },
              example: ["Mix dough", "Spread sauce", "Bake 15 minutes"]
            },
            servings: { type: "number", example: 4 },
            time: { type: "number", example: 20 },
            category: { type: "string", example: "Dinner" },
            likeCount: { type: "number", example: 12 },
            isLiked: { type: "boolean", example: true },
            commentCount: { type: "number", example: 3 }
          }
        },

        CreateCommentRequest: {
          type: "object",
          required: ["postId", "content"],
          properties: {
            postId: { type: "string", example: "65b7c9c8e2f0a9a1f2c9d111" },
            content: { type: "string", example: "This looks delicious!" }
          }
        },
        UpdateCommentRequest: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", example: "Updated comment content" }
          }
        },
        Comment: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65b7c9c8e2f0a9a1f2c9d222" },
            postId: { type: "string", example: "65b7c9c8e2f0a9a1f2c9d111" },
            sender: { type: "string", example: "65b7c9c8e2f0a9a1f2c9d333" },
            content: { type: "string", example: "This is a great post!" }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
              example: 'User Not Found',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };