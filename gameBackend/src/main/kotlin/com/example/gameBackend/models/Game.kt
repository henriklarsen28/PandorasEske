

import jakarta.persistence.*

@Entity
@Table(name = "games")
class Game(

    @Id
    val gameId: String,

    @OneToMany
    val questions : List<Questions>,

    val status: Boolean = false,

    //val index: Int = 0
)

