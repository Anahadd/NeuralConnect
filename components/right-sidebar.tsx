"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useBuilderStore } from "@/lib/store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChatMessage {
 type: string;
 content: string;
}

export function RightSidebar() {
 const { nodes, updateNode, selectedNode } = useBuilderStore()
 const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
 const [inputValue, setInputValue] = useState("")
 const [generatedCode, setGeneratedCode] = useState("")

 const chatBoxRef = useRef<HTMLDivElement>(null)

 useEffect(() => {
   if (chatBoxRef.current) {
     chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
   }
 }, [chatMessages])

 const handleNewMessage = async (e: React.KeyboardEvent<HTMLInputElement>) => {
   if (e.key === "Enter" && inputValue.trim() !== "") {
     const newMessage: ChatMessage = { type: "user", content: inputValue }
     setChatMessages(prev => [...prev, newMessage])
     setInputValue("")

     try {
       const searchParams = new URLSearchParams(window.location.search)
       const modelId = searchParams.get('id')

       const response = await fetch("http://localhost:5000/api/explain", {
         method: "POST",
         headers: { 
           "Content-Type": "application/json",
           "Accept": "application/json"
         },
         body: JSON.stringify({
           message: inputValue.trim(),
           nodes: nodes,
           modelId: modelId
         }),
       })

       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`)
       }

       const data = await response.json()
       console.log('Response data:', data)

       if (data.content) {
         const formattedContent = data.content.replace(/\|(\w+)\|/g, (match: string, name: string) => 
           `<span class="bg-blue-600 px-1 rounded">${name}</span>`
         )
         setChatMessages(prev => [...prev, { type: "api", content: formattedContent }])
       } else {
         throw new Error('Invalid response format')
       }
     } catch (error) {
       console.error('Error:', error)
       setChatMessages(prev => [...prev, { 
         type: "api", 
         content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`
       }])
     }
   }
 }

 const renderConfigInput = (key: string, value: any) => {
   if (typeof value === "number") {
     return (
       <Input
         type="number"
         id={key}
         value={value}
         onChange={(e) => handleConfigChange(key, parseFloat(e.target.value))}
         className="bg-gray-800 border-gray-700 text-white"
       />
     )
   }

   if (typeof value === "string" && ["relu", "sigmoid", "tanh"].includes(value)) {
     return (
       <Select onValueChange={(value) => handleConfigChange(key, value)}>
         <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
           <SelectValue placeholder={value} />
         </SelectTrigger>
         <SelectContent>
           <SelectItem value="relu">ReLU</SelectItem>
           <SelectItem value="sigmoid">Sigmoid</SelectItem>
           <SelectItem value="tanh">Tanh</SelectItem>
         </SelectContent>
       </Select>
     )
   }

   return (
     <Input
       id={key}
       value={value}
       onChange={(e) => handleConfigChange(key, e.target.value)}
       className="bg-gray-800 border-gray-700 text-white"
     />
   )
 }

 const handleConfigChange = (key: string, value: string | number) => {
   if (selectedNode) {
     updateNode(selectedNode, {
       data: {
         ...selectedLayerConfig,
         [key]: value,
       },
     })
   }
 }

 const selectedLayerConfig = selectedNode ? nodes.find(node => node.id === selectedNode)?.data : null

 return (
   <div className="w-64 border-l border-gray-800 p-4 flex flex-col h-full bg-[#1A1A1A] text-white">
     <h2 className="font-bold text-lg mb-4">Layer Properties</h2>
     {selectedLayerConfig ? (
       <Accordion type="single" collapsible className="w-full">
         <AccordionItem value="item-1" className="border-b-gray-800">
           <AccordionTrigger className="hover:bg-gray-800">Configuration</AccordionTrigger>
           <AccordionContent>
             <div className="space-y-4">
               {Object.entries(selectedLayerConfig).map(([key, value]) => (
                 <div key={key}>
                   <Label htmlFor={key}>{key}</Label>
                   {renderConfigInput(key, value)}
                 </div>
               ))}
             </div>
           </AccordionContent>
         </AccordionItem>
         <AccordionItem value="item-2" className="border-b-gray-800">
           <AccordionTrigger className="hover:bg-gray-800">Validation</AccordionTrigger>
           <AccordionContent>
             <p className="text-green-500">No validation errors</p>
           </AccordionContent>
         </AccordionItem>
       </Accordion>
     ) : (
       <p className="text-gray-400">Select a layer to view its properties</p>
     )}

     <div className="mt-auto">
       <Dialog>
         <DialogTrigger asChild>
           <Button variant="outline" className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
             Quick Help
           </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[800px] h-[80vh] bg-gray-900 border-gray-700 overflow-hidden flex flex-col">
           <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-6">
             {chatMessages.map((message, index) => (
               <div key={index} className={`mb-4 flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                 <div
                   className={`inline-block p-3 rounded-lg max-w-[80%] content-text ${
                     message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-200"
                   }`}
                   dangerouslySetInnerHTML={{ __html: message.content }}
                 />
               </div>
             ))}
           </div>
           <div className="p-4 border-t border-gray-800">
             <Input
               className="w-full h-12 text-lg bg-gray-800 border-gray-700 text-white"
               placeholder="Ask anything about your Neural Network"
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               onKeyDown={handleNewMessage}
             />
           </div>
         </DialogContent>
       </Dialog>
     </div>
   </div>
 )
}
