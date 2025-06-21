package main

import (
	//"backend/auth"
	//"backend/blogg"
	"fmt"
	"context"
	"github.com/rs/cors"
	"net/http"
	
	"github.com/redis/go-redis/v9"

	
	"QuestionBackend/question"
)

var ctx = context.Background()


func main() {
	// Code
	mux := http.NewServeMux()

	
	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379", // Redis server address
		Password: "",               // No password set
		DB:       0,                // Use default DB
	})

	// Test connection
	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		panic(err)
	}
	
	go question.StartKafkaConsumerGameStart(rdb, ctx)
	go question.StartKafkaConsumerNewQuestion(rdb, ctx)

	//blogg.RegisterBlogg(mux)

	question.NewQuestionController(mux, rdb, &ctx)
	
	mux.HandleFunc("/ws", question.WebSocketHandler)
	
	fmt.Print("Starting server...\n")

	//handler := cors.Default().Handler(mux)
	handler := cors.New(cors.Options{
		AllowedMethods:   []string{"GET", "POST",},
		AllowedHeaders:   []string{"*"},
		AllowedOrigins:   []string{ "http://localhost:3000" /*"http://localhost:5500"*/},
		AllowCredentials: true,
		Debug:            false,
	}).Handler(mux)

	//handler = c.Handler(handler)

	err = http.ListenAndServe(":8000", handler)
	if err != nil {
		fmt.Print("Error: ", err)
	}
}
