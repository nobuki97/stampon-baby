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
      if (stampD
