package database 
import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
  )

  var MongoClient *mongo.Client
  func ConnectToDB() {
	// Use the SetServerAPIOptions() method to set the version of the Stable API on the client
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI("mongodb+srv://bhargavyarlagadda2003:kNzKELKqdoWsMNHT@cluster0.7c8v1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").SetServerAPIOptions(serverAPI)
	// Create a new client and connect to the server
	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
	  panic(err)
	}
	MongoClient = client
	// Send a ping to confirm a successful connection
	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{Key:"ping",Value:1}}).Err(); err != nil {
	  panic(err)
	}
	fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")
  }
  
  