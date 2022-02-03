import type { Page } from '@playwright/test';

import { test } from '@playwright/test';
import { createModel } from '@xstate/test';

import { machine, events } from './babySitter'

const getAction = (eventName: string) => ({
  exec: async (page: Page) => {
    const btn = page.locator(`[data-test-id=events-container] button:has-text("${eventName}")`);
    await btn.click();
  }
})

const wait3sec = {
  exec: async (page: Page) => {
    await page.waitForTimeout(3000);
  }
}

const testModel = createModel(machine)
  .withEvents(Object.keys(events)
    .reduce((acc, eventName) => {
      acc[eventName] = eventName === '３秒経過'
        ? wait3sec
        : getAction(eventName)
      return acc
    }, {})
  );

test.describe('子守ごっこ', () => {
  const plans = testModel.getSimplePathPlans();
  
  plans.forEach((plan) => {
    plan.paths.forEach((path) => {
      test(path.description, async ({ page }) => {
        await page.goto('/');
        await path.test(page);
      })
    })
  });

  test('should have full coverage', () => {
    return testModel.testCoverage();
  });
});