import org.springframework.stereotype.Service

@Service
class GameService (private val gameRepository: GameRepository,
                  private val questionRepository: QuestionRepository) {
    
    fun initGame(gameId: String): Game? {
        val game = Game(gameId = gameId, questions = listOf(), status = true)
        return gameRepository.save(game)
    }
    
    fun findQuestionsByGameId(gameid: String): List<Questions>? {
        val game = gameRepository.findById(gameid).orElse(null)
        val questions = questionRepository.findQuestionsByGame(game)
        return questions ?: emptyList()
    }

    fun addQuestionToGame(gameId: String, question: Questions): Game? {
        val game = gameRepository.findById(gameId).orElse(null) ?: return null
        questionRepository.save(question.copy(game = game))
        return gameRepository.findById(gameId).orElse(null)
    }


}