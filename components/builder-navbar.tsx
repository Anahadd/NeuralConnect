"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Play, 
  Check, 
  X, 
  LayoutDashboard, 
  Trash2, 
  CheckCircle,
  TrashIcon 
} from "lucide-react"
import Link from "next/link"
import "./custom-button.css"
import { useBuilderStore } from "@/lib/store"
import { toast } from "@/components/ui/toast"
import { saveModel, updateModel, generateCode } from "@/lib/api"
import { useSearchParams, useRouter } from 'next/navigation'

export function BuilderNavbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const modelId = searchParams?.get('id')
  const [modelName, setModelName] = useState("Untitled Model")
  const [modelType, setModelType] = useState("CNN")
  const { nodes, edges, currentModel, updateCurrentModel } = useBuilderStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const saveNodesToDatabase = useBuilderStore((state) => state.saveNodesToDatabase)
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isDeletingAll, setIsDeletingAll] = useState(false)

  useEffect(() => {
    const fetchModelData = async () => {
      if (!modelId) return;
      
      try {
        // Fetch model name
        const nameResponse = await fetch(`http://localhost:5000/api/models/${modelId}/name`);
        if (nameResponse.ok) {
          const nameData = await nameResponse.json();
          setModelName(nameData.name || "Untitled Model");
          setEditedName(nameData.name || "Untitled Model");
        }

        // Fetch dataset info
        const datasetResponse = await fetch(`http://localhost:5000/api/models/${modelId}/dataset`);
        if (datasetResponse.ok) {
          const datasetData = await datasetResponse.json();
          console.log('Dataset Information:', {
            hasDataset: datasetData.hasDataset,
            dataset: datasetData.dataset,
            modelId: modelId
          });
        }
      } catch (error) {
        console.error('Error fetching model data:', error);
      }
    };

    fetchModelData();
  }, [modelId]);

  const handleBack = () => {
    router.back();
  };

  const handleForward = () => {
    router.forward();
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditedName(modelName);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedName(modelName);
  };

  const saveModelName = async () => {
    if (!modelId || editedName === modelName) {
      setIsEditing(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/models/${modelId}/name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editedName }),
      });

      if (response.ok) {
        setModelName(editedName);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating model name:', error);
    }
  };

  const handleSave = async () => {
    if (!modelId) return;
    
    setIsSaving(true);
    try {
      await saveNodesToDatabase(modelId)
      toast({
        title: "Success",
        description: "Model layers saved to database",
      });
    } catch (error) {
      console.error('Error saving nodes:', error);
      toast({
        title: "Error",
        description: "Failed to save model layers to database",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleValidateAndGenerate = async () => {
    setIsGenerating(true)
    try {
      if (!currentModel || !currentModel._id) {
        throw new Error("No current model selected")
      }
      const result = await generateCode(String(currentModel._id))
      console.log("Generated Code:", result.code)
      toast({
        title: "Code Generated Successfully",
        description: "Your neural network code has been generated.",
      })
    } catch (error) {
      console.error("Error generating model:", error)
      toast({
        title: "Error",
        description: "An error occurred while generating the model. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleValidateArchitecture = async () => {
    if (!modelId) return
    
    setIsValidating(true)
    try {
      const response = await fetch(`http://localhost:5000/api/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodes: nodes,
          edges: edges,
          modelId: modelId
        }),
      })

      const data = await response.json()
      
      setIsValid(data.isValid)
      
      toast({
        title: data.isValid ? "Valid Architecture" : "Invalid Architecture",
        description: data.response,
        variant: data.isValid ? "default" : "destructive",
      })
    } catch (error) {
      console.error('Error validating architecture:', error)
      toast({
        title: "Error",
        description: "Failed to validate model architecture",
        variant: "destructive",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const fetchNodes = async () => {
    if (!modelId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/models/${modelId}/nodes`);
      if (response.ok) {
        const data = await response.json();
        useBuilderStore.getState().setNodes(data.nodes || []);
      }
    } catch (error) {
      console.error('Error fetching nodes:', error);
    }
  };

  const handleDeleteAllNodes = async () => {
    if (!modelId) return;
    
    setIsDeletingAll(true);
    try {
      const response = await fetch(`http://localhost:5000/api/models/${modelId}/nodes/all`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete all nodes');
      }
      
      // Fetch updated nodes from backend
      await fetchNodes();
      
      toast({
        title: "Success",
        description: "All nodes deleted successfully",
      });
      
    } catch (error) {
      console.error('Error deleting all nodes:', error);
      toast({
        title: "Error",
        description: "Failed to delete all nodes",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <nav className="h-16 border-b border-gray-800 bg-[#1A1A1A] flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-gray-800 flex items-center gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-gray-800"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-gray-800"
            onClick={handleForward}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <div className="flex items-center space-x-1">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="h-8 w-48 bg-gray-800"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-gray-800"
                onClick={saveModelName}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-gray-800"
                onClick={cancelEditing}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={startEditing}
                className="text-white hover:text-gray-300 text-sm font-medium"
              >
                {modelName}
              </button>
              <span className="text-gray-400 px-2 py-1 rounded-md bg-gray-800/50 text-xs font-medium">
                {modelType}
              </span>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-800"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`text-white hover:bg-gray-800 ${
            isValid === true ? 'text-green-500' : 
            isValid === false ? 'text-red-500' : ''
          }`}
          onClick={handleValidateArchitecture}
          disabled={isValidating}
        >
          <CheckCircle className={`h-4 w-4 ${
            isValidating ? 'animate-spin' : ''
          }`} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-red-600"
          onClick={handleDeleteAllNodes}
          disabled={isDeletingAll}
        >
          <TrashIcon className={`h-4 w-4 ${
            isDeletingAll ? 'animate-pulse' : ''
          }`} />
        </Button>
      </div>
      <Button 
        className="button-86" 
        onClick={handleValidateAndGenerate} 
        disabled={isGenerating}
      >
        {isGenerating ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            <strong>Train Model</strong>
          </>
        )}
      </Button>
    </nav>
  )
}

