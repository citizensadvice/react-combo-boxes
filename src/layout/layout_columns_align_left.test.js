import { layoutColumnsAlignLeft } from './layout_columns_align_left';

describe('when natural table width is the auto table width', () => {
  it('does not set column widths', () => {
    const html = `
      <table>
        <col>
        <col>
        <tbody>
          <tr>
            <td>one</td>
            <td>two</td>
          </tr>
        </tbody>
      </table>
    `;

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    const table = container.querySelector('table');

    jest.spyOn(table, 'clientWidth', 'get')
      .mockImplementationOnce(() => 100)
      .mockImplementationOnce(() => 100);

    layoutColumnsAlignLeft(container);

    table.querySelectorAll('col').forEach((col) => {
      expect(col).toHaveStyle({ width: '' });
    });

    expect(table).toHaveStyle({ width: '' });
  });
});

describe('when natural table width is less then the auto table width', () => {
  it('does not set column widths', () => {
    const html = `
      <table>
        <col>
        <col>
        <tbody>
          <tr>
            <td>one</td>
            <td>two</td>
          </tr>
        </tbody>
      </table>
    `;

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    const table = container.querySelector('table');

    jest.spyOn(table, 'clientWidth', 'get')
      .mockImplementationOnce(() => 100)
      .mockImplementationOnce(() => 90);

    table.querySelectorAll('td').forEach((td) => {
      jest.spyOn(td, 'getBoundingClientRect').mockImplementation(() => ({ width: 20 }));
    });

    layoutColumnsAlignLeft(container);

    expect(table.querySelector('col:first-child')).toHaveStyle({
      width: '20px',
    });

    expect(table.querySelector('col:last-child')).toHaveStyle({
      width: '',
    });

    expect(table).toHaveStyle({ 'min-width': '', width: '' });
  });
});
