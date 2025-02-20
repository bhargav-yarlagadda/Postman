package main

import (
	"context"

	"postman-backend/auth"
	"postman-backend/database"
	// "postman-backend/middleware"
	"postman-backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)
func main() {
	// im not supposed to do this , but i had to increse the buffer size to tacle error 421
	app := fiber.New(fiber.Config{    ReadBufferSize: 1024 * 64, // 64KB buffer size
	})

	// CORS configuration
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000", // Specify the exact origin
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization, Set-Cookie",
		AllowCredentials: true, // Ensures cookies are included
		
	}))
	
	

	// Connect to database
	database.ConnectToDB()
	defer func() {
		// Close MongoDB connection when main exits
		if err := database.MongoClient.Disconnect(context.TODO()); err != nil {
			panic(err) // Handle disconnection error properly
		}
	}()

	// Routes
	// app.Post("/", middleware.AuthMiddleware,routes.SendRequest)
	app.Post("/",routes.SendRequest)

	app.Post("/auth/sign-in", auth.SignIn)
	app.Post("/auth/sign-up", auth.SignUp)
	app.Get("/auth/get-session", auth.GetSession)
	app.Post("/auth/logout", auth.Logout)


	// Start the server
	if err := app.Listen(":8080"); err != nil {
		panic(err)
	}
}
