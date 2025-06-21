package com.example.gamebackend.controller

import com.example.gamebackend.models.Game
import com.example.gamebackend.models.Question
import com.example.gamebackend.service.GameService
import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity


//import org.springframework.web.bind.annotation.PostMapping
//import org.springframework.web.bind.annotation.GetMapping


//import com.example.gameBackend.models.Game
//import com.example.gameBackend.models.Question
//import com.example.gamebackend.service.GameService

@CrossOrigin(origins = ["localhost:3000"])
@RestController
@RequestMapping("/api/game")
class GameController(private val gameService: GameService) {

    @GetMapping("/startGame")
    fun 

    @PostMapping("/initGame")
    fun initializeGame(@RequestBody request: String): ResponseEntity<Game> {
        val game = gameService.initGame(request)
        return ResponseEntity.ok(game)
    }

    @PostMapping("/addQuestion")
    fun addQuestionToGame(gameId: String, questionText: String, toName: String): ResponseEntity<Game> {
        val updatedGame = gameService.addQuestionToGame(gameId, questionText, toName)
            ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(updatedGame)
    }

    
    @GetMapping("/getQuestions")
    fun getQuestions(@RequestParam gameId: String): ResponseEntity<List<Question>> {
        // Example: Fetch questions for the game (replace with real logic)
        val questions = gameService.findQuestionsByGameId(gameId)
            ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(questions)
    }

}