import jakarta.persistence.*


@Entity
@Table(name = "questions")
class Questions(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val questionText: String,
    val toName: String,

    @ManyToOne
    @JoinColumn(name = "game_id")
    val game: Game,

)