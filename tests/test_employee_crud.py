import re
from playwright.sync_api import Page, Playwright, sync_playwright, expect

# Each function creates an isolated browser context
def test_has_title(page: Page):
    page.goto("http://localhost:3000/dashboard/employee")
    # === Create an Employee ===
    page.get_by_role("main").get_by_role("button", name="Toggle Sidebar").click()
    page.get_by_role("button", name="Add New Employee").click()
    page.get_by_placeholder("xxxxx-xxxxxxx-x").click()
    page.get_by_placeholder("xxxxx-xxxxxxx-x").fill("1234567892345")
    page.get_by_placeholder("Enter first name").click()
    page.get_by_placeholder("Enter first name").fill("Test Name")
    page.get_by_placeholder("Enter first name").press("Tab")
    page.get_by_placeholder("Enter last name").fill("Test Last Name")
    page.get_by_placeholder("Enter last name").press("Tab")
    page.get_by_label("Employee Type").click()
    page.get_by_label("Driver").click()
    page.get_by_placeholder("Enter address").click()
    page.get_by_placeholder("Enter address").fill("test address")
    page.get_by_placeholder("xxxx-xxxxxxx", exact=True).click()
    page.get_by_placeholder("xxxx-xxxxxxx", exact=True).fill("03211234567")
    page.get_by_text("CNICFirst NameLast").click()
    page.get_by_label("Hire Date").fill("2024-12-30")
    page.get_by_label("Employee Status").click()
    page.get_by_label("Active", exact=True).click()
    page.get_by_label("Date of Birth").fill("2024-12-24")
    page.get_by_placeholder("Enter any additional notes").click()
    page.get_by_placeholder("Enter any additional notes").fill("Test Notes")
    page.get_by_role("button", name="Submit").click()

    # === Search for the Employee === 
    page.get_by_placeholder("Search").click()
    page.get_by_placeholder("Search").fill("Test Name")
    page.goto("http://localhost:3000/dashboard/employee?q=Test+Name&page=1")

    # === Test Employee exists ===
    test_name = page.get_by_role("cell", name="Test Name Test Last Name")
    expect(test_name).to_have_text("Test Name Test Last Name")

    # === Delete the employee ===
    page.get_by_role("row", name="1 Test Name Test Last Name").get_by_role("img").nth(1).click()
    page.get_by_role("button", name="Continue").click()

    # === Test the employee is deleted ===
    expect(page.get_by_role("cell", name="No results.")).to_be_visible()