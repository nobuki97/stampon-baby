export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-black text-gray-700 mb-2">プライバシーポリシー</h1>
        <p className="text-xs text-gray-400 mb-8">最終更新日：2026年3月29日</p>
        <div className="flex flex-col gap-8 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-black text-gray-600 mb-2">1. 事業者情報</h2>
            <p>SHIPS.LLC合同会社（以下「当社」）は、本サービス「STAMPON」におけるお客様の個人情報の取扱いについて、以下のとおりプライバシーポリシーを定めます。</p>
          </section>
          <section>
            <h2 className="font-black text-gray-600 mb-2">2. 収集する情報</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>アップロードされたペットの写真画像</li>
              <li>入力されたペット情報（種類・毛色・名前など）</li>
              <li>Stripeを通じた決済情報（カード情報は当社では保持しません）</li>
              <li>アクセスログ（IPアドレス・ブラウザ情報など）</li>
            </ul>
          </section>
          <section>
            <h2 className="font-black text-gray-600 mb-2">3. 情報の利用目的</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>LINEスタンプ画像の生成・提供</li>
              <li>サービスの改善・品質向上</li>
              <li>不正利用の防止</li>
            </ul>
          </section>
          <section>
            <h2 className="font-black text-gray-600 mb-2">4. 第三者への提供</h2>
            <p>当社は、以下の場合を除きお客様の個人情報を第三者に提供しません。</p>
            <ul className="list-disc pl-5 flex flex-col gap-1 mt-2">
              <li>法令に基づく場合</li>
              <li>サービス提供に必要な業務委託先（OpenAI・Stripe・Vercel）への提供</li>
            </ul>
          </section>
          <section>
            <h2 className="font-black text-gray-600 mb-2">5. 画像データの取扱い</h2>
            <p>アップロードされたペット写真はAI画像生成のためにOpenAI APIに送信されます。生成完了後、当社のサーバーには画像データを保存しません。</p>
          </section>
          <section>
            <h2 className="font-black text-gray-600 mb-2">6. Cookieの使用</h2>
            <p>本サービスでは、セッション管理のためにブラウザのsessionStorageを使用します。サーバー側でのCookie保存は行いません。</p>
          </section>
          <section>
            <h2 className="font-black text-gray-600 mb-2">7. お問い合わせ</h2>
            <p>個人情報の取扱いに関するお問い合わせは下記までご連絡ください。</p>
            <p className="mt-1">メール：ships.llc@gmail.com</p>
          </section>
          <section>
            <h2 className="font-black text-gray-600 mb-2">8. プライバシーポリシーの変更</h2>
            <p>本ポリシーは必要に応じて変更することがあります。変更後はこのページに掲載します。</p>
          </section>
        </div>
        <div className="mt-10 text-center">
          <a href="/" className="text-pink-400 text-sm hover:underline">← トップに戻る</a>
        </div>
      </div>
    </div>
  )
}
