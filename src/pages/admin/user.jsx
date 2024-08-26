import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/admin-table/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> User | Password Manager</title>
      </Helmet>

      <UserView />
    </>
  );
}
