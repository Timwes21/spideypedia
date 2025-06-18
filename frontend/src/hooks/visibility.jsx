import { useState, useCallback } from "react"

export default function useVisibility(){
    const [visibility, setIssuesVisibility] = useState({})
        
    
        const toggleVisibility = useCallback((year) =>{
            setIssuesVisibility((prev)=>({
                ...prev,
                [year]: !prev[year]
            }))
        })

        return [ visibility, toggleVisibility ];
}