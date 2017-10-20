export default function moveDown(arr, target, offset = 1) {
    const targetIndex = arr.indexOf(target)
    let newPos = targetIndex + offset

    if (targetIndex === -1) {
        throw new Error("Element not found in array")
    }

    if (newPos >= arr.length) {
        newPos = arr.length
    }
    
    arr.splice(targetIndex, 1)
    arr.splice(newPos, 0, target)

    return arr
}
