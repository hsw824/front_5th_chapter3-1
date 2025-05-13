// TODO: 올바른 다 지우고 정확한 조건으로 바꾸기
import { describe, expect, it } from 'vitest';

import { Event } from '../../types';
import {
  fillZero,
  formatDate,
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
  isDateInRange,
} from '../../utils/dateUtils';

describe('getDaysInMonth', () => {
  it('1월은 31일 수를 반환한다', () => {
    expect(getDaysInMonth(2025, 1)).toBe(31);
  });

  it('4월은 30일 일수를 반환한다', () => {
    expect(getDaysInMonth(2025, 4)).toBe(30);
  });

  it('윤년의 2월에 대해 29일을 반환한다', () => {
    expect(getDaysInMonth(2028, 2)).toBe(29);
  });

  it('평년의 2월에 대해 28일을 반환한다', () => {
    expect(getDaysInMonth(2025, 2)).toBe(28);
  });

  it('유효하지 않은 월에 대해 적절히 처리한다', () => {
    // 2026년 1월
    expect(getDaysInMonth(2025, 13)).toBe(31);
  });
});

// toEqual => 동일 구조 파악(객체, 배열, Date 비교 적합)
// getWeekDates는 항상 length가 7인 배열을 반환하는데 특정 배열만 테스트 하는건 좀 그런가 모든 배열을 테스트 해야하나 유효한 값인지 아닌지를 판별해야할 것 같기는한데
//
describe('getWeekDates', () => {
  it('주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = new Date(2025, 4, 14);
    const result = getWeekDates(date);
    expect(result).toHaveLength(7);
    expect(result[3]).toEqual(new Date(2025, 4, 14));
  });

  it('주의 시작(월요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = new Date(2025, 4, 12);
    const result = getWeekDates(date);
    expect(result).toHaveLength(7);
    expect(result[1]).toEqual(new Date(2025, 4, 12));
  });

  it('주의 끝(일요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = new Date(2025, 4, 11);
    const result = getWeekDates(date);
    expect(result).toHaveLength(7);
    expect(result[0]).toEqual(date);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    const date = new Date(2025, 11, 28);
    const result = getWeekDates(date);
    expect(result).toHaveLength(7);
    expect(result[0]).toEqual(date);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    const date = new Date(2026, 0, 1);
    const result = getWeekDates(date);
    expect(result).toHaveLength(7);
    expect(result[4]).toEqual(new Date(2026, 0, 1));
  });

  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    const date = new Date(2028, 1, 29);
    const result = getWeekDates(date);
    expect(result).toHaveLength(7);
    expect(result[2]).toEqual(new Date(2028, 1, 29));
  });

  it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {
    const date = new Date(2025, 4, 31);
    const result = getWeekDates(date);
    expect(result).toHaveLength(7);
    expect(result[6]).toEqual(new Date(2025, 4, 31));
  });
});

describe('getWeeksAtMonth', () => {
  it('2025년 7월 1일의 올바른 주 정보를 반환해야 한다', () => {
    const date = new Date(2025, 6, 1);
    const expectArray = [null, null, 1, 2, 3, 4, 5];
    const result = getWeeksAtMonth(date);

    expect(result[0]).toEqual(expectArray);
  });
});

describe('getEventsForDay', () => {
  const events: Event[] = [
    {
      id: '1',
      title: '기존 회의',
      date: '2025-05-01',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '기존 회의2',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];

  it('특정 날짜(1일)에 해당하는 이벤트만 정확히 반환한다', () => {
    const baseDate = new Date('2025-05-01');
    expect(getEventsForDay(events, baseDate.getDate())).toEqual([events[0]]);
  });

  it('해당 날짜에 이벤트가 없을 경우 빈 배열을 반환한다', () => {
    const baseDate = new Date('2025-05-10');
    expect(getEventsForDay(events, baseDate.getDate())).toEqual([]);
  });

  it('날짜가 0일 경우 빈 배열을 반환한다', () => {
    const baseDate = new Date('2025-05-00');
    expect(getEventsForDay(events, baseDate.getDate())).toEqual([]);
  });

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', () => {
    const baseDate = new Date('2025-05-32');
    expect(getEventsForDay(events, baseDate.getDate())).toEqual([]);
  });
});

