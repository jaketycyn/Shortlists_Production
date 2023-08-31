import type { NextPage } from "next";
import FeaturedMovieItemCard from "../../cards/FeaturedMovieItemCard";
import { useAppSelector } from "../../../hooks/useTypedSelector";
import { trpc } from "../../../utils/trpc";

const MoviePageLayout: NextPage = () => {
  const { lists, loading, featuredLists } = useAppSelector(
    (state) => state.list
  );
  // console.log("featuredLists: ", featuredLists);

  const featuredMovieLists = featuredLists!.filter(
    (l) => l.category === "movies"
  );
  // console.log("featuredMovieLists: ", featuredMovieLists);

  const adminUserId = "cllvfh9nj0006w3jw8qligiap";

  const { data: adminLists } = trpc.userList.getListsByUserId.useQuery({
    userId: adminUserId,
  });

  // loop through list Ids and get items from those lists
  const { data: featuredItems, isLoading: isFeaturedItemsLoading } =
    trpc.userItem.getFeaturedItemsByListId.useQuery({
      userId: adminUserId,
      listIds: featuredLists?.map((list) => list.id) || [],
    });

  return (
    <div className="flex h-screen w-full flex-col ">
      {/* Featured MovieLists Section - Start */}
      <div className="pt-4">
        <p className="font-semiBold items-center pb-4 text-center text-xl">
          Featured Movie Lists
        </p>
        <ul className="grid grid-cols-2 items-center justify-center gap-0 md:grid-cols-3 lg:grid-cols-4">
          {featuredMovieLists && featuredMovieLists.length > 0 ? (
            featuredMovieLists.map((list, index) => (
              <li
                className="col-span-1 items-center justify-center p-0.5"
                key={list.id}
                data-testid={`featured-item-${index}`}
              >
                {list.title ? (
                  <FeaturedMovieItemCard
                    title={list.title}
                    index={index}
                    featuredLists={featuredMovieLists}
                    featuredItems={featuredItems}
                  />
                ) : (
                  <div>No title available for this list</div>
                )}
              </li>
            ))
          ) : (
            <div>No Featured lists Available at this time</div>
          )}
        </ul>
      </div>
      {/* Featured MovieLists Section - End */}
    </div>
  );
};

export default MoviePageLayout;
