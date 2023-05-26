const LocalTelRepository = require('../src/LocalTelRepository');
const TelSplit = require('../src/TelSplit');


const telsplit = new TelSplit(
    // 市外局番, 市内局番 テスト用データ
    new LocalTelRepository({
        '011200': ['011', '200'],
        '033000': ['03', '3000'],
        '052200': ['052', '200'],
        '064000': ['06', '4000'],
        '092200': ['092', '200'],
    })
);


describe.each`
tel_before       | tel_after
${'0112000000'}  | ${'011-200-0000'}
${'0330000000'}  | ${'03-3000-0000'}
${'0522000000'}  | ${'052-200-0000'}
${'0640000000'}  | ${'06-4000-0000'}
${'0922000000'}  | ${'092-200-0000'}
${'09010000000'} | ${'090-1000-0000'}
${'08010000000'} | ${'080-1000-0000'}
${'07010000000'} | ${'070-1000-0000'}
${'05010000000'} | ${'050-1000-0000'}
${'0120000000'}  | ${'0120-000-000'}
${'08000000000'}  | ${'0800-000-0000'}
 `('電話番号を分割', ({ tel_before, tel_after }) => {
    test(`${tel_before} -> ${tel_after}`, () => {
        expect(telsplit.convert(tel_before)).toBe(tel_after);
    });
});


describe.each`
tel_before       | tel_after
${'1234567890'}  | ${'1234567890'}
${'not-number'}  | ${'not-number'}
${'090-1000-0000'} | ${'090-1000-0000'}
${'090-100-00000'} | ${'090-100-00000'}
`('存在しない局番, 数字以外を含む場合は変換しない', ({ tel_before, tel_after }) => {
    test(`${tel_before} -> ${tel_after}`, () => {
        expect(telsplit.convert(tel_before)).toBe(tel_after);
    });
});


describe.each`
tel_before           | tel_after
${' 0112000000 '}    | ${'011-200-0000'}
${'  0330000000  '}  | ${'03-3000-0000'}
${' 09010000000 '}   | ${'090-1000-0000'}
${'090-100-00000  '} | ${'090-100-00000'}
`('前後の空白を無視', ({ tel_before, tel_after }) => {
    test(`${tel_before} -> ${tel_after}`, () => {
        expect(telsplit.convert(tel_before)).toBe(tel_after);
    });
});