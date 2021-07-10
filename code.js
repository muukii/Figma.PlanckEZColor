figma.showUI(__html__);
function RGBtoHSV(r, g, b) {
  let v = Math.max(r, g, b),
    c = v - Math.min(r, g, b);
  let h =
    c && (v == r ? (g - b) / c : v == g ? 2 + (b - r) / c : 4 + (r - g) / c);
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

      const rectangles = figma.currentPage.selection.filter((e) => {
        return e.type === "RECTANGLE";
      });

      const debugNode = (node) => {
        console.log(node.x, node.y);
      };

      const _sort = (collection) => {
        collection.sort((a, b) => {
          if (a.x < b.x) {
            return -1;
          } else {
            return 1;
          }
        });
      };

      const line0 = rectangles.filter((e) => e.y == 0);
      const line1 = rectangles.filter((e) => e.y == 1);
      const line2 = rectangles.filter((e) => e.y == 2);
      const line3 = rectangles.filter((e) => e.y == 3);

      _sort(line0);
      _sort(line1);
      _sort(line2);
      _sort(line3);

      line0.forEach(debugNode);
      line1.forEach(debugNode);
      line2.forEach(debugNode);
      line3.forEach(debugNode);

      let sortedRectangles = [];
      sortedRectangles = sortedRectangles.concat(line0, line1, line2, line3);

      console.log(sortedRectangles);

      for (const node of sortedRectangles) {
        console.log(node);
        //   console.log(node.x, node.y);

        const color = node.fills[0].color;
        const hsb = RGBtoHSV(color.r, color.g, color.b);
        colors.push(
          `{${Math.round((hsb.h / 360) * 255)}, ${Math.round(
            hsb.s * 255
          )}, ${Math.round(hsb.v * 255)}}`
        );
      }
      const output = `{ ${colors.join(",")} }`;
      console.log(output);
      figma.ui.postMessage(output);
  }
};
