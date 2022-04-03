import type { EventFrom, ContextFrom, MachineOptions, MachineConfig } from 'xstate';
import type { Page } from '@playwright/test';

export interface TestContext {
	page: Page;
}

export type Config<Model> = MachineConfig<ContextFrom<Model>, any, EventFrom<Model>>;

export type SetupFn<CTX extends TestContext = TestContext> = (ctx: TestContext) => Promise<CTX>;

export type CTXConsumer<CTX extends TestContext = TestContext> = Record<string, (ctx: CTX) => Promise<void>>;

export type Implementations<TModel> = Partial<MachineOptions<ContextFrom<TModel>, EventFrom<TModel>>>;
