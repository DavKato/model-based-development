import type { TestModel } from '@xstate/test';
import type { TestContext, SetupFn, CTXConsumer } from '../../types';

import MBTReady from './Ready';

class MBTEventRegisterPhase<CTX extends TestContext> {
	constructor(private model: TestModel<CTX, any>, private setup: SetupFn<CTX>) {}

	public registerEvents(events: CTXConsumer<CTX>) {
		// const registerableEvents = this.transformEvents(events);
		return new MBTReady<CTX>(this.model.withEvents(events), this.setup);
	}
}

export default MBTEventRegisterPhase;
