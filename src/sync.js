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

const emptyDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAhElEQVR4Xu3VAREAMAwCseLfdIV85qAcGbv4W/z+E4AGxBNAIF4AnyACCMQTQCBeACuAAALxBBCIF8AKIIBAPAEE4gWwAgggEE8AgXgBrAACCMQTQCBeACuAAALxBBCIF8AKIIBAPAEE4gWwAgggEE8AgXgBrAACCMQTQCBeACuAQJ3AA2jYAEGs/2CBAAAAAElFTkSuQmCC"
const emptyImage = await urlToImage(emptyDataURL)

const replaceLayerTexture = async (layer, img) => {
    const texture = new THREE.Texture(img)

    layer.flush()
    layer.replaceTexture(texture)
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

window.currentMode = ""
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

const selectTopLayer = () => window.editor.layers.selectLayer(window.editor.layers.layers.length - 1)
const setWorkableLayers = (n) => {
    console.log(n, window.editor.layers.length)
    for (let i = window.editor.layers.layers.length - 1; i < n; i++) {
        window.editor.layers.addBlankLayer()
    }
    selectTopLayer()
}

const clearLayers = () => {
    while (window.editor.layers.layers[1]) {
        window.editor.layers.removeLayer(window.editor.layers.layers[1])
    }
}

const getLayerDataURL = (layer) => {
    const canvas = document.createElement("canvas")
    canvas.width = 64
    canvas.height = 64

    const ctx = canvas.getContext("2d")
    ctx.drawImage(layer.texture.source.data, 0, 0)

    return canvas.toDataURL()
}

const getLayerFromIndex = (i) => window.editor.layers.getLayerAtIndex(i)
const getFirstLayer = () => getLayerFromIndex(1)

const setLayerOpacity = (layer, opacity) => layer.compositor.applyFilters([new window.FILTERS[4](opacity)])
let currentOpacity = 50

let currentMaskLayer = null
let currentMaskBackgroundLayer = null
let currentEditAllLayer = null

let lastUpdate = 0
let lastId = 0

const onMessage = async (event) => {
    if (event.data?.mode === "Showcase") {
        if (window.currentMode !== "Showcase") {
            window.currentMode = "Showcase"
            lastId = null
            clearLayers()
            setWorkableLayers(2)
        }

        const timestamp = event.data.timestamp ?? new Date()
        if (lastUpdate > timestamp) return
        const image = await urlToImage(event.data.data)
        if (lastUpdate > timestamp) return

        setSkinType(event.data.model)
        await replaceLayerTexture(getFirstLayer(), image)

        const maskLayer = getLayerFromIndex(2)
        if (event.data.maskData) {
            const maskImage = await urlToImage(event.data.maskData)
            await replaceLayerTexture(maskLayer, maskImage)
            setLayerOpacity(maskLayer, currentOpacity)
        } else {
            await replaceLayerTexture(maskLayer, emptyImage)
        }

        clearHistory()
        setCurrentTool()
        setCurrentToolSize()
    } else if (event.data?.mode === "EditAll") {
        if (window.currentMode !== "EditAll" || lastId !== event.data.id) {
            clearLayers()
            setWorkableLayers(1)

            window.currentMode = "EditAll"
            lastId = event.data.id
            const layer = getFirstLayer()
            currentEditAllLayer = layer

            await replaceLayerTexture(layer, await urlToImage(event.data.data))

            layer.addEventListener("layer-update", () => {
                const dataURL = getLayerDataURL(layer)
                if (!dataURL) return

                window.top.postMessage({
                    action: "UpdateSkin",
                    skinURL: dataURL,
                    id: event.data.id,
                    timestamp: Date.now()
                }, "*")
            })
        } else {
            await replaceLayerTexture(currentEditAllLayer, await urlToImage(event.data.data))
        }

        setSkinType(event.data.model)
        clearHistory()
        setCurrentTool()
        setCurrentColor()
        setCurrentToolSize()
        setCurrentCamo()
    } else if (event.data?.mode === "EditMask") {
        if (window.currentMode !== "EditMask" || lastId !== event.data.id) {
            clearLayers()
            setWorkableLayers(2)

            lastId = event.data.id

            const backgroundLayer = getFirstLayer()
            currentMaskBackgroundLayer = { layer: backgroundLayer, id: event.data.id }

            const maskLayer = window.editor.layers.getLayerAtIndex(2)
            setLayerOpacity(maskLayer, currentOpacity)
            currentMaskLayer = { layer: maskLayer, id: event.data.id }

            await replaceLayerTexture(maskLayer, await urlToImage(event.data.data))
            if (event.data.backgroundData) {
                await replaceLayerTexture(backgroundLayer, await urlToImage(event.data.backgroundData))
            }

            maskLayer.addEventListener("layer-update", () => {
                const dataURL = getLayerDataURL(maskLayer)
                if (!dataURL) return

                window.top.postMessage({
                    action: "UpdateMask",
                    skinURL: dataURL,
                    id: event.data.id,
                    timestamp: Date.now()
                }, "*")
            })

            window.currentMode = "EditMask"
            setCurrentTool()
            setCurrentColor()
            setCurrentToolSize()
            setCurrentCamo()
            clearHistory()
        } else {
            if (currentMaskBackgroundLayer.id === event.data.id) {
                await replaceLayerTexture(currentMaskLayer.layer, await urlToImage(event.data.data))
            }

            if (currentMaskBackgroundLayer.id === event.data.id && event.data.backgroundData) {
                await replaceLayerTexture(currentMaskBackgroundLayer.layer, await urlToImage(event.data.backgroundData))
            }
        }

        setSkinType(event.data.model)
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
    } else if (event.data?.action === "SetMaskOpacity") {
        currentOpacity = event.data.value
        if (currentMode === "Showcase" || currentMode === "EditMask") {
            setLayerOpacity(getLayerFromIndex(2), currentOpacity)
        }
    } else if (event.data?.action === "ResetCamera") resetCamera()
}

window.addEventListener("ready", () => {
    window.addEventListener("message", onMessage)
    window.top.postMessage({ action: "Ready" }, "*")
})
