import * as testing from './joinWithSingle.js';

describe('joinWithSingle.test', () => {
  it('joins correctly', () => {
    expect(testing.joinWithSingle(['aaa', '/bbb'], '/')).toEqual('aaa/bbb');
    expect(testing.joinWithSingle(['aaa', 'bbb'], '/')).toEqual('aaa/bbb');
    expect(testing.joinWithSingle(['/aaa', 'bbb'], '/')).toEqual('/aaa/bbb');
    expect(testing.joinWithSingle(['/aaa', 'bbb/'], '/')).toEqual('/aaa/bbb/');
    expect(testing.joinWithSingle(['aaa/', 'bbb'], '/')).toEqual('aaa/bbb');
    expect(testing.joinWithSingle(['aaa/', '/bbb'], '/')).toEqual('aaa/bbb');
    expect(testing.joinWithSingle(['aaa/', '////bbb'], '/')).toEqual('aaa/bbb');
    expect(testing.joinWithSingle(['aaa/', 'yellow', '////bbb'], '/')).toEqual('aaa/yellow/bbb');
    expect(testing.joinWithSingle(['aaa/', '/yellow/', '////bbb'], '/')).toEqual('aaa/yellow/bbb');
    expect(testing.joinWithSingle(['aaa/'], '/')).toEqual('aaa/');
    expect(testing.joinWithSingle(['/aaa'], '/')).toEqual('/aaa');
    expect(testing.joinWithSingle(['a', 'b', 'c', 'd', 'e'], '-')).toEqual('a-b-c-d-e');
    expect(testing.joinWithSingle(['', '', '', '', ''], '-')).toEqual('----');
    expect(testing.joinWithSingle(['', '', '', '', ''], '')).toEqual('');
    expect(testing.joinWithSingle(['hello', 'world'], '')).toEqual('helloworld');

    // expect(testing.joinWithSingle(['abc', '00abc'], '00')).toEqual('abc0000abc'); // multi letter joiners are not supported!!
  });
});
