package com.example.gamebackend.service

import com.example.gamebackend.models.Question
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Service



@Service
class KafkaProducer(
    private val kafkaTemplate: KafkaTemplate<String, String>,
    private val kafkaTemplateQuestion: KafkaTemplate<String, Question>,
) {

    fun sendMessage(topic: String, message: String) {
        kafkaTemplate.send(topic, message)
        println("Published message: '${message}' to topic: '$topic'")
    }
    fun sendMessageObject(topic: String, message: Question) {
        kafkaTemplateQuestion.send(topic, message)
    }

}