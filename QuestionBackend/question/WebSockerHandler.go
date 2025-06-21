package question

import (
	"fmt"
	"net/http"
	"github.com/gorilla/websocket"
	"sync"
)

var Clients = make(map[*websocket.Conn]*Client) // connected clients
var Mutex = &sync.Mutex{} // Mutex for synchronizing access to clients


var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// Allow connections from your frontend
		return r.Header.Get("Origin") == "http://localhost:3000"
	},
}

func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("WebSocket upgrade failed:", err)
		return
	}
	defer conn.Close()
	
	gameName := r.URL.Query().Get("gameName")
	
	Mutex.Lock()
	Clients[conn] = &Client{Conn: conn,Game: gameName}
	Mutex.Unlock()
	

	for {
		// Read message
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("WebSocket read error:", err)
			break
		}

		fmt.Printf("Received: %s\n", message)

		// Echo back the same message
		err = conn.WriteMessage(messageType, message)
		if err != nil {
			fmt.Println("WebSocket write error:", err)
			break
		}
	}
}
