import { test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test("Locator syntax rules", async ({ page }) => {
  // await page.locator("input").first().click();
  // await page.getByRole("textbox", { name: "Email" }).first().click();
  // await page.getByRole("button", { name: "Sign in" }).first().click();

  // await page.getByLabel("Email").first().click();
  // await page.getByPlaceholder("Jane Doe").click();
  // await page.getByText("Using the Grid").click();
  // await page.getByTitle("IoT Dashboard").click();
  // await page.getByTestId("emailInput").click();

  await page.getByTestId("SignIn").click();
});
