import hastUtilSlots from "./hast-util-slots.js";

function rehypeSlots({ values = {}, unwrap }) {
  return function(tree) {
    return hastUtilSlots(tree, values, unwrap);
  };
}

function rehypeWrap({ layout, slotName = "body" }) {
  return function(tree) {
    return hastUtilSlots(layout, { [slotName]: tree });
  };
}

export default rehypeSlots;
