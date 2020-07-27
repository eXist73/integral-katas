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
    expect(timeline.pop().message).toBe(msg);

});

test('Alice views Bob\'s timeline and sees 2 posted events in order.', () => {

    // Message to be published
    var msg1 = 'Darn! We lost!';
    publishToTimeline('bob', msg1);

    var msg2 = 'Good game though.';
    var timeline = publishToTimeline('bob', msg2);

    // Check expected result and that they are in order (msg2 should be seen first, then msg1)
    expect(timeline.shift().message).toBe(msg2);
    expect(timeline.shift().message).toBe(msg1);

});


test('Charlie can follow Alice and Bob, and he views an aggregated list of all timelines.', () => {

    // Alice timeline publishing
    var msg1 = 'I love the weather today.';
    publishToTimeline('alice', msg1);

    // Bob timeline publishing
    var msg2 = 'Darn! We lost!';
    publishToTimeline('bob', msg2);
    var msg3 = 'Good game though.';
    publishToTimeline('bob', msg3);

    // Charlie timeline publishing
    var msg4 = 'I\'m in New York today! Anyone wants to have a coffee?';
    publishToTimeline('charlie', msg4);

    // Charlie follows Alice and Bob
    followUser('alice', 'charlie');
    followUser('bob', 'charlie');

    // Get Charlie's wall
    var wall = viewWall('charlie');

    // Make sure we can see all 4 messages in order
    expect(wall.shift().message).toBe(msg4);
    expect(wall.shift().message).toBe(msg3);
    expect(wall.shift().message).toBe(msg2);
    expect(wall.shift().message).toBe(msg1);

});