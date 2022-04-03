import { test } from '@playwright/test';

import { ModelBasedTest } from '../../utils';
import { model, config, implementations } from './model';
import setup from './setup';
import events from './events';
import checks from './checks';

test.describe('baby sitter', () => {
	new ModelBasedTest(model, config, implementations)
		.setup(setup)
		.registerChecks(checks)
		.registerEvents(events)
		.generateSimplePath()
		.withCoverage();
});
