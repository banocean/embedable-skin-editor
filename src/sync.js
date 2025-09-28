const setToolSize = (size) => window.editor.toolConfig.set("size", size)
const disableEditing = () => setToolSize(0)
const setSkinType = (model) => window.editor.setVariant(model)
const addLayerFromImageURL = (dataURL) => {
    window.editor.addLayerFromImageURL(dataURL)
}

const clearHistory = () => {
    window.editor.history.undoStack = []
    window.editor.history.redoStack = []
}

const clearLayers = () => {
    const layersCount = window.editor.layers.layers.length
    for (let i = 0; i < layersCount; i++) {
        window.editor.removeLayer()
    }
}

const setGridVisible = (visible) => {
    window.editor.setBaseGridVisible(visible)
    window.editor.setOverlayGridVisible(visible)
}

const setOverlayVisible = (isVisible) => window.editor.setOverlayVisible(isVisible)

window.addEventListener("message", (event) => {
    if (event.data?.mode === "showcase") {
        disableEditing()
        setSkinType(event.data.model)
        clearLayers()
        addLayerFromImageURL(event.data.data)
        clearHistory()
    } else if (event.data?.action === "UpdateBodyParts") {
        window.editor.setPartVisible("head", event.data.head)
        window.editor.setPartVisible("arm_left", event.data.leftArm)
        window.editor.setPartVisible("arm_right", event.data.rightArm)
        window.editor.setPartVisible("torso", event.data.torso)
        window.editor.setPartVisible("leg_left", event.data.leftLeg)
        window.editor.setPartVisible("leg_right", event.data.rightLeg)
    } else if (event.data?.action === "SetOverlayVisible") {
        setOverlayVisible(event.data.visible)
    }
});
