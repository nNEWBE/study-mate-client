import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FaChevronRight } from "react-icons/fa";
import Reveal from "../../../animation/Reveal"

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
            <motion.a
              className="group flex w-fit cursor-pointer items-center text-xs leading-5 text-gray-500 duration-300 hover:text-[#00ffa5] sm:text-sm sm:leading-6"
              href={link.link}
              initial="initial"
              whileHover="hovered"
            >
              <motion.span
                variants={{
                  initial: { width: 0, opacity: 0, x: -10 },
                  hovered: { width: "auto", opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center overflow-hidden"
              >
                <FaChevronRight className="mr-1 text-[#00ffa5]" />
              </motion.span>
              <span>{link.name}</span>
            </motion.a>
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
