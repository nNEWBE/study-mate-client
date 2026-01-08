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
    <ul>
      <Reveal>
        <h1 className="mb-1 font-dosis text-2xl font-semibold text-secondary dark:text-white">
          {title}
          <span className="text-3xl font-extrabold text-primary">.</span>
        </h1>
      </Reveal>
      {Links.map((link) => (
        <li key={link.name} className="font-edu font-semibold">
          <Reveal>
            <a
              className="cursor-pointer text-sm leading-6 text-gray-500 duration-300 hover:text-[#00ffa5]"
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
