'use client';

import { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Product } from './HomePage';

interface FileUploadProps {
  onProductsExtracted: (products: Product[]) => void;
}

export default function FileUpload({ onProductsExtracted }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

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
          data: base64 
        }),
      });

      if (response.ok) {
        const extractedProducts = await response.json();
        onProductsExtracted(extractedProducts);
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

  const processText = async () => {
    if (!textInput.trim()) return;
    
    setIsProcessing(true);
    try {
      const nlpUrl = process.env.NEXT_PUBLIC_NLP_SERVICE_URL || 'http://localhost:4001';
      const response = await fetch(`${nlpUrl}/api/extract-products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: 'text', 
          data: textInput 
        }),
      });

      if (response.ok) {
        const extractedProducts = await response.json();
        onProductsExtracted(extractedProducts);
        setTextInput('');
      } else {
        throw new Error('Failed to process text');
      }
    } catch (error) {
      console.error('Error processing text:', error);
      alert('Error processing text. Please try again.');
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
        processFile(acceptedFiles[0]);
      }
    }
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Error accessing camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
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
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div className="card-walmart p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-walmart p-8 text-center cursor-pointer transition-all duration-300 ${
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
      </div>

      {/* Camera Section */}
      <div className="card-walmart p-6">
        <div className="flex items-center space-x-2 mb-4">
          <svg className="w-5 h-5 text-walmart-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89L8.91 4.89A2 2 0 0110.574 4h2.852a2 2 0 011.664.89L15.91 6.11a2 2 0 001.664.89H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="font-semibold text-walmart-darkBlue">Camera Capture</h3>
        </div>
        {!isCameraOpen ? (
          <button
            onClick={startCamera}
            className="btn-walmart-secondary"
          >
            📸 Open Camera
          </button>
        ) : (
          <div className="space-y-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-md rounded-walmart border-2 border-walmart-mediumGray"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-3">
              <button
                onClick={capturePhoto}
                className="btn-walmart-primary"
              >
                📸 Capture Photo
              </button>
              <button
                onClick={stopCamera}
                className="bg-walmart-darkGray hover:bg-gray-600 text-white py-2 px-4 rounded-walmart transition-colors"
              >
                ✕ Close Camera
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Text Input */}
      <div className="card-walmart p-6">
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
          className="input-walmart w-full h-32 resize-none"
        />
        <button
          onClick={processText}
          disabled={!textInput.trim() || isProcessing}
          className="btn-walmart-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            '🔍 Process Text'
          )}
        </button>
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
