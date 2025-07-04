package com.example.gamebackend.controller

import com.example.gamebackend.models.Game
import com.example.gamebackend.models.Question
import com.example.gamebackend.service.GameService
import com.example.gamebackend.service.KafkaProducer

import org.apache.kafka.common.protocol.types.Field.Bool
import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity


@CrossOrigin(origins = ["http://localhost:3000"])
@RestController
@RequestMapping("/api/game")
class GameController(private val gameService: GameService,
                     private val kafkaProducer: KafkaProducer
) {



    @PostMapping("/initGame")
    fun initializeGame(@RequestBody request: String): ResponseEntity<Game> {
        val game = gameService.initGame(request)
        return ResponseEntity.ok(game)
    }

    @GetMapping("/startGame")
    fun startGame(gameId: String): ResponseEntity<Boolean> {
        // Set status to true
        val status = gameService.startGame(gameId)
        println("Game started with ID: $gameId, Status: $status")
        if (status) {
            // Optionally, send a message to Kafka topic
            kafkaProducer.sendMessage("game-started", gameId)
        }

        return ResponseEntity.ok(status)
    }

    @GetMapping("/getGame")
    fun getGame(gameId: String): ResponseEntity<Game?> {
        val game = gameService.getGame(gameId)?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(game)
    }

    @GetMapping("/nameAvailable")
    fun nameAvailable(gameId: String): ResponseEntity<Boolean> {
        val nameIsAvailable = gameService.nameAvailable(gameId)
        return ResponseEntity.ok(nameIsAvailable)
    }

    @PostMapping("/addQuestion")
    fun addQuestionToGame(gameId: String, questionText: String, toName: String): ResponseEntity<String> {
        val addedQuestion = gameService.addQuestionToGame(gameId, questionText, toName)
            ?: return ResponseEntity.notFound().build()

        // Publish message if status is active
        val game = gameService.getGame(gameId)
        
        if (game.status) {
            kafkaProducer.sendMessageObject("questions", addedQuestion)
        }

        return ResponseEntity.ok("Question is added")
    }

    
    @GetMapping("/getQuestions")
    fun getQuestions(@RequestParam gameId: String): ResponseEntity<List<Question>> {
        // Example: Fetch questions for the game (replace with real logic)
        val questions = gameService.findQuestionsByGameId(gameId)
            ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(questions)
    }

}