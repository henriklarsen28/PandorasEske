package question

import (
	"net/http"
	"fmt"
	"encoding/json"
)

func GetQuestions(game_name string) []Question {
	resp, err := http.Get("http://localhost:8080/api/game/getQuestions?gameId=" + game_name)
	
	if err != nil {
		panic(err)
	}
	
	defer resp.Body.Close()
	
	// Check HTTP status
	if resp.StatusCode != http.StatusOK {
		panic(fmt.Sprintf("HTTP error: %s", resp.Status))
	}
	
	var questions []Question
	
	if err := json.NewDecoder(resp.Body).Decode(&questions); err != nil {
		panic(err)
	}
	
	questions = RandomShuffle(questions)
	
	return questions
	
	
}