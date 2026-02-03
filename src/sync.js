import * as THREE from "three"
import Color from "color";

const resetCamera = () => window.editor.resetCamera()
const setToolSize = (size) => window.editor.toolConfig.set("size", size)
const disableEditing = () => setToolSize(0)
const setSkinType = (model) => window.editor.setVariant(model)
const setColor = (config) => window.editor.toolConfig.set("color", config)

const urlToImage = (url) => {
    const img = new Image()
    let resolve = null
    const promise = new Promise((r) => resolve = r)

    img.onload = () => resolve(img)
    img.src = url

    return promise
}

const replaceSkinTexture = async (img) => {
    const currentLayer = window.editor.layers.getSelectedLayer()
    const texture = new THREE.Texture(img)

    currentLayer.flush()
    currentLayer.replaceTexture(texture)
    window.editor.layers.renderTexture()
}

const clearHistory = () => window.editor.history.wipe()

const setGridVisible = (visible) => {
    window.editor.setBaseGridVisible(visible)
    window.editor.setOverlayGridVisible(visible)
}

const setOverlayVisible = (isVisible) => window.editor.setOverlayVisible(isVisible)

const setTool = (tool) => window.editor.selectTool(window.editor.tools[tool])

const Tools = {
    Pen: 0,
    Eraser: 1,
    Bucket: 2,
    Shade: 3
}

const MaskTools = {
    PenAdd: 0,
    PenRemove: 1,
    BucketAdd: 2,
    BucketRemove: 3
}

const maskAddColor = new Color([255, 0, 0]).alpha(1)
const maskRemoveColor = new Color([0, 0, 255]).alpha(1)

let currentTool = Tools.Pen
let currentMaskTool = MaskTools.PenAdd
let currentMode = "Showcase"
let currentColor = new Color([255, 255, 255]).alpha(1)

const setCurrentColor = () => {
    console.log("[SET COLOR RUN]")
    if (currentMode === "EditMask") {
        console.log(currentMaskTool)
        setColor([MaskTools.PenAdd, MaskTools.BucketAdd].includes(currentMaskTool) ? maskAddColor : maskRemoveColor)
    } else {
        setColor(currentColor)
    }
}

const maskToolToTool = (maskTool) => [Tools.Pen, Tools.Pen, Tools.Bucket, Tools.Bucket][maskTool]
const setCurrentTool = () => {
    if (currentMode === "Showcase") {
        setTool(Tools.Pen)
        disableEditing()
    } else if (currentMode === "EditMask") {
        setTool(maskToolToTool(currentMaskTool))
    } else {
        setTool(currentTool)
    }
}

let lastUpdate = 0
window.addEventListener("message", async (event) => {
    if (event.data?.mode === "Showcase") {
        const timestamp = event.data.timestamp ?? new Date()
        if (lastUpdate > timestamp) return
        const image = await urlToImage(event.data.data)
        if (lastUpdate > timestamp) return

        currentMode = "Showcase"
        setSkinType(event.data.model)
        await replaceSkinTexture(image)

        clearHistory()
        setCurrentTool()
    } else if (event.data?.mode === "EditAll") {
        setSkinType(event.data.model)
        await replaceSkinTexture(await urlToImage(event.data.data))
        clearHistory()

        currentMode = "EditAll"
        setCurrentTool()
        setCurrentColor()
    } else if (event.data?.mode === "EditMask") {
        setSkinType(event.data.model)
        await replaceSkinTexture(await urlToImage(event.data.data))
        clearHistory()

        currentMode = "EditMask"
        setCurrentTool()
        setCurrentColor()
    } else if (event.data?.action === "UpdateBodyParts") {
        window.editor.setPartVisible("head", event.data.head)
        window.editor.setPartVisible("arm_left", event.data.leftArm)
        window.editor.setPartVisible("arm_right", event.data.rightArm)
        window.editor.setPartVisible("torso", event.data.torso)
        window.editor.setPartVisible("leg_left", event.data.leftLeg)
        window.editor.setPartVisible("leg_right", event.data.rightLeg)
    } else if (event.data?.action === "SetOverlayVisible") {
        setOverlayVisible(event.data.visible)
    } else if (event.data?.action === "SetTool") {
        currentTool = event.data.tool
        setCurrentTool()
        setCurrentColor()
    } else if (event.data?.action === "SetMaskTool") {
        currentMaskTool = event.data.tool
        setCurrentTool()
        setCurrentColor()
    } else if (event.data?.action === "UpdateColor") {
        const [r, g, b, a] = event.data.color
        currentColor = new Color([r, g, b]).alpha(a)
        setCurrentColor()
    } else if (event.data?.action === "ResetCamera") resetCamera()
});

const handleChange = async () => {
    if (currentMode !== "EditAll" && currentMode !== "EditMask") return
    const timestamp = Date.now()
    setTimeout(() => {
        window.top.postMessage({
            action: currentMode === "EditAll" ? "UpdateSkin" : "UpdateMask",
            skinURL: window.editor.skinToDataURL(),
            timestamp
        }, "*")
    }, 500)
}

window.addEventListener("ready", () => {
    window.editor.layers.addEventListener("layers-render", handleChange)
    window.addEventListener("update", handleChange)
    window.editor.addEventListener("tool-up", handleChange)

    window.top.postMessage({ action: "Ready" }, "*")
})
