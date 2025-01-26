"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trash2, Search } from "lucide-react"
import type { Node as ReactFlowNode, Edge as ReactFlowEdge } from 'reactflow'
import { Button } from "@/components/ui/button"
import { styled } from "@stitches/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchModels, deleteModel, saveModel } from "@/lib/api"
import { useBuilderStore } from "@/lib/store"
import { toast } from "@/components/ui/toast"
import * as api from "@/lib/api"

interface ModelData {
  _id: string
  name: string
  type: string
  nodes: ReactFlowNode[]
  edges: ReactFlowEdge[]
  created_at: string
  hasDataset?: boolean
  dataset?: {
    name: string
    size: string
    uploadedAt: string
    filename: string
  }
}

const CheckboxWrapper = styled("div", {
  '& input[type="checkbox"]': {
    visibility: "hidden",
    display: "none",
  },
  "& .toggle": {
    position: "relative",
    display: "block",
    width: "40px",
    height: "20px",
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
    transform: "translate3d(0, 0, 0)",
    "&:before": {
      content: '""',
      position: "relative",
      top: "3px",
      left: "3px",
      width: "34px",
      height: "14px",
      display: "block",
      background: "#9A9999",
      borderRadius: "8px",
      transition: "background 0.2s ease",
    },
    "& span": {
      position: "absolute",
      top: "0",
      left: "0",
      width: "20px",
      height: "20px",
      display: "block",
      background: "white",
      borderRadius: "10px",
      boxShadow: "0 3px 8px rgba(154, 153, 153, 0.5)",
      transition: "all 0.2s ease",
      "&:before": {
        content: '""',
        position: "absolute",
        display: "block",
        margin: "-18px",
        width: "56px",
        height: "56px",
        background: "rgba(79, 46, 220, 0.5)",
        borderRadius: "50%",
        transform: "scale(0)",
        opacity: "1",
        pointerEvents: "none",
      },
    },
  },
  "& input:checked + .toggle": {
    "&:before": {
      background: "#947ADA",
    },
    "& span": {
      background: "#4F2EDC",
      transform: "translateX(20px)",
      transition: "all 0.2s cubic-bezier(0.8, 0.4, 0.3, 1.25), background 0.15s ease",
      boxShadow: "0 3px 8px rgba(79, 46, 220, 0.2)",
      "&:before": {
        transform: "scale(1)",
        opacity: "0",
        transition: "all 0.4s ease",
      },
    },
  },
})

export function ModelsTable() {
  const router = useRouter()
  const [models, setModels] = useState<ModelData[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [newModelName, setNewModelName] = useState("")
  const [newModelType, setNewModelType] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { updateCurrentModel } = useBuilderStore()

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/models');
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      const fetchedModels = await response.json();
      setModels(fetchedModels);
    } catch (error) {
      console.error("Error fetching models:", error);
      toast({
        title: "Error",
        description: "Failed to load models. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleCheckboxChange = (id: string) => {
    setSelectedModels((prev: string[]) => 
      prev.includes(id) ? prev.filter((modelId: string) => modelId !== id) : [...prev, id]
    )
  }

  const handleDeleteSelected = async () => {
    try {
      // Delete each selected model
      for (const id of selectedModels) {
        const response = await fetch(`http://localhost:5000/api/models/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete model ${id}`);
        }
      }

      // Clear selected models
      setSelectedModels([]);
      
      // Refresh the models list
      loadModels();

      // Show success toast
      toast({
        title: "Success",
        description: "Selected models deleted successfully",
      });

    } catch (error) {
      console.error("Error deleting models:", error);
      toast({
        title: "Error",
        description: "Failed to delete selected models. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateModel = async () => {
    if (newModelName && newModelType) {
      try {
        const response = await fetch('http://localhost:5000/api/models', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newModelName,
            type: newModelType,
            nodes: [],
            edges: [],
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create model');
        }

        const newModel = await response.json();
        setIsDialogOpen(false);
        setNewModelName('');
        setNewModelType('');
        loadModels();
        updateCurrentModel(newModel);
        router.push(`/dashboard/builder/dataset?id=${newModel._id}`);
      } catch (error) {
        console.error("Error creating model:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create model. Please try again.",
          variant: "destructive",
        });
      }
    }
  };


  const handleModelClick = (model: ModelData) => {
    updateCurrentModel(model as any)
    router.push(`/dashboard/builder?id=${model._id}`)
  }

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-[#1A1B2E] rounded-lg border border-gray-800">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Your Models</h2>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64 bg-transparent text-white placeholder:text-gray-400 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            {selectedModels.length > 0 && (
              <Button onClick={handleDeleteSelected} variant="destructive" className="flex items-center">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Create Model
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Model</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newModelName}
                      onChange={(e) => setNewModelName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select onValueChange={setNewModelType}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select model type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CNN">Convolutional Neural Network</SelectItem>
                        <SelectItem value="RNN">Recurrent Neural Network</SelectItem>
                        <SelectItem value="Transformer">Transformer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateModel}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="p-4"></th>
                <th className="p-4">Name</th>
                <th className="p-4">Created</th>
                <th className="p-4">Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredModels.map((model: ModelData) => (
                <tr key={model._id} className="border-b border-gray-800">
                  <td className="p-4">
                    <CheckboxWrapper className="checkbox-wrapper-3">
                      <input
                        type="checkbox"
                        id={`cbx-${model._id}`}
                        checked={selectedModels.includes(model._id)}
                        onChange={() => handleCheckboxChange(model._id)}
                      />
                      <label htmlFor={`cbx-${model._id}`} className="toggle">
                        <span></span>
                      </label>
                    </CheckboxWrapper>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleModelClick(model)}
                      className="flex items-center gap-3 hover:text-purple-400"
                    >
                      <div
                        className={`bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-medium`}
                      >
                        {model.name[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{model.name}</span>
                      </div>
                    </button>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(model.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-gray-400">{model.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

