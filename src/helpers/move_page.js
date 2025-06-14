import { nextInList } from './next_in_list';
import { previousInList } from './previous_in_list';
import { nearestScrollable } from './nearest_scrollable';

/**
 * Moves down a page of options, or up a page of options
 */
export function movePage(direction, options, focusedOption, listbox, { skip }) {
  let next;
  let previous;
  if (direction === 'down') {
    next = nextInList;
    previous = previousInList;
  } else if (direction === 'up') {
    next = previousInList;
    previous = nextInList;
  }

  const referenceOption = focusedOption || next(options, -1, { skip });
  const lastOption = previous(options, -1, { skip });
  const referenceElement = document.getElementById(referenceOption.key);

  if (!referenceElement) {
    return lastOption;
  }
  let parent = nearestScrollable(referenceElement, listbox);
  if (!parent) {
    return lastOption;
  }
  const parentRect = parent.getBoundingClientRect();
  const referenceRect = referenceElement.getBoundingClientRect();

  let nextOption = referenceOption;
  let prevOption = nextOption;

  do {
    nextOption = next(options, nextOption?.index ?? -1, { skip });
    if (!nextOption || nextOption === lastOption) {
      return lastOption;
    }

    const element = document.getElementById(nextOption.key);
    if (!element) {
      continue;
    }

    const currentRect = element.getBoundingClientRect();

    if (
      (direction === 'down' &&
        currentRect.bottom >= referenceRect.top + parentRect.height) ||
      (direction === 'up' &&
        currentRect.top <= referenceRect.bottom - parentRect.height)
    ) {
      return prevOption === focusedOption ? nextOption : prevOption;
    }
    prevOption = nextOption;
  } while (true); // eslint-disable-line no-constant-condition
}
