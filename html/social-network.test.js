var moment = require('moment');

const { publishToTimeline, viewTimeline, resetUsersDatabase, followUser, viewWall } = require('./social-network');

beforeEach(() => {
    resetUsersDatabase();
});

test('Alice publishes a messages to her personal timeline and can see it', () => {

    // Message to be published
    var msg = 'I love the weather today.';

    // "Publishing" to alice's timeline
    publishToTimeline('alice', msg);

    // Check expected result (in this case, the timeline is an array of messages)
    var timeline = viewTimeline('alice');
    expect(timeline.pop().message).toContain(msg);

});

test('Alice publishes a messages to her personal timeline and can see a time stamp', () => {

    // Message to be published
    var msg = 'I love the weather today.';

    // "Publishing" to alice's timeline
    publishToTimeline('alice', msg);

    // Check expected result (in this case, the timeline is an array of messages)
    var timeline = viewTimeline('alice');
    var item = timeline.pop();
    var time_ago = moment(item.timestamp).fromNow();
    expect(item.message).toContain(time_ago);

});

test('Alice views Bob\'s timeline and sees 2 posted events in order.', () => {

    // Message to be published
    var msg1 = 'Darn! We lost!';
    publishToTimeline('bob', msg1);

    var msg2 = 'Good game though.';
    var timeline = publishToTimeline('bob', msg2);

    // Check expected result and that they are in order (msg2 should be seen first, then msg1)
    expect(timeline.shift().message).toContain(msg2);
    expect(timeline.shift().message).toContain(msg1);

});


test('Charlie can follow Alice and Bob, and he views an aggregated list of all timelines.', () => {

    // Alice timeline publishing
    var msg1 = 'I love the weather today.';
    var local_time = moment().subtract(5, 'minutes');
    publishToTimeline('alice', msg1, local_time);

    // Bob timeline publishing
    var msg2 = 'Darn! We lost!';
    local_time =  moment().subtract(2, 'minutes');
    publishToTimeline('bob', msg2, local_time);
    local_time =  moment().subtract(1, 'minute');
    var msg3 = 'Good game though.';
    publishToTimeline('bob', msg3, local_time);

    // Charlie timeline publishing
    var msg4 = 'I\'m in New York today! Anyone wants to have a coffee?';
    local_time =  moment().subtract(15, 'seconds');
    publishToTimeline('charlie', msg4, local_time);

    // Charlie follows Alice and Bob
    followUser('alice', 'charlie');
    followUser('bob', 'charlie');

    // Get Charlie's wall
    var wall = viewWall('charlie');

    // Make sure we can see all 4 messages in order
    // Make sure we can see the name of the user in each message
    expect(wall.shift().message).toBe(msg4 + ' (a few seconds ago)');
    expect(wall.shift().message).toBe(msg3 + ' (a minute ago)');
    expect(wall.shift().message).toBe(msg2 + ' (2 minutes ago)');
    expect(wall.shift().message).toBe(msg1 + ' (5 minutes ago)');

});