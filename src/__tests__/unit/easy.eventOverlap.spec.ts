import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2025-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    expect(parseDateTime('2025-07-01', '14:30')).toEqual(new Date('2025-07-01T14:30'));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const result = parseDateTime('2025--07-01', '14:30');
    expect(result instanceof Date).toBe(true);
    expect(isNaN(result.getFullYear())).toBe(true);
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const result = parseDateTime('2025-07-01', '1431231231231:30');
    expect(result instanceof Date).toBe(true);
    expect(isNaN(result.getTime())).toBe(true);
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const result = parseDateTime('', '14:30');
    expect(result instanceof Date).toBe(true);
    expect(isNaN(result.getFullYear())).toBe(true);
  });
});

describe('convertEventToDateRange', () => {
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
      date: '2025-10-34',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '3',
      title: '기존 회의3',
      date: '2025-10-01',
      startTime: '093213:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const start = parseDateTime(events[0].date, events[0].startTime);
    const end = parseDateTime(events[0].date, events[0].endTime);
    const result = {
      start,
      end,
    };
    expect(convertEventToDateRange(events[0])).toEqual(result);
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const result = convertEventToDateRange(events[1]);

    expect(result.start instanceof Date).toBe(true);
    expect(isNaN(result.start.getFullYear())).toBe(true);
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const result = convertEventToDateRange(events[2]);

    expect(result.start instanceof Date).toBe(true);
    expect(isNaN(result.start.getFullYear())).toBe(true);
  });
});

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
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
        date: '2025-05-01',
        startTime: '09:30',
        endTime: '10:30',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];

    const result = isOverlapping(events[0], events[1]);

    expect(result).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
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
        date: '2025-05-01',
        startTime: '13:30',
        endTime: '15:30',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];

    const result = isOverlapping(events[0], events[1]);

    expect(result).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  const newEvent: Event = {
    id: '3',
    title: '기존 회의',
    date: '2025-05-01',
    startTime: '09:00',
    endTime: '10:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
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
        date: '2025-05-01',
        startTime: '09:30',
        endTime: '10:30',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];
    const result = findOverlappingEvents(newEvent, events);

    expect(result).toEqual(events);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const events: Event[] = [
      {
        id: '1',
        title: '기존 회의',
        date: '2025-05-01',
        startTime: '13:00',
        endTime: '15:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '기존 회의2',
        date: '2025-05-01',
        startTime: '19:30',
        endTime: '20:30',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];
    const result = findOverlappingEvents(newEvent, events);
    expect(result).toEqual([]);
  });
});
