export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-black text-gray-700 mb-8">特定商取引法に基づく表記</h1>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {[
                ['販売業者', 'SHIPS合同会社'],
                ['運営責任者', '東谷 伸樹'],
                ['所在地', '〒565-0815 大阪府吹田市千里丘北1-24-309'],
                ['メールアドレス', 'ships.llc@gmail.com'],
                ['販売URL', 'https://stampon-two.vercel.app'],
                ['販売価格', '480円（税込）'],
                ['支払方法', 'クレジットカード（Stripe経由）'],
                ['支払時期', 'ご注文時にお支払いが確定します'],
                ['サービス提供時期', 'お支払い完了後、即時提供'],
                ['返品・キャンセル', 'デジタルコンテンツのため、生成完了後の返品・キャンセルはお受けできません。生成が正常に完了しなかった場合はメールにてご連絡ください。'],
                ['動作環境', 'インターネット接続環境・モダンブラウザ（Chrome / Safari / Firefox 最新版推奨）'],
              ].map(([label, value]) => (
                <tr key={label} className="border-b border-gray-100 last:border-0">
                  <td className="px-5 py-4 font-bold text-gray-500 bg-gray-50 w-36 align-top whitespace-nowrap">{label}</td>
                  <td className="px-5 py-4 text-gray-700">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center">
          <a href="/" className="text-pink-400 text-sm hover:underline">← トップに戻る</a>
        </div>
      </div>
    </div>
  )
}
