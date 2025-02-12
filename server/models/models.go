package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Request struct {
	ID        primitive.ObjectID     `bson:"_id,omitempty" json:"id"`
	Method    string                 `bson:"method" json:"method"`
	URL       string                 `bson:"url" json:"url"`
	Headers   map[string]string      `bson:"headers" json:"headers"`
	Body      string                 `bson:"body" json:"body"`
	Timestamp time.Time              `bson:"timestamp" json:"timestamp"`
}


type SignIn struct {
	Username string `bson:"username" json:"username"`
	Password string `bson:"password" json:"password"`
}

type SignUp struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Username  string             `bson:"username" json:"username"`
	UserEmail string             `bson:"email" json:"email"`
	Password  string             `bson:"password" json:"password"`
	Timestamp time.Time          `bson:"timestamp" json:"timestamp"`
}
