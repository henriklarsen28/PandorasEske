import React, { useEffect, useState, useRef } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/game/$gamename/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    
    const response = await fetch("http://localhost:8000/questions/" + params.gamename)
    
    const response2 = await fetch("http://localhost:8080/api/game/nameAvailable?gameId=" + params.gamename)
    const exists = !await response2.json()
    
    const socket = new WebSocket('ws://localhost:8000/ws?gameName=' + params.gamename);
    
    console.log(response)
    
    if (!exists) {
      return { undefined, socket, params, "error": "finnes ikke" }
    }
    
    if (response.status === 404) {
      console.log("Finnes ikke spill" + params.gamename)
      return { undefined, socket, params, "error": "Ikke startet" }
    }
    
    const data = await response.json()
    
    console.log(data)
    
    
    return { data, socket, params }
  },
})

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function RouteComponent() {
  const { data, socket, params, error } = Route.useLoaderData()
  const navigate = useNavigate()
  
  if (error) {
    if (error === "finnes ikke") {
      navigate({to: "/"})
    } else if (error === "Ikke startet") {
       navigate({to: "/game/" + params.gamename + "/question"})
    }
  }
  
  if (data === null || data === undefined) {
    
  }
  
  const [index, setIndex] = useState(data.index)
  const [innerData, setInnerData] = useState(data)
  const [bgColor, setBgColor] = useState(getRandomColor())
  
  // const socketRef = useRef(socket);
  
  socket!!.onmessage = async (event) => {
    console.log('Received:', event.data);
    
    const response = await fetch("http://localhost:8000/questions/" + params?.gamename)
    const data = await response.json()
    
    setInnerData(data)
    
  };
  
  


  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        
        console.log("lengden", innerData.questions.length)
        
        const newIndex = Math.min(index + 1, innerData.questions.length)
        console.log(newIndex)
        
        
        const response = fetch("http://localhost:8000/question/" + params?.gamename, {
          method: "POST",
          body: JSON.stringify({
            index: newIndex
          })
        })
        
        console.log(response)
        
        
        
        setIndex(prev => Math.min(prev + 1, innerData.questions.length))
        setBgColor(getRandomColor())
      }
      
      if (e.code === "ArrowLeft") {
        setIndex(prev => Math.max(0, prev - 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const isGameOver = index >= innerData.questions.length
  const currentMsg = isGameOver ? '🎉 Game Over 🎉' : innerData.questions[index].questionText
  const currentName = isGameOver ? 'Hurra' : innerData.questions[index].toName

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: bgColor,
        color: '#fff',
        fontSize: '2rem',
        transition: 'background-color 0.5s ease',
      }}
    >
      <p>
        {currentName}
      </p>
       <p>
         {currentMsg}
       </p>
       
       
    </div>
  )
}
