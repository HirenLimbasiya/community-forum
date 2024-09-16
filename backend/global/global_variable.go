package global

// Global User
// userObject = { "user_id":"topic_id", ... }
var UserActiveInTopic map[string]string = map[string]string{
	"66e52a9c5801dc965db49d02": "test",
}

// Global Topic
// topicObject = { "topic_id": ["user_id", "user_1", ... ], ...}
var GlobalTopic map[string][]string = map[string][]string{"test": {"66e691fde23a50304cdce2e7"}}
