package global

import "fmt"

// Global User
// userObject = { "user_id":"topic_id", ... }
var UserActiveInTopic map[string]string = map[string]string{}

// Global Topic
// topicObject = { "topic_id": ["user_id", "user_1", ... ], ...}
var GlobalTopic map[string][]string = map[string][]string{}

func GenerateSVGByLetter(letter string, size int) string {
	// Calculate the font size based on the overall size (e.g., 36px for a 64px box)
	fontSize := size * 36 / 64

	// Create SVG string with dynamic size
	svg := fmt.Sprintf(`
	<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">
		<rect width="%d" height="%d" fill="none" stroke="#000" stroke-width="0"/>
		<text x="50%%" y="50%%" font-size="%d" text-anchor="middle" fill="black" dy=".35em">%s</text>
	</svg>
	`, size, size, size, size, size, size, fontSize, letter)

	return svg
}
