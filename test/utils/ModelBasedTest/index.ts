import type { Model } from 'xstate/lib/model.types';
import type { Config, TestContext, Implementations, SetupFn } from '../../types';

import MBTCheckRegisterPhase from './CheckRegisterPhase';

export default class ModelBasedTest<M extends Model<any, any, any, any>, CTX extends TestContext> {
	constructor(
		private machineModel: M,
		private machineConfig: Config<M>,
		private implementations: Implementations<M> = {}
	) {}

	public setup(setup: SetupFn<CTX>) {
		return new MBTCheckRegisterPhase(this.machineModel, this.machineConfig, this.implementations, setup);
	}
}
