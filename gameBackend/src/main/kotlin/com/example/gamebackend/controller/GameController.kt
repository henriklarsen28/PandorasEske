package com.example.gamebackend.controller

import Game
import GameService
import Questions
import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity


//import org.springframework.web.bind.annotation.PostMapping
//import org.springframework.web.bind.annotation.GetMapping


//import com.example.gameBackend.models.Game
//import com.example.gameBackend.models.Question
//import com.example.gamebackend.service.GameService

@RestController
@RequestMapping("/api/game")
class GameController (private val gameService: GameService) {


    @PostMapping("/init")
    fun initializeGame(@RequestBody request: String): ResponseEntity<Game> {
        val game = gameService.initGame(request)
        return ResponseEntity.ok(game)
    }

    @PostMapping("/addQuestion")
    fun addQuestionToGame(@RequestParam gameId: String, @RequestBody question: Questions): ResponseEntity<Game> {
        val updatedGame = gameService.addQuestionToGame(gameId, question)
            ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(updatedGame)
    }

    
    @GetMapping("/getQuestions")
    fun getQuestions(@RequestParam gameId: String): ResponseEntity<List<Questions>> {
        // Example: Fetch questions for the game (replace with real logic)
        val questions = gameService.findQuestionsByGameId(gameId)
            ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(questions)
    }

}