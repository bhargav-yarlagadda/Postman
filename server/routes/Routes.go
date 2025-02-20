package routes

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"postman-backend/database"
	"postman-backend/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)
func SendRequest(c *fiber.Ctx) error {
	// Parse JSON request body
	reqData := new(models.Request)
	if err := c.BodyParser(reqData); err != nil {
		fmt.Println("BodyParser Error:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Ensure method and URL are provided
	if reqData.Method == "" || reqData.URL == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Method and URL are required"})
	}

	// Create HTTP request
	reqBody := bytes.NewBufferString(reqData.Body)
	req, err := http.NewRequest(reqData.Method, reqData.URL, reqBody)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create request"})
	}

	// Add headers
	for key, value := range reqData.Headers {
		req.Header.Set(key, value)
	}

	// HTTP client with timeout
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to send request"})
	}
	defer resp.Body.Close()

	// Read response body
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to read response"})
	}

	// Store request in MongoDB
	reqData.ID = primitive.NewObjectID()
	reqData.Timestamp = time.Now()
	collection := database.MongoClient.Database("postman").Collection("requests")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = collection.InsertOne(ctx, reqData)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save request"})
	}

	// Format response as JSON
	var jsonResponse map[string]interface{}
	err = json.Unmarshal(responseBody, &jsonResponse)
	if err != nil {
		jsonResponse = map[string]interface{}{"raw": string(responseBody)}
	}

	// Return API response to frontend
	return c.Status(resp.StatusCode).JSON(fiber.Map{
		"status":  resp.StatusCode,
		"headers": resp.Header,
		"body":    jsonResponse,
	})
}
