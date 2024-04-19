import PropTypes from "prop-types";

import { default as material } from "@material-tailwind/react";
const { Typography } = material;

export function PageTitle({
  section,
  heading,
  children,
}: {
  section: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full px-4 text-center lg:w-6/12">
      <Typography variant="lead" className="font-semibold">
        {section}
      </Typography>
      <Typography variant="h2" color="blue-gray" className="my-3">
        {heading}
      </Typography>
      <Typography variant="lead" className="text-blue-gray-500">
        {children}
      </Typography>
    </div>
  );
}

PageTitle.propTypes = {
  section: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

PageTitle.displayName = "/src/widgets/layout/page-title.jsx";

export default PageTitle;
