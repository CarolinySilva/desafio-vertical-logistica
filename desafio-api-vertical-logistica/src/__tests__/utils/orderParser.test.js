const { extractRecordFromLine } = require('../../utils/orderParser');

describe('extractRecordFromLine', () => {
  it('should parse a valid line correctly', () => {
    const line = 
      '0000000002' +                         // 10 chars user_id
      'Medeiros'.padEnd(45, ' ') +          // 45 chars name com espaços à direita
      '0000001234' +                         // 10 chars order_id
      '0000000111' +                         // 10 chars product_id
      '000000256.24' +                       // 12 chars value (incluindo ponto)
      '20201201';                           // 8 chars date

    expect(line.length).toBe(95);           // garante que tem 95 chars

    const result = extractRecordFromLine(line);
    expect(result).toEqual({
      user_id: 2,
      name: 'Medeiros',
      order_id: 1234,
      product_id: 111,
      value: 256.24,
      date: '2020-12-01'
    });
  });
});
