package history

import (
	"context"
	"postman-backend/database"
	"postman-backend/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetHistory(c *fiber.Ctx) error {
	var history []models.Request
	collection := database.MongoClient.Database("post").Collection("history")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to fetch history"})
	}
	defer cursor.Close(ctx) // Ensure cursor is closed after usage

	// Decode all documents into the slice
	if err := cursor.All(ctx, &history); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error decoding history"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"data": history})
}

func SaveToHistory(c *fiber.Ctx) error {
	var requestToSave models.Request;
	collection := database.MongoClient.Database("post").Collection("history")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := c.BodyParser(&requestToSave);err !=nil{
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message":"invalid request body"})
	}
	requestToSave.ID = primitive.NewObjectID()
	requestToSave.Timestamp = time.Now()
	_,err:= collection.InsertOne(ctx,requestToSave)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to save request"})
	}

	// Return success response
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Request saved to history"})
}