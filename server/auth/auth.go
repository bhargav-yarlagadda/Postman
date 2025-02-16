package auth

import (
	"context"
	"fmt"
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

	// Store JWT in HTTP-only, Secure Cookie
	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour), // Cookie expires in 24 hours
		HTTPOnly: true,  // JavaScript cannot access it
		Secure:   false,  // Only works on HTTPS
		SameSite: "Lax",
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Login successful"})
}


func GetSession(c *fiber.Ctx) error {
	// Get JWT from Cookie
	tokenString := c.Cookies("jwt")
	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Not authenticated"})
	}

	// Verify Token
	claims, err := utils.ParseToken(tokenString)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Invalid token"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "User authenticated",
		"user":    claims["username"], // Return username from token
		
	})
}


func Logout(c *fiber.Ctx) error {
    fmt.Println("Before clearing: ", c.Cookies("jwt")) // Debugging

    c.Cookie(&fiber.Cookie{
        Name:     "jwt",
        Value:    "",
        Expires:  time.Now().Add(-time.Hour), // Expire immediately
        Path:     "/",  // Make sure path is the same as the original
        HTTPOnly: true, // Ensure it matches how it was set
        Secure:   true, // Ensure it matches how it was set
        SameSite: "Lax",
    })

    fmt.Println("After clearing: ", c.Cookies("jwt")) // Debugging

    return c.Status(200).JSON(fiber.Map{
        "message": "Logged out successfully",
    })
}
