package question

import (
	"math/rand"
)

func RandomShuffle(array []Question) []Question {

	rand.Shuffle(len(array), func(i, j int) {
		array[i], array[j] = array[j], array[i]
	})
	
	return array
}