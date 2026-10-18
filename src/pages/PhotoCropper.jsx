import { useState, useRef, useEffect } from 'react'
import innovatorsData from '../data/innovators.json'

const PhotoCropper = () => {
    const [selectedInnovator, setSelectedInnovator] = useState(null)
    const [scale, setScale] = useState(1)
    const [minScale, setMinScale] = useState(0.1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

    // Output Quality (Keep High)
    const OUTPUT_WIDTH = 800
    const OUTPUT_HEIGHT = 600

    // Display Size (Scaled up 1.3x from 480 -> 624)
    const DISPLAY_WIDTH = 624
    const DISPLAY_HEIGHT = 468

    const containerRef = useRef(null)
    const scaleRef = useRef(1)
    const minScaleRef = useRef(0.1)
    const imageDimRef = useRef({ width: 0, height: 0 })

    const getBasePath = () => import.meta.env.BASE_URL.replace(/\/$/, '')
    const validInnovators = innovatorsData.filter(inn => inn.image && inn.image.trim() !== '')

    useEffect(() => { scaleRef.current = scale }, [scale])
    useEffect(() => { minScaleRef.current = minScale }, [minScale])

    useEffect(() => {
        if (selectedInnovator) {
            setPosition({ x: 0, y: 0 })
        }
    }, [selectedInnovator])

    // Helper: Calculate valid position range based on current scale
    const getClampedPosition = (targetPos, targetScale) => {
        const { width: natW, height: natH } = imageDimRef.current
        if (!natW || !natH) return { x: 0, y: 0 }

        const scaledW = natW * targetScale
        const scaledH = natH * targetScale

        // The image must cover DISPLAY_WIDTH x DISPLAY_HEIGHT
        // Max offset allowed in one direction = (ScaledDim - DisplayDim) / 2
        // Example: If ScaledW = 500, DisplayW = 480. MaxOffset = (500-480)/2 = 10.
        // So x can be between -10 and 10.

        const maxX = Math.max(0, (scaledW - DISPLAY_WIDTH) / 2)
        const maxY = Math.max(0, (scaledH - DISPLAY_HEIGHT) / 2)

        return {
            x: Math.min(Math.max(targetPos.x, -maxX), maxX),
            y: Math.min(Math.max(targetPos.y, -maxY), maxY)
        }
    }

    // We need a ref for position to access it inside the non-passive listener correctly/smoothly
    const positionRef = useRef({ x: 0, y: 0 })
    useEffect(() => { positionRef.current = position }, [position])

    // Re-bind wheel listener with full access to refs
    useEffect(() => {
        const node = containerRef.current
        if (!node) return

        const handleWheelRaw = (e) => {
            e.preventDefault()
            const direction = e.deltaY > 0 ? -1 : 1
            const step = 0.05

            const nextScale = Math.min(Math.max(minScaleRef.current, scaleRef.current + direction * step), 5)

            // Constrain position with new scale
            const currentPos = positionRef.current
            const clampedPos = getClampedPosition(currentPos, nextScale)

            setScale(nextScale)
            setPosition(clampedPos)
        }

        node.addEventListener('wheel', handleWheelRaw, { passive: false })
        return () => node.removeEventListener('wheel', handleWheelRaw)
    }, [selectedInnovator]) // Re-binds when innovator changes

    const handleImageLoad = (e) => {
        const natW = e.target.naturalWidth
        const natH = e.target.naturalHeight

        // Store for math usage
        imageDimRef.current = { width: natW, height: natH }

        const scaleW = DISPLAY_WIDTH / natW
        const scaleH = DISPLAY_HEIGHT / natH
        const calculatedMin = Math.max(scaleW, scaleH)

        setMinScale(calculatedMin)

        // Initial set: auto-center
        if (scale < calculatedMin) {
            setScale(calculatedMin)
            setPosition({ x: 0, y: 0 })
        } else {
            // Re-validate current position against loaded image
            // (Rare case where image changes but logic remains? mostly reset handles this)
            setPosition({ x: 0, y: 0 })
        }
    }

    const handleMouseDown = (e) => {
        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return

        const targetX = e.clientX - dragStart.x
        const targetY = e.clientY - dragStart.y

        // Apply constraints
        const constrained = getClampedPosition({ x: targetX, y: targetY }, scale)

        setPosition(constrained)
    }

    const handleMouseUp = () => setIsDragging(false)

    const handleDownload = () => {
        if (!selectedInnovator) return
        const canvas = document.createElement('canvas')
        canvas.width = OUTPUT_WIDTH
        canvas.height = OUTPUT_HEIGHT
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.src = `${getBasePath()}/${selectedInnovator.image}`
        img.crossOrigin = "anonymous"

        img.onload = () => {
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT)
            ctx.save()
            ctx.translate(OUTPUT_WIDTH / 2, OUTPUT_HEIGHT / 2)
            const ratio = OUTPUT_WIDTH / DISPLAY_WIDTH
            ctx.translate(position.x * ratio, position.y * ratio)

            // Fix: Apply the resolution ratio to the scale as well
            // The 'scale' state creates the image size relative to DISPLAY_WIDTH
            // We need to scale it up to match the OUTPUT_WIDTH coordinate system
            ctx.scale(scale * ratio, scale * ratio)

            ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
            ctx.restore()
            const link = document.createElement('a')
            link.download = selectedInnovator.image.split('/').pop()
            link.href = canvas.toDataURL('image/jpeg', 0.90)
            link.click()
        }
    }

    return (
        <div style={{ maxWidth: '100%', height: '85vh', display: 'flex', flexDirection: 'column', background: '#f8f9fa' }}>
            {/* Header */}
            <div style={{
                padding: '10px 20px',
                background: 'white',
                borderBottom: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h1 style={{ margin: 0, fontSize: '1.2rem' }}>📸 照片裁切工作室 v2.7</h1>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>| 鎖定比例 4:3</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    請選擇左側項目 ➔ 調整畫面 ➔ 下載更新
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* Column 1: List (Left) */}
                <div style={{ width: '15%', minWidth: '150px', overflowY: 'auto', background: 'white', borderRight: '1px solid #ddd' }}>
                    {validInnovators.map(inn => (
                        <div
                            key={inn.id}
                            onClick={() => setSelectedInnovator(inn)}
                            style={{
                                padding: '10px 15px',
                                borderBottom: '1px solid #f0f0f0',
                                cursor: 'pointer',
                                background: selectedInnovator?.id === inn.id ? '#e6fffa' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'background 0.2s'
                            }}
                        >
                            <img
                                src={`${getBasePath()}/${inn.image}`}
                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', background: '#eee', border: '1px solid #eee' }}
                            />
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{inn.id}</div>
                                <div style={{ fontSize: '11px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inn.name}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Column 2: Editor (Center) */}
                <div style={{ flex: 1, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {/* Background Pattern */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    {selectedInnovator ? (
                        <div
                            ref={containerRef}
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: isDragging ? 'grabbing' : 'grab',
                                userSelect: 'none',
                                zIndex: 1
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            {/* Image */}
                            <img
                                src={`${getBasePath()}/${selectedInnovator.image}`}
                                onLoad={handleImageLoad}
                                draggable={false}
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                    transformOrigin: 'center center',
                                    maxWidth: 'none',
                                    pointerEvents: 'none',
                                    boxShadow: '0 0 20px rgba(0,0,0,0.1)'
                                }}
                            />

                            {/* Mask (Lighter) */}
                            <div
                                style={{
                                    width: `${DISPLAY_WIDTH}px`,
                                    height: `${DISPLAY_HEIGHT}px`,
                                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.25)', // 25% opacity dimmer (Lighter)
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    position: 'relative',
                                    pointerEvents: 'none',
                                    // Add a slight drop shadow to the frame itself to pop from background
                                    filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))'
                                }}
                            >
                                <div style={{ position: 'absolute', top: '33.33%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.3)' }} />
                                <div style={{ position: 'absolute', top: '66.66%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.3)' }} />
                                <div style={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.3)' }} />
                                <div style={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.3)' }} />
                            </div>
                        </div>
                    ) : (
                        <div style={{ color: '#94a3b8', textAlign: 'center', zIndex: 1 }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🖼️</div>
                            <div>請選擇照片開始編輯</div>
                        </div>
                    )}
                </div>

                {/* Column 3: Controls (Right) */}
                <div style={{ width: '25%', minWidth: '280px', background: 'white', borderLeft: '1px solid #ddd', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {selectedInnovator ? (
                        <>
                            {/* Info Block */}
                            <div style={{ background: '#f7fafc', padding: '15px', borderRadius: '8px', border: '1px solid #edf2f7' }}>
                                <div style={{ color: '#718096', fontSize: '12px', marginBottom: '4px' }}>TARGET FILE</div>
                                <div style={{ fontFamily: 'monospace', wordBreak: 'break-all', fontWeight: 'bold', color: '#2d3748' }}>
                                    {selectedInnovator.image}
                                </div>
                            </div>

                            {/* Zoom Control */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <label style={{ fontWeight: 'bold', color: '#4a5568' }}>縮放 (Zoom)</label>
                                    <span style={{ color: '#3182ce', fontWeight: 'bold' }}>{Math.round(scale * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min={minScale}
                                    max="5"
                                    step="0.01" // 1% granularity for Slider
                                    value={scale}
                                    onChange={(e) => setScale(Math.max(minScale, parseFloat(e.target.value)))}
                                    style={{ width: '100%', cursor: 'pointer', accentColor: '#3182ce' }}
                                />
                                <div style={{ fontSize: '12px', color: '#718096', marginTop: '5px' }}>
                                    * 支援滑鼠滾輪 (每格 5%)
                                </div>
                            </div>

                            {/* Download Button */}
                            <div style={{ marginTop: '20px' }}>
                                <button
                                    onClick={handleDownload}
                                    style={{
                                        width: '100%',
                                        background: '#38A169',
                                        color: 'white',
                                        border: 'none',
                                        padding: '15px',
                                        borderRadius: '8px',
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 6px rgba(56, 161, 105, 0.2)',
                                        transition: 'transform 0.1s'
                                    }}
                                    onMouseDown={e => e.target.style.transform = 'scale(0.98)'}
                                    onMouseUp={e => e.target.style.transform = 'scale(1)'}
                                >
                                    下載裁切結果 ⬇️
                                </button>
                                <p style={{ textAlign: 'center', fontSize: '12px', color: '#718096', marginTop: '10px' }}>
                                    (檔名已自動設定，下載後請直接覆蓋專案原檔)
                                </p>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e0' }}>
                            等待選擇...
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default PhotoCropper
