import { createHmac } from 'crypto';
import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Send to Hive Mesh',
  key: 'sendToHiveMesh',
  description:
    'Pushes an event back to THEHIVE (POST /v11/hive/dispatch), HMAC-signed ' +
    'with the same Hive Signing Secret configured on this connection — closes ' +
    'the loop bidirectionally instead of automatisch only ever receiving dispatches.',
  arguments: [
    {
      label: 'Queen Dispatch URL',
      key: 'queenDispatchUrl',
      type: 'string',
      required: true,
      value: 'https://thehive.sovereignhive.workers.dev/v11/hive/dispatch',
      description: 'THEHIVE endpoint that receives this event.',
      variables: true,
    },
    {
      label: 'Event Type',
      key: 'eventType',
      type: 'string',
      required: true,
      description: 'e.g. task_dispatch, agent_migrated, soul_transfer.',
      variables: true,
    },
    {
      label: 'Payload (JSON)',
      key: 'payload',
      type: 'string',
      required: false,
      value: '{}',
      description: 'Raw JSON object sent as the event payload.',
      variables: true,
    },
  ],

  async run($) {
    const url = $.step.parameters.queenDispatchUrl;
    const eventType = $.step.parameters.eventType;
    let payload = {};
    try {
      payload = JSON.parse($.step.parameters.payload || '{}');
    } catch {
      throw new Error('Payload must be valid JSON.');
    }

    const body = JSON.stringify({
      event_type: eventType,
      source_colony: 'automatisch',
      payload,
    });

    const secret = $.auth.data?.hiveSigningSecret;
    const headers = { 'Content-Type': 'application/json' };
    if (secret) {
      headers['X-Hive-Signature'] =
        'sha256=' + createHmac('sha256', secret).update(body).digest('hex');
    }

    const response = await $.http.post(url, body, { headers });

    $.setActionItem({
      raw: response.data,
    });
  },
});
