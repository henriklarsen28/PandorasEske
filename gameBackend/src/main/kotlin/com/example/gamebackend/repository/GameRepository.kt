package com.example.gamebackend.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

import com.example.gamebackend.models.Game
import com.example.gamebackend.models.Question

@Repository
interface GameRepository : JpaRepository<Game, String> {

    //fun findById(gameId: String): Game?


}


@Repository
interface QuestionRepository : JpaRepository<Question, Long> {

    fun findQuestionsByGame(game: Game): List<Question>?

    //fun addQuestionToGame(game: Game, question: Question)

}