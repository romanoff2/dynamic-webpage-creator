import { createClient } from '@vercel/edge-config';

export async function getServerSideProps(context) {
  const { id } = context.params;
  const client = createClient(process.env.EDGE_CONFIG);
  const pageContent = await client.get(`page:${id}`);

  if (!pageContent) {
    return {
      notFound: true,
    };
  }

  return {
    props: { pageContent },
  };
}

export default function Page({ pageContent }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: pageContent }} />
  );
}
