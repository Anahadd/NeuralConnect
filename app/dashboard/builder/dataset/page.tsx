'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Upload } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

export default function DatasetUploadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const modelId = searchParams?.get('id')
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length || !modelId) return;

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('modelId', modelId);

    // Immediately update model and redirect
    router.push(`/dashboard/builder?id=${modelId}`);

    // Handle uploads in background
    try {
      const [uploadResponse] = await Promise.all([
        fetch('http://localhost:5000/api/upload-dataset', {
          method: 'POST',
          body: formData,
        }),
        fetch(`/api/models/${modelId}/dataset`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            displayName: file.name,
            hasDataset: true
          }),
        })
      ]);

      if (!uploadResponse.ok) {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [modelId, router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
    },
    multiple: false
  });

  return (
    <div className="min-h-screen bg-[#0A0B1A] flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-12">Upload Dataset</h1>
      
      <div className="w-full max-w-2xl space-y-6">
        <div
          {...getRootProps()}
          className={`
            aspect-[16/9] rounded-lg
            border-2 border-dashed border-purple-500
            flex flex-col items-center justify-center
            transition-colors
            ${isDragActive ? 'bg-purple-500/10' : 'bg-[#1A1B2E]'}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-xl text-white mb-2">Drag & Drop Your Dataset</p>
          <p className="text-sm text-gray-400">or click to select files</p>
        </div>
      </div>
    </div>
  )
}

