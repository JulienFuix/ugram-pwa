import Layout from "../src/components/Layout";
import Protected from "../src/hoc/Protected";

const ExplorePage = () => (
  <Layout>
    <div>
      <h1 className="bg-red-500">Hello explore Next.js 👋</h1>
    </div>
  </Layout>
);

export default Protected(ExplorePage);
