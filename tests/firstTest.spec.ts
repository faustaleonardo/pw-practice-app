import { expect, test } from "@playwright/test";

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

test("locating child element", async ({ page }) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(':text-is("Option 2")')
    .click();

  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign In" })
    .first()
    .click();

  await page.locator("nb-card").nth(4).getByRole("button").click();
});

test("locationg parent element", async ({ page }) => {
  // common way
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("button")
    .click();
  await page
    .locator("nb-card", { has: page.locator("#inputEmail1") })
    .getByRole("button")
    .click();

  // filter way
  await page
    .locator("nb-card")
    .filter({
      hasText: "Basic form",
    })
    .getByRole("button")
    .click();
  await page
    .locator("nb-card")
    .filter({ has: page.locator(".status-danger") })
    .getByRole("textbox", { name: "Password" })
    .click();
  await page
    .locator("nb-card")
    .filter({ has: page.locator("nb-checkbox") })
    .filter({ hasText: "Sign in" })
    .getByRole("textbox", { name: "Email" })
    .click();

  // xpath way
  await page
    .locator(':text-is("Using the Grid")')
    .locator("..")
    .getByRole("textbox", { name: "Email" })
    .click();
});

test("Reusing the locators", async ({ page }) => {
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });

  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  await emailField.fill("test@test.com");

  const passwordField = basicForm.getByRole("textbox", {
    name: "Password",
  });
  await passwordField.fill("Welcome123");

  await basicForm.locator("nb-checkbox").click();
  await basicForm.getByRole("button").click();

  await expect(emailField).toHaveValue("test@test.com");
});

test("Extracting values", async ({ page }) => {
  // single text value
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const buttonText = await basicForm.locator("button").textContent();
  expect(buttonText).toEqual("Submit");

  // all text values
  const allRadioButtonLabels = await page.locator("nb-radio").allTextContents();
  expect(allRadioButtonLabels).toContain("Option 1");

  // input value
  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  await emailField.fill("test@test.com");
  const emailValue = await emailField.inputValue();
  expect(emailValue).toEqual("test@test.com");

  const placeholderValue = await emailField.getAttribute("placeholder");
  expect(placeholderValue).toEqual("Email");
});

test("Assertions", async ({ page }) => {
  const basicFormButton = page
    .locator("nb-card")
    .filter({ hasText: "Basic Form" })
    .locator("button");

  // general assertions
  const value = 5;
  expect(value).toEqual(5);

  // locator assertion
  await expect(basicFormButton).toHaveText("Submit");

  // soft assertion
  await expect.soft(basicFormButton).toHaveText("Submit5");
  await basicFormButton.click();
});
