import defineApp from '../../helpers/define-app.js';
import auth from './auth/index.js';
import triggers from './triggers/index.js';
import actions from './actions/index.js';

// TheHive — native Sovereign Hive mesh integration (2026-07-22).
// Replaces the bolt-on Express router at routes/colony.js's task_dispatch
// handling with a real, first-class automatisch app: hive dispatches become
// native flow triggers instead of an HTTP side-channel flows can't react to.
// routes/colony.js itself stays (it's the /colony/{health,info,manifest,
// agents,capabilities} lifecycle surface — a different, still-needed
// concern from agentic task dispatch).
export default defineApp({
  name: 'TheHive',
  key: 'thehive',
  iconUrl: '{BASE_URL}/apps/thehive/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/thehive/connection',
  supportsConnections: true,
  baseUrl: 'https://thehive.sovereignhive.workers.dev',
  apiBaseUrl: '',
  primaryColor: '#f5a623',
  auth,
  triggers,
  actions,
});
