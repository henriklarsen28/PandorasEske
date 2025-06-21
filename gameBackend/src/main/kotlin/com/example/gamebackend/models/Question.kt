package com.example.gamebackend.models

import jakarta.persistence.*


@Entity
@Table(name = "questions")
data class Question(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val questionText: String,
    val toName: String,

    @ManyToOne
    @JoinColumn(name = "game_id")
    val game: Game,

)