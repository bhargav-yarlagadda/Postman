package middleware

import (
	"postman-backend/utils"

	"github.com/gofiber/fiber/v2"
)

func AuthMiddleware(c *fiber.Ctx) error {
	token := c.Cookies("jwt")
	if(token == ""){
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message":"Unauthorized User"})
	}
	_,err := utils.ParseToken(token)
	if err!=nil{
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Invalid token"})
	}
	return c.Next()

}	