import { assert } from "protocol/utils";
import { UIState } from "ui/state";
import { createReducer, ReducerObject } from "../../shared/reducer-object";
import { MarkupAction } from "../actions/markup";
import { MarkupState, MarkupTree } from "../state/markup";
const Services = require("Services");

const ATTR_COLLAPSE_ENABLED_PREF = "devtools.markup.collapseAttributes";
const ATTR_COLLAPSE_LENGTH_PREF = "devtools.markup.collapseAttributeLength";

const INITIAL_MARKUP: MarkupState = {
  collapseAttributes: Services.prefs.getBoolPref(ATTR_COLLAPSE_ENABLED_PREF),
  collapseAttributeLength: Services.prefs.getIntPref(ATTR_COLLAPSE_LENGTH_PREF),
  rootNode: null,
  selectedNode: null,
  scrollIntoViewNode: null,
  tree: {},
};

const reducers: ReducerObject<MarkupState, MarkupAction> = {
  ["RESET"]() {
    return { ...INITIAL_MARKUP };
  },

  ["NEW_ROOT"](markup, { rootNode }) {
    return {
      ...markup,
      tree: {
        [rootNode.id]: rootNode,
      },
      rootNode: rootNode.id,
      selectedNode: null,
      scrollIntoViewNode: null,
    };
  },

  ["ADD_CHILDREN"](markup, { parentNodeId, children }) {
    assert(markup.tree[parentNodeId]);

    const newNodes: MarkupTree = {};
    let hasNewNodes = false;
    for (const node of children) {
      if (!(node.id in markup.tree)) {
        newNodes[node.id] = node;
        hasNewNodes = true;
      }
    }

    if (hasNewNodes) {
      return {
        ...markup,
        tree: {
          ...markup.tree,
          ...newNodes,
          [parentNodeId]: {
            ...markup.tree[parentNodeId],
            children: children.map(child => child.id),
          },
        },
      };
    } else {
      return markup;
    }
  },

  ["UPDATE_NODE_EXPANDED"](markup, { nodeId, isExpanded }) {
    return {
      ...markup,
      tree: {
        ...markup.tree,
        [nodeId]: {
          ...markup.tree[nodeId],
          isExpanded,
        },
      },
    };
  },

  ["UPDATE_SELECTED_NODE"](markup, { selectedNode }) {
    return {
      ...markup,
      selectedNode,
    };
  },

  ["UPDATE_SCROLL_INTO_VIEW_NODE"](markup, { scrollIntoViewNode }) {
    return {
      ...markup,
      scrollIntoViewNode,
    };
  },
};

export default createReducer(INITIAL_MARKUP, reducers);

export const getNode = (state: UIState, nodeId: string | null) =>
  typeof nodeId === "string" ? state.markup.tree[nodeId] : undefined;
export const getRootNodeId = (state: UIState) => state.markup.rootNode;
export const getSelectedNodeId = (state: UIState) => state.markup.selectedNode;
export const getScrollIntoViewNodeId = (state: UIState) => state.markup.scrollIntoViewNode;
