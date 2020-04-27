import React, { useEffect } from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { useTokenSearch } from './use_token_search';

function TestTokenSearch({ options, onUpdate, ...params }) {
  if (!Object.keys(params).length) {
    params = undefined; // eslint-disable-line no-param-reassign
  }
  const [filteredOptions, onSearch, busy] = useTokenSearch(options, params);
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
        <TestTokenSearch options={['foo', 'bar', 'foe']} onUpdate={spy} />
      ));
      expect(spy).toHaveBeenCalledWith(
        ['foo', 'bar', 'foe'],
        expect.any(Function),
        false,
      );
    });

    it('filters options by a token search', async () => {
      const spy = jest.fn();
      render((
        <TestTokenSearch options={['foo', 'bar', 'foe bar', 'fabar']} onUpdate={spy} />
      ));
      act(() => {
        spy.mock.calls[0][1]('ba');
      });
      await waitFor(() => {
        expect(spy).toHaveBeenLastCalledWith(
          ['bar', 'foe bar'],
          expect.any(Function),
          false,
        );
      });
    });

    it('returns all options for no query', async () => {
      const spy = jest.fn();
      render((
        <TestTokenSearch options={['foo', 'bar', 'foe']} onUpdate={spy} />
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
        <TestTokenSearch options={options} onUpdate={spy} />
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
          <TestTokenSearch options={options} index={index} onUpdate={spy} />
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

  describe('with a custom tokenise', () => {
    it('filters options with a token search', async () => {
      const spy = jest.fn();
      const options = ['foo', 'bar'];
      function tokenise(option) {
        return option.split('');
      }
      render((
        <TestTokenSearch options={options} tokenise={tokenise} onUpdate={spy} />
      ));
      act(() => {
        spy.mock.calls[0][1]('r');
      });
      await waitFor(() => {
        expect(spy).toHaveBeenLastCalledWith(
          ['bar'],
          expect.any(Function),
          false,
        );
      });
    });
  });
});

describe('minLength', () => {
  it('returns no results for a query less then minLength', async () => {
    const spy = jest.fn();
    render((
      <TestTokenSearch options={['foo', 'bar', 'foe']} onUpdate={spy} minLength={2} />
    ));
    await act(async () => {
      spy.mock.calls[0][1]('b');
    });
    expect(spy).toHaveBeenLastCalledWith(
      [],
      expect.anything(),
      false,
    );
  });

  it('searches for a query of minLength', async () => {
    const spy = jest.fn();
    render((
      <TestTokenSearch options={['foo', 'bar', 'foe']} onUpdate={spy} minLength={2} />
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
      <TestTokenSearch initialOptions={['foo']} options={['foo', 'bar', 'foe']} onUpdate={spy} minLength={2} />
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
      <TestTokenSearch options={['foo', 'fi', 'foe']} onUpdate={spy} maxResults={2} />
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
