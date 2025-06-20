import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface GameRepository : JpaRepository<Game, String> {

    //fun findById(gameId: String): Game?

    fun initGame(gameId: String): Game?


}


@Repository
interface QuestionRepository : JpaRepository<Questions, Long> {

    fun findQuestionsByGame(game: Game): List<Questions>?

    fun addQuestionToGame(game: Game, question: Questions)

}