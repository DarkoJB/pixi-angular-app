import {
  UniformGroup
} from "./chunk-YXJZXE4G.js";

// node_modules/pixi.js/lib/rendering/renderers/gl/shader/getBatchSamplersUniformGroup.mjs
var batchSamplersUniformGroupHash = {};
function getBatchSamplersUniformGroup(maxTextures) {
  let batchSamplersUniformGroup = batchSamplersUniformGroupHash[maxTextures];
  if (batchSamplersUniformGroup)
    return batchSamplersUniformGroup;
  const sampleValues = new Int32Array(maxTextures);
  for (let i = 0; i < maxTextures; i++) {
    sampleValues[i] = i;
  }
  batchSamplersUniformGroup = batchSamplersUniformGroupHash[maxTextures] = new UniformGroup({
    uTextures: { value: sampleValues, type: `i32`, size: maxTextures }
  }, { isStatic: true });
  return batchSamplersUniformGroup;
}

export {
  getBatchSamplersUniformGroup
};
//# sourceMappingURL=chunk-OUHFQVIJ.js.map
