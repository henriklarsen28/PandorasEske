package question

import (
	"context"
	"encoding/json"
	"time"

	"fmt"
	"log"

	"github.com/segmentio/kafka-go"

	"github.com/redis/go-redis/v9"
)

func StartKafkaConsumerGameStart(redis *redis.Client, ctx context.Context) {
	brokers := []string{"localhost:9092"}
	topic := "my-topic"
	groupID := "my-group"

	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  brokers,
		Topic:    topic,
		GroupID:  groupID,
		MinBytes: 1e3,  // 1KB
		MaxBytes: 1e6,  // 1MB
	})

	fmt.Println("Kafka consumer started for topic:", topic)

	for {
		m, err := reader.ReadMessage(context.Background())
		if err != nil {
			log.Printf("Kafka read error: %v\n", err)
			continue
		}
		log.Printf("Kafka message received: %s\n", string(m.Value))
		
		LoadQuestions(string(m.Value), redis, ctx)

		// You can process/save/cache the message here
	}
}

func StartKafkaConsumerNewQuestion(redis *redis.Client, ctx context.Context) {
	brokers := []string{"localhost:9092"}
	topic := "my-topic"
	groupID := "my-group"

	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  brokers,
		Topic:    topic,
		GroupID:  groupID,
		MinBytes: 1e3,  // 1KB
		MaxBytes: 1e6,  // 1MB
	})

	fmt.Println("Kafka consumer started for topic:", topic)

	for {
		m, err := reader.ReadMessage(context.Background())
		if err != nil {
			log.Printf("Kafka read error: %v\n", err)
			continue
		}
		log.Printf("Kafka message received: %s\n", string(m.Value))
		
		LoadQuestions(string(m.Value), redis, ctx)

		// You can process/save/cache the message here
	}
}

func UpdateQuestions(game_name string, question Question, redis *redis.Client, ctx context.Context) {
	questionIndexString, err := GetCache(redis, game_name, ctx)
	
	if err != nil {
		fmt.Errorf("I have no clue", err)
	}
	
	var questionIndex QuestionIndex
	
	if err := json.Unmarshal([]byte(questionIndexString), &questionIndex); err != nil {
		panic(err)
	}
	
	questionIndex.Questions = append(questionIndex.Questions, question)
	
	
	value, err := json.Marshal(questionIndex)
	
	if err != nil {
		panic(err)
	}
	
	SetCache(redis,game_name, value, time.Duration(100000000), ctx)
	
	
}

func LoadQuestions(game_name string, redis *redis.Client, ctx context.Context) {
	questions_resp := GetQuestions(game_name)
	
	questionIndex := &QuestionIndex{questions_resp, 0}
	
	value, err := json.Marshal(questionIndex)
	
	if err != nil {
		panic(err)
	}
	
	SetCache(redis, game_name, string(value), time.Duration(100000000), ctx)
}