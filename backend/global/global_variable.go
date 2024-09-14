package global

// Global User
// userObject = { "user_id":"topic_id", ... }
var UserActiveInTopic map[string]string = map[string]string{}

// Global Topic
// topicObject = { "topic_id": ["user_id", "user_1", ... ], ...}
var GlobalTopic map[string][]string = map[string][]string{}