describe('formatWeek', () => {
  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date(2025, 4, 15))).toBe('2025년 5월 3주');
  });

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date(2025, 4, 1))).toBe('2025년 5월 1주');
  });

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date(2025, 4, 26))).toBe('2025년 5월 5주');
  });

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date(2025, 11, 29))).toBe('2026년 1월 1주');
  });

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date(2028, 1, 28))).toBe('2028년 3월 1주');
  });

  it('평년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date(2025, 1, 28))).toBe('2025년 2월 4주');
  });
});

describe('formatMonth', () => {
  it("2025년 7월 10일을 '2025년 7월'로 반환한다", () => {
    expect(formatMonth(new Date(2025, 6, 10))).toBe('2025년 7월');
  });
});

describe('isDateInRange', () => {
  const rangeStart = new Date('2025-07-01');
  const rangeEnd = new Date('2025-07-31');

  it('범위 내의 날짜 2025-07-10에 대해 true를 반환한다', () => {
    const baseDate = new Date(2025, 6, 10);
    expect(isDateInRange(baseDate, rangeStart, rangeEnd)).toBe(true);
  });

  it('범위의 시작일 2025-07-01에 대해 true를 반환한다', () => {
    const baseDate = new Date(2025, 6, 1);
    expect(isDateInRange(baseDate, rangeStart, rangeEnd)).toBe(true);
  });

  it('범위의 종료일 2025-07-31에 대해 true를 반환한다', () => {
    const baseDate = new Date(2025, 6, 31);
    expect(isDateInRange(baseDate, rangeStart, rangeEnd)).toBe(true);
  });

  it('범위 이전의 날짜 2025-06-30에 대해 false를 반환한다', () => {
    const baseDate = new Date(2025, 5, 30);
    expect(isDateInRange(baseDate, rangeStart, rangeEnd)).toBe(false);
  });

  it('범위 이후의 날짜 2025-08-01에 대해 false를 반환한다', () => {
    const baseDate = new Date(2025, 7, 1);
    expect(isDateInRange(baseDate, rangeStart, rangeEnd)).toBe(false);
  });

  it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {
    const baseDate = new Date(2025, 7, 1);
    expect(isDateInRange(baseDate, rangeEnd, rangeStart)).toBe(false);
  });
});

describe('fillZero', () => {
  test("5를 2자리로 변환하면 '05'를 반환한다", () => {
    expect(fillZero(5, 2)).toBe('05');
  });

  test("10을 2자리로 변환하면 '10'을 반환한다", () => {
    expect(fillZero(10, 2)).toBe('10');
  });

  test("3을 3자리로 변환하면 '003'을 반환한다", () => {
    expect(fillZero(3, 3)).toBe('003');
  });

  test("100을 2자리로 변환하면 '100'을 반환한다", () => {
    expect(fillZero(100)).toBe('100');
  });

  test("0을 2자리로 변환하면 '00'을 반환한다", () => {
    expect(fillZero(0, 2)).toBe('00');
  });

  test("1을 5자리로 변환하면 '00001'을 반환한다", () => {
    expect(fillZero(1, 5)).toBe('00001');
  });

  test("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {
    expect(fillZero(3.14, 5)).toBe('03.14');
  });

  test('size 파라미터를 생략하면 기본값 2를 사용한다', () => {
    expect(fillZero(1)).toBe('01');
  });

  test('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {
    expect(fillZero(100000, 3)).toBe('100000');
  });
});

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {
    expect(formatDate(new Date('2025-05-13'))).toBe('2025-05-13');
  });

  it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {
    expect(formatDate(new Date('2025-05-01'), 20)).toBe('2025-05-20');
  });

  it('월이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    expect(formatDate(new Date(2025, 4, 13))).toBe('2025-05-13');
  });

  it('일이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    expect(formatDate(new Date(2025, 4, 2), 2)).toBe('2025-05-02');
  });
});
