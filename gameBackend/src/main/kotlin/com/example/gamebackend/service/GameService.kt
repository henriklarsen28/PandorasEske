package com.example.gamebackend.service

import org.springframework.stereotype.Service

import com.example.gamebackend.repository.GameRepository
import com.example.gamebackend.repository.QuestionRepository

import com.example.gamebackend.models.Game
import com.example.gamebackend.models.Question

@Service
class GameService (private val gameRepository: GameRepository,
                  private val questionRepository: QuestionRepository) {
    
    fun initGame(gameId: String): Game? {
        val game = Game(gameId = gameId, questions = listOf(), status = false)
        return gameRepository.save(game)
    }

    fun startGame(gameId: String): Boolean {
        var game = gameRepository.findById(gameId).get()
        game.status = true
        gameRepository.save(game)
        return game.status
    }

    fun getGame(gameId: String) = gameRepository.findById(gameId).orElse(null)

    fun nameAvailable(gameId: String): Boolean {
        val game = gameRepository.findById(gameId).orElse(null)
        if (game != null) {return true}
        return false
    }
    
    fun findQuestionsByGameId(gameid: String): List<Question>? {
        val game = gameRepository.findById(gameid).orElse(null)
        val questions = questionRepository.findQuestionsByGame(game)
        return questions ?: emptyList()
    }

    fun addQuestionToGame(gameId: String, questionText: String, toName: String): Game? {
        val game = gameRepository.findById(gameId).orElse(null) ?: return null
        val question = Question (questionText = questionText, game = game, toName = toName)
        questionRepository.save(question)
        return gameRepository.findById(gameId).orElse(null)
    }




}