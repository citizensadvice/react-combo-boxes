import { diff } from 'jest-diff';

const liveMessageObservers = [];

afterEach(() => {
  liveMessageObservers.forEach((observer) => observer.disconnect());
});

const selector = '[aria-live=polite],[aria-live=assertive]';

function liveRegionMessage(node) {
  return node.textContent.replace(/\s+/g, ' ').trim();
}

export function collectLiveMessages(root = document.body) {
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

  observer.observe(root, { subtree: true, childList: true, characterData: true });

  document.querySelectorAll('[aria-live=polite],[aria-live=assertive]').forEach((node) => {
    observer.observe(node, { subtree: true, childList: true, characterData: true });
  });

  return {
    getMessages: async () => {
      await Promise.resolve();
      return messages;
    },
    stop: () => {
      observer.disconnect();
    },
    clear: () => messages.splice(0, messages.length),
  };
}

expect.extend({
  async toGenerateLiveMessages(fn, expected) {
    const { getMessages } = collectLiveMessages();
    await fn();
    const received = await getMessages();
    let message;
    let pass;

    if (expected === undefined) {
      const options = {
        comment: 'deep equality',
        isNot: !this.isNot,
        promise: this.promise,
      };

      pass = !this.equals(received, []);

      if (pass) {
        message = () => (
          // eslint-disable-next-line prefer-template
          this.utils.matcherHint('toEqual', undefined, undefined, options)
          + '\n\n'
          + `Expected: ${this.utils.printExpected([])}\n`
          + `Received: ${this.utils.printReceived(received)}`
        );
      } else {
        message = () => (
          // eslint-disable-next-line prefer-template
          this.utils.matcherHint('toEqual', undefined, undefined, options)
          + '\n\n'
          + `Expected: not ${this.utils.printExpected([])}\n`
          + `Received: ${this.utils.printReceived(received)}`
        );
      }
    } else {
      pass = this.equals(received, expected);

      const options = {
        comment: 'deep equality',
        isNot: this.isNot,
        promise: this.promise,
      };

      if (pass) {
        message = () => (
          // eslint-disable-next-line prefer-template
          this.utils.matcherHint('toEqual', undefined, undefined, options)
          + '\n\n'
          + `Expected: not ${this.utils.printExpected(expected)}\n`
          + `Received: ${this.utils.printReceived(received)}`
        );
      } else {
        message = () => {
          const diffString = diff(expected, received, {
            expand: this.expand,
          });
          return (
            // eslint-disable-next-line prefer-template
            this.utils.matcherHint('toEqual', undefined, undefined, options)
            + '\n\n'
            + (diffString && diffString.includes('- Expect')
              ? `Difference:\n\n${diffString}`
              : `Expected: ${this.utils.printExpected(expected)}\n`
                + `Received: ${this.utils.printReceived(received)}`)
          );
        };
      }
    }

    return { message, pass };
  },
});
