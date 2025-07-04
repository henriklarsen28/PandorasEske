import { createFileRoute, useNavigate } from '@tanstack/react-router'
import React, { useState } from 'react'

export const Route = createFileRoute('/game/$gamename/question')({
  component: RegisterForm,
})

function RegisterForm() {
  const { gamename } = Route.useParams()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  
  async function activateGame(e: any) {
    const response = await fetch("http://localhost:8080/api/game/startGame?gameId=" + gamename)
    
    console.log(response)
    
    if (response.status == 200) {
      navigate({
        to: "/game/" + gamename
      })
    }
    
    
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim() && message.trim()) {
      console.log({ gamename, name, message }) // replace with actual submit logic
      
      const response = await fetch(`http://localhost:8080/api/game/addQuestion?gameId=${gamename}&questionText=${message}&toName=${name}`, {
        method: "POST"
      })
      const data = await response.body
      
      setName("")
      setMessage("")
      
      console.log(data)
      
    }
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>
          Still spørsmål til esken <span style={{ color: '#2a9d8f' }}>{gamename}</span>
        </h2>

      
          <form onSubmit={handleSubmit} style={formStyle}>
            <div>
              <label style={labelStyle}>Navn</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Still spørsmål til..."
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Spørsmål</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                placeholder="Her skriver du spørmålet du ønsker å sille... (Helst grisete som bare det!)"
                style={{ ...inputStyle, height: '100px' }}
              />
            </div>

            <button type="submit" style={buttonStyle}>
              Send
            </button>
          </form>
          <br></br>
          <button type="button" onClick={activateGame} style={buttonStyle2}>
            Start Spill!
          </button>
      </div>
    </div>
  )
}

// --- STYLES ---

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(to bottom right, #ecf0f3, #e0f7f1)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  fontFamily: 'Inter, sans-serif',
  boxSizing: 'border-box',
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '1rem',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '480px',
  boxSizing: 'border-box',
}

const titleStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  marginBottom: '1.5rem',
  textAlign: 'center',
  fontWeight: 600,
}

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 500,
  color: '#333',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  border: '2px solid #ccc',
  borderRadius: '0.5rem',
  outline: 'none',
  boxSizing: 'border-box',
}

const buttonStyle: React.CSSProperties = {
  padding: '0.75rem',
  backgroundColor: '#2a9d8f',
  color: '#fff',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  width: '100%',
  boxSizing: 'border-box',
}

const buttonStyle2: React.CSSProperties = {
  padding: '0.75rem',
  backgroundColor: '#FD7E14',
  color: '#fff',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  width: '100%',
  boxSizing: 'border-box',
}

const successMessageStyle: React.CSSProperties = {
  textAlign: 'center',
  backgroundColor: '#e0f7f1',
  padding: '1rem',
  borderRadius: '0.75rem',
  border: '2px solid #2a9d8f',
  color: '#2a9d8f',
}
