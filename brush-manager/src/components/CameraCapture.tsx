import React, { useRef, useState } from 'react';
import { CustomColorForm } from './CustomColorForm';

interface Props {
  onAddToInventory?: (colorId: string) => void;
}

export const CameraCapture: React.FC<Props> = ({ onAddToInventory }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [avgHex, setAvgHex] = useState('#cccccc');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
      }
    } catch (e) {
      alert('カメラを使用できません: ' + (e as Error).message);
    }
  };

  const processImageData = (canvas: HTMLCanvasElement, dataUrl: string) => {
    setCapturedDataUrl(dataUrl);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let r = 0, g = 0, b = 0, cnt = 0;
    for (let i = 0; i < imgData.data.length; i += 4) {
      r += imgData.data[i];
      g += imgData.data[i + 1];
      b += imgData.data[i + 2];
      cnt++;
    }
    r = Math.round(r / cnt);
    g = Math.round(g / cnt);
    b = Math.round(b / cnt);
    const h = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    setAvgHex(h);
  };

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        processImageData(canvas, canvas.toDataURL('image/jpeg'));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setStreaming(false);
  };

const styles = {
  container: { padding: '20px' },
  section: { padding: '15px', backgroundColor: '#f5f3f0', borderRadius: '8px', marginBottom: '15px' },
  buttonPrimary: { padding: '10px 16px', backgroundColor: '#d4a574', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' },
  buttonSecondary: { padding: '8px 12px', backgroundColor: '#8b7d6b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  buttonNeutral: { padding: '8px 12px', backgroundColor: '#ddd', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  controls: { display: 'flex', gap: '8px', marginTop: '8px' },
  videoPreview: { width: '100%', maxHeight: '400px', borderRadius: '8px', backgroundColor: '#000', marginBottom: '8px' },
  divider: { textAlign: 'center' as const, margin: '20px 0', color: '#666', fontSize: '14px' },
  resultSection: { marginTop: '20px', padding: '15px', backgroundColor: '#faf8f6', borderRadius: '8px' },
};

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    processImageData(canvas, dataUrl);
  };

  return (
    <div style={styles.container}>
      <h3>カメラで撮影または画像をアップロードして色を抽出</h3>

      {/* Camera section */}
      <div style={styles.section}>
        <h4>📷 カメラから撮影</h4>
        {!streaming ? (
          <button onClick={startCamera} style={styles.buttonPrimary}>カメラを起動</button>
        ) : (
          <div>
            <video ref={videoRef} style={styles.videoPreview} autoPlay playsInline />
            <div style={styles.controls}>
              <button onClick={capture} style={styles.buttonSecondary}>撮影</button>
              <button onClick={stopCamera} style={styles.buttonNeutral}>終了</button>
            </div>
          </div>
        )}
      </div>

      <p style={styles.divider}>または</p>

      {/* File upload section */}
      <div style={styles.section}>
        <h4>🖼️ 画像から抽出</h4>
        <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} style={{marginBottom: '10px'}}/>
        <p style={{fontSize: '12px', color: '#666'}}>画像ファイルを選択して色を自動抽出します。</p>
      </div>

      {capturedDataUrl && (
        <div style={styles.resultSection}>
          <h4>撮影結果</h4>
          <img src={capturedDataUrl} alt="capture" style={{width:'100%',borderRadius:8}} />
          <p>抽出色: <span style={{display:'inline-block',width:20,height:20,verticalAlign:'middle',background:avgHex,border:'1px solid #ccc',marginLeft:8}} /> {avgHex}</p>
          <p>この色をカタログに登録してマイコレクションに追加できます。</p>
          <div style={{background:'#fff',padding:12,borderRadius:8}}>
            <CustomColorForm onAddToInventory={onAddToInventory} initialHex={avgHex} />
            <p style={{fontSize:12,color:'#666'}}>※ 自動抽出した色はあくまで目安です。必要に応じてHexを編集してください。</p>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{display:'none'}} />
    </div>
  );
};
