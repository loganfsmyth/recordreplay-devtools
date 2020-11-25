import { Pause, ValueFront } from "protocol/thread";
import { NodeFront } from "protocol/thread/node";
import { StyleSheetFront } from "protocol/thread/styleSheet";
import { StyleFront } from "protocol/thread/style";
import { RuleFront } from "protocol/thread/rule";
import { NodeBoundsFront } from "protocol/thread/bounds";
import { Dispatch, Middleware } from "redux";
import { UIState } from "ui/state";
import { UIAction } from "ui/actions";

const forbiddenClasses: Record<string, any> = {
  Pause,
  ValueFront,
  NodeFront,
  StyleSheetFront,
  StyleFront,
  RuleFront,
  NodeBoundsFront,
};

const loggedCategories = new Set<string>();

export function sanitize(obj: any, path: string, category: string, logSanitized: boolean): any {
  for (const name in forbiddenClasses) {
    if (obj instanceof forbiddenClasses[name]) {
      if (logSanitized && !loggedCategories.has(category)) {
        console.warn(`${category}${path} is of type ${name}`);
        loggedCategories.add(category);
      }
      return undefined;
    }
  }
  if (Array.isArray(obj)) {
    return obj.map((item, i) => sanitize(item, `${path}[${i}]`, category, logSanitized));
  }
  if (typeof obj === "object") {
    const sanitized: Record<string, any> = {};
    for (const key in obj) {
      sanitized[key] = sanitize(obj[key], `${path}.${key}`, category, logSanitized);
    }
    return sanitized;
  }
  return obj;
}

export const sanityCheckMiddleware: Middleware<
  {},
  UIState,
  Dispatch<UIAction>
> = store => next => action => {
  sanitize(store.getState(), "", "state", true);
  sanitize(action, "", `action[type=${action.type}]`, true);
  return next(action);
};