Link to Pitch Video: https://www.youtube.com/watch?v=V3TOyucUdJ0
Link to Video Demonstration: https://www.youtube.com/watch?v=PCgK6rp18DI
Link for aws link:  http://ec2-3-86-45-18.compute-1.amazonaws.com:3000/
	existing login credetials:
		username: admin
		password: Password123@
	(for device use device name: particle Ashton)

-----------------------------------------------------------------------------------------------------------------------------------

How to run the project

To run the project you will need to use the command npm install in the WebPage folder.
Then run the command node app.js to start the server.
Connect to the site localhost:3001 (port 3000 caused errors on the aws).
The display page will not work as no devices are connected, must have device data to display data.
However the rest of the functionality will exist.

-----------------------------------------------------------------------------------------------------------------------------------
Server Implementation Description
/api/account/ endpoints implemented in login.js, reset.js, signup.js, display.js
/api/devices/ endpoints implemented in device.js, display.js

routes/account.js
POST /api/account/signUp
	Function:
		Creates an account
	Requirements:
		Email not already signed up
		Password is strong
	Response:
		Success:
			201 status code
			JSON of format: {success: true, message: "Customer (${req.body.email}) account had been created."}
		Account with email already exists:
			401 status code
			JSON of format: {success: false, msg: "This email already used"}
		Password is weak:
			400 status code
			JSON of format: {success: false, message: "err_password"}
		Could not access database:
			400 status code
			JSON of format: {success: false, err: err}

POST /api/account/logIn
	Function:
		Logs into account and creates token for x-auth
	Requirements:
		Email and password fields filled
		Account exists
	Response:
		Success:
			201 status code
			JSON of format: {success:true, token: token, msg: "Login success" }
		Fields empty:
			401 status code
			JSON of format: { error: "Missing email and/or password"}
		Account does not exist:
			400 status code
			JSON of format: { error: "Login failure!!"}
		Could not access database:
			400 status code
			JSON of format: {success: false, err: err}
		Wrong email or password:
			401 status code
			JSON of format: { success:false, msg: "Email or password invalid."}

PUT /api/account/reset
	Function:
		reset password
	Requirements:
		Logged into an account
		Authentication token in the x-auth header
	Response:
		Success:
			201 status code
			JSON of format: { success: true, message: "Password reset successfully" }
		Missing x-auth:
			401 status code
			JSON of format: { success: false, message: "Missing password or x-auth" }
		Account not found:
			400 status code
			JSON of format: {success: false, message: "Failed to authenticate user."}
		Could not access server:
			500 status code
			JSON of format: {success: false, message: "Server failed to reset password"}

GET /api/account/status
	Function:
		fetch authentication token
	Requirements:
		Logged into an account
		Authentication token in the x-auth header
	Response:
		Success:
			200 status code
			JSON of format: users
		Missing x-auth:
			401 status code
			JSON of format: { success: false, message: "Missing password or x-auth" }
		Invalid token:
			401 status code
			JSON of format: { success: false, message: "Invalid JWT" }
		Could not access server:
			400 status code
			JSON of format: { success: false, message: "Error contacting DB. Please contact support." }
<------------------------------------------------------------------------------------------------------------------------------->
routes/devices.js
POST /api/devices/device
	Function:
		Register device to account
	Requirements:
		Authentication token in x-auth header
		All fields filled (device ID, device token, device name)
	Response:
		Success:
			201 status code
			JSON of format: { success: true, msg: "Device Added" }
		Any field empty:
			401 status code
			JSON of format: { success: false, msg: "Missing device info"}
		Missing x-auth:
			400 status code
			JSON of format: { success: false, msg: "Missing x-auth" }
		Could not access server:
			500 status code
			JSON of format: { success: false, msg: "Server error"}
		Device already registered:
			400 status code
			JSON of format: { success: false, msg: "Device already registerd" }
		Could not find account:
			400 status code
			JSON of format: { success: false, msg: "User could not be found" }

DELETE /api/devices/device
	Function:
		Remove device from account
	Requirements:
		Authentication token in x-auth header
		Device name field filled
		Device registered
	Response:
		Success:
			201 status code
			JSON of format: { success: true, msg: "Device Removed" }
		Device field empty:
			401 status code
			JSON of format: { success: false, msg: "Missing device info"}
		Missing x-auth:
			400 status code
			JSON of format: { success: false, msg: "Missing x-auth" }
		Could not access server:
			500 status code
			JSON of format: { success: false, msg: "Server error"}
		Device not registered:
			400 status code
			JSON of format: { success: false, msg: "Could not find device" }
		Could not find account:
			401 status code
			JSON of format: { success: false, msg: "User could not be found" }

GET /api/devices/device
	Function:
		Find all devices registered to user
	Requirements:
		Authentication token in x-auth header
		Devices registered
	Response:
		Success:
			201 status code
			myJson = json array of all registered devices
			JSON of format: {success: true, param: myJson}
		Device field empty:
			401 status code
			JSON of format: { success: false, msg: "Missing device info"}
		Missing x-auth:
			400 status code
			JSON of format: {success:false, msg: "Missing x-auth or device name"}
		Could not access server:
			500 status code
			JSON of format: { success: false, msg: "Server error"}
		No devices registered:
			400 status code
			JSON of format: {success: false, msg: "User has no devices"}
		Could not find account:
			401 status code
			JSON of format: { success: false, msg: "User could not be found" }
<------------------------------------------------------------------------------------------------------------------------------->
