package question


type Question struct {
	QuestionText 	string	`json:"questionText"`
	ToName 			string	`json:"toName"`
	Game			string	`json:"game"`
}



type QuestionIndex struct {
	Questions 	[]Question	`json:"questions"`
	Index		int16		`json:"index"`
}

type IndexDto struct {
	Index	int16	`json:"index"`
}