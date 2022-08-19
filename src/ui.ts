import './ui.css'
const JSZip = require('jszip')

window.onmessage = async (event) => {
    const message = event.data.pluginMessage

    switch (message?.type) {
        case 'image': {
            renderExportPreview(message.name, message.bytes)
            break
        }
        case 'export': {
            const dir = message.name
            for (const item of message.items) {
                saveAsZip(dir, item)
            }
            break
        }
    }
}

function saveAsZip(dir: string, assets: { path: string; data: Uint8Array }[]) {
    const zip = new JSZip()
    for (const asset of assets) {
        zip.file(asset.path, asset.data)
    }
    zip.generateAsync({type: 'blob'}).then((content: Blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);;
        link.download = 'assets_' + dir + '.zip';
        link.click();
    });
}

function renderExportPreview(name: string, bytes: Uint8Array) {
    const root = document.getElementById('content')
    const div = document.createElement('div')
    div.className = 'export-item';
    root?.appendChild(div)

    const canvas = document.createElement('canvas')
    canvas.className = 'canvas'
    div.appendChild(canvas)

    const input = document.createElement('input')
    input.value = name
    input.className = 'input-name'
    div.appendChild(input)

    const button = document.createElement('button')
    button.className = 'export-button'
    button.innerText = 'Export'
    div.appendChild(button)
    button.onclick = () => {
        parent.postMessage({ pluginMessage: { type: 'export', name: input.value } }, '*')
    }

    decode(canvas, canvas.getContext('2d'), bytes)
}

async function decode(canvas: any, ctx: any, bytes: any) {
    const url = URL.createObjectURL(new Blob([bytes]))
    const image = await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject()
        img.src = url
    })
    canvas.width = 50
    canvas.height = 50
    ctx.drawImage(image, 0, 0)
}