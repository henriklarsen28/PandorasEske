import { createFileRoute, useNavigate } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

async function checkNameAvailability(name: string): Promise<boolean> {
  
  const response = await fetch("http://localhost:8080/api/game/nameAvailable?gameId=" + name)
  
  return await response.json()
}

function HomePage() {
  const navigate = useNavigate()
  const [gameCode, setGameCode] = useState('')
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState('')
  
  useEffect(() => {
    if (!gameCode) {
      setIsAvailable(null)
      return
    }

    setIsChecking(true)
    const timeout = setTimeout(() => {
      checkNameAvailability(gameCode).then(result => {
        setIsAvailable(!result)
        setIsChecking(false)
      })
    }, 300)

    return () => clearTimeout(timeout)
  }, [gameCode])

  const handleJoin = () => {
    if (!gameCode.trim()) {
      setError('Please enter a game ID.')
      return
    }
    navigate({ to: `/game/${gameCode.trim()}` })
  }

  const handleNewGame = () => {
    navigate({ to: '/newgame' })
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Velkommen til Pandoras Eske</h1>
        <h2 style={titleStyle2}>Shot or Tell</h2>

        <button onClick={handleNewGame} style={{ ...buttonStyle, backgroundColor: '#2a9d8f' }}>
          ➕ Start et nytt spill
        </button>

        <div style={{ marginTop: '2rem', width: '100%' }}>
          <label style={labelStyle}>Stil spørsmål til et eksisterende spill</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Spill ID"
              value={gameCode}
              onChange={e => {
                setGameCode(e.target.value)
                setError('')
              }}
              style={inputStyle}
            />
            <div style={{ fontSize: '1.25rem' }}>
              {isChecking ? (
                <span style={{ color: '#888' }}>⏳</span>
              ) : isAvailable === true ? (
                <span style={{ color: '#2a9d8f' }}>✅</span>
              ) : isAvailable === false ? (
                <span style={{ color: '#e63946' }}>❌</span>
              ) : null}
            </div>
          </div>
          {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}

          <button onClick={handleJoin} style={{ ...buttonStyle, marginTop: '1rem' }}>
            🔍 Bli med i spillet
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Styles ---
const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  background: 'linear-gradient(to bottom right, #f0f4f8, #e0f7f1)',
  fontFamily: 'Inter, sans-serif',
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  padding: '2.5rem',
  borderRadius: '1rem',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  maxWidth: '400px',
  width: '100%',
  textAlign: 'center',
}

const titleStyle: React.CSSProperties = {
  fontSize: '1.75rem',
  marginBottom: '2rem',
  fontWeight: 600,
}

const titleStyle2: React.CSSProperties = {
  fontSize: '1.2rem',
  marginBottom: '2rem',
  fontWeight: 600,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  fontSize: '1rem',
  border: '2px solid #ccc',
  borderRadius: '0.5rem',
  boxSizing: 'border-box',
  marginTop: '0.5rem',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  textAlign: 'left',
  marginBottom: '0.25rem',
  fontWeight: 500,
  color: '#333',
}

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '0.5rem',
  border: 'none',
  backgroundColor: '#3a86ff',
  color: 'white',
  cursor: 'pointer',
  transition: 'background 0.2s ease',
}
