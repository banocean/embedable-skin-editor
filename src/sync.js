import * as THREE from "three"
import Color from "color";

const resetCamera = () => window.editor.resetCamera()
const setToolSize = (size) => window.editor.toolConfig.set("size", size)
const setToolShape = (shape) => window.editor.toolConfig.set("shape", shape)
const setCamo = (value) => window.editor.toolConfig.set("camo", value)
const setMirrorMode = (value) => window.editor.toolConfig.set("mirror", value)
const disableEditing = () => setToolSize(0)
const setSkinType = (model) => window.editor.setVariant(model)
const setColor = (config) => window.editor.toolConfig.set("color", config)
const setShadeStyle = (value) => window.editor.toolConfig.set("shadeStyle", value)
const setFillStyle = (value) => window.editor.toolConfig.set("fillStyle", value)

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
    Move: 0,
    Pen: 1,
    Eraser: 2,
    Bucket: 3,
    Shade: 4
}

const MaskTools = {
    PenAdd: 0,
    PenRemove: 1,
    BucketAdd: 2,
    BucketRemove: 3
}

const maskAddColor = new Color([255, 0, 0]).alpha(1)
const maskRemoveColor = new Color([0, 0, 255]).alpha(1)

window.currentMode = "Showcase"
let currentTool = Tools.Pen
let currentMaskTool = MaskTools.PenAdd
let currentColor = new Color([255, 255, 255]).alpha(1)
let currentToolSize = 1
let currentCamo = false

const setCurrentColor = () => {
    if (window.currentMode === "EditMask") {
        setColor([MaskTools.PenAdd, MaskTools.BucketAdd].includes(currentMaskTool) ? maskAddColor : maskRemoveColor)
    } else {
        setColor(currentColor)
    }
}

const setCurrentCamo = () => window.currentMode === "EditAll" ? setCamo(currentCamo) : setCamo(false)
const maskToolToTool = (maskTool) => [Tools.Pen, Tools.Pen, Tools.Bucket, Tools.Bucket][maskTool]

const setCurrentTool = () => {
    if (window.currentMode === "Showcase") {
        setTool(Tools.Pen)
    } else if (window.currentMode === "EditMask") {
        setTool(maskToolToTool(currentMaskTool))
    } else {
        setTool(currentTool)
    }
}

const setCurrentToolSize = () => window.currentMode === "Showcase" ? disableEditing() : setToolSize(currentToolSize)

let lastUpdate = 0
window.addEventListener("message", async (event) => {
    if (event.data?.mode === "Showcase") {
        const timestamp = event.data.timestamp ?? new Date()
        if (lastUpdate > timestamp) return
        const image = await urlToImage(event.data.data)
        if (lastUpdate > timestamp) return

        window.currentMode = "Showcase"
        setSkinType(event.data.model)
        await replaceSkinTexture(image)

        clearHistory()
        setCurrentTool()
        setCurrentToolSize()
    } else if (event.data?.mode === "EditAll") {
        setSkinType(event.data.model)
        await replaceSkinTexture(await urlToImage(event.data.data))
        clearHistory()

        window.currentMode = "EditAll"
        setCurrentTool()
        setCurrentColor()
        setCurrentToolSize()
        setCurrentCamo()
    } else if (event.data?.mode === "EditMask") {
        setSkinType(event.data.model)
        await replaceSkinTexture(await urlToImage(event.data.data))
        clearHistory()

        window.currentMode = "EditMask"
        setCurrentTool()
        setCurrentColor()
        setCurrentToolSize()
        setCurrentCamo()
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
        setCurrentToolSize()
    } else if (event.data?.action === "SetMaskTool") {
        currentMaskTool = event.data.tool
        setCurrentTool()
        setCurrentColor()
        setCurrentToolSize()
    } else if (event.data?.action === "UpdateColor") {
        const [r, g, b, a] = event.data.color
        currentColor = new Color([r, g, b]).alpha(a)
        setCurrentColor()
    } else if (event.data.action === "SetToolSize") {
        currentToolSize = event.data.size
        setCurrentToolSize()
    } else if (event.data?.action === "SetToolShape") {
        setToolShape(event.data.shape)
    } else if (event.data?.action === "SetCamo") {
        currentCamo = event.data.value
        setCurrentCamo()
    } else if (event.data?.action === "SetMirrorMode") {
        setMirrorMode(event.data.value)
    } else if (event.data?.action === "SetShadeStyle") {
        setShadeStyle(event.data.value)
    } else if (event.data?.action === "SetFillStyle") {
        setFillStyle(event.data.value)
    } else if (event.data?.action === "ResetCamera") resetCamera()
});

const handleChange = async () => {
    if (window.currentMode !== "EditAll" && window.currentMode !== "EditMask") return
    const timestamp = Date.now()
    setTimeout(() => {
        window.top.postMessage({
            action: window.currentMode === "EditAll" ? "UpdateSkin" : "UpdateMask",
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
