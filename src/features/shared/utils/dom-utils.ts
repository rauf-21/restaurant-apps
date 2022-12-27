import { Option } from '@swan-io/boxed';

export function $(selector: string) {
  return Option.fromNullable(document.querySelector(selector));
}

export function $$(selector: string) {
  return Option.fromNullable(document.querySelectorAll(selector)).map(
    (nodeList) => Array.from(nodeList)
  );
}
