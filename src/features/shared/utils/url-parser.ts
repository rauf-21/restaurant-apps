import { match } from 'ts-pattern';
import { Option } from '@swan-io/boxed';

interface SplitUrl {
  resource: Option<string>;
  id: Option<string>;
  verb: Option<string>;
}

export function urlSplitter(url: string): SplitUrl {
  const [, resource, id, verb] = url.split('/');

  return {
    resource: Option.fromNullable(resource),
    id: Option.fromNullable(id),
    verb: Option.fromNullable(verb),
  };
}

export function urlCombiner(splitUrl: SplitUrl) {
  return Object.entries(splitUrl)
    .map(([key, value]) =>
      match(key as keyof typeof splitUrl)
        .with('resource', () =>
          value.map((value: string) => `/${value}`).getWithDefault('/')
        )
        .with('id', () => value.map(() => '/:id').getWithDefault(''))
        .with('verb', () =>
          value.map((value: string) => `/${value}`).getWithDefault('')
        )
        .exhaustive()
    )
    .join('');
}

export function parseActiveUrl() {
  return window.location.hash.slice(1).toLowerCase();
}

export function parseActiveUrlWithCombiner() {
  return urlCombiner(urlSplitter(parseActiveUrl()));
}

export function parseActiveUrlWithoutCombiner() {
  return urlSplitter(parseActiveUrl());
}
