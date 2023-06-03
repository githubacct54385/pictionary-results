import { test, expect, Page } from "@playwright/test";
import { randomUUID } from "crypto";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page.getByText('Go To Results')).not.toBeVisible();

  await page.getByRole('link', {name: "Sign in"}).click();

  await expect(page).toHaveURL("http://localhost:3000/sign-in");

  await page.getByLabel('Email address').click();
  await page.getByLabel('Email address').fill(process.env.EMAIL ?? "");
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel('Password', { exact: true }).click();
  await page.getByLabel('Password', { exact: true }).fill(process.env.PASSWORD ?? "");
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page).toHaveURL("http://localhost:3000/");
  await page.waitForSelector("#goToResults", { state: "visible" });
  await page.getByRole("link", { name: "Go To Results" }).click();
});

test("should sign in, add some winners, delete all winners", async ({
  page,
}) => {
  await page.waitForSelector("#winnerForm", {
    state: "visible",
  });
  await page.waitForSelector("#winner-flex-box", { state: "visible" });

  await AddWinner(page);
  await AddWinner(page);
  await AddWinner(page);
  await AddWinner(page);
  await AddWinner(page);
  await AddWinner(page);
  await AddWinner(page);

  await DeleteAllWinners(page);

  await expect(page.locator("#no-winners-text")).toHaveText(
    "No winners yet, please add one."
  );
});

async function DeleteAllWinners(page: Page) {
  do {
    // hover over each #winner-card and click the delete button
    await page.locator("#winner-card").first().hover();
    await page.locator("#winner-delete-button").first().click();

    // wait until all buttons are not disabled
    await page.waitForFunction(() => {
      const buttons = Array.from(
        document.querySelectorAll("#winner-delete-button")
      );
      return buttons
        .map((b) => b as HTMLButtonElement)
        .every((button) => !button.disabled);
    });
  } while (!(await page.locator("#no-winners-text").isVisible()));
}

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

  await expect(page.locator("#winner-flex-box")).toContainText(
    `animal-${animalGuid}`
  );
  await expect(page.locator("#winner-flex-box")).toContainText(
    `Drawn by artist-${artistGuid}`
  );
  await expect(page.locator("#winner-flex-box")).toContainText(
    `Guessed by winner-${winnerGuid}`
  );
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
