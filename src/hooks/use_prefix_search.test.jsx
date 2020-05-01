import React, { useEffect } from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { usePrefixSearch } from './use_prefix_search';

function TestPrefixSearch({ options, onUpdate, ...params }) {
  if (!Object.keys(params).length) {
    params = undefined; // eslint-disable-line no-param-reassign
  }
  const [filteredOptions, onSearch, busy] = usePrefixSearch(options, params);
  useEffect(() => {
    onUpdate(filteredOptions, onSearch, busy);
  }, [filteredOptions, onSearch, busy, onUpdate]);
  return null;
}

describe('options', () => {
  describe('options as string', () => {
    it('displays all options by default', () => {
      const spy = jest.fn();
      render((
        <TestPrefixSearch options={['foo', 'bar', 'foe']} onUpdate={spy} />
      ));
      expect(spy).toHaveBeenCalledWith(
        ['foo', 'bar', 'foe'],
        expect.any(Function),
        false,
      );
    });

    it('filters options by prefix', async () => {
      const spy = jest.fn();
      render((
        <TestPrefixSearch options={['foo', 'bar', 'foe bar']} onUpdate={spy} />
      ));
      act(() => {
        spy.mock.calls[0][1]('ba');
      });
      await waitFor(() => {
        expect(spy).toHaveBeenLastCalledWith(
          ['bar'],
          expect.any(Function),
          false,
        );
      });
    });

    it('returns all options for no query', async () => {
      const spy = jest.fn();
      render((
        <TestPrefixSearch options={['foo', 'bar', 'foe']} onUpdate={spy} />
      ));
      act(() => {
        spy.mock.calls[0][1]('ba');
      });
      await waitFor(() => {
        expect(spy).toHaveBeenLastCalledWith(
          ['bar'],
          expect.any(Function),
          false,
        );
      });
      act(() => {
        spy.mock.calls[0][1]('');
      });
      await waitFor(() => {
        expect(spy).toHaveBeenLastCalledWith(
          ['foo', 'bar', 'foe'],
          expect.any(Function),
          false,
        );
      });
    });
  });

  describe('options as objects', () => {
    it('filters option label by a token search', async () => {
      const spy = jest.fn();
      const options = [
        { label: 'foo', id: 1 },
        { label: 'bar', id: 2 },
      ];
      render((
        <TestPrefixSearch options={options} onUpdate={spy} />
      ));
      act(() => {
        spy.mock.calls[0][1]('ba');
      });
      await waitFor(() => {
        expect(spy).toHaveBeenLastCalledWith(
          [options[1]],
          expect.any(Function),
          false,
        );
      });
    });

    describe('with a custom index', () => {
      it('filters options with a token search', async () => {
        const spy = jest.fn();
        const options = [
          { text: 'foo', id: 1 },
          { text: 'bar', id: 2 },
        ];
        function index(option) {
          return option.text;
        }
        render((
          <TestPrefixSearch options={options} index={index} onUpdate={spy} />
        ));
        act(() => {
          spy.mock.calls[0][1]('ba');
        });
        await waitFor(() => {
          expect(spy).toHaveBeenLastCalledWith(
            [options[1]],
            expect.any(Function),
            false,
          );
        });
      });
    });
  });
});

describe('minLength', () => {
  it('does not set initial options', async () => {
    const spy = jest.fn();
    render((
      <TestPrefixSearch options={['foo', 'bar', 'foe']} onUpdate={spy} minLength={2} />
    ));
    expect(spy).toHaveBeenLastCalledWith(
      [],
      expect.anything(),
      false,
    );
  });

  it('returns no results for a query less then minLength', async () => {
    const spy = jest.fn();
    render((
      <TestPrefixSearch options={['foo', 'bar', 'foe']} onUpdate={spy} minLength={2} />
    ));
    await act(async () => {
      spy.mock.calls[0][1]('b');
    });
    expect(spy).toHaveBeenLastCalledWith(
      [],
      expect.anything(),
      null,
    );
  });

  it('searches for a query of minLength', async () => {
    const spy = jest.fn();
    render((
      <TestPrefixSearch options={['foo', 'bar', 'foe']} onUpdate={spy} minLength={2} />
    ));
    await act(async () => {
      spy.mock.calls[0][1]('ba');
    });
    expect(spy).toHaveBeenLastCalledWith(
      ['bar'],
      expect.anything(),
      false,
    );
  });
});

describe('initialOptions', () => {
  it('overrides using options as the initial options', async () => {
    const spy = jest.fn();
    render((
      <TestPrefixSearch initialOptions={['foo']} options={['foo', 'bar', 'foe']} onUpdate={spy} minLength={2} />
    ));
    expect(spy).toHaveBeenLastCalledWith(
      ['foo'],
      expect.anything(),
      false,
    );
  });
});

describe('maxResults', () => {
  it('limits the results returned', async () => {
    const spy = jest.fn();
    render((
      <TestPrefixSearch options={['foo', 'fi', 'foe']} onUpdate={spy} maxResults={2} />
    ));
    await act(async () => {
      spy.mock.calls[0][1]('f');
    });
    expect(spy).toHaveBeenLastCalledWith(
      ['foo', 'fi'],
      expect.anything(),
      false,
    );
  });
});
