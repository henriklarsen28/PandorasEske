package question

import (
	"github.com/gorilla/websocket"
)

type Game struct {
	GameId		string	`json:"gameId"`
	Questions	[]string 	`json:"questions"`
	Status 		bool		`json:"status"`
}

type Question struct {
	QuestionText 	string	`json:"questionText"`
	ToName 			string	`json:"toName"`
	Game			Game	`json:"game"`
}

type QuestionIndex struct {
	Questions 	[]Question	`json:"questions"`
	Index		int16		`json:"index"`
}

type IndexDto struct {
	Index		int16	`json:"index"`
}

type NewQuestionDto struct {
	Id	string `json:"id"`
	QuestionText	string	`json:"questionText"`
	ToName			string	`json:"toName"`
	Game			Game	`json:"game"`
}

type Message struct {
	Message  	string `json:"message"`
}

type Client struct {
    Conn *websocket.Conn
    Game string
}