import React from 'react';
import styled from 'react-emotion';
import { useApolloClient } from '@apollo/react-hooks';

import { menuItemClassName } from '../components/menu-item';
import { ReactComponent as ExitIcon } from '../assets/icons/exit.svg';

// Apollo Client also lets you update local data in the cache 
//with either direct cache writes or client resolvers.
// Direct writes are typically used to write simple booleans or strings to the cache
// whereas client resolvers are for more complicated writes 
//such as adding or removing data from a list.
export default function LogoutButton() {
  const client = useApolloClient();
  return (
    <StyledButton
      onClick={() => {
        // direct cache 
        client.writeData({ data: { isLoggedIn: false } });
        localStorage.clear();
      }}
    >
      <ExitIcon />
      Logout
    </StyledButton>
  );
}

const StyledButton = styled('button')(menuItemClassName, {
  background: 'none',
  border: 'none',
  padding: 0,
});