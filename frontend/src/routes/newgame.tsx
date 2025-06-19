import React, { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/newgame')({
  component: RouteComponent,
})

const takenNames = ['test', 'demo', 'henrikg']

function checkNameAvailability(name: string): Promise<boolean> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(!takenNames.includes(name.toLowerCase()))
    }, 500)
  })
}

function RouteComponent() {
  const [gameName, setGameName] = useState('')
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [mode, setMode] = useState<'manual' | 'ai' | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!gameName) {
      setIsAvailable(null)
      return
    }

    setIsChecking(true)
    const timeout = setTimeout(() => {
      checkNameAvailability(gameName).then(result => {
        setIsAvailable(result)
        setIsChecking(false)
      })
    }, 300)

    return () => clearTimeout(timeout)
  }, [gameName])

  function handleConfirmName() {
    if (isAvailable) {
      setStep(2)
    }
  }

  function handleGoBack() {
    setStep(1)
    setMode(null)
  }

  function handleConfirmMode() {
    if (!mode) return
    const target = mode === 'manual' ? `/game/${gameName}/question` : `/game/${gameName}`
    navigate({ to: target })
  }

  return (
    <div
      style={{
        height: '100vh',
        background: '#f5f7fa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '420px',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        {step === 1 && (
          <>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Start a New Game</h2>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
              Game Name
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="text"
                value={gameName}
                onChange={e => {
                  setGameName(e.target.value)
                  setIsAvailable(null)
                }}
                placeholder="Enter a game name..."
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  border: `2px solid ${
                    isAvailable === false ? '#e63946' : isAvailable === true ? '#2a9d8f' : '#ccc'
                  }`,
                  borderRadius: '0.5rem',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                }}
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
            {isAvailable === false && (
              <p style={{ color: '#e63946', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Name is already taken. Try another.
              </p>
            )}
            {isAvailable === true && (
              <button
                onClick={handleConfirmName}
                style={{
                  marginTop: '1rem',
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#2a9d8f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                Confirm Name
              </button>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Choose Setup Mode</h2>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#555' }}>
              Game name: <strong>{gameName}</strong>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={radioStyle(mode === 'manual')}>
                <input
                  type="radio"
                  name="mode"
                  value="manual"
                  checked={mode === 'manual'}
                  onChange={() => setMode('manual')}
                  style={{ display: 'none' }}
                />
                <span>🛠️ Make Yourself</span>
              </label>
              <label style={radioStyle(mode === 'ai')}>
                <input
                  type="radio"
                  name="mode"
                  value="ai"
                  checked={mode === 'ai'}
                  onChange={() => setMode('ai')}
                  style={{ display: 'none' }}
                />
                <span>🤖 Generate with AI</span>
              </label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={handleConfirmMode}
                disabled={!mode}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: mode ? '#2a9d8f' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  cursor: mode ? 'pointer' : 'not-allowed',
                }}
              >
                Confirm Choice
              </button>
              <button
                onClick={handleGoBack}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#ccc',
                  color: '#333',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                ⬅️ Go Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function radioStyle(selected: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    border: `2px solid ${selected ? '#2a9d8f' : '#ccc'}`,
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'border 0.2s ease',
    backgroundColor: selected ? '#e0f7f1' : '#f9f9f9',
    fontSize: '1rem',
    gap: '0.75rem',
  }
}
