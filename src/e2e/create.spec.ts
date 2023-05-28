import { test, expect, Page } from "@playwright/test";
import { randomUUID } from "crypto";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.click("text=Sign in");

  await expect(page).toHaveURL("http://localhost:3000/sign-in");

  await page
    .getByRole("button", { name: "Sign in with Google Continue with Google" })
    .click();

  await page
    .getByRole("textbox", { name: "Email or phone" })
    .fill(process.env.EMAIL ?? "");

  await page.getByRole("button", { name: "Next" }).click();

  await page
    .getByRole("textbox", { name: "Enter your password" })
    .fill(process.env.PASSWORD ?? "");

  const passwordNextButton = await page.$("#passwordNext");
  await passwordNextButton?.click();

  await page.waitForSelector("#goToResults", { state: "visible" });
  await page.getByRole("link", { name: "Go To Results" }).click();
});

test("should sign in, add three winners, delete all winners", async ({
  page,
}) => {
  await page.waitForSelector("#winnerForm", {
    state: "visible",
  });
  await page.waitForSelector("#winnerList", { state: "visible" });

  await AddWinner(page);
  await AddWinner(page);
  await AddWinner(page);

  do {
    const btn = page.getByRole("button").filter({ hasText: "Delete" }).first();
    await btn?.click();

    // wait until all buttons are not disabled
    await page.waitForFunction(() => {
      const buttons = Array.from(
        document.querySelectorAll("#button-delete-winner")
      );
      return buttons
        .map((b) => b as HTMLButtonElement)
        .every((button) => !button.disabled);
    });
  } while (
    (await page.getByRole("button").filter({ hasText: "Delete" }).count()) > 0
  );

  await expect(page.locator(".text-center.py-4")).toHaveText(
    "No winners yet, please add one."
  );
});

async function AddWinner(page: Page) {
  const winnerGuid = randomUUID();
  const animalGuid = randomUUID();
  const artistGuid = randomUUID();
  await FillOutForm(
    page,
    `winner-${winnerGuid}`,
    `animal-${animalGuid}`,
    `artist-${artistGuid}`
  );

  // Wait until the button is visible
  await page.waitForSelector("#addWinnerButton", { state: "visible" });
  await page.getByRole("button", { name: "Add Result" }).click();

  // Wait until the buttons that say "Submitting..." are gone
  await page.waitForFunction(() => {
    const buttons = Array.from(document.querySelectorAll("#addWinnerButton"));
    return !buttons.some((button) => button.textContent === "Submitting...");
  });

  // check that the cell content are in the right order
  expect(
    await page
      .getByRole("row")
      .filter({ has: page.getByRole("cell", { name: `winner-${winnerGuid}` }) })
      .textContent()
  ).toBe(`animal${animalGuid}winner-${winnerGuid}artist${artistGuid}`);

  await AssertWinnerExistsInTable(page, winnerGuid, animalGuid, artistGuid);
}

async function FillOutForm(
  page: Page,
  winner: string,
  animal: string,
  artist: string
) {
  await page.getByPlaceholder("Winner").click();
  await page.getByPlaceholder("Winner").fill(winner);
  await page.getByPlaceholder("Animal").click();
  await page.getByPlaceholder("Animal").fill(animal);
  await page.getByPlaceholder("Artist").click();
  await page.getByPlaceholder("Artist").fill(artist);
}

async function AssertWinnerExistsInTable(
  page: Page,
  winnerGuid: string,
  animalGuid: string,
  artistGuid: string
) {
  expect(
    page.getByRole("cell", { name: `winner-${winnerGuid}` }).isVisible()
  ).toBeTruthy();
  expect(
    page.getByRole("cell", { name: `animal-${animalGuid}` }).isVisible()
  ).toBeTruthy();
  expect(
    page.getByRole("cell", { name: `artist-${artistGuid}` }).isVisible()
  ).toBeTruthy();
}
