// app/routes/index.jsx
import Layout from '../components/Layout';
import type { MetaFunction } from "@remix-run/node";


export const meta: MetaFunction = () => {
  return [
    { title: "FitTracker App" },
    { name: "description", content: "Welcome to FitTracker!" },
  ];
};

export default function Index() {
  return (
    <Layout>
      <div>
        <h1>Welcome to FitTracker</h1>
        <p>Track your fitness journey effortlessly.</p>
      </div>
    </Layout>
  );
}
