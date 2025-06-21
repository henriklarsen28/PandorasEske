package com.example.gamebackend.models

import jakarta.persistence.*


@Entity
@Table(name = "questions")
data class Question(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,
    var questionText: String,
    var toName: String,

    @ManyToOne
    @JoinColumn(name = "game_id")
    var game: Game,

)