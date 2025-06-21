package com.example.gamebackend.models

import jakarta.persistence.*

@Entity
@Table(name = "games")
data class Game(

    @Id
    val gameId: String,

    @OneToMany
    val questions : List<Question>,

    val status: Boolean = false,

    //val index: Int = 0
)

