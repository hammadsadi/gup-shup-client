import { Helmet } from "react-helmet";

const PageHeader = ({ hTitle, hLink }: { hTitle: string; hLink?: string }) => {
  const metaLink = hLink || "http://localhost:5173/";
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{hTitle}</title>
        <link rel="canonical" href={metaLink} />
      </Helmet>
    </>
  );
};

export default PageHeader;
