import Link from "next/link";
import Layout from "../src/components/Layout";
import Protected from "../src/hoc/Protected";

const AboutPage = () => (
  <Layout>
    <h1>About</h1>
    <p>This is the about page</p>
    <p>
      <Link href="/">Go home</Link>
    </p>
  </Layout>
);

export default Protected(AboutPage);
