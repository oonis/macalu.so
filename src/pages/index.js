import React from 'react';
import Layout from '@components/Layout';
import SEO from '@components/seo';
import NameBar from '@components/NameBar';

const IndexPage = ({ data }) => (
  <Layout showHome={false}>
    <SEO
      title="Sam Macaluso"
      keywords={[`developer`, `engineer`]}
    />
    < NameBar />
  </Layout>
);

export default IndexPage;
