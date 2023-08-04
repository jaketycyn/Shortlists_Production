import { useEffect, useState } from "react";

interface Item {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  listId: string;
  archive?: string;
  currentRank?: number;
  potentialRank?: number;
}

type ListDisplayTabsProps = {
  nonArchivedItems: Item[];
  isLoading: boolean;
};

function classNames(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function ListDisplayTabs({
  nonArchivedItems,
  isLoading,
}: ListDisplayTabsProps) {
  if (isLoading) {
    // Display a loading indicator
    return <div>Loading...</div>;
  }
  const [items, setItems] = useState<Item[]>(nonArchivedItems);
  const [tabs, setTabs] = useState<
    { name: string; count: number; current: boolean }[]
  >([]);
  // console.log("nonArchiveddItems: ", items);

  useEffect(() => {
    const rankedItems = items.filter((i) => i.currentRank > 0);
    const unRankedItems = items.filter((i) => i.currentRank === 0);

    setTabs([
      { name: "Ranked", count: rankedItems.length, current: true },
      { name: "Unranked", count: unRankedItems.length, current: false },
    ]);
  }, [items]);

  const handleClick = (tabName: string) => {
    setTabs(
      tabs.map((tab) => ({
        ...tab,
        current: tab.name === tabName,
      }))
    );
  };

  const currentTab = tabs.find((tab) => tab.current);
  const displayedItems = currentTab
    ? items
        .filter((item) => {
          const currentRank = item.currentRank || 0;
          if (currentTab.name === "Non Ranked Items") return currentRank === 0;
          if (currentTab.name === "Ranked Items") return currentRank > 0;
          return true;
        })
        .sort((a, b) => (b.currentRank || 0) - (a.currentRank || 0))
    : []; // Sort in descending order

  console.log("displayedItems: ", displayedItems);
  return (
    <div className="flex items-center justify-center ">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          defaultValue={tabs.find((tab) => tab.current)?.name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>

      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href="#"
                onClick={() => handleClick(tab.name)}
                className={classNames(
                  tab.current
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                  "flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.name}
                {tab.count ? (
                  <span
                    className={classNames(
                      tab.current
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-900",
                      "ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block"
                    )}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </a>
            ))}
          </nav>

          {displayedItems.map((item) => (
            <div key={item.id}>
              <h2>{item.title}</h2>
              {/* Add more details here */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
