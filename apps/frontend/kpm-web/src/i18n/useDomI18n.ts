import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { domTranslationPairs } from './domDictionary';

const zhToEn = new Map(domTranslationPairs);
const enToZh = new Map(domTranslationPairs.map(([zh, en]) => [en, zh]));
const ATTRIBUTES = ['placeholder', 'title', 'aria-label'];
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE']);

function translateExact(value: string, language: string) {
  const trimmed = value.trim();
  if (!trimmed) return value;
  const next = language.startsWith('en') ? zhToEn.get(trimmed) : enToZh.get(trimmed);
  if (!next) return value;
  return value.replace(trimmed, next);
}

function translateElement(element: Element, language: string) {
  if (element instanceof HTMLElement && element.dataset.i18nSkip === 'true') return;
  for (const attr of ATTRIBUTES) {
    const value = element.getAttribute(attr);
    if (!value) continue;
    const next = translateExact(value, language);
    if (next !== value) element.setAttribute(attr, next);
  }
}

function translateTextNode(node: Node, language: string) {
  const parent = node.parentElement;
  if (!parent || SKIP_TAGS.has(parent.tagName) || parent.dataset.i18nSkip === 'true') return;
  const value = node.textContent || '';
  const next = translateExact(value, language);
  if (next !== value) node.textContent = next;
}

function translateSingleNode(node: Node, language: string) {
  if (node.nodeType === Node.TEXT_NODE) {
    translateTextNode(node, language);
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const element = node as Element;
  if (SKIP_TAGS.has(element.tagName)) return;
  translateElement(element, language);
}

function translateSubtree(root: Node, language: string) {
  translateSingleNode(root, language);
  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (SKIP_TAGS.has(element.tagName)) return NodeFilter.FILTER_REJECT;
        if (element instanceof HTMLElement && element.dataset.i18nSkip === 'true') return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let current = walker.nextNode();
  while (current) {
    translateSingleNode(current, language);
    current = walker.nextNode();
  }
}

export function useDomI18n() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const apply = () => translateSubtree(document.body, i18n.language);
    const timer = window.setTimeout(apply, 0);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => translateSubtree(node, i18n.language));
        if (mutation.type === 'characterData' && mutation.target) translateSingleNode(mutation.target, i18n.language);
        if (mutation.type === 'attributes' && mutation.target instanceof Element) translateElement(mutation.target, i18n.language);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRIBUTES });
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [i18n.language]);
}
