import { Trash2 } from "lucide-react"
import { Button } from "./ui/button"

interface NodeProps {
  id: string
  type: string
  position: { x: number; y: number }
  data: any
  modelId?: string
}

export function Node({ id, type, data, modelId }: NodeProps) {
  const handleDelete = async () => {
    if (!modelId) return
    
    try {
      const response = await fetch(`http://localhost:5000/api/models/${modelId}/nodes`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodeId: id }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete node')
      }
      
      // The node will be removed from the view by React Flow automatically
      // when the parent component re-renders with the updated nodes
      
    } catch (error) {
      console.error('Error deleting node:', error)
    }
  }

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-4 min-w-[150px]">
      <div className="flex items-center justify-between">
        <span className="font-medium">{type}</span>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-6 w-6 absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full"
          onClick={(e) => {
            e.stopPropagation() // Prevent node selection when clicking delete
            handleDelete()
          }}
        >
          <Trash2 className="h-4 w-4 text-white" />
        </Button>
      </div>
      {/* Rest of your node content */}
    </div>
  )
} 