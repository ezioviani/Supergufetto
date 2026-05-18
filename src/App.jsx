import React, { useState } from 'react'
import { divideInSillabe } from './utils/syllables'
import { toBase64 } from './utils/base64'

export default function App() {
  const [image, setImage] = useState(null)
  const [text, setText] = useState('')
  const [sillabe, setSillabe] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [voce, setVoce] = useState(true)

  const GOOGLE_API_KEY = 'INSERISCI_API_KEY'

  const handleImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImage(URL.createObjectURL(file))
    setLoading(true)

    const base64 = await toBase64(file)

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        body: JSON.stringify({
          requests: [
            {
              image: { content: base64 },
              features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
              imageContext: { languageHints: ['it'] }
            }
          ]
        })
      }
    )

    const data = await response.json()

    const extractedText =
      data.responses?.[0]?.fullTextAnnotation?.text || ''

    setText(extractedText)
    const sill = divideInSillabe(extractedText)
    setSillabe(sill)
    setIndex(0)

    setLoading(false)
  }

  const next = () => {
    const nextIndex = (index + 1) % sillabe.length
    setIndex(nextIndex)

    if (voce && sillabe[nextIndex]) {
      const utter = new SpeechSynthesisUtterance(sillabe[nextIndex])
      utter.lang = 'it-IT'
      speechSynthesis.speak(utter)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Lettura per Bambini</h1>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImage}
      />

      {loading && <p>OCR Google in corso...</p>}

      {image && (
        <img
          src={image}
          alt="preview"
          style={{ width: '100%', marginTop: 10 }}
        />
      )}

      <p>
        <strong>Testo OCR:</strong> {text}
      </p>

      {sillabe.length > 0 && (
        <div>
          <h2 onClick={next} style={{ fontSize: 50 }}>
            {sillabe[index]}
          </h2>
          <p>Tocca la sillaba per andare avanti</p>
        </div>
      )}

      <button onClick={() => setVoce(!voce)}>
        Voce: {voce ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}
