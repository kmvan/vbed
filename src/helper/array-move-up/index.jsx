export default function moveUp(arr, target, by = 1) {
    const targetIndex = arr.indexOf(target)
    let newPos = targetIndex - by
    
    if (targetIndex === -1) {
        throw new Error("Element not found in array")
    }
    
    if (newPos < 0) {
        newPos = 0
    }
        
    arr.splice(targetIndex, 1)
    arr.splice(newPos, 0, target)
    
    return arr
}