import { renderHook, act } from '@testing-library/react-hooks';
import { useConfineListBox } from './use_confine_list_box';

let container;
let listbox;

beforeEach(() => {
  container = document.createElement('div');
  listbox = document.createElement('div');
  document.body.appendChild(container);
  container.appendChild(listbox);
});

afterEach(() => {
  container.remove();
  listbox.remove();
});

describe('maxWidth', () => {
  it('does not add maxWidth if not expanded', () => {
    const { result } = renderHook(() => useConfineListBox());

    expect(result.current).toEqual([expect.any(Function), {}]);

    act(() => {
      result.current[0]({ expanded: false, listbox });
    });

    expect(result.current[1].maxWidth).toEqual(undefined);
    expect(listbox).toHaveStyle({ maxWidth: '' });
  });

  it('adds maxWidth to the list box', () => {
    jest.spyOn(listbox, 'clientWidth', 'get').mockImplementation(() => 300);
    jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 200, width: 320 }));
    jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 500 }));

    const { result } = renderHook(() => useConfineListBox());

    act(() => {
      result.current[0]({ expanded: true, listbox });
    });

    expect(result.current[1].maxWidth).toEqual('280px');
    expect(listbox).toHaveStyle({ maxWidth: '280px' });
  });

  describe('with a selector', () => {
    it('adds maxWidth if the listbox', () => {
      jest.spyOn(listbox, 'clientWidth', 'get').mockImplementation(() => 300);
      jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 200, width: 320 }));
      jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 500 }));
      jest.spyOn(container, 'getBoundingClientRect').mockImplementation(() => ({ right: 400 }));

      const { result } = renderHook(() => useConfineListBox('body > div'));

      act(() => {
        result.current[0]({ expanded: true, listbox });
      });

      expect(result.current[1].maxWidth).toEqual('180px');
      expect(listbox).toHaveStyle({ maxWidth: '180px' });
    });
  });

  describe('with an selector not matching an element', () => {
    it('uses the body', () => {
      jest.spyOn(listbox, 'clientWidth', 'get').mockImplementation(() => 300);
      jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 200, width: 320 }));
      jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 500 }));

      const { result } = renderHook(() => useConfineListBox('table'));

      act(() => {
        result.current[0]({ expanded: true, listbox });
      });

      expect(result.current[1].maxWidth).toEqual('280px');
      expect(listbox).toHaveStyle({ maxWidth: '280px' });
    });
  });

  describe('with a margin', () => {
    it('adds maxWidth if the listbox', () => {
      listbox.style.marginRight = '10px';
      jest.spyOn(listbox, 'clientWidth', 'get').mockImplementation(() => 300);
      jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ left: 200, width: 320 }));
      jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ right: 500 }));
      jest.spyOn(container, 'getBoundingClientRect').mockImplementation(() => ({ right: 400 }));

      const { result } = renderHook(() => useConfineListBox('body > div'));

      act(() => {
        result.current[0]({ expanded: true, listbox });
      });

      expect(result.current[1].maxWidth).toEqual('170px');
      expect(listbox).toHaveStyle({ maxWidth: '170px' });
    });
  });
});

describe('maxHeight', () => {
  it('does not add maxHeight if not expanded', () => {
    const { result } = renderHook(() => useConfineListBox());

    act(() => {
      result.current[0]({ expanded: false, listbox });
    });

    expect(result.current[1].maxHeight).toEqual(undefined);
    expect(listbox).toHaveStyle({ maxHeight: '' });
  });

  it('adds maxHeight', () => {
    jest.spyOn(listbox, 'clientHeight', 'get').mockImplementation(() => 300);
    window.innerHeight = 500;
    jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ bottom: 550, height: 320 }));

    const { result } = renderHook(() => useConfineListBox());

    act(() => {
      result.current[0]({ expanded: true, listbox });
    });

    expect(result.current[1].maxHeight).toEqual('250px');
    expect(listbox).toHaveStyle({ maxHeight: '250px' });
  });

  describe('with a margin', () => {
    it('adds maxHeight', () => {
      listbox.style.marginBottom = '10px';
      jest.spyOn(listbox, 'clientHeight', 'get').mockImplementation(() => 300);
      window.innerHeight = 500;
      jest.spyOn(listbox, 'getBoundingClientRect').mockImplementation(() => ({ bottom: 550, height: 320 }));

      const { result } = renderHook(() => useConfineListBox());

      act(() => {
        result.current[0]({ expanded: true, listbox });
      });

      expect(result.current[1].maxHeight).toEqual('240px');
      expect(listbox).toHaveStyle({ maxHeight: '240px' });
    });
  });
});
