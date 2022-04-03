import type { Model } from 'xstate/lib/model.types';
import type { Config, TestContext, Implementations, SetupFn, CTXConsumer } from '../../types';

import { createModel } from '@xstate/test';
import MBTEventRegisterPhase from './EventRegisterPhase';

class MBTCheckRegisterPhase<M extends Model<any, any, any, any>, CTX extends TestContext> {
	constructor(
		private machineModel: M,
		private machineConfig: Config<M>,
		private implementations: Implementations<M> | {},
		private setup: SetupFn<CTX>
	) {}

	public registerChecks(checks: CTXConsumer<CTX>) {
		this.assignChecks(checks);

		const model = this.buildModel();

		return new MBTEventRegisterPhase<CTX>(model, this.setup);
	}

	private assignChecks(checks: CTXConsumer<CTX>) {
		Object.entries(checks).forEach(([statePath, testcase]) => {
			let node = this.machineConfig;

			statePath.split('.').forEach((path) => {
				node = node.states[path];

				if (!node) {
					throw new Error(`State node not found:\n${path} in ${statePath} for ${this.machineConfig.id}`);
				}
			});

			node.meta = { test: testcase };
		});
	}

	private buildModel() {
		const machine = this.machineModel.createMachine(this.machineConfig, this.implementations);

		return createModel(machine);
	}
}

export default MBTCheckRegisterPhase;
