import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button Triggering AJAX Request").click();
  // override test timeout for particular test suite
  testInfo.setTimeout(testInfo.timeout + 2000);
});

test("auto waiting", async ({ page }) => {
  const successText = page.locator(".bg-success");

  // first way
  // const text = await successText.textContent();
  // expect(text).toEqual("Data loaded with AJAX get request.");

  // second way
  // await successText.waitFor({ state: "attached" });
  // const text = await successText.allTextContents();
  // expect(text).toContain("Data loaded with AJAX get request.");

  // third way
  await expect(successText).toHaveText("Data loaded with AJAX get request.", {
    timeout: 20000,
  });
});

test("altnerative tests", async ({ page }) => {
  const successText = page.locator(".bg-success");

  // first alternative - waitForSelector
  // await page.waitForSelector(".bg-success");

  // second alternative - wait for particular response
  // await page.waitForResponse("http://uitestingplayground.com/ajaxdata");

  await page.waitForLoadState("networkidle");

  const text = await successText.allTextContents();
  expect(text).toContain("Data loaded with AJAX get request.");
});

test("timeouts", async ({ page }) => {
  // test.setTimeout(10000); // override test timeout
  test.slow(); // increase default timeout by three times
  const successText = page.locator(".bg-success");
  // override action timeout
  await successText.click({ timeout: 16000 });
});
