"""
Test script for testing the test user authentication
Run this script to test the test user login and authenticated endpoints
"""
import requests
import json

# Test user credentials (from migration file)
TEST_USER_EMAIL = "test@example.com"
TEST_USER_PASSWORD = "TestPassword123!"

# API base URL
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
ME_URL = f"{BASE_URL}/api/auth/me"


def test_login():
    """Test login with test user credentials"""
    print("=" * 60)
    print("Testing Login Endpoint")
    print("=" * 60)
    
    login_data = {
        "email": TEST_USER_EMAIL,
        "password": TEST_USER_PASSWORD
    }
    
    print(f"\nRequest URL: {LOGIN_URL}")
    print(f"Request Body: {json.dumps(login_data, indent=2)}")
    
    try:
        response = requests.post(LOGIN_URL, json=login_data)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data.get("access_token")
            print(f"\n✓ Login successful!")
            print(f"Access Token: {access_token[:50]}...")
            return access_token
        else:
            print(f"\n✗ Login failed!")
            return None
            
    except requests.exceptions.ConnectionError:
        print("\n✗ Error: Could not connect to server.")
        print("Make sure the FastAPI server is running on http://localhost:8000")
        return None
    except Exception as e:
        print(f"\n✗ Error: {str(e)}")
        return None


def test_get_current_user(access_token):
    """Test getting current user info with access token"""
    print("\n" + "=" * 60)
    print("Testing Get Current User Endpoint")
    print("=" * 60)
    
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    print(f"\nRequest URL: {ME_URL}")
    print(f"Headers: {json.dumps(headers, indent=2)}")
    
    try:
        response = requests.get(ME_URL, headers=headers)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            user_data = response.json()
            print(f"\n✓ Successfully retrieved user info!")
            print(f"User Email: {user_data.get('email')}")
            print(f"User Name: {user_data.get('first_name')} {user_data.get('last_name')}")
            return True
        else:
            print(f"\n✗ Failed to get user info!")
            return False
            
    except Exception as e:
        print(f"\n✗ Error: {str(e)}")
        return False


def test_invalid_credentials():
    """Test login with invalid credentials"""
    print("\n" + "=" * 60)
    print("Testing Login with Invalid Credentials")
    print("=" * 60)
    
    login_data = {
        "email": TEST_USER_EMAIL,
        "password": "wrongpassword"
    }
    
    print(f"\nRequest URL: {LOGIN_URL}")
    print(f"Request Body: {json.dumps(login_data, indent=2)}")
    
    try:
        response = requests.post(LOGIN_URL, json=login_data)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 401:
            print(f"\n✓ Correctly rejected invalid credentials!")
            return True
        else:
            print(f"\n✗ Unexpected response!")
            return False
            
    except Exception as e:
        print(f"\n✗ Error: {str(e)}")
        return False


def main():
    """Run all authentication tests"""
    print("\n" + "=" * 60)
    print("Authentication Test Suite")
    print("=" * 60)
    print(f"\nTest User Email: {TEST_USER_EMAIL}")
    print(f"Test User Password: {TEST_USER_PASSWORD}")
    
    # Test 1: Login with valid credentials
    access_token = test_login()
    
    if access_token:
        # Test 2: Get current user info
        test_get_current_user(access_token)
    
    # Test 3: Test invalid credentials
    test_invalid_credentials()
    
    print("\n" + "=" * 60)
    print("Test Suite Complete")
    print("=" * 60)


if __name__ == "__main__":
    main()

