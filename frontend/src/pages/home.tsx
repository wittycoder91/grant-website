import { Helmet } from 'react-helmet-async';

import { CONFIG } from '@/config-global';

import { OverviewAnalyticsView } from '@/sections/overview/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Dashboard - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <OverviewAnalyticsView />
    </>
  );
}
