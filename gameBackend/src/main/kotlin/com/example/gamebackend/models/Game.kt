package com.example.gamebackend.models

import jakarta.persistence.*

@Entity
@Table(name = "games")
data class Game(

    @Id
    var gameId: String,

    @OneToMany
    var questions : List<Question>,

    var status: Boolean = false,

    //val index: Int = 0
)

