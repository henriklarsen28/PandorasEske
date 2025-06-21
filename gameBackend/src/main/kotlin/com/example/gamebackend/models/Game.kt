package com.example.gamebackend.models

import jakarta.persistence.*
import kotlinx.serialization.Serializable

@Entity
@Table(name = "games")
@Serializable
data class Game(

    @Id
    var gameId: String,

    @OneToMany
    var questions : List<Question>,

    var status: Boolean = false,

    //val index: Int = 0
)

