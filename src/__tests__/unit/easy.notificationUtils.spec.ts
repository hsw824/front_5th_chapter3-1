import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

// 올바른 로직으로 테스트를 짜고 있는지 잘 모르겠다

describe('getUpcomingEvents', () => {
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const events: Event[] = [
      {
        id: '1',
        title: '회의',
        date: '2025-07-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '미팅',
        date: '2025-07-01',
        startTime: '19:30',
        endTime: '20:30',
        description: '고객 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 60,
      },
    ];
    const now = new Date('2025-07-01T08:50:00');

    const result = getUpcomingEvents(events, now, []);

    expect(result).toEqual([events[0]]);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const events: Event[] = [
      {
        id: '1',
        title: '회의',
        date: '2025-07-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '미팅',
        date: '2025-07-01',
        startTime: '09:30',
        endTime: '10:30',
        description: '고객 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 60,
      },
    ];
    const now = new Date('2025-07-01T08:50:00');

    const result = getUpcomingEvents(events, now, ['1']);

    expect(result).toEqual([events[1]]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const events: Event[] = [
      {
        id: '1',
        title: '회의',
        date: '2025-07-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '미팅',
        date: '2025-07-01',
        startTime: '19:30',
        endTime: '20:30',
        description: '고객 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 60,
      },
    ];
    const now = new Date('2025-07-01T08:50:00');

    const result = getUpcomingEvents(events, now, []);

    expect(result).toEqual([events[0]]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const events: Event[] = [
      {
        id: '1',
        title: '회의',
        date: '2025-07-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '미팅',
        date: '2025-07-01',
        startTime: '10:50',
        endTime: '11:30',
        description: '고객 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];
    const now = new Date('2025-07-01T10:40:00');

    const result = getUpcomingEvents(events, now, []);

    expect(result).toEqual([events[1]]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const events: Event = {
      id: '1',
      title: '회의',
      date: '2025-07-01',
      startTime: '09:00',
      endTime: '10:00',
      description: '팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    const result = createNotificationMessage(events);
    expect(result).toBe('10분 후 회의 일정이 시작됩니다.');
  });
});
