package auth

import (
	"context"
	"postman-backend/database"
	"postman-backend/models"
	"postman-backend/utils"
	"time"

	"github.com/gofiber/fiber/v2"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func SignUp(c *fiber.Ctx) error {
	var user models.SignUp

	// Parse JSON request body
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid Request Body"})
	}

	// Check if username or email already exists
	collection := database.MongoClient.Database("post").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var existingUser models.SignUp
	err := collection.FindOne(ctx, bson.M{"$or": []bson.M{{"username": user.Username}, {"email": user.UserEmail}}}).Decode(&existingUser)
	if err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"message": "Username or Email already exists"})
	}

	// Hash the password before storing
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to encrypt password"})
	}
	user.Password = string(hashedPassword)

	// Generate ID in the backend
	user.ID = primitive.NewObjectID()
	user.Timestamp = time.Now()

	// Store the user in MongoDB
	_, err = collection.InsertOne(ctx, user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to create user"})
	}

	// Return success response
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "User created successfully"})
}
func SignIn(c *fiber.Ctx) error {
	var loginData models.SignIn

	// Parse request
	if err := c.BodyParser(&loginData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid request body"})
	}

	// Fetch user from DB
	collection := database.MongoClient.Database("post").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.SignUp
	err := collection.FindOne(ctx, bson.M{"username": loginData.Username}).Decode(&user)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Invalid username or password"})
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginData.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Invalid username or password"})
	}

	// Generate JWT Token
	token, err := utils.GenerateToken(loginData.Username)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to generate token"})
	}

	// Return token
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"token": token})
}
