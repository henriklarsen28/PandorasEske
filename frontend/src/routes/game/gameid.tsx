import React, { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/game/gameid')({
  component: RouteComponent,
  loader: async ({ params }) => {
    
    const response = await fetch("http://localhost:8000/questions/" + params.gamename)
    
    console.log(response)
    
    if (response.status === 404) {
      console.log("Finnes ikke spill" + params.gamename)
      return { undefined }
    }
    
    const data = await response.json()
    
    console.log(data)
    
    const fake_game = [
      { name:  "Henrik", msg: 'Hei på deg henrikg' },
      { name: "Nicolai", msg: 'Heo på meg' },
    ]
    return { fake_game }
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
  const { fake_game } = Route.useLoaderData()
  const [index, setIndex] = useState(0)
  const [bgColor, setBgColor] = useState(getRandomColor())
  const navigate = useNavigate()
  
  if (fake_game === null || fake_game === undefined) {
    navigate({to: "/"})
  }


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        setIndex(prev => prev + 1)
        setBgColor(getRandomColor())
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const isGameOver = index >= fake_game.length
  const currentMsg = isGameOver ? '🎉 Game Over 🎉' : fake_game[index].msg
  const currentName = isGameOver ? 'Hurra' : fake_game[index].name

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
