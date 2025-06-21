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
	topic := "game-started"
	groupID := "question-backend"

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
	topic := "questions"
	groupID := "question-backend"

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
		
		var newQuestion NewQuestionDto
		err = json.Unmarshal(m.Value, &newQuestion)
		
		UpdateQuestions(newQuestion, redis, ctx)

		// You can process/save/cache the message here
	}
}

func UpdateQuestions(newQuestion NewQuestionDto, redis *redis.Client, ctx context.Context) {
	questionIndexString, err := GetCache(redis, newQuestion.Game.GameId, ctx)
	
	if err != nil {
		fmt.Errorf("I have no clue", err)
	}
	
	var questionIndex QuestionIndex
	
	if err := json.Unmarshal([]byte(questionIndexString), &questionIndex); err != nil {
		panic(err)
	}
	
	question := Question{newQuestion.QuestionText, newQuestion.ToName, newQuestion.Game}
	
	questionIndex.Questions = append(questionIndex.Questions, question)
	
	
	value, err := json.Marshal(questionIndex)
	
	if err != nil {
		panic(err)
	}
	
	SetCache(redis,newQuestion.Game.GameId, value, 100000*time.Hour, ctx)
	
	Mutex.Lock()
	for conn, client := range Clients {
		if client.Game == question.Game.GameId {
			err := conn.WriteJSON(question.Game)
			if err != nil {
				log.Println("Error writing message:", err)
				conn.Close()
				delete(Clients, conn)
			}
		}
	}
	Mutex.Unlock()
	
	fmt.Println("New Question added")
	
	
}

func LoadQuestions(game_name string, redis *redis.Client, ctx context.Context) {
	questions_resp := GetQuestions(game_name)
	
	fmt.Println("got questions")
	
	questionIndex := &QuestionIndex{questions_resp, 0}
	
	fmt.Println(questionIndex)
	
	value, err := json.Marshal(questionIndex)
	
	fmt.Println(value)
	fmt.Println(string(value))
	
	if err != nil {
		panic(err)
	}
	
	SetCache(redis, game_name, string(value), 100000*time.Hour, ctx)
}