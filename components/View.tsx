
import Ping from "@/components/Ping";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
// Removed import of unstable_after as it does not exist in next/server

const View = async ({ id }: { id: string }) => {
  const result = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });
  const totalViews = result?.views ?? 0; // Use 'views' property from the query result

  // Increment views after fetching
  await writeClient
    .patch(id)
    .set({ views: totalViews + 1 })
    .commit();

  console.log(`Updated views for ${id}: ${totalViews + 1}`); // Add this line
  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      <p className="view-text">
        <span className="font-black">Views: {totalViews}</span>
      </p>
    </div>
  );
};
export default View;