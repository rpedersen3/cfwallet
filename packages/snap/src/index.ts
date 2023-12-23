import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { panel, text } from '@metamask/snaps-sdk';

import { getCurrentAccount } from './account';
import { Account, IdentitySnapParams } from './interfaces';
import { getAccountInfo } from './rpc/account/getAccountInfo';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {

  let state = await getSnapStateUnchecked(snap);
  if (state === null) {
    state = await init(snap);
  }
  console.log('state:', JSON.stringify(state, null, 4));

  let extraData: unknown;

  isValidMetamaskAccountParams(request.params);


  let isExternalAccount = false;
  const account: Account = await getCurrentAccount(
    state,
    request.params,
    isExternalAccount,
  );
  account.extraData = extraData;

  console.log(`Current account: ${JSON.stringify(account, null, 4)}`);

  const identitySnapParams: IdentitySnapParams = {
    origin,
    snap,
    state,
    metamask: ethereum,
    account,
  };





  switch (request.method) {
    case 'get-account-info':
      return await getAccountInfo(identitySnapParams);
      /*
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`get-account-info, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });
      */
    default:
      throw new Error('Method not found.');
  }
};
