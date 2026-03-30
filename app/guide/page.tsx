export default function GuidePage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">📱 LINEスタンプ申請ガイド</h1>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-2">① LINE Creators Marketに登録する</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          <a href="https://creator.line.me" target="_blank" className="text-blue-500 underline">creator.line.me</a> にアクセスして、LINEアカウントでログインしてください。
          まだアカウントがない場合は新規登録します。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-2">② スタンプを新規登録する</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          ログイン後、「スタンプ」→「新規登録」をクリック。
          タイトル・説明文を入力し、16枚の画像をアップロードします。
          STAMPONでダウンロードしたZIPを解凍すると16枚のPNG画像が入っています。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-2">③ 個人利用 vs 販売用を選ぶ</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
          <p className="font-bold mb-1">🅰 個人用（無料・すぐ使える）</p>
          <p className="mb-3">審査なしで登録後すぐ自分のLINEで使えます。販売はできません。</p>
          <p className="font-bold mb-1">🅱 販売用（審査あり・2〜3日）</p>
          <p>LINE Creators Marketで販売できます。審査に2〜3日かかります。</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-2">④ 審査で落ちないコツ</h2>
        <ul className="text-sm text-gray-700 leading-relaxed list-disc list-inside space-y-1">
          <li>画像サイズは370×320px（STAMPONは対応済み）</li>
          <li>背景は透過またはシンプルな色</li>
          <li>著作権・商標を侵害しない内容</li>
          <li>タイトル・説明文は日本語でOK</li>
        </ul>
      </section>

      <div className="text-center mt-10">
        <a href="/" className="bg-orange-400 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-500">
          ← STAMPONに戻る
        </a>
      </div>
    </main>
  )
}
