figma.showUI(__html__);
function RGBtoHSV(r, g, b) {
    let v = Math.max(r, g, b), c = v - Math.min(r, g, b);
    let h = c && (v == r ? (g - b) / c : v == g ? 2 + (b - r) / c : 4 + (r - g) / c);
    return { h: 60 * (h < 0 ? h + 6 : h), s: v && c / v, v: v };
}
figma.ui.onmessage = (msg) => {
    switch (msg.type) {
        case "cancel":
            figma.closePlugin();
            break;
        case "run":
            console.log("hello");
            let colors = [];
            const frames = figma.currentPage.selection.filter((e) => {
                return e.type === "FRAME";
            });
            if (frames.length == 0) {
                return;
            }
            const frame = frames[0];
            console.log(frame.children);
            const rectangles = frame.children.filter((e) => {
                return e.type === "RECTANGLE";
            });
            const debugNode = (node) => {
                console.log(node.x, node.y);
            };
            const maxX = Math.max.apply(null, rectangles.map((e) => e.x));
            const maxY = Math.max.apply(null, rectangles.map((e) => e.y));
            const getColor = (x, y) => {
                const _rectangles = rectangles.filter((e) => e.x == x && e.y == y);
                if (_rectangles.length == 0) {
                    return null;
                }
                const rectangle = _rectangles[0];
                const color = rectangle.fills[0].color;
                const hsb = RGBtoHSV(color.r, color.g, color.b);
                return hsb;
            };
            const lines = [];
            for (let y = 0; y <= maxY; y++) {
                const line = [];
                for (let x = 0; x <= maxX; x++) {
                    const color = getColor(x, y);
                    if (color) {
                        console.log(x, y, color);
                        line.push(color);
                    }
                }
                lines.push(line);
            }
            const flatten = lines
                .flatMap((e) => e)
                .map((color) => {
                return `{${Math.round((color.h / 360) * 255)}, ${Math.round(color.s * 255)}, ${Math.round(color.v * 255)}}`;
            })
                .join(",");
            const output = `{ ${flatten} }`;
            console.log(output);
            figma.ui.postMessage(output);
    }
};
