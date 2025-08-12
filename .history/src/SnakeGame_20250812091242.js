import React, { useEffect, useRef, useState } from 'react'
import './SnakeGame.sass'

const BOARD_SIZE = 30

const getRandomPosition = () => ({
  x: Math.floor(Math.random() * BOARD_SIZE) + 1,
  y: Math.floor(Math.random() * BOARD_SIZE) + 1,
})

const SnakeGame = () => {
  const [food, setFood] = useState(getRandomPosition())
  const [snake, setSnake] = useState([{ x: 5, y: 5 }])
  const [direction, setDirection] = useState({ x: 0, y: 0 })
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem('high-score')) || 0
  )
  const [gameOver, setGameOver] = useState(false)
  const intervalRef = useRef(null)

  // Controls
  const changeDirection = (key) => {
    if (key === 'ArrowUp' && direction.y !== 1) setDirection({ x: 0, y: -1 })
    else if (key === 'ArrowDown' && direction.y !== -1) setDirection({ x: 0, y: 1 })
    else if (key === 'ArrowLeft' && direction.x !== 1) setDirection({ x: -1, y: 0 })
    else if (key === 'ArrowRight' && direction.x !== -1) setDirection({ x: 1, y: 0 })
  }

  useEffect(() => {
    const handleKeyUp = (e) => changeDirection(e.key)
    window.addEventListener('keyup', handleKeyUp)
    return () => window.removeEventListener('keyup', handleKeyUp)
  })

  const controlKeys = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']

  useEffect(() => {
    if (gameOver) {
      clearInterval(intervalRef.current)
      setTimeout(() => {
        alert('Game Over! Press OK to replay...')
        window.location.reload()
      }, 50)
      return
    }

    intervalRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] }
        head.x += direction.x
        head.y += direction.y

        if (
          head.x <= 0 ||
          head.x > BOARD_SIZE ||
          head.y <= 0 ||
          head.y > BOARD_SIZE ||
          prevSnake.some((segment, i) => i !== 0 && segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true)
          return prevSnake
        }

        let newSnake = [head, ...prevSnake.slice(0, -1)]

        if (head.x === food.x && head.y === food.y) {
          setFood(getRandomPosition())
          newSnake = [head, ...prevSnake]
          setScore((s) => {
            const nextScore = s + 1
            if (nextScore > highScore) {
              setHighScore(nextScore)
              localStorage.setItem('high-score', nextScore)
            }
            return nextScore
          })
        }

        return newSnake
      })
    }, 100)

    return () => clearInterval(intervalRef.current)
  }, [direction, food, gameOver, highScore])

  useEffect(() => {
    setDirection({ x: 0, y: 0 })
  }, [])

  const cells = []
  cells.push(
    <div
      key="food"
      className="food"
      style={{ gridArea: `${food.y} / ${food.x}` }}
    />
  )
  snake.forEach((segment, i) => {
    cells.push(
      <div
        key={`snake-${i}`}
        className="head"
        style={{ gridArea: `${segment.y} / ${segment.x}` }}
      />
    )
  })

  return (
    <div>
      <div className="how-to-play">
        <h2>How to Play</h2>
        <p>
          Control the snake using your keyboard arrow keys or by tapping the arrow buttons on mobile.
          Eat the red food to grow and score points. Avoid hitting the walls or yourself!
          Your highest score will be saved. Good luck!
        </p>
      </div>
      <div className="wrapper">
        <div className="game-details">
          <span className="score">Score: {score}</span>
          <span className="high-score">High Score: {highScore}</span>
        </div>
        <div className="play-board">{cells}</div>
        <div className="controls">
          {controlKeys.map((key) => (
            <i
              key={key}
              data-key={key}
              className={`fa-solid fa-arrow-${key
                .replace('Arrow', '')
                .toLowerCase()}-long`}
              onClick={() => changeDirection(key)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SnakeGame