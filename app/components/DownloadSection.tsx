'use client'

import { useState } from 'react'
import JSZip from 'jszip'

interface Props {
  stampDataURLs: string[]
}

async function resizeDataUrl(dataUrl: string, w: number, h: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('canvas context failed')); return }
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('image load failed'))
    img.crossOrigin = 'anonymous'
    img.src = dataUrl
  })
}

function dataUrlToBase64(dataUrl: string): string {
  return dataUrl.split(',')[1] ?? ''
}

function isInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('line') || ua.includes('instagram') || ua.includes('fbav') || ua.includes('twitter')
}

export default function DownloadSection({ stampDataURLs }: Props) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [progress, setProgress] = useState(0)
  const [zipping, setZipping] = useState(false)
  const [zipped, setZipped] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const inAppBrowser = isInAppBrowser()

  const handleSaveAll = async () => {
    setSaving(true)
    setProgress(0)
    for (let i = 0; i < stampDataURLs.length; i++) {
      const url = stampDataURLs[i]
      if (!url) continue
      const a = document.createElement('a')
      a.href = url
      a.download = `stamp_${String(i + 1).padStart(2, '0')}.png`
      a.click()
      await new Promise(r => setTimeout(r, 300))
      setProgress(i + 1)
    }
    setSaving(false)
    setSaved(true)
  }

  const handleZip = async () => {
    setZipping(true)
    try {
      const zip = new JSZip()
      for (let i = 0; i < stampDataURLs.length; i++) {
        const url = stampDataURLs[i]
        if (!url) continue
        const resized = await resizeDataUrl(url, 370, 320)
        zip.file(`${String(i + 1).padStart(2, '0')}.png`, dataUrlToBase64(resized), { base64: true })
      }
      if (stampDataURLs[0]) {
        const main = await resizeDataUrl(stampDataURLs[0], 240, 240)
        zip.file('main.png', dataUrlToBase64(main), { base64: true })
      }
      if (stampDataURLs[0]) {
        const tab = await resizeDataUrl(stampDataURLs[0], 96, 74)
        zip.file('tab.png', dataUrlToBase64(tab), { base64: true })
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'stampon_line.zip'
      a.click()
      setZipped(true)
    } finally {
      setZipping(false)
    }
  }

  const openInChrome = () => {
    window.location.href = 'googlechrome://' + window.location.href.replace(/^https?:\/\//, '')
  }

  return (
    <div className="flex flex-col gap-4">

      {inAppBrowser && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 flex flex-col gap-3">
          <p className="text-sm font-black text-yellow-700">LINEブラウザではダウンロードできません</p>
          <p className="text-xs text-yellow-600 leading-relaxed">ダウンロードにはChromeが必要です。下のボタンでChromeを開いてください。</p>
          <button onClick={openInChrome} className="w-full py-3 rounded-full bg-yellow-400 text-white font-bold text-sm shadow-md hover:opacity-90 active:scale-[0.98] transition-all">
            Chromeで開く
          </button>
        </div>
      )}

      {/* スタンプ画像を保存する */}
      <div className="flex flex-col gap-3 bg-pink-50 rounded-2xl p-4 border border-pink-100">
        <p className="text-sm font-black text-pink-600">📱 スタンプ画像を保存する</p>
        <p className="text-xs text-gray-500 leading-relaxed">16枚をスマホに保存します。LINEやSNSのアイコンとしてお使いいただけます。</p>
        <button onClick={handleSaveAll} disabled={saving} className="w-full py-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-lg shadow-md hover:shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
          {saving ? '保存中... ' + progress + ' / 16枚' : saved ? '保存完了！（もう一度保存）' : '16枚を保存する'}
        </button>
        {saving && (
          <div className="w-full bg-pink-100 rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-300" style={{ width: (progress / 16 * 100) + '%' }} />
          </div>
        )}
        {saved && (
          <div className="bg-white rounded-xl p-3 border border-pink-200">
            <p className="text-xs font-black text-pink-600 mb-1">📂 保存場所の確認方法</p>
            <p className="text-xs text-gray-500 leading-relaxed">Androidの場合：「ファイル」アプリ →「ダウンロード」フォルダ</p>
            <p className="text-xs text-gray-500 leading-relaxed">iPhoneの場合：「写真」アプリで確認できます</p>
          </div>
        )}
      </div>

      {/* LINEスタンプとして登録する */}
      <div className="flex flex-col gap-3 bg-green-50 rounded-2xl p-4 border border-green-100">
        <p className="text-sm font-black text-green-600">🐾 LINEスタンプとして登録する</p>
        <p className="text-xs text-gray-500 leading-relaxed">ZIPファイルをダウンロードして、スマホだけでLINEスタンプに登録できます。約5分で完了します。</p>
        <button onClick={handleZip} disabled={zipping || inAppBrowser} className="w-full py-4 rounded-full bg-gradient-to-r from-green-400 to-teal-400 text-white font-bold text-lg shadow-md hover:shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
          {zipping ? '準備中...' : zipped ? 'ダウンロード完了！（再ダウンロード）' : 'ZIPをダウンロードする'}
        </button>

        <button onClick={() => setGuideOpen(v => !v)} className="w-full py-3 rounded-full border-2 border-green-300 text-green-600 font-bold text-sm hover:bg-green-100 transition-colors">
          {guideOpen ? 'ガイドを閉じる ▲' : 'LINEスタンプ登録ガイドを見る ▼'}
        </button>

        {guideOpen && (
          <div className="flex flex-col gap-4 bg-white rounded-2xl p-4 border border-green-200 text-xs text-gray-600 leading-relaxed">

            <div className="flex flex-col gap-3">
              <p className="font-black text-green-700 text-sm">📋 登録手順（スマホのみでOK・約5分）</p>

              <div className="flex flex-col gap-2">

                <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                  <p className="font-black text-green-700 mb-1">① STAMPONでスタンプが完成したら</p>
                  <p className="text-gray-500">上の「ZIPをダウンロードする」ボタンをタップしてZIPファイルを保存してください。このZIPファイルに16枚のスタンプ画像が入っています。</p>
                </div>

                <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                  <p className="font-black text-green-700 mb-1">② ZIPファイルを確認する</p>
                  <p className="text-gray-500">Androidの場合は「ダウンロード」フォルダ、iPhoneの場合は「ファイル」アプリの中に「stampon_line.zip」があることを確認してください。</p>
                </div>

                <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                  <p className="font-black text-green-700 mb-1">③ LINE Creators Marketにアクセス</p>
                  <p className="text-gray-500">スマホのブラウザ（Chrome）で <span className="font-bold text-green-700">creator.line.me</span> を開き、LINEアカウントでログインしてください。</p>
                </div>

                <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                  <p className="font-black text-green-700 mb-1">④ PC版を選択する</p>
                  <p className="text-gray-500">ダッシュボード画面の中に「PC版」という選択肢があります。これをタップするとPC版の画面に切り替わり、ZIP一括アップロードができるようになります。</p>
                </div>

                <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                  <p className="font-black text-green-700 mb-1">⑤ 新規申請→必要事項を入力</p>
                  <p className="text-gray-500">「新規申請」をタップしてスタンプのタイトル（例：テンのスタンプ）と説明文を入力してください。自分だけが使う場合は「非公開」を選択するとLINEストアに表示されません。</p>
                </div>

                <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                  <p className="font-black text-green-700 mb-1">⑥ ZIPを一括アップロード！</p>
                  <p className="text-gray-500">画像登録画面でZIPファイルを選択すると16枚が一気にアップロードされます。1枚ずつ選ぶ必要はありません。</p>
                </div>

                <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                  <p className="font-black text-green-700 mb-1">⑦ 申請完了→審査を待つ</p>
                  <p className="text-gray-500">「申請」ボタンをタップして送信します。審査には通常2〜3日かかります。承認メールが届いたら次のステップへ進んでください。</p>
                </div>

                <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                  <p className="font-black text-green-700 mb-1">⑧ 承認後リリースで使える！</p>
                  <p className="text-gray-500">承認メールが届いたらLINE Creators Marketで「リリース」ボタンをタップしてください。LINEアプリのマイスタンプに追加されて、トークで使えるようになります🎉</p>
                </div>

              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200">
              <p className="font-black text-yellow-700 mb-1">💡 ポイント</p>
              <ul className="flex flex-col gap-1 list-disc list-inside">
                <li>非公開設定なら自分だけが使えます（販売なし）</li>
                <li>有料販売したい場合は価格を設定して申請できます</li>
                <li>ZIPにはmain.png・tab.pngも自動で含まれています</li>
              </ul>
            </div>

          </div>
        )}
      </div>

    </div>
  )
}
