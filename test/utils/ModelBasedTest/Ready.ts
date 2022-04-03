import type { TestModel } from '@xstate/test';
import type { TestContext, SetupFn } from '../../types';

import { test } from '@playwright/test';

class MBTReady<CTX extends TestContext> {
	constructor(private SUT: TestModel<CTX, any>, private setup: SetupFn<CTX>) {}

	generateShortestPath() {
		this.SUT.getShortestPathPlans().forEach((plan) => this.generetePlans(plan));
		return this;
	}

	generateSimplePath() {
		this.SUT.getSimplePathPlans().forEach((plan) => this.generetePlans(plan));
		return this;
	}

	withCoverage() {
		test('should have full coverage', () => this.SUT.testCoverage({ filter: (node) => !!node.meta }));
		return this;
	}

	private generetePlans(plan: ReturnType<typeof this.SUT['getPlanFromEvents']>): void {
		plan.paths.forEach((path) => {
			test(path.description, async ({ page }) => {
				const context = await this.setup({ page });
				await path.test(context);
			});
		});
	}
}

export default MBTReady;
