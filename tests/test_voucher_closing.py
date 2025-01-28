import re
import pytest
from playwright.sync_api import Page, Playwright, sync_playwright, expect


@pytest.fixture(scope="function")
def browser_context_args():
    return {
        "viewport": {
            "width": 1880,
            "height": 980
        }
    }

@pytest.fixture(scope="function", autouse=True)
def setup(page: Page, browser_context_args):
    print("before the test runs")

    page.goto("http://localhost:3000/")
    page.get_by_placeholder("Enter your email...").click()
    page.get_by_placeholder("Enter your email...").fill("newSubhan@gmail.com")
    page.get_by_placeholder("Enter your password...").click()
    page.get_by_placeholder("Enter your password...").fill("Subh@nPass#144")
    page.get_by_role("button", name="Sign In").click()
    yield
    
    print("after the test runs")

def test_all_field_present(page: Page):
    page.goto("http://localhost:3000/dashboard/employee")
    page.get_by_role("link", name="Add Closing Vouchers").click()
    page.get_by_text("Select Route").click()
    page.get_by_role("option", name="Faisalabad (New Subhan) - Lahore (Skyways-Lahore)").click()
    page.get_by_text("Select Bus Number").click()
    page.get_by_role("option", name="1058").click()
    page.locator("button").filter(has_text="Select Driver").click()
    page.get_by_role("option", name="Muhammad Imtiaz").click()
    page.get_by_placeholder("Enter Voucher Number").click()
    page.get_by_placeholder("Enter Voucher Number").fill("12345")
    page.locator("button").filter(has_text="Select Conductor").click()
    page.get_by_role("option", name="m A").click()
    page.get_by_role("button", name="Add Trip").click()
    page.get_by_role("combobox").click()
    page.get_by_role("option", name="Faisalabad (New Subhan) - Lahore (Skyways-Lahore)").click()
    page.get_by_label("Full Ticket Count").click()
    page.get_by_label("Full Ticket Count").fill("10")
    page.get_by_label("Full Ticket Count").press("Tab")
    page.get_by_placeholder("Enter half ticket count").fill("3")
    page.get_by_placeholder("Enter half ticket count").press("Tab")
    page.get_by_placeholder("Enter free ticket count").fill("2")
    page.get_by_placeholder("Enter free ticket count").press("Tab")
    page.get_by_placeholder("Enter the reference").fill("Friend of us")
    page.get_by_placeholder("Enter the reference").press("Tab")
    page.get_by_placeholder("Enter load Earning").fill("100")
    page.get_by_placeholder("Enter load Earning").press("Tab")
    page.get_by_label("Reward Commission").fill("100")
    page.get_by_label("Reward Commission").press("Tab")
    page.get_by_label("Refreshment Expense").fill("100")
    page.get_by_label("Refreshment Expense").press("Tab")
    page.get_by_placeholder("Enter checker expenses").fill("100")
    page.get_by_placeholder("Enter checker expenses").press("Tab")
    page.get_by_placeholder("Enter miscellaneous amount").fill("295")
    expect(page.get_by_placeholder("Actual revenue")).to_have_value("8000")
    page.get_by_placeholder("Explain any revenue").click()
    page.get_by_placeholder("Explain any revenue").fill("The value was test value")
    page.get_by_role("button", name="Save").click()
    page.get_by_role("button", name="Generate Voucher").click()
    page.get_by_label("Diesel", exact=True).click()
    page.get_by_label("Diesel", exact=True).fill("1000")
    page.get_by_label("Diesel", exact=True).press("Tab")
    page.get_by_label("Diesel Litres").fill("10")
    page.get_by_label("Diesel Litres").press("Tab")
    page.get_by_label("Alliedmor").press("Tab")
    page.get_by_label("C Oil Technician").press("Tab")
    page.get_by_label("Toll").press("Tab")
    page.get_by_label("Cleaning").press("Tab")
    page.get_by_label("City Parchi").press("Tab")
    page.get_by_label("Refreshment").fill("10")
    page.get_by_label("Refreshment").press("Tab")
    page.get_by_label("Repair").fill("80")
    page.get_by_label("Repair").press("Tab")
    page.get_by_label("Challan").fill("100")
    page.get_by_label("Challan").press("Tab")
    page.get_by_label("Miscellaneous Expense").fill("100")

    expect(page.get_by_label("Revenue")).to_have_value("-6200")

    expect(page.locator("form")).to_contain_text("8,000")
    expect(page.locator("form")).to_contain_text("14,200")
    expect(page.locator("form")).to_contain_text("(6,200)")

    with page.expect_popup() as page1_info:
        page.get_by_role("button", name="Submit").click()
        page.wait_for_timeout(2_000)
    page1 = page1_info.value
    page1.close()

