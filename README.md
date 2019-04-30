# Example Clover app using Webhooks

## Requirements

- Node.js 10.15.3
- [Clover developer account](https://sandbox.dev.clover.com/developers/)
- [ngrok account](https://ngrok.com)
- Test merchant with inventory items

## Instructions

1) Create a new app in Clover's developer dashboard
2) Clone the repository
3) Create a `.env` file with the following fields populated:

```
PORT=
APP_ID=
APP_SECRET=
MERCHANT_ID=
NGROK_AUTH=
```

4) Run the app: `npm start`
5) Visit `http://localhost:8000` in a web browser and complete the OAuth process
6) Copy the ngrok URL from your terminal and paste it into the Webhook URL field in Webhooks settings in Clover's developer dashboard
6) Click Confirm. You should see a `verificationCode` in the terminal window
7) Copy and paste the `verificationCode` into the Verification Code field in Webhooks settings
8) Click Verify
9) Select the Inventory check box and click Save
10) In Postman, make a POST request `http://localhost:8000/increment_quantity` with the following request body:

```
{
	"id": "",
	"quantity": 100
}
```

Note: make sure you fill out the `id` field with an actual item ID from your test merchant inventory