package main

import (
	"context"

	"postman-backend/auth"
	"postman-backend/database"
	"postman-backend/routes"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()
	database.ConnectToDB()
	app.Post("/", routes.SendRequest)
	app.Post("/auth/sign-in",auth.SignIn)
	app.Post("/auth/sign-up",auth.SignUp)


	defer func(){
		// when the main function is exitted we close the connection to prevent any leakage
		database.MongoClient.Disconnect(context.TODO())
	}()
	app.Listen(":8080")
}