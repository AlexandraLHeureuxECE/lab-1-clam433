import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Player = "X" | "O"
type Cell = Player | null

const LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function getWinner(board: Cell[]): { winner: Player; line: number[] } | null {
  for (const line of LINES) {
    const [a, b, c] = line
    const v = board[a]
    if (v && v === board[b] && v === board[c]) return { winner: v, line }
  }
  return null
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center rounded-md border bg-muted px-2 py-0.5 text-xs font-medium text-foreground shadow-sm">
      {children}
    </kbd>
  )
}

export default function App() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [current, setCurrent] = useState<Player>("X")

  const winnerInfo = useMemo(() => getWinner(board), [board])
  const draw = board.every((c) => c !== null) && !winnerInfo
  const gameOver = Boolean(winnerInfo) || draw
  const winningSet = useMemo(() => new Set(winnerInfo?.line ?? []), [winnerInfo])

  function resetGame() {
    setBoard(Array(9).fill(null))
    setCurrent("X")
  }

  function playAt(idx: number) {
    if (gameOver || board[idx]) return
    const next = [...board]
    next[idx] = current
    setBoard(next)
    setCurrent((p) => (p === "X" ? "O" : "X"))
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const k = e.key.toLowerCase()
      if (k === "r") resetGame()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const status = winnerInfo
    ? `Player ${winnerInfo.winner} wins`
    : draw
      ? "Draw game"
      : `Player ${current}'s turn`

  const badgeClass = winnerInfo
    ? winnerInfo.winner === "X"
      ? "bg-blue-600 text-white"
      : "bg-red-600 text-white"
    : draw
      ? "bg-slate-600 text-white"
      : current === "X"
        ? "bg-blue-600 text-white"
        : "bg-red-600 text-white"

  return (
    <div className="min-h-screen w-full grid place-items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-3xl font-bold text-white">Tic Tac Toe</CardTitle>

          <div className="flex items-center justify-center">
            <Badge className={badgeClass}>{status}</Badge>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="text-white">
              X: <span className="font-semibold text-blue-600">Blue</span>
            </span>
            <span className="opacity-50">|</span>
            <span className="text-white">
              O: <span className="font-semibold text-red-600">Red</span>
            </span>
            <span className="opacity-50">|</span>
            <span className="flex items-center gap-2 text-white">
              Restart <Kbd>R</Kbd>
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {board.map((cell, idx) => {
              const isWinning = winningSet.has(idx)

              const cellText =
                cell === "X" ? "text-blue-600" : cell === "O" ? "text-red-600" : "text-transparent"

              const disabled = gameOver || cell !== null

              return (
                <button
                  key={idx}
                  onClick={() => playAt(idx)}
                  disabled={disabled}
                  aria-label={`Square ${idx + 1}`}
                  className={[
                    "aspect-square rounded-xl border",
                    "flex items-center justify-center",
                    "bg-slate-50 text-5xl font-extrabold",
                    "transition-all duration-150",
                    disabled ? "cursor-not-allowed opacity-90" : "hover:scale-[1.03] active:scale-[0.98] hover:bg-slate-100",
                    isWinning ? "ring-4 ring-yellow-400 bg-yellow-100" : "",
                  ].join(" ")}
                >
                  <span className={cellText}>{cell ?? "X"}</span>
                </button>
              )
            })}
          </div>

          <Button onClick={resetGame} className="w-full text-white">
            Restart Game
          </Button>

          <p className="text-xs text-center text-muted-foreground text-white">
            Enhanced feedback: colored players, win highlight, disabled board, hover states
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
