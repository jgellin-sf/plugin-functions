/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { expect, test } from '@oclif/test';
import type { SfTokens } from '@salesforce/core';
import { TokenAccessor } from '@salesforce/core/lib/stateAggregator';
import * as sinon from 'sinon';
import { AuthStubs } from '../../helpers/auth';
import vacuum from '../../helpers/vacuum';

describe('sf logout functions', () => {
  let contents: SfTokens;

  beforeEach(() => {
    AuthStubs.tokensWrite.callsFake(async function (this: TokenAccessor) {
      contents = this.getAll(true);
      return contents;
    });
  });

  test
    .stdout()
    .stderr()
    .command(['logout:functions'])
    .it('removes the functions key from the tokens field on logout', (ctx) => {
      sinon.assert.match(contents, {});
    });
  test
    .stdout()
    .stderr()
    .command(['logout:functions', '--json'])
    .it('will show json output', (ctx) => {
      expect(vacuum(ctx.stdout).replace(/\n[›»]/gm, '')).to.contain(
        vacuum('{\n"status": 0,\n"result": "Logged out",\n"warnings": []\n}')
      );
    });
});
