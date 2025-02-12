package utils

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Generate a secure random key if not set in ENV
func generateSecretKey() string {
	key := make([]byte, 32) // 32 bytes for strong security
	_, err := rand.Read(key)
	if err != nil {
		panic("Failed to generate secret key")
	}
	return base64.StdEncoding.EncodeToString(key)
}

// Get or generate JWT secret
var jwtSecret = func() []byte {
	secret := os.Getenv("JWT_SECRET") // Get from environment
	if secret == "" {
		secret = generateSecretKey() // Generate if not set
		fmt.Println("Generated Secret Key (store this securely!):", secret)
	}
	return []byte(secret)
}()

// Generate JWT Token
func GenerateToken(username string) (string, error) {
	claims := jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24h
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// Validate JWT Token
func ValidateToken(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})
}
