var fs = require('fs');

/**
 * Resets our "database" to the initial setup
 */
function resetUsersDatabase()
{
    let data = fs.readFileSync('users_init.json');
    fs.writeFileSync('users.json', data);
}

/**
 * Returns a JSON objecet of our database (not using sqlite / mongo or anything here, just a simple json file)
 *
 * @returns {any}
 */
function readUsersDatabase()
{
    let data = fs.readFileSync('users.json');
    let users = JSON.parse(data);
    return users;
}

/**
 * Writes a json object to our users.json (database file)
 *
 * @param data
 */
function writeUsersDatabase(data)
{
    fs.writeFileSync('users.json', JSON.stringify(data));
}

/**
 * Given a user's timeline, push a message onto the array
 * that is that users timeline
 *
 * @param username
 * @param message
 * @returns {*}
 */
function publishToTimeline(username, message)
{
    let data = readUsersDatabase();

    var timeline_obj = {};
    timeline_obj['message'] = message;
    timeline_obj['timestamp'] = Date.now();

    data[username].timeline.unshift(timeline_obj);
    writeUsersDatabase(data);
    return data[username].timeline;
}

/**
 * Return the timeline
 *
 * @param username
 * @returns {*}
 */
function viewTimeline(username)
{
    let data = readUsersDatabase();
    return data[username].timeline;
}

/**
 * A user (follower) chooses to follow another (followee)
 *
 * @param followee (username)
 * @param follower (username)
 */
function followUser(followee, follower)
{
    // Cant follow yourself
    if(followee === follower)
        return;

    let data = readUsersDatabase();

    // Make sure they aren't following them already
    if(data[follower].following.indexOf(followee) === -1)
        data[follower].following.push(followee);

    writeUsersDatabase(data);
}

/**
 * Return the set of users username is following
 *
 * @param username
 * @returns {*}
 */
function viewFollowing(username)
{
    let data = readUsersDatabase();
    return data[username].following;
}

/**
 * Gets an aggregated list of the users and those he is following, sorted by time
 *
 * @param username
 */
function viewWall(username)
{
    // Get current users timeline, and will add their messages to anyone they follow next
    let wall = viewTimeline(username);

    // If we have follows, add to wall
    let following = viewFollowing(username);
    if(following.length > 0)
    {
        // Get each person we are following and
        for (const followee of following)
        {
            let other_timeline = viewTimeline(followee);
            Array.prototype.push.apply(wall, other_timeline);
        }

        // Sort by timestamp
        wall.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : -1)
    }

    return wall;
}

module.exports = { publishToTimeline, viewTimeline, resetUsersDatabase, followUser, viewWall };