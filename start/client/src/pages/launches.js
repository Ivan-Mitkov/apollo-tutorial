import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { LaunchTile, Header, Button, Loading } from "../components";

// const GET_LAUNCHES = gql`
//   query launchList($after: String) {
//     launches(after: $after) {
//       cursor
//       hasMore
//       launches {
//         id
//         isBooked
//         rocket {
//           id
//           name
//         }
//         mission {
//           name
//           missionPatch
//         }
//       }
//     }
//   }
// `;
// When we have two GraphQL operations that contain the same fields,
// we can use a fragment to share fields between the two.
export const LAUNCH_TILE_DATA = gql`
# We define a GraphQL fragment by giving it a name (LaunchTile)
# and defining it on a type on our schema (Launch). The name we give our fragment
# can be anything, but the type must correspond to a type in our schema.
  fragment LaunchTile on Launch {
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;
const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore

      launches {
        ...LaunchTile
      }
    }

  }
  ${LAUNCH_TILE_DATA}
`;

export default function Launches() {
  // To build a paginated list with Apollo, we first need to destructure the fetchMore
  //function from the useQuery result object:
  const { data, loading, error, fetchMore } = useQuery(GET_LAUNCHES);
  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;

  return (
    <Fragment>
      <Header />
      {data.launches && data.launches.hasMore && (
        <Button
        // Now that we have fetchMore, let's connect it to a Load More button 
        //to fetch more items when it's clicked. To do this, we will need to specify
        // an updateQuery function on the return object from fetchMore
        // that tells the Apollo cache how to update our query with the new items we're fetching.
          onClick={() =>
            fetchMore({
              variables: {
                after: data.launches.cursor
              },
              updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                if (!fetchMoreResult) return prev;
                return {
                  ...fetchMoreResult,
                  launches: {
                    ...fetchMoreResult.launches,
                    launches: [
                      ...prev.launches.launches,
                      ...fetchMoreResult.launches.launches
                    ]
                  }
                };
              }
            })
          }
        >
          Load More
        </Button>
      )}
    </Fragment>
  );
}
