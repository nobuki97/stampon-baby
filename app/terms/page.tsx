export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-black text-gray-700 mb-2">利用規約</h1>
        <p className="text-xs text-gray-400 mb-8">最終更新日：2026年3月29日</p>
        <div className="flex flex-col gap-8 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-black text-gray-600 mb-2">第1条（適用）</h2>
            <p>本規約は、SHIPS.LLC合同会社（以下「当社」）が提供するWebサービス「STAMPON」（以下「本サービス」）の利用条件を定めるものです。ユーザーは本規約に同意の上、本サービスをご利用ください。</p>
          </section>
          <section>
            <h2 className="font-black text-gray-600 mb-2">第2条（サービス内容）</h2>
            <p>本サービスは、ユーザーがアップロードしたペット写真をもとにAIがLINEスタンプ画像16枚を生成し、ZIPファイルとして提供するサービスです。</p>
          </section>
          <section>
            <h2 className="font-black text-gray-600 mb-2">第3条（料金・支払い）</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>利用料金：480円（税込）／1回</li>
              <li>支払方法：クレジットカード（Stripe経由）</li>
              <li>支払時期：サービス利用前のお支払いとなります</li>
            </ul>
          </section>
          <section>
            <h2 className="font-black text-gray-600 mb-2">第4条（返金・キャンセル）</h2>
            <p>デジタルコンテンツの性質上、生成完了後の返金・キャンセルはお受けできません。ただし、システムの不具合により生成が正常に完了しなかった場合は、当社の判断により対応いたします。</p>
          </section>
          <section>
            <h2 className="font-black text-gray-600 mb-2">第5条（禁止事項）</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>他者の権利を侵害する画像のアップロード</li>
              <li>生成画像の商業目的での無断転用・再販</li>
              <li>サービスへの不正アクセス・妨害行為</li>
              <li>その他法令または公序良俗に反する行為</li>
            </ul>
          </section>
          <section>
            <h2 className="font-black text-gray-600 mb-2">第6条（知的財産権）</h2>
            <p>生成されたスタンプ画像の著作権は、ユーザーと当社が共有するものとします。ユーザーはLINEクリエイターズマーケットへの申請・個人利用を自由に行えます。</p>
          </section>
          <section>
            <h2 className="font-black text-gray-600 mb-2">第7条（免責事項）</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>AI生成の性質上、生成結果の品質・内容を保証するものではありません</li>
              <li>LINEクリエイターズマーケットの審査通過を保証するものではありません</li>
              <li>システム障害・メンテナンス等によるサービス停止について当社は責任を負いません</li>
            </ul>
          </section>
          <section>
            <h2 className="font-black text-gray-600 mb-2">第8条（規約の変更）</h2>
            <p>当社は必要に応じて本規約を変更することがあります。変更後はこのページに掲載し、掲載時点で効力を生じるものとします。</p>
          </section>
          <section>
            <h2 className="font-black text-gray-600 mb-2">第9条（準拠法・管轄）</h2>
            <p>本規約の解釈には日本法を準拠法とし、大阪地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
          </section>
        </div>
        <div className="mt-10 text-center">
          <a href="/" className="text-pink-400 text-sm hover:underline">← トップに戻る</a>
        </div>
      </div>
    </div>
  )
}
