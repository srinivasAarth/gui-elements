import { CLASSPREFIX as eccgui } from "./../../../configuration/constants";
import { gethighlightedStateClasses } from "./../nodes/NodeContent";

export const minimapNodeClassName = (node: any) => {
    const typeClass = `${eccgui}-graphviz__minimap__node--` + node.type;
    const stateClass = node.data?.highlightedState ? gethighlightedStateClasses(node.data.highlightedState, `${eccgui}-graphviz__minimap__node`) : "";
    return typeClass + (stateClass ? " " + stateClass : "");
};

export const minimapNodeColor = (node: any) => {
    const fillColor = node.data?.style?.backgroundColor || node.data?.style?.borderColor;
    return fillColor ?? "";
}

export const minimapBorderColor = (node: any) => {
    const strokeColor = node.data?.style?.borderColor || node.data?.style?.backgroundColor;
    return strokeColor ?? "";
}
