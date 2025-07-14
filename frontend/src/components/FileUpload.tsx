'use client';

import { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Product } from './HomePage';

interface FileUploadProps {
  onProductsExtracted: (products: Product[]) => void;
  textInput: string;
  setTextInput: (text: string) => void;
}

export default function FileUpload({ onProductsExtracted, textInput, setTextInput }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const base64 = await fileToBase64(file);
      const nlpUrl = process.env.NEXT_PUBLIC_NLP_SERVICE_URL || 'http://localhost:4001';
      const response = await fetch(`${nlpUrl}/api/extract-products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: 'image', 
          content: base64 
        }),
      });

      if (response.ok) {
        const extractedProducts = await response.json();
        onProductsExtracted(extractedProducts);
        // Clear preview after successful processing
        setPreview(null);
        setSelectedFile(null);
      } else {
        throw new Error('Failed to process image');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
      }
    }
  });

  // Clear preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play(); // Explicitly call play
      }
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Error accessing camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      console.log('Capturing photo from video stream');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          processFile(file);
        }
      }, 'image/jpeg');
      
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      console.log('Stopping camera stream');
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleRetake = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div className="card-walmart rounded-4xl border-1 p-3">
        {preview ? (
          // Image Preview with Actions
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border-2 border-walmart-blue">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-64 object-contain bg-gray-50"
              />
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="btn-walmart-primary px-6 py-2 rounded-lg flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit
                  </>
                )}
              </button>
              <button
                onClick={handleRetake}
                className="btn-walmart-secondary px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retake
              </button>
            </div>
          </div>
        ) : (
          // Original Upload UI
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-walmart-blue bg-walmart-lightBlue scale-105'
                : 'border-walmart-mediumGray hover:border-walmart-blue hover:bg-walmart-lightBlue'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-walmart-lightBlue rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-walmart-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              {isDragActive ? (
                <p className="text-walmart-blue font-semibold text-lg">Drop the image here...</p>
              ) : (
                <div>
                  <p className="text-walmart-darkBlue font-semibold text-lg mb-2">Drag & drop an image here, or click to select</p>
                  <p className="text-walmart-darkGray text-sm">Supports: PNG, JPG, JPEG, GIF (Max 10MB)</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Camera Section */}
      <div className="card-walmart rounded-4xl p-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <svg className="w-5 h-5 text-walmart-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89L8.91 4.89A2 2 0 0110.574 4h2.852a2 2 0 011.664.89L15.91 6.11a2 2 0 001.664.89H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="font-semibold text-walmart-darkBlue">Camera Capture</h3>
        </div>
        {!isCameraOpen ? (
          <button
            onClick={startCamera}
            className="btn-walmart-secondary w-full py-3 rounded-xl cursor-pointer justify-center flex items-center gap-2"
          >
            <span>📸</span> Open Camera
          </button>
        ) : (
          <div className="space-y-4">
            <div className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden border-2 border-walmart-blue">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted // Add muted attribute to ensure autoplay works
                className="w-full h-[300px] object-cover bg-black"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={capturePhoto}
                className="btn-walmart-primary py-2 px-6 rounded-lg flex items-center gap-2"
              >
                <span>📸</span> Capture Photo
              </button>
              <button
                onClick={stopCamera}
                className="btn-walmart-secondary py-2 px-6 rounded-lg flex items-center gap-2"
              >
                <span>✕</span> Close Camera
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Text Input */}
      <div className="card-walmart rounded-4xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <svg className="w-5 h-5 text-walmart-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <h3 className="font-semibold text-walmart-darkBlue">Text Input</h3>
        </div>
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter your shopping list or product descriptions...\n\nExample:\n- 2 gallons of milk\n- 1 loaf of bread\n- toothpaste\n- bananas"
          className="input-walmart rounded-2xl w-full h-32 resize-none"
        />
      </div>

      {isProcessing && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-walmart-lightBlue border-t-walmart-blue"></div>
          <p className="mt-4 text-walmart-darkBlue font-semibold">Processing your request...</p>
        </div>
      )}
    </div>
  );
}
