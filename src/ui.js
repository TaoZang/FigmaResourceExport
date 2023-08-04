var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import './ui.css';
const JSZip = require('jszip');
window.onmessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const message = event.data.pluginMessage;
    switch (message === null || message === void 0 ? void 0 : message.type) {
        case 'image': {
            renderExportPreview(message.name, message.bytes);
            break;
        }
        case 'export': {
            const dir = message.name;
            for (const item of message.items) {
                saveAsZip(dir, item);
            }
            break;
        }
    }
});
function saveAsZip(dir, assets) {
    const zip = new JSZip();
    for (const asset of assets) {
        zip.file(asset.path, asset.data);
    }
    zip.generateAsync({ type: 'blob' }).then((content) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        ;
        link.download = 'assets_' + dir + '.zip';
        link.click();
    });
}
function renderExportPreview(name, bytes) {
    const root = document.getElementById('content');
    const div = document.createElement('div');
    div.className = 'export-item';
    root === null || root === void 0 ? void 0 : root.appendChild(div);
    const canvas = document.createElement('canvas');
    canvas.className = 'canvas';
    div.appendChild(canvas);
    const input = document.createElement('input');
    input.value = name;
    input.className = 'input-name';
    div.appendChild(input);
    const button = document.createElement('button');
    button.className = 'export-button';
    button.innerText = 'Export';
    div.appendChild(button);
    button.onclick = () => {
        parent.postMessage({ pluginMessage: { type: 'export', name: input.value } }, '*');
    };
    decode(canvas, canvas.getContext('2d'), bytes);
}
function decode(canvas, ctx, bytes) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = URL.createObjectURL(new Blob([bytes]));
        const image = yield new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject();
            img.src = url;
        });
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(image, 0, 0);
    });
}
