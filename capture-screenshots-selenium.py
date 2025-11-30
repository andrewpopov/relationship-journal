#!/usr/bin/env python3
"""
Comprehensive Screenshot Capture Script for Relationship Journal
Using Selenium WebDriver

Prerequisites:
1. Install Selenium: pip install selenium
2. Install Chrome WebDriver: pip install webdriver-manager
3. Ensure the app is running on http://localhost:5173
4. Run this script: python capture-screenshots-selenium.py
"""

import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# Configuration
BASE_URL = "http://localhost:5173"
SCREENSHOTS_DIR = os.path.join(os.path.dirname(__file__), "screenshots")
DESKTOP_WIDTH = 1920
DESKTOP_HEIGHT = 1080
MOBILE_WIDTH = 375
MOBILE_HEIGHT = 667

# Ensure screenshots directory exists
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

def setup_driver(width=DESKTOP_WIDTH, height=DESKTOP_HEIGHT):
    """Setup Chrome WebDriver with specified viewport size"""
    chrome_options = Options()
    chrome_options.add_argument(f"--window-size={width},{height}")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.set_window_size(width, height)
    return driver

def wait_for_load(driver, timeout=5):
    """Wait for page to load completely"""
    time.sleep(1)  # Initial wait for animations
    WebDriverWait(driver, timeout).until(
        lambda d: d.execute_script("return document.readyState") == "complete"
    )

def capture_screenshot(driver, filename, description):
    """Capture and save screenshot"""
    filepath = os.path.join(SCREENSHOTS_DIR, filename)
    driver.save_screenshot(filepath)
    print(f"✅ Saved: {filename} - {description}")

