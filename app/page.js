'use client';

import { useState, useRef, useEffect } from 'react';
import { SCENES, BACKEND_API_URL } from '@/lib/constants';
import * as BackgroundFuncs from '@/lib/backgrounds';

export default function Home() {
  const [originalImage, setOriginalImage] = useState(null);
  const [removedBgImage, setRemovedBgImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('info');
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [composites, setComposites] = useState([]);
  const [showRatioDialog, setShowRatioDialog] = useState(false);
  const [pendingDownload, setPendingDownload] = useState(null); // {type: 'single'|'all', sceneIndex: number|null}

  const fileInputRef = useRef(null);
  const uploadAreaRef = useRef(null);
  const canvasRefs = useRef([]);

  const backgroundFuncs = {
    1: BackgroundFuncs.drawMarbleStudio,
    2: BackgroundFuncs.drawSandyBeach,
    3: BackgroundFuncs.drawAutumnLeaves,
    4: BackgroundFuncs.drawLakeDock,
    5: BackgroundFuncs.drawAutumnForest,
    6: BackgroundFuncs.drawGoldenHour,
    7: BackgroundFuncs.drawGardenBloom,
    8: BackgroundFuncs.drawNightCity,
    9: BackgroundFuncs.drawMountainView,
    10: BackgroundFuncs.drawLuxuryInterior,
  };

  useEffect(() => {
    checkServerHealth();
    preloadImages();
  }, []);

  useEffect(() => {
    // Generate all 10 composites when removedBgImage changes
    if (removedBgImage) {
      generateAllComposites();
    }
  }, [removedBgImage]);

  const showStatus = (message, type = 'info') => {
    setStatus(message);
    setStatusType(type);
  };

  const preloadImages = () => {
    // Use the exported preload function from backgrounds
    BackgroundFuncs.preloadAllBackgrounds();
  };

  const checkServerHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setApiKeyConfigured(data.apiKeyConfigured);
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  const handleFileUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      showStatus('❌ Please upload an image file', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showStatus('❌ Image too large (max 10MB)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setRemovedBgImage(null);
        setComposites([]);
        showStatus('Image uploaded successfully', 'success');
      };
      img.onerror = () => showStatus('Error loading image', 'error');
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const removeBackground = async () => {
    if (!originalImage) {
      showStatus('Please upload an image first', 'error');
      return;
    }

    if (!apiKeyConfigured) {
      showStatus('API key not configured', 'error');
      return;
    }

    setLoading(true);
    showStatus('Processing... please wait', 'info');

    try {
      const canvas = document.createElement('canvas');
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(originalImage, 0, 0);

      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('image', blob, 'image.png');

        const response = await fetch(BACKEND_API_URL, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unknown error');
        }

        const img = new Image();
        img.onload = () => {
          setRemovedBgImage(img);
          showStatus('Background removed successfully! Generating previews...', 'success');
        };
        img.onerror = () => showStatus('Error loading result', 'error');
        img.src = data.image;
      }, 'image/jpeg');
    } catch (error) {
      showStatus('Error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateAllComposites = async () => {
    if (!removedBgImage) return;

    // Wait to ensure all images are loaded
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newComposites = [];
    const maxWidth = 400;
    const maxHeight = 400;

    const ratio = removedBgImage.width / removedBgImage.height;
    let compWidth = maxWidth;
    let compHeight = maxWidth / ratio;

    if (compHeight > maxHeight) {
      compHeight = maxHeight;
      compWidth = compHeight * ratio;
    }

    // Generate composite for each scene
    for (let i = 0; i < SCENES.length; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = compWidth;
      canvas.height = compHeight;
      const ctx = canvas.getContext('2d');

      const drawFunc = backgroundFuncs[SCENES[i].id];
      if (drawFunc) {
        drawFunc(ctx, compWidth, compHeight);
      }

      const scale = Math.max(compWidth / removedBgImage.width, compHeight / removedBgImage.height);
      const x = (compWidth - removedBgImage.width * scale) / 2;
      const y = (compHeight - removedBgImage.height * scale) / 2;
      ctx.drawImage(removedBgImage, x, y, removedBgImage.width * scale, removedBgImage.height * scale);

      newComposites.push(canvas.toDataURL('image/png', 1.0));
    }

    setComposites(newComposites);
    showStatus('All 10 scene previews ready! ✨', 'success');
  };

  const downloadSingle = (sceneIndex) => {
    // Show ratio dialog instead of downloading immediately
    setPendingDownload({ type: 'single', sceneIndex });
    setShowRatioDialog(true);
  };

  const downloadAll = async () => {
    // Show ratio dialog for batch download
    setPendingDownload({ type: 'all', sceneIndex: null });
    setShowRatioDialog(true);
  };

  const generateImageWithRatio = (imageDataUrl, ratio) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ratio === '1:1') {
          // Square format: 1200x1200 - Smart crop for best product view
          canvas.width = 1200;
          canvas.height = 1200;
          
          const imgRatio = img.width / img.height;
          const canvasRatio = 1; // 1:1
          
          let sourceX, sourceY, sourceWidth, sourceHeight;
          
          if (imgRatio > canvasRatio) {
            // Image is wider than square - crop sides
            sourceHeight = img.height;
            sourceWidth = sourceHeight * canvasRatio;
            sourceX = (img.width - sourceWidth) / 2; // Center horizontally
            sourceY = 0;
          } else {
            // Image is taller than square - crop top/bottom
            sourceWidth = img.width;
            sourceHeight = sourceWidth / canvasRatio;
            sourceX = 0;
            sourceY = (img.height - sourceHeight) / 2; // Center vertically
          }
          
          ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 1200, 1200);
        } else if (ratio === '16:9') {
          // Landscape format: 1920x1080 - Smart crop prioritizing upper content (face/neckline)
          canvas.width = 1920;
          canvas.height = 1080;
          
          const imgRatio = img.width / img.height;
          const canvasRatio = 16 / 9;
          
          let sourceX, sourceY, sourceWidth, sourceHeight;
          
          if (imgRatio > canvasRatio) {
            // Image is wider than 16:9 - crop left/right sides
            sourceHeight = img.height;
            sourceWidth = sourceHeight * canvasRatio;
            sourceX = (img.width - sourceWidth) / 2; // Center horizontally
            sourceY = 0;
          } else {
            // Image is taller than 16:9 - crop top/bottom but keep more from top
            sourceWidth = img.width;
            sourceHeight = sourceWidth / canvasRatio;
            sourceX = 0;
            // Bias toward top (35% from top, 65% from bottom) - shows face/neckline better
            sourceY = (img.height - sourceHeight) * 0.25; // 25% from top, 75% from bottom
          }
          
          ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 1920, 1080);
        } else if (ratio === 'original') {
          // Original format: Keep original dimensions and aspect ratio
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        }

        resolve(canvas.toDataURL('image/png', 1.0));
      };
      img.src = imageDataUrl;
    });
  };

  const handleRatioSelect = async (ratio) => {
    if (!pendingDownload) return;

    setShowRatioDialog(false);
    showStatus('Processing download...', 'info');

    try {
      if (pendingDownload.type === 'single') {
        const imageUrl = composites[pendingDownload.sceneIndex];
        const processedImage = await generateImageWithRatio(imageUrl, ratio);

        const link = document.createElement('a');
        link.href = processedImage;
        link.download = `stk-pvt-ltd-${SCENES[pendingDownload.sceneIndex].name.replace(/\s+/g, '-').toLowerCase()}-${ratio.replace(':', '-')}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showStatus(`✅ Downloaded ${ratio} format!`, 'success');
      } else if (pendingDownload.type === 'all') {
        showStatus(`Downloading all 10 in ${ratio} format...`, 'info');

        for (let i = 0; i < composites.length; i++) {
          setTimeout(async () => {
            const imageUrl = composites[i];
            const processedImage = await generateImageWithRatio(imageUrl, ratio);

            const link = document.createElement('a');
            link.href = processedImage;
            link.download = `stk-pvt-ltd-${i + 1}-${SCENES[i].name.replace(/\s+/g, '-').toLowerCase()}-${ratio.replace(':', '-')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }, i * 500);
        }

        setTimeout(() => {
          showStatus(`✅ All 10 images downloaded in ${ratio} format!`, 'success');
        }, composites.length * 500);
      }
    } catch (error) {
      showStatus('Error processing download: ' + error.message, 'error');
    }

    setPendingDownload(null);
  };

  const reset = () => {
    setOriginalImage(null);
    setRemovedBgImage(null);
    setComposites([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setStatus('');
  };

  const handleUploadAreaClick = () => fileInputRef.current?.click();
  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    uploadAreaRef.current?.classList.add('dragover');
  };
  const handleDragLeave = () => uploadAreaRef.current?.classList.remove('dragover');
  const handleDrop = (e) => {
    e.preventDefault();
    uploadAreaRef.current?.classList.remove('dragover');
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-black">STK PVT LTD</h1>
          <p className="text-gray-600 mt-1">Professional background removal with 10 custom scenes</p>
        </div>
      </header>

      {/* Status Message */}
      {status && (
        <div className={`mx-auto max-w-7xl px-6 py-3 text-center text-sm font-medium animate-fadeIn ${
          statusType === 'error' ? 'text-red-700 bg-red-50 rounded-lg' :
          statusType === 'success' ? 'text-green-700 bg-green-50 rounded-lg' :
          'text-blue-700 bg-blue-50 rounded-lg'
        }`}>
          {status}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {!removedBgImage ? (
          // Upload & Process Section
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left - Controls */}
            <div className="space-y-6">
              
              {/* Upload Section */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Step 1: Upload Image</h2>
                <div
                  ref={uploadAreaRef}
                  onClick={handleUploadAreaClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-sm text-gray-600 font-medium">Drag & drop your kurti image<br /></p>
                  <p className="text-xs text-gray-500 mt-2">or click to browse (max 10MB)</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {/* Process Section */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Step 2: Remove Background</h2>
                <button
                  onClick={removeBackground}
                  disabled={!originalImage || loading || !apiKeyConfigured}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors text-sm ${
                    !originalImage || loading || !apiKeyConfigured
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-900'
                  }`}
                >
                  {loading ? '⏳ Processing...' : '✨ Remove Background'}
                </button>
                <p className="text-xs text-gray-600 mt-3">Processing takes 3-5 seconds. After removal, you'll see all 10 scene previews.</p>
              </div>

            </div>

            {/* Right - Preview */}
            <div>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Original Image</h2>
                <div className="bg-white rounded border border-gray-200 flex flex-col items-center justify-center overflow-auto" style={{ minHeight: '400px', maxHeight: '550px' }}>
                  {originalImage ? (
                    <div className="p-4 flex items-center justify-center">
                      <img src={originalImage.src} alt="Original" className="max-w-full h-auto" style={{ maxHeight: '520px' }} />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-400 text-sm">Upload an image to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        ) : (
          // Results Section - All 10 Scenes
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-black">Your Results</h2>
                <p className="text-gray-600 text-sm mt-1">All 10 scene variations ready for download</p>
              </div>
              <div className="space-x-3">
                <button
                  onClick={downloadAll}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                >
                  📥 Download All (10) - Choose Format
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
                >
                  ↺ Start Over
                </button>
              </div>
            </div>

            {/* Grid of 10 Scenes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {SCENES.map((scene, index) => (
                <div key={scene.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Scene Preview */}
                  <div className="bg-white flex items-center justify-center overflow-hidden" style={{ aspectRatio: '1' }}>
                    {composites[index] ? (
                      <img src={composites[index]} alt={scene.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">Generating...</p>
                      </div>
                    )}
                  </div>

                  {/* Scene Info */}
                  <div className="p-3 border-t border-gray-200">
                    <p className="font-semibold text-sm text-gray-900">{scene.name}</p>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">{scene.description}</p>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => downloadSingle(index)}
                    disabled={!composites[index]}
                    className={`w-full py-2 px-3 text-sm font-medium border-t border-gray-200 transition-colors ${
                      composites[index]
                        ? 'bg-white text-black hover:bg-blue-50 cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {composites[index] ? '⬇️ Download' : '⏳ Generating...'}
                  </button>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-700 space-y-1">
              <p><span className="font-semibold">💡 Tips:</span></p>
              <p>• Click any scene card's download button for that specific version</p>
              <p>• Use "Download All" to get all 10 versions at once</p>
              <p>• Each image is high-quality PNG format (lossless)</p>
            </div>
          </div>
        )}

      </main>

      {/* Ratio Selection Modal */}
      {showRatioDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded border border-gray-200 max-w-sm w-full p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-6">Download Format</h3>

            <div className="space-y-2">
              {/* Square 1:1 */}
              <button
                onClick={() => handleRatioSelect('1:1')}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-500 transition-colors"
              >
                <p className="font-medium text-sm text-gray-900">1:1 Square</p>
                <p className="text-xs text-gray-600 mt-0.5">1200 × 1200 px</p>
              </button>

              {/* Landscape 16:9 */}
              <button
                onClick={() => handleRatioSelect('16:9')}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-500 transition-colors"
              >
                <p className="font-medium text-sm text-gray-900">16:9 Landscape</p>
                <p className="text-xs text-gray-600 mt-0.5">1920 × 1080 px</p>
              </button>

              {/* Original Ratio */}
              <button
                onClick={() => handleRatioSelect('original')}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-500 transition-colors"
              >
                <p className="font-medium text-sm text-gray-900">Original Ratio</p>
                <p className="text-xs text-gray-600 mt-0.5">Full image, original dimensions</p>
              </button>
            </div>

            <button
              onClick={() => {
                setShowRatioDialog(false);
                setPendingDownload(null);
              }}
              className="w-full mt-6 py-2 px-4 text-gray-700 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-gray-600">
          <p>Professional background removal tool by STK PVT LTD</p>
        </div>
      </footer>
    </div>
  );
}
