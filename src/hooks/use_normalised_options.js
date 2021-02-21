/* eslint-disable no-param-reassign */
import { useMemo } from 'react';
import { optionise } from '../helpers/optionise';
import { UniqueIdGenerator } from '../helpers/unique_id_generator';

/**
 * @private
 * Turn value and options into objects
 *
 * Each option will have the following values:
 *   - label - label to display
 *   - value - the original value
 *   - identity
 *   - key
 *   - group - reference to a group is grouped
 *   - options - reference to the options if a group
 *   - selected
 *   - html
 */
export function useNormalisedOptions({
  id, options: rawOptions, placeholder, value: rawValue, mapOption, ...props
}, { mustHaveSelection = false } = {}) {
  const options = useMemo(() => {
    const idGenerator = new UniqueIdGenerator();
    const groups = new Map();
    const normalisedOptions = [];
    if (placeholder) {
      normalisedOptions.push({
        label: placeholder,
        identity: '',
        value: null,
        key: idGenerator.uniqueId(`${id || ''}_option_placeholder`),
      });
    }

    rawOptions?.forEach((o) => {
      const option = optionise(o, mapOption);
      option.key = idGenerator.uniqueId(option.html?.id || `${id || ''}_option_${option.label}`);
      delete option?.html?.id;
      if (option.group) {
        let group = groups.get(option.group);
        if (!group) {
          group = {
            label: option.group,
            identity: option.group,
            options: [option],
            key: idGenerator.uniqueId(`${id || ''}_group_${option.group}`),
          };
          groups.set(option.group, group);
          normalisedOptions.push(group.options);
        } else {
          group.options.push(option);
        }
        option.group = group;
        return;
      }
      normalisedOptions.push(option);
    });

    return [].concat(...normalisedOptions).map((option, index) => ({ ...option, index }));
  }, [id, rawOptions, placeholder, mapOption]);

  const value = useMemo(() => (
    rawValue != null ? optionise(rawValue, mapOption) : rawValue
  ), [rawValue, mapOption]);

  const selectedOption = useMemo(() => {
    const option = options.find((o) => o.identity === (value?.identity || ''));
    if (option || !mustHaveSelection) {
      return option || null;
    }
    return options.find((o) => !o.unselectable);
  }, [value, options, mustHaveSelection]);

  return {
    id,
    options,
    value,
    selectedOption,
    nullOptions: rawOptions === null,
    ...props,
  };
}
