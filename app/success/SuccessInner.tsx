"use client"
import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { STAMP_COUNT } from "@/app/lib/constants"
import StampCard from "@/app/components/StampCard"
import DownloadSection from "@/app/components/DownloadSection"

type Phase = "verifying" | "generating" | "done" | "error"
interface FormData {
  babyName: string; gender: string; features: string[]; style: string; phrases: string[]
}

export default function SuccessInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")
  const [phase, setPhase] = useState<Phase>("verifying")
  const [errorMessage, setErrorMessage] = useState("")
  const [masterDataURL, setMasterDataURL] = useState<string | null>(null)
  const [stampDataURLs, setStampDataURLs] = useState<string[]>([])
  const [completedCount, setCompletedCount] = useState(0)
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!sessionId || hasStarted.current) return
    hasStarted.current = true
    startFlow(sessionId)
  }, [sessionId])

  const startFlow = async (sid: string) => {
    let formData: FormData
    try {
      const res = await fetch("/api/verify-session?session_id=" + sid)
      const data = await res.json() as { ok?: boolean; formData?: FormData; error?: string }
      if (!res.ok || !data.ok || !data.formData) { setErrorMessage(data.error ?? "支払いの確認に失敗しました"); setPhase("error"); return }
      formData = data.formData
    } catch { setErrorMessage("ネットワークエラーが発生しました"); setPhase("error"); return }

    const photo = localStorage.getItem("stampon_photo")
    if (!photo) { setErrorMessage("写真データが見つかりません。最初からやり直してください。\nご購入済みの場合はships.llc@gmail.comまでご連絡ください。"); setPhase("error"); return }

    setPhase("generating")
    let res: Response
    try {
      res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ photo, ...formData }) })
    } catch { setErrorMessage("ネットワークエラーが発生しました"); setPhase("error"); return }

    if (!res.ok || !res.body) { const msg = await res.json().catch(() => ({})) as { error?: string }; setErrorMessage(msg.error ?? "生成に失敗しました"); setPhase("error"); return }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""
    const urls: string[] = []
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split("\n\n")
        buffer = parts.pop() ?? ""
        for (const part of parts) {
          const line = part.trim()
          if (!line.startsWith("data: ")) continue
          const event = JSON.parse(line.slice(6)) as { type: string; dataUrl?: string; index?: number; message?: string }
          if (event.type === "master") { setMasterDataURL(event.dataUrl ?? null) }
          else if (event.type === "stamp" && event.index !== undefined) { urls[event.index] = event.dataUrl ?? ""; setStampDataURLs([...urls]); setCompletedCount(event.index + 1) }
          else if (event.type === "error") { throw new Error(event.message ?? "生成に失敗しました") }
          else if (event.type === "done") { localStorage.removeItem("stampon_photo"); setPhase("done") }
        }
      }
    } catch (err) { setErrorMessage(err instanceof Error ? err.message : "生成に失敗しました"); setPhase("error") }
  }

  if (phase === "verifying") return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center"><p className="text-2xl animate-bounce mb-3">💳</p><p className="text-pink-500 font-bold animate-pulse">支払いを確認中...</p></div>
    </div>
  )

  if (phase === "error") return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <p className="text-4xl mb-4">😢</p>
        <h2 className="text-xl font-black text-gray-700 mb-3">エラーが発生しました</h2>
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600 mb-6 whitespace-pre-line">{errorMessage}</div>
        <button onClick={() => router.push("/")} className="w-full py-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold shadow-md">トップに戻る</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 py-8 px-4">
      <header className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2">
          <span>STAMP</span>
          <span className="inline-flex items-center justify-center mx-0.5 w-8 h-8 rounded-full border-4 border-dashed border-red-400 bg-red-50 text-lg align-middle">👶</span>
          <span>N for Baby</span>
        </h1>
        {phase === "generating" && (
          <div className="text-center">
            <p className="text-pink-500 font-bold text-lg animate-pulse">
              {masterDataURL === null ? "キャラクターを生成中..." : completedCount === 0 ? "キャラクター確定！スタンプを生成中..." : "スタンプ生成中... " + completedCount + " / " + STAMP_COUNT + "枚"}
            </p>
            <p className="text-sm text-gray-400 mt-1">1枚約30秒・16枚で約5〜6分かかります。このままお待ちください☕</p>
            <p className="text-sm font-bold text-red-400 mt-2">⚠️ 生成中は画面をスリープにしないでください</p>
          </div>
        )}
        {phase === "done" && <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">🎉 {STAMP_COUNT}枚完成！</p>}
      </header>
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {phase === "generating" && <div className="w-full bg-pink-100 rounded-full h-3 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500" style={{ width: (completedCount / STAMP_COUNT * 100) + "%" }} /></div>}
        {masterDataURL && <div className="flex flex-col items-center gap-2"><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Master Character</p><img src={masterDataURL} alt="マスターキャラクター" className="w-32 h-32 rounded-2xl object-cover border-4 border-pink-200 shadow-lg" /></div>}
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: STAMP_COUNT }, (_, i) => <StampCard key={i} index={i} dataURL={stampDataURLs[i] ?? null} isGenerating={phase === "generating" && i === stampDataURLs.length} />)}
        </div>
        {phase === "done" && <DownloadSection stampDataURLs={stampDataURLs} />}
        {phase === "done" && <button onClick={() => router.push("/")} className="w-full py-3 rounded-full border-2 border-pink-300 text-pink-500 font-bold hover:bg-pink-50 transition-colors">🔄 もう一度作る</button>}
      </div>
    </div>
  )
}
