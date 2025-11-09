# Simple Email-Password Authentication Usage

The authentication system now uses **HTTP Basic Authentication** instead of OAuth2. This means you can authenticate directly with email and password without needing to get a token first.

## How It Works

Protected routes now accept email and password directly via HTTP Basic Authentication headers.

## Usage Examples

### Using curl

```bash
# Get current user info
curl -u "test@example.com:TestPassword123!" http://localhost:8000/api/auth/me

# Get user profile
curl -u "test@example.com:TestPassword123!" http://localhost:8000/api/users/me
```

### Using Python requests

```python
import requests

email = "test@example.com"
password = "TestPassword123!"

# Make authenticated request
response = requests.get(
    "http://localhost:8000/api/auth/me",
    auth=(email, password)
)

print(response.json())
```

### Using JavaScript/Fetch

```javascript
const email = "test@example.com";
const password = "TestPassword123!";

// Create base64 encoded credentials
const credentials = btoa(`${email}:${password}`);

fetch("http://localhost:8000/api/auth/me", {
  headers: {
    "Authorization": `Basic ${credentials}`
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

### Using Postman

1. Go to the **Authorization** tab
2. Select **Basic Auth** type
3. Enter:
   - **Username**: `test@example.com`
   - **Password**: `TestPassword123!`
4. Send the request

## Login Endpoint (Optional)

The `/api/auth/login` endpoint still exists and returns JWT tokens if you prefer token-based authentication. However, protected routes now use Basic Auth directly, so tokens are optional.

## Security Note

HTTP Basic Auth sends credentials with every request. For production, consider:
- Using HTTPS only
- Or switching back to token-based authentication (JWT) for better security

