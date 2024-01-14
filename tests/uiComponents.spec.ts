import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200");
});

test.describe("form Layouts Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  test("input fields", async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator("nb-card", { hasText: "Using the Grid" })
      .getByRole("textbox", { name: "Email" });

    await usingTheGridEmailInput.fill("test@test.com");
    await usingTheGridEmailInput.clear();
    // simulate keystore
    await usingTheGridEmailInput.pressSequentially("test2@test.com", {
      delay: 500,
    });

    // generic assertion
    const textContent = await usingTheGridEmailInput.inputValue();
    expect(textContent).toEqual("test2@test.com");

    // locator assertion
    await expect(usingTheGridEmailInput).toHaveValue("test2@test.com");
  });

  test("radio buttons", async ({ page }) => {
    const usingTheGridForm = page.locator("nb-card", {
      hasText: "Using the Grid",
    });

    const optionOne = usingTheGridForm.getByRole("radio", { name: "Option 1" });
    const optionTwo = usingTheGridForm.getByRole("radio", { name: "Option 2" });

    // generic assertion
    await optionOne.check({ force: true });
    const optionOneStatus = await optionOne.isChecked();
    expect(optionOneStatus).toBeTruthy();
    const optionTwoStatus = await optionTwo.isChecked();
    expect(optionTwoStatus).toBeFalsy();

    // locator assertion
    await optionTwo.check({ force: true });
    await expect(optionTwo).toBeChecked();
    await expect(optionOne).not.toBeChecked();
  });

  test("checkboxes", async ({ page }) => {
    await page.getByText("Modal & Overlays").click();
    await page.getByText("Toastr").click();

    await page
      .getByRole("checkbox", { name: "Hide on click" })
      .uncheck({ force: true });
    await page
      .getByRole("checkbox", { name: "Prevent arising of duplicate toast" })
      .check({ force: true });

    // convert collection to array
    const allBoxes = await page.getByRole("checkbox").all();
    for (const box of allBoxes) {
      box.uncheck({ force: true });
      await expect(box).not.toBeChecked();
    }
  });

  test("lists and dropdowns", async ({ page }) => {
    const dropdownMenu = page.locator("ngx-header nb-select");
    await dropdownMenu.click();

    // page.getByRole("list"); when the list has UL tag
    // page.getByRole("listitem"); when the list has LI tag

    const optionList = page.locator("nb-option-list nb-option");
    await expect(optionList).toHaveText([
      "Light",
      "Dark",
      "Cosmic",
      "Corporate",
    ]);
    await optionList.filter({ hasText: "Cosmic" }).click();
    const header = page.locator("nb-layout-header");
    await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");

    const colors = {
      Light: "rgb(255, 255, 255)",
      Dark: "rgb(34, 43, 69)",
      Cosmic: "rgb(50, 50, 89)",
      Corporate: "rgb(255, 255, 255)",
    };

    for (const [color, value] of Object.entries(colors)) {
      await dropdownMenu.click();
      await optionList.filter({ hasText: color }).click();
      await expect(header).toHaveCSS("background-color", value);
    }
  });

  test("tooltips", async ({ page }) => {
    await page.getByText("Modal & Overlays").click();
    await page.getByText("Tooltip").click();

    const toolTipCard = page.locator("nb-card", {
      hasText: "Tooltip Placements",
    });
    await toolTipCard.getByRole("button", { name: "Top" }).hover();

    // page.getByRole("tooltip"); if we have a role tooltip created
    const tooltip = await page.locator("nb-tooltip").textContent();
    expect(tooltip).toEqual("This is a tooltip");
  });

  test("dialog box", async ({ page }) => {
    await page.getByText("Tables & Data").click();
    await page.getByText("Smart Table").click();

    page.on("dialog", (dialog) => {
      expect(dialog.message()).toEqual("Are you sure you want to delete?");
      dialog.accept();
    });

    await page
      .getByRole("table")
      .locator("tr", { hasText: "mdo@gmail.com" })
      .locator(".nb-trash")
      .click();
    await expect(page.locator("table tr").first()).not.toHaveText(
      "mdo@gmail.com"
    );
  });
});
