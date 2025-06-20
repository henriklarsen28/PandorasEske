package question

import (
	//"encoding/json"
	//"fmt"
	"context"
	"net/http"
	"time"

	//"strconv"

	"encoding/json"
	"github.com/redis/go-redis/v9"
)

type QuestionController struct {
	server *http.ServeMux
	redis	*redis.Client
	contex	*context.Context
}

var global_redis *redis.Client
var gloal_context *context.Context

func NewBloggController(server *http.ServeMux, redis *redis.Client, context *context.Context) *QuestionController {

	gloal_context = context
	global_redis = redis
	/*server.HandleFunc("GET /blogg", GetAll)
	server.HandleFunc("GET /blogg/{title}", GetOne)
	server.HandleFunc("POST /blogg", PostOne)
	server.HandleFunc("DELETE /blogg/{id}", DeleteOne)
	*/
	
	server.HandleFunc("GET /questions/{game_name}", GetQuestionsHandler)
	server.HandleFunc("POST /question/{game_name}",UpdateIndexHandler )

	return &QuestionController{server, redis, context}

}

func GetQuestionsHandler(w http.ResponseWriter, r *http.Request) {
	game_name := r.PathValue("game_name")
	
	questionIndexString, err := GetCache(global_redis, game_name, *gloal_context)
	
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	
	var questionIndex QuestionIndex
	
	if err := json.Unmarshal([]byte(questionIndexString), &questionIndex); err != nil {
		panic(err)
	}
	
	encoded, _ := json.Marshal(questionIndex.Questions)
	
	_, err = w.Write(encoded)
	
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func UpdateIndexHandler(w http.ResponseWriter, r *http.Request) {
	game_name := r.PathValue("game_name")
	
	questionIndexString, err := GetCache(global_redis, game_name, *gloal_context)
	
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	
	var questionIndex QuestionIndex
	
	if err := json.Unmarshal([]byte(questionIndexString), &questionIndex); err != nil {
		panic(err)
	}
	
	var indexDto IndexDto
	
	err = json.NewDecoder(r.Body).Decode(&indexDto)
	
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	
	questionIndex.Index = indexDto.Index
	
	
	value, err := json.Marshal(questionIndex)
	
	if err != nil {
		panic(err)
	}
	
	SetCache(global_redis, game_name, value, time.Duration(100000000), *gloal_context)
	
}

/*func GetAll(w http.ResponseWriter, r *http.Request) {

	encoded, _ := json.Marshal(global_db.All())
	_, err := w.Write(encoded)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func GetOne(w http.ResponseWriter, r *http.Request) {
	title := r.PathValue("title")

	token, _ := r.Cookie("token")

	cookies := r.Cookies()

	fmt.Println(token, "token")
	fmt.Println(cookies, "cookies")

	post := global_db.Find(title)

	encoded, _ := json.Marshal(post)

	_, err := w.Write(encoded)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)

	}
}

func PostOne(w http.ResponseWriter, r *http.Request) {
	// Decode the JSON

	postDto := PostDto{}
	err := json.NewDecoder(r.Body).Decode(&postDto)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	post := Post{Title: postDto.Title, Body: postDto.Body}

	global_db.Create(post)

	encoded, _ := json.Marshal(post)
	_, err = w.Write(encoded)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func DeleteOne(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")

	id, _ := strconv.Atoi(idStr)

	post := global_db.FindById(id)

	global_db.Delete(int(post.ID))

	encoded, _ := json.Marshal(post)

	_, err := w.Write(encoded)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)

	}
}
*/

/*func RegisterBlogg(mux *http.ServeMux) {
	mux.HandleFunc("GET /blogg", Get)
}*/

/*
   func (c *BloggController) Get(w http.ResponseWriter, r *http.Request) {
   	fmt.Fprintf(w, "Hello, %s!", r.URL.Path[1:])
   }
*/
