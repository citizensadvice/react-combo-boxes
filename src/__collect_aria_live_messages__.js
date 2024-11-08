const liveMessageObservers = [];

afterEach(() => {
  liveMessageObservers.forEach((observer) => observer.disconnect());
});

const selector = '[aria-live=polite],[aria-live=assertive]';

function liveRegionMessage(node) {
  return node.textContent.replace(/\s+/g, ' ').trim();
}

export function liveMessages(root = document.body) {
  const messages = [];
  const liveRegions = new Map();

  root.querySelectorAll(selector).forEach((node) => {
    liveRegions.set(node, liveRegionMessage(node));
  });

  const observer = new MutationObserver((mutations) => {
    const foundLiveRegions = new Set();
    mutations.forEach((mutation) => {
      [
        mutation.target.closest(selector),
        ...root.querySelectorAll(selector),
      ].forEach((region) => {
        if (region && region.isConnected) {
          foundLiveRegions.add(region);
        }
      });

      mutation.removedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          node.querySelectorAll(selector).forEach((region) => {
            liveRegions.delete(region);
          });
        }
      });
    });
    foundLiveRegions.forEach((node) => {
      const message = liveRegionMessage(node);
      if (liveRegions.get(node) !== message && message) {
        messages.push(message);
      }
      liveRegions.set(node, message);
    });
  });

  liveMessageObservers.push(observer);

  observer.observe(root, {
    subtree: true,
    childList: true,
    characterData: true,
  });

  document
    .querySelectorAll('[aria-live=polite],[aria-live=assertive]')
    .forEach((node) => {
      observer.observe(node, {
        subtree: true,
        childList: true,
        characterData: true,
      });
    });

  return {
    getMessages: async () => {
      await Promise.resolve();
      return messages;
    },
    stop: () => {
      observer.disconnect();
      liveMessageObservers.splice(liveMessageObservers.indexOf(observer), 1);
    },
    clear: () => messages.splice(0, messages.length),
  };
}

export async function collectLiveMessages(fn) {
  const { getMessages, stop } = liveMessages();
  await fn();
  const messages = await getMessages();
  stop();
  return messages;
}
