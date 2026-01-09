import PropTypes from "prop-types";
import Reveal from "../animation/Reveal"

interface LinkItem {
  name: string;
  link: string;
}

interface ItemProps {
  Links: LinkItem[];
  title: string;
}

const Item = ({ Links, title }: ItemProps) => {
  return (
    <ul className="space-y-1">
      <Reveal>
        <h1 className="mb-2 font-dosis text-lg font-semibold text-secondary dark:text-white sm:text-2xl">
          {title}
          <span className="text-xl font-extrabold text-primary sm:text-3xl">.</span>
        </h1>
      </Reveal>
      {Links.map((link) => (
        <li key={link.name} className="font-edu font-semibold">
          <Reveal>
            <a
              className="cursor-pointer text-xs leading-5 text-gray-500 duration-300 hover:text-[#00ffa5] sm:text-sm sm:leading-6"
              href={link.link}
            >
              {link.name}
            </a>
          </Reveal>
        </li>
      ))}
    </ul>
  );
};

export default Item;

Item.propTypes = {
  Links: PropTypes.array,
  title: PropTypes.string,
};
