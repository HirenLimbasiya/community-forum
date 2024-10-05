package api

import (
	"community-forum-backend/global"
	"community-forum-backend/types"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

func RegisterAuthRoutes(app *fiber.App) {
	app.Static("/avatar", "./uploads/avatar")
	app.Post("/api/registeruser", handleRegister)
	app.Post("/api/login", handleLogin)
	app.Get("/api/email-test", handleEmail)
	app.Get("/avatar/:letter/:size", handleGenerateAvatar)
}

func handleRegister(c *fiber.Ctx) error {
	var user types.CreateUser
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Check if email already exists
	_, err := Store.User.GetByEmail(c.Context(), user.Email)
	if err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Email already in use"})
	} 
	// else if err != mongo.ErrNoDocuments {
	// 	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to check email"})
	// }

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
	}
	user.Password = string(hashedPassword)

	username := strings.Split(user.Email, "@")[0]
	user.Username = username
	userID, err := Store.User.Create(c.Context(), user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	token, err := GenerateJWT(userID, user.Name, user.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.JSON(fiber.Map{"token": token})
}

func handleLogin(c *fiber.Ctx) error {
	var loginData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&loginData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	user, err := Store.User.GetByEmail(c.Context(), loginData.Email)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid email or password"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve user"})
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginData.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid email or password"})
	}

	token, err := GenerateJWT(user.ID.Hex(), user.Name, user.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	// chack user in globalusers
	_, ok := global.UserActiveInTopic[user.ID.Hex()]
	if !ok {
		// add user in globalusers
		global.UserActiveInTopic[user.ID.Hex()] = ""
	}

	return c.JSON(fiber.Map{"token": token})
}

func handleEmail(c *fiber.Ctx) error {
	// On user Register send email function
	response, err := handleSendEmail("Dev", "bajiya4442@gmail.com", "9876543210", "dev01", "1234")
	if err != nil {
		log.Fatalf("Error sending email: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to send email"})
	}

	fmt.Println("Response from server:", response)
	return c.JSON(fiber.Map{"message": "Send"})
}

func handleSendEmail(name, email, number, username, myPassword string) (string, error) {
	// Define the email template with inline CSS
	template := fmt.Sprintf(`
	<div style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
		<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border: 1px solid #dddddd; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
			<p style="font-size: 18px; font-weight: bold; color: #333333; margin-bottom: 20px;">Dear %s,</p>
			<p>Greetings from <strong><i>Dev Tech Education!</i></strong></p>
			<p>Hope you are doing well. Below are your login credentials and important details:</p>
			<table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
				<tr>
					<td style="padding: 10px; border: 1px solid #dddddd;"><strong>Username:</strong></td>
					<td style="padding: 10px; border: 1px solid #dddddd;">%s</td>
				</tr>
				<tr>
					<td style="padding: 10px; border: 1px solid #dddddd;"><strong>Password:</strong></td>
					<td style="padding: 10px; border: 1px solid #dddddd;">%s</td>
				</tr>
				<tr>
					<td style="padding: 10px; border: 1px solid #dddddd;"><strong>Course Platform Link:</strong></td>
					<td style="padding: 10px; border: 1px solid #dddddd;">
						<a href="https://dev.com" target="_blank" style="color: #2980B9; text-decoration: none;">Visit Platform</a>
					</td>
				</tr>
			</table>
			<a href="https://dev.com" target="_blank" style="display: inline-block; background-color: #2980B9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: bold; margin: 20px 0;">
				Access Your Course
			</a>
			<p>You can write to us at <a href="mailto:admin@dev.com" target="_blank" style="color: #2980B9; text-decoration: none;">admin@dev.com</a> for any additional information or queries.</p>
			<p style="font-size: 14px; color: #666666; margin-top: 40px;">Regards,<br><strong><i>Team Dev Tech Education</i></strong></p>
			<p style="font-size: 12px; color: #999999; text-align: center; margin-top: 40px; border-top: 1px solid #eeeeee; padding-top: 10px;">
				Dev Tech Education &copy; 2024. All rights reserved.
			</p>
		</div>
	</div>`, name, username, myPassword)

	// Create the query parameters
	params := url.Values{}
	params.Add("Name", name)
	params.Add("Email", email)
	params.Add("Number", number)
	params.Add("Template", template)
	params.Add("Subject", "Dev Tech Education Online Course Platform Login Credentials")

	// Build the URL with query parameters
	url := "https://script.google.com/macros/s/ADMIN-TOKEN/exec?" + params.Encode()

	// Perform the GET request
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	// Return the response body as a string
	return string(body), nil
}

func handleGenerateAvatar(c *fiber.Ctx) error {
	letter := c.Params("letter")
	if len(letter) > 1 {
		letter = strings.ToUpper(letter[:1])
	}

	size, err := c.ParamsInt("size")
	if err != nil || size <= 0 {
		size = 150
	}
	// Define the email template with inline CSS
	svg := global.GenerateSVGByLetter(letter, size)
	// Set content type to SVG
	c.Set("Content-Type", "image/svg+xml")

	// Send SVG response
	return c.SendString(svg)
}
