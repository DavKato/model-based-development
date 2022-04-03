# Simple model-based-development example using xstate (and svelte, playwright)

- [Simple model-based-development example using xstate (and svelte, playwright)](#simple-model-based-development-example-using-xstate-and-svelte-playwright)
  - [About](#about)
  - [Concept of model-based development](#concept-of-model-based-development)
  - [Running tests](#running-tests)
  - [Writing tests](#writing-tests)
  - [Extra tip](#extra-tip)
    - [Controlling test generation](#controlling-test-generation)

## About

This example was originally written for a lightning talk in Japanese Svelte meetup.
[Youtube link](https://youtu.be/LMRtvOEboPY)

I noticed a few comments on the video asking for an English translation.
Instead of recording/writing a translation for the video, I decided to

1. Update the code to English
2. Explain my idea about model-based development in this doc.

## Concept of model-based development

The idea is not about actual code implementation.
You may or may not use xstate in your production code, it doesn't matter.
It is about having a same idea across a organization on how their service should behave.

The goal is to have a documentation that

1. Both tech and non-tech people can understand
2. Doesn't rot

To achieve 1, we use state chart to represent the specification. This is what reffered as a **model**.

![model](assets/baby-sitter-model.png)

Document/code rotting happens when that piece of data is not maintained, which often happens when it is outside of regular work flow.

To achieve 2, the model is used to create e2e tests for the application (model-based testing).

Say a team wants to implement a new feature, here is an example flow:

1. Product manager and UX designer puts the specification into a model. (Most likely using a no-code tool like [xstate visual editor](https://stately.ai/registry/new)). This model is passed to the lead engineer and will be [imported to the code base](test/suites/babySitter/model.ts).
2. Lead engineer adopts a e2e test using the model by creating [checks](test/suites/babySitter/checks.ts) for each state that need to be tested, connecting actual [events](test/suites/babySitter/events.ts) with events defined in the model, and finally [generating test cases](test/suites/babySitter/index.spec.ts) by putting all together.
3. Engineer team starts implementing the feature. They may or may not use `xstate`, they may use TDD aproach. What ever they do, the branch should only be merged when generated model-based tests have passed.

## Running tests

Run `pnpm test`.

_If Playwright claims about missing dependencies like chrome or whatever, run `pnpm setup:test` and then try again._

## Writing tests

In this code base I created `ModelBasedTest` class to  make it easy to generate tests. Simply press `ctrl space`  and follow the method listed by Typescript.

```ts
import { ModelBasedTest, test } from '@t/helpers';

test.describe('hey!', () => {
  new ModelBasedTest(model, config, implementation?)
    .setup(setup)
    .registerChecks(checks)
    .registerEvents(events)
    .generateShortestPath()
    .withCoverage();
})
```

## Extra tip

### Controlling test generation

When generating tests with `shortestPath` or `simplePath`, you can still control the generation inderectly by controlling `machine.context`. This is the case, since `unique state` that `@xstate/test` sees is actually a combination of `state` and `context`.

```ts
const config = {
  initial: 'one',
  context: { key: 0 },
  states: {
    one: {
      on: { NEXT: { target: 'two' } },
      exit: model.assign({ key: 0 })
    },
    two: {
      on: {
        // Here transition from 'two' to 'one' won't be tested if you don't make any change to the context, since 'one' is already marked as visited.
        PREV: { target: 'one', actions: model.assign({ key: 1 }) },
        NEXT: { target: 'three' }
      },
      // You want to reset the context (key) when leaving the state that has been `forced` to test, otherwise other states will become unique as well.
      exit: model.assign({ key: 0 })
    },
    three: {
      on: {
        PREV: { target: 'two', actions: model.assign({ key: 1 }) },
        // Here we are assigning 2 instead of 1, which makes this transition unique. { state: 'one', context: { key: 2 } }
        RESTART: { target: 'one', actions: model.assign({ key: 2 }) }
      }
    },
  }
}
```

In the case of `babySitter`, if you remove the context `isSleepy` from the `model` and it's `implementations`, a lesser tests will be generated.
