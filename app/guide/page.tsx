export default function GuidePage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">LINEスタンプ登録ガイド</h1>

      <section className="mb-8 bg-green-50 rounded-2xl p-5 border border-green-100">
        <h2 className="text-lg font-bold mb-3 text-green-700">A. 自分用に無料で使う（非公開）</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          スマホの「LINE Creators Studio」アプリを使います。審査後、自分で無料ダウンロードして使えます。ショップには公開されません。
        </p>
        <ol className="text-sm text-gray-700 leading-relaxed space-y-3">
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-green-400 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
            <span>スマホに「LINE Creators Studio」アプリをダウンロードする</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-green-400 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
            <span>LINEアカウントでログインし、「スタンプを作る」を選択</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-green-400 text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
            <span>STAMPONでダウンロードした16枚の画像をアップロード</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-green-400 text-white font-bold text-xs flex items-center justify-center shrink-0">4</span>
            <span>タイトル・説明文を入力し、プライベート設定で「非公開」を選択</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-green-400 text-white font-bold text-xs flex items-center justify-center shrink-0">5</span>
            <span>「審査リクエスト」を送信（数日で審査完了）</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-green-400 text-white font-bold text-xs flex items-center justify-center shrink-0">6</span>
            <span>審査通過後、自分のLINEに無料でダウンロードして使える</span>
          </li>
        </ol>
        <div className="mt-4 bg-white rounded-xl p-3 border border-green-200 text-xs text-gray-500">
          注意：非公開設定でも、トークでスタンプを送った相手がタップすると購入できてしまいます。
        </div>
      </section>

      <section className="mb-8 bg-blue-50 rounded-2xl p-5 border border-blue-100">
        <h2 className="text-lg font-bold mb-3 text-blue-700">B. 有料販売する（公開）</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          LINEクリエイターズマーケット（Web版）から申請します。審査通過後、LINEスタンプショップで販売できます。
        </p>
        <ol className="text-sm text-gray-700 leading-relaxed space-y-3">
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-400 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
            <span><a href="https://creator.line.me" target="_blank" className="text-blue-500 underline">creator.line.me</a> にアクセスしてLINEアカウントでログイン・クリエイター登録</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-400 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
            <span>「スタンプ」→「新規登録」→タイトル・説明文を入力</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-400 text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
            <span>STAMPONでダウンロードしたZIPファイルをアップロード</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-400 text-white font-bold text-xs flex items-center justify-center shrink-0">4</span>
            <span>プライベート設定で「公開」を選択し、販売価格を設定</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-400 text-white font-bold text-xs flex items-center justify-center shrink-0">5</span>
            <span>「審査リクエスト」を送信（数日で審査完了）</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-400 text-white font-bold text-xs flex items-center justify-center shrink-0">6</span>
            <span>審査通過後、LINEスタンプショップで販売開始</span>
          </li>
        </ol>
      </section>

      <section className="mb-8 bg-pink-50 rounded-2xl p-5 border border-pink-100">
        <h2 className="text-lg font-bold mb-3 text-pink-600">C. LINEに登録せず画像として使う（一番かんたん）</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          審査なし・登録なし・無料。スマホのギャラリーに保存してLINEのトークで画像として送るだけです。
        </p>
        <ol className="text-sm text-gray-700 leading-relaxed space-y-3">
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-pink-400 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
            <span>STAMPONの「16枚を画像フォルダに保存する」ボタンを押す</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-pink-400 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
            <span>スマホのギャラリーに「スタンプ」などのフォルダを作って保管</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-pink-400 text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
            <span>LINEのトークで画像添付ボタンをタップ</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-pink-400 text-white font-bold text-xs flex items-center justify-center shrink-0">4</span>
            <span>スタンプフォルダから使いたい画像を選んで送信</span>
          </li>
        </ol>
      </section>

      <div className="text-center mt-10">
        <a href="/" className="bg-orange-400 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-500">
          STAMPONに戻る
        </a>
      </div>
    </main>
  )
}