def main():
    print("🚀 Starting screenshot capture process...\n")

    # Setup desktop driver
    driver = setup_driver(DESKTOP_WIDTH, DESKTOP_HEIGHT)

    try:
        # 1. Landing/Login Page
        print("📸 Capturing: Landing/Login Page...")
        driver.get(BASE_URL)
        wait_for_load(driver)
        capture_screenshot(driver, "01-landing-login.png", "Initial login page")

        # 2. Register Page
        print("📸 Capturing: Register Page...")
        try:
            register_links = driver.find_elements(By.XPATH, "//a[contains(text(), 'Register')] | //a[@href='/register'] | //button[contains(text(), 'Register')]")
            if register_links:
                register_links[0].click()
                wait_for_load(driver)
                capture_screenshot(driver, "01b-register.png", "Registration page")
                driver.get(f"{BASE_URL}/login")
                wait_for_load(driver)
        except Exception as e:
            print(f"⚠️  Could not navigate to register page: {e}")

        # 3. Login Form Filled
        print("📸 Capturing: Login form filled...")
        try:
            email_input = driver.find_element(By.CSS_SELECTOR, "input[type='email'], input[name='email']")
            password_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")

            email_input.send_keys("test@example.com")
            password_input.send_keys("password123")
            time.sleep(0.5)

            capture_screenshot(driver, "01c-login-filled.png", "Login form with credentials")

            # Try to login
            login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            login_button.click()
            time.sleep(2)

        except Exception as e:
            print(f"⚠️  Could not fill login form: {e}")
            # Try to register instead
            try:
                driver.get(f"{BASE_URL}/register")
                wait_for_load(driver)

                inputs = driver.find_elements(By.CSS_SELECTOR, "input")
                if len(inputs) >= 3:
                    inputs[0].send_keys("Test User")  # name
                    inputs[1].send_keys("Partner Name")  # partner name
                    inputs[2].send_keys("test@example.com")  # email
                    inputs[3].send_keys("password123")  # password

                    register_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
                    register_button.click()
                    time.sleep(2)
            except Exception as reg_error:
                print(f"⚠️  Could not register: {reg_error}")

        # 4. Dashboard
        print("📸 Capturing: Dashboard...")
        driver.get(f"{BASE_URL}/")
        wait_for_load(driver)
        capture_screenshot(driver, "02-dashboard.png", "Main dashboard")

        # 5. Journal Page
        print("📸 Capturing: Journal Page...")
        driver.get(f"{BASE_URL}/journal")
        wait_for_load(driver)
        capture_screenshot(driver, "03-journal.png", "Journal entries page")

        # Try to open new entry
        try:
            new_entry_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'New Entry')] | //button[contains(text(), 'Add Entry')] | //button[contains(text(), 'Create')]")
            if new_entry_buttons:
                new_entry_buttons[0].click()
                time.sleep(1)
                capture_screenshot(driver, "03b-journal-new-entry.png", "New journal entry form")

                # Close modal
                close_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Cancel')] | //button[contains(text(), 'Close')]")
                if close_buttons:
                    close_buttons[0].click()
                    time.sleep(0.5)
        except Exception as e:
            print(f"⚠️  Could not capture new entry modal: {e}")

        # 6. Memories Page
        print("📸 Capturing: Memories Page...")
        driver.get(f"{BASE_URL}/memories")
        wait_for_load(driver)
        capture_screenshot(driver, "04-memories.png", "Memories/photos section")

        # 7. Gratitude Page
        print("📸 Capturing: Gratitude Page...")
        driver.get(f"{BASE_URL}/gratitude")
        wait_for_load(driver)
        capture_screenshot(driver, "05-gratitude.png", "Gratitude prompts page")

        # 8. Goals Page
        print("📸 Capturing: Goals Page...")
        driver.get(f"{BASE_URL}/goals")
        wait_for_load(driver)
        capture_screenshot(driver, "06-goals.png", "Goals section")

        # 9. Questions Page
        print("📸 Capturing: Questions Page...")
        driver.get(f"{BASE_URL}/questions")
        wait_for_load(driver)
        capture_screenshot(driver, "07-questions.png", "Questions feature page")

        # Try to interact with a question
        try:
            question_elements = driver.find_elements(By.CSS_SELECTOR, "[class*='question'], [class*='card'], button")
            if question_elements:
                question_elements[0].click()
                time.sleep(1)
                capture_screenshot(driver, "07b-questions-detail.png", "Question detail view")
        except Exception as e:
            print(f"⚠️  Could not capture question detail: {e}")

        # 10. Mobile Screenshots
        print("\n📱 Switching to mobile viewport...\n")
        driver.quit()
        driver = setup_driver(MOBILE_WIDTH, MOBILE_HEIGHT)

        # Mobile - Login
        print("📸 Capturing: Mobile Login...")
        driver.get(f"{BASE_URL}/login")
        wait_for_load(driver)
        capture_screenshot(driver, "08-mobile-login.png", "Mobile login view")

        # Mobile - Dashboard
        print("📸 Capturing: Mobile Dashboard...")
        driver.get(f"{BASE_URL}/")
        wait_for_load(driver)
        capture_screenshot(driver, "09-mobile-dashboard.png", "Mobile dashboard")

        # Mobile - Journal
        print("📸 Capturing: Mobile Journal...")
        driver.get(f"{BASE_URL}/journal")
        wait_for_load(driver)
        capture_screenshot(driver, "10-mobile-journal.png", "Mobile journal view")

        # Mobile - Questions
        print("📸 Capturing: Mobile Questions...")
        driver.get(f"{BASE_URL}/questions")
        wait_for_load(driver)
        capture_screenshot(driver, "11-mobile-questions.png", "Mobile questions view")

        print("\n✨ Screenshot capture completed successfully!\n")
        print(f"📁 All screenshots saved to: {SCREENSHOTS_DIR}\n")

    except Exception as e:
        print(f"\n❌ Error during screenshot capture: {e}")
        import traceback
        traceback.print_exc()

    finally:
        driver.quit()
        print("Browser closed.")

if __name__ == "__main__":
    main()
